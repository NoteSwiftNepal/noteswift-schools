"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { schoolDataApi, StudentSummary, StudentDetail } from "@/services/school-data-api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StudentAvatar } from "@/components/student-avatar";
import { useToast } from "@/hooks/use-toast";
import { Search, User, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

function StudentDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const result = await schoolDataApi.listStudents({
        search: search || undefined,
        grade: gradeFilter !== 'all' ? gradeFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });
      setStudents(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, currentPage]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleViewProfile = async (student: StudentSummary) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    router.replace(`/students/directory?id=${student._id}`);
    try {
      const detail = await schoolDataApi.getStudentDetail(student._id);
      setSelectedStudent(detail);
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", description: "Failed to load student profile." });
    } finally {
      setDrawerLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && !selectedStudent) {
      setDrawerOpen(true);
      setDrawerLoading(true);
      schoolDataApi.getStudentDetail(id)
        .then(setSelectedStudent)
        .catch(() => {})
        .finally(() => setDrawerLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseDrawer = (open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      setSelectedStudent(null);
      router.replace("/students/directory");
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Student Directory</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Search students linked to this school and view their course progress.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-10 h-11 border-gray-300 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-semibold"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={gradeFilter}
                onChange={(e) => { setGradeFilter(e.target.value); setCurrentPage(1); }}
                className="h-11 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-3 w-full sm:min-w-[130px]"
              >
                <option value="all">All Grades</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setGradeFilter("all"); setCurrentPage(1); }}
                className="h-11 border-gray-300 hover:bg-secondary rounded-xl text-xs font-bold px-4 shrink-0"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6">Student</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4">Grade</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Enrolled Courses</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Avg Progress</th>
                    <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <StudentAvatar avatarEmoji={student.avatarEmoji} profileImage={student.profileImage} size="sm" />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[120px] sm:max-w-none">{student.full_name}</span>
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold">{student.email}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-semibold text-gray-700">{student.grade ?? '—'}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-bold text-gray-650">{student.enrolledCourseCount}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-extrabold text-blue-650">{student.avgProgress}%</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleViewProfile(student)}
                          className="h-8 rounded-lg text-[10px] font-bold bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white shadow-sm px-3"
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 font-bold text-xs">
              {search || gradeFilter !== 'all'
                ? "No students match the selected filters."
                : "No students linked to this school yet. Students link automatically when they redeem a school-issued unlock code."}
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && total > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 p-4 border border-gray-300 bg-white rounded-xl text-xs sm:text-sm">
          <div className="text-gray-500 font-bold">
            Page <span className="text-gray-800 font-extrabold">{currentPage}</span> of{" "}
            <span className="text-gray-800 font-extrabold">{totalPages}</span> ({total} students)
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="h-9 rounded-lg font-bold border-gray-300">
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="h-9 rounded-lg font-bold border-gray-300">
              Next
            </Button>
          </div>
        </div>
      )}

      <Sheet open={drawerOpen} onOpenChange={handleCloseDrawer}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white border-l border-gray-300 p-4 sm:p-6 z-50">
          {drawerLoading ? (
            <div className="pt-10 text-center text-sm text-gray-400 font-semibold">Loading profile...</div>
          ) : selectedStudent && (
            <div className="space-y-6 pt-4 text-xs sm:text-sm">
              <div className="flex gap-4 items-center p-4 border border-gray-200 bg-secondary/40 rounded-2xl">
                <StudentAvatar avatarEmoji={selectedStudent.student.avatarEmoji} profileImage={selectedStudent.student.profileImage} size="lg" />
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-base font-extrabold text-gray-900 truncate">{selectedStudent.student.full_name}</h3>
                  <p className="text-xs text-gray-400 font-bold">{selectedStudent.student.email}</p>
                  <div className="flex gap-2 items-center flex-wrap pt-1">
                    <Badge className="bg-blue-600 text-white font-extrabold text-[9px] rounded-full px-2 py-0.5">Grade {selectedStudent.student.grade ?? '—'}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-150 pb-1 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-gray-400" />
                  Course Enrollments
                </h4>
                {selectedStudent.enrollments.length === 0 ? (
                  <p className="text-sm text-gray-400 font-semibold text-center py-6">Not enrolled in any course yet.</p>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[9px] font-extrabold text-gray-450 uppercase">
                          <th className="py-2.5 px-3">Course</th>
                          <th className="py-2.5 px-3 text-center">Progress</th>
                          <th className="py-2.5 px-3 text-right">Avg Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                        {selectedStudent.enrollments.map((e, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 font-bold text-gray-800">{e.courseTitle}</td>
                            <td className="py-2.5 px-3 text-center">{e.progress}%</td>
                            <td className="py-2.5 px-3 text-right font-extrabold text-blue-650">{e.avgAssessmentScore != null ? `${e.avgAssessmentScore}%` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
