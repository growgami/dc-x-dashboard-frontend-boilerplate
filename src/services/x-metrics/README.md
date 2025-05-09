# X Metrics Service

Flow Diagram:
```
[CLIENT SIDE]                         [SERVER SIDE]

1. Link Submission Flow:
XLinkForm Component
    ↓
useXLinkSubmission Hook
sends POST request
    ↓
    → /api/x-link ----------------→ XMetricsProcessor.processLink()
      (API Route)                  - Validates link
                                   - Stores in JSON/DB
                                   - Processes metrics

2. Data Fetch Flow:
MetricsGrid Component
    ↓
useXMetrics Hook
sends GET request                
    ↓
    → /api/x-metrics -------------→ XMetricsGetter.getData()
      (API Route)                  - Reads stored data
    ↑                              - Formats for response
receives data
    ↓
Grid renders metrics
```

# How the Pieces Connect
- The React hook (useXMetrics) is used in your frontend component. It fetches data from /api/- x-metrics using fetch or a library like SWR.
- The API route (route.ts in src/app/api/(x-link)/x-metrics/) receives the GET request. It should import and call a function from XMetricsGetter.ts to get the data.
- The Service (XMetricsGetter.ts) is responsible for reading the metrics data from the filesystem (e.- g., from data/x-metrics/YYYY/MM/DD/metrics-*.json), processing it, and returning it to the API - route.
- The API route then sends this data back as a JSON response to the frontend.
- The React hook receives the data, formats it if needed, and provides it to the component for rendering.
