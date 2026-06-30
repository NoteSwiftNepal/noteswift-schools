"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiService } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Mail, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function AtRiskContent() {
  const { toast } = useToast();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtRisk = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAtRiskStudents();
        setList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAtRisk();
  }, []);

  const handleNotify = (studentName: string) => {
    toast({
      title: "Parent Notified",
      description: `Dispatched academic alert update for ${studentName}.`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">At-Risk Academic Spotlight</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Review flagged students requiring immediate counselor support or parent contact.</p>
      </div>

      {/* Flagged registry table */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            <span>At-Risk Student Registry</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="w-full animate-pulse">
              <div className="border-b border-gray-200 bg-gray-50/55 h-12 flex items-center px-6">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-4.5 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="w-8.5 h-8.5 rounded-full bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-150 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : list.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-center">Avg Attendance</th>
                    <th className="py-3 px-4 text-center">Avg Score</th>
                    <th className="py-3 px-4">Risk Reason Flags</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {list.map((student) => (
                    <tr key={student.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900 flex items-center gap-2.5">
                        <div className="w-8.5 h-8.5 rounded-full bg-red-50 border border-red-150 text-red-700 font-extrabold text-[10px] flex items-center justify-center">
                          {student.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span>{student.name}</span>
                          <span className="text-[9px] text-gray-400 font-bold">#{student.id}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-650">{student.class}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={cn(
                          "font-extrabold",
                          student.attendance < 80 ? "text-red-650" : "text-gray-700"
                        )}>{student.attendance}%</span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-blue-650">{student.score}%</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {student.riskTags.map((tag: string, tIdx: number) => (
                            <Badge key={tIdx} className="bg-red-50 text-red-700 border border-red-250 font-bold text-[9px] rounded uppercase px-2 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNotify(student.name)}
                          className="h-8 rounded-lg text-[10px] font-bold border-red-200 hover:bg-red-50 text-red-600 bg-white"
                        >
                          Notify Parent
                        </Button>
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
