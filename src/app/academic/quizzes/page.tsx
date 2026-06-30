"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, Star, Plus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockQuizzes = [
  { id: 1, title: "Trigonometric Identites Quiz", subject: "Mathematics", grade: "Grade 10", questionsCount: 15, avgScore: 84.5, activeStudents: 42, status: "Active" },
  { id: 2, title: "Force & Gravity Basics", subject: "Science", grade: "Grade 9", questionsCount: 10, avgScore: 78.0, activeStudents: 38, status: "Active" },
  { id: 3, title: "Nepali Grammar - Sandhi", subject: "Nepali", grade: "Grade 10", questionsCount: 20, avgScore: 72.5, activeStudents: 45, status: "Closed" },
  { id: 4, title: "Introduction to HTML", subject: "Computer Science", grade: "Grade 8", questionsCount: 12, avgScore: 89.2, activeStudents: 35, status: "Active" }
];

function QuizzesContent() {
  const { toast } = useState(null) as any;
  const { toast: triggerToast } = useToast();
  const [quizzes, setQuizzes] = useState(mockQuizzes);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Interactive Quizzes</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Review active classroom quizzes, aggregate grades, and participation parameters.</p>
        </div>
        <Button 
          onClick={() => {
            triggerToast({
              title: "Feature Unavailable",
              description: "Interactive Quiz builder is coming in Phase 2 integration.",
            });
          }}
          className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-10 px-4 text-xs sm:text-sm shadow-sm flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create New Quiz
        </Button>
      </div>

      {/* Quizzes Grid Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="border-gray-300 bg-white hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-gray-250 pb-3 flex flex-row items-start justify-between gap-4">
              <div className="space-y-1.5">
                <Badge className="bg-indigo-50 text-indigo-750 border border-indigo-200 font-extrabold text-[9px] uppercase rounded px-2">
                  {quiz.subject}
                </Badge>
                <CardTitle className="text-sm sm:text-base font-bold text-gray-800 leading-snug">{quiz.title}</CardTitle>
                <CardDescription className="text-xs font-semibold text-gray-500">{quiz.grade} • {quiz.questionsCount} Questions</CardDescription>
              </div>
              <Badge className={cn(
                "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                quiz.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-250" : "bg-gray-100 text-gray-600 border border-gray-200"
              )}>
                {quiz.status}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-200 text-center">
                <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Average Score</span>
                <span className="text-sm font-extrabold text-blue-650 block mt-1">{quiz.avgScore}%</span>
              </div>
              <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-200 text-center">
                <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Submissions</span>
                <span className="text-sm font-extrabold text-gray-850 block mt-1">{quiz.activeStudents} Students</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
