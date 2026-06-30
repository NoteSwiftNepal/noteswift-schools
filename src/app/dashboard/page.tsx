"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useSchoolAuth } from "@/context/school-auth-context";
import { apiService } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  Clock, 
  ClipboardList, 
  AlertTriangle,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  MessageSquare,
  FileText,
  Plus,
  Send,
  Download,
  CheckCircle,
  HelpCircle,
  Megaphone,
  ArrowRight,
  TrendingDown,
  Activity
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
  Tooltip, 
  Legend 
} from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mapping icons dynamically
const IconMap: Record<string, any> = {
  Users,
  CalendarCheck,
  GraduationCap,
  Clock,
  ClipboardList,
  AlertTriangle
};

function DashboardContent() {
  const { toast } = useToast();
  const { activeSchool, activeYear } = useSchoolAuth();

  // State variables for dashboard data
  const [loading, setLoading] = useState(true);
  const [kpiCards, setKpiCards] = useState<any[]>([]);
  const [subjectPerf, setSubjectPerf] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState<any[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState("Weekly");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [classAtt, setClassAtt] = useState<any[]>([]);
  const [atRiskList, setAtRiskList] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [assignmentList, setAssignmentList] = useState<any[]>([]);
  const [quizStats, setQuizStats] = useState<any>(null);
  const [subjectQuizzes, setSubjectQuizzes] = useState<any[]>([]);
  const [platformUsage, setPlatformUsage] = useState<any>(null);
  const [weeklyUsage, setWeeklyUsage] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [msgThreads, setMsgThreads] = useState<any[]>([]);
  const [reportList, setReportList] = useState<any[]>([]);

  // Dialog States
  const [openAsnModal, setOpenAsnModal] = useState(false);
  const [newAsnTitle, setNewAsnTitle] = useState("");
  const [newAsnSubject, setNewAsnSubject] = useState("Mathematics");
  const [newAsnGrade, setNewAsnGrade] = useState("Grade 10");
  const [newAsnDueDate, setNewAsnDueDate] = useState("");
  const [isCreatingAsn, setIsCreatingAsn] = useState(false);

  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [exportReportName, setExportReportName] = useState("Term Performance");
  const [exportFormat, setExportFormat] = useState<"PDF" | "Excel" | "CSV">("PDF");
  const [isGeneratingRep, setIsGeneratingRep] = useState(false);

  // Load Dashboard Data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const kpisData = await apiService.getKPIs(activeYear);
        setKpiCards(kpisData);

        const subPerfData = await apiService.getSubjectPerformance();
        setSubjectPerf(subPerfData);

        const trendData = await apiService.getWeeklyPerformance();
        setWeeklyTrend(trendData);

        const growthData = await apiService.getMonthlyGrowth();
        setMonthlyGrowth(growthData);

        const lbData = await apiService.getLeaderboard(leaderboardTab);
        setLeaderboardData(lbData);

        const classAttData = await apiService.getClassAttendance();
        setClassAtt(classAttData);

        const atRiskData = await apiService.getAtRiskStudents();
        setAtRiskList(atRiskData);

        const heatmapData = await apiService.getActivityHeatmap();
        setHeatmap(heatmapData);

        const assignmentsData = await apiService.getAssignments();
        setAssignmentList(assignmentsData);

        const quizzesData = await apiService.getQuizzesOverview();
        setQuizStats(quizzesData);

        const subQuizzesData = await apiService.getSubjectQuizzes();
        setSubjectQuizzes(subQuizzesData);

        const platformData = await apiService.getPlatformEngagement();
        setPlatformUsage(platformData);

        const usageData = await apiService.getWeeklyEngagement();
        setWeeklyUsage(usageData);

        const insightsData = await apiService.getAIInsights();
        setInsights(insightsData);

        const benchmarkData = await apiService.getBenchmarking();
        setBenchmarks(benchmarkData);

        const messagesData = await apiService.getParentMessages();
        setMsgThreads(messagesData);

        const reportsData = await apiService.getReports();
        setReportList(reportsData);
      } catch (err) {
        console.error("Dashboard Loading Error:", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 350);
      }
    };
    loadDashboardData();
  }, [activeYear, leaderboardTab]);

  // Handle Create Assignment Submission
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsnTitle.trim() || !newAsnDueDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please specify an assignment title and due date.",
      });
      return;
    }

    setIsCreatingAsn(true);
    try {
      const newAsn = await apiService.createAssignment({
        title: newAsnTitle,
        subject: newAsnSubject,
        grade: newAsnGrade,
        dueDate: newAsnDueDate
      });
      setAssignmentList((prev) => [newAsn, ...prev]);
      toast({
        title: "Assignment Published",
        description: `"${newAsnTitle}" has been scheduled for ${newAsnGrade}.`,
      });
      // Reset
      setNewAsnTitle("");
      setNewAsnDueDate("");
      setOpenAsnModal(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Publishing Failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsCreatingAsn(false);
    }
  };

  // Handle Reply to Parent
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedThread) return;
    setIsSendingReply(true);
    try {
      const updatedThread = await apiService.sendParentMessage(selectedThread.id, replyText);
      setMsgThreads((prev) => prev.map(t => t.id === updatedThread.id ? updatedThread : t));
      toast({
        title: "Reply Dispatched",
        description: `Message sent to ${selectedThread.parentName}.`,
      });
      setReplyText("");
      setSelectedThread(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error Sending Message",
        description: "Failed to send message.",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  // Handle Generate Report
  const handleGenerateReport = async () => {
    if (!exportReportName.trim()) return;
    setIsGeneratingRep(true);
    try {
      const newRep = await apiService.generateReport(exportReportName, exportFormat);
      setReportList((prev) => [newRep, ...prev]);
      toast({
        title: "Report Generated",
        description: `Compiled file "${newRep.name}" is ready for download.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Compilation Failed",
        description: "Report generation timed out.",
      });
    } finally {
      setIsGeneratingRep(false);
    }
  };

  // Heatmap helper grouping
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getHeatmapColor = (val: number) => {
    if (val === 0) return "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 border border-gray-200/50";
    if (val === 1) return "bg-blue-100 text-blue-500 hover:bg-blue-200";
    if (val === 2) return "bg-blue-300 text-blue-600 hover:bg-blue-400";
    if (val === 3) return "bg-blue-500 text-white hover:bg-blue-600";
    return "bg-indigo-600 text-white hover:bg-indigo-700";
  };

  // Group heatmap entries into 10 weeks
  const weeks: any[][] = [];
  for (let w = 1; w <= 10; w++) {
    const weekEntries = heatmap.filter(h => h.week === w);
    // Sort by Sun-Sat order
    const ordered = daysOfWeek.map(d => weekEntries.find(e => e.day === d) || { day: d, value: 0 });
    weeks.push(ordered);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-200">
        {/* Welcome banner skeleton */}
        <div className="h-44 w-full bg-gradient-to-r from-blue-100/50 via-indigo-50/50 to-indigo-100/50 rounded-3xl animate-pulse flex flex-col justify-end p-6 md:p-8 space-y-3 border border-gray-200/40">
          <div className="h-6 w-1/3 bg-gray-250/50 rounded-lg"></div>
          <div className="h-4 w-1/2 bg-gray-250/50 rounded-lg"></div>
        </div>

        {/* Stats cards skeletons grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-gray-200 bg-white">
              <CardContent className="p-5 space-y-3.5">
                <div className="h-3.5 w-1/2 bg-gray-150 rounded-full animate-pulse"></div>
                <div className="h-8 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-3 w-3/4 bg-gray-150 rounded-full animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Major widgets skeleton */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="h-4.5 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-56 w-full bg-gray-100/70 rounded-xl animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="h-4.5 w-1/3 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-56 w-full bg-gray-100/70 rounded-xl animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
        <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl -mb-8"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              NoteSwift Administrator Shell
            </span>
            <Badge className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-[10px] py-0.5 px-2.5 rounded-full font-bold">
              Live Connection
            </Badge>
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Namaste, Principal Ramesh Sharma
          </h2>
          <p className="text-blue-100 text-xs md:text-sm max-w-2xl leading-relaxed">
            Welcome back. Today, {activeSchool?.name || "Lalitpur Branch"} reports an average attendance rate of <span className="font-extrabold text-white text-sm">94.2%</span>. There are <span className="font-extrabold text-white text-sm">14</span> students flagged with declining academic trends.
          </p>
        </div>
      </div>

      {/* 2. KPI Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpiCards.map((kpi, idx) => {
          const IconComponent = IconMap[kpi.iconName] || Users;
          const isAtRisk = kpi.label.includes("At-Risk");
          
          return (
            <Card key={idx} className="hover:shadow-md transition-all duration-200 border-gray-300 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-3 sm:p-5 space-y-0">
                <CardTitle className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</CardTitle>
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-xl shrink-0",
                  kpi.colorType === 'primary' ? "bg-blue-50 text-blue-600" :
                  kpi.colorType === 'success' ? "bg-emerald-50 text-emerald-600" :
                  kpi.colorType === 'info' ? "bg-purple-50 text-purple-600" :
                  kpi.colorType === 'warning' ? "bg-amber-50 text-amber-600" :
                  kpi.colorType === 'danger' ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"
                )}>
                  <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-5 pt-0 space-y-1.5">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none">{kpi.value}</div>
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-gray-500">
                  {kpi.trendDirection === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                  ) : kpi.trendDirection === 'down' ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  ) : null}
                  <span className={cn(
                    kpi.trendDirection === 'up' ? (isAtRisk ? "text-emerald-500" : "text-emerald-500") : 
                    kpi.trendDirection === 'down' ? (isAtRisk ? "text-red-500" : "text-red-500") : "text-gray-400"
                  )}>
                    {kpi.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Performance Charts Section */}
      <div className="grid gap-6 md:grid-cols-3 min-w-0 w-full">
        {/* Weekly Performance Trend & Monthly Academic Comparison */}
        <Card className="md:col-span-2 border-gray-300 bg-white min-w-0">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500 shrink-0" />
              Academic Growth & Term Trajectory
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Weekly aggregate scores and month-over-month session growth comparison.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Tabs defaultValue="weekly" className="w-full">
              <div className="flex justify-between items-center pb-2.5">
                <TabsList className="bg-secondary/60 rounded-xl p-1 border border-gray-250">
                  <TabsTrigger value="weekly" className="rounded-lg text-xs font-bold px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all">Weekly Trend</TabsTrigger>
                  <TabsTrigger value="monthly" className="rounded-lg text-xs font-bold px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-blue-600 transition-all">Monthly Comparison</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="weekly" className="pt-2 focus-visible:outline-none">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="week" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis domain={[60, 90]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="score" stroke="url(#blueGradient)" strokeWidth={3.5} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} name="Avg Score %" />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#4F46E5" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="pt-2 focus-visible:outline-none">
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                      <YAxis domain={[50, 90]} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '12px' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Bar dataKey="thisYear" fill="#3B82F6" radius={[4, 4, 0, 0]} name="This Session (2081)" />
                      <Bar dataKey="lastYear" fill="#9CA3AF" radius={[4, 4, 0, 0]} name="Previous Session (2080)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Subject-Wise Performance bars */}
        <Card className="border-gray-300 bg-white min-w-0">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" />
              Subject Performance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">School-wide subject averages this term.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {subjectPerf.map((sub, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs sm:text-sm font-bold text-gray-700">
                  <span>{sub.subject}</span>
                  <span className="font-extrabold text-blue-650">{sub.percentage}%</span>
                </div>
                <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", sub.color)} 
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 4. Student Leaderboard */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4 flex flex-row items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              Student Honor Roll / Leaderboard
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Highlights top student performers based on academic scores, study hours, and attendance.</CardDescription>
          </div>
          <div className="flex gap-1.5 bg-secondary/60 rounded-xl p-1 border border-gray-250 shrink-0">
            {["Weekly", "Monthly", "Grade 10"].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeaderboardTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  leaderboardTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 w-12 text-center">Rank</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3">Student</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3">Class</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Attendance</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center hidden md:table-cell">Study Hours</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-right">Avg Score</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-right hidden sm:table-cell">Achievement Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboardData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
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
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold text-[9px] sm:text-[10px] flex items-center justify-center border border-blue-200">
                        {item.avatar}
                      </div>
                      <span className="truncate max-w-[85px] sm:max-w-none">{item.name}</span>
                    </td>
                    <td className="py-2.5 px-2 sm:px-4 font-semibold text-gray-650">{item.class}</td>
                    <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-gray-700">{item.attendance}%</td>
                    <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-gray-700 hidden md:table-cell">{item.studyHours} hrs</td>
                    <td className="py-2.5 px-2 sm:px-4 text-right font-extrabold text-blue-650">{item.score}%</td>
                    <td className="py-2.5 px-2 sm:px-4 text-right hidden sm:table-cell">
                      <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-250 font-extrabold text-[9px] rounded-full px-2.5 py-0.5">
                        {item.badge}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Attendance Summary & At-Risk Lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Breakdown */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-500" />
              Attendance Breakdown Today
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Live summary of school-wide attendance today.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center bg-gray-50/50 p-4 border border-gray-200 rounded-2xl">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Present</span>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600">1,178</p>
              </div>
              <div className="border-l border-r border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Absent</span>
                <p className="text-xl sm:text-2xl font-extrabold text-red-500">72</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Late Arrivals</span>
                <p className="text-xl sm:text-2xl font-extrabold text-amber-500">35</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Class-wise Attendance</h4>
              <div className="grid gap-3.5">
                {classAtt.map((cls, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm gap-4">
                    <span className="font-bold text-gray-700 w-24">{cls.className}</span>
                    <div className="flex-1 relative h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                      <div 
                        className={cn("h-full rounded-full", cls.percentage >= 95 ? "bg-emerald-500" : cls.percentage >= 90 ? "bg-blue-500" : "bg-amber-500")}
                        style={{ width: `${cls.percentage}%` }}
                      />
                    </div>
                    <span className="font-extrabold text-gray-650 w-28 text-right">
                      {cls.present}/{cls.total} ({cls.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Students Widget */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              At-Risk Students Spotlight
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Immediate attention items flagged by low attendance or poor test averages.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="divide-y divide-gray-100">
              {atRiskList.map((student) => (
                <div key={student.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-50 border border-red-100 text-red-700 font-extrabold text-[11px] flex items-center justify-center">
                      {student.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-xs sm:text-sm text-gray-800">{student.name}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{student.class} • Roll {student.roll}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[150px] justify-end">
                    {student.riskTags.map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-655 border border-red-150 uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Parent Alert Dispatched",
                        description: `A notification has been sent to ${student.name}'s parent.`,
                      });
                    }}
                    className="h-8 rounded-lg text-[10px] font-bold border-red-200 hover:bg-red-50 text-red-600 shrink-0 bg-white"
                  >
                    Notify Parent
                  </Button>
                </div>
              ))}
            </div>
            <div className="pt-2 text-center">
              <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                <Link href="/analytics/at-risk">
                  View Full At-Risk Registry ({atRiskList.length} total)
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. Activity Heatmap */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4">
          <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Learning Activity Heatmap (Last 10 Weeks)
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Visual grid reflecting student portal activity levels across days of the week.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex gap-2.5 overflow-x-auto w-full pb-2 select-none">
            {/* Days Column */}
            <div className="grid grid-rows-7 gap-1.5 text-xs font-bold text-gray-400 pt-1 w-8 text-right">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="h-5 flex items-center justify-end pr-1">
                  {idx % 2 === 1 && day}
                </div>
              ))}
            </div>
            {/* Weeks columns */}
            <div className="flex gap-1.5">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-rows-7 gap-1.5 text-center">
                  <span className="text-[8px] font-bold text-gray-400 h-3 leading-none select-none">W{wIdx + 1}</span>
                  {week.map((entry, dIdx) => (
                    <div
                      key={dIdx}
                      className={cn(
                        "h-5 w-5 sm:h-6 sm:w-6 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-center font-bold text-[9px]",
                        getHeatmapColor(entry.value)
                      )}
                      title={`${entry.day}, Week ${wIdx + 1}: activity level ${entry.value}`}
                    >
                      {entry.value > 0 ? entry.value : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Heatmap Legend */}
          <div className="flex flex-row sm:flex-col gap-4 text-xs font-semibold text-gray-500 shrink-0 border-t sm:border-t-0 sm:border-l border-gray-250 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            <span className="font-bold text-gray-700 uppercase tracking-widest text-[10px] hidden sm:block">Scale Indicator</span>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-gray-150 border border-gray-300"></div>
              <span>Inactive (0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-100"></div>
              <span>Low (1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-300"></div>
              <span>Moderate (2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-blue-500"></div>
              <span>High (3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-indigo-600"></div>
              <span>Exceptional (4)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Assignment Tracker */}
      <Card className="border-gray-300 bg-white">
        <CardHeader className="border-b border-gray-250 pb-4 flex flex-row items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-500" />
              School Assignment Tracker
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Active school assignments and real-time submission rates.</CardDescription>
          </div>
          <Button onClick={() => setOpenAsnModal(true)} className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white font-bold h-10 px-4 text-xs sm:text-sm shadow-sm shrink-0 flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3">Title</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 hidden sm:table-cell">Subject</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 hidden sm:table-cell">Target Class</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Due Date</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 text-center">Submission Rate</th>
                  <th className="py-2.5 px-2 sm:px-4 sm:py-3 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assignmentList.map((asn) => (
                  <tr key={asn.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-2.5 px-2 sm:px-4 font-bold text-gray-800">{asn.title}</td>
                    <td className="py-2.5 px-2 sm:px-4 font-semibold text-gray-500 hidden sm:table-cell">{asn.subject}</td>
                    <td className="py-2.5 px-2 sm:px-4 font-semibold text-gray-500 hidden sm:table-cell">{asn.grade}</td>
                    <td className="py-2.5 px-2 sm:px-4 text-center font-bold text-gray-600">{asn.dueDate}</td>
                    <td className="py-2.5 px-2 sm:px-4 text-center">
                      <div className="flex items-center gap-2 justify-center max-w-[120px] mx-auto">
                        <span className="font-extrabold text-blue-650 text-[10px] sm:text-[11px] w-8">{asn.submissionRate}%</span>
                        <div className="flex-1 relative h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/40">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${asn.submissionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 sm:px-4 sm:px-6 text-right">
                      <Badge className={cn(
                        "rounded-full text-[9px] font-extrabold px-2 py-0.5",
                        asn.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        asn.status === 'Closed' ? "bg-gray-100 text-gray-600 border border-gray-200" :
                        asn.status === 'Pending' ? "bg-amber-50 text-amber-700 border border-amber-250" :
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
        </CardContent>
      </Card>

      {/* 8. Quizzes & Platform Engagement */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quizzes Overview */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              Quizzes & Mock Exams
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Aggregate metrics for interactive online quizzes and class mock tests.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {quizStats && (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50/50 p-4 border border-gray-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Active Quizzes</span>
                  <p className="text-2xl font-extrabold text-gray-800">{quizStats.active} / {quizStats.total}</p>
                </div>
                <div className="bg-gray-50/50 p-4 border border-gray-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Average Score</span>
                  <p className="text-2xl font-extrabold text-blue-650">{quizStats.averageScore}%</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject-Wise Quiz Performance</h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectQuizzes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="subject" stroke="#9CA3AF" fontSize={9} tickLine={false} />
                    <YAxis domain={[50, 90]} stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="averageScore" fill="#818CF8" radius={[4, 4, 0, 0]} name="Avg Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Engagement metrics */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Platform Utilization Metrics
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Weekly engagement load of student portal resource usage.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {platformUsage && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                <div className="flex flex-col space-y-1 bg-gray-50/50 p-2 border border-gray-200 rounded-xl">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase leading-none">Videos</span>
                  <span className="font-extrabold text-xs text-gray-900">{platformUsage.videosWatched}</span>
                </div>
                <div className="flex flex-col space-y-1 bg-gray-50/50 p-2 border border-gray-200 rounded-xl">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase leading-none">Notes</span>
                  <span className="font-extrabold text-xs text-gray-900">{platformUsage.notesAccessed}</span>
                </div>
                <div className="flex flex-col space-y-1 bg-gray-50/50 p-2 border border-gray-200 rounded-xl">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase leading-none">Submit</span>
                  <span className="font-extrabold text-xs text-gray-900">{platformUsage.assignmentsSubmitted}</span>
                </div>
                <div className="flex flex-col space-y-1 bg-gray-50/50 p-2 border border-gray-200 rounded-xl">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase leading-none">Quizzes</span>
                  <span className="font-extrabold text-xs text-gray-900">{platformUsage.quizAttempts}</span>
                </div>
                <div className="flex flex-col space-y-1 bg-gray-50/50 p-2 border border-gray-200 rounded-xl col-span-3 sm:col-span-1">
                  <span className="text-[8px] font-extrabold text-gray-400 uppercase leading-none">Act. Std</span>
                  <span className="font-extrabold text-xs text-blue-650">{platformUsage.dailyActiveStudents}</span>
                </div>
              </div>
            )}

            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daily Activity Type Load</h4>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                    <Bar dataKey="videos" fill="#3B82F6" stackId="a" name="Video Watch" />
                    <Bar dataKey="notes" fill="#10B981" stackId="a" name="Notes Read" />
                    <Bar dataKey="quizzes" fill="#F59E0B" stackId="a" name="Quizzes" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 9. AI Insights & Benchmarking */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Recommendations */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Administrative AI Recommendations
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Proactive notifications compiled from weekly school metrics.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {insights.map((ins) => (
              <div 
                key={ins.id} 
                className={cn(
                  "p-3.5 rounded-xl border flex items-start gap-3",
                  ins.type === "warning" ? "bg-red-50/50 border-red-200 text-red-950" :
                  ins.type === "alert" ? "bg-amber-50/50 border-amber-250 text-amber-950" :
                  ins.type === "good" ? "bg-emerald-50/50 border-emerald-250 text-emerald-950" :
                  "bg-blue-50/50 border-blue-200 text-blue-950"
                )}
              >
                <span className={cn(
                  "p-1 rounded shrink-0",
                  ins.type === "warning" ? "bg-red-100 text-red-600" :
                  ins.type === "alert" ? "bg-amber-100 text-amber-600" :
                  ins.type === "good" ? "bg-emerald-100 text-emerald-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  {ins.type === "warning" ? <AlertTriangle className="h-4.5 w-4.5" /> :
                   ins.type === "good" ? <CheckCircle className="h-4.5 w-4.5" /> :
                   <Plus className="h-4.5 w-4.5" />}
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider">
                    {ins.type === "warning" ? "Urgent Warning" :
                     ins.type === "alert" ? "Attention Required" :
                     ins.type === "good" ? "Milestone Reached" : "Info Brief"}
                  </h4>
                  <p className="text-[11px] sm:text-xs font-semibold leading-relaxed text-gray-700">{ins.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Benchmarking comparing to district/municipality */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              School Performance Benchmarking
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Comparing average academic scores of NoteSwift partner schools.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-4">
              {benchmarks.map((bm, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-gray-700">
                    <span className={cn(bm.isCurrentSchool ? "text-blue-700 font-extrabold flex items-center gap-1" : "text-gray-500")}>
                      {bm.isCurrentSchool && <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                      {bm.label}
                    </span>
                    <span className={cn("font-extrabold", bm.isCurrentSchool ? "text-blue-700" : "text-gray-700")}>{bm.percentage}%</span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-150 rounded-full overflow-hidden border border-gray-250/30">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", bm.color)}
                      style={{ width: `${bm.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-bold leading-normal">
              🏆 Lalitpur branch currently <span className="text-indigo-700">ranks #3 of 18</span> NoteSwift schools in the Central District. Average science performance stands +4% above the municipality median score.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 10. Parent Communication Preview & Reports export */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Parent Chat preview list */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              Recent Parent Conversations
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Secure communication threads with parents.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="divide-y divide-gray-100">
              {msgThreads.map((thread) => (
                <div 
                  key={thread.id} 
                  onClick={() => setSelectedThread(thread)}
                  className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-secondary/30 p-2 rounded-xl transition-all first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                      {thread.avatar}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-gray-800 flex items-center gap-1.5">
                        {thread.parentName}
                        {thread.unreadCount > 0 && (
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                        )}
                      </span>
                      <span className="text-[10px] text-gray-450 font-bold">Parent of {thread.studentName}</span>
                      <p className="text-xs text-gray-550 truncate font-semibold leading-relaxed mt-0.5 max-w-[220px] sm:max-w-xs">{thread.snippet}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 text-[10px] font-bold text-gray-400">
                    <span>{thread.timestamp}</span>
                    {thread.unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full mt-1">
                        {thread.unreadCount} new
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-center border-t border-gray-100">
              <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                <Link href="/communication/parent-comm">
                  Open Message Inbox
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operational Reports Compilation */}
        <Card className="border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-250 pb-4">
            <CardTitle className="text-md sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Administrative Reports & Exporter
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500 font-semibold">Compile and export structured school metrics immediately.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-4 bg-gray-50/50 p-4 border border-gray-200 rounded-2xl">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reportTemplate" className="text-xs font-bold text-gray-600">Select Template</Label>
                  <select 
                    id="reportTemplate"
                    value={exportReportName}
                    onChange={(e) => setExportReportName(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2.5"
                  >
                    <option value="Term Academic Performance">Term Academic Performance</option>
                    <option value="Attendance Log Summary">Attendance Log Summary</option>
                    <option value="At-Risk Retention Audit">At-Risk Retention Audit</option>
                    <option value="Platform Engagement Metrics">Platform Engagement Metrics</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-600">Format</Label>
                  <div className="flex gap-2">
                    {["PDF", "Excel", "CSV"].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportFormat(fmt as any)}
                        className={cn(
                          "flex-1 h-10 rounded-xl border font-bold text-xs transition-all",
                          exportFormat === fmt 
                            ? "bg-blue-50 border-blue-500 text-blue-700 font-extrabold shadow-sm" 
                            : "bg-white border-gray-300 hover:bg-secondary/40 text-gray-650"
                        )}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerateReport}
                disabled={isGeneratingRep}
                className="w-full bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-11 px-4 text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 rounded-xl"
              >
                {isGeneratingRep ? (
                  <>
                    <Plus className="h-4 w-4 animate-spin text-white" />
                    Compiling report sheets...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Compile & Download Report
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1.5">Generated Report History</h4>
              <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto">
                {reportList.slice(0, 3).map((rep) => (
                  <div key={rep.id} className="py-2.5 flex items-center justify-between text-xs px-1.5 hover:bg-secondary/20 rounded-lg transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{rep.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{rep.generatedAt} • {rep.size}</span>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => {
                        toast({
                          title: "Downloading File",
                          description: `Saving ${rep.name}.${rep.format.toLowerCase()}`,
                        });
                      }}
                      className="h-8 w-8 text-blue-650 hover:bg-blue-50 rounded-lg shrink-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 11. Create Assignment Modal */}
      <Dialog open={openAsnModal} onOpenChange={setOpenAsnModal}>
        <DialogContent className="max-w-md rounded-2xl border border-gray-300 bg-white z-50 p-6">
          <DialogHeader>
            <DialogTitle className="text-md sm:text-lg font-bold text-gray-900">Publish New Assignment</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-gray-500 font-semibold">
              Distribute homework, test papers, or projects to classes.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAssignment} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="asnTitle" className="text-xs sm:text-sm font-bold text-gray-700">Assignment Title *</Label>
              <Input
                id="asnTitle"
                placeholder="e.g. Algebra Practice Set 2"
                value={newAsnTitle}
                onChange={(e) => setNewAsnTitle(e.target.value)}
                required
                className="h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium text-xs sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="asnSubject" className="text-xs sm:text-sm font-bold text-gray-700">Subject</Label>
                <select
                  id="asnSubject"
                  value={newAsnSubject}
                  onChange={(e) => setNewAsnSubject(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="asnGrade" className="text-xs sm:text-sm font-bold text-gray-700">Target Grade</Label>
                <select
                  id="asnGrade"
                  value={newAsnGrade}
                  onChange={(e) => setNewAsnGrade(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2"
                >
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="asnDueDate" className="text-xs sm:text-sm font-bold text-gray-700">Due Date *</Label>
              <Input
                id="asnDueDate"
                type="date"
                value={newAsnDueDate}
                onChange={(e) => setNewAsnDueDate(e.target.value)}
                required
                className="h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium text-xs sm:text-sm"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpenAsnModal(false)} className="rounded-xl border-gray-300 font-bold text-xs h-10">Cancel</Button>
              <Button type="submit" disabled={isCreatingAsn} className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-10 border border-blue-650 flex items-center justify-center gap-1.5">
                {isCreatingAsn ? <Plus className="h-4 w-4 animate-spin text-white" /> : null}
                {isCreatingAsn ? "Publishing..." : "Publish Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 12. Quick Reply Chat Dialog */}
      <Dialog open={!!selectedThread} onOpenChange={() => setSelectedThread(null)}>
        <DialogContent className="max-w-md rounded-2xl border border-gray-300 bg-white z-50 p-6 flex flex-col h-[400px]">
          {selectedThread && (
            <>
              <DialogHeader className="border-b border-gray-150 pb-2">
                <DialogTitle className="text-sm sm:text-base font-bold text-gray-900">Chat with {selectedThread.parentName}</DialogTitle>
                <DialogDescription className="text-xs text-gray-500 font-semibold">
                  Regarding student: {selectedThread.studentName}
                </DialogDescription>
              </DialogHeader>
              
              {/* Message History area */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
                {selectedThread.messages.map((m: any, idx: number) => {
                  const isAdmin = m.sender === 'admin';
                  return (
                    <div key={idx} className={cn("flex", isAdmin ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl p-3 border",
                        isAdmin 
                          ? "bg-blue-500 border-blue-650 text-white rounded-br-none" 
                          : "bg-gray-150 border-gray-250 text-gray-800 rounded-bl-none font-semibold"
                      )}>
                        <p className="leading-relaxed">{m.text}</p>
                        <span className={cn("text-[9px] font-bold mt-1.5 block text-right", isAdmin ? "text-blue-100" : "text-gray-400")}>
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Send composer */}
              <div className="flex gap-2 pt-2 border-t border-gray-150 shrink-0">
                <Input
                  placeholder="Type reply message..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendReply();
                  }}
                  className="flex-1 h-10 border-gray-300 focus:border-blue-500 rounded-xl text-xs font-semibold"
                />
                <Button 
                  onClick={handleSendReply}
                  disabled={isSendingReply || !replyText.trim()}
                  className="h-10 w-10 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shrink-0 p-0 flex items-center justify-center border border-blue-600"
                >
                  {isSendingReply ? (
                    <Plus className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
