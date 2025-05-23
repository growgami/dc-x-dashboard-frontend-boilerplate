# Website Visitors Service

Flow Diagram:
```
[CLIENT SIDE]                         [SERVER SIDE]
                                
1. Scheduled Collection:                   
                                     VisitorsProcessor
                                     (runs every hour)
                                     - Fetches from Analytics API
                                     - Processes visitor data
                                     - Stores in JSON/DB

2. Data Fetch Flow:
VisitorsGrid Component
    ↓
useVisitorMetrics Hook
sends GET request                
    ↓
    → /api/website-visitors ------→ VisitorsGetter.getData()
      (API Route)                  - Reads stored data
    ↑                              - Formats for response
receives data
    ↓
Grid renders visitor stats
```

// create a service for collecting website visitor metrics using node-schedule
// Collects and stores data
import schedule from 'node-schedule';

async function websiteMetricsService() {
  // Collect metrics every hour
  schedule.scheduleJob('0 * * * *', async () => {
    try {
      // 1. Fetch from Analytics API
      const metrics = await analyticsApi.getVisitorMetrics();
      
      // 2. Store in JSON
      await fs.writeFile(
        'data/website-visitors/metrics.json', 
        JSON.stringify({
          metrics,
          timestamp: Date.now()
        })
      );

      console.log('Website metrics collected successfully');
    } catch (error) {
      console.error('Failed to collect website metrics:', error);
      // Could add simple retry logic or notifications here
    }
  });

  // Daily aggregated stats at midnight
  schedule.scheduleJob('0 0 * * *', async () => {
    // Collect daily summary
  });
}

// create an api for parsing the visitor metrics data
// Reads and serves the stored data
export async function GET() {
  // 1. Read JSON
  const data = await fs.readFile(
    'data/website-visitors/metrics.json'
  );
  
  // 2. Send as HTTP response
  return NextResponse.json(JSON.parse(data));
}

// create hooks for calling the api, parses the response, formats it, and sends it to the related grid component
// Manages data fetching and formatting
export function useVisitorMetrics() {
  const { data } = useSWR('/api/website-visitors', 
    async () => {
      // 1. Call API
      const res = await fetch('/api/website-visitors');
      const json = await res.json();
      
      // 2. Format for Grid component
      return formatForVisitorMetrics(json);
    }
  );
  
  return { visitorData: data };
} 