"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Users, Search, Calendar, Star } from "lucide-react";
import { leaderboard } from "@/mocks/mock-data";
import { cn } from "@/lib/utils";

function LeaderboardContent() {
  const [activeTab, setActiveTab] = useState("Weekly");
  const [loading, setLoading] = useState(false);
  const data = leaderboard[activeTab] || leaderboard["Weekly"];

  const handleTabChange = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Student Leaderboard</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Honoring academic excellence, consistency, and platform participation.</p>
        </div>
        
        {/* Tab switchers */}
        <div className="flex gap-1.5 bg-secondary/60 rounded-xl p-1 border border-gray-250 shrink-0">
          {["Weekly", "Monthly", "Grade 10"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeTab === tab ? "bg-white text-blue-650 shadow-sm" : "text-gray-600 hover:text-gray-900"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Top Students - {activeTab} Scope</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Rankings are calculated dynamically based on average test scores (60%), study hours (30%), and attendance (10%).</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="w-full">
              <div className="border-b border-gray-200 bg-gray-50/50 h-12 animate-pulse flex items-center px-6">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="py-4.5 px-6 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-150 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-7 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Attendance Log</th>
                    <th className="py-3 px-4 text-center">Study Time</th>
                    <th className="py-3 px-4 text-right">Avg Score</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Honor Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        {item.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full bg-amber-100 text-amber-700 font-extrabold border border-amber-300 shadow-sm">🥇</span>
                        ) : item.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full bg-slate-100 text-slate-700 font-extrabold border border-slate-350 shadow-sm">🥈</span>
                        ) : item.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7.5 h-7.5 rounded-full bg-amber-50 text-amber-900 font-extrabold border border-amber-250 shadow-sm">🥉</span>
                        ) : (
                          <span className="font-extrabold text-gray-500">{item.rank}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold text-[10px] flex items-center justify-center">
                          {item.avatar}
                        </div>
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-600">{item.class}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700">{item.attendance}%</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-750">{item.studyHours} hrs</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-blue-650">{item.score}%</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-250 font-extrabold text-[9px] rounded-full px-2.5 py-0.5">
                          {item.badge}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <LeaderboardContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
