"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { schoolDataApi } from "@/services/school-data-api";
import { MessageSquare } from "lucide-react";

function ParentCommContent() {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getParentMessages()
      .then(d => { if (!cancelled) setThreads(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Parent Communication</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Direct messaging with parents.</p>
      </div>

      {loading ? (
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      ) : threads.length === 0 ? (
        <Card className="border-gray-300 bg-white">
          <CardContent className="p-12 flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-semibold max-w-sm">
              Parent messaging isn't available yet. No conversations to show.
            </p>
          </CardContent>
        </Card>
      ) : null}
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
