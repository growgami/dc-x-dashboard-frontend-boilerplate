import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal = ({ isOpen, onClose }: CalendarModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-500/20 to-gray-700/20">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white-700">Content Calendar</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 p-4">
                <section>
                  <h3 className="font-semibold text-white-700 mb-3">Upcoming Content</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Blog Post: &quot;Growth Strategies 2024&quot;</span>
                      <span className="text-xs text-white-500">Mar 15</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Video: &quot;Product Demo&quot;</span>
                      <span className="text-xs text-white-500">Mar 18</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Newsletter: &quot;Monthly Update&quot;</span>
                      <span className="text-xs text-white-500">Mar 20</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-white-700 mb-3">Content Performance</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Average Engagement Rate</span>
                      <span className="text-sm font-medium">4.8%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Content Frequency</span>
                      <span className="text-sm font-medium">3x/week</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Top Performing Format</span>
                      <span className="text-sm font-medium">Video</span>
                    </li>
                  </ul>
                </section>
              </div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}; 