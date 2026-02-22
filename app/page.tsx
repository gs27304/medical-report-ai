
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  StickyNote,
  Upload,
  Plus,
  Loader2,
  ChevronRight,
  Sparkles,
  Mail,
  ShieldCheck,
  Activity,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";

export default function Home() {
  const [stats, setStats] = useState({
    labReports: 0,
    notes: 0,
    recentReports: [] as any[],
    recentNotes: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch lab reports
      const { data: labReports } = await supabase
        .from("lab_reports")
        .select("id, file_name, uploaded_at, ai_analysis")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false })
        .limit(5);

      // Fetch notes
      const { data: notes } = await supabase
        .from("notes")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        labReports: labReports?.length || 0,
        notes: notes?.length || 0,
        recentReports: labReports || [],
        recentNotes: notes || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] space-y-8 pb-4">
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* 1. Hero Welcome Section */}
          <div className="relative rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 text-white shadow-lg overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-blue-50 backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4 text-blue-100" />
                Welcome to PathoLens
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Your AI-Powered Medical Intelligence Hub
              </h1>
              <p className="text-blue-100 text-lg max-w-xl">
                Upload your lab reports or sync directly with Gmail. We use advanced Gemini AI to extract data, flag critical alerts, and explain your health metrics in plain English.
              </p>
              <div className="flex gap-4 pt-2">
                <Link href="/lab-reports">
                  <Button className="bg-white text-blue-700 hover:bg-gray-100 shadow-md">
                    <Upload className="mr-2 h-4 w-4" /> Analyze New Report
                  </Button>
                </Link>
              </div>
            </div>
            {/* Decorative Background Icon */}
            <Activity className="absolute right-[-5%] bottom-[-10%] h-64 w-64 text-white/10 rotate-12" />
          </div>

          {/* 2. Feature Highlights Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
              <CardHeader className="pb-2">
                <BrainCircuit className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">AI Report Translation</CardTitle>
                <CardDescription>
                  Stop googling medical jargon. Our Gemini AI breaks down your complex PDF reports into simple, actionable summaries.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-indigo-50/50 border-indigo-100 shadow-sm">
              <CardHeader className="pb-2">
                <Mail className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle className="text-lg">Automated Gmail Sync</CardTitle>
                <CardDescription>
                  Securely connect your inbox. We'll automatically detect, fetch, and analyze medical lab reports sent by your clinic.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
              <CardHeader className="pb-2">
                <ShieldCheck className="h-8 w-8 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Secure Health Notes</CardTitle>
                <CardDescription>
                  Keep track of doctor instructions, symptoms, and dietary plans in a private, encrypted environment.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* 3. Dashboard Data (Side-by-Side on Desktop) */}
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Recent Lab Reports Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Recent Lab Reports</h2>
                <Link href="/lab-reports">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  {stats.recentReports.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {stats.recentReports.map((report) => (
                        <Link
                          key={report.id}
                          href="/lab-reports"
                          className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {report.file_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(report.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4">
                      <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 mb-4">No lab reports analyzed yet.</p>
                      <Link href="/lab-reports">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Upload className="h-4 w-4 mr-2" /> Upload Report
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Notes Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Encrypted Notes</h2>
                <Link href="/notes">
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                    <Plus className="h-4 w-4 mr-1" /> New Note
                  </Button>
                </Link>
              </div>
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  {stats.recentNotes.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {stats.recentNotes.map((note) => (
                        <Link
                          key={note.id}
                          href="/notes"
                          className="block p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <StickyNote className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {note.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(note.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 px-4">
                      <StickyNote className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500 mb-4">No notes saved yet.</p>
                      <Link href="/notes">
                        <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                          <Plus className="h-4 w-4 mr-2" /> Create Note
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

    
    </div>
  );
}




