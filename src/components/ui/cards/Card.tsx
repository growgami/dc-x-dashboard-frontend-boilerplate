import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', onClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(`rounded-3xl bg-black/5`, className)}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? "button" : undefined}
        style={onClick ? { cursor: "pointer" } : undefined}
      >
        {children}
      </motion.div>
    );
  }
);

const CardContent = forwardRef<HTMLDivElement, CardProps>(({ children, className }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("p-6 pt-0", className)}
    >
      {children}
    </motion.div>
  );
});

const CardFooter = forwardRef<HTMLDivElement, CardProps>(({ children, className }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardContent, CardFooter };
export default Card; 