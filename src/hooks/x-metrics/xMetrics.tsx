import useSWR from 'swr';
import { useState, useEffect } from 'react';
import type { EngagementMetrics } from '@/lib/db/schema';
import type { TimeRange } from '@/services/x-metrics/XMetricsGetter';

 // Types
export interface ChartDataPoint {
  day: string;
  dataset1: number; // followers
  dataset2: number; // impressions
  dataset3: number; // engagements
}

type XMetricsApiData = {
  impressions: number;
  engagements: number;
  date?: string;
  label?: string;
};

export interface MetricsPercentages {
  followers: number;
  impressions: number;
  engagements: number;
}

interface UseXMetricsOptions {
  timeRange?: TimeRange;
}

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Transform metrics data into chart format

// Calculate percentage changes
type MetricsInput = { impressions: number; engagements: number }[];

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
    followers: 0, // Will be implemented when followers data is available
    impressions: calcGrowth(last.impressions, first.impressions),
    engagements: calcGrowth(last.engagements, first.engagements),
  };
};

// Custom hook to fetch X metrics data
export function useXMetrics({ timeRange: initialTimeRange = '7d' }: UseXMetricsOptions = {}) {
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [percentages, setPercentages] = useState<MetricsPercentages>({
    followers: 0,
    impressions: 0,
    engagements: 0
  });

  // Determine grouping based on timeRange
  function getGrouping(): 'day' | 'week' | 'month' {
    // Only allow 'week' or 'month' grouping for the past 7 days; otherwise, force 'day'
    if (timeRange === '7d') {
      // Optionally, you could allow user selection here, but for now default to 'day'
      return 'day';
    }
    return 'day';
  }
  const grouping = getGrouping();

  // Fetch current period data
  const { data: currentData, error: currentError, isLoading: isCurrentLoading } = useSWR<XMetricsApiData[]>(
    `/api/x-metrics?timeRange=${timeRange}&grouping=${grouping}`,
    fetcher
  );

  // Fetch previous period data for percentage calculations

  // Transform metrics to chart data using the label field for X axis
  const transformMetricsToChartData = (metrics: XMetricsApiData[]): ChartDataPoint[] => {
    return metrics.map(metric => {
      let dayLabel = '';
      if (metric.date) {
        // Use formatted date string for consecutive days (e.g., "2025-05-09" or "Fri, May 9")
        const dateObj = new Date(metric.date);
        dayLabel = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });
      } else if (metric.label) {
        dayLabel = metric.label;
      }
      return {
        day: dayLabel,
        dataset1: 0, // Followers data will be added when available
        dataset2: metric.impressions,
        dataset3: metric.engagements
      };
    });
  };

  // Update chart data and percentages when data changes
  useEffect(() => {
    if (currentData) {
      setChartData(transformMetricsToChartData(currentData));
    }
  }, [currentData]);

  useEffect(() => {
    if (currentData && currentData.length > 1) {
      setPercentages(calculatePercentages(currentData));
    }
  }, [currentData]);

  return {
    // Data
    chartData,
    percentages,
    timeRange,
    isLoading: isCurrentLoading,
    error: currentError,

    // Actions
    updateTimeRange: (newRange: TimeRange) => setTimeRange(newRange),
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
