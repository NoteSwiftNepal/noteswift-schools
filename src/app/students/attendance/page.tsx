"use client";

import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

function AttendanceContent() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Attendance Tracker</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Daily attendance tracking and section-wise analysis.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-16 flex flex-col items-center text-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-650 rounded-2xl">
            <CalendarDays className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-gray-800">Coming Soon</h3>
          <p className="text-sm text-gray-500 font-semibold max-w-sm">
            Attendance tracking isn't available yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <AttendanceContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
