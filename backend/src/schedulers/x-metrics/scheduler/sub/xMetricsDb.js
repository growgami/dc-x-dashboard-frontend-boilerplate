import { getDb } from '../../lib/db/index.js';

/**
 * Extracts the tweet ID from a Twitter status URL.
 */
function extractTweetId(url) {
  const matches = url.match(/\/status\/(\d+)/);
  return matches ? matches[1] : '';
}

/**
 * Inserts or updates a tweet and its metrics in the database.
 */
async function upsertTweetAndMetrics(url, postData) {
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

export { upsertTweetAndMetrics };