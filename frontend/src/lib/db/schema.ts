export interface Tweet {
  id: number;
  tweet_id: string;
  url: string;
  text: string;
  post_date: string;
  created_at: string;
  updated_at: string;
}

export interface TweetMetrics {
  id: number;
  tweet_id: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  quotes: number;
  bookmarks: number;
  followers: number;
  collected_at: string;
}

export interface EngagementMetrics {
  id: number;
  date: string;
  impressions: number;
  engagements: number;
  followers: number;
  created_at: string;
}

// Type for inserting a new tweet (without id and timestamps)
export type TweetInsert = Omit<Tweet, 'id' | 'created_at' | 'updated_at'>;

// Type for inserting new metrics (without id)
export type TweetMetricsInsert = Omit<TweetMetrics, 'id'>;

// Type for inserting new engagement metrics (without id and created_at)
export type EngagementMetricsInsert = Omit<EngagementMetrics, 'id' | 'created_at'>;