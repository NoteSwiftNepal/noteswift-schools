"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertTriangle, CheckCircle, Clock, Calendar } from "lucide-react";
import { classAttendance, studentsDirectory } from "@/mocks/mock-data";
import { cn } from "@/lib/utils";

function AttendanceContent() {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2026-06-29");
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date: string) => {
    setLoading(true);
    setSelectedDate(date);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleClassChange = (cls: string) => {
    setLoading(true);
    setSelectedClass(cls);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // Filtering mock attendance records
  const filteredRecords = studentsDirectory.flatMap(student => {
    // Filter class
    if (selectedClass !== "all" && !student.class.includes(selectedClass)) return [];
    
    // Find attendance log for date
    const record = student.attendanceHistory.find(h => h.date === selectedDate);
    if (!record) return [];

    return [{
      studentId: student.id,
      name: student.name,
      avatar: student.avatar,
      class: student.class,
      roll: student.roll,
      status: record.status
    }];
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Attendance Tracker</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Real-time attendance tracking, section-wise analysis, and daily registries.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-2 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Avg Attendance</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">94.2%</div>
            <p className="text-xs text-emerald-600 font-bold mt-1">▲ +0.8% vs last week</p>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-2 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Present Today</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">1,178</div>
            <p className="text-xs text-gray-500 font-semibold mt-1">Out of 1,250 enrolled</p>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-2 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Absentees Today</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-red-500">72</div>
            <p className="text-xs text-gray-500 font-semibold mt-1">Authorized leaves: 18</p>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-2 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Late Arrivals</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">35</div>
            <p className="text-xs text-gray-500 font-semibold mt-1">Buffer time: 10 mins</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center w-full md:w-auto">
            <div className="flex items-center gap-1.5 w-full">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-xs font-bold text-gray-500 shrink-0">Date:</span>
              <select
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2 w-full sm:w-auto"
              >
                <option value="2026-06-29">June 29, 2026</option>
                <option value="2026-06-28">June 28, 2026</option>
                <option value="2026-06-26">June 26, 2026</option>
                <option value="2026-06-25">June 25, 2026</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:pl-4 sm:border-l sm:border-gray-250">
              <span className="text-xs font-bold text-gray-500 shrink-0">Section:</span>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2 w-full sm:w-auto sm:min-w-[120px]"
              >
                <option value="all">All Grades</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 8">Grade 8</option>
              </select>
            </div>
          </div>
          
          <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-250 font-extrabold text-[10px] rounded-xl px-3 py-1.5 text-center shrink-0 w-full md:w-auto mt-2 md:mt-0 flex justify-center">
            Registry Entries: {filteredRecords.length}
          </Badge>
        </CardContent>
      </Card>

      {/* Main Grid: Class progress breakdown + Registry lists */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-200">
          <Card className="border-gray-300 bg-white">
            <CardContent className="p-6 space-y-4 animate-pulse">
              <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
              <div className="space-y-4 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-1/3 bg-gray-150 rounded"></div>
                    <div className="h-2 bg-gray-100 rounded-full"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 border-gray-300 bg-white">
            <CardContent className="p-6 space-y-4 animate-pulse">
              <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
              <div className="space-y-3 pt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-9 bg-gray-100/80 rounded-lg"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Class Averages Column */}
          <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-200 pb-4">
            <CardTitle className="text-md font-bold text-gray-800">Class Progress indicators</CardTitle>
            <CardDescription className="text-xs text-gray-500 font-semibold">Section metrics tracked today.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {classAttendance.map((cls, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>{cls.className}</span>
                  <span className="font-extrabold text-blue-650">{cls.percentage}%</span>
                </div>
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      cls.percentage >= 95 ? "bg-emerald-500" :
                      cls.percentage >= 90 ? "bg-blue-500" : "bg-amber-500"
                    )}
                    style={{ width: `${cls.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Registry Entry Table */}
        <Card className="md:col-span-2 border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-200 pb-4">
            <CardTitle className="text-md font-bold text-gray-800">Daily Log Summary</CardTitle>
            <CardDescription className="text-xs text-gray-500 font-semibold">Attendance log for selected date and section scope.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 font-bold">Student</th>
                      <th className="py-2.5 px-4">Roll</th>
                      <th className="py-2.5 px-4">Class</th>
                      <th className="py-2.5 px-4 text-right">Log Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[9px] flex items-center justify-center">
                            {item.avatar}
                          </div>
                          <span>{item.name}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-500">#{item.roll}</td>
                        <td className="py-3 px-4 font-semibold text-gray-650">{item.class}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge className={cn(
                            "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                            item.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-250" :
                            item.status === "Late" ? "bg-amber-50 text-amber-700 border border-amber-250" :
                            "bg-red-50 text-red-700 border border-red-250"
                          )}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 font-bold text-xs">
                No logs recorded for {selectedDate}.
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}

    </div>
  );
}

export default function AttendancePage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AttendanceContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
