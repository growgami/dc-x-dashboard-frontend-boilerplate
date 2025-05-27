import useSWR from 'swr';
import { useState, useEffect, useCallback } from 'react';
import type { EngagementMetrics } from '@/lib/db/schema';
import type { XMetricsAggregatedRow } from '../types/xMetricsTypes'; // NEW: import from types

// Types
export interface ChartDataPoint {
  day: string;
  dataset1: number; // impressions
  dataset2: number; // engagements
  dataset3: number; // followers
}

// Use the shared type for API data
type XMetricsApiData = XMetricsAggregatedRow;

export interface MetricsPercentages {
  followers: number;
  impressions: number;
  engagements: number;
}

interface UseXMetricsOptions {
  timeRange?: string; // Accepts 'daily' | 'weekly' | 'monthly'
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  // Check for pool error in the response (assuming error is returned as { message: ... })
  if (
    data &&
    typeof data === 'object' &&
    typeof data.message === 'string' &&
    data.message.includes('Cannot use a pool after calling end on the pool')
  ) {
    // Throw a custom error to be caught by SWR
    const err = new Error(data.message);
    // @ts-expect-error: isPoolClosed is a custom property for error handling
    err.isPoolClosed = true;
    throw err;
  }
  return data;
};

// Calculate percentage changes
type MetricsInput = { impressions: number; engagements: number; followers: number }[];

const calculatePercentages = (
  currentData: MetricsInput
): MetricsPercentages => {
  // If there is less than 2 data points, cannot calculate growth
  if (!currentData || currentData.length < 2) {
    return {
      followers: 0,
      impressions: 0,
      engagements: 0,
    };
  }

  const first = currentData[0];
  const last = currentData[currentData.length - 1];

  const calcGrowth = (end: number, start: number) => {
    if (start === 0) return end === 0 ? 0 : 100;
    return ((end - start) / start) * 100;
  };

  return {
    followers: calcGrowth(last.followers, first.followers),
    impressions: calcGrowth(last.impressions, first.impressions),
    engagements: calcGrowth(last.engagements, first.engagements),
  };
};

