import { Client, GatewayIntentBits } from 'discord.js';

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!DISCORD_BOT_TOKEN) {
  throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
}

// Create a singleton Discord client instance
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let readyPromise: Promise<typeof bot> | null = null;

function getBot(): Promise<typeof bot> {
  if (!readyPromise) {
    readyPromise = new Promise((resolve, reject) => {
      bot.once('ready', () => {
        console.log('[Discord Bot] Logged in as', bot.user?.tag);
        resolve(bot);
      });
      bot.login(DISCORD_BOT_TOKEN).catch(reject);
    });
  }
  return readyPromise;
}

export { getBot };