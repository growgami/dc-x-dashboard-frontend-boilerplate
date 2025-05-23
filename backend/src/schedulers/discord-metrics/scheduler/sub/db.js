const { Pool } = require('pg');
require('dotenv').config();

let pool;

async function initDB() {
  try {
    pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE || 'discord_tracker',
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      max: process.env.PGMAXCLIENTS || 10,
      idleTimeoutMillis: process.env.PGIDLETIMEOUTMILLIS || 30000,
    });

    // Test the connection
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');

    // Create tables if they don't exist
    await createTables();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

async function createTables() {
  const createUserCountsTable = `
    CREATE TABLE IF NOT EXISTS user_counts (
      server_id VARCHAR NOT NULL,
      date DATE NOT NULL,
      user_count INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (server_id, date)
    );
  `;

  const createMessageCountsTable = `
    CREATE TABLE IF NOT EXISTS message_counts (
      server_id VARCHAR NOT NULL,
      channel_id VARCHAR NOT NULL,
      date DATE NOT NULL,
      message_count INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (server_id, channel_id, date)
    );
  `;

  try {
    await pool.query(createUserCountsTable);
    await pool.query(createMessageCountsTable);
    console.log('Database tables created/verified successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function upsertMessageCount(serverId, channelId, date, count) {
  const query = `
    INSERT INTO message_counts (server_id, channel_id, date, message_count, updated_at)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    ON CONFLICT (server_id, channel_id, date)
    DO UPDATE SET 
      message_count = message_counts.message_count + EXCLUDED.message_count,
      updated_at = CURRENT_TIMESTAMP
    RETURNING message_count;
  `;

  try {
    const result = await pool.query(query, [serverId, channelId, date, count]);
    return result.rows[0];
  } catch (error) {
    console.error('Error upserting message count:', error);
    throw error;
  }
}

async function upsertUserCount(serverId, date, count) {
  const query = `
    INSERT INTO user_counts (server_id, date, user_count)
    VALUES ($1, $2, $3)
    ON CONFLICT (server_id, date)
    DO UPDATE SET 
      user_count = EXCLUDED.user_count
    RETURNING user_count;
  `;

  try {
    const result = await pool.query(query, [serverId, date, count]);
    console.log(`User count updated for server ${serverId} on ${date}: ${count} members`);
    return result.rows[0];
  } catch (error) {
    console.error('Error upserting user count:', error);
    throw error;
  }
}

async function getMessageCounts(serverId, channelId = null, startDate = null, endDate = null) {
  let query = 'SELECT * FROM message_counts WHERE server_id = $1';
  const params = [serverId];
  let paramCount = 1;

  if (channelId) {
    paramCount++;
    query += ` AND channel_id = $${paramCount}`;
    params.push(channelId);
  }

  if (startDate) {
    paramCount++;
    query += ` AND date >= $${paramCount}`;
    params.push(startDate);
  }

  if (endDate) {
    paramCount++;
    query += ` AND date <= $${paramCount}`;
    params.push(endDate);
  }

  query += ' ORDER BY date DESC';

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting message counts:', error);
    throw error;
  }
}

async function getUserCounts(serverId, startDate = null, endDate = null) {
  let query = 'SELECT * FROM user_counts WHERE server_id = $1';
  const params = [serverId];
  let paramCount = 1;

  if (startDate) {
    paramCount++;
    query += ` AND date >= $${paramCount}`;
    params.push(startDate);
  }

  if (endDate) {
    paramCount++;
    query += ` AND date <= $${paramCount}`;
    params.push(endDate);
  }

  query += ' ORDER BY date DESC';

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting user counts:', error);
    throw error;
  }
}

async function closeDB() {
  if (pool) {
    await pool.end();
    console.log('Database connection closed');
  }
}

module.exports = {
  initDB,
  upsertMessageCount,
  upsertUserCount,
  getMessageCounts,
  getUserCounts,
  closeDB,
}; 