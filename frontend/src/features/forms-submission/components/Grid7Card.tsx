"use client"

import { forwardRef, useMemo, useCallback } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/cards/Card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useInsightsModal } from "@/context/InsightsModalContext";
import { useTimeRange } from "@/context/TimeRangeContext"

interface ChartDataPoint {
  day: string
  fills: number
}

// Real data from form-submission-dates.csv
const rawFormSubmissionData = [
  { date: "2025-04-24", submissions: 561 },
  { date: "2025-04-25", submissions: 20384 },
  { date: "2025-04-26", submissions: 2532 },
  { date: "2025-04-27", submissions: 1053 },
  { date: "2025-04-28", submissions: 1577 },
  { date: "2025-04-29", submissions: 2382 },
  { date: "2025-04-30", submissions: 1495 },
  { date: "2025-05-01", submissions: 777 },
  { date: "2025-05-02", submissions: 531 },
  { date: "2025-05-03", submissions: 591 },
  { date: "2025-05-04", submissions: 804 },
  { date: "2025-05-05", submissions: 856 },
  { date: "2025-05-06", submissions: 471 },
  { date: "2025-05-07", submissions: 359 },
  { date: "2025-05-08", submissions: 409 },
  { date: "2025-05-09", submissions: 315 },
  { date: "2025-05-10", submissions: 300 },
  { date: "2025-05-11", submissions: 248 },
  { date: "2025-05-12", submissions: 154 },
  { date: "2025-05-13", submissions: 427 },
  { date: "2025-05-14", submissions: 225 },
  { date: "2025-05-15", submissions: 134 }
]

const chartConfig = {
  fills: {
    label: "Form Submissions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface Grid7CardProps {
  onClick?: () => void;
}

const Grid7Card = forwardRef<HTMLDivElement, Grid7CardProps>(({ onClick }, ref) => {
  const { openModal } = useInsightsModal();
  const { timeRange } = useTimeRange()

  // Helper function to get normalized daily data (last 7 days)
  const getNormalizedDailyData = useCallback((): ChartDataPoint[] => {
    const dateMap = new Map<string, typeof rawFormSubmissionData[0]>();
    rawFormSubmissionData.forEach(item => {
      dateMap.set(item.date, item);
    });
    
    // Get the last 7 days from the latest date in our data
    const latestDataDate = new Date("2025-05-15");
    const last7Days: ChartDataPoint[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(latestDataDate);
      date.setDate(latestDataDate.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = dateMap.get(dateStr);
      
      // Use day abbreviation for better display
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      last7Days.push({
        day: dayName,
        fills: dayData ? dayData.submissions : 0
      });
    }
    
    return last7Days;
  }, []);

  const chartData = useMemo(() => {
    switch (timeRange) {
      case "daily":
        // Show last 7 consecutive days
        return getNormalizedDailyData();
        
      case "weekly":
        // Show weekly aggregation - group every 7 days
        const weeklyData: ChartDataPoint[] = [];
        for (let i = 0; i < rawFormSubmissionData.length; i += 7) {
          const weekData = rawFormSubmissionData.slice(i, i + 7);
          const weekTotal = weekData.reduce((sum, day) => sum + day.submissions, 0);
          const weekLabel = `Week ${Math.floor(i / 7) + 1}`;
          
          weeklyData.push({
            day: weekLabel,
            fills: weekTotal
          });
        }
        return weeklyData.slice(-4); // Last 4 weeks
        
      case "monthly":
        // Show monthly aggregation
        const monthMap = new Map<string, number>();
        rawFormSubmissionData.forEach(item => {
          const monthKey = item.date.substring(0, 7); // YYYY-MM
          monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + item.submissions);
        });
        
        return Array.from(monthMap.entries()).map(([month, total]) => ({
          day: new Date(month + "-01").toLocaleDateString('en-US', { month: 'short' }),
          fills: total
        }));
        
      default:
        return getNormalizedDailyData();
    }
  }, [timeRange, getNormalizedDailyData]);

  const handleClick = () => {
    openModal('7');
    if (onClick) onClick();
  };

  return (
    <Card
      ref={ref}
      className="col-start-3 row-start-4 row-span-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1] z-10 cursor-pointer"
      onClick={handleClick}
    >
      <div className="px-6 pt-6">
        <h3 className="text-2xl font-semibold text-gray-900">Form Submissions</h3>
      </div>
      <CardContent className="flex-1 min-h-0 p-4 pb-2 relative">
        <div className="absolute inset-0 p-4 pb-2">
          <ChartContainer config={chartConfig} className="h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 5,
                  left: 5,
                  bottom: -30,
                }}
              >
                <defs>
                  <linearGradient id="fillFills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.fills.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.fills.color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => value.length > 3 ? value.slice(0, 3) : value}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit'
                  }}
                  itemStyle={{
                    color: 'rgba(0, 0, 0, 0.9)',
                    fontSize: '0.875rem',
                    padding: '0.25rem 0',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.1)'
                  }}
                  labelStyle={{
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.1)'
                  }}
                  formatter={(value, name) => {
                    return [value.toLocaleString(), name]
                  }}
                />
                <Bar
                  name={chartConfig.fills.label}
                  dataKey="fills"
                  fill="url(#fillFills)"
                  fillOpacity={0.8}
                  stroke={chartConfig.fills.color}
                  strokeWidth={2}
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList
                    dataKey="fills"
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
});

Grid7Card.displayName = 'Grid7Card';

export default Grid7Card; 