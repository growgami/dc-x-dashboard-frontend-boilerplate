import { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../Card';

// Real Rayls tweets - cropped for gist
const raylsTweets = [
  {
    id: 1,
    text: "Chamando todos os brasileiros 🇧🇷 Vamos mostrar nossa força 💪",
    author: "@RaylsLabs",
    timeAgo: "20h"
  },
  {
    id: 2,
    text: "Rayls at TokenNation Brasil 2025 🟡🟣 Brazil's leading Web3 event, June 4-5",
    author: "@RaylsLabs",
    timeAgo: "23h"
  },
  {
    id: 3,
    text: "@X10xalex joined MOIC's Arbitrum Week exploring institutional blockchain adoption 👇",
    author: "@RaylsLabs",
    timeAgo: "May 26"
  },
  {
    id: 4,
    text: "WHEN TESTNET? 🤔 @mcvviriato dropped spoilers about what's coming next for Rayls",
    author: "@RaylsLabs",
    timeAgo: "May 22"
  }
];

const Grid12Card = forwardRef<HTMLDivElement>((props, ref) => {
  const [currentTweetIndex, setCurrentTweetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTweetIndex((prev) => (prev + 1) % raylsTweets.length);
    }, 5000); // Change tweet every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      ref={ref}
      className="col-start-4 row-start-6 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]"
    >
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
                <p className="text-sm text-gray-900 leading-relaxed">{raylsTweets[currentTweetIndex].text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">
                    {raylsTweets[currentTweetIndex].author}
                  </span>
                  <span className="text-xs text-gray-500">
                    {raylsTweets[currentTweetIndex].timeAgo}
                  </span>
                </div>
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