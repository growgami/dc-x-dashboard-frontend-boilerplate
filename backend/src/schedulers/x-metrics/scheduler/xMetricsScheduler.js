import schedule from 'node-schedule';
import { getDb } from '../lib/db/index.js';
import { fetchTwitterListMetrics } from './sub/xApiClient.js';
import { upsertTweetAndMetrics } from './sub/xMetricsDb.js';
import { aggregateEngagementMetrics } from './sub/xMetricsAggregator.js';

// Helper: Get UNIX timestamps for previous day (00:00:00 to 23:59:59 UTC)
function getPreviousDayTimestamps() {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sinceTime = Math.floor(start.getTime() / 1000);
  const untilTime = Math.floor(now.getTime() / 1000) - 1;
  return { sinceTime, untilTime, dateString: start.toISOString().slice(0, 10) };
}

// Main scheduled job: runs every day at 12am UTC
schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await getDb(); // Ensure DB schema is initialized
    const { sinceTime, untilTime, dateString } = getPreviousDayTimestamps();
    console.log(`[xMetricsScheduler] Running daily job for ${dateString} (${sinceTime} - ${untilTime})`);

    // 1. Fetch tweets from previous day
    const tweets = await fetchTwitterListMetrics(sinceTime, untilTime);

    // 2. Store each tweet and its metrics in the DB
    for (const tweet of tweets) {
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
      const url = `https://twitter.com/i/web/status/${tweet.id}`;
      await upsertTweetAndMetrics(url, postData);
    }

    // 3. Aggregate engagement metrics for the day
    const aggResult = await aggregateEngagementMetrics();
    console.log(`[xMetricsScheduler] Aggregation complete:`, aggResult);

  } catch (err) {
    console.error('[xMetricsScheduler] Error in scheduled job:', err);
  }
});

console.log('[xMetricsScheduler] Scheduler process started and waiting for scheduled jobs.');