import { getDb } from '@/lib/db';
import type { EngagementMetrics } from '@/lib/db/schema';

export type TimeRange = '7d' | '14d' | '30d' | 'all';

function isFiniteTimeRange(range: TimeRange): range is Exclude<TimeRange, 'all'> {
  return range !== 'all';
}

export type XMetricsAggregatedRow = {
  impressions: number;
  engagements: number;
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

    const metrics = await db.all(query, params);
    return metrics;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return [];
  }
}

// Get daily aggregated metrics for a time range
export async function getDailyMetrics(
  timeRangeParam: TimeRange = '7d',
  grouping: 'day' | 'week' | 'month' = 'day'
): Promise<XMetricsAggregatedRow[]> {
  const timeRange: TimeRange = timeRangeParam;
  // Only allow 'week' or 'month' grouping for the past 7 days; otherwise, force 'day'
  if (timeRange !== '7d') {
    grouping = 'day';
  }
  const db = await getDb();

  try {
    let selectClause = '';
    let groupByClause = '';

    if (grouping === 'week') {
      // Group by year-week
      selectClause = `
        strftime('%Y', date) as year,
        strftime('%W', date) as week,
        MIN(date) as start_date,
        MAX(date) as end_date,
        SUM(impressions) as impressions,
        SUM(engagements) as engagements
      `;
      groupByClause = 'GROUP BY year, week ORDER BY year ASC, week ASC';
    } else if (grouping === 'month') {
      // Group by year-month
      selectClause = `
        strftime('%Y', date) as year,
        strftime('%m', date) as month,
        MIN(date) as start_date,
        MAX(date) as end_date,
        SUM(impressions) as impressions,
        SUM(engagements) as engagements
      `;
      groupByClause = 'GROUP BY year, month ORDER BY year ASC, month ASC';
    } else {
      // Default: group by day
      selectClause = `
        date,
        SUM(impressions) as impressions,
        SUM(engagements) as engagements
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
      if (isFiniteTimeRange(timeRange)) {
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

    const metrics = await db.all(query, params);

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
