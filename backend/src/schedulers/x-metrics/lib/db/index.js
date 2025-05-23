import { Pool } from 'pg';

let _pgPool;
function getPool() {
  if (
    !_pgPool ||
    (typeof _pgPool === 'object' &&
      (
        (_pgPool._ending) ||
        (_pgPool._closed)
      )
    )
  ) {
    _pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  return _pgPool;
}

let initialized = false;

async function initializeSchema() {
  if (initialized) return;
  console.log('[DB] Initializing schema...');
  try {
    // Create tables if they don't exist (PostgreSQL syntax)
    await getPool().query(`
      CREATE TABLE IF NOT EXISTS tweets (
        id SERIAL PRIMARY KEY,
        tweet_id TEXT UNIQUE NOT NULL,
        url TEXT NOT NULL,
        text TEXT NOT NULL,
        post_date TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tweet_metrics (
        id SERIAL PRIMARY KEY,
        tweet_id TEXT NOT NULL,
        likes INTEGER NOT NULL,
        retweets INTEGER NOT NULL,
        replies INTEGER NOT NULL,
        views INTEGER NOT NULL,
        quotes INTEGER NOT NULL,
        bookmarks INTEGER NOT NULL,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
      );

      CREATE TABLE IF NOT EXISTS engagement_metrics (
        id SERIAL PRIMARY KEY,
        date TEXT NOT NULL UNIQUE,
        impressions INTEGER NOT NULL,
        engagements INTEGER NOT NULL,
        followers INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_tweets_tweet_id ON tweets(tweet_id);
      CREATE INDEX IF NOT EXISTS idx_tweet_metrics_tweet_id ON tweet_metrics(tweet_id);
      CREATE INDEX IF NOT EXISTS idx_engagement_metrics_date ON engagement_metrics(date);
    `);
    console.log('[DB] Schema initialized successfully.');
    initialized = true;
  } catch (err) {
    console.error('[DB] Schema initialization failed:', err);
    throw err;
  }
}

async function getDb() {
  await initializeSchema();
  return getPool();
}

export { getDb, getPool };