"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { schoolDataApi, EngagementSummary } from "@/services/school-data-api";
import { Activity, Flame } from "lucide-react";

function EngagementAnalyticsContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EngagementSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getEngagement()
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const chartData = data ? [
    { name: 'Active Today', value: data.activeToday },
    { name: 'Active This Week', value: data.activeThisWeek },
    { name: 'Active This Month', value: data.activeThisMonth },
    { name: 'Inactive', value: data.inactive },
  ] : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Student Engagement Analytics</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">How recently students accessed any of their enrolled courses.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <span>Activity Recency</span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold">
            {data ? `${data.total} student${data.total === 1 ? '' : 's'} linked to this school.` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />
          ) : !data || data.total === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-400 font-semibold">
              No students linked to this school yet.
            </div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Login Streaks</span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold">
            Consecutive-day app usage — a leading indicator of habit, not just recency.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ) : !data || data.total === 0 ? (
            <div className="h-24 flex items-center justify-center text-sm text-gray-400 font-semibold">
              No students linked to this school yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-semibold">Students on an active streak</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{data.studentsOnActiveStreak}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-semibold">Avg. current streak</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{data.avgCurrentStreak} day{data.avgCurrentStreak === 1 ? '' : 's'}</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-semibold">School's longest streak</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{data.longestStreak} day{data.longestStreak === 1 ? '' : 's'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function EngagementAnalyticsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <EngagementAnalyticsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
