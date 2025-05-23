/**
 * Shared types for X (Twitter) metrics feature.
 */

export interface XPostData {
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  quotes: number;
  bookmarks: number;
  followers: number;
  postDate: string;
  text: string;
}

export type TimeRange = '7d' | '14d' | '30d' | 'all';

export type XMetricsAggregatedRow = {
  impressions: number;
  engagements: number;
  followers: number;
  date?: string;
  year?: string;
  week?: string;
  month?: string;
  start_date?: string;
  end_date?: string;
  label?: string;
};

export type TwitterListTweet = {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    impressions: number;
    engagements: number;
    [key: string]: number;
  };
  // Add more fields as needed based on actual API response
};

export type TwitterListApiResponse = {
  data: TwitterListTweet[];
  meta?: Record<string, unknown>;
  error?: string;
};