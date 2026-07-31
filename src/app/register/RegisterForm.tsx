"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Lock, Mail, Phone, School as SchoolIcon, ShieldAlert, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { schoolAuthApi, SchoolInfoResponse } from "@/services/school-auth-api";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const [verifying, setVerifying] = useState(true);
  const [invitationValid, setInvitationValid] = useState(false);
  const [invitationEmail, setInvitationEmail] = useState("");
  const [school, setSchool] = useState<SchoolInfoResponse | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      return;
    }
    (async () => {
      try {
        const data = await schoolAuthApi.verifyInvitation(token);
        setInvitationValid(true);
        setInvitationEmail(data.email);
        setSchool(data.school);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Invalid Invitation",
          description: err instanceof Error ? err.message : "This invitation is invalid or expired.",
        });
      } finally {
        setVerifying(false);
      }
    })();
  }, [token, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^\d{7,15}$/.test(phoneNumber.trim())) {
      setError("Enter a valid phone number (digits only, 7-15 characters).");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{10,}$/.test(password)) {
      setError("Password must be at least 10 characters long and include both letters and numbers.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await schoolAuthApi.completeRegistration({
        token: token!,
        name: name.trim(),
        phone_number: phoneNumber.trim(),
        password,
      });
      toast({ title: "Success", description: "Account created successfully! You can now log in." });
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create account.";
      setError(message);
      toast({ variant: "destructive", title: "Error", description: message });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Verifying invitation...</p>
        </div>
      </main>
    );
  }

  if (!invitationValid || !school) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200 rounded-2xl">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Invalid Invitation</h2>
            <p className="mb-5 text-sm text-gray-500">
              This invitation link is invalid or has expired. Ask your NoteSwift admin to send a new one.
            </p>
            <Button className="h-11 w-full rounded-lg font-medium" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-300 shrink-0">
            <Image src="/assets/logo.png" alt="NoteSwift Logo" width={44} height={44} className="object-contain" />
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">NoteSwift Schools</h1>
        </div>

        <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-extrabold text-gray-900">Complete Your Registration</CardTitle>
            <CardDescription className="text-xs text-gray-500 font-semibold">
              Finish setting up your principal account to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-1 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="text-sm font-medium">Invitation verified for {invitationEmail}</span>
            </div>

            {/* School is fixed by the invitation — shown, not selectable */}
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="h-9 w-9 rounded-full border bg-white flex items-center justify-center overflow-hidden shrink-0">
                {school.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={school.logoUrl} alt={`${school.name} logo`} className="w-full h-full object-cover" />
                ) : (
                  <SchoolIcon className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">{school.name}</p>
                <p className="text-xs text-blue-700 font-mono">{school.shortCode}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input id="email" type="email" value={invitationEmail} disabled className="h-10 pl-9 rounded-lg bg-gray-50 text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10 pl-9 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10 pl-9 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10 pl-9 pr-9 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">At least 10 characters, including letters and numbers</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-10 pl-9 rounded-lg text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                  <p className="text-xs font-bold text-red-650 flex items-start gap-2">
                    <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <Button type="submit" className="h-11 w-full rounded-lg font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