// Custom hook to fetch X metrics data
export function useXMetrics({ timeRange = 'daily' }: UseXMetricsOptions = {}) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [percentages, setPercentages] = useState<MetricsPercentages>({
    followers: 0,
    impressions: 0,
    engagements: 0
  });
  const [reloadKey, setReloadKey] = useState(0);

  // Map new timeRange to grouping and API params
  let grouping: 'day' | 'week' | 'month' = 'day';
  let effectiveTimeRange: string = '7d';

  if (timeRange === 'daily') {
    grouping = 'day';
    effectiveTimeRange = '7d';
  } else if (timeRange === 'weekly') {
    grouping = 'week';
    effectiveTimeRange = 'all';
  } else if (timeRange === 'monthly') {
    grouping = 'month';
    effectiveTimeRange = 'all';
  }

  // Fetch current period data
  const { data: currentData, error: currentError, isLoading: isCurrentLoading } = useSWR<XMetricsApiData[]>(
    [`/api/x-metrics?timeRange=${effectiveTimeRange}&grouping=${grouping}`, reloadKey],
    fetcher
  );

  // If the error is a pool closed error, auto-retry by incrementing reloadKey
  useEffect(() => {
    function isPoolClosedError(error: unknown): error is { isPoolClosed: boolean } {
      return (
        typeof error === 'object' &&
        error !== null &&
        'isPoolClosed' in error &&
        (error as { isPoolClosed: boolean }).isPoolClosed === true
      );
    }
    if (isPoolClosedError(currentError)) {
      setTimeout(() => setReloadKey(k => k + 1), 100); // debounce to avoid infinite loop
    }
  }, [currentError]);

  // Transform metrics to chart data using the label field for X axis
  // Helper to return the last 7 days for daily view, filling missing days with 0s
  const getNormalizedDailyData = useCallback((metrics: XMetricsApiData[]): ChartDataPoint[] => {
    // Create a map of date string -> metric for quick lookup
    const dateMap = new Map<string, XMetricsApiData>();
    metrics.forEach(metric => {
      if (metric.date) {
        // Use YYYY-MM-DD format for consistent comparison
        const dateObj = new Date(metric.date);
        const dateStr = dateObj.toISOString().split('T')[0];
        dateMap.set(dateStr, metric);
      }
    });
    
    // Get the last 7 days (today going backwards)
    const today = new Date();
    const last7Days: ChartDataPoint[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const metric = dateMap.get(dateStr);
      
      last7Days.push({
        day: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }),
        dataset1: metric ? metric.impressions : 0,
        dataset2: metric ? metric.engagements : 0,
        dataset3: metric ? metric.followers : 0,
      });
    }
    
    return last7Days;
  }, []);

  const transformMetricsToChartData = useCallback((metrics: XMetricsApiData[]): ChartDataPoint[] => {
    if (grouping === 'day') {
      return getNormalizedDailyData(metrics);
    }
    // weekly/monthly: just map as before
    return metrics.map(metric => {
      let dayLabel = '';
      if (grouping === 'week' && metric.label) {
        // Example: "2025-W20 (Mon May 12 2025 ... to Sun May 18 2025 ...)"
        const match = metric.label.match(/^(\d{4}-W\d{2}) \(([^)]+) to ([^)]+)\)/);
        if (match) {
          // Show as "2025-W20 (May 12 - May 18)"
          const week = match[1];
          const start = new Date(match[2]);
          const end = new Date(match[3]);
          const startStr = `${start.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`;
          const endStr = `${end.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`;
          dayLabel = `${week} (${startStr} - ${endStr})`;
        } else {
          dayLabel = metric.label;
        }
      } else if (grouping === 'month' && metric.label) {
        // Example: "2025-05 (2025-05-01 to 2025-05-31)"
        const match = metric.label.match(/^(\d{4})-(\d{2})/);
        if (match) {
          const year = match[1];
          const monthNum = parseInt(match[2], 10);
          const monthStr = new Date(parseInt(year, 10), monthNum - 1).toLocaleString('en-US', { month: 'short' });
          dayLabel = `${monthStr} ${year}`;
        } else {
          dayLabel = metric.label;
        }
      } else if (metric.date) {
        // Use formatted date string for consecutive days (e.g., "2025-05-09" or "Fri, May 9")
        const dateObj = new Date(metric.date);
        dayLabel = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
      } else if (metric.label) {
        dayLabel = metric.label;
      }
      return {
        day: dayLabel,
        dataset1: metric.impressions,
        dataset2: metric.engagements,
        dataset3: metric.followers
      };
    });
  }, [grouping, getNormalizedDailyData]);

  // Update chart data and percentages when data changes
  useEffect(() => {
    if (currentData) {
      const newChartData = transformMetricsToChartData(currentData);
      setChartData(newChartData);
      
      // For daily view, calculate percentages from the chart data (last 7 days)
      // For weekly/monthly, use the original API data
      if (grouping === 'day' && newChartData.length > 1) {
        // Convert chart data back to the format expected by calculatePercentages
        const chartDataAsMetrics = newChartData.map(point => ({
          followers: point.dataset3,
          impressions: point.dataset1,
          engagements: point.dataset2
        }));
        setPercentages(calculatePercentages(chartDataAsMetrics));
      } else if (grouping !== 'day' && currentData && currentData.length > 1) {
        setPercentages(calculatePercentages(currentData));
      }
    }
  }, [currentData, transformMetricsToChartData, grouping]);

  return {
    // Data
    chartData,
    percentages,
    isLoading: isCurrentLoading,
    error: currentError,
  };
}

// Type guard to check if the data matches EngagementMetrics structure
export function isEngagementMetrics(data: unknown): data is EngagementMetrics {
  return (
    data !== null &&
    typeof data === 'object' &&
    'date' in data &&
    'impressions' in data &&
    'engagements' in data &&
    typeof (data as EngagementMetrics).date === 'string' &&
    typeof (data as EngagementMetrics).impressions === 'number' &&
    typeof (data as EngagementMetrics).engagements === 'number'
  );
}
