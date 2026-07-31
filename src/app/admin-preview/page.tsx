"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

function AdminPreviewBridge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError(true);
      return;
    }
    // Marked distinctly from a normal principal login so the dashboard can
    // show a persistent "you're previewing, not really logged in" banner.
    localStorage.setItem('schoolToken', token);
    localStorage.setItem('isAdminPreview', 'true');
    router.replace('/dashboard');
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <ShieldAlert className="h-8 w-8 text-red-500" />
          <p className="text-sm font-semibold text-gray-700">This preview link is missing its token and can't be opened.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Opening school dashboard...</p>
      </div>
    </main>
  );
}

export default function AdminPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    }>
      <AdminPreviewBridge />
    </Suspense>
  );
}
