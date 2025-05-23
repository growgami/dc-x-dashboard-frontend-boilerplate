import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}
function getPool(): Pool {
  if (
    !global._pgPool ||
    (typeof global._pgPool === 'object' &&
      (
        (Object.prototype.hasOwnProperty.call(global._pgPool, '_ending') && (global._pgPool as unknown as { _ending?: boolean })._ending) ||
        (Object.prototype.hasOwnProperty.call(global._pgPool, '_closed') && (global._pgPool as unknown as { _closed?: boolean })._closed)
      )
    )
  ) {
    global._pgPool = new Pool({
      connectionString: process.env.POSTGRES_URL,
    });
  }
  return global._pgPool as Pool;
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

// Only end the pool in production on shutdown
if (process.env.NODE_ENV === 'production') {
  let signalHandlersRegistered = false;
  if (!signalHandlersRegistered) {
    process.on('SIGTERM', async () => {
      try {
        if (global._pgPool) await global._pgPool.end();
        console.log('[DB] Pool ended gracefully on SIGTERM');
      } catch (err) {
        console.error('[DB] Error ending pool on SIGTERM:', err);
      }
    });
    process.on('SIGINT', async () => {
      try {
        if (global._pgPool) await global._pgPool.end();
        console.log('[DB] Pool ended gracefully on SIGINT');
      } catch (err) {
        console.error('[DB] Error ending pool on SIGINT:', err);
      }
    });
    signalHandlersRegistered = true;
  }
}

export async function getDb() {
  await initializeSchema();
  return getPool();
}

export { getPool as pool };