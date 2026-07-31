"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { schoolDataApi, TestSummary } from "@/services/school-data-api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

function AssignmentsContent() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [list, setList] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getAssignments()
      .then(d => { if (!cancelled) setList(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const subjects = Array.from(new Set(list.map(a => a.subjectName).filter(Boolean)));

  const filteredList = list.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchSub = subjectFilter === "all" || item.subjectName === subjectFilter;
    return matchSearch && matchSub;
  });

  const activeCount = list.filter(l => l.status === 'active').length;
  const attemptedCount = list.filter(l => l.schoolAttemptCount > 0).length;
  const avgAttemptRate = attemptedCount > 0
    ? Math.round(list.reduce((sum, l) => sum + l.schoolAttemptCount, 0) / list.length)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Assignments</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Assignments this school's students have attempted.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-1 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Total Assignments</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{list.length}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-1 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Active Now</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-extrabold text-blue-650">{activeCount}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-1 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Avg Attempts / Assignment</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">{avgAttemptRate}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
            <Input
              placeholder="Search by assignment title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 border-gray-300 focus:border-blue-500 rounded-xl text-xs font-semibold"
            />
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-3 w-full sm:min-w-[140px]"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-semibold text-sm">
              {list.length === 0 ? "No assignments attempted by this school's students yet." : "No assignments match the selected filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6">Title</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 hidden sm:table-cell">Subject</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Attempts</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Avg Score</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredList.map((asn) => (
                    <tr key={asn._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 font-bold text-gray-800">{asn.title}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-semibold text-gray-500 hidden sm:table-cell">{asn.subjectName}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-bold text-gray-650">{asn.schoolAttemptCount}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-extrabold text-blue-650">
                        {asn.schoolAvgScore != null ? `${asn.schoolAvgScore}%` : "—"}
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">
                        <Badge className={cn(
                          "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                          asn.status === 'active' ? "bg-emerald-50 text-emerald-700 border border-emerald-250" :
                          asn.status === 'closed' ? "bg-gray-150 text-gray-600 border border-gray-200" :
                          "bg-slate-100 text-slate-600 border border-slate-200"
                        )}>
                          {asn.status}
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

export default function AssignmentsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AssignmentsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
