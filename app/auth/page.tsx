"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles, UserCheck, ShieldCheck, Loader2 } from "lucide-react";
import { User, AuthError, Session } from "@supabase/supabase-js";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError(
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    supabase.auth
      .getUser()
      .then(({ data, error }: { data: { user: User | null }; error: AuthError | null }) => {
        if (error) {
          console.error("Error getting user:", error);
          return;
        }
        setUserEmail(data.user?.email ?? null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUserEmail(session?.user?.email ?? null);
      if (session?.user) {
        // Redirect to home after successful auth
        router.push("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleSignUp = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Check your email to confirm your account.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    if (!supabase) return;
    setGuestLoading(true);
    setError(null);
    try {
      // 1. Ensure backend guest account exists
      await fetch("/api/auth/guest", { method: "POST" });

      // 2. Sign in via normal authentication flow
      const { error } = await supabase.auth.signInWithPassword({
        email: "interviewer@demo.com",
        password: "Interviewer@123",
      });

      if (error) throw error;
      router.push("/");
    } catch (err: unknown) {
      console.error("Guest sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to log in with guest account.";
      setError(errorMessage);
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserEmail(null);
  };

  const handleGmailSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${appUrl}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gmail sign in failed";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSSOSignIn = async () => {
    if (!email.trim()) {
      setError("Please enter your work email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/scalekit/authorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to initiate SSO");
      }

      // Redirect to SSO provider
      window.location.href = data.authorizationUrl;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "SSO sign in failed";
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">
              Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL
              and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/50">
      <Card className="w-full max-w-md border-gray-200/80 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            PathoLens Access
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Access your lab reports, health notes, and AI assistant
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {userEmail ? (
            <div className="space-y-4">
              <div className="space-y-2 text-sm text-center">
                <p className="text-muted-foreground">
                  Signed in as <span className="font-semibold text-gray-900">{userEmail}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  You can access your profile and sign out from the user menu in
                  the top right corner of the app.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => router.push("/")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex-1"
                >
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Interviewer / Guest Access Section */}
              <div className="rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-blue-50/20 p-4 space-y-3 relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                      Interviewer & Recruiter Access
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100/70 text-blue-700 border-blue-200 text-[10px]">
                    One-Click Demo
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore full features directly with pre-loaded demo credentials without registering.
                </p>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2.5 border border-blue-100 text-xs space-y-1 text-slate-700 font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-semibold text-slate-800">interviewer@demo.com</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-semibold text-slate-800">Interviewer@123</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px] font-sans">
                    <span className="text-slate-500">Permissions:</span>
                    <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                      Interactive (Restricted Admin)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    type="button"
                    onClick={handleGuestSignIn}
                    disabled={guestLoading || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm transition-all active:scale-[0.99]"
                  >
                    {guestLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in as Guest...
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Continue as Guest
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or Sign In With Account
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50"
                onClick={handleGmailSignIn}
                disabled={loading || guestLoading}
              >
                <Mail className="mr-2 h-4 w-4 text-red-500" />
                Continue with Gmail
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or Work SSO
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSSOSignIn();
                    }
                  }}
                  disabled={loading || guestLoading}
                />
                <Button
                  onClick={handleSSOSignIn}
                  variant="outline"
                  className="w-full"
                  disabled={loading || guestLoading || !email.trim()}
                >
                  Sign in with SSO
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or Email & Password
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) {
                      handleSignIn();
                    }
                  }}
                  disabled={loading || guestLoading}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && password) {
                      handleSignIn();
                    }
                  }}
                  disabled={loading || guestLoading}
                />
              </div>

              {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={handleSignIn}
                  disabled={loading || guestLoading || !email || !password}
                >
                  Sign in
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleSignUp}
                  disabled={loading || guestLoading || !email || !password}
                >
                  Sign up
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
