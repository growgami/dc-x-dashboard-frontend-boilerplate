const { upsertUserCount } = require('./sub/db');
const { getTodayISODate, waitUntilHourUTC, log } = require('../utils');

function scheduleDailyUserSnapshot(client, config) {
  const snapshotCallback = async () => {
    try {
      const date = getTodayISODate();
      let totalServers = 0;
      let totalUsers = 0;

      log('Starting daily user count snapshot...', config);

      // Iterate through all guilds the bot is in
      for (const [guildId, guild] of client.guilds.cache) {
        try {
          // Ensure we have the most up-to-date member count
          // Note: guild.memberCount might not be accurate for large servers
          // without proper intents, but it's what we have access to
          const memberCount = guild.memberCount;
          
          await upsertUserCount(guildId, date, memberCount);
          
          totalServers++;
          totalUsers += memberCount;
          
          log(`Recorded user count for server ${guild.name} (${guildId}): ${memberCount} members`, config);
        } catch (error) {
          console.error(`Error recording user count for guild ${guildId}:`, error);
        }
      }

      log(`Daily user snapshot completed: ${totalServers} servers, ${totalUsers} total users`, config);
    } catch (error) {
      console.error('Error during daily user snapshot:', error);
    }
  };

  // Schedule the snapshot at the configured UTC hour
  waitUntilHourUTC(config.dailyCutoffHourUTC, snapshotCallback);
  
  log(`Daily user count snapshot scheduled for ${config.dailyCutoffHourUTC}:00 UTC`, config);
}

// Manual trigger function for testing or immediate snapshots
async function triggerUserSnapshot(client, config) {
  log('Manually triggering user count snapshot...', config);
  
  const date = getTodayISODate();
  let totalServers = 0;
  let totalUsers = 0;

  for (const [guildId, guild] of client.guilds.cache) {
    try {
      const memberCount = guild.memberCount;
      await upsertUserCount(guildId, date, memberCount);
      
      totalServers++;
      totalUsers += memberCount;
      
      log(`Recorded user count for server ${guild.name} (${guildId}): ${memberCount} members`, config);
    } catch (error) {
      console.error(`Error recording user count for guild ${guildId}:`, error);
    }
  }

  log(`Manual user snapshot completed: ${totalServers} servers, ${totalUsers} total users`, config);
  return { totalServers, totalUsers };
}

module.exports = {
  scheduleDailyUserSnapshot,
  triggerUserSnapshot,
}; 