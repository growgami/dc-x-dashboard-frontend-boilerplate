# Discord Server Tracker Bot

A Discord bot that tracks daily user counts and message counts per server, designed to be used as a module from a backend server with PostgreSQL persistence.

## Features

- **Daily User Count Tracking**: Snapshots `guild.memberCount` once per day at a configured UTC hour
- **Message Count Tracking**: Tracks messages live via `messageCreate` event for specific channels
- **PostgreSQL Integration**: Persists all data to PostgreSQL with UPSERT operations
- **Configurable**: JSON configuration for tracked channels and scheduling
- **Modular Design**: Can be imported and used from other Node.js applications
- **Graceful Shutdown**: Properly flushes in-memory data before shutdown
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Node.js** with **discord.js** v14
- **PostgreSQL** for data persistence
- **dotenv** for environment configuration

## Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and fill in your configuration:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=discord_tracker
   PGUSER=your_username
   PGPASSWORD=your_password
   ```

4. **Set up PostgreSQL database:**
   - Create a database named `discord_tracker` (or whatever you specified in `PGDATABASE`)
   - The bot will automatically create the required tables on first run

5. **Configure tracked channels:**
   Edit `config.json` to specify which channels to track:
   ```json
   {
     "trackedChannels": {
       "SERVER_ID_1": ["CHANNEL_ID_1", "CHANNEL_ID_2"],
       "SERVER_ID_2": ["CHANNEL_ID_3"]
     },
     "dailyCutoffHourUTC": 0,
     "logging": true
   }
   ```

## Usage

### Standalone Mode

Run the bot directly:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Module Mode

Import and use in your backend application:

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const { initDB, closeDB } = require('./db');
const { initializeTracking } = require('./tracker');
const { scheduleDailyUserSnapshot, triggerUserSnapshot } = require('./scheduler');
const config = require('./config.json');

// Initialize your Discord client
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ] 
});

client.once('ready', async () => {
  await initDB();
  initializeTracking(client, config);
  scheduleDailyUserSnapshot(client, config);
});

// Manual snapshot trigger
async function takeSnapshot() {
  return await triggerUserSnapshot(client, config);
}
```

## Database Schema

### user_counts
```sql
CREATE TABLE user_counts (
  server_id VARCHAR NOT NULL,
  date DATE NOT NULL,
  user_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (server_id, date)
);
```

### message_counts
```sql
CREATE TABLE message_counts (
  server_id VARCHAR NOT NULL,
  channel_id VARCHAR NOT NULL,
  date DATE NOT NULL,
  message_count INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (server_id, channel_id, date)
);
```

## API Functions

### Database Functions (`db.js`)

- **`initDB()`**: Initialize database connection and create tables
- **`upsertUserCount(serverId, date, count)`**: Insert/update user count
- **`upsertMessageCount(serverId, channelId, date, count)`**: Insert/update message count
- **`getUserCounts(serverId, startDate?, endDate?)`**: Query user counts
- **`getMessageCounts(serverId, channelId?, startDate?, endDate?)`**: Query message counts
- **`closeDB()`**: Close database connection

### Tracking Functions (`tracker.js`)

- **`initializeTracking(client, config)`**: Start message tracking
- **`flushCountsToDB(config)`**: Manually flush in-memory counts to database
- **`getInMemoryStats()`**: Get current in-memory statistics

### Scheduler Functions (`scheduler.js`)

- **`scheduleDailyUserSnapshot(client, config)`**: Schedule automatic daily snapshots
- **`triggerUserSnapshot(client, config)`**: Manually trigger user count snapshot

## Configuration

### config.json

```json
{
  "trackedChannels": {
    "123456789012345678": ["987654321098765432", "876543210987654321"],
    "112233445566778899": ["998877665544332211"]
  },
  "dailyCutoffHourUTC": 0,
  "logging": true
}
```

- **`trackedChannels`**: Object mapping server IDs to arrays of channel IDs to track
- **`dailyCutoffHourUTC`**: Hour (0-23) when daily user snapshots are taken
- **`logging`**: Whether to enable detailed logging

## How It Works

### Message Tracking
1. Bot listens for `messageCreate` events
2. Checks if message is in a tracked channel
3. Increments in-memory counter for that server/channel/date
4. Flushes to database every 5 minutes
5. On shutdown, ensures all data is flushed

### User Count Tracking
1. Bot schedules daily snapshots at configured UTC hour
2. Iterates through all servers the bot is in
3. Records `guild.memberCount` for each server
4. Stores in database with current date

### Data Persistence
- Uses PostgreSQL UPSERT operations to handle conflicts
- Message counts are additive (incremented on conflict)
- User counts are replaced (latest value wins)
- Automatic table creation on first run

## Important Notes

1. **Discord Intents**: Bot requires `GuildMembers` intent for accurate member counts
2. **Large Servers**: `guild.memberCount` may not be accurate for very large servers without privileged intents
3. **Time Zones**: All dates are stored in ISO format, snapshots use UTC timing
4. **Bot Messages**: Bot messages are automatically filtered out from counting
5. **Error Handling**: Database errors don't clear in-memory counts, allowing for retry

## Monitoring

The bot provides extensive logging when `config.logging` is enabled:
- Connection status
- Message counting events
- Database flush operations
- Scheduled snapshot executions
- Error conditions

## License

MIT License 