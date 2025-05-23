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

const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ children, className }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn("p-6 pb-2", className)}
    >
      {children}
    </motion.div>
  );
});

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-xl font-semibold text-gray-900", className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-gray-600 mt-1", className)}
        {...props}
      >
        {children}
      </p>
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
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card; 