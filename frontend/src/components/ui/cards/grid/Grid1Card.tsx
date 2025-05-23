import { forwardRef } from 'react';
import Card from '../Card';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Grid1CardProps {
  logoSrc?: string;
  logoAlt?: string;
  title?: string;
  titleClassName?: string;
  cardSize?: 'small' | 'medium' | 'large';
  animationDelay?: number;
  theme?: 'light' | 'dark' | 'purple';
  onClick?: () => void;
  disableAnimation?: boolean;
}

const Grid1Card = forwardRef<HTMLDivElement, Grid1CardProps>(({
  logoSrc = "/assets/logo/rayls/Rayls_Symbol_Black.svg",
  logoAlt = "Rayls Logo",
  title = "Rayls",
  titleClassName = "text-7xl font-semibold text-center tracking-[0.75rem] bg-gradient-to-b from-black via-purple-900 to-purple-400 text-transparent bg-clip-text",
  cardSize = 'medium',
  animationDelay = 1.5,
  theme = 'purple',
  disableAnimation = false
}, ref) => {
  
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-64 h-64",
    large: "w-96 h-96"
  };

  const themeStyles = {
    light: "from-gray-700 via-gray-900 to-black",
    dark: "from-white via-gray-200 to-gray-400",
    purple: "from-black via-purple-900 to-purple-400"
  };

  const floatingAnimation = {
    initial: { 
      scale: 0.5, 
      opacity: 0,
      y: 0,
      rotate: 0
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        scale: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.5, ease: "easeOut" }
      }
    },
    floating: {
      y: [0, -10, 0],
      rotate: [-1, 1, -1],
      transition: {
        delay: animationDelay,
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };

  return (
    <Card 
      ref={ref} 
      className="col-span-2 row-span-3 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1] relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, rgb(168, 85, 247, 0.4), rgb(234, 234, 59, 0.4))'
        }}
      />
      
      <div className="p-6 h-full flex flex-col items-center justify-center space-y-8 relative z-10">
        <motion.div
          variants={floatingAnimation}
          initial={disableAnimation ? "visible" : "initial"}
          animate={disableAnimation ? "visible" : ["visible", "floating"]}
          className={`relative ${sizeClasses[cardSize]}`}
        >
          <Image
            src={logoSrc}
            alt={logoAlt}
            fill
            className="object-contain"
            priority
          />
        </motion.div>
        {title && (
          <motion.h3 
            initial={disableAnimation ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`${titleClassName} bg-gradient-to-b ${themeStyles[theme]} relative z-10`}
          >
            {title}
          </motion.h3>
        )}
      </div>
    </Card>
  );
});

Grid1Card.displayName = 'Grid1Card';

export default Grid1Card; 