import { NextRequest, NextResponse } from 'next/server';
import { XLinkProcessor } from '@/services/x-metrics/XLinkProcessor';
import axios from 'axios';
import type { XPostData } from '@/services/x-metrics/XLinkProcessor';

async function fetchPostData(tweetId: string): Promise<XPostData> {
  try {
    const response = await axios.get(`https://api.twitterapi.io/twitter/tweets`, {
      headers: {
        'X-API-Key': process.env.TWITTER_API_KEY
      },
      params: {
        tweet_ids: tweetId
      }
    });

    // Check if we got valid data back
    if (!response.data.tweets || !response.data.tweets[0]) {
      throw new Error('No tweet data found');
    }

    const tweet = response.data.tweets[0];

    return {
      // Engagement metrics
      likes: tweet.likeCount,
      retweets: tweet.retweetCount,
      replies: tweet.replyCount,
      views: tweet.viewCount,
      quotes: tweet.quoteCount,
      bookmarks: tweet.bookmarkCount,
      // Post metadata
      postDate: tweet.createdAt,
      text: tweet.text
    };

  } catch (error) {
    console.error('Error fetching tweet data:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Log more detailed API error information
      console.error('API Error Response:', error.response.data);
      throw new Error(`Twitter API Error: ${error.response.data.msg || 'Unknown error'}`);
    }
    throw new Error('Failed to fetch tweet data from Twitter API');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { link: tweetId } = body;

    if (!tweetId) {
      return NextResponse.json(
        { success: false, message: 'Tweet ID is required' },
        { status: 400 }
      );
    }

    // Validate tweet ID format (should be a string of numbers)
    if (!/^\d+$/.test(tweetId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid tweet ID format' },
        { status: 400 }
      );
    }

    // Fetch post data from Twitter API
    const postData = await fetchPostData(tweetId);

    // Store the data with the full URL reconstructed
    const fullUrl = `https://x.com/i/status/${tweetId}`;
    const result = await XLinkProcessor.storePostData(fullUrl, postData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to store post data' },
        { status: 500 }
      );
    }

    // Return appropriate message based on whether data was updated
    return NextResponse.json({
      success: true,
      message: result.message,
      updated: result.updated
    });

  } catch (error) {
    console.error('Error in link submission API:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
