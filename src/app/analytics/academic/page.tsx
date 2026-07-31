"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { schoolDataApi, AcademicAnalytics } from "@/services/school-data-api";
import { TrendingUp, GraduationCap } from "lucide-react";

function AcademicAnalyticsContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AcademicAnalytics | null>(null);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getAcademicAnalytics()
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const hasTrend = data && data.weeklyTrend.some(w => w.attemptCount > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Academic Analytics</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Assessment score trends and course progress by program.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span>Assessment Score Trend (Last 8 Weeks)</span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold">Average score across all quizzes/tests taken by this school's students.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />
          ) : hasTrend ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data!.weeklyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                  <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={3} name="Avg Score %" connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-400 font-semibold">
              No test attempts recorded yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            <span>Course Progress by Program</span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold">Average enrollment progress grouped by program (SEE, +2, etc.).</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-[280px] bg-gray-100 rounded-xl animate-pulse" />
          ) : data && data.byProgram.length > 0 ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byProgram} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="program" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                  <Bar dataKey="avgProgress" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Avg Progress %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-gray-400 font-semibold">
              No enrollments yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcademicAnalyticsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AcademicAnalyticsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
