import { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../Card';

// Sample tweets - replace with actual data source
const sampleTweets = [
  {
    id: 1,
    text: "Just shipped a new feature! 🚀 #coding",
    author: "@developer1"
  },
  {
    id: 2,
    text: "Learning something new everyday. Today: React animations! 💡",
    author: "@developer2"
  },
  {
    id: 3,
    text: "Code review time! Remember: clean code is happy code 😊",
    author: "@developer3"
  }
];

const Grid12Card = forwardRef<HTMLDivElement>((props, ref) => {
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTweetIndex((prev) => (prev + 1) % sampleTweets.length);
    }, 5000); // Change tweet every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card ref={ref} className="col-start-4 row-start-6 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
      <div className="p-6 h-full">
        <div className="h-full relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTweetIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center"
            >
              <div className="flex flex-col gap-2">
                <p className="text-lg text-gray-900">{sampleTweets[currentTweetIndex].text}</p>
                <span className="text-sm text-gray-800">
                  {sampleTweets[currentTweetIndex].author}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
});

Grid12Card.displayName = 'Grid12Card';

export default Grid12Card; 