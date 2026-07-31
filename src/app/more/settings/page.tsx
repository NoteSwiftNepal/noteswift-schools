"use client";

import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useSchoolAuth } from "@/context/school-auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Shield, Phone, School, MapPin } from "lucide-react";

function SettingsContent() {
  const { admin, activeSchool } = useSchoolAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Portal Settings</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Your administrator profile and school details.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gray-300 bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-200 text-blue-800 font-extrabold text-2xl flex items-center justify-center overflow-hidden shadow-inner mb-4">
            {admin?.avatar && admin.avatar !== '/assets/logo.png' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={admin.avatar} alt={admin.fullName} className="w-full h-full object-cover" />
            ) : (
              (admin?.fullName || '?').split(" ").map(n => n[0]).join("").slice(0, 2)
            )}
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">{admin?.fullName || '—'}</h3>
          <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider mt-1">{admin?.role || "School Administrator"}</span>
        </Card>

        <Card className="md:col-span-2 border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-sm font-bold text-gray-800">Administrator Profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs sm:text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-gray-400" />Full Name</span>
                <p className="font-semibold text-gray-800 pl-5">{admin?.fullName || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-gray-400" />Email</span>
                <p className="font-semibold text-gray-800 pl-5">{admin?.email || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-gray-400" />Phone</span>
                <p className="font-semibold text-gray-800 pl-5">{admin?.phone_number || '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-gray-400" />Role</span>
                <p className="font-semibold text-gray-800 pl-5">{admin?.role || '—'}</p>
              </div>
            </div>

            <div className="border-t border-gray-150 pt-4 space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <School className="h-3.5 w-3.5 text-gray-400" />
                School
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 bg-gray-50 p-4 border border-gray-200 rounded-xl">
                <div>
                  <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Name</span>
                  <span className="font-bold text-gray-800 block mt-1">{activeSchool?.name || '—'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-450" />
                    Address
                  </span>
                  <span className="font-bold text-gray-800 block mt-1">{activeSchool?.address || 'Not set'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardGuard>
      <DashboardLayout>
        <SettingsContent />
      </DashboardLayout>
    </DashboardGuard>
  );
}
