"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { schoolDataApi, AtRiskStudent } from "@/services/school-data-api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentAvatar } from "@/components/student-avatar";
import { ShieldAlert } from "lucide-react";

function AtRiskContent() {
  const [list, setList] = useState<AtRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getAtRiskStudents()
      .then(d => { if (!cancelled) setList(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">At-Risk Academic Spotlight</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Students with low course progress and no recent activity.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span>At-Risk Student Registry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : list.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Student</th>
                    <th className="py-3 px-4 text-center">Grade</th>
                    <th className="py-3 px-4 text-center">Avg Progress</th>
                    <th className="py-3 px-4">Risk Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {list.map((student) => (
                    <tr key={student._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900 flex items-center gap-2.5">
                        <StudentAvatar avatarEmoji={student.avatarEmoji} profileImage={student.profileImage} size="md" className="!bg-red-50 !border-red-150 !text-red-700" />
                        <span>{student.full_name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-gray-650">{student.grade ?? '—'}</td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-red-650">{student.avgProgress}%</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {student.riskTags.map((tag, tIdx) => (
                            <Badge key={tIdx} className="bg-red-50 text-red-700 border border-red-250 font-bold text-[9px] rounded uppercase px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 font-semibold text-xs">
              All students are currently in good academic standing.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AtRiskPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AtRiskContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
