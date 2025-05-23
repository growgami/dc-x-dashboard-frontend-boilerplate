/**
 * API module for accessing Discord tracking data
 * This can be used by external applications to query the collected data
 */

const { getUserCounts, getMessageCounts } = require('./db');
const { getInMemoryStats } = require('./tracker');

/**
 * Get user counts for a specific server
 * @param {string} serverId - Discord server ID
 * @param {string} startDate - Start date (YYYY-MM-DD) (optional)
 * @param {string} endDate - End date (YYYY-MM-DD) (optional)
 * @returns {Promise<Array>} Array of user count records
 */
async function getServerUserCounts(serverId, startDate = null, endDate = null) {
  try {
    return await getUserCounts(serverId, startDate, endDate);
  } catch (error) {
    throw new Error(`Failed to get user counts for server ${serverId}: ${error.message}`);
  }
}

/**
 * Get message counts for a specific server and optionally a specific channel
 * @param {string} serverId - Discord server ID
 * @param {string} channelId - Discord channel ID (optional)
 * @param {string} startDate - Start date (YYYY-MM-DD) (optional)
 * @param {string} endDate - End date (YYYY-MM-DD) (optional)
 * @returns {Promise<Array>} Array of message count records
 */
async function getServerMessageCounts(serverId, channelId = null, startDate = null, endDate = null) {
  try {
    return await getMessageCounts(serverId, channelId, startDate, endDate);
  } catch (error) {
    throw new Error(`Failed to get message counts for server ${serverId}: ${error.message}`);
  }
}

/**
 * Get aggregated statistics for a server
 * @param {string} serverId - Discord server ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Object>} Aggregated statistics
 */
async function getServerStats(serverId, days = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

    const [userCounts, messageCounts] = await Promise.all([
      getUserCounts(serverId, startDate, endDate),
      getMessageCounts(serverId, null, startDate, endDate)
    ]);

    // Calculate statistics
    const stats = {
      serverId,
      period: { startDate, endDate, days },
      userCounts: {
        total: userCounts.length,
        latest: userCounts.length > 0 ? userCounts[0].user_count : 0,
        average: userCounts.length > 0 ? Math.round(userCounts.reduce((sum, record) => sum + record.user_count, 0) / userCounts.length) : 0,
        records: userCounts
      },
      messageCounts: {
        totalRecords: messageCounts.length,
        totalMessages: messageCounts.reduce((sum, record) => sum + record.message_count, 0),
        averagePerDay: messageCounts.length > 0 ? Math.round(messageCounts.reduce((sum, record) => sum + record.message_count, 0) / days) : 0,
        byChannel: {},
        records: messageCounts
      }
    };

    // Group message counts by channel
    messageCounts.forEach(record => {
      if (!stats.messageCounts.byChannel[record.channel_id]) {
        stats.messageCounts.byChannel[record.channel_id] = {
          totalMessages: 0,
          records: []
        };
      }
      stats.messageCounts.byChannel[record.channel_id].totalMessages += record.message_count;
      stats.messageCounts.byChannel[record.channel_id].records.push(record);
    });

    return stats;
  } catch (error) {
    throw new Error(`Failed to get server stats for ${serverId}: ${error.message}`);
  }
}

/**
 * Get current in-memory statistics (pending data not yet flushed to DB)
 * @returns {Object} In-memory statistics
 */
function getCurrentMemoryStats() {
  return getInMemoryStats();
}

/**
 * Get daily summary for all servers for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Daily summary
 */
async function getDailySummary(date) {
  try {
    const [userCounts, messageCounts] = await Promise.all([
      getUserCounts('%', date, date), // Use wildcard for all servers
      getMessageCounts('%', null, date, date)
    ]);

    const summary = {
      date,
      totalServers: new Set(userCounts.map(record => record.server_id)).size,
      totalUsers: userCounts.reduce((sum, record) => sum + record.user_count, 0),
      totalMessages: messageCounts.reduce((sum, record) => sum + record.message_count, 0),
      totalChannels: new Set(messageCounts.map(record => record.channel_id)).size,
      serverBreakdown: {}
    };

    // Create server breakdown
    userCounts.forEach(userRecord => {
      const serverId = userRecord.server_id;
      const serverMessages = messageCounts
        .filter(msgRecord => msgRecord.server_id === serverId)
        .reduce((sum, record) => sum + record.message_count, 0);

      summary.serverBreakdown[serverId] = {
        userCount: userRecord.user_count,
        messageCount: serverMessages,
        channels: messageCounts
          .filter(msgRecord => msgRecord.server_id === serverId)
          .map(record => record.channel_id)
      };
    });

    return summary;
  } catch (error) {
    throw new Error(`Failed to get daily summary for ${date}: ${error.message}`);
  }
}

/**
 * Export all functions for use in other modules
 */
module.exports = {
  getServerUserCounts,
  getServerMessageCounts,
  getServerStats,
  getCurrentMemoryStats,
  getDailySummary,
}; 