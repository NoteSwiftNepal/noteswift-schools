"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiService } from "@/services/api";
import { Assignment } from "@/mocks/mock-data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, ClipboardList, Plus, Calendar, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

function AssignmentsContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [list, setList] = useState<Assignment[]>([]);
  
  // Create Modal state
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("Grade 10");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Deep-linked highlight state
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAsn = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAssignments();
        setList(data);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    fetchAsn();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, subjectFilter]);

  // Handle URL parameter deep-linking
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setHighlightedId(id);
      // Automatically remove highlight state after 3 seconds
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please specify title and due date.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const newAsn = await apiService.createAssignment({ title, subject, grade, dueDate });
      setList(prev => [newAsn, ...prev]);
      toast({
        title: "Assignment Published",
        description: `"${title}" has been successfully scheduled.`,
      });
      // Reset
      setTitle("");
      setDueDate("");
      setOpenModal(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Publishing Failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter list
  const filteredList = list.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.grade.toLowerCase().includes(search.toLowerCase());
    const matchSub = subjectFilter === "all" || item.subject === subjectFilter;
    return matchSearch && matchSub;
  });

  const totalItems = filteredList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">Assignment Registry</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Manage active class assignments, verify submission stats, and publish homework schedules.</p>
        </div>
        <Button onClick={() => setOpenModal(true)} className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-10 px-4 text-xs sm:text-sm shadow-sm flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          Publish Assignment
        </Button>
      </div>

      {/* Stats summary row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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
            <div className="text-xl sm:text-2xl font-extrabold text-blue-650">
              {list.filter(l => l.status === 'Active').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-1 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Avg Submission Rate</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">88.6%</div>
          </CardContent>
        </Card>

        <Card className="border-gray-300 bg-white">
          <CardHeader className="pb-1 p-3 sm:p-5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase">Draft Items</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 pt-0">
            <div className="text-xl sm:text-2xl font-extrabold text-gray-500">
              {list.filter(l => l.status === 'Draft').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
            <Input
              placeholder="Search by assignment title, grade..."
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
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assignment List Table */}
      <Card className="border-gray-300 bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="w-full">
              <div className="border-b border-gray-200 bg-gray-50/50 h-12 animate-pulse flex items-center px-6">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </div>
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="py-4 px-6 flex items-center justify-between animate-pulse">
                    <div className="space-y-2 w-1/3">
                      <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2.5 bg-gray-150 rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-205 rounded w-16"></div>
                    <div className="h-4 bg-gray-150 rounded w-12"></div>
                    <div className="h-7 bg-gray-200 rounded-lg w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6">Title</th>
                  <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 hidden sm:table-cell">Subject</th>
                  <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 hidden sm:table-cell">Target Class</th>
                  <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Due Date</th>
                  <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center">Submission Rate</th>
                  <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((asn) => {
                  const isHighlighted = highlightedId === asn.id;
                  
                  return (
                    <tr 
                      key={asn.id} 
                      className={cn(
                        "transition-all duration-300 hover:bg-secondary/20",
                        isHighlighted ? "bg-blue-50/80 animate-pulse border-l-4 border-l-blue-500" : ""
                      )}
                    >
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                        {isHighlighted && <Star className="h-4 w-4 text-blue-500 fill-blue-500 shrink-0" />}
                        <span>{asn.title}</span>
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-semibold text-gray-500 hidden sm:table-cell">{asn.subject}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 font-semibold text-gray-500 hidden sm:table-cell">{asn.grade}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-bold text-gray-650">{asn.dueDate}</td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 text-center font-extrabold text-blue-650">
                        {asn.status === 'Draft' || asn.status === 'Pending' ? "—" : `${asn.submissionRate}%`}
                      </td>
                      <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-6 text-right">
                        <Badge className={cn(
                          "rounded-full text-[9px] font-extrabold px-2.5 py-0.5",
                          asn.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-250" :
                          asn.status === 'Closed' ? "bg-gray-150 text-gray-600 border border-gray-200" :
                          asn.status === 'Pending' ? "bg-amber-50 text-amber-700 border border-amber-250" :
                          "bg-slate-100 text-slate-600 border border-slate-200"
                        )}>
                          {asn.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-300 bg-white rounded-xl text-xs sm:text-sm">
          <div className="text-gray-500 font-bold">
            Showing <span className="text-gray-800 font-extrabold">{indexOfFirstItem + 1}</span> to{" "}
            <span className="text-gray-800 font-extrabold">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
            <span className="text-gray-800 font-extrabold">{totalItems}</span> assignments
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

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="w-[92vw] max-w-md rounded-2xl border border-gray-300 bg-white z-50 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-md sm:text-lg font-bold text-gray-900">Publish New Assignment</DialogTitle>
            <DialogDescription className="text-xs text-gray-500 font-semibold">
              Publish school work assignments to student portals.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePublish} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs sm:text-sm font-bold text-gray-700">Assignment Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Algebra Practice Set 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium text-xs sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs sm:text-sm font-bold text-gray-700">Subject</Label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                <Label htmlFor="grade" className="text-xs sm:text-sm font-bold text-gray-700">Target Grade</Label>
                <select
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2"
                >
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 8">Grade 8</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate" className="text-xs sm:text-sm font-bold text-gray-700">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium text-xs sm:text-sm"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)} className="rounded-xl border-gray-300 font-bold text-xs h-10">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-10 border border-blue-650 flex items-center justify-center gap-1.5">
                {submitting ? <Plus className="h-4 w-4 animate-spin text-white" /> : null}
                {submitting ? "Publishing..." : "Publish Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
