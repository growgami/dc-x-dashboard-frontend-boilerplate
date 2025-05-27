"use client"

import { forwardRef, useMemo, useCallback } from 'react';
import { Globe } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/cards/Card"
import { useTimeRange } from "@/context/TimeRangeContext"

// Real data from website-metrics.csv
const rawWebsiteData = [
  { date: "2025-04-01", activeUsers: 21, newUsers: 14, avgEngagement: 60.76 },
  { date: "2025-04-02", activeUsers: 31, newUsers: 22, avgEngagement: 16.29 },
  { date: "2025-04-03", activeUsers: 30, newUsers: 21, avgEngagement: 25.93 },
  { date: "2025-04-04", activeUsers: 51, newUsers: 41, avgEngagement: 11.24 },
  { date: "2025-04-05", activeUsers: 8, newUsers: 7, avgEngagement: 18.00 },
  { date: "2025-04-06", activeUsers: 9, newUsers: 8, avgEngagement: 4.33 },
  { date: "2025-04-07", activeUsers: 46, newUsers: 31, avgEngagement: 43.85 },
  { date: "2025-04-08", activeUsers: 205, newUsers: 191, avgEngagement: 16.08 },
  { date: "2025-04-09", activeUsers: 59, newUsers: 44, avgEngagement: 54.03 },
  { date: "2025-04-10", activeUsers: 55, newUsers: 42, avgEngagement: 37.62 },
  { date: "2025-04-11", activeUsers: 35, newUsers: 24, avgEngagement: 22.77 },
  { date: "2025-04-12", activeUsers: 17, newUsers: 15, avgEngagement: 63.71 },
  { date: "2025-04-13", activeUsers: 7, newUsers: 5, avgEngagement: 54.86 },
  { date: "2025-04-14", activeUsers: 42, newUsers: 26, avgEngagement: 27.81 },
  { date: "2025-04-15", activeUsers: 29, newUsers: 20, avgEngagement: 80.97 },
  { date: "2025-04-16", activeUsers: 33, newUsers: 26, avgEngagement: 42.64 },
  { date: "2025-04-17", activeUsers: 31, newUsers: 21, avgEngagement: 22.84 },
  { date: "2025-04-18", activeUsers: 4, newUsers: 3, avgEngagement: 19.50 },
  { date: "2025-04-19", activeUsers: 11, newUsers: 12, avgEngagement: 8.09 },
  { date: "2025-04-20", activeUsers: 8, newUsers: 8, avgEngagement: 28.75 },
  { date: "2025-04-21", activeUsers: 20, newUsers: 14, avgEngagement: 14.45 },
  { date: "2025-04-22", activeUsers: 27, newUsers: 20, avgEngagement: 29.59 },
  { date: "2025-04-23", activeUsers: 40, newUsers: 27, avgEngagement: 48.75 },
  { date: "2025-04-24", activeUsers: 221, newUsers: 210, avgEngagement: 34.03 },
  { date: "2025-04-25", activeUsers: 1660, newUsers: 1644, avgEngagement: 32.64 },
  { date: "2025-04-26", activeUsers: 923, newUsers: 895, avgEngagement: 28.63 },
  { date: "2025-04-27", activeUsers: 246, newUsers: 226, avgEngagement: 30.51 },
  { date: "2025-04-28", activeUsers: 238, newUsers: 204, avgEngagement: 28.57 },
  { date: "2025-04-29", activeUsers: 344, newUsers: 303, avgEngagement: 29.17 },
  { date: "2025-04-30", activeUsers: 175, newUsers: 157, avgEngagement: 42.85 },
  { date: "2025-05-01", activeUsers: 128, newUsers: 114, avgEngagement: 41.15 },
  { date: "2025-05-02", activeUsers: 113, newUsers: 93, avgEngagement: 40.83 },
  { date: "2025-05-03", activeUsers: 73, newUsers: 61, avgEngagement: 30.42 },
  { date: "2025-05-04", activeUsers: 52, newUsers: 46, avgEngagement: 28.12 },
  { date: "2025-05-05", activeUsers: 106, newUsers: 85, avgEngagement: 33.69 },
  { date: "2025-05-06", activeUsers: 134, newUsers: 110, avgEngagement: 33.94 },
  { date: "2025-05-07", activeUsers: 97, newUsers: 78, avgEngagement: 27.94 },
  { date: "2025-05-08", activeUsers: 80, newUsers: 53, avgEngagement: 34.75 },
  { date: "2025-05-09", activeUsers: 62, newUsers: 44, avgEngagement: 22.71 },
  { date: "2025-05-10", activeUsers: 37, newUsers: 28, avgEngagement: 32.65 },
  { date: "2025-05-11", activeUsers: 55, newUsers: 45, avgEngagement: 54.55 },
  { date: "2025-05-12", activeUsers: 76, newUsers: 54, avgEngagement: 18.36 },
  { date: "2025-05-13", activeUsers: 170, newUsers: 141, avgEngagement: 29.36 },
  { date: "2025-05-14", activeUsers: 44, newUsers: 29, avgEngagement: 22.23 },
  { date: "2025-05-15", activeUsers: 82, newUsers: 55, avgEngagement: 43.96 },
  { date: "2025-05-16", activeUsers: 61, newUsers: 49, avgEngagement: 19.54 },
  { date: "2025-05-17", activeUsers: 38, newUsers: 30, avgEngagement: 25.84 },
  { date: "2025-05-18", activeUsers: 21, newUsers: 19, avgEngagement: 23.52 },
  { date: "2025-05-19", activeUsers: 124, newUsers: 105, avgEngagement: 21.25 },
  { date: "2025-05-20", activeUsers: 394, newUsers: 379, avgEngagement: 240.98 },
  { date: "2025-05-21", activeUsers: 525, newUsers: 501, avgEngagement: 315.85 },
  { date: "2025-05-22", activeUsers: 440, newUsers: 420, avgEngagement: 316.69 },
  { date: "2025-05-23", activeUsers: 191, newUsers: 179, avgEngagement: 319.22 },
  { date: "2025-05-24", activeUsers: 33, newUsers: 29, avgEngagement: 26.70 },
  { date: "2025-05-25", activeUsers: 39, newUsers: 31, avgEngagement: 53.79 },
  { date: "2025-05-26", activeUsers: 12, newUsers: 4, avgEngagement: 29.75 }
]

