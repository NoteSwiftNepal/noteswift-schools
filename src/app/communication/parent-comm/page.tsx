"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { apiService } from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, UserCheck, Search, ShieldAlert, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function ParentCommContent() {
  const { toast } = useToast();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const loadThreads = async () => {
    setLoading(true);
    try {
      const data = await apiService.getParentMessages();
      setThreads(data);
      if (data.length > 0 && selectedId === null) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  const activeThread = threads.find(t => t.id === selectedId);

  const handleSend = async () => {
    if (!replyText.trim() || !selectedId) return;
    setSending(true);
    try {
      const updated = await apiService.sendParentMessage(selectedId, replyText);
      setThreads(prev => prev.map(t => t.id === selectedId ? updated : t));
      setReplyText("");
      toast({
        title: "Reply Dispatched",
        description: "Your message has been sent.",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // Filtered threads
  const filteredThreads = threads.filter(t => 
    t.parentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Parent Communication Center</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Direct messaging channels with parents regarding child academic logs.</p>
      </div>

      {/* Main Inbox split grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in duration-200">
          <div className="space-y-4">
            <Card className="border-gray-300 bg-white">
              <CardContent className="p-4 space-y-4">
                <div className="h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                <div className="space-y-3 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-2.5 items-center animate-pulse">
                      <div className="w-8.5 h-8.5 rounded-full bg-gray-200"></div>
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2.5 bg-gray-150 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="border-gray-300 bg-white h-[500px] p-6 space-y-4">
              <div className="flex gap-3 items-center animate-pulse border-b border-gray-100 pb-4">
                <div className="w-9 h-9 rounded-full bg-gray-200"></div>
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-2.5 bg-gray-155 rounded w-1/3"></div>
                </div>
              </div>
              <div className="flex-1 space-y-4 py-4 animate-pulse">
                <div className="h-12 bg-gray-100 rounded-2xl w-2/3"></div>
                <div className="h-12 bg-gray-100 rounded-2xl w-1/2 ml-auto"></div>
                <div className="h-12 bg-gray-100 rounded-2xl w-1/3"></div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Side: Threads List */}
        <div className={cn("space-y-4 md:block", mobileView === 'chat' ? 'hidden' : 'block')}>
          <Card className="border-gray-300 bg-white">
            <CardHeader className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by parent name, child..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 border-gray-300 focus:border-blue-500 rounded-xl text-xs font-semibold"
                />
              </div>
            </CardHeader>
            <CardContent className="p-1 space-y-1 divide-y divide-gray-100 max-h-[450px] overflow-y-auto">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => {
                    setSelectedId(thread.id);
                    setMobileView('chat');
                  }}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors text-xs flex gap-2.5 items-start",
                    selectedId === thread.id ? "bg-blue-50/50 text-blue-800 font-bold" : "hover:bg-secondary/40 text-gray-700"
                  )}
                >
                  <div className="w-8.5 h-8.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                    {thread.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-gray-800 truncate block">{thread.parentName}</span>
                    <span className="text-[10px] text-gray-450 block font-bold mt-0.5">Parent of {thread.studentName}</span>
                    <p className="text-[11px] text-gray-550 truncate font-semibold mt-1 leading-relaxed">{thread.snippet}</p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <Badge className="bg-blue-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                      {thread.unreadCount} new
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Active Chat Window */}
        <div className={cn("md:col-span-2 md:block", mobileView === 'list' ? 'hidden' : 'block')}>
          {activeThread ? (
            <Card className="border-gray-300 bg-white flex flex-col justify-between h-[500px]">
              <CardHeader className="border-b border-gray-200 p-4 flex flex-row items-center gap-3 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileView('list')}
                  className="md:hidden p-1.5 h-8 w-8 rounded-lg border border-gray-250 text-gray-600 hover:text-gray-900 bg-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-150 text-indigo-750 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                  {activeThread.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-bold text-gray-800 truncate">{activeThread.parentName}</CardTitle>
                  <CardDescription className="text-xs font-semibold text-gray-500 truncate">Student case: {activeThread.studentName} ({activeThread.class})</CardDescription>
                </div>
              </CardHeader>
              
              {/* Message history */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {activeThread.messages.map((m: any, mIdx: number) => {
                  const isAdmin = m.sender === "admin";
                  return (
                    <div key={mIdx} className={cn("flex", isAdmin ? "justify-end" : "justify-start")}>
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

              {/* Chat Send Composer */}
              <div className="p-4 border-t border-gray-200 flex gap-2.5 items-center shrink-0">
                <Input
                  placeholder="Type message response details..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  className="flex-1 h-11 border-gray-300 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-semibold"
                />
                <Button 
                  onClick={handleSend}
                  disabled={sending || !replyText.trim()}
                  className="h-11 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white border border-blue-600 font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                >
                  {sending ? (
                    <span className="animate-spin text-white">●</span>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-[500px] border border-gray-300 rounded-2xl bg-white text-gray-400 font-bold text-xs">
              Select a parent conversation thread from the left menu.
            </div>
          )}
        </div>
      </div>
      )}

    </div>
  );
}

export default function ParentCommPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <ParentCommContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
