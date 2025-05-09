
import { getDb } from '@/lib/db';
import type { TweetInsert, TweetMetricsInsert, EngagementMetricsInsert } from '@/lib/db/schema';

export interface XPostData {
  // Engagement metrics
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  quotes: number;
  bookmarks: number;
  // Post metadata
  postDate: string;
  text: string;
}

export interface XLinkData {
  url: string;
  tweetId: string;
  collectedAt: {
    timestamp: number;  // Unix timestamp in milliseconds
    iso: string;       // ISO format
    readable: string;  // Human readable format
  };
  postData: XPostData;
}

export interface EngagementSummary {
  date: string;
  impressions: number;
  engagements: number;
}

export class XLinkProcessor {
  static isValidXLink(url: string): boolean {
    // Check if the URL is from X (twitter.com or x.com)
    return /^https?:\/\/((?:www\.)?(?:twitter\.com|x\.com))\/[a-zA-Z0-9_]+\/status\/[0-9]+/.test(url);
  }

  static extractTweetId(url: string): string {
    const matches = url.match(/\/status\/(\d+)/);
    return matches ? matches[1] : '';
  }

  private static calculateEngagementMetrics(postData: XPostData): EngagementSummary {
    const impressions = postData.views;
    const engagements = postData.likes +
      postData.retweets +
      postData.replies +
      postData.quotes +
      postData.bookmarks;

    return {
      date: new Date().toISOString().split('T')[0],
      impressions,
      engagements
    };
  }

  static async storePostData(url: string, postData: XPostData): Promise<{ success: boolean; message?: string; updated?: boolean }> {
    try {
      const db = await getDb();
      const tweetId = this.extractTweetId(url);

      if (!tweetId) {
        return { success: false, message: 'Could not extract tweet ID from URL' };
      }

      // Start a transaction
      await db.run('BEGIN TRANSACTION');

      try {
        // Check if tweet exists
        const existingTweet = await db.get('SELECT tweet_id FROM tweets WHERE tweet_id = ?', tweetId);

        if (!existingTweet) {
          // Insert new tweet
          const tweetData: TweetInsert = {
            tweet_id: tweetId,
            url,
            text: postData.text,
            post_date: postData.postDate
          };

          await db.run(
            'INSERT INTO tweets (tweet_id, url, text, post_date) VALUES (?, ?, ?, ?)',
            [tweetData.tweet_id, tweetData.url, tweetData.text, tweetData.post_date]
          );
        }

        // Insert metrics
        const metricsData: TweetMetricsInsert = {
          tweet_id: tweetId,
          likes: postData.likes,
          retweets: postData.retweets,
          replies: postData.replies,
          views: postData.views,
          quotes: postData.quotes,
          bookmarks: postData.bookmarks,
          collected_at: new Date().toISOString()
        };

        await db.run(
          'INSERT INTO tweet_metrics (tweet_id, likes, retweets, replies, views, quotes, bookmarks, collected_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [metricsData.tweet_id, metricsData.likes, metricsData.retweets, metricsData.replies, metricsData.views, metricsData.quotes, metricsData.bookmarks, metricsData.collected_at]
        );

        // Calculate and store engagement metrics
        const engagementMetrics = this.calculateEngagementMetrics(postData);
        const engagementData: EngagementMetricsInsert = {
          tweet_id: tweetId,
          date: engagementMetrics.date,
          impressions: engagementMetrics.impressions,
          engagements: engagementMetrics.engagements
        };

        await db.run(
          'INSERT INTO engagement_metrics (tweet_id, date, impressions, engagements) VALUES (?, ?, ?, ?)',
          [engagementData.tweet_id, engagementData.date, engagementData.impressions, engagementData.engagements]
        );

        // Commit transaction
        await db.run('COMMIT');

        return {
          success: true,
          message: existingTweet ? 'Tweet metrics updated' : 'New tweet metrics stored',
          updated: true
        };

      } catch (error) {
        // Rollback on error
        await db.run('ROLLBACK');
        throw error;
      }

    } catch (error) {
      console.error('Error storing X post data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to store X post data'
      };
    }
  }
}
