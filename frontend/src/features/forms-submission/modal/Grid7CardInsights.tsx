"use client"

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data structure for form submissions
const chartData = [
  { day: "Sunday", dataset1: 125, dataset2: 45 },
  { day: "Monday", dataset1: 285, dataset2: 98 },
  { day: "Tuesday", dataset1: 192, dataset2: 67 },
  { day: "Wednesday", dataset1: 245, dataset2: 88 },
  { day: "Thursday", dataset1: 178, dataset2: 59 },
  { day: "Friday", dataset1: 156, dataset2: 52 },
  { day: "Saturday", dataset1: 134, dataset2: 41 }
];

// Sample detailed insights for form submissions
const detailedInsights = {
  topForms: [
    { 
      id: "f1", 
      content: "Customer Feedback Survey", 
      submissions: 285, 
      completionRate: 92, 
      avgTime: "4:30" 
    },
    { 
      id: "f2", 
      content: "Product Feature Request", 
      submissions: 192, 
      completionRate: 88, 
      avgTime: "6:15" 
    },
    { 
      id: "f3", 
      content: "Support Ticket Submission", 
      submissions: 178, 
      completionRate: 95, 
      avgTime: "3:45" 
    }
  ],
  timeOfDay: [
    { hour: '6am', submissions: 15, activeUsers: 45 },
    { hour: '9am', submissions: 65, activeUsers: 180 },
    { hour: '12pm', submissions: 95, activeUsers: 320 },
    { hour: '3pm', submissions: 85, activeUsers: 280 },
    { hour: '6pm', submissions: 55, activeUsers: 190 },
    { hour: '9pm', submissions: 25, activeUsers: 85 }
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

const Grid7CardInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate total metrics from the latest data point
  const totalMetrics = {
    submissions: chartData[chartData.length - 1].dataset1,
    completionRate: chartData[chartData.length - 1].dataset2,
    avgTime: "4:45"
  };

  // Sample growth percentages
  const percentages = {
    submissions: 12.5,
    completionRate: 8.3,
    avgTime: -5.2
  };

  // Format percentages for display
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-auto">
      {/* Header metrics */}
      <div className="grid grid-cols-3 divide-x divide-white/5 p-4">
        <div className="px-4 py-1 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">SUBMISSIONS</p>
          <div className="text-2xl font-light text-white tracking-wide">{formatNumber(totalMetrics.submissions)}</div>
          <p className={`text-xs mt-0.5 font-medium ${percentages.submissions >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(percentages.submissions)}
          </p>
        </div>
        <div className="px-4 py-1 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">COMPLETION RATE</p>
          <div className="text-2xl font-light text-white tracking-wide">{totalMetrics.completionRate}%</div>
          <p className={`text-xs mt-0.5 font-medium ${percentages.completionRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(percentages.completionRate)}
          </p>
        </div>
        <div className="px-4 py-1 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-0.5">AVG TIME</p>
          <div className="text-2xl font-light text-white tracking-wide">{totalMetrics.avgTime}</div>
          <p className={`text-xs mt-0.5 font-medium ${percentages.avgTime >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercentage(percentages.avgTime)}
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
                  <h3 className="text-sm font-medium text-gray-300 tracking-wide">Submission Trend</h3>
                </div>
                <div className="h-[180px] px-2 py-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(139, 92, 246, 0.3)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(139, 92, 246, 0.1)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCompletionRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgba(59, 130, 246, 0.3)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="rgba(59, 130, 246, 0.1)" stopOpacity={0}/>
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
                        name="Submissions"
                        stroke="rgba(139, 92, 246, 0.8)"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorSubmissions)"
                      />
                      <Area
                        type="monotone"
                        dataKey="dataset2"
                        name="Completion Rate"
                        stroke="rgba(59, 130, 246, 0.8)"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorCompletionRate)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="p-3 border-b border-white/[0.05]">
                  <h3 className="text-sm font-medium text-gray-300 tracking-wide">Top Forms</h3>
                </div>
                <div className="max-h-[200px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-white/[0.02] hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                  <div className="p-3 space-y-2">
                    {detailedInsights.topForms.map((form) => (
                      <div key={form.id} className="bg-white/[0.02] rounded-xl p-3 hover:bg-white/[0.04] transition-colors border border-white/[0.05] grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-6 min-w-0">
                          <p className="text-sm text-white/90 tracking-wide leading-relaxed line-clamp-2">{form.content}</p>
                        </div>
                        <div className="col-span-6 grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">SUBMISSIONS</p>
                            <p className="text-sm font-medium text-white/80">{formatNumber(form.submissions)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">COMPLETION</p>
                            <p className="text-sm font-medium text-white/80">{form.completionRate}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">AVG TIME</p>
                            <p className="text-sm font-medium text-blue-400">{form.avgTime}</p>
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
          <TabsContent value="engagement" className="p-4">
            <div className="space-y-4">
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <div className="p-3 border-b border-white/[0.05]">
                  <h3 className="text-sm font-medium text-gray-300 tracking-wide">Activity by Time</h3>
                </div>
                <div className="h-[180px] px-2 py-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={detailedInsights.timeOfDay}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="hour" 
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
                        dataKey="submissions"
                        name="Submissions"
                        stroke="rgba(139, 92, 246, 0.8)"
                        fill="rgba(139, 92, 246, 0.1)"
                      />
                      <Area
                        type="monotone"
                        dataKey="activeUsers"
                        name="Active Users"
                        stroke="rgba(59, 130, 246, 0.8)"
                        fill="rgba(59, 130, 246, 0.1)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-purple-400">85%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Desktop</p>
                </div>
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-emerald-400">12%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Mobile</p>
                </div>
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-blue-400">3%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Tablet</p>
                </div>
                <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-center">
                  <p className="text-xl font-light text-amber-400">92%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Success Rate</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Grid7CardInsights; 