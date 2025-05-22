# Sub-Task: Refactor XMetricsGetter to Use Twitter List API

## Goal
Refactor src/services/x-metrics/XMetricsGetter.ts to:
- Fetch tweets from the Twitter List API endpoint:
  - GET https://api.twitterapi.io/twitter/list/tweets?listId=1925252393136267285&sinceTime=<UNIX>&untilTime=<UNIX>
  - Header: X-API-Key: 2a306a7bd2b24c579a03afe1e6817309
- Use node-fetch for HTTP requests.
- Parse the new API response and process/store data as before, adapting as needed.
- Integrate robust error handling for API failures.

## Relevant Files
- src/services/x-metrics/XMetricsGetter.ts

## Reference
- API response sample (see parent context)