"use client";

import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { PieChart, GraduationCap, TrendingUp } from "lucide-react";

const mockAcademicData = [
  { term: "Midterm 1", math: 78, science: 72, english: 84 },
  { term: "Final Term 1", math: 80, science: 75, english: 86 },
  { term: "Midterm 2", math: 82, science: 79, english: 88 },
  { term: "Final Term 2", math: 85, science: 83, english: 90 }
];

function AcademicAnalyticsContent() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Academic Analytics</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Review school-wide average performance and growth curves across terms.</p>
      </div>

      {/* Line Chart */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-500" />
            <span>Subject Growth Curve</span>
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 font-semibold">Track average progress across math, science, and English this session.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAcademicData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="term" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="math" stroke="#3B82F6" strokeWidth={3} name="Mathematics" />
                <Line type="monotone" dataKey="science" stroke="#10B981" strokeWidth={3} name="Science" />
                <Line type="monotone" dataKey="english" stroke="#F59E0B" strokeWidth={3} name="English" />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
