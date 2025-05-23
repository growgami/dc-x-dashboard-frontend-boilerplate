/**
 * Grid3CardInsights
 * -----------------------------------------------------------------------------
 * EXAMPLE INSIGHT CHILD COMPONENT
 *
 * This component demonstrates the pattern for an "insight" card to be rendered
 * inside InsightsModal. To create a new insight card:
 *
 * 1. Create a new file (e.g., GridXCardInsights.tsx) in this directory.
 * 2. Export a React component that receives any required props (optionally typed).
 * 3. Implement your insight UI using Card/CardContent or your preferred layout.
 * 4. (Optional) Accept props from InsightsModal via the `data` prop.
 * 5. Register your new component in InsightsModal's cardComponentMap and import it.
 *
 * Best Practices:
 * - Use clear prop types for any data your insight needs.
 * - Keep the component focused on a single insight or metric group.
 * - Add inline comments to clarify logic or data mapping.
 *
 * See: src/components/modals/InsightsModal.tsx for integration steps.
 */

"use client"

import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Area,
  AreaChart
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useTimeRange } from "../../../context/TimeRangeContext";
import { useXMetrics } from "../hooks/useXChartMetrics";

// Additional detailed metrics that would be fetched from API in a real implementation
const detailedInsights = {
  topPosts: [
    { 
      id: "p1", 
      content: "Platform update announcement...", 
      impressions: 44250, 
      engagements: 2145, 
      engagementRate: "4.8%" 
    },
    { 
      id: "p2", 
      content: "New feature thread...", 
      impressions: 28920, 
      engagements: 1432, 
      engagementRate: "4.9%" 
    },
    { 
      id: "p3", 
      content: "Industry trend analysis...", 
      impressions: 25030, 
      engagements: 723, 
      engagementRate: "2.9%" 
    }
  ],
  timeOfDay: [
    { hour: '6am', posts: 2, engagementRate: 1.2 },
    { hour: '9am', posts: 5, engagementRate: 3.8 },
    { hour: '12pm', posts: 8, engagementRate: 4.2 },
    { hour: '3pm', posts: 10, engagementRate: 5.1 },
    { hour: '6pm', posts: 7, engagementRate: 4.5 },
    { hour: '9pm', posts: 5, engagementRate: 3.7 }
  ]
};

// Format numbers with decimal cutoffs (1000 -> 1k)
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    const millions = num / 1000000;
    return `${Math.round(millions * 10) / 10}M`;
  } else if (num >= 1000) {
    const thousands = num / 1000;
    return `${Math.round(thousands * 10) / 10}K`;
  }
  return Math.round(num).toString();
};

