const { Client, GatewayIntentBits } = require('discord.js');
const config = require('../../config.json');
const { initDB, closeDB } = require('./db');
const { initializeTracking } = require('./tracker');
const { scheduleDailyUserSnapshot } = require('./scheduler');
const { log } = require('../../utils');

// Load environment variables
require('dotenv').config();

// Create Discord client with necessary intents
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ] 
});

// Bot ready event
client.once('ready', async () => {
  try {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`🎯 Bot is in ${client.guilds.cache.size} servers`);
    
    // Initialize database
    log('Initializing database...', config);
    await initDB();
    
    // Initialize message tracking
    log('Initializing message tracking...', config);
    initializeTracking(client, config);
    
    // Schedule daily user snapshots
    log('Scheduling daily user snapshots...', config);
    scheduleDailyUserSnapshot(client, config);
    
    // Log tracked channels info
    const totalChannels = Object.values(config.trackedChannels).reduce((sum, channels) => sum + channels.length, 0);
    console.log(`📊 Tracking ${totalChannels} channels across ${Object.keys(config.trackedChannels).length} configured servers`);
    
    console.log('🚀 Discord Server Tracker Bot is fully operational!');
    
  } catch (error) {
    console.error('❌ Error during bot initialization:', error);
    process.exit(1);
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

client.on('warn', (warning) => {
  console.warn('Discord client warning:', warning);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  
  try {
    await closeDB();
    client.destroy();
    console.log('✅ Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  try {
    await closeDB();
    client.destroy();
    console.log('✅ Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Unhandled promise rejection handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Login to Discord
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN environment variable is required!');
  console.error('Please copy env.example to .env and fill in your Discord bot token.');
  process.exit(1);
}

console.log('🔗 Connecting to Discord...');
client.login(process.env.DISCORD_TOKEN); 