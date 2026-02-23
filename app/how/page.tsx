"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { 
  FileSearch, ShieldCheck, Zap, Users, Calendar, 
  ChevronDown, ArrowRight, Database, BrainCircuit, 
  Lock, Microscope, Activity, Mail,
  Upload
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2 } }
};

export default function PathoLensDocumentation() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 font-sans">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-emerald-500 origin-left z-50" style={{ scaleX }} />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-emerald-50/50 to-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-emerald-600 p-3 rounded-2xl shadow-xl shadow-emerald-200">
              <Microscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-6 italic">
            Patho<span className="text-emerald-600">Lens</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Stop Googling symptoms. Start understanding your data. 
            The AI-powered bridge to clinical clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 h-14 text-lg font-bold group">
              Analyze Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 rounded-full px-10 h-14 text-lg font-bold">
              Learn More
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 opacity-30"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2">Scroll to Explore</p>
          <ChevronDown className="h-6 w-6 mx-auto" />
        </motion.div>
      </section>

      {/* 2. CORE FUNCTIONALITY (THE "HOW") */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Smart Ingestion & <span className="text-emerald-600">Sync</span></h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              PathoLens removes the friction of health management. Whether it's a crumpled paper report or a digital PDF in your inbox, we bring it into your digital vault instantly.
            </p>
            <div className="space-y-6">
              {[
                { icon: <Mail className="text-emerald-500" />, t: "Gmail Integration", d: "Securely fetch reports directly from lab emails." },
                { icon: <Database className="text-emerald-500" />, t: "Legacy Parsing", d: "AI extracts data from PDFs and high-res images." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  {item.icon}
                  <div>
                    <h4 className="font-bold">{item.t}</h4>
                    <p className="text-sm text-slate-500">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-100 rounded-3xl aspect-square flex items-center justify-center p-8 border-4 border-white shadow-2xl"
          >
             {/* Replace with your app screenshot */}
             <div className="text-center">
               <Activity className="h-20 w-20 text-emerald-200 mb-4 mx-auto" />
               <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Interactive Dashboard Preview</p>
             </div>
          </motion.div>
        </div>

        

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-10"
        >
          {[
            {
              title: "AI Medical Vault",
              desc: "Every biomarker is categorized into Normal, High, or Critical zones using smart range-detection.",
              icon: <BrainCircuit className="h-7 w-7 text-white" />
            },
            {
              title: "Contextual Chat",
              desc: "Ask follow-up questions about your specific data. AI that remembers your historical trends.",
              icon: <FileSearch className="h-7 w-7 text-white" />
            },
            {
              title: "Secure Auth",
              desc: "End-to-end encryption via Supabase. Your health data is your own private property.",
              icon: <Lock className="h-7 w-7 text-white" />
            }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 bg-white rounded-[2rem] overflow-hidden group hover:-translate-y-2">
                <CardContent className="p-10">
                  <div className="bg-emerald-600 p-4 w-fit rounded-2xl mb-8 group-hover:rotate-6 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. WHO, WHEN, WHY (STRATEGY SECTION) */}
      <section className="py-32 bg-slate-900 text-white rounded-[3rem] mx-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-20">
            <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-bold mb-6">Designed for Everyone</motion.h2>
            <motion.p {...fadeInUp} className="text-slate-400 max-w-2xl mx-auto text-xl">
              From chronic condition management to one-time checkups.
            </motion.p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { icon: <Users />, h: "Who?", p: "Caregivers, Athletes, and Patients managing chronic illnesses like Diabetes or Hypertension." },
              { icon: <Calendar />, h: "When?", p: "Immediately after a lab visit, for second opinions, or quarterly health reviews." },
              { icon: <ShieldCheck />, h: "Why?", p: "To eliminate health anxiety, prepare for doctor visits, and own your historical trends." }
            ].map((box, i) => (
              <motion.div key={i} {...fadeInUp} className="p-10 border border-slate-800 rounded-3xl bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
                <div className="text-emerald-400 mb-6 scale-125 origin-left">{box.icon}</div>
                <h4 className="text-2xl font-bold mb-4">{box.h}</h4>
                <p className="text-slate-400 leading-relaxed">{box.p}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. USER BENEFITS (BENEFIT GRID) */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The <span className="text-emerald-600 italic underline decoration-4 underline-offset-8">Why</span> Factor</h2>
            <div className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest">User Benefits</div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-12 bg-slate-50 rounded-[3rem] flex flex-col justify-between">
              <Zap className="h-12 w-12 text-emerald-500 mb-8" />
              <h3 className="text-3xl font-bold mb-4">Zero Jargon Interpretation</h3>
              <p className="text-slate-600 text-lg">We translate TSH, HbA1c, and Lipid Profiles into human language.</p>
            </div>
            <div className="p-12 bg-emerald-600 text-white rounded-[3rem] flex flex-col justify-between">
              <Lock className="h-12 w-12 text-white mb-8" />
              <h3 className="text-3xl font-bold mb-4">Privacy by Default</h3>
              <p className="text-emerald-100 text-lg">Military-grade encryption for your most sensitive medical records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FLOW / HOW TO USE */}
      <section className="py-32 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-4xl font-bold mb-20 uppercase tracking-tighter">Your Journey in 3 Steps</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200" />
            {[
              { t: "Secure Upload", d: "Sign in and drop your PDF or Image. We process data in under 5 seconds." },
              { t: "AI Synthesis", d: "View your 'Medical Vault' where AI extracts and categorizes every single marker." },
              { t: "Ask Anything", d: "Chat with the AI about your results to prepare for your actual doctor visit." }
            ].map((step, i) => (
              <motion.div key={i} {...fadeInUp} className="relative pl-24 mb-20 group">
                <div className="absolute left-0 h-16 w-16 bg-white border-4 border-emerald-500 rounded-full flex items-center justify-center font-black text-2xl z-10 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                  {i + 1}
                </div>
                <h4 className="text-2xl font-bold mb-2">{step.t}</h4>
                <p className="text-slate-500 text-lg max-w-xl">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="py-24 bg-white border-t text-center">
        <motion.div {...fadeInUp} className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8 italic">Ready for Clinical Clarity?</h2>
         <Link href="/lab-reports">
          <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-12 h-16 text-xl font-bold shadow-2xl shadow-emerald-200">
            <Upload className="h-4 w-4 mr-2" /> Analyze My First Report
          </Button>
          </Link>
          <p className="mt-12 text-slate-400 text-sm leading-relaxed">
            © 2026 PathoLens AI. Designed by gs27304. <br />
            <span className="font-bold text-slate-500 mt-2 block">DISCLAIMER: PathoLens is an information tool and not a substitute for professional medical advice.</span>
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

 