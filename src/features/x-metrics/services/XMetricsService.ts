import {
  upsertTweetAndMetrics,
  getMetricsByTimeRange,
  getDailyMetrics,
  extractTweetId
} from "./sub/xMetricsDb";
import { fetchTwitterListMetrics } from "./sub/xApiClient";
import type {
  XPostData,
  TimeRange,
  XMetricsAggregatedRow,
  TwitterListTweet,
  TwitterListApiResponse
} from "../types/xMetricsTypes";

/**
 * Business logic service for X (Twitter) metrics.
 * Orchestrates DB and API operations.
 */

export type { XPostData, TimeRange, XMetricsAggregatedRow, TwitterListTweet, TwitterListApiResponse };
export { extractTweetId };

/**
 * Store X (Twitter) post data and metrics in the database.
 * Returns { success, message, updated }
 */
import { twitterDateToISO8601 } from "@/lib/utils";

export async function storeXPostData(
  url: string,
  postData: XPostData
): Promise<{ success: boolean; message?: string; updated?: boolean }> {
  // Defensive: ensure postDate is in YYYY-MM-DD format
  let postDate = postData.postDate;
  if (
    typeof postDate === "string" &&
    /[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{2}:\d{2}:\d{2} \+\d{4} \d{4}/.test(postDate)
  ) {
    postDate = twitterDateToISO8601(postDate).slice(0, 10);
  }
  return upsertTweetAndMetrics(url, { ...postData, postDate });
}

/**
 * Fetch engagement metrics for a given time range.
 */
export async function getXMetricsByTimeRange(timeRange: TimeRange = '7d') {
  return getMetricsByTimeRange(timeRange);
}

/**
 * Fetch daily/weekly/monthly aggregated metrics for a time range.
 */
export async function getXDailyMetrics(
  timeRange: string = '7d',
  grouping: 'day' | 'week' | 'month' = 'day'
) {
  return getDailyMetrics(timeRange, grouping);
}

/**
 * Fetch tweets and their metrics from the Twitter List API for a given time window.
 */
export async function fetchXTwitterListMetrics(
  sinceTime: number,
  untilTime: number
) {
  return fetchTwitterListMetrics(sinceTime, untilTime);
}