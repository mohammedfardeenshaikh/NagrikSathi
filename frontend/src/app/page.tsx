'use client';

import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 backdrop-blur bg-slate-950/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              NS
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              NagrikSathi
            </span>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</a>
            <a href="/submit" className="hover:text-indigo-400 transition-colors">Submit Complaint</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 w-full flex-grow flex flex-col justify-center items-center text-center relative z-10 space-y-8">
        <div className="space-y-4">
          <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wider bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-800/30">
            AI-Powered Civic Redressal
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight max-w-2xl mx-auto">
            Empowering Citizens, Smart Governance
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-base">
            NagrikSathi bridges the gap between citizens and authorities. File civic complaints and let our AI classify, prioritize, and route them instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
          <a
            href="/submit"
            className="cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all text-center text-sm"
          >
            Submit a Complaint
          </a>
          <a
            href="/dashboard"
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold py-3.5 px-8 rounded-xl active:scale-[0.98] transition-all text-center text-sm"
          >
            View Dashboard Analytics
          </a>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl w-full">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-left space-y-2 backdrop-blur">
            <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-950 flex items-center justify-center text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-slate-200">Easy Submission</h3>
            <p className="text-xs text-slate-500">File complaints in seconds with locations, categories, and titles. Plain-text descriptions are automatically analyzed.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-left space-y-2 backdrop-blur">
            <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-950 flex items-center justify-center text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-slate-200">AI Complaint Analysis</h3>
            <p className="text-xs text-slate-500">Generates summaries, extracts classification tags, and assesses urgency levels automatically using LLMs.</p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 text-left space-y-2 backdrop-blur">
            <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-950 flex items-center justify-center text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-sm text-slate-200">Dynamic Dashboards</h3>
            <p className="text-xs text-slate-500">Monitor status metrics, department resolution rates, and priority workloads in real-time.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} NagrikSathi. Empowering citizens through AI-assisted public grievance resolution.</p>
      </footer>
    </div>
  );
}
