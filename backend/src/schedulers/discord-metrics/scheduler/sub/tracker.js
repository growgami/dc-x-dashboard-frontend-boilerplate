const { upsertMessageCount } = require('./db');
const { getTodayISODate, log } = require('../../utils');

const inMemoryCounts = {};

function initializeTracking(client, config) {
  // Create a Set of all tracked channel IDs for quick lookup
  const trackedChannels = new Set();
  Object.values(config.trackedChannels).forEach(channels => {
    channels.forEach(channelId => trackedChannels.add(channelId));
  });

  log(`Tracking ${trackedChannels.size} channels across ${Object.keys(config.trackedChannels).length} servers`, config);

  client.on('messageCreate', (message) => {
    // Skip if not in a tracked channel
    if (!trackedChannels.has(message.channel.id)) return;
    
    // Skip bot messages
    if (message.author.bot) return;
    
    // Skip if not in a guild
    if (!message.guild) return;

    const { guild, channel } = message;
    const date = getTodayISODate();
    const serverId = guild.id;
    const channelId = channel.id;

    // Initialize nested objects if they don't exist
    if (!inMemoryCounts[serverId]) {
      inMemoryCounts[serverId] = {};
    }
    if (!inMemoryCounts[serverId][channelId]) {
      inMemoryCounts[serverId][channelId] = {};
    }
    if (!inMemoryCounts[serverId][channelId][date]) {
      inMemoryCounts[serverId][channelId][date] = 0;
    }

    // Increment the count
    inMemoryCounts[serverId][channelId][date]++;

    log(`Message counted: Server ${serverId}, Channel ${channelId}, Date ${date}, Count: ${inMemoryCounts[serverId][channelId][date]}`, config);
  });

  // Periodic flush every 5 minutes
  const flushInterval = setInterval(() => {
    flushCountsToDB(config);
  }, 5 * 60 * 1000);

  // Graceful shutdown handlers
  const shutdown = async (signal) => {
    log(`Received ${signal}, shutting down gracefully...`, config);
    
    clearInterval(flushInterval);
    await flushCountsToDB(config);
    
    log('Shutdown complete', config);
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  log('Message tracking initialized successfully', config);
}

async function flushCountsToDB(config) {
  let totalFlushed = 0;
  
  try {
    for (const [serverId, channels] of Object.entries(inMemoryCounts)) {
      for (const [channelId, dates] of Object.entries(channels)) {
        for (const [date, count] of Object.entries(dates)) {
          if (count > 0) {
            await upsertMessageCount(serverId, channelId, date, count);
            totalFlushed += count;
          }
        }
      }
    }

    if (totalFlushed > 0) {
      log(`Flushed ${totalFlushed} message counts to database`, config);
      
      // Clear the in-memory counts after successful flush
      for (const serverId in inMemoryCounts) {
        for (const channelId in inMemoryCounts[serverId]) {
          for (const date in inMemoryCounts[serverId][channelId]) {
            inMemoryCounts[serverId][channelId][date] = 0;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error flushing counts to database:', error);
    // Don't clear counts on error so we can retry later
  }
}

function getInMemoryStats() {
  const stats = {
    totalServers: Object.keys(inMemoryCounts).length,
    totalChannels: 0,
    totalPendingCounts: 0,
    details: {}
  };

  for (const [serverId, channels] of Object.entries(inMemoryCounts)) {
    stats.details[serverId] = {};
    
    for (const [channelId, dates] of Object.entries(channels)) {
      stats.totalChannels++;
      stats.details[serverId][channelId] = {};
      
      for (const [date, count] of Object.entries(dates)) {
        stats.details[serverId][channelId][date] = count;
        stats.totalPendingCounts += count;
      }
    }
  }

  return stats;
}

module.exports = {
  initializeTracking,
  flushCountsToDB,
  getInMemoryStats,
}; 