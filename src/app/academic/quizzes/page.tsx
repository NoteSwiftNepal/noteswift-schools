"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { schoolDataApi, TestSummary } from "@/services/school-data-api";
import { cn } from "@/lib/utils";

function QuizzesContent() {
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<TestSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getQuizzes()
      .then(d => { if (!cancelled) setQuizzes(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Quizzes & Practice Tests</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Quizzes this school's students have attempted, with average scores.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <Card className="border-gray-300 bg-white">
          <CardContent className="p-12 text-center text-gray-500 font-semibold text-sm">
            No quizzes attempted by this school's students yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="border-gray-300 bg-white hover:shadow-md transition-shadow">
              <CardHeader className="border-b border-gray-250 pb-3 flex flex-row items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <Badge className="bg-indigo-50 text-indigo-750 border border-indigo-200 font-extrabold text-[9px] uppercase rounded px-2">
                    {quiz.subjectName}
                  </Badge>
                  <CardTitle className="text-sm sm:text-base font-bold text-gray-800 leading-snug">{quiz.title}</CardTitle>
                  <CardDescription className="text-xs font-semibold text-gray-500">{quiz.courseName}</CardDescription>
                </div>
                <Badge className={cn(
                  "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                  quiz.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-250" : "bg-gray-100 text-gray-600 border border-gray-200"
                )}>
                  {quiz.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-200 text-center">
                  <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Average Score</span>
                  <span className="text-sm font-extrabold text-blue-650 block mt-1">{quiz.schoolAvgScore != null ? `${quiz.schoolAvgScore}%` : '—'}</span>
                </div>
                <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-200 text-center">
                  <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Attempts</span>
                  <span className="text-sm font-extrabold text-gray-850 block mt-1">{quiz.schoolAttemptCount} Students</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function QuizzesPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <QuizzesContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
