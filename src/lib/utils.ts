import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 
/**
 * Converts a Twitter/X "createdAt" string (e.g., "Wed May 21 18:00:02 +0000 2025")
 * to an ISO 8601 string (e.g., "2025-05-21T18:00:02Z").
 */
export function twitterDateToISO8601(twitterDate: string): string {
  const date = new Date(twitterDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid Twitter date string: ${twitterDate}`);
  }
  return date.toISOString();
}