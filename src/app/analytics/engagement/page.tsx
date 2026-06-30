"use client";

import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Activity, Clock } from "lucide-react";

const mockEngagementData = [
  { name: "Mon", video: 240, notes: 300, quizzes: 180 },
  { name: "Tue", video: 280, notes: 320, quizzes: 210 },
  { name: "Wed", video: 310, notes: 350, quizzes: 250 },
  { name: "Thu", video: 290, notes: 330, quizzes: 220 },
  { name: "Fri", video: 350, notes: 380, quizzes: 270 }
];

function EngagementAnalyticsContent() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Platform Engagement Analytics</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Review active student learning resource usage logs.</p>
      </div>

      {/* Engagement Chart */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" />
            <span>Learning Resource Access Logs</span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold">Video lecture views, revision notes reads, and quiz completions this week.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockEngagementData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Bar dataKey="video" fill="#3B82F6" name="Videos Watched" />
                <Bar dataKey="notes" fill="#10B981" name="Revision Notes Accessed" />
                <Bar dataKey="quizzes" fill="#F59E0B" name="Quiz Completions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
