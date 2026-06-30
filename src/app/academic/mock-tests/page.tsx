"use client";

import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Award, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockTests = [
  { id: 1, name: "Pre-Board Simulation Exam 1", grade: "Grade 10", date: "2026-06-15", passRate: 91.2, avgScore: 78.4, status: "Evaluated" },
  { id: 2, name: "Mid-Term Physics Mock", grade: "Grade 9", date: "2026-06-22", passRate: 85.0, avgScore: 74.0, status: "Evaluated" },
  { id: 3, name: "Mathematics Section Terminal", grade: "Grade 10", date: "2026-07-05", passRate: 0, avgScore: 0, status: "Scheduled" }
];

function MockTestsContent() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Mock Term Tests</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Review pre-board mock examinations, student pass-rates, and benchmarks.</p>
        </div>
        <Button 
          onClick={() => {
            toast({
              title: "Feature Unavailable",
              description: "Mock test scheduling is coming in Phase 2 integration.",
            });
          }}
          className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-10 px-4 text-xs sm:text-sm shadow-sm flex items-center gap-1.5"
        >
          <Calendar className="h-4 w-4" />
          Schedule Mock Test
        </Button>
      </div>

      {/* Main Registry Table */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-200 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <span>Mock Examinations Registry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Test Name</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Pass Rate</th>
                  <th className="py-3 px-4 text-center">Average Score</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockTests.map((test) => (
                  <tr key={test.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900">{test.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-650">{test.grade}</td>
                    <td className="py-3.5 px-4 font-semibold font-mono text-gray-500">{test.date}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                      {test.status === "Scheduled" ? "—" : `${test.passRate}%`}
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-blue-650">
                      {test.status === "Scheduled" ? "—" : `${test.avgScore}%`}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <Badge className={cn(
                        "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                        test.status === "Evaluated" ? "bg-emerald-50 text-emerald-700 border border-emerald-250" : "bg-blue-50 text-blue-750 border border-blue-200"
                      )}>
                        {test.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
