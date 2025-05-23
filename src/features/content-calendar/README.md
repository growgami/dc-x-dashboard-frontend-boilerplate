# Content Calendar Service

## Overview

The Content Calendar system is now **modularized** for clarity and maintainability.
**Published Drafts** and **Scheduled Drafts** each have their own:
- Service (data collection/processing)
- API (data serving)
- Hook (data fetching/formatting for UI)

---

## Architecture Diagram

```
[CLIENT SIDE]                        | [SERVER SIDE]
-------------------------------------|------------------------------------------
CalendarGridPublished                | publishedDraftsProcessor
    ↓                                |   (fetch/process/store published)
usePublishedDrafts()                 | PublishedDraftsGetter
    ↓                                |   (reads processed published data)
GET /api/content-calendar/published-drafts |  (API endpoint)
    ↓                                |
-------------------------------------|------------------------------------------
CalendarGridScheduled                | scheduledDraftsProcessor
    ↓                                |   (fetch/process/store scheduled)
useScheduledDrafts()                 | ScheduledDraftsGetter
    ↓                                |   (reads processed scheduled data)
GET /api/content-calendar/scheduled-drafts |  (API endpoint)
    ↓                                |
-------------------------------------|------------------------------------------
```

---

## File Structure

- **Hooks**
  - [`usePublishedDrafts.tsx`](../../hooks/content-calendar/usePublishedDrafts.tsx)
  - [`useScheduledDrafts.tsx`](../../hooks/content-calendar/useScheduledDrafts.tsx)
- **Services**
  - [`publishedDraftsProcessor.ts`](published-drafts/publishedDraftsProcessor.ts)
  - [`scheduledDraftsProcessor.ts`](scheduled-drafts/scheduledDraftsProcessor.ts)
  - [`publishedDraftsGetter.ts`](published-drafts/publishedDraftsGetter.ts)
  - [`scheduledDraftsGetter.ts`](scheduled-drafts/scheduledDraftsGetter.ts)
- **APIs**
  - `/api/content-calendar/published-drafts`
  - `/api/content-calendar/scheduled-drafts`

---

## Frontend Hook Timing

- The hooks (`usePublishedDrafts`, `useScheduledDrafts`) run automatically **whenever the React component that uses them mounts** (i.e., when the relevant calendar grid appears on screen).
- If the hook uses a data-fetching library like SWR or React Query, it may also:
    - Re-fetch data at a set interval (polling).
    - Re-fetch when the browser window regains focus.
    - Re-fetch when network connectivity is restored.
    - Re-fetch if any hook parameters (e.g., filters) change.
- The hook **does not trigger backend processing**; it only fetches the latest available data from the API.

---

## Responsibilities

### 1. Service Layer (Processor)
- **publishedDraftsProcessor.ts**: Fetches published drafts from Typefully, processes, and stores them.
- **scheduledDraftsProcessor.ts**: Fetches scheduled drafts, processes, and stores them.

### 2. API Layer (Getter)
- **publishedDraftsGetter.ts**: Reads processed published drafts and serves via API.
- **scheduledDraftsGetter.ts**: Reads processed scheduled drafts and serves via API.

### 3. Hook Layer (UI Data Fetch)
- **usePublishedDrafts.tsx**: Calls the published drafts API, formats data for the calendar grid.
- **useScheduledDrafts.tsx**: Calls the scheduled drafts API, formats data for the calendar grid.

---

## Backend Flow: Scheduled Job

- The **service layer (processor)** for both published and scheduled drafts is run as a **scheduled job** (e.g., via cron, serverless schedule, or background worker).
    - This job periodically fetches the latest data from external sources (e.g., Typefully), processes it, and stores it locally (JSON/DB).
    - The job is triggered by the backend schedule, **not** by any frontend action.

- The **API layer** simply reads the most recently processed data and serves it to the frontend.

- The **hook layer** on the frontend only fetches data from the API; it does **not** trigger any backend processing.

**Summary:**
> The backend service (processor) is the "first mover" via a scheduled job.
> The frontend hook only reads data, never triggers the backend job.

---

## Usage Flow

1. **Processor** runs (on schedule or trigger) to fetch/process/store data.
2. **API** serves the processed data to the frontend.
3. **Hook** fetches from API, formats, and provides to the calendar grid component.

---

## Notes

- Each draft type (published/scheduled) is fully separated at the service, API, and hook levels.
- Update/add new logic in the relevant file for each draft type.
- See the respective files for implementation details.


