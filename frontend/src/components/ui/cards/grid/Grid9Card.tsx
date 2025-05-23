"use client"

import { forwardRef } from 'react';
import { Globe } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/cards/Card"

interface Grid9CardProps {
  onClick?: () => void;
}

const Grid9Card = forwardRef<HTMLDivElement, Grid9CardProps>(({ onClick }, ref) => {
  return (
    <Card
      ref={ref}
      className="col-start-4 row-start-4 col-span-2 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]"
      onClick={onClick}
    >
      <CardContent className="p-6 h-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-12">
          <div className="flex items-baseline gap-3">
            <Globe className="h-8 w-8 text-gray-800 mb-1" />
            <span className="text-6xl font-bold text-gray-900">2,847</span>
            <span className="text-2xl text-gray-800">Website Visits</span>
          </div>
          <div className="flex flex-col items-left gap-3">
            <span className="text-gray-700 text-lg">+7.4% from yesterday</span>
            <span className="text-gray-700 text-lg">+47% from last week</span>
            <span className="text-gray-700 text-lg">Peak hours: 2-4 PM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

Grid9Card.displayName = 'Grid9Card';

export default Grid9Card; 