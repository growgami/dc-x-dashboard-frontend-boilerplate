'use client'

import { useState, useEffect, useRef } from 'react'

interface SubmissionState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

interface RecentSubmission {
  tweetId: string;
  timestamp: number;
}

export const useXLinkSubmission = () => {
  const [state, setState] = useState<SubmissionState>({
    isLoading: false,
    error: null,
    isSuccess: false
  })

  // Keep track of recent submissions (5 minute cooldown)
  const recentSubmissionsRef = useRef<RecentSubmission[]>([]);
  const SUBMISSION_COOLDOWN = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Clear messages after delay
  useEffect(() => {
    if (state.error || state.isSuccess) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, error: null, isSuccess: false }))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state.error, state.isSuccess])

  const cleanXLink = (link: string): string | null => {
    // Extract the tweet ID using regex
    const matches = link.match(/\/status\/(\d+)/);
    return matches ? matches[1] : null;
  }

  const isValidXLink = (url: string): boolean => {
    return /^https?:\/\/((?:www\.)?(?:twitter\.com|x\.com))\/[a-zA-Z0-9_]+\/status\/[0-9]+/.test(url);
  }

  const canSubmitTweet = (tweetId: string): boolean => {
    const now = Date.now();
    // Clean up old submissions
    recentSubmissionsRef.current = recentSubmissionsRef.current.filter(
      sub => now - sub.timestamp < SUBMISSION_COOLDOWN
    );

    // Check if this tweet was recently submitted
    const recentSubmission = recentSubmissionsRef.current.find(
      sub => sub.tweetId === tweetId
    );

    if (recentSubmission) {
      const timeLeft = Math.ceil((SUBMISSION_COOLDOWN - (now - recentSubmission.timestamp)) / 1000);
      setState({
        isLoading: false,
        error: `Please wait ${timeLeft} seconds before resubmitting this tweet`,
        isSuccess: false
      });
      return false;
    }

    return true;
  }

  const submitXLink = async (link: string) => {
    if (!link.trim()) {
      setState({ isLoading: false, error: 'Please enter a valid X link', isSuccess: false })
      return
    }

    // First validate the full URL format
    if (!isValidXLink(link)) {
      setState({ isLoading: false, error: 'Invalid X link format', isSuccess: false })
      return
    }

    // Then extract the tweet ID
    const tweetId = cleanXLink(link);
    if (!tweetId) {
      setState({ isLoading: false, error: 'Could not extract tweet ID from link', isSuccess: false })
      return
    }

    // Check submission cooldown
    if (!canSubmitTweet(tweetId)) {
      return;
    }

    setState({ isLoading: true, error: null, isSuccess: false })

    try {
      const response = await fetch('/api/link-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link: tweetId })
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit link');
      }

      // Add to recent submissions only if it was actually updated
      if (data.updated) {
        recentSubmissionsRef.current.push({
          tweetId,
          timestamp: Date.now()
        });
      }

      setState({ 
        isLoading: false, 
        error: null, 
        isSuccess: true 
      });

      // Show "already up to date" message if not updated
      if (!data.updated) {
        setState(prev => ({ 
          ...prev, 
          error: 'This tweet\'s metrics are already up to date' 
        }));
      }

    } catch (error) {
      setState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isSuccess: false 
      })
    }
  }

  return {
    ...state,
    submitXLink
  }
}
