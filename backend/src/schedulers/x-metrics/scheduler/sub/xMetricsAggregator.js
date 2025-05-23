import { getDb } from '../../lib/db/index.js';

/**
 * Aggregates tweet_metrics into daily engagement_metrics.
 * For each day, sums:
 *   - impressions (views)
 *   - engagements (likes + retweets + replies + quotes + bookmarks)
 *   - followers (latest value per day)
 * and inserts/updates one row per day in engagement_metrics.
 *
 * Returns a summary of the aggregation.
 */
async function aggregateEngagementMetrics() {
  const db = await getDb();

  // Get all unique post_dates from tweets
  const { rows: dates } = await db.query(`
    SELECT DISTINCT post_date FROM tweets ORDER BY post_date ASC
  `);

  const upserts = [];

  for (const { post_date } of dates) {
    // Get all tweet_metrics for this day
    const { rows: metrics } = await db.query(
      `
      SELECT likes, retweets, replies, views, quotes, bookmarks, followers
      FROM tweet_metrics
      JOIN tweets ON tweet_metrics.tweet_id = tweets.tweet_id
      WHERE tweets.post_date = $1
      `,
      [post_date]
    );

    if (metrics.length === 0) continue;

    // Aggregate
    let impressions = 0;
    let engagements = 0;
    let followers = 0;

    for (const m of metrics) {
      impressions += m.views;
      engagements += m.likes + m.retweets + m.replies + m.quotes + m.bookmarks;
      if (m.followers > followers) followers = m.followers; // Use max followers for the day
    }

    // Upsert into engagement_metrics
    await db.query(
      `
      INSERT INTO engagement_metrics (date, impressions, engagements, followers)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (date) DO UPDATE
        SET impressions = EXCLUDED.impressions,
            engagements = EXCLUDED.engagements,
            followers = EXCLUDED.followers
      `,
      [post_date, impressions, engagements, followers]
    );

    upserts.push({
      date: post_date,
      impressions,
      engagements,
      followers,
    });
  }

  return {
    daysProcessed: upserts.length,
    upserts,
  };
}

export { aggregateEngagementMetrics };