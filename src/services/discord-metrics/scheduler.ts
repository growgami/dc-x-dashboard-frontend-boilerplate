/**
 * Centralized schedule configuration for Discord metrics.
 * Both member and engagement metrics reference this file for their schedule.
 */

export const MEMBER_METRICS_SCHEDULE = '*/30 * * * *'; // Every 30 minutes
export const ENGAGEMENT_METRICS_SCHEDULE = '*/30 * * * *'; // Every 30 minutes

// Add more schedules here as needed for other metrics.