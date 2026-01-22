"use client";
import React from "react";
import Link from "next/link";
import {
  QrCode,
  Zap,
  BarChart3,
  Lock,
  RefreshCw,
  Database,
  ArrowRight,
  Smartphone,
  Layers
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">

      {/* --- Navigation --- */}
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            v1.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Print Once. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Update Forever.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            The intelligent QR platform. Create dynamic codes for your business, events, or products. Change the destination URL or content instantly—without reprinting the QR code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="h-12 px-8 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Create a Code <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="h-12 px-8 rounded-full border border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-600 text-white transition-colors">
                View Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- How it Works (Visual) --- */}
      <section id="how-it-works" className="py-24 bg-slate-900/30 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How RQ Works</h2>
            <p className="text-slate-400">Manage your physical links digitally.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 border-t border-dashed border-slate-700 -z-10" />

            {[
              { icon: <Zap />, title: "Create", desc: "Generate a QR code mapped to a dynamic slug." },
              { icon: <Smartphone />, title: "Print & Scan", desc: "Place it on menus, cards, or posters." },
              { icon: <RefreshCw />, title: "Update", desc: "Change the destination content anytime." }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-slate-950 border border-white/5 rounded-2xl relative hover:border-cyan-500/30 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-cyan-400 mb-6 shadow-inner ring-1 ring-white/10">
                  {React.cloneElement(step.icon, { size: 32 })}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 hover:border-cyan-500/20 transition-all group hover:bg-slate-900/80">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-cyan-500/20">
                <Lock className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Auth</h3>
              <p className="text-slate-400">
                Enterprise-grade login via Email + Password or Phone (OTP). Powered by Appwrite Auth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 hover:border-purple-500/20 transition-all group hover:bg-slate-900/80">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-purple-500/20">
                <BarChart3 className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Analytics</h3>
              <p className="text-slate-400">
                Track scan counts instantly. Toggle active/inactive states for seasonal campaigns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/5 hover:border-emerald-500/20 transition-all group hover:bg-slate-900/80">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/20">
                <Database className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dynamic Content</h3>
              <p className="text-slate-400">
                Map QR codes to URLs or render raw text. Edit the payload without changing the code.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- Tech Stack (Trust) --- */}
      <section id="tech" className="py-20 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">Built with Modern Tech</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Engineered for speed, security, and scalability. RQ Code leverages the power of Next.js App Router and the robustness of Appwrite Cloud.
              </p>
              <ul className="space-y-3">
                {[
                  "Next.js 16 (App Router)",
                  "Appwrite Cloud (Auth & DB)",
                  "TailwindCSS Styling",
                  "TypeScript Safety"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-slate-800 transition-colors">
                <Layers className="text-white" size={24} /> <span className="font-semibold text-white">Next.js</span>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-pink-500 font-bold text-xl">Aw</div> <span className="font-semibold text-white">Appwrite</span>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-blue-400 font-bold">TS</div> <span className="font-semibold text-white">TypeScript</span>
              </div>
              <div className="p-6 bg-slate-900 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-slate-800 transition-colors">
                <div className="text-cyan-400 font-bold">Tw</div> <span className="font-semibold text-white">Tailwind</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-10 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <QrCode className="text-cyan-400" size={20} />
            RQ Code
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} RQ Code Platform. Built with Appwrite & Next.js.
          </div>
        </div>
      </footer>

    </div>
  );
}