const Grid3CardInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { timeRange } = useTimeRange();
  const { chartData, percentages, isLoading } = useXMetrics({ timeRange });

  // Format the percentages for display
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Get total metrics
  const totalMetrics = chartData.length > 0 ? {
    followers: chartData[chartData.length - 1].dataset1,
    impressions: chartData[chartData.length - 1].dataset2,
    engagements: chartData[chartData.length - 1].dataset3
  } : {
    followers: 0,
    impressions: 0,
    engagements: 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      {/* Header metrics */}
      <div className="grid grid-cols-3 divide-x divide-white/5 p-4">
        <div className="px-4 py-1 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">FOLLOWERS</p>
          <div className="text-2xl font-light text-white tracking-wide">{formatNumber(totalMetrics.followers)}</div>
          <p className={`text-xs mt-0.5 font-medium ${percentages.followers >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(percentages.followers)}
          </p>
        </div>
        <div className="px-4 py-1 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">IMPRESSIONS</p>
          <div className="text-2xl font-light text-white tracking-wide">{formatNumber(totalMetrics.impressions)}</div>
          <p className={`text-xs mt-0.5 font-medium ${percentages.impressions >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(percentages.impressions)}
          </p>
        </div>
        <div className="px-4 py-1 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">ENGAGEMENTS</p>
          <div className="text-2xl font-light text-white tracking-wide">{formatNumber(totalMetrics.engagements)}</div>
          <p className={`text-xs mt-0.5 font-medium ${percentages.engagements >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(percentages.engagements)}
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full border-b border-white/5 mb-0 bg-transparent justify-evenly px-6">
            <TabsTrigger 
              value="overview" 
              className="py-2 px-4 text-xs tracking-wide rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400/70 data-[state=active]:text-purple-400 text-gray-400 transition-colors bg-transparent hover:text-purple-400/70"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="engagement" 
              className="py-2 px-4 text-xs tracking-wide rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400/70 data-[state=active]:text-purple-400 text-gray-400 transition-colors bg-transparent hover:text-purple-400/70"
            >
              Engagement
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="p-3 border-b border-white/[0.05]">
                  <h3 className="text-sm font-medium text-gray-300 tracking-wide">Growth Trend</h3>
                </div>
                <div className="h-[180px] px-2 py-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(139, 92, 246, 0.3)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(139, 92, 246, 0.1)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(59, 130, 246, 0.3)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(59, 130, 246, 0.1)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEngagements" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(16, 185, 129, 0.3)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(16, 185, 129, 0.1)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                        tickLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 17, 17, 0.95)', 
                          borderColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '0.5rem',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          color: 'rgba(255,255,255,0.9)'
                        }}
                        labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                        itemStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}
                      />
                      <Legend 
                        iconSize={8}
                        wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="dataset1"
                        name="Followers"
                        stroke="rgba(139, 92, 246, 0.8)"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorFollowers)"
                      />
                      <Area
                        type="monotone"
                        dataKey="dataset2"
                        name="Impressions"
                        stroke="rgba(59, 130, 246, 0.8)"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorImpressions)"
                      />
                      <Area
                        type="monotone"
                        dataKey="dataset3"
                        name="Engagements"
                        stroke="rgba(16, 185, 129, 0.8)"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorEngagements)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="p-3 border-b border-white/[0.05]">
                  <h3 className="text-sm font-medium text-gray-300 tracking-wide">Top Performing Posts</h3>
                </div>
                <div className="max-h-[200px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-white/[0.02] hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                  <div className="p-3 space-y-2">
                    {detailedInsights.topPosts.map((post) => (
                      <div key={post.id} className="bg-white/[0.02] rounded-xl p-3 hover:bg-white/[0.04] transition-colors border border-white/[0.05] grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-6 min-w-0">
                          <p className="text-sm text-white/90 tracking-wide leading-relaxed line-clamp-2">{post.content}</p>
                        </div>
                        <div className="col-span-6 grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">IMPRESSIONS</p>
                            <p className="text-sm font-medium text-white/80">{formatNumber(post.impressions)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">ENGAGEMENTS</p>
                            <p className="text-sm font-medium text-white/80">{formatNumber(post.engagements)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">RATE</p>
                            <p className="text-sm font-medium text-blue-400">{post.engagementRate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="p-6">
            <div className="space-y-6">
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="p-4 border-b border-white/[0.05]">
                  <h3 className="text-sm font-medium text-gray-300 tracking-wide">Optimal Posting Times</h3>
                </div>
                <div className="p-4">
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={detailedInsights.timeOfDay}
                        margin={{ top: 5, right: 15, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis 
                          dataKey="hour" 
                          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                          tickLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                        />
                        <YAxis 
                          yAxisId="left"
                          orientation="left"
                          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                          tickLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                          axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                          tickLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(17, 17, 17, 0.95)',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '0.5rem',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            color: 'rgba(255,255,255,0.9)'
                          }}
                          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                          itemStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}
                        />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        <Line
                          yAxisId="left"
                          name="Posts"
                          type="monotone"
                          dataKey="posts"
                          stroke="rgba(139, 92, 246, 0.8)"
                          strokeWidth={2}
                          dot={{ r: 4, fill: 'rgba(139, 92, 246, 0.8)' }}
                        />
                        <Line
                          yAxisId="right"
                          name="Engagement Rate"
                          type="monotone"
                          dataKey="engagementRate"
                          stroke="rgba(59, 130, 246, 0.8)"
                          strokeWidth={2}
                          dot={{ r: 4, fill: 'rgba(59, 130, 246, 0.8)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-purple-400">65%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Likes</p>
                </div>
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-emerald-400">22%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Reposts</p>
                </div>
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-blue-400">10%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Replies</p>
                </div>
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-amber-400">3%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Quotes</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Grid3CardInsights;