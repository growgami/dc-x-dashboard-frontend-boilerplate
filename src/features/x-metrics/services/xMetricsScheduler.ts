// Scheduler startup log
console.log("[xMetricsScheduler] Scheduler process started and waiting for scheduled jobs.");

// Log the current time every hour for monitoring, and show time remaining before next scheduled job
function getMsUntilNextMidnightUTC() {
  const now = new Date();
  const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
  return nextMidnight.getTime() - now.getTime();
}

setInterval(() => {
  const now = new Date();
  const msUntil = getMsUntilNextMidnightUTC();
  const hours = Math.floor(msUntil / (1000 * 60 * 60));
  const minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((msUntil % (1000 * 60)) / 1000);
  console.log(`[xMetricsScheduler] Heartbeat: ${now.toISOString()}`);
  console.log(`[xMetricsScheduler] Time remaining before scheduled job: ${hours}h ${minutes}m ${seconds}s`);
}, 60 * 60 * 1000); // every hour

// Also print time remaining immediately on startup
{
  const msUntil = getMsUntilNextMidnightUTC();
  const hours = Math.floor(msUntil / (1000 * 60 * 60));
  const minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((msUntil % (1000 * 60)) / 1000);
  console.log(`[xMetricsScheduler] Time remaining before scheduled job: ${hours}h ${minutes}m ${seconds}s`);
}

// Scheduler for daily X (Twitter) metrics aggregation at 12am
import * as schedule from "node-schedule";

// Dynamic import helpers for ESM modules
async function getFetchTwitterListMetrics() {
  const mod = await import("./sub/xApiClient.js");
  return mod.fetchTwitterListMetrics;
}
async function getUpsertTweetAndMetrics() {
  const mod = await import("./sub/xMetricsDb.js");
  return mod.upsertTweetAndMetrics;
}
async function getAggregateEngagementMetrics() {
  const mod = await import("./sub/xMetricsAggregator.js");
  return mod.aggregateEngagementMetrics;
}

// Helper: Get UNIX timestamps for previous day (00:00:00 to 23:59:59 UTC)
function getPreviousDayTimestamps() {
  const now = new Date();
  // Set to 00:00:00 today
  now.setUTCHours(0, 0, 0, 0);
  // Previous day start
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sinceTime = Math.floor(start.getTime() / 1000); // seconds
  const untilTime = Math.floor(now.getTime() / 1000) - 1; // seconds, end of previous day
  return { sinceTime, untilTime, dateString: start.toISOString().slice(0, 10) };
}

// Main scheduled job: runs every day at 12am UTC
schedule.scheduleJob("0 0 * * *", async () => {
  try {
    const { sinceTime, untilTime, dateString } = getPreviousDayTimestamps();
    console.log(`[xMetricsScheduler] Running daily job for ${dateString} (${sinceTime} - ${untilTime})`);

    // 1. Fetch tweets from previous day
    const fetchTwitterListMetrics = await getFetchTwitterListMetrics();
    const upsertTweetAndMetrics = await getUpsertTweetAndMetrics();
    const aggregateEngagementMetrics = await getAggregateEngagementMetrics();

    const tweets = await fetchTwitterListMetrics(sinceTime, untilTime);

    // 2. Store each tweet and its metrics in the DB
    for (const tweet of tweets) {
      // Compose XPostData structure
      const postData = {
        text: tweet.text,
        postDate: dateString,
        likes: tweet.public_metrics?.likes ?? 0,
        retweets: tweet.public_metrics?.retweets ?? 0,
        replies: tweet.public_metrics?.replies ?? 0,
        views: tweet.public_metrics?.impressions ?? 0,
        quotes: tweet.public_metrics?.quotes ?? 0,
        bookmarks: tweet.public_metrics?.bookmarks ?? 0,
        followers: tweet.public_metrics?.followers ?? 0,
      };
      // Compose a fake URL for extractTweetId (if needed)
      const url = `https://twitter.com/i/web/status/${tweet.id}`;
      await upsertTweetAndMetrics(url, postData);
    }

    // 3. Aggregate engagement metrics for the day
    const aggResult = await aggregateEngagementMetrics();
    console.log(`[xMetricsScheduler] Aggregation complete:`, aggResult);

  } catch (err) {
    console.error("[xMetricsScheduler] Error in scheduled job:", err);
  }
});

export {};