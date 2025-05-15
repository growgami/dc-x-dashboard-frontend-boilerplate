import schedule from 'node-schedule';
import { MEMBER_METRICS_SCHEDULE } from '../scheduler';
import { getBot } from '../bot';
import fs from 'fs/promises';
import path from 'path';

const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID;
if (!DISCORD_SERVER_ID) {
  throw new Error('DISCORD_SERVER_ID is not set in environment variables');
}
const GUILD_ID: string = DISCORD_SERVER_ID;

/**
 * Collects and stores Discord member metrics.
 * Fetches member count from the Discord server and logs it.
 * Replace the log with actual storage logic as needed.
 */
async function collectMemberMetrics() {
  try {
    const bot = await getBot();
    const guild = await bot.guilds.fetch(GUILD_ID);
    const memberCount = guild.memberCount;
    // Persist memberCount and timestamp in its own directory under data/discord-metrics/members/
    const dataDir = path.join('data', 'discord-metrics', 'members');
    await fs.mkdir(dataDir, { recursive: true });

    const data = {
      count: memberCount,
      timestamp: Date.now(),
      iso: new Date().toISOString(),
    };

    // Write to latest.json (overwrite each run)
    await fs.writeFile(
      path.join(dataDir, 'latest.json'),
      JSON.stringify(data, null, 2)
    );

    // Optionally, also write to a timestamped file for history
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeFile(
      path.join(dataDir, `member-count-${ts}.json`),
      JSON.stringify(data, null, 2)
    );

    console.log(`[Discord Members] Collected member count: ${memberCount} at ${data.iso} (saved to ${dataDir})`);
  } catch (error) {
    console.error('[Discord Members] Failed to collect member metrics:', error);
  }
}

// Schedule the member metrics collection job
schedule.scheduleJob(MEMBER_METRICS_SCHEDULE, collectMemberMetrics);

// Optionally export for manual triggering/testing
export { collectMemberMetrics };

