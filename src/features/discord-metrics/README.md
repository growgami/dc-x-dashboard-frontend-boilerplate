# Discord Metrics Service

Flow Diagram:
```
[CLIENT SIDE]                                   [SERVER SIDE]

1. Scheduled Collection (per metric):

  a. Members Metrics:
     (Scheduler)
        ↓
     MemberProcessor (memberProcessor.ts)
        - Fetches member count
        - Processes and stores in JSON/DB

  b. Engagement Metrics:
     (Scheduler)
        ↓
     MemberEngagementProcessor (memberEngagementProcessor.ts)
        - Fetches engagement data
        - Processes and stores in JSON/DB

2. Data Fetch Flow (per metric):

  a. Members Metrics:
     MetricsGrid Component
        ↓
     useMemberMetrics Hook
        ↓
     sends GET request
        ↓
     → /api/discord-metrics/members --------→ MemberGetter.getData()
         (API Route)                         - Reads member data
        ↑                                    - Formats for response
     receives data
        ↓
     Grid renders member metrics

  b. Engagement Metrics:
     MetricsGrid Component
        ↓
     useMemberEngagementMetrics Hook
        ↓
     sends GET request
        ↓
     → /api/discord-metrics/member-engagements ----→ MemberEngagementGetter.getData()
         (API Route)                                 - Reads engagement data
        ↑                                            - Formats for response
     receives data
        ↓
     Grid renders engagement metrics
```

// Bot Service Layer
// Discord bot that collects metrics and member data using node-schedule
import schedule from 'node-schedule';

async function discordBot() {
  // 1. Connect to Discord
  const bot = new Discord.Client();
  
  // 2. Collect metrics on schedule (every 30 minutes)
  schedule.scheduleJob('*/30 * * * *', async () => {
    try {
      // Get member metrics
      const memberCount = await bot.guilds.cache.get(SERVER_ID).memberCount;
      const engagement = await getEngagementMetrics(bot);
      
      // Store in separate JSON files
      await Promise.all([
        fs.writeFile(
          'data/discord-metrics/members.json',
          JSON.stringify({ 
            count: memberCount, 
            timestamp: Date.now() 
          })
        ),
        fs.writeFile(
          'data/discord-metrics/engagement.json',
          JSON.stringify(engagement)
        )
      ]);

      console.log('Discord metrics collected successfully');
    } catch (error) {
      console.error('Failed to collect Discord metrics:', error);
      // Could add simple retry logic or notifications here
    }
  });

  // You can also add other schedules easily:
  // Daily summary at midnight
  schedule.scheduleJob('0 0 * * *', async () => {
    // Collect daily summary
  });

  // Weekly report on Sundays
  schedule.scheduleJob('0 0 * * 0', async () => {
    // Generate weekly report
  });
}

// create an api for parsing both member and engagement data
// Reads and serves the stored data
export async function GET() {
  // 1. Read JSONs
  const members = await fs.readFile(
    'data/discord-metrics/members.json'
  );
  const engagement = await fs.readFile(
    'data/discord-metrics/engagement.json'
  );
  
  // 2. Send as HTTP response
  return NextResponse.json({
    members: JSON.parse(members),
    engagement: JSON.parse(engagement)
  });
}

// create hooks for calling the api, parses the response, formats it, and sends it to the related grid component
// Manages data fetching and formatting
export function useDiscordMetrics() {
  const { data } = useSWR('/api/discord-metrics', 
    async () => {
      // 1. Call API
      const res = await fetch('/api/discord-metrics');
      const json = await res.json();
      
      // 2. Format for Grid components
      return {
        memberMetrics: formatForMemberGrid(json.members),
        engagementMetrics: formatForEngagementGrid(json.engagement)
      };
    }
  );
  
  return { 
    memberData: data?.memberMetrics,
    engagementData: data?.engagementMetrics
  };
} 