"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Megaphone, Plus, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const initialNotices = [
  { id: 1, title: "Grade 10 Pre-Board Examination Schedule", content: "The final prep boards will commence from Ashadh 15. All students must collect their admit cards from the admin desk by Ashadh 12.", category: "exam", date: "2026-06-25", author: "Principal Sharma" },
  { id: 2, title: "Parent-Teacher Conference (PTC) Meeting", content: "Terminal grades review meeting scheduled for Grade 9 parents. Timings are 10:00 AM - 2:00 PM.", category: "event", date: "2026-06-20", author: "Academic Coordinator" },
  { id: 3, title: "Monsoon School Break Circular", content: "School will remain closed from Ashadh 22 to Ashadh 26 due to weather advisories. Virtual check-in materials are available on portals.", category: "holiday", date: "2026-06-18", author: "Administration Desk" }
];

function AnnouncementsContent() {
  const { toast } = useToast();
  const [notices, setNotices] = useState(initialNotices);
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("event");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please specify title and message content.",
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newNotice = {
        id: Date.now(),
        title,
        content,
        category,
        date: new Date().toISOString().split("T")[0],
        author: "Principal Sharma"
      };
      setNotices(prev => [newNotice, ...prev]);
      toast({
        title: "Circular Broadcasted",
        description: `"${title}" has been successfully pinned to the notice board.`,
      });
      // Reset
      setTitle("");
      setContent("");
      setOpenModal(false);
      setSubmitting(false);
    }, 450);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-headline">School Notice Board</h2>
          <p className="text-xs text-gray-500 font-bold mt-1">Publish notices, holiday alerts, and exam circulars to parent portfolios.</p>
        </div>
        <Button onClick={() => setOpenModal(true)} className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-10 px-4 text-xs sm:text-sm shadow-sm flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          Broadcast Circular
        </Button>
      </div>

      {/* Notice List Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {notices.map((notice) => (
          <Card key={notice.id} className="border-gray-300 bg-white hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="border-b border-gray-250 pb-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={notice.category === "exam" ? "destructive" : notice.category === "event" ? "default" : "secondary"} className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {notice.category}
                </Badge>
                <span className="text-[10px] text-gray-400 font-bold font-mono">{notice.date}</span>
              </div>
              <CardTitle className="text-xs sm:text-sm font-extrabold text-gray-800 leading-snug line-clamp-1">{notice.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-gray-650 leading-relaxed font-semibold line-clamp-3">{notice.content}</p>
              <div className="border-t border-gray-150 pt-3 text-[10px] text-gray-500 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  Issued by:
                </span>
                <span className="text-gray-700 font-extrabold">{notice.author}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publish Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md rounded-2xl border border-gray-300 bg-white z-50 p-6">
          <DialogHeader>
            <DialogTitle className="text-md sm:text-lg font-bold text-gray-900">Broadcast Notice Board Circular</DialogTitle>
            <DialogDescription className="text-xs text-gray-500 font-semibold">
              This message will immediately pin to parent dashboards.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePublish} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs sm:text-sm font-bold text-gray-700">Notice Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Science Lab Renovation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs sm:text-sm font-bold text-gray-700">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-xl bg-white text-xs font-semibold px-2.5"
              >
                <option value="event">General Event</option>
                <option value="exam">Exam Schedule</option>
                <option value="holiday">School Break / Holiday</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs sm:text-sm font-bold text-gray-700">Notice Message Content *</Label>
              <textarea
                id="content"
                rows={4}
                placeholder="Type the message circular content detail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full border border-gray-300 focus:border-blue-500 rounded-xl p-3 text-xs font-medium focus:ring-0 focus:outline-none"
              />
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)} className="rounded-xl border-gray-300 font-bold text-xs h-10">Cancel</Button>
              <Button type="submit" disabled={submitting} className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs h-10 border border-blue-650 flex items-center justify-center gap-1.5">
                {submitting ? <Plus className="h-4 w-4 animate-spin text-white" /> : null}
                {submitting ? "Broadcasting..." : "Broadcast Notice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AnnouncementsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
