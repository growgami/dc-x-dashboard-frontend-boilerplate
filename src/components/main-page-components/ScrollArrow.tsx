'use client';

import { motion } from 'framer-motion';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { useState } from 'react';

interface ScrollArrowProps {
  onReveal: () => void;
  onScrollUp: () => void;
}

const ScrollArrow = ({ onReveal, onScrollUp }: ScrollArrowProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUp, setIsUp] = useState(false);

  const handleClick = () => {
    if (isUp) {
      onScrollUp();
    } else {
      onReveal();
    }
    setIsUp(!isUp);
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
      animate={{
        y: isHovered ? -5 : 0,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        animate={{
          y: [0, 5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {isUp ? (
          <HiOutlineChevronUp className="w-8 h-8 text-black/60 hover:text-black/80 transition-colors" />
        ) : (
          <HiOutlineChevronDown className="w-8 h-8 text-black/60 hover:text-black/80 transition-colors" />
        )}
      </motion.div>
    </motion.div>
  );
};

export default ScrollArrow; 