# Plan Overview: Refactor XMetricsGetter to Fetch from Twitter List API

## Sub-Tasks

1. **Analyze Current XMetricsGetter Logic**
   - Goal: Understand how tweets are currently fetched and processed.
   - File: `src/services/x-metrics/XMetricsGetter.ts`

2. **Identify and Remove Manual Submission Logic**
   - Goal: Review `XLinksForm.tsx` and search for all references to manual submission logic.
   - File: `src/components/pages/x-link-submission-page/XLinksForm.tsx`

3. **Refactor XMetricsGetter to Use Twitter List API**
   - Goal: Refactor `XMetricsGetter` to fetch from the Twitter List API, parse the new response, and integrate robust error handling.
   - File: `src/services/x-metrics/XMetricsGetter.ts`

4. **Remove Manual Submission Components and References**
   - Goal: Delete `XLinksForm.tsx` and remove all references to the old manual submission process.
   - Files: `src/components/pages/x-link-submission-page/XLinksForm.tsx` and all files identified in sub-task 2.

5. **Validate Integration of New X Metrics Data Flow**
   - Goal: Ensure the refactored logic integrates smoothly with the rest of the metrics system.
   - Files: `src/services/x-metrics/XMetricsGetter.ts`, `data/x-metrics-mock.csv`, `data/x-metrics.db`, `src/hooks/x-metrics/xMetrics.tsx`, `src/hooks/x-metrics/useXMetrics.tsx`, `src/app/api/(x-link)/x-metrics/route.ts`