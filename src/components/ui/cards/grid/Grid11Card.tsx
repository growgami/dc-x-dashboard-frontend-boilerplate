import { forwardRef, useState } from 'react';
import Card from '../Card';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DevModal } from '@/components/modals';

const Grid11Card = forwardRef<HTMLDivElement>((props, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);



  return (
    <>
      <Card ref={ref} className="col-start-5 row-start-5 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
        <div 
          className="h-full w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.div
                key="front"
                className="h-full flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-900">Development Progress</h3>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                className="h-full p-4 bg-gradient-to-br from-gray-500/20 to-gray-700/20 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900">Quick Stats</h4>
                    <p className="text-sm text-gray-800">Core Features: 85%</p>
                    <p className="text-sm text-gray-800">Testing: 92% coverage</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="mt-2 text-gray-900 hover:text-black"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      setShowModal(true);
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      
      <DevModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
});

Grid11Card.displayName = 'Grid11Card';

export default Grid11Card; 