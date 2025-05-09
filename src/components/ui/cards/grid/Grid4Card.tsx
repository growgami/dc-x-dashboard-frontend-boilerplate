"use client"

import { forwardRef } from 'react';
import Card from '../Card';
import { Users, LineChart, Heart } from 'lucide-react';
import { useXMetrics } from "@/hooks/x-metrics/xMetrics";

interface Grid4CardProps {
  timeRange: import('@/services/x-metrics/XMetricsGetter').TimeRange;
}

const Grid4Card = forwardRef<HTMLDivElement, Grid4CardProps>(({ timeRange }, ref) => {
  const { percentages, isLoading, error } = useXMetrics({ timeRange });

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(0)}%`;
  };

  if (error) {
    return (
      <Card ref={ref} className="col-start-3 row-start-3 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
        <div className="h-full w-full flex items-center justify-center">
          <p className="text-red-500">Failed to load metrics data</p>
        </div>
      </Card>
    );
  }

  return (
    <Card ref={ref} className="col-start-3 row-start-3 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
      <div className="h-full w-full flex items-center justify-center">
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        ) : (
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-gray-800">
                <Users size={24} />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatPercentage(percentages.followers)}
              </div>
              <div className="text-sm text-gray-700">Follows</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-gray-800">
                <LineChart size={24} />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatPercentage(percentages.impressions)}
              </div>
              <div className="text-sm text-gray-700">Impressions</div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 text-gray-800">
                <Heart size={24} />
              </div>
              <div className="text-xl font-bold text-gray-900">
                {formatPercentage(percentages.engagements)}
              </div>
              <div className="text-sm text-gray-700">Engagements</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

Grid4Card.displayName = 'Grid4Card';

export default Grid4Card;