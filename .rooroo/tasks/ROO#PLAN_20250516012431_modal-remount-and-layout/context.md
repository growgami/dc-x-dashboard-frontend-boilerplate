# Task: Fix Modal Remount and Layout Issues

## User Feedback
- Closing the modal causes the whole page to remount.
- The modal's layout and styling should follow how the cards were laid out.

## Current Implementation
- Modal logic and state are managed in HomePageContent and InsightsModal.
- Modal is triggered from grid cards.
- Layout and styling may not match the card grid.

## Goals
1. Prevent the whole page from remounting when closing the modal.
2. Update modal layout and styling to match the card grid layout.

## Relevant Files
- src/components/modals/InsightsModal.tsx
- src/components/pages/home-page/HomePageContent.tsx
- src/components/ui/cards/grid/