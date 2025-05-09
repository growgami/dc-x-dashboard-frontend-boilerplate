"use client"

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { forwardRef } from 'react'

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/cards/Card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useXMetrics } from "@/hooks/x-metrics/xMetrics"
import type { TimeRange } from "@/services/x-metrics/XMetricsGetter"


const chartConfig = {
  dataset1: {
    label: "Followers",
    color: "hsl(var(--chart-1))",
  },
  dataset2: {
    label: "Impressions",
    color: "hsl(var(--chart-2))",
  },
  dataset3: {
    label: "Engagements",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const Grid3Card = forwardRef<HTMLDivElement>((props, ref) => {
  const { chartData, timeRange, updateTimeRange, isLoading, error } = useXMetrics();
  
  // Always show a chart, even if there is no data
  const displayChartData = (chartData && chartData.length > 0)
    ? chartData
    : [{
        day: "No Data",
        dataset1: 0,
        dataset2: 0,
        dataset3: 0,
      }];

  const timeRangeOptions: { label: string; value: TimeRange }[] = [
    { label: '7 Days', value: '7d' },
    { label: '14 Days', value: '14d' },
    { label: '30 Days', value: '30d' },
    { label: 'All Time', value: 'all' }
  ];

  if (error) {
    return (
      <Card ref={ref} className="col-start-3 row-start-1 row-span-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
        <CardContent className="flex items-center justify-center">
          <p className="text-red-500">Failed to load metrics data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={ref} className="col-start-3 row-start-1 row-span-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]">
      <CardContent className="flex-1 min-h-0 p-4 pb-2 relative">
        <div className="absolute right-6 top-4 z-20">
          <select
            value={timeRange}
            onChange={(e) => updateTimeRange(e.target.value as TimeRange)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="absolute inset-0 p-4 pb-2">
          <ChartContainer config={chartConfig} className="h-full relative z-10">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={displayChartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: -30,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={false}
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
                <defs>
                  <linearGradient id="fillDataset1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.dataset1.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.dataset1.color} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillDataset2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.dataset2.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.dataset2.color} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillDataset3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.dataset3.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.dataset3.color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  name={chartConfig.dataset1.label}
                  dataKey="dataset1"
                  type="monotone"
                  fill="url(#fillDataset1)"
                  fillOpacity={0.4}
                  stroke={chartConfig.dataset1.color}
                  strokeWidth={2}
                  stackId="a"
                  isAnimationActive={false}
                />
                <Area
                  name={chartConfig.dataset2.label}
                  dataKey="dataset2"
                  type="monotone"
                  fill="url(#fillDataset2)"
                  fillOpacity={0.4}
                  stroke={chartConfig.dataset2.color}
                  strokeWidth={2}
                  stackId="a"
                  isAnimationActive={false}
                />
                <Area
                  name={chartConfig.dataset3.label}
                  dataKey="dataset3"
                  type="monotone"
                  fill="url(#fillDataset3)"
                  fillOpacity={0.4}
                  stroke={chartConfig.dataset3.color}
                  strokeWidth={2}
                  stackId="a"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="px-6 flex justify-center">
        <h3 className="text-2xl font-semibold text-gray-900">X Metrics</h3>
      </CardFooter>
    </Card>
  )
})

Grid3Card.displayName = 'Grid3Card'

export default Grid3Card 