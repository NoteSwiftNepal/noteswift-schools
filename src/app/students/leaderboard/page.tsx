"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { schoolDataApi, LeaderboardEntry } from "@/services/school-data-api";
import { StudentAvatar } from "@/components/student-avatar";
import { Award } from "lucide-react";

function LeaderboardContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getLeaderboard(50)
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Student Leaderboard</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Ranked by average course progress and assessment score.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Top Students</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Ranked by average course progress, tie-broken by average assessment score.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="py-4.5 px-6 h-14 bg-gray-50 animate-pulse" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-bold text-xs">
              No students with course enrollments yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4 text-center">Courses</th>
                    <th className="py-3 px-4 text-center">Avg Progress</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item) => (
                    <tr key={item._id} className="hover:bg-secondary/20 transition-colors">
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
                        <StudentAvatar avatarEmoji={item.avatarEmoji} profileImage={item.profileImage} size="md" className="!bg-indigo-50 !border-indigo-150 !text-indigo-700" />
                        <span>{item.full_name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-600">{item.grade ?? '—'}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700">{item.enrolledCourseCount}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-750">{item.avgProgress}%</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-extrabold text-blue-650">{item.avgScore}%</td>
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
