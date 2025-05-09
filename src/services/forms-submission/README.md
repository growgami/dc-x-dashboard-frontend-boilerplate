# Forms Submission Service

Flow Diagram:
```
[CLIENT SIDE]                         [SERVER SIDE]
                                
1. Scheduled Collection:                   
                                     FormsProcessor
                                     (runs every 15 min)
                                     - Fetches from Google Forms
                                     - Processes submissions
                                     - Stores in JSON/DB

2. Data Fetch Flow:
SubmissionsGrid Component
    ↓
useFormSubmissions Hook
sends GET request                
    ↓
    → /api/forms-submission ------→ FormsGetter.getData()
      (API Route)                  - Reads stored data
    ↑                              - Formats for response
receives data
    ↓
Grid renders submissions
```

// create a service for collecting form submissions using node-schedule
// Collects and stores data
import schedule from 'node-schedule';

async function formsSubmissionService() {
  // Check for new submissions every 15 minutes
  schedule.scheduleJob('*/15 * * * *', async () => {
    try {
      // 1. Fetch from Google Forms API
      const submissions = await googleFormsApi.getSubmissions();
      
      // 2. Store in JSON
      await fs.writeFile(
        'data/forms-submission/submissions.json', 
        JSON.stringify({
          submissions,
          lastChecked: Date.now()
        })
      );

      console.log('Form submissions collected successfully');
    } catch (error) {
      console.error('Failed to collect form submissions:', error);
      // Could add simple retry logic or notifications here
    }
  });

  // Daily summary report at midnight
  schedule.scheduleJob('0 0 * * *', async () => {
    // Generate daily submission summary
  });
}

// create an api for parsing the form submissions data
// Reads and serves the stored data
export async function GET() {
  // 1. Read JSON
  const data = await fs.readFile(
    'data/forms-submission/submissions.json'
  );
  
  // 2. Send as HTTP response
  return NextResponse.json(JSON.parse(data));
}

// create hooks for calling the api, parses the response, formats it, and sends it to the related grid component
// Manages data fetching and formatting
export function useFormSubmissions() {
  const { data } = useSWR('/api/forms-submission', 
    async () => {
      // 1. Call API
      const res = await fetch('/api/forms-submission');
      const json = await res.json();
      
      // 2. Format for Grid component
      return formatForSubmissions(json);
    }
  );
  
  return { submissionsData: data };
} 