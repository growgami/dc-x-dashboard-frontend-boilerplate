import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

interface DevModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevModal = ({ isOpen, onClose }: DevModalProps) => {
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
                <DialogTitle className="text-xl font-semibold text-white-700">Development Progress</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 p-4">
                <section>
                  <h3 className="font-semibold text-white-700 mb-3">Current Status</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Core Features</span>
                      <span className="text-sm font-medium">85% Complete</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Testing Coverage</span>
                      <span className="text-sm font-medium">92%</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-sm">Code Quality Score</span>
                      <span className="text-sm font-medium">A+</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-white-700 mb-3">Upcoming Features</h3>
                  <ul className="space-y-2">
                    <li className="text-sm">• Advanced Analytics Integration</li>
                    <li className="text-sm">• Real-time Collaboration Tools</li>
                    <li className="text-sm">• Custom Integration Framework</li>
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