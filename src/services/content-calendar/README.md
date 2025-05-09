# Content Calendar Service

Flow Diagram:
```
[CLIENT SIDE]                         [SERVER SIDE]
                                
1. Scheduled Collection:                   
                                     ContentCalendarProcessor
                                     (runs on schedule)
                                     - Fetches from Typefully API
                                     - Processes draft data
                                     - Stores in JSON/DB

2. Data Fetch Flow:
CalendarGrid Component
    ↓
useContentCalendar Hook
sends GET request                
    ↓
    → /api/content-calendar ------→ ContentCalendarGetter.getData()
      (API Route)                  - Reads stored data
    ↑                              - Formats for response
receives data
    ↓
Grid renders calendar
```

// create a service for the collection of data for the published drafts and the scheduled drafts
// Collects and stores data
async function fetchAndStorePublishedDrafts() {
  // 1. Fetch from Typefully API
  const drafts = await typefullyApi.getDrafts();
  
  // 2. Store in JSON
  await fs.writeFile(
    'data/content-calendar/published-drafts.json', 
    JSON.stringify(drafts)
  );
}


// create an api for the parsing of the data for both drafts
// Reads and serves the stored data
export async function GET() {
  // 1. Read JSON
  const data = await fs.readFile(
    'data/content-calendar/published-drafts.json'
  );
  
  // 2. Send as HTTP response
  return NextResponse.json(JSON.parse(data));
}

// create hooks for calling the apis, parses the response, formats it, and sends it to the related grid component
// Manages data fetching and formatting
export function useContentCalendar() {
  const { data } = useSWR('/api/content-calendar', 
    async () => {
      // 1. Call API
      const res = await fetch('/api/content-calendar');
      const json = await res.json();
      
      // 2. Format for Grid component
      return formatForCalendar(json);
    }
  );
  
  return { calendarData: data };
}


