/**
 * Migration script: Inserts 30 days of X metrics mock data into the database, then triggers aggregation.
 *
 * Usage (if you see "Unknown file extension .ts" error, use the loader flag):
 *   npx ts-node --loader ts-node/esm src/data/mock/x-metrics/x-mock.ts
 *
 * Ensure POSTGRES_URL is set in your environment.
 */

import { getDb } from "../../../lib/db/index";
import { aggregateEngagementMetrics } from "../../../features/x-metrics/services/sub/xMetricsAggregator";

export async function seedXMockData() {
  const db = await getDb();
  console.log("[x-mock] Starting mock data seeding...");

  // Store daily aggregates for engagement_metrics
  const dailyAggregates: {
    date: string;
    impressions: number;
    engagements: number;
    followers: number;
  }[] = [];

  for (let i = 0; i < 30; i++) {
    // Most recent day = i=0, oldest = i=29
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - (29 - i));
    const dayISO = dateObj.toISOString().slice(0, 10);

    // Generate unique tweet_id (simulate Twitter snowflake or use UUID)
    const tweet_id = `mock-tweet-${dayISO.replace(/-/g, "")}`;
    const url = `https://twitter.com/mockuser/status/${tweet_id}`;
    const text = `Mock tweet for ${dayISO}`;
    const post_date = dayISO;

    // Generate metrics
    const followers = 1000 + i * 10 + Math.floor(Math.random() * 20);
    const likes = 50 + i * 2 + Math.floor(Math.random() * 10);
    const retweets = 20 + i + Math.floor(Math.random() * 5);
    const replies = 5 + Math.floor(Math.random() * 3);
    const views = 1000 + i * 30 + Math.floor(Math.random() * 100);
    const quotes = 2 + Math.floor(Math.random() * 2);
    const bookmarks = 3 + Math.floor(Math.random() * 2);
    const collected_at = new Date().toISOString();

    // Insert into tweets
    await db.query(
      `INSERT INTO tweets (tweet_id, url, text, post_date)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (tweet_id) DO NOTHING`,
      [tweet_id, url, text, post_date]
    );

    // Insert into tweet_metrics
    await db.query(
      `INSERT INTO tweet_metrics
        (tweet_id, likes, retweets, replies, views, quotes, bookmarks, followers, collected_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [tweet_id, likes, retweets, replies, views, quotes, bookmarks, followers, collected_at]
    );

    // For aggregation: impressions = views, engagements = likes+retweets+replies+quotes+bookmarks
    dailyAggregates.push({
      date: dayISO,
      impressions: views,
      engagements: likes + retweets + replies + quotes + bookmarks,
      followers: followers,
    });

    console.log(`[x-mock] [${i + 1}/30] Inserted data for ${dayISO} (tweet_id: ${tweet_id})`);
  }

  console.log("[x-mock] Mock data insertion complete. Now running aggregation...");

  // Trigger aggregation
  await aggregateEngagementMetrics();

  console.log("[x-mock] All done: mock data and daily engagement metrics aggregated.");
  return { success: true, message: "Mock data seeded and aggregated." };
}

if (require.main === module) {
  seedXMockData().catch((err) => {
    console.error("[x-mock] Migration failed:", err);
    process.exit(1);
  });
}