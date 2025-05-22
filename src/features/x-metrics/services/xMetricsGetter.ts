import { getDb } from '@/lib/db';
import type { EngagementMetrics } from '@/lib/db/schema';
export interface XPostData {
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  quotes: number;
  bookmarks: number;
  followers: number;
  postDate: string;
  text: string;
}

function extractTweetId(url: string): string {
  const matches = url.match(/\/status\/(\d+)/);
  return matches ? matches[1] : '';
}


/**
 * Store X (Twitter) post data and metrics in the database.
 * Returns { success, message, updated }
 */
export async function storeXPostData(
  url: string,
  postData: XPostData
): Promise<{ success: boolean; message?: string; updated?: boolean }> {
  try {
    const db = await getDb();
    const tweetId = extractTweetId(url);

    if (!tweetId) {
      return { success: false, message: 'Could not extract tweet ID from URL' };
    }

    // Start a transaction
    await db.query('BEGIN');

    try {
      // Check if tweet exists
      const { rows } = await db.query('SELECT tweet_id FROM tweets WHERE tweet_id = $1', [tweetId]);
      const existingTweet = rows[0];

      if (!existingTweet) {
        // Insert new tweet
        await db.query(
          'INSERT INTO tweets (tweet_id, url, text, post_date) VALUES ($1, $2, $3, $4)',
          [tweetId, url, postData.text, postData.postDate]
        );
      }

      // Insert metrics
      await db.query(
        'INSERT INTO tweet_metrics (tweet_id, likes, retweets, replies, views, quotes, bookmarks, followers, collected_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          tweetId,
          postData.likes,
          postData.retweets,
          postData.replies,
          postData.views,
          postData.quotes,
          postData.bookmarks,
          postData.followers,
          new Date().toISOString(),
        ]
      );

      // No longer insert into engagement_metrics here.
      // Aggregation should be handled elsewhere, not per-tweet.

      // Commit transaction
      await db.query('COMMIT');

      return {
        success: true,
        message: existingTweet ? 'Tweet metrics updated' : 'New tweet metrics stored',
        updated: true,
      };
    } catch (error) {
      // Rollback on error
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error storing X post data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to store X post data',
    };
  }
}

export type TimeRange = '7d' | '14d' | '30d' | 'all';

function isFiniteTimeRange(range: TimeRange): range is Exclude<TimeRange, 'all'> {
  return range !== 'all';
}

export type XMetricsAggregatedRow = {
  impressions: number;
  engagements: number;
  followers: number;
  date?: string;
  year?: string;
  week?: string;
  month?: string;
  start_date?: string;
  end_date?: string;
  label?: string;
};

type SQLParam = string | number;

export async function getMetricsByTimeRange(timeRangeParam: TimeRange = '7d'): Promise<EngagementMetrics[]> {
  const timeRange: TimeRange = timeRangeParam;
  const db = await getDb();

  try {
    let query = `
      SELECT 
        id,
        tweet_id,
        date,
        impressions,
        engagements,
        created_at
      FROM engagement_metrics
    `;

    const params: SQLParam[] = [];
    if (timeRange !== 'all') {
      let days: number | null = null;
      if (isFiniteTimeRange(timeRange)) {
        days = parseInt(timeRange, 10);
      }
      if (days !== null && !isNaN(days)) {
        query += ' WHERE date >= date(?, ?)';
        params.push('now', `-${days} days`);
      }
    }

    query += ' ORDER BY date ASC';

    const { rows: metrics } = await db.query(query, params);
    return metrics;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
}

// Get daily aggregated metrics for a time range
export async function getDailyMetrics(
  timeRangeParam: string = '7d',
  grouping: 'day' | 'week' | 'month' = 'day'
): Promise<XMetricsAggregatedRow[]> {
  const timeRange = timeRangeParam;
  // Allow grouping by 'day', 'week', or 'month' for any timeRange.
  // (Removed logic that forced grouping to 'day' for non-7d time ranges)
  const db = await getDb();

  try {
    let selectClause = '';
    let groupByClause = '';

    if (grouping === 'week') {
      // Group by year-week
      selectClause = `
        EXTRACT(YEAR FROM CAST(date AS date)) AS year,
        TO_CHAR(CAST(date AS date), 'IW') AS week,
        MIN(CAST(date AS date)) AS start_date,
        MAX(CAST(date AS date)) AS end_date,
        SUM(impressions) AS impressions,
        SUM(engagements) AS engagements,
        SUM(followers) AS followers
      `;
      groupByClause = 'GROUP BY year, week ORDER BY year ASC, week ASC';
    } else if (grouping === 'month') {
      // Group by year-month
      selectClause = `
        EXTRACT(YEAR FROM CAST(date AS date)) AS year,
        TO_CHAR(CAST(date AS date), 'MM') AS month,
        MIN(CAST(date AS date)) AS start_date,
        MAX(CAST(date AS date)) AS end_date,
        SUM(impressions) AS impressions,
        SUM(engagements) AS engagements,
        SUM(followers) AS followers
      `;
      groupByClause = 'GROUP BY year, month ORDER BY year ASC, month ASC';
    } else {
      // Default: group by day
      selectClause = `
        CAST(date AS date) as date,
        SUM(impressions) as impressions,
        SUM(engagements) as engagements,
        SUM(followers) as followers
      `;
      groupByClause = 'GROUP BY date ORDER BY date ASC';
    }

    let query = `
      SELECT
        ${selectClause}
      FROM engagement_metrics
    `;

    const params: SQLParam[] = [];
    if (timeRange !== 'all') {
      let days: number | null = null;
      // Only handle numeric time ranges like '7d', '14d', '30d'
      if (/^\d+d$/.test(timeRange)) {
        days = parseInt(timeRange, 10);
      }
      if (days !== null && !isNaN(days)) {
        // Only include the most recent N unique dates in the data
        query += ` WHERE date IN (
          SELECT date FROM engagement_metrics
          GROUP BY date
          ORDER BY date DESC
          LIMIT ${days}
        )`;
      }
    }

    query += ` ${groupByClause}`;

    const { rows: metrics } = await db.query(query, params);

    // Add a label field for frontend display
    return metrics.map((row: XMetricsAggregatedRow) => ({
      ...row,
      label: grouping === 'day'
        ? row.date
        : (grouping === 'week'
            ? `${row.year}-W${row.week} (${row.start_date} to ${row.end_date})`
            : `${row.year}-${row.month} (${row.start_date} to ${row.end_date})`)
    }));
  } catch (error) {
    console.error('Error fetching daily metrics:', error);
    return [];
  }
}

import fetch from 'node-fetch';

export type TwitterListTweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    impressions: number;
    engagements: number;
    [key: string]: number;
  };
  // Add more fields as needed based on actual API response
};

export type TwitterListApiResponse = {
  data: TwitterListTweet[];
  meta?: Record<string, unknown>;
  error?: string;
};

export async function fetchTwitterListMetrics(
  sinceTime: number,
  untilTime: number
): Promise<TwitterListTweet[]> {
  const url = `https://api.twitterapi.io/twitter/list/tweets?listId=1925252393136267285&sinceTime=${sinceTime}&untilTime=${untilTime}`;
  const headers = {
    'X-API-Key': '2a306a7bd2b24c579a03afe1e6817309',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Twitter List API error: ${response.status} ${response.statusText} - ${text}`);
    }
    const json = (await response.json()) as TwitterListApiResponse;
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid Twitter List API response: missing or malformed "data" field');
    }
    return json.data;
  } catch (error) {
    console.error('Failed to fetch Twitter List metrics:', error);
    throw error;
  }
}
