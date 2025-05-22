"use client";
import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

export type TimeRange = "daily" | "weekly" | "monthly";
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
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  const options = useMemo<TimeRangeOption[]>(
    () => [
      { label: "Daily", value: "daily" },
      { label: "Weekly", value: "weekly" },
      { label: "Monthly", value: "monthly" },
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