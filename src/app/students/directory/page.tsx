"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiService } from "@/services/api";
import { StudentProfile } from "@/mocks/mock-data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Search, SlidersHorizontal, User, Phone, CheckCircle, XCircle, Clock, GraduationCap, ClipboardList, BookOpen, AlertTriangle, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function StudentDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  // Filters state
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load students with filter dependencies
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStudentsDirectory(search, classFilter, statusFilter);
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadStudents();
  }, [search, classFilter, statusFilter]);

  // Handle URL deep-linking on mount
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const fetchProfile = async () => {
        const student = await apiService.getStudentProfile(id);
        if (student) {
          setSelectedStudent(student);
          setDrawerOpen(true);
        }
      };
      fetchProfile();
    }
  }, [searchParams]);

  const handleViewProfile = (student: StudentProfile) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
    // Push history URL to match state
    router.replace(`/students/directory?id=${student.id}`);
  };

  const handleCloseDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSelectedStudent(null);
      // Remove query parameter
      router.replace("/students/directory");
    }
  };

  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = students.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Description */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Student Administration Directory</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Search student records, track enrollment, view grade summaries, and inspect historical profiles.</p>
      </div>

      {/* Filter and Search Bar Card */}
      <Card className="border-gray-300 bg-white">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <Input
                placeholder="Search by student name, roll number, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-semibold tracking-wide"
              />
            </div>
            
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 w-full md:w-auto">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-xs font-bold text-gray-500 hidden sm:inline">Grade:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="h-11 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-3 w-full sm:min-w-[130px]"
                >
                  <option value="all">All Grades</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 w-full">
                <span className="text-xs font-bold text-gray-500 hidden sm:inline">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-3 w-full sm:min-w-[135px]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setClassFilter("all");
                  setStatusFilter("all");
                  toast({
                    description: "Filters have been reset.",
                  });
                }}
                className="h-11 border-gray-300 hover:bg-secondary rounded-xl text-xs font-bold px-4 col-span-2 sm:col-span-1"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Grid/Table */}
      <Card className="border-gray-300 bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="w-full">
              <div className="border-b border-gray-200 bg-gray-50/50 h-12 animate-pulse flex items-center px-6">
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="py-4 px-6 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-gray-205 rounded w-3/4"></div>
                        <div className="h-2.5 bg-gray-150 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-205 rounded w-20"></div>
                    <div className="h-4 bg-gray-150 rounded w-12"></div>
                    <div className="h-7 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6">Student</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 hidden sm:table-cell">Roll ID</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4">Class Room</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center hidden sm:table-cell">Avg Attendance</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Academic Score</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 hidden md:table-cell">Enroll Status</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((student) => (
                    <tr key={student.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-750 font-extrabold text-[9px] sm:text-[10px] flex items-center justify-center shrink-0">
                          {student.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[90px] sm:max-w-none">{student.name}</span>
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">{student.id}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-bold text-gray-650 hidden sm:table-cell">#{student.roll}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-semibold text-gray-700">{student.class}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className={cn(
                            "font-extrabold",
                            student.attendance >= 90 ? "text-emerald-600" : student.attendance >= 80 ? "text-blue-600" : "text-red-500"
                          )}>{student.attendance}%</span>
                          {student.attendance < 80 && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-extrabold text-blue-650">{student.score}%</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 hidden md:table-cell">
                        <Badge className={cn(
                          "rounded-full text-[9px] font-extrabold px-2 py-0.5",
                          student.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-250" :
                          student.status === "On Leave" ? "bg-amber-50 text-amber-700 border border-amber-250" :
                          "bg-red-50 text-red-700 border border-red-250"
                        )}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleViewProfile(student)}
                          className="h-8 rounded-lg text-[9.5px] sm:text-[10.5px] font-bold bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white shadow-sm px-2 sm:px-3"
                        >
                          <span className="hidden xs:inline">View Profile</span>
                          <span className="xs:hidden">View</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 font-bold text-xs">
              No students match the selected search filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-300 bg-white rounded-xl text-xs sm:text-sm">
          <div className="text-gray-500 font-bold">
            Showing <span className="text-gray-800 font-extrabold">{indexOfFirstItem + 1}</span> to{" "}
            <span className="text-gray-800 font-extrabold">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
            <span className="text-gray-800 font-extrabold">{totalItems}</span> students
          </div>
          
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap justify-center">
            {/* Page Size Select */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-gray-500">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-9 border border-gray-300 rounded-lg bg-white text-xs font-semibold px-2"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 rounded-lg font-bold border-gray-300"
              >
                Previous
              </Button>
              
              {/* Simple page indicators */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (currentPage > 3 && totalPages > 5) {
                    if (currentPage + 2 <= totalPages) {
                      pageNum = currentPage - 3 + i;
                    } else {
                      pageNum = totalPages - 5 + i + 1;
                    }
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "h-9 w-9 rounded-lg font-bold",
                        currentPage === pageNum ? "bg-blue-500 hover:bg-blue-600 border-blue-600 text-white shadow-sm" : "border-gray-300"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-9 rounded-lg font-bold border-gray-300"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Detail Drawer / Sheet */}
      <Sheet open={drawerOpen} onOpenChange={handleCloseDrawer}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white border-l border-gray-300 p-4 sm:p-6 z-50">
          {selectedStudent && (
            <div className="space-y-6 pt-4 text-xs sm:text-sm">
              
              {/* Profile Drawer Header */}
              <div className="flex gap-4 items-center p-4 border border-gray-200 bg-secondary/40 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-blue-100 border border-blue-200 text-blue-800 font-extrabold text-lg flex items-center justify-center shrink-0">
                  {selectedStudent.avatar}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-base font-extrabold text-gray-900 truncate">{selectedStudent.name}</h3>
                  <p className="text-xs text-gray-400 font-extrabold tracking-wider">{selectedStudent.id}</p>
                  <div className="flex gap-2 items-center flex-wrap pt-1">
                    <Badge className="bg-blue-600 text-white font-extrabold text-[9px] rounded-full px-2 py-0.5">{selectedStudent.class}</Badge>
                    <span className="text-[10px] text-gray-500 font-bold">Roll: #{selectedStudent.roll}</span>
                    <Badge variant={selectedStudent.status === "Active" ? "outline" : "destructive"} className="text-[9px] font-bold px-2 py-0.5">
                      {selectedStudent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Personal details grid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-150 pb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  Parent & Guardian Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/50 p-4 border border-gray-200 rounded-xl">
                  <div>
                    <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Guardian Name</span>
                    <span className="font-bold text-gray-800 block mt-1">{selectedStudent.parentName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Mobile Number</span>
                    <span className="font-mono font-bold text-gray-800 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3 text-gray-400" />
                      +977-{selectedStudent.parentPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic subject average performance */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-150 pb-1 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  Academic Grade Sheet
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-extrabold text-gray-450 uppercase">
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3 text-center">Marks %</th>
                        <th className="py-2.5 px-3 text-right">Grade Scale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                      {selectedStudent.subjectGrades.map((sub, sIdx) => (
                        <tr key={sIdx}>
                          <td className="py-2.5 px-3 font-bold text-gray-800">{sub.subject}</td>
                          <td className="py-2.5 px-3 text-center">{sub.score}%</td>
                          <td className="py-2.5 px-3 text-right font-extrabold text-blue-650">{sub.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attendance Log history list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-150 pb-1 flex items-center gap-1.5">
                  <CalendarCheck className="h-3.5 w-3.5 text-gray-400" />
                  Recent Attendance Log ({selectedStudent.attendance}%)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedStudent.attendanceHistory.map((att, aIdx) => (
                    <div key={aIdx} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200/80 bg-gray-50/50">
                      <span className="font-bold text-gray-600 font-mono text-[11px]">{att.date}</span>
                      <div className="flex items-center gap-1">
                        {att.status === "Present" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-250 font-bold text-[9px] rounded-full py-0.5 px-2">Present</Badge>
                        ) : att.status === "Late" ? (
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-250 font-bold text-[9px] rounded-full py-0.5 px-2">Late</Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 border border-red-250 font-bold text-[9px] rounded-full py-0.5 px-2">Absent</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignments details history list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-150 pb-1 flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-gray-400" />
                  Assignment Completion History
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-extrabold text-gray-450 uppercase">
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3 text-center">Score</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                      {selectedStudent.assignments.map((asn, asIdx) => (
                        <tr key={asIdx}>
                          <td className="py-2.5 px-3 font-bold text-gray-800 truncate max-w-[150px]">{asn.title}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-gray-650">{asn.score !== null ? `${asn.score}%` : "—"}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={cn(
                              "text-[9px] font-bold px-2 py-0.5 rounded-full border inline-block",
                              asn.status === "Submitted" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                              asn.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-250" :
                              "bg-red-50 text-red-700 border-red-200"
                            )}>
                              {asn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}

export default function StudentDirectoryPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <StudentDirectoryContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
