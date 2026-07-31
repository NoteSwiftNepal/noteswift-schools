"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { schoolDataApi, TestSummary } from "@/services/school-data-api";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

function MockTestsContent() {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<TestSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getMockTests()
      .then(d => { if (!cancelled) setTests(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Mock & Term Tests</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Mid-term and final tests this school's students have attempted.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <span>Mock Examinations Registry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-semibold text-sm">
              No mock or term tests attempted by this school's students yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Test Name</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4 text-center">Attempts</th>
                    <th className="py-3 px-4 text-center">Pass Rate</th>
                    <th className="py-3 px-4 text-center">Average Score</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tests.map((test) => (
                    <tr key={test._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900">{test.title}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-650">{test.subjectName}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700">{test.schoolAttemptCount}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                        {test.schoolPassRate != null ? `${test.schoolPassRate}%` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-blue-650">
                        {test.schoolAvgScore != null ? `${test.schoolAvgScore}%` : "—"}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Badge className={cn(
                          "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                          test.status === "active" || test.status === "closed" ? "bg-emerald-50 text-emerald-700 border border-emerald-250" : "bg-blue-50 text-blue-750 border border-blue-200"
                        )}>
                          {test.status}
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

export default function MockTestsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <MockTestsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
