import fetch from 'node-fetch';

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

/**
 * Fetches tweets and their metrics from the Twitter List API for a given time window.
 */
export async function fetchTwitterListMetrics(
  sinceTime: number,
  untilTime: number
): Promise<TwitterListTweet[]> {
  const url = `https://api.twitterapi.io/twitter/list/tweets?listId=1925252393136267285&sinceTime=${sinceTime}&untilTime=${untilTime}`;
  const headers = {
    'X-API-Key': '2a306a7bd2b24c579a03afe1e6817309',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Twitter List API error: ${response.status} ${response.statusText} - ${text}`);
    }
    const json = (await response.json()) as TwitterListApiResponse;
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid Twitter List API response: missing or malformed "data" field');
    }
    return json.data;
  } catch (error) {
    // Optionally log error here
    throw error;
  }
}