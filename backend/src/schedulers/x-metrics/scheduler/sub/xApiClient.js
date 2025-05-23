import fetch from 'node-fetch';

/**
 * Fetches tweets and their metrics from the Twitter List API for a given time window.
 */
async function fetchTwitterListMetrics(sinceTime, untilTime) {
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
    const json = await response.json();
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error('Invalid Twitter List API response: missing or malformed "data" field');
    }
    return json.data;
  } catch (error) {
    throw error;
  }
}

export { fetchTwitterListMetrics };