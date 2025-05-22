# Task: Refactor XMetricsGetter to Fetch from Twitter List API

## Summary
- Refactor `src/services/x-metrics/XMetricsGetter.ts` to fetch tweets automatically from a Twitter list using the provided API endpoint:
  ```
  GET https://api.twitterapi.io/twitter/list/tweets?listId=1925252393136267285&sinceTime=<UNIX>&untilTime=<UNIX>
  Header: X-API-Key: 2a306a7bd2b24c579a03afe1e6817309
  ```
- Use `node-fetch` for the HTTP request.
- Parse the response (see sample provided) and process/store the data as currently done, adapting parsing as needed.
- Remove dependency on `src/components/pages/x-link-submission-page/XLinksForm.tsx` (delete this file).
- Ensure the new process is robust and matches the current data storage/processing logic.

## Acceptance Criteria
- Tweets are fetched from the Twitter list API, not from manual input.
- Data is parsed and stored as before, with any necessary adjustments for the new response format.
- `XLinksForm.tsx` is deleted.
- No references remain to the old manual submission process.

## Reference Files
- `src/services/x-metrics/XMetricsGetter.ts` (main logic to refactor)
- `src/components/pages/x-link-submission-page/XLinksForm.tsx` (to be deleted)
- API response sample (see user message)

## Notes
- Ensure error handling for API failures.
- Use the provided API key and endpoint.
- Confirm that the new data flow integrates smoothly with the rest of the metrics system.