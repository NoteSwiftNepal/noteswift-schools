"use client";

import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { schoolDataApi } from "@/services/school-data-api";
import { FileText } from "lucide-react";

function ReportsContent() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    schoolDataApi.getReports()
      .then(d => { if (!cancelled) setReports(d); })
      .catch(err => console.error(err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Reports</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Compiled school metric exports.</p>
      </div>

      {loading ? (
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      ) : reports.length === 0 ? (
        <Card className="border-gray-300 bg-white">
          <CardContent className="p-12 flex flex-col items-center text-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-semibold max-w-sm">
              Report generation isn't available yet. No reports have been created.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <ReportsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
