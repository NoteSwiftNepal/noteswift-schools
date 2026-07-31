"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldAlert, Users, MessageSquare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoginGuard } from "@/components/auth-guard";
import { useSchoolAuth } from "@/context/school-auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useSchoolAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Lockout timer handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLocked) {
      setError(`Account temporarily locked. Please wait ${lockoutTimer}s.`);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        setError(result.message || "Invalid credentials.");

        if (nextAttempts >= 3) {
          setIsLocked(true);
          setLockoutTimer(30);
          setError("Too many failed attempts. Login is locked for 30 seconds.");
          toast({
            variant: "destructive",
            title: "Access Temporarily Suspended",
            description: "Please wait 30 seconds before attempting to sign in again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: result.message || "Please verify your username and password.",
          });
        }
        return;
      }

      toast({
        title: "Welcome back",
        description: "Successfully authenticated to NoteSwift School Admin Portal.",
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Sign-in issue:", err);
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Reset Link Requested",
      description: "Password recovery flow is disabled in Phase 1 demo mode.",
    });
  };

  return (
    <LoginGuard>
      <main className="relative flex min-h-screen bg-gray-50 overflow-hidden">
        {/* Fullscreen loading transition overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full border-4 border-blue-100 animate-ping"></div>
              <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-indigo-600 border-b-transparent border-l-transparent animate-spin"></div>
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-sm font-bold text-gray-800 tracking-wide">Securing Portal Connection</h3>
              <p className="text-[10px] text-gray-500 font-semibold animate-pulse">Syncing administrative session token...</p>
            </div>
          </div>
        )}

        {/* Left Panel: Premium Visual Showcase (Hidden on Mobile) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-905 text-white p-12 flex-col justify-between overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-bl-[200px] pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Header logo / branding */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white p-2 rounded-xl shadow-md border border-white/10 shrink-0">
              <Image 
                src="/assets/logo.png" 
                alt="NoteSwift Logo" 
                width={38} 
                height={38} 
                className="object-contain" 
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider uppercase font-headline">NoteSwift</span>
              <span className="text-[10px] block font-extrabold uppercase tracking-widest text-blue-200">Schools Edition</span>
            </div>
          </div>

          {/* Core features pitch */}
          <div className="space-y-8 relative z-10 max-w-md my-auto">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight font-headline">
                Unified School Administration Portal
              </h2>
              <p className="text-sm text-blue-150 font-semibold leading-relaxed">
                Streamlining academic logs, performance benchmarks, and real-time collaboration with parents across Nepal.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <Users className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Administrative Directory</h4>
                  <p className="text-xs text-blue-200 font-semibold mt-0.5">Access centralized student portfolios, attendance registries, and grades.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <BarChart3 className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">AI-Powered Benchmarks</h4>
                  <p className="text-xs text-blue-200 font-semibold mt-0.5">Track at-risk students and compare section diagnostics against municipal averages.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <MessageSquare className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">Parent-Teacher Channels</h4>
                  <p className="text-xs text-blue-200 font-semibold mt-0.5">Dispatch circular alerts and hold direct messaging threads with guardians.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer inside left panel */}
          <div className="relative z-10 border-t border-white/10 pt-4 flex justify-between text-xs text-blue-250 font-semibold">
            <span>Version 1.0.0</span>
            <span>© {new Date().getFullYear()} Note Swift</span>
          </div>
        </div>

        {/* Right Panel: Clean Centered Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          {/* Decorative shapes for mobile background */}
          <div className="lg:hidden absolute top-0 left-0 w-32 h-32 border-4 border-blue-100 rounded-br-[60px] pointer-events-none"></div>
          <div className="lg:hidden absolute bottom-0 right-0 w-48 h-48 bg-blue-50/50 rounded-tl-[80px] pointer-events-none"></div>

          <div className="w-full max-w-[380px] space-y-6 relative z-10">
            {/* Header for Mobile only */}
            <div className="lg:hidden flex flex-col items-center text-center space-y-2 mb-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-300 shrink-0">
                <Image 
                  src="/assets/logo.png" 
                  alt="NoteSwift Logo" 
                  width={44} 
                  height={44} 
                  className="object-contain" 
                />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-800 tracking-tight font-headline">NoteSwift Schools</h1>
                <p className="text-xs text-gray-500 font-bold mt-0.5">School Administration Portal</p>
              </div>
            </div>

            <Card className="bg-white shadow-xl lg:shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
              <CardHeader className="space-y-1 pb-4 text-center lg:text-left">
                <CardTitle className="text-xl font-extrabold text-gray-900 font-headline">Sign In</CardTitle>
                <CardDescription className="text-xs text-gray-505 font-semibold">
                  Access your admin dashboard workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Administrator Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-gray-750">Administrator Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="principal.sharma@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || isLocked}
                        className="h-10 pl-9 border-gray-300 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-bold text-gray-750">Password</Label>
                      <a
                        href="#"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline font-bold"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading || isLocked}
                        className="h-10 pl-9 pr-9 border-gray-300 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        disabled={isLocked}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                      <p className="text-xs font-bold text-red-650 flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </p>
                    </div>
                  )}

                  {/* Login Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isLoading || isLocked}
                    className="w-full font-bold text-xs sm:text-sm h-11 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl border border-blue-600 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In to Portal"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mobile Footer branding */}
            <div className="text-center space-y-1 block lg:hidden">
              <p className="text-[10px] text-gray-400 font-bold">
                © {new Date().getFullYear()} Note Swift. Developed by{" "}
                <a
                  href="https://codelitsstudio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  Codelits Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </LoginGuard>
  );
}
