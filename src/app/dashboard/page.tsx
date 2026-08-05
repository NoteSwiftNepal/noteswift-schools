"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useSchoolAuth } from "@/context/school-auth-context";
import { schoolDataApi, DashboardKPIs, LeaderboardEntry, AtRiskStudent, AcademicAnalytics, TestSummary, EngagementSummary } from "@/services/school-data-api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentAvatar } from "@/components/student-avatar";
import {
  Users,
  GraduationCap,
  ClipboardList,
  AlertTriangle,
  Award,
  Sparkles,
  TrendingUp,
  MessageSquare,
  FileText,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Activity,
  CheckCircle2,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";

function DashboardContent() {
  const { admin, activeSchool } = useSchoolAuth();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [atRisk, setAtRisk] = useState<AtRiskStudent[]>([]);
  const [academic, setAcademic] = useState<AcademicAnalytics | null>(null);
  const [assignments, setAssignments] = useState<TestSummary[]>([]);
  const [quizzes, setQuizzes] = useState<TestSummary[]>([]);
  const [engagement, setEngagement] = useState<EngagementSummary | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [kpisData, lbData, riskData, acadData, asnData, quizData, engData, annData, repData] = await Promise.all([
          schoolDataApi.getDashboardKPIs(),
          schoolDataApi.getLeaderboard(10),
          schoolDataApi.getAtRiskStudents(),
          schoolDataApi.getAcademicAnalytics(),
          schoolDataApi.getAssignments(),
          schoolDataApi.getQuizzes(),
          schoolDataApi.getEngagement(),
          schoolDataApi.getAnnouncements(),
          schoolDataApi.getReports(),
        ]);
        if (cancelled) return;
        setKpis(kpisData);
        setLeaderboard(lbData);
        setAtRisk(riskData.slice(0, 5));
        setAcademic(acadData);
        setAssignments(asnData);
        setQuizzes(quizData);
        setEngagement(engData);
        setAnnouncements(annData);
        setReports(repData);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Simple, honestly-computed insights from the real numbers above — not a
  // stored AI-insight feature (none exists), just a readable summary.
  const insights: { type: 'warning' | 'good' | 'info'; text: string }[] = [];
  if (kpis) {
    if (kpis.atRiskCount > 0) {
      insights.push({ type: 'warning', text: `${kpis.atRiskCount} student${kpis.atRiskCount === 1 ? '' : 's'} ${kpis.atRiskCount === 1 ? 'has' : 'have'} low progress and no recent activity — worth checking in on.` });
    }
    if (kpis.completedCourses > 0) {
      insights.push({ type: 'good', text: `${kpis.completedCourses} course enrollment${kpis.completedCourses === 1 ? '' : 's'} reached 100% completion.` });
    }
    if (kpis.activeStudents === 0) {
      insights.push({ type: 'info', text: `No students are linked to this school yet. Students link automatically when they redeem a school-issued unlock code.` });
    } else if (kpis.totalEnrollments === 0) {
      insights.push({ type: 'info', text: `${kpis.activeStudents} student${kpis.activeStudents === 1 ? ' is' : 's are'} linked to this school, but none are enrolled in a course yet.` });
    }
  }

  const quizzesBySubject = quizzes.reduce((acc: Record<string, { total: number; count: number }>, q) => {
    if (q.schoolAvgScore == null) return acc;
    const key = q.subjectName || 'Other';
    acc[key] ||= { total: 0, count: 0 };
    acc[key].total += q.schoolAvgScore;
    acc[key].count += 1;
    return acc;
  }, {});
  const quizChartData = Object.entries(quizzesBySubject).map(([subject, v]) => ({
    subject,
    averageScore: Math.round(v.total / v.count),
  }));

  const engagementChartData = engagement ? [
    { label: 'Today', value: engagement.activeToday },
    { label: 'This Week', value: engagement.activeThisWeek },
    { label: 'This Month', value: engagement.activeThisMonth },
    { label: 'Inactive', value: engagement.inactive },
  ] : [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-200">
        <div className="h-44 w-full bg-gradient-to-r from-blue-100/50 via-indigo-50/50 to-indigo-100/50 rounded-3xl animate-pulse flex flex-col justify-end p-6 md:p-8 space-y-3 border border-gray-200/40">
          <div className="h-6 w-1/3 bg-gray-250/50 rounded-lg"></div>
          <div className="h-4 w-1/2 bg-gray-250/50 rounded-lg"></div>
        </div>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-gray-200 bg-white">
              <CardContent className="p-5 space-y-3.5">
                <div className="h-3.5 w-1/2 bg-gray-150 rounded-full animate-pulse"></div>
                <div className="h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = kpis ? [
    { label: 'Active Students', value: kpis.activeStudents, icon: Users, color: 'primary' },
    { label: 'Total Enrollments', value: kpis.totalEnrollments, icon: GraduationCap, color: 'info' },
    { label: 'Avg. Progress', value: `${kpis.avgProgress}%`, icon: TrendingUp, color: 'success' },
    { label: 'Avg. Score', value: `${kpis.avgScore}%`, icon: Award, color: 'success' },
    { label: 'Completed Courses', value: kpis.completedCourses, icon: CheckCircle2, color: 'info' },
    { label: 'At-Risk Students', value: kpis.atRiskCount, icon: AlertTriangle, color: kpis.atRiskCount > 0 ? 'danger' : 'success' },
  ] : [];

  return (
    <div className="flex flex-col gap-6">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              NoteSwift Administrator Shell
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Namaste, {admin?.fullName || 'Principal'}
          </h2>
          <p className="text-blue-100 text-xs md:text-sm max-w-2xl leading-relaxed">
            {activeSchool?.name || 'Your school'} has {kpis?.activeStudents ?? 0} student{kpis?.activeStudents === 1 ? '' : 's'} linked, averaging {kpis?.avgProgress ?? 0}% course progress.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="hover:shadow-md transition-all duration-200 border-gray-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-3 sm:p-5 space-y-0">
                <CardTitle className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</CardTitle>
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-xl shrink-0",
                  kpi.color === 'primary' ? "bg-blue-50 text-blue-600" :
                  kpi.color === 'success' ? "bg-emerald-50 text-emerald-600" :
                  kpi.color === 'info' ? "bg-purple-50 text-purple-600" :
                  kpi.color === 'danger' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
                )}>
                  <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-5 pt-0">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Academic Trend + Program Performance */}
      <div className="grid gap-6 md:grid-cols-3 min-w-0 w-full">
        <Card className="md:col-span-2 border-gray-300 bg-white min-w-0">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500 shrink-0" />
              Assessment Score Trend (Last 8 Weeks)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Average score across all quizzes/tests taken by this school's students, by week.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {academic && academic.weeklyTrend.some(w => w.attemptCount > 0) ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={academic.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="label" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Avg Score %" connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[250px] w-full flex items-center justify-center text-sm text-gray-400 font-semibold">
                No test attempts recorded yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white min-w-0">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
              Performance by Program
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Average course progress grouped by program (SEE, +2, etc.).</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {academic && academic.byProgram.length > 0 ? (
              academic.byProgram.map((p, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-gray-700">
                    <span>{p.program}</span>
                    <span className="font-extrabold text-blue-650">{p.avgProgress}%</span>
                  </div>
                  <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                    <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${p.avgProgress}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 font-semibold text-center py-6">No enrollments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Student Leaderboard
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Top students ranked by composite Progress Score (completion, assessment average, recency, streak).</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <p className="text-sm text-gray-400 font-semibold text-center py-10">No students with course enrollments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 w-12 text-center">Rank</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3">Student</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Grade</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Avg Progress</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Avg Score</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-right">Progress Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.map((item) => (
                    <tr key={item._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-2.5 px-2 sm:px-4 text-center">
                        {item.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-extrabold border border-amber-300">🥇</span>
                        ) : item.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-extrabold border border-slate-350">🥈</span>
                        ) : item.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-amber-900 font-extrabold border border-amber-250">🥉</span>
                        ) : (
                          <span className="font-extrabold text-gray-500">{item.rank}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2.5">
                        <StudentAvatar avatarEmoji={item.avatarEmoji} profileImage={item.profileImage} size="sm" />
                        <span className="truncate max-w-[85px] sm:max-w-none">{item.full_name}</span>
                      </td>
                      <td className="py-2.5 px-2 sm:px-4 text-center font-semibold text-gray-650">{item.grade ?? '—'}</td>
                      <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-gray-700">{item.avgProgress}%</td>
                      <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-gray-700">{item.avgScore}%</td>
                      <td className="py-2.5 px-2 sm:px-4 text-right font-extrabold text-blue-650">{item.progressScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* At-Risk + Engagement */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              At-Risk Students
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Low composite Progress Score — completion, assessments, recency, or streak.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {atRisk.length === 0 ? (
              <p className="text-sm text-gray-400 font-semibold text-center py-6">No at-risk students right now.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {atRisk.map((student) => (
                  <div key={student._id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <StudentAvatar avatarEmoji={student.avatarEmoji} profileImage={student.profileImage} size="md" className="!bg-red-50 !border-red-100 !text-red-700" />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs sm:text-sm text-gray-800">{student.full_name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">Grade {student.grade ?? '—'} • {student.avgProgress}% progress</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[150px] justify-end">
                      {student.riskTags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-655 border border-red-150 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 text-center">
              <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                <Link href="/analytics/at-risk">
                  View Full At-Risk Registry
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Student Engagement
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">How recently students accessed any enrolled course.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {engagement && engagement.total > 0 ? (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="label" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-semibold text-center py-10">No students linked yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignments Tracker */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-500" />
            Assignments
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Assignments this school's students have attempted, with average scores.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-400 font-semibold text-center py-10">No assignments attempted by this school's students yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3">Title</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 hidden sm:table-cell">Subject</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Attempts</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Avg Score</th>
                    <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignments.map((asn) => (
                    <tr key={asn._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-2.5 px-2 sm:px-4 font-bold text-gray-800">{asn.title}</td>
                      <td className="py-2.5 px-2 sm:px-4 font-semibold text-gray-500 hidden sm:table-cell">{asn.subjectName}</td>
                      <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-gray-600">{asn.schoolAttemptCount}</td>
                      <td className="py-2.5 px-2 sm:px-4 text-center font-extrabold text-blue-650">{asn.schoolAvgScore != null ? `${asn.schoolAvgScore}%` : '—'}</td>
                      <td className="py-2.5 px-2 sm:px-4 text-right">
                        <Badge className={cn(
                          "rounded-full text-[9px] font-extrabold px-2 py-0.5",
                          asn.status === 'active' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          asn.status === 'closed' ? "bg-gray-100 text-gray-600 border border-gray-200" :
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

      {/* Quizzes */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" />
            Quizzes & Practice Tests
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Subject-wise average score across quizzes this school's students attempted.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {quizChartData.length === 0 ? (
            <p className="text-sm text-gray-400 font-semibold text-center py-10">No quizzes attempted by this school's students yet.</p>
          ) : (
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="subject" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="averageScore" fill="#818CF8" radius={[4, 4, 0, 0]} name="Avg Score %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights + Announcements/Reports */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Summary Notes
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Quick takeaways from this school's current numbers.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {insights.length === 0 ? (
              <p className="text-sm text-gray-400 font-semibold text-center py-6">Nothing to flag right now.</p>
            ) : insights.map((ins, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3.5 rounded-xl border flex items-start gap-3",
                  ins.type === "warning" ? "bg-red-50/50 border-red-200 text-red-950" :
                  ins.type === "good" ? "bg-emerald-50/50 border-emerald-250 text-emerald-950" :
                  "bg-blue-50/50 border-blue-200 text-blue-950"
                )}
              >
                <span className={cn(
                  "p-1 rounded shrink-0",
                  ins.type === "warning" ? "bg-red-100 text-red-600" :
                  ins.type === "good" ? "bg-emerald-100 text-emerald-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  {ins.type === "warning" ? <AlertTriangle className="h-4.5 w-4.5" /> :
                   ins.type === "good" ? <CheckCircle2 className="h-4.5 w-4.5" /> :
                   <Info className="h-4.5 w-4.5" />}
                </span>
                <p className="text-[11px] sm:text-xs font-semibold leading-relaxed text-gray-700">{ins.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              Parent Communication
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Messaging with parents isn't available yet.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-400 font-semibold text-center py-10">No conversations yet.</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
