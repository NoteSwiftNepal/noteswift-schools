"use client";

import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

function StudyMaterialsContent() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Study Materials Library</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Distribute learning assets, reference guides, and lecture notes.</p>
      </div>

      <Card className="border-gray-300 bg-white">
        <CardContent className="p-12 flex flex-col items-center text-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-650 rounded-2xl">
            <FolderOpen className="h-6 w-6" />
          </div>
          <p className="text-sm text-gray-500 font-semibold max-w-sm">
            A shared study materials library isn't available yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StudyMaterialsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <StudyMaterialsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
