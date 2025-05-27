import { getDb } from "../../../../lib/db/index";
import type { EngagementMetrics } from "../../../../lib/db/schema";
import type {
  XPostData,
  TimeRange,
  XMetricsAggregatedRow
} from "../../types/xMetricsTypes";

/**
 * Extracts the tweet ID from a Twitter status URL.
 */
export function extractTweetId(url: string): string {
  const matches = url.match(/\/status\/(\d+)/);
  return matches ? matches[1] : '';
}

type SQLParam = string | number;

/**
 * Inserts or updates a tweet and its metrics in the database.
 */
export async function upsertTweetAndMetrics(
  url: string,
  postData: XPostData
): Promise<{ success: boolean; message?: string; updated?: boolean }> {
  const db = await getDb();
  const tweetId = extractTweetId(url);

  if (!tweetId) {
    return { success: false, message: 'Could not extract tweet ID from URL' };
  }

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

    await db.query('COMMIT');
    return {
      success: true,
      message: existingTweet ? 'Tweet metrics updated' : 'New tweet metrics stored',
      updated: true,
    };
  } catch (error) {
    await db.query('ROLLBACK');
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to store X post data',
    };
  }
}

/**
 * Fetches engagement metrics for a given time range.
 */
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
      days = parseInt(timeRange, 10);
      if (!isNaN(days)) {
        query += ' WHERE date >= date(?, ?)';
        params.push('now', `-${days} days`);
      }
    }

    query += ' ORDER BY date ASC';

    const { rows: metrics } = await db.query(query, params);
    return metrics;
  } catch {
    return [];
  }
}

/**
 * Fetches daily/weekly/monthly aggregated metrics for a time range.
 */
export async function getDailyMetrics(
  timeRangeParam: string = '7d',
  grouping: 'day' | 'week' | 'month' = 'day'
): Promise<XMetricsAggregatedRow[]> {
  const timeRange = timeRangeParam;
  const db = await getDb();

  try {
    let selectClause = '';
    let groupByClause = '';

    if (grouping === 'week') {
      selectClause = `
        EXTRACT(YEAR FROM CAST(date AS date)) AS year,
        TO_CHAR(CAST(date AS date), 'IW') AS week,
        MIN(CAST(date AS date)) AS start_date,
        MAX(CAST(date AS date)) AS end_date,
        SUM(impressions) AS impressions,
        SUM(engagements) AS engagements,
        MAX(followers) AS followers
      `;
      groupByClause = 'GROUP BY year, week ORDER BY year ASC, week ASC';
    } else if (grouping === 'month') {
      selectClause = `
        EXTRACT(YEAR FROM CAST(date AS date)) AS year,
        TO_CHAR(CAST(date AS date), 'MM') AS month,
        MIN(CAST(date AS date)) AS start_date,
        MAX(CAST(date AS date)) AS end_date,
        SUM(impressions) AS impressions,
        SUM(engagements) AS engagements,
        MAX(followers) AS followers
      `;
      groupByClause = 'GROUP BY year, month ORDER BY year ASC, month ASC';
    } else {
      selectClause = `
        CAST(date AS date) as date,
        SUM(impressions) as impressions,
        SUM(engagements) as engagements,
        MAX(followers) as followers
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
      if (/^\d+d$/.test(timeRange)) {
        days = parseInt(timeRange, 10);
      }
      if (days !== null && !isNaN(days)) {
        // Get the last N consecutive days starting from the most recent date
        // Use a simpler approach that works with TEXT dates in YYYY-MM-DD format
        query += ` WHERE date >= (
          SELECT date FROM engagement_metrics 
          ORDER BY date DESC 
          OFFSET ${days - 1} LIMIT 1
        )`;
      }
    }

    query += ` ${groupByClause}`;

    const { rows: metrics } = await db.query(query, params);

    return metrics.map((row: XMetricsAggregatedRow) => ({
      ...row,
      label: grouping === 'day'
        ? row.date
        : (grouping === 'week'
            ? `${row.year}-W${row.week} (${row.start_date} to ${row.end_date})`
            : `${row.year}-${row.month} (${row.start_date} to ${row.end_date})`)
    }));
  } catch {
    return [];
  }
}