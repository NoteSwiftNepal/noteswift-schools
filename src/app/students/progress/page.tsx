"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, TrendingDown, BookOpen, GraduationCap, AlertTriangle, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock progress data for selected grade
const progressData: Record<string, {
  subjectAverages: Array<{ subject: string; classAvg: number; schoolAvg: number }>;
  studentPerformance: Array<{ name: string; score: number; difference: number; status: 'above' | 'below' | 'neutral' }>;
  termTrends: Array<{ term: string; score: number }>;
}> = {
  "Grade 10": {
    subjectAverages: [
      { subject: 'Mathematics', classAvg: 84, schoolAvg: 80 },
      { subject: 'Science', classAvg: 79, schoolAvg: 77 },
      { subject: 'English', classAvg: 86, schoolAvg: 84 },
      { subject: 'Social Studies', classAvg: 75, schoolAvg: 74 },
      { subject: 'Computer Sci', classAvg: 89, schoolAvg: 86 },
      { subject: 'Nepali', classAvg: 72, schoolAvg: 71 }
    ],
    studentPerformance: [
      { name: "Siddharth Adhikari", score: 96.5, difference: 14.5, status: 'above' },
      { name: "Pooja Shrestha", score: 95.2, difference: 13.2, status: 'above' },
      { name: "Kriti Baral", score: 92.8, difference: 10.8, status: 'above' },
      { name: "Kabir Thapa", score: 91.8, difference: 9.8, status: 'above' },
      { name: "Rohan Shrestha", score: 90.2, difference: 8.2, status: 'above' },
      { name: "Ayush Tamang", score: 72.8, difference: -9.2, status: 'below' },
      { name: "Reena Maharjan", score: 38.0, difference: -44.0, status: 'below' }
    ],
    termTrends: [
      { term: "First Midterm", score: 78.2 },
      { term: "First Term", score: 79.5 },
      { term: "Second Midterm", score: 81.0 },
      { term: "Second Term", score: 82.5 }
    ]
  },
  "Grade 9": {
    subjectAverages: [
      { subject: 'Mathematics', classAvg: 77, schoolAvg: 80 },
      { subject: 'Science', classAvg: 75, schoolAvg: 77 },
      { subject: 'English', classAvg: 82, schoolAvg: 84 },
      { subject: 'Social Studies', classAvg: 72, schoolAvg: 74 },
      { subject: 'Computer Sci', classAvg: 85, schoolAvg: 86 },
      { subject: 'Nepali', classAvg: 68, schoolAvg: 71 }
    ],
    studentPerformance: [
      { name: "Aarav Pandey", score: 94.0, difference: 17.5, status: 'above' },
      { name: "Nischal Bhattarai", score: 91.5, difference: 15.0, status: 'above' },
      { name: "Sagar Lamichhane", score: 88.0, difference: 11.5, status: 'above' },
      { name: "Bibek Magar", score: 62.5, difference: -14.0, status: 'below' },
      { name: "Sneha Shrestha", score: 55.4, difference: -21.1, status: 'below' }
    ],
    termTrends: [
      { term: "First Midterm", score: 74.0 },
      { term: "First Term", score: 75.2 },
      { term: "Second Midterm", score: 75.8 },
      { term: "Second Term", score: 76.5 }
    ]
  },
  "Grade 8": {
    subjectAverages: [
      { subject: 'Mathematics', classAvg: 81, schoolAvg: 80 },
      { subject: 'Science', classAvg: 76, schoolAvg: 77 },
      { subject: 'English', classAvg: 85, schoolAvg: 84 },
      { subject: 'Social Studies', classAvg: 74, schoolAvg: 74 },
      { subject: 'Computer Sci', classAvg: 87, schoolAvg: 86 },
      { subject: 'Nepali', classAvg: 73, schoolAvg: 71 }
    ],
    studentPerformance: [
      { name: "Ananya Joshi", score: 93.6, difference: 13.1, status: 'above' },
      { name: "Deepak Thapa", score: 90.0, difference: 9.5, status: 'above' },
      { name: "Salina Shakya", score: 85.5, difference: 5.0, status: 'above' },
      { name: "Pranish Karki", score: 39.5, difference: -41.0, status: 'below' }
    ],
    termTrends: [
      { term: "First Midterm", score: 79.0 },
      { term: "First Term", score: 79.2 },
      { term: "Second Midterm", score: 80.0 },
      { term: "Second Term", score: 80.5 }
    ]
  }
};

