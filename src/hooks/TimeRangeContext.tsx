"use client";
import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type TimeRange = "7d" | "14d" | "30d" | "all";
export interface TimeRangeOption {
  label: string;
  value: TimeRange;
}

interface TimeRangeContextValue {
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  options: TimeRangeOption[];
}

const TimeRangeContext = createContext<TimeRangeContextValue | undefined>(undefined);

export const TimeRangeProvider = ({ children }: { children: ReactNode }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const options = useMemo<TimeRangeOption[]>(
    () => [
      { label: "7 Days", value: "7d" },
      { label: "14 Days", value: "14d" },
      { label: "30 Days", value: "30d" },
      { label: "All Time", value: "all" },
    ],
    []
  );

  const value = useMemo(
    () => ({ timeRange, setTimeRange, options }),
    [timeRange, options]
  );

  return (
    <TimeRangeContext.Provider value={value}>
      {children}
    </TimeRangeContext.Provider>
  );
};

export function useTimeRange() {
  const ctx = useContext(TimeRangeContext);
  if (!ctx) throw new Error("useTimeRange must be used within a TimeRangeProvider");
  return ctx;
}