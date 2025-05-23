import { NextRequest, NextResponse } from 'next/server';
import { getDailyMetrics } from '@/features/x-metrics/services/sub/xMetricsDb';
import type { XMetricsAggregatedRow } from '@/features/x-metrics/types/xMetricsTypes';

import { seedXMockData } from '@/data/mock/x-metrics/x-mock';

export async function GET(
  request: NextRequest
): Promise<NextResponse<XMetricsAggregatedRow[]>> {
  // Get timeRange and grouping from query params
  const searchParams = request.nextUrl.searchParams;
  const timeRange = (searchParams.get('timeRange') || 'daily');
  // Sanitize grouping: only allow 'day', 'week', or 'month'
  const rawGrouping = searchParams.get('grouping') || 'day';
  let grouping: 'day' | 'week' | 'month' = 'day';
  if (rawGrouping.startsWith('week')) {
    grouping = 'week';
  } else if (rawGrouping.startsWith('month')) {
    grouping = 'month';
  } else {
    grouping = 'day';
  }
  let effectiveTimeRange: string = '7d';

  // If grouping is not provided, infer from timeRange
  if (!searchParams.get('grouping')) {
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
  } else {
    // If grouping is provided, use timeRange for effectiveTimeRange
    if (timeRange === 'daily') {
      effectiveTimeRange = '7d';
    } else {
      effectiveTimeRange = 'all';
    }
  }

  const metrics = await getDailyMetrics(effectiveTimeRange, grouping);
  console.log("[x-metrics] API response for", { timeRange: effectiveTimeRange, grouping }, metrics);
  return NextResponse.json(metrics);
}

export async function POST(): Promise<NextResponse<{ success: boolean; message: string }>> {
  try {
    const result = await seedXMockData();
    return NextResponse.json({ success: true, message: result.message });
  } catch (err: unknown) {
    console.error("[x-mock] Seeding failed:", err);
    const message = typeof err === "object" && err && "message" in err
      ? (err as { message?: string }).message || "Unknown error"
      : "Unknown error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