const Grid9Card = forwardRef<HTMLDivElement>((props, ref) => {
  const { timeRange } = useTimeRange()

  // Helper function to get normalized daily data (last 7 days)
  const getNormalizedDailyData = useCallback(() => {
    const dateMap = new Map<string, typeof rawWebsiteData[0]>();
    rawWebsiteData.forEach(item => {
      dateMap.set(item.date, item);
    });
    
    // Get the last 7 days from the latest date in our data
    const latestDataDate = new Date("2025-05-26");
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(latestDataDate);
      date.setDate(latestDataDate.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = dateMap.get(dateStr);
      
      if (dayData) {
        last7Days.push(dayData);
      }
    }
    
    return last7Days;
  }, []);

  const websiteMetrics = useMemo(() => {
    let currentData, previousData;
    
    switch (timeRange) {
      case "daily":
        // Last 7 days for current period
        currentData = getNormalizedDailyData();
        // Previous 7 days for comparison
        const dateMap = new Map<string, typeof rawWebsiteData[0]>();
        rawWebsiteData.forEach(item => {
          dateMap.set(item.date, item);
        });
        
        const latestDataDate = new Date("2025-05-26");
        previousData = [];
        for (let i = 13; i >= 7; i--) {
          const date = new Date(latestDataDate);
          date.setDate(latestDataDate.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const dayData = dateMap.get(dateStr);
          if (dayData) previousData.push(dayData);
        }
        break;
        
      case "weekly":
        // Get last 8 weeks of data, group by weeks
        const weeklyData = [];
        const weeklyPreviousData = [];
        
        // Group data into weeks (7-day chunks)
        for (let i = rawWebsiteData.length - 1; i >= 0; i -= 7) {
          const weekData = rawWebsiteData.slice(Math.max(0, i - 6), i + 1);
          const weekTotal = weekData.reduce((sum, day) => sum + day.activeUsers, 0);
          
          if (weeklyData.length < 4) {
            weeklyData.unshift({ activeUsers: weekTotal, date: weekData[0]?.date });
          } else if (weeklyPreviousData.length < 4) {
            weeklyPreviousData.unshift({ activeUsers: weekTotal, date: weekData[0]?.date });
          }
        }
        
        currentData = weeklyData;
        previousData = weeklyPreviousData;
        break;
        
      case "monthly":
        // Group by calendar months
        const monthMap = new Map<string, number>();
        rawWebsiteData.forEach(item => {
          const monthKey = item.date.substring(0, 7); // YYYY-MM
          monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + item.activeUsers);
        });
        
        const sortedMonths = Array.from(monthMap.entries()).sort();
        const recentMonths = sortedMonths.slice(-6);
        const previousMonths = sortedMonths.slice(-12, -6);
        
        currentData = recentMonths.slice(-3).map(([month, total]) => ({ activeUsers: total, date: month + "-01" }));
        previousData = previousMonths.slice(-3).map(([month, total]) => ({ activeUsers: total, date: month + "-01" }));
        break;
        
      default:
        currentData = rawWebsiteData.slice(-7);
        previousData = rawWebsiteData.slice(-14, -7);
    }

    if (!currentData || currentData.length === 0) {
      return { visits: 0, dailyGrowth: 0, weeklyGrowth: 0, peakHour: "2-4 PM" };
    }

    // Calculate current period metrics
    const currentTotal = currentData.reduce((sum, day) => sum + day.activeUsers, 0);
    const currentAvg = currentTotal / currentData.length;
    
    // Calculate previous period metrics
    const previousTotal = previousData ? previousData.reduce((sum, day) => sum + day.activeUsers, 0) : 0;
    const previousAvg = previousData && previousData.length > 0 ? previousTotal / previousData.length : 0;
    
    // Calculate growth rates
    let dailyGrowth = 0;
    let weeklyGrowth = 0;
    
    if (timeRange === "daily" && currentData.length >= 2) {
      const yesterday = currentData[currentData.length - 2].activeUsers;
      const today = currentData[currentData.length - 1].activeUsers;
      dailyGrowth = yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0;
    }
    
    // Weekly growth calculation (current period vs previous period)
    if (previousAvg > 0) {
      weeklyGrowth = ((currentAvg - previousAvg) / previousAvg) * 100;
    }
    
    // Determine peak hours based on recent high-activity days
    const highActivityDays = currentData.filter(day => day.activeUsers > 100);
    const peakHour = highActivityDays.length > 0 ? "2-4 PM" : "1-3 PM";
    
    // Display logic based on time range
    let displayVisits;
    switch (timeRange) {
      case "daily":
        displayVisits = currentTotal; // Total visits for the week
        break;
      case "weekly":
        displayVisits = Math.round(currentAvg); // Average weekly visits
        break;
      case "monthly":
        displayVisits = Math.round(currentAvg); // Average monthly visits
        break;
      default:
        displayVisits = currentTotal;
    }
    
    return {
      visits: displayVisits,
      dailyGrowth,
      weeklyGrowth,
      peakHour
    };
  }, [timeRange, getNormalizedDailyData]);

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getDisplayLabel = () => {
    switch (timeRange) {
      case "daily": return "Daily Visits";
      case "weekly": return "Avg Weekly Visits"; 
      case "monthly": return "Avg Monthly Visits";
      default: return "Website Visits";
    }
  };

  return (
    <Card
      ref={ref}
      className="col-start-4 row-start-4 col-span-2 transition-all duration-300 hover:shadow-xl shadow-[-2px_-2px_8px_#ffffff,8px_8px_16px_#d1d1d1]"
    >
      <CardContent className="p-6 h-full flex items-center justify-center">
        <div className="flex items-center justify-center gap-12">
          <div className="flex items-baseline gap-3">
            <Globe className="h-8 w-8 text-gray-800 mb-1" />
            <span className="text-6xl font-bold text-gray-900">{websiteMetrics.visits.toLocaleString()}</span>
            <span className="text-2xl text-gray-800">{getDisplayLabel()}</span>
          </div>
          <div className="flex flex-col items-left gap-3">
            <span className="text-lg text-gray-700">
              {formatGrowth(websiteMetrics.dailyGrowth)} from yesterday
            </span>
            <span className="text-lg text-gray-700">
              {formatGrowth(websiteMetrics.weeklyGrowth)} from last week
            </span>
            <span className="text-gray-700 text-lg">Peak hours: {websiteMetrics.peakHour}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

Grid9Card.displayName = 'Grid9Card';

export default Grid9Card; 