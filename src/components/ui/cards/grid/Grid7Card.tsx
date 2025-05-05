"use client"

import { forwardRef } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/cards/Card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

interface ChartDataPoint {
  day: string
  fills: number
}

const chartData: ChartDataPoint[] = [
  { day: "Monday", fills: Math.floor(Math.random() * 100) + 50 },
  { day: "Tuesday", fills: Math.floor(Math.random() * 100) + 50 },
  { day: "Wednesday", fills: Math.floor(Math.random() * 100) + 50 },
  { day: "Thursday", fills: Math.floor(Math.random() * 100) + 50 },
  { day: "Friday", fills: Math.floor(Math.random() * 100) + 50 },
  { day: "Saturday", fills: Math.floor(Math.random() * 100) + 50 },
  { day: "Sunday", fills: Math.floor(Math.random() * 100) + 50 },
];

const chartConfig = {
  fills: {
    label: "Form Fills",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const Grid7Card = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Card ref={ref} className="col-start-3 row-start-4 row-span-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1] z-10">
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
                  tickFormatter={(value) => value.slice(0, 3)}
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