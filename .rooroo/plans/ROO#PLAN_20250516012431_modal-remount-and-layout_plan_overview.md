# Plan Overview: Fix Modal Remount and Layout Issues

## Parent Task
- **Task ID:** ROO#PLAN_20250516012431_modal-remount-and-layout
- **Goals:**
  1. Prevent the whole page from remounting when closing the modal.
  2. Update modal layout and styling to match the card grid layout.

---

## Sub-Tasks

### 1. Prevent Whole Page Remount on Modal Close
- **Sub-Task ID:** ROO#SUB_modal-remount-and-layout_S001
- **Goal:** Refactor modal logic/state so that closing the modal does not cause the entire page to remount.
- **Relevant Files:**
  - src/components/pages/home-page/HomePageContent.tsx
  - src/components/modals/InsightsModal.tsx

### 2. Update Modal Layout and Styling to Match Card Grid
- **Sub-Task ID:** ROO#SUB_modal-remount-and-layout_S002
- **Goal:** Update the layout and styling of the InsightsModal so that it visually matches the card grid used on the home page.
- **Relevant Files:**
  - src/components/modals/InsightsModal.tsx
  - src/components/ui/cards/grid/Grid1Card.tsx ... Grid13Card.tsx
  - src/components/ui/cards/grid/index.ts

---

Each sub-task has a dedicated context file in `.rooroo/tasks/` with referenced files and a clear goal.