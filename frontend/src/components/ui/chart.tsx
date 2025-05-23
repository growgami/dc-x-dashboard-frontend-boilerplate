import * as React from "react"
import { TooltipProps } from "recharts"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

type ChartPayloadItem = {
  value: number
  dataKey: string
  payload: {
    month: string
    config: ChartConfig
    [key: string]: unknown
  }
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  const cssVars = React.useMemo(() => {
    return Object.entries(config).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [`--color-${key}`]: value.color,
      }
    }, {})
  }, [config])

  return (
    <div 
      {...props} 
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative",
        ...cssVars,
      }} 
      className={`z-0 pointer-events-auto ${className || ''}`}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({
  active,
  payload,
  label,
  config,
}: TooltipProps<ValueType, NameType> & { config: ChartConfig }) {
  if (!active || !payload) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm z-50 pointer-events-auto">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="font-medium">{label}</div>
          </div>
        </div>
        <div className="grid gap-1">
          {(payload as ChartPayloadItem[]).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: config[item.dataKey].color,
                }}
              />
              <div className="flex items-center gap-1">
                <span className="font-medium">{config[item.dataKey].label}:</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChartTooltipContent(props: TooltipProps<ValueType, NameType>) {
  return <ChartTooltip {...props} config={props.payload?.[0]?.payload?.config} />
} 