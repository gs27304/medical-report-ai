

"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Activity, CheckCircle2, Copy, Check } from "lucide-react";

export function LabGeminiPanel() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // New state for copy animation

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/lab/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to analyze");
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW COPY FUNCTION ---
  const copyToClipboard = async () => {
    if (!analysis) return;
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-white/80 backdrop-blur-md">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-gradient-x" />
      
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            PathoLens Analysis
          </CardTitle>
        </div>
        <CardDescription>Paste results to generate a structured medical summary.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste lab values here..."
          rows={5}
          className="rounded-xl bg-gray-50/50 border-gray-200"
        />

        <Button 
          onClick={handleAnalyze} 
          disabled={loading || !input.trim()}
          className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold rounded-xl shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-5 w-5" />}
          {loading ? "AI is Thinking..." : "Generate Deep Analysis"}
        </Button>

        {analysis && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Header for Analysis Result */}
            <div className="flex items-center justify-between mb-2 px-2">
                <div className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                  <CheckCircle2 className="h-3 w-3" />
                  Analysis Ready
                </div>
                
                {/* NEW COPY BUTTON */}
              

                 <Button 
    variant="ghost" 
    size="sm" 
    onClick={copyToClipboard}
    className={`
      h-8 px-3 text-xs font-bold flex items-center gap-2 transition-all duration-300 rounded-lg
      /* Default state: Blue */
      text-blue-600 hover:text-white
      /* Hover state: Dark Green Theme & Animation */
      hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-200
      /* Active click effect */
      active:scale-95
      ${copied ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
    `}
>
    {copied ? (
        <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
            <Check className="h-3.5 w-3.5 stroke-[3px]" />
            <span>Copied to Clipboard!</span>
        </div>
    ) : (
        <>
            <Copy className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
            <span>Copy Result</span>
        </>
    )}
</Button>
            </div>

            <div className="border-2 border-blue-50 bg-white rounded-2xl p-6 shadow-sm prose prose-blue max-w-none ring-1 ring-blue-100/50">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b border-blue-100 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" /> {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-md font-bold text-indigo-700 mt-6 mb-2 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" /> {children}
                    </h2>
                  ),
                  strong: ({ children }) => (
                    <strong className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-100/50">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => <ul className="space-y-2 my-4 list-disc list-inside text-gray-700 text-sm">{children}</ul>,
                  p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-4 text-sm">{children}</p>,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}