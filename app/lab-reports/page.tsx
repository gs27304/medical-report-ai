
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase-client";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Trash2,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Activity,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GmailConnector } from "@/components/gmail-connector";
import { LabReportUpload } from "@/components/lab-report-upload";
import { LabGeminiPanel } from "@/components/lab-gemini-panel";
import { LabReportChat } from "@/components/lab-report-chat";

interface LabReport {
  id: string;
  file_name: string;
  raw_text: string;
  structured_data?: {
    testType?: string;
    date?: string;
    testResults?: Array<{
      name: string;
      value: string;
      unit?: string;
      referenceRange?: string;
      status?: "normal" | "high" | "low" | "critical";
    }>;
  };
  ai_analysis?: string;
  uploaded_at: string;
}

export default function LabReportsPage() {
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyAnalysis = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const fetchLabReports = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

      const response = await fetch(`/api/lab/reports?userId=${user.id}`, { headers });
      const data = await response.json();

      if (data.success) {
        setLabReports(data.labReports || []);
      }
    } catch (error) {
      console.error("Error fetching lab reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabReports();
  }, [fetchLabReports]);

  const handleDelete = async (reportId: string) => {
    if (!supabase) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: { session } } = await supabase.auth.getSession();
      const headers: HeadersInit = {};
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;

      const response = await fetch(`/api/lab/reports?id=${reportId}&userId=${user.id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        setLabReports(labReports.filter((r) => r.id !== reportId));
        if (selectedReport?.id === reportId) setSelectedReport(null);
      }
    } catch (error) {
      console.error("Error deleting lab report:", error);
    }
  };

  const totalReports = labReports.length;
  const normalReports = labReports.filter((r) => {
    const results = r.structured_data?.testResults || [];
    return results.every((t) => t.status === "normal" || !t.status);
  }).length;
  const abnormalReports = totalReports - normalReports;
  const criticalReports = labReports.filter((r) => {
    const results = r.structured_data?.testResults || [];
    return results.some((t) => t.status === "critical");
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Lab Report Analysis</h2>
          <p className="text-muted-foreground">Upload and analyze your lab test results with AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2">
          <GmailConnector />
          <LabReportUpload onUploadSuccess={fetchLabReports} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Recent Reports</TabsTrigger>
          <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Stats Cards remain same but can be wrapped in better UI */}
            <Card className="border-none shadow-sm bg-white"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase text-slate-500">Total Reports</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalReports}</div></CardContent></Card>
            <Card className="border-none shadow-sm bg-white"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase text-slate-500">Normal</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{normalReports}</div></CardContent></Card>
            <Card className="border-none shadow-sm bg-white"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase text-slate-500">Abnormal</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">{abnormalReports}</div></CardContent></Card>
            <Card className="border-none shadow-sm bg-white"><CardHeader className="pb-2"><CardTitle className="text-xs font-semibold uppercase text-slate-500">Critical</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{criticalReports}</div></CardContent></Card>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
          ) : labReports.length > 0 && labReports[0]?.ai_analysis ? (
            <Card className="overflow-hidden border-2 border-blue-100 shadow-xl bg-gradient-to-b from-white to-blue-50/20">
              <CardHeader className="border-b border-blue-100 bg-white/50 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                    <CardTitle className="text-xl font-bold text-blue-900">Latest Intelligence Summary</CardTitle>
                  </div>
                  <CardDescription className="font-medium text-blue-600/70">
                    Analysis for {labReports[0].structured_data?.testType || labReports[0].file_name}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyAnalysis(labReports[0].ai_analysis!, "latest")}
                  className={`h-9 px-4 text-xs font-bold flex items-center gap-2 transition-all duration-300 rounded-full border
                    ${copiedId === "latest" 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200" 
                      : "text-blue-600 border-blue-200 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 hover:-translate-y-0.5"
                    }`}
                >
                  {copiedId === "latest" ? <><Check className="h-3.5 w-3.5 stroke-[3px]" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Analysis</>}
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="p-6 rounded-xl border-4 border-blue-200 bg-white shadow-inner relative group min-h-[200px]">
                  <div className="prose prose-blue max-w-none text-slate-700 leading-relaxed">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-bold text-blue-800 border-b pb-1 mb-2">{children}</h1>,
                        strong: ({ children }) => <strong className="text-blue-700 font-bold bg-blue-50 px-1 rounded">{children}</strong>,
                        p: ({ children }) => <p className="mb-4 text-sm leading-relaxed">{children}</p>,
                      }}
                    >
                      {labReports[0].ai_analysis}
                    </ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          <LabGeminiPanel />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader><CardTitle>Recent Lab Reports</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-blue-50/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <FileText className="h-5 w-5 text-slate-600 group-hover:text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{report.structured_data?.testType || report.file_name}</p>
                        <p className="text-xs text-slate-500">{new Date(report.uploaded_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)} className="font-bold text-blue-600 hover:text-blue-700">View</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(report.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {selectedReport ? (
            <div className="space-y-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Detailed Test Results</CardTitle>
                    <CardDescription>{selectedReport.file_name}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>Close</Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {selectedReport.structured_data?.testResults?.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-800">{test.name}</p>
                        <p className="text-xs text-slate-500">Range: {test.referenceRange || "N/A"}</p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="font-bold">{test.value} {test.unit}</p>
                        </div>
                        <Badge variant={test.status === 'normal' ? 'default' : 'destructive'} className="uppercase text-[10px] tracking-widest">{test.status || 'Normal'}</Badge>
                      </div>
                    </div>
                  ))}

                  {selectedReport.ai_analysis && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-600" /> AI Medical Insight
                        </h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyAnalysis(selectedReport.ai_analysis!, selectedReport.id)}
                          className={`h-8 px-3 text-xs font-bold flex items-center gap-2 transition-all duration-300 rounded-lg border
                            ${copiedId === selectedReport.id 
                              ? "bg-emerald-600 text-white border-emerald-600" 
                              : "text-emerald-600 border-emerald-100 hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
                            }`}
                        >
                          {copiedId === selectedReport.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedId === selectedReport.id ? "Copied" : "Copy Insight"}
                        </Button>
                      </div>
                      <div className="p-6 rounded-2xl border-4 border-emerald-100 bg-emerald-50/30">
                        <div className="prose prose-sm max-w-none text-slate-700">
                          <ReactMarkdown>{selectedReport.ai_analysis}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              <LabReportChat reportId={selectedReport.id} fileName={selectedReport.file_name} />
            </div>
          ) : (
            <Card className="border-dashed border-2 bg-slate-50/50"><CardHeader className="text-center py-12"><CardTitle className="text-slate-400">Select a report to view deep analysis</CardTitle></CardHeader></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}