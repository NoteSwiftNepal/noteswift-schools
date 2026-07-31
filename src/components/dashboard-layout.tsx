"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Award,
  TrendingUp,
  CalendarCheck,
  ClipboardList,
  HelpCircle,
  FileText,
  FolderOpen,
  PieChart,
  Activity,
  AlertTriangle,
  Megaphone,
  Mail,
  FileSpreadsheet,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Globe,
  Loader2,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronRight,
  School as SchoolIcon,
  GraduationCap
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSchoolAuth } from "@/context/school-auth-context";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { schoolDataApi } from "@/services/school-data-api";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const {
    admin,
    schools,
    activeSchool,
    setActiveSchool,
    academicYears,
    activeYear,
    setActiveYear,
    logout,
    isAdminPreview,
  } = useSchoolAuth();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Global search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Live badges counts
  const [activeAssignmentsCount, setActiveAssignmentsCount] = useState(0);
  const [atRiskCount, setAtRiskCount] = useState(0);

  // Fetch count statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const listAsn = await schoolDataApi.getAssignments();
        setActiveAssignmentsCount(listAsn.filter(a => a.status === 'active').length);

        const listAtRisk = await schoolDataApi.getAtRiskStudents();
        setAtRiskCount(listAtRisk.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  // Trigger page transition loading on route change
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle global search filter — real data, debounced since it now hits
  // the backend instead of filtering an in-memory mock array.
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const [studentsResult, assignmentsList] = await Promise.all([
          schoolDataApi.listStudents({ search: searchQuery, limit: 5 }),
          schoolDataApi.getAssignments(),
        ]);
        if (cancelled) return;

        const matches: any[] = [];

        studentsResult.data.forEach(student => {
          matches.push({
            type: "student",
            id: student._id,
            title: student.full_name,
            subtitle: `Grade ${student.grade ?? '—'}`,
            url: `/students/directory?id=${student._id}`
          });
        });

        assignmentsList
          .filter(asn => asn.title.toLowerCase().includes(query) || asn.subjectName?.toLowerCase().includes(query))
          .slice(0, 5 - matches.length)
          .forEach(asn => {
            matches.push({
              type: "assignment",
              id: asn._id,
              title: asn.title,
              subtitle: asn.subjectName,
              url: `/academic/assignments`
            });
          });

        setSearchResults(matches.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery]);

  const handleSearchSelect = (url: string) => {
    setSearchQuery("");
    setShowSearchDropdown(false);
    setIsPageLoading(true);
    router.push(url);
  };

  const handleSchoolSwitch = (school: any) => {
    setIsPageLoading(true);
    setActiveSchool(school);
    toast({
      title: "Workspace Switched",
      description: `Dashboard scope modified to ${school.name}.`,
    });
    setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
  };

  const handleYearSwitch = (year: string) => {
    setIsPageLoading(true);
    setActiveYear(year);
    toast({
      title: "Academic Session Altered",
      description: `Viewing data for session ${year}.`,
    });
    setTimeout(() => {
      setIsPageLoading(false);
    }, 450);
  };

  // No real notification system exists yet — starts empty rather than
  // showing fabricated alerts.
  const [notifications, setNotifications] = useState<{ id: number; text: string; time: string; unread: boolean; type: string }[]>([]);

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    logout();
    toast({
      title: "Session Terminated",
      description: "You have successfully signed out.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Build navigation section configuration based on ai-school.txt spec
  const sidebarSections = [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ]
    },
    {
      title: "Students",
      items: [
        { href: "/students/directory", label: "Student Directory", icon: Users },
        { href: "/students/leaderboard", label: "Leaderboard", icon: Award },
        { href: "/students/progress", label: "Student Progress", icon: TrendingUp },
        { href: "/students/attendance", label: "Attendance", icon: CalendarCheck },
      ]
    },
    {
      title: "Academic Management",
      items: [
        { href: "/academic/assignments", label: "Assignments", icon: ClipboardList, badgeCount: activeAssignmentsCount },
        { href: "/academic/quizzes", label: "Quizzes", icon: HelpCircle },
        { href: "/academic/mock-tests", label: "Mock Tests", icon: FileText },
        { href: "/academic/study-materials", label: "Study Materials", icon: FolderOpen },
      ]
    },
    {
      title: "Analytics",
      items: [
        { href: "/analytics/academic", label: "Academic Analytics", icon: PieChart },
        { href: "/analytics/engagement", label: "Engagement", icon: Activity },
        { href: "/analytics/at-risk", label: "At-Risk Students", icon: AlertTriangle, badgeCount: atRiskCount, badgeColor: "bg-red-500" },
      ]
    },
    {
      title: "Communication",
      items: [
        { href: "/communication/announcements", label: "Announcements", icon: Megaphone },
        { href: "/communication/parent-comm", label: "Parent Communication", icon: Mail },
      ]
    },
    {
      title: "More",
      items: [
        { href: "/more/reports", label: "Reports", icon: FileSpreadsheet },
        { href: "/more/settings", label: "Settings", icon: Settings },
      ]
    }
  ];

  const getPageTitle = () => {
    for (const section of sidebarSections) {
      const match = section.items.find(item => item.href === pathname || pathname.startsWith(item.href + "/"));
      if (match) return match.label;
    }
    return "School Admin Portal";
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/95">
        {/* COLLAPSIBLE SIDEBAR */}
        <Sidebar className="h-full border-r border-gray-300 bg-sidebar/80 backdrop-blur supports-[backdrop-filter]:bg-sidebar/70">
          <SidebarHeader className="border-b border-gray-300 py-4 px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2"
            >
              <img
                src="/assets/logo.png"
                alt="NoteSwift Logo"
                className="h-10 w-10 object-contain rounded-xl shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-bold text-base leading-none text-gray-800 tracking-tight">NoteSwift</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">School Admin</span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-4 py-4 space-y-5 overflow-y-auto">
            {/* Mobile Branch & Academic Year Selectors (visible only on mobile) */}
            <div className="flex flex-col gap-3 pb-4 mb-2 border-b border-gray-250 md:hidden">
              {/* Branch Selector (Mobile) */}
              {activeSchool && schools.length > 0 && (
                <div className="flex flex-col gap-1 px-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Branch</span>
                  <select
                    value={activeSchool.id}
                    onChange={(e) => {
                      const selected = schools.find(s => s.id === e.target.value);
                      if (selected) handleSchoolSwitch(selected);
                    }}
                    className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2.5 w-full focus:border-blue-500 text-gray-700"
                  >
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name.replace('NoteSwift Academy - ', '')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Academic Year Selector (Mobile) (hidden above mobile/sm) */}
              {academicYears.length > 0 && (
                <div className="flex flex-col gap-1 px-3 sm:hidden">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Academic Year</span>
                  <select
                    value={activeYear}
                    onChange={(e) => handleYearSwitch(e.target.value)}
                    className="h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2.5 w-full focus:border-blue-500 text-gray-700"
                  >
                    {academicYears.map((yr) => (
                      <option key={yr.id} value={yr.id}>
                        {yr.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {sidebarSections.map((section, idx) => (
              <div key={idx} className="space-y-1.5">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-sm font-bold group",
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg"
                            : "text-foreground/80 hover:bg-secondary/80 hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-blue-500")} />
                          <span>{item.label}</span>
                        </div>
                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className={cn(
                            "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full text-[9px] font-extrabold text-white leading-none shadow-sm",
                            isActive ? "bg-white/20 text-white" : (('badgeColor' in item ? item.badgeColor : undefined) as string || "bg-blue-600")
                          )}>
                            {item.badgeCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </SidebarContent>

          {/* SIDEBAR FOOTER - LOGGED IN PROFILE CHIP */}
          <SidebarFooter className="border-t border-gray-300 p-4 space-y-2">
            {admin && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/60 border border-gray-250">
                <Avatar className="w-10 h-10 rounded-full border border-blue-200 shrink-0 overflow-hidden shadow-inner">
                  <AvatarImage
                    src={admin.avatar}
                    alt={admin.fullName}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-extrabold text-xs">
                    {admin.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-extrabold text-xs sm:text-sm truncate text-gray-800">{admin.fullName}</span>
                  <span className="text-[10px] text-gray-500 font-bold tracking-tight">{admin.role}</span>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full justify-start gap-2.5 h-11 px-3 rounded-xl border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 transition-all duration-200 font-bold text-xs sm:text-sm bg-white"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin text-red-500" />
              ) : (
                <LogOut className="h-4 w-4 text-gray-500" />
              )}
              <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1 min-h-screen min-w-0 max-w-full overflow-x-hidden">
          {/* HEADER TOPBAR */}
          <header className="sticky top-0 flex h-16 items-center justify-between border-b border-gray-200/80 px-3 sm:px-6 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center gap-2 sm:gap-3">
              <SidebarTrigger />
              <div className="hidden lg:flex flex-col border-l border-gray-250 pl-3.5">
                <h1 className="text-md sm:text-lg font-bold text-gray-800 font-headline leading-tight">{getPageTitle()}</h1>
                <span className="text-[10px] text-gray-500 font-bold mt-0.5">{formattedDate}</span>
              </div>
            </div>

            {/* TOPBAR ACTIONS */}
            <div className="flex items-center gap-1.5 sm:gap-3.5 flex-1 justify-end max-w-4xl ml-2 sm:ml-4">
              
              {/* STATEFUL GLOBAL SEARCH BAR */}
              <div className="relative flex-1 max-w-[240px] md:max-w-[280px] hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search students, classes..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    className="h-10 pl-8.5 pr-4 rounded-xl border-gray-200 bg-gray-50/70 focus:bg-white text-xs font-semibold text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150 w-full"
                  />
                </div>
                {/* Search result popup */}
                {showSearchDropdown && searchQuery.trim() && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSearchDropdown(false)}></div>
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="text-[10px] font-bold text-gray-400 px-2 pb-1 border-b border-gray-100 uppercase">Search Results</div>
                      {searchResults.length > 0 ? (
                        searchResults.map((res) => (
                          <div
                            key={`${res.type}-${res.id}`}
                            onClick={() => handleSearchSelect(res.url)}
                            className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                          >
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-bold text-gray-800">{res.title}</span>
                              <span className="text-[10px] text-gray-500 font-semibold">{res.subtitle}</span>
                            </div>
                            <span className={cn(
                              "text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider",
                              res.type === "student" ? "bg-blue-100 text-blue-800" :
                              res.type === "class" ? "bg-purple-100 text-purple-800" :
                              "bg-amber-100 text-amber-800"
                            )}>
                              {res.type}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-gray-500 font-bold">No matches found for "{searchQuery}"</div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* ACTIVE SCHOOL SELECTOR */}
              {activeSchool && schools.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hidden md:flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-1.5 sm:px-3 rounded-xl border-gray-250 hover:bg-secondary/40 shadow-sm transition-all duration-200 bg-white">
                      <SchoolIcon className="h-4 w-4 text-blue-600 shrink-0" />
                      <div className="hidden md:flex flex-col items-start text-left select-none gap-0.5 max-w-[120px]">
                        <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider leading-none">Branch</span>
                        <span className="text-[10px] font-bold text-gray-700 leading-none truncate w-full">{activeSchool.name.replace('NoteSwift Academy - ', '')}</span>
                      </div>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-450 ml-0.5 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-200 shadow-lg p-1.5 bg-white z-30">
                    <DropdownMenuLabel className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1.5">Switch Branch</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {schools.map((school) => (
                      <DropdownMenuItem
                        key={school.id}
                        onClick={() => handleSchoolSwitch(school)}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold",
                          activeSchool.id === school.id ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-secondary/60 text-gray-700"
                        )}
                      >
                        <SchoolIcon className="h-4 w-4 shrink-0" />
                        <div className="flex flex-col">
                          <span>{school.name}</span>
                          <span className="text-[9px] text-gray-450 font-semibold">{school.address}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* ACADEMIC YEAR SELECTOR */}
              {academicYears.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hidden sm:flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-1.5 sm:px-2.5 rounded-xl border-gray-250 hover:bg-secondary/40 shadow-sm transition-all duration-200 bg-white">
                      <GraduationCap className="h-4 w-4 text-indigo-650 shrink-0" />
                      <span className="text-[10.5px] font-bold text-gray-700 leading-none hidden sm:inline">{activeYear}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-gray-455 shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl border border-gray-200 shadow-lg p-1.5 bg-white z-30">
                    <DropdownMenuLabel className="text-[9px] font-bold text-gray-400 uppercase tracking-wider px-2.5 py-1.5">Academic Session</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {academicYears.map((yr) => (
                      <DropdownMenuItem
                        key={yr.id}
                        onClick={() => handleYearSwitch(yr.id)}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-xs font-semibold",
                          activeYear === yr.id ? "bg-blue-50 text-blue-700 font-bold" : "hover:bg-secondary/60 text-gray-700"
                        )}
                      >
                        <span>{yr.label}</span>
                        {activeYear === yr.id && <Sparkles className="h-3.5 w-3.5 text-blue-500" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
                            {/* MESSAGE ICON - QUICK LINK */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/communication/parent-comm')}
                className="hidden sm:inline-flex h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-gray-100 text-gray-600 relative shrink-0 transition-colors"
              >
                <Mail className="h-4 w-4 text-gray-550" />
                <span className="absolute top-0.5 right-0.5 flex h-3.5 min-w-[14px] px-1 items-center justify-center rounded-full bg-blue-500 text-[7px] font-extrabold text-white border border-white shadow-sm leading-none">
                  1
                </span>
              </Button>

              {/* NOTIFICATION BELL */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-gray-100 text-gray-650 relative shrink-0 transition-colors">
                    <Bell className="h-4 w-4 text-gray-550" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 flex h-3.5 min-w-[14px] px-1 items-center justify-center rounded-full bg-red-500 text-[7px] font-extrabold text-white border border-white shadow-sm leading-none">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 rounded-xl border border-gray-200 shadow-lg p-0 bg-white z-40">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h4 className="text-xs font-bold text-gray-800">Notifications</h4>
                    {unreadNotificationsCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] text-blue-650 font-bold hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-150 max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={cn("p-4 text-[11px] transition-colors flex gap-2.5 items-start", n.unread ? "bg-blue-50/30" : "")}>
                          <span className={cn(
                            "w-2 h-2 rounded-full mt-1 shrink-0",
                            n.type === "warning" ? "bg-red-500" : n.type === "alert" ? "bg-amber-500" : "bg-blue-500"
                          )} />
                          <div className="space-y-0.5">
                            <p className="font-semibold text-gray-800 leading-snug">{n.text}</p>
                            <span className="text-[9px] text-gray-400 font-bold mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500 font-bold text-xs">
                        No notifications
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* PROFILE MENU DROPDOWN */}
              {admin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shadow-sm hover:ring-2 hover:ring-blue-500/20 transition-all duration-200 focus:outline-none shrink-0 bg-white border border-gray-200">
                      <Avatar className="w-full h-full">
                        <AvatarImage src={admin.avatar} alt={admin.fullName} />
                        <AvatarFallback className="bg-blue-50 text-blue-700 font-extrabold text-xs">
                          {admin.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-200 shadow-lg p-1.5 bg-white z-40">
                    <DropdownMenuLabel className="flex flex-col p-2.5">
                      <span className="font-bold text-xs text-gray-800">{admin.fullName}</span>
                      <span className="text-[10px] text-gray-400 font-semibold">{admin.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => router.push('/more/settings')}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-secondary/60 text-xs font-semibold text-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/more/settings')}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-secondary/60 text-xs font-semibold text-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      System Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-xs font-bold text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

            </div>
          </header>

          {isAdminPreview && (
            <div className="bg-amber-500 text-white text-xs sm:text-sm font-bold text-center py-2 px-4 flex items-center justify-center gap-3 flex-wrap">
              <span>You're viewing this school's dashboard as an admin preview — not a real principal session.</span>
              <button
                onClick={logout}
                className="underline underline-offset-2 hover:no-underline shrink-0"
              >
                Exit Preview
              </button>
            </div>
          )}

          {/* MAIN PAGE VIEWPORT */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden p-3.5 sm:p-6 md:p-8">
            {isPageLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] h-full py-20 space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-16 h-16 rounded-full border-4 border-blue-100 animate-ping"></div>
                  <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="space-y-1.5 text-center">
                  <h3 className="text-sm font-bold text-gray-800 tracking-wide">Retrieving Operational Data</h3>
                  <p className="text-xs text-gray-500 font-semibold animate-pulse">Syncing school records database...</p>
                </div>
              </div>
            ) : (
              children
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
