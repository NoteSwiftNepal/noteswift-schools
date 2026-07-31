"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { schoolDataApi, StudentSummary } from "@/services/school-data-api";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

function StudentProgressContent() {
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<StudentSummary[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await schoolDataApi.listStudents({
        grade: selectedGrade !== 'all' ? selectedGrade : undefined,
        limit: 100,
      });
      setStudents(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => { load(); }, [load]);

  const withCourses = students.filter(s => s.enrolledCourseCount > 0);
  const avgProgress = withCourses.length > 0
    ? Math.round(withCourses.reduce((sum, s) => sum + s.avgProgress, 0) / withCourses.length)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Academic Progress Monitoring</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Individual student course progress compared against the group average.</p>
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-3 w-full sm:w-auto sm:min-w-[140px]"
        >
          <option value="all">All Grades</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
            <option key={g} value={g}>Grade {g}</option>
          ))}
        </select>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Student Progress Distribution
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
            {withCourses.length > 0 ? `Group average progress: ${avgProgress}%` : "No enrolled students in this scope yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : withCourses.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-bold text-xs">
              No students with course enrollments in this scope.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2 sm:py-3.5 sm:px-6">Student Name</th>
                    <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center">Progress</th>
                    <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center">Deviation</th>
                    <th className="py-2.5 px-2 sm:py-3.5 sm:px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withCourses
                    .slice()
                    .sort((a, b) => b.avgProgress - a.avgProgress)
                    .map((student) => {
                      const deviation = student.avgProgress - avgProgress;
                      const isAbove = deviation >= 0;
                      return (
                        <tr key={student._id} className="hover:bg-secondary/20 transition-colors">
                          <td className="py-2.5 px-2 sm:py-3.5 sm:px-6 font-bold text-gray-800">{student.full_name}</td>
                          <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center font-bold text-gray-700">{student.avgProgress}%</td>
                          <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center font-mono font-bold">
                            <span className={cn(isAbove ? "text-emerald-600" : "text-red-500")}>
                              {isAbove ? `+${deviation}` : deviation}%
                            </span>
                          </td>
                          <td className="py-2.5 px-2 sm:py-3.5 sm:px-6 text-right">
                            {isAbove ? (
                              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-[9px] font-extrabold px-2 py-0.5 uppercase">
                                Above Average
                              </Badge>
                            ) : (
                              <Badge className="bg-red-50 text-red-700 border border-red-250 rounded-full text-[9px] font-extrabold px-2 py-0.5 uppercase">
                                Below Average
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
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
