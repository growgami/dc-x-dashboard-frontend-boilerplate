-- Discord Server Tracker Bot Database Schema
-- This file contains the complete database schema for the Discord tracking bot
-- The bot will automatically create these tables, but this file is provided
-- for manual setup or reference

-- Create database (run this separately as a superuser if needed)
-- CREATE DATABASE discord_tracker;

-- User counts table - stores daily snapshots of server member counts
CREATE TABLE IF NOT EXISTS user_counts (
    server_id VARCHAR NOT NULL,
    date DATE NOT NULL,
    user_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (server_id, date)
);

-- Message counts table - stores daily message counts per channel
CREATE TABLE IF NOT EXISTS message_counts (
    server_id VARCHAR NOT NULL,
    channel_id VARCHAR NOT NULL,
    date DATE NOT NULL,
    message_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (server_id, channel_id, date)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_counts_date ON user_counts(date);
CREATE INDEX IF NOT EXISTS idx_user_counts_server_date ON user_counts(server_id, date);

CREATE INDEX IF NOT EXISTS idx_message_counts_date ON message_counts(date);
CREATE INDEX IF NOT EXISTS idx_message_counts_server_date ON message_counts(server_id, date);
CREATE INDEX IF NOT EXISTS idx_message_counts_channel_date ON message_counts(channel_id, date);
CREATE INDEX IF NOT EXISTS idx_message_counts_server_channel_date ON message_counts(server_id, channel_id, date);

-- Comments for documentation
COMMENT ON TABLE user_counts IS 'Daily snapshots of Discord server member counts';
COMMENT ON COLUMN user_counts.server_id IS 'Discord server (guild) ID';
COMMENT ON COLUMN user_counts.date IS 'Date of the snapshot (YYYY-MM-DD)';
COMMENT ON COLUMN user_counts.user_count IS 'Number of members in the server on this date';

COMMENT ON TABLE message_counts IS 'Daily message counts per channel per server';
COMMENT ON COLUMN message_counts.server_id IS 'Discord server (guild) ID';
COMMENT ON COLUMN message_counts.channel_id IS 'Discord channel ID';
COMMENT ON COLUMN message_counts.date IS 'Date of the message count (YYYY-MM-DD)';
COMMENT ON COLUMN message_counts.message_count IS 'Number of messages sent in this channel on this date';

-- Example queries for reference:

-- Get user count history for a specific server
-- SELECT * FROM user_counts WHERE server_id = '123456789012345678' ORDER BY date DESC;

-- Get message counts for a specific channel over the last 30 days
-- SELECT * FROM message_counts 
-- WHERE channel_id = '987654321098765432' 
-- AND date >= CURRENT_DATE - INTERVAL '30 days'
-- ORDER BY date DESC;

-- Get total messages per server for a specific date
-- SELECT server_id, SUM(message_count) as total_messages
-- FROM message_counts 
-- WHERE date = '2024-01-01'
-- GROUP BY server_id;

-- Get average daily message count per channel over the last week
-- SELECT server_id, channel_id, AVG(message_count) as avg_daily_messages
-- FROM message_counts 
-- WHERE date >= CURRENT_DATE - INTERVAL '7 days'
-- GROUP BY server_id, channel_id
-- ORDER BY avg_daily_messages DESC; 