function StudentProgressContent() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 10");
  const [loading, setLoading] = useState(false);
  const data = progressData[selectedGrade] || progressData["Grade 10"];

  const handleGradeChange = (grade: string) => {
    setLoading(true);
    setSelectedGrade(grade);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Description */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Academic Progress Monitoring</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Class-level subject averages compared against school median parameters.</p>
        </div>
        
        {/* Grade Selector */}
        <select
          value={selectedGrade}
          onChange={(e) => handleGradeChange(e.target.value)}
          className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-3 w-full sm:w-auto sm:min-w-[140px]"
        >
          <option value="Grade 10">Grade 10</option>
          <option value="Grade 9">Grade 9</option>
          <option value="Grade 8">Grade 8</option>
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-gray-300 bg-white">
              <CardContent className="p-6 space-y-4 animate-pulse">
                <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
              </CardContent>
            </Card>
            <Card className="border-gray-300 bg-white">
              <CardContent className="p-6 space-y-4 animate-pulse">
                <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-100 rounded-xl"></div>
              </CardContent>
            </Card>
          </div>
          <Card className="border-gray-300 bg-white">
            <CardContent className="p-6 space-y-4 animate-pulse">
              <div className="h-5 w-1/4 bg-gray-200 rounded"></div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-9 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Main Graph: Class vs School Averages */}
          <div className="grid gap-6 md:grid-cols-3 min-w-0 w-full">
        <Card className="md:col-span-2 border-gray-300 bg-white min-w-0">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              Class vs. School Subject Averages
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Comparing selected grade scores against NoteSwift school-wide medians.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subjectAverages} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="subject" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar dataKey="classAvg" fill="#3B82F6" radius={[4, 4, 0, 0]} name={`${selectedGrade} Average`} />
                  <Bar dataKey="schoolAvg" fill="#9CA3AF" radius={[4, 4, 0, 0]} name="School Median" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Term-over-term Grade Performance */}
        <Card className="border-gray-300 bg-white min-w-0">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Session Growth Curve
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Quarterly academic average trends.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.termTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="term" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                  <YAxis domain={[70, 85]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="score" stroke="#818CF8" strokeWidth={3} dot={{ r: 4 }} name="Average Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Rank Comparisons */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Class Student Performance Distribution
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Student rankings within the selected grade scope and deviations from average.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2 sm:py-3.5 sm:px-6">Student Name</th>
                  <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center">Current Score</th>
                  <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center">Deviation</th>
                  <th className="py-2.5 px-2 sm:py-3.5 sm:px-6 text-right">Status Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.studentPerformance.map((student, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-2.5 px-2 sm:py-3.5 sm:px-6 font-bold text-gray-800">{student.name}</td>
                    <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center font-bold text-gray-700">{student.score}%</td>
                    <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center font-mono font-bold">
                      <span className={cn(
                        student.difference >= 0 ? "text-emerald-600" : "text-red-500"
                      )}>
                        {student.difference >= 0 ? `+${student.difference}` : student.difference}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2 sm:py-3.5 sm:px-6 text-right">
                      {student.status === 'above' ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-[9px] font-extrabold px-2 py-0.5 uppercase">
                          <span className="hidden xs:inline">Exceeds Standards</span>
                          <span className="xs:hidden">Exceeds</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 border border-red-250 rounded-full text-[9px] font-extrabold px-2 py-0.5 uppercase">
                          <span className="hidden xs:inline">Needs Support</span>
                          <span className="xs:hidden">Support</span>
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </>
      )}

    </div>
  );
}

export default function StudentProgressPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <StudentProgressContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
