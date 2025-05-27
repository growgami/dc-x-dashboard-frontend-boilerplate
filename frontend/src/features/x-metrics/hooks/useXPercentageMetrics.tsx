import useSWR from 'swr';
import { useState, useEffect } from 'react';
import type { XMetricsAggregatedRow } from '../types/xMetricsTypes';

export interface MetricsPercentages {
  followers: number;
  impressions: number;
  engagements: number;
}

interface UseXPercentageMetricsOptions {
  timeRange?: string; // Accepts 'daily' | 'weekly' | 'monthly'
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  // Check for pool error in the response
  if (
    data &&
    typeof data === 'object' &&
    typeof data.message === 'string' &&
    data.message.includes('Cannot use a pool after calling end on the pool')
  ) {
    const err = new Error(data.message);
    // @ts-expect-error: isPoolClosed is a custom property for error handling
    err.isPoolClosed = true;
    throw err;
  }
  return data;
};

// Calculate percentage changes between first and last data points
const calculatePercentages = (
  currentData: XMetricsAggregatedRow[]
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

// Custom hook to fetch X metrics percentage data
export function useXPercentageMetrics({ timeRange = 'daily' }: UseXPercentageMetricsOptions = {}) {
  const [percentages, setPercentages] = useState<MetricsPercentages>({
    followers: 0,
    impressions: 0,
    engagements: 0
  });
  const [reloadKey, setReloadKey] = useState(0);

  // Map timeRange to grouping and API params
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
  const { data: currentData, error: currentError, isLoading: isCurrentLoading } = useSWR<XMetricsAggregatedRow[]>(
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

  // Update percentages when data changes
  useEffect(() => {
    if (currentData && currentData.length > 1) {
      setPercentages(calculatePercentages(currentData));
    }
  }, [currentData]);

  return {
    percentages,
    isLoading: isCurrentLoading,
    error: currentError,
  };
} 