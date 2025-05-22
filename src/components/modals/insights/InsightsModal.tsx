/**
 * InsightsModal
 * -----------------------------------------------------------------------------
 * USAGE & EXTENSION DOCS:
 *
 * This modal dynamically renders "insight" child components (e.g., Grid3Card) based on a selected card ID.
 *
 * To add a new insight child component:
 * 1. Create your new card component (e.g., Grid14Card) in the appropriate directory.
 * 2. Import your new component below with the other GridXCard imports.
 * 3. Add an entry to the `cardComponentMap` object, mapping a unique string ID to your component.
 * 4. When you want to display your new insight, pass its ID as `selectedCardId` to InsightsModal.
 * 5. (Optional) Pass any required props via the `data` prop; these will be spread into your component.
 *
 * Example:
 *   import Grid14Card from "@/components/ui/cards/grid/Grid14Card";
 *   ...
 *   const cardComponentMap = {
 *     ...,
 *     "14": Grid14Card,
 *   };
 *
 *   <InsightsModal open={open} onClose={close} selectedCardId="14" data={...} />
 *
 * If `selectedCardId` is not provided or does not match, the modal will render any children passed instead.
 *
 * See also: src/components/modals/insights/Grid3CardInsights.tsx for a typical insight component pattern.
 */

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Card from "@/components/ui/cards/Card";
import InsightContent from "./InsightContent";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// Import all grid card components here.
// To add a new insight card, import it below.
import Grid1Card from "@/components/ui/cards/grid/Grid1Card";
import Grid2Card from "@/components/ui/cards/grid/Grid2Card";
import Grid3Card from "@/features/x-metrics/component/Grid3Card";
import Grid4Card from "@/features/x-metrics/component/Grid4Card";
import Grid5Card from "@/components/ui/cards/grid/Grid5Card";
import Grid6Card from "@/components/ui/cards/grid/Grid6Card";
import Grid7Card from "@/components/ui/cards/grid/Grid7Card";
import Grid8Card from "@/components/ui/cards/grid/Grid8Card";
import Grid9Card from "@/components/ui/cards/grid/Grid9Card";
import Grid10Card from "@/components/ui/cards/grid/Grid10Card";
import Grid11Card from "@/components/ui/cards/grid/Grid11Card";
import Grid12Card from "@/components/ui/cards/grid/Grid12Card";
import Grid13Card from "@/components/ui/cards/grid/Grid13Card";

// Add new entries here to map card IDs to components.
// The key is the string ID, the value is the imported component.
interface CardInfo {
  component: React.ComponentType<object>;
  title: string;
  subtitle: string;
}

const cardComponentMap: Record<string, CardInfo> = {
  "1": { component: Grid1Card, title: "Team Overview", subtitle: "Performance" },
  "2": { component: Grid2Card, title: "Team Members", subtitle: "Profiles" },
  "3": { component: Grid3Card, title: "Analytics", subtitle: "Metrics" },
  "4": { component: Grid4Card, title: "Growth", subtitle: "Trends" },
  "5": { component: Grid5Card, title: "Engagement", subtitle: "Activity" },
  "6": { component: Grid6Card, title: "Content", subtitle: "Strategy" },
  "7": { component: Grid7Card, title: "Reach", subtitle: "Distribution" },
  "8": { component: Grid8Card, title: "Impact", subtitle: "Results" },
  "9": { component: Grid9Card, title: "Conversion", subtitle: "Funnel" },
  "10": { component: Grid10Card, title: "Revenue", subtitle: "Growth" },
  "11": { component: Grid11Card, title: "Retention", subtitle: "Loyalty" },
  "12": { component: Grid12Card, title: "Feedback", subtitle: "Insights" },
  "13": { component: Grid13Card, title: "Planning", subtitle: "Roadmap" },
};

export interface InsightsModalProps {
  open: boolean;
  onClose: () => void;
  selectedCardId?: string | number;
  data?: object;
  children?: React.ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

const InsightsModalComponent = React.memo<InsightsModalProps>(({
  open,
  onClose,
  selectedCardId,
  data,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}) => {
  // Handle scroll locking
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('no-scroll');
    } else {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.classList.remove('no-scroll');
    };
  }, [open]);

  // Memoize content to prevent unnecessary re-renders
  const content = React.useMemo(() => {
    let innerContent;
    let title = "Insight";
    let subtitle = "Details";

    if (selectedCardId && cardComponentMap[String(selectedCardId)]) {
      const cardInfo = cardComponentMap[String(selectedCardId)];
      const CardComponent = cardInfo.component;
      innerContent = <CardComponent {...(data || {})} />;
      title = cardInfo.title;
      subtitle = cardInfo.subtitle;
    } else {
      innerContent = children || null;
    }

    return (
      <InsightContent title={title} subtitle={subtitle}>
        {innerContent}
      </InsightContent>
    );
  }, [selectedCardId, data, children]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
        className="max-w-4xl w-full p-4 bg-transparent border-none shadow-none"
      >
        <VisuallyHidden>
          <DialogTitle>
            {selectedCardId ? cardComponentMap[String(selectedCardId)]?.title || 'Insight Details' : 'Insight Details'}
          </DialogTitle>
        </VisuallyHidden>
        <Card className="w-full transition-all duration-300 shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1] relative overflow-hidden">
          <div className="h-full flex flex-col px-8 py-10">
            {content}
          </div>
        </Card>
      </DialogContent>
   </Dialog>
 );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.open === nextProps.open &&
    prevProps.selectedCardId === nextProps.selectedCardId &&
    prevProps.data === nextProps.data &&
    prevProps.children === nextProps.children &&
    prevProps["aria-label"] === nextProps["aria-label"] &&
    prevProps["aria-labelledby"] === nextProps["aria-labelledby"] &&
    prevProps["aria-describedby"] === nextProps["aria-describedby"]
  );
});

InsightsModalComponent.displayName = 'InsightsModal';

export const InsightsModal = InsightsModalComponent;

export default InsightsModal;
