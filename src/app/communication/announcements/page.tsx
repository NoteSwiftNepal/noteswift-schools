"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { schoolDataApi } from "@/services/school-data-api";
import { Megaphone } from "lucide-react";

function AnnouncementsContent() {
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getAnnouncements()
      .then(d => { if (!cancelled) setNotices(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">School Notice Board</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Notices and circulars for parents and staff.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <Card className="border-gray-300 bg-white">
          <CardContent className="p-12 flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-650 rounded-2xl">
              <Megaphone className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-semibold max-w-sm">
              Publishing announcements isn't available yet. No notices have been posted.
            </p>
          </CardContent>
        </Card>
      ) : null}
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
