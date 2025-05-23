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

interface ChartDataPoint {
  day: string
  dataset1: number
  dataset2: number
}

const chartData: ChartDataPoint[] = [
  { day: "Sunday", dataset1: 186, dataset2: 80 },
  { day: "Monday", dataset1: 305, dataset2: 200 },
  { day: "Tuesday", dataset1: 237, dataset2: 120 },
  { day: "Wednesday", dataset1: 173, dataset2: 190 },
  { day: "Thursday", dataset1: 209, dataset2: 130 },
  { day: "Friday", dataset1: 214, dataset2: 140 },
  { day: "Saturday", dataset1: 245, dataset2: 160 }
]

const chartConfig = {
  dataset1: {
    label: "Members",
    color: "hsl(var(--chart-1))",
  },
  dataset2: {
    label: "Engagements",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface Grid8CardProps {
  onClick?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

const Grid8Card = forwardRef<HTMLDivElement, Grid8CardProps>(({ onClick }, ref) => {
  return (
    <Card
      ref={ref}
      className="col-start-4 row-start-2 row-span-2 flex flex-col h-full transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1] cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="flex-1 min-h-0 p-4 pb-2 relative">
        <div className="absolute inset-0 p-4 pb-2">
          <ChartContainer config={chartConfig} className="h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
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
                  <linearGradient id="fillDataset1Grid8" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.dataset1.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.dataset1.color} stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillDataset2Grid8" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.dataset2.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartConfig.dataset2.color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  name={chartConfig.dataset1.label}
                  dataKey="dataset1"
                  type="monotone"
                  fill="url(#fillDataset1Grid8)"
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
                  fill="url(#fillDataset2Grid8)"
                  fillOpacity={0.4}
                  stroke={chartConfig.dataset2.color}
                  strokeWidth={2}
                  stackId="a"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="px-6 flex justify-center">
        <h3 className="text-2xl font-semibold text-gray-900">Discord Metrics</h3>
      </CardFooter>
    </Card>
  )
})

Grid8Card.displayName = 'Grid8Card'

export default Grid8Card 