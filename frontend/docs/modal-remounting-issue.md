# Modal Remounting Issue Investigation

## Problem
The `HomePageContent` component was remounting unnecessarily when the `InsightsModal` was triggered. This was causing:
- Animation resets
- Unnecessary re-renders
- Poor user experience
- Similar issue was observed with TimeRangeContext implementation

## What We Tried

### Attempt 1: Context-Based State Management
- Created `InsightsModalContext` to manage modal state globally
- Similar to TimeRangeContext pattern
- Moved state out of HomePageContent
- **Result**: Still remounted

### Attempt 2: Moving Refs Outside Component
- Tried moving grid refs outside component
- Used `React.createRef()`
- **Issues**:
  - TypeScript/ESLint errors with hooks outside components
  - Potential SSR issues
  - Could cause shared state between instances

### Attempt 3: Comprehensive Solution
1. Component Optimization:
   - Used `useMemo` for gridRefs array inside component
   - Removed unnecessary dependencies from useEffect
   - Removed scroll locking from HomePageContent

2. Modal Improvements:
   - Added `React.memo` with proper prop comparison
   - Moved scroll locking logic to modal component
   - Memoized content rendering
   - Added proper TypeScript types
   - Fixed aria attributes

3. Context Implementation:
   - Global context for modal state
   - Memoized context value
   - Clean separation of concerns

## What Worked
The combination of:
1. Proper memoization at all levels
2. Moving scroll locking to modal component
3. Using context for state management
4. Removing unnecessary effect dependencies
5. Ensuring clean component boundaries

## Conclusion
The issue wasn't just about state management - it required a holistic approach:

1. **State Management**: Context helps but isn't enough alone
2. **Performance**: Proper memoization at all levels is crucial
3. **Component Boundaries**: Side effects should live with related components
4. **Best Practices**:
   - Use hooks correctly (inside components)
   - Memoize expensive operations
   - Keep effects focused and minimal
   - Maintain clean separation of concerns

This investigation shows that React performance optimization often requires looking beyond the immediate symptom to understand and address the root causes of unnecessary re-renders.