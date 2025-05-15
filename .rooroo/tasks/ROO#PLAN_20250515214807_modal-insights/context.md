# Task: Implement a Single Modal Shell for Card Insights

## Objective
Refactor the dashboard so that clicking any grid card opens a single modal shell (`InsightsModal`) that renders a unique child component for each card's in-depth insights.

## Requirements
- Only one modal shell in the DOM at a time.
- Each card triggers the modal and passes its own identifier/data.
- The modal shell dynamically renders the correct child component based on the card.
- All modal logic (open/close, backdrop, accessibility) is centralized.
- Each child component can have a completely custom layout.

## Current State
- Cards are in `src/components/ui/cards/grid/`.
- Modal shell file exists at `src/components/modals/InsightsModal.tsx` (currently empty).
- Cards are rendered in `src/components/pages/home-page/HomePageContent.tsx`.

## Deliverables
- Refactored modal shell.
- Example integration for at least one card (e.g., Grid3Card).
- Pattern for adding more cards/insights.
- Documentation/comments for maintainability.

## Notes
- Follow best practices for React/Next.js.
- Ensure accessibility and consistent UX.