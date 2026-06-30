"use client";

import { useState } from "react";
import { DashboardGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useSchoolAuth } from "@/context/school-auth-context";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Shield, Phone, School, MapPin } from "lucide-react";

function SettingsContent() {
  const { admin, activeSchool } = useSchoolAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(admin?.fullName || "Ramesh Sharma");
  const [phone, setPhone] = useState("9851023456");
  const [updating, setUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      toast({
        title: "Settings Updated",
        description: "Your administrator profile has been saved successfully.",
      });
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 font-headline">Portal Settings</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">Review administrator profile values and system branch settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Avatar Summary Card */}
        <Card className="border-gray-300 bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 border border-blue-200 text-blue-800 font-extrabold text-2xl flex items-center justify-center overflow-hidden shadow-inner mb-4">
            {admin?.avatar ? (
              <img src={admin.avatar} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              fullName.split(" ").map(n => n[0]).join("")
            )}
          </div>
          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 leading-snug">{fullName}</h3>
          <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider mt-1">{admin?.role || "School Administrator"}</span>
          <p className="text-[11px] text-gray-500 font-semibold mt-1 leading-relaxed max-w-[200px]">NoteSwift Academy Central System Portal</p>
        </Card>

        {/* Right Side: Settings inputs Form */}
        <Card className="md:col-span-2 border-gray-300 bg-white">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-sm font-bold text-gray-800">Administrative Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-gray-600">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-9 h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-gray-600">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={admin?.email || ""}
                      disabled
                      className="pl-9 h-10 border-gray-150 bg-gray-50 text-gray-450 rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-bold text-gray-600">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-9 h-10 border-gray-300 focus:border-blue-500 rounded-xl font-medium font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-bold text-gray-600">Authority Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="role"
                      value={admin?.role || ""}
                      disabled
                      className="pl-9 h-10 border-gray-150 bg-gray-50 text-gray-450 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-4 space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-gray-400" />
                  Active Branch Information
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 bg-gray-50 p-4 border border-gray-200 rounded-xl">
                  <div>
                    <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block">Branch Scope</span>
                    <span className="font-bold text-gray-800 block mt-1">{activeSchool?.name || "NoteSwift Academy - Lalitpur"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-450 uppercase leading-none block flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-450" />
                      Branch Address
                    </span>
                    <span className="font-bold text-gray-800 block mt-1">{activeSchool?.address || "Kupondole, Lalitpur, Nepal"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={updating}
                  className="rounded-xl bg-blue-500 hover:bg-blue-600 border border-blue-650 text-white font-bold h-10 px-6 text-xs sm:text-sm shadow-sm"
                >
                  {updating ? "Saving Changes..." : "Save Profile Details"}
                </Button>
              </div>
            </form>
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
