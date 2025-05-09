import { NextRequest, NextResponse } from 'next/server';
import { getDailyMetrics, TimeRange } from '@/services/x-metrics/XMetricsGetter';
import type { XMetricsAggregatedRow } from '@/services/x-metrics/XMetricsGetter';

export async function GET(
  request: NextRequest
): Promise<NextResponse<XMetricsAggregatedRow[]>> {
  // Get timeRange from query params, default to '7d'
  const searchParams = request.nextUrl.searchParams;
  const timeRange = (searchParams.get('timeRange') || '7d') as TimeRange;
  const groupingParam = searchParams.get('grouping');
  const validGroupings = ['day', 'week', 'month'] as const;
  type Grouping = typeof validGroupings[number];
  function isValidGrouping(value: string | null): value is Grouping {
    return value !== null && validGroupings.includes(value as Grouping);
  }
  let grouping: Grouping = isValidGrouping(groupingParam) ? groupingParam : 'day';
  // Only allow 'week' or 'month' grouping for the past 7 days; otherwise, force 'day'
  if (timeRange !== '7d') {
    grouping = 'day';
  }
  
  const metrics = await getDailyMetrics(timeRange, grouping);
  return NextResponse.json(metrics);
}
