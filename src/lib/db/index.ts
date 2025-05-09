import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDb() {
  if (db) return db;

  // Open the database
  db = await open({
    filename: path.join(process.cwd(), 'data', 'x-metrics.db'),
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await db.run('PRAGMA foreign_keys = ON');

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tweet_id TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      text TEXT NOT NULL,
      post_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tweet_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tweet_id TEXT NOT NULL,
      likes INTEGER NOT NULL,
      retweets INTEGER NOT NULL,
      replies INTEGER NOT NULL,
      views INTEGER NOT NULL,
      quotes INTEGER NOT NULL,
      bookmarks INTEGER NOT NULL,
      collected_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
    );

    CREATE TABLE IF NOT EXISTS engagement_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tweet_id TEXT NOT NULL,
      date TEXT NOT NULL,
      impressions INTEGER NOT NULL,
      engagements INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_tweets_tweet_id ON tweets(tweet_id);
    CREATE INDEX IF NOT EXISTS idx_tweet_metrics_tweet_id ON tweet_metrics(tweet_id);
    CREATE INDEX IF NOT EXISTS idx_engagement_metrics_tweet_id ON engagement_metrics(tweet_id);
    CREATE INDEX IF NOT EXISTS idx_engagement_metrics_date ON engagement_metrics(date);
  `);

  return db;
}

// Helper to ensure we close the database connection when the app shuts down
process.on('SIGTERM', async () => {
  if (db) await db.close();
});

process.on('SIGINT', async () => {
  if (db) await db.close();
}); 