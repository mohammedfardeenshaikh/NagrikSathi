'use client';

import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Decorative blobs */}
      <div className="fixed top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full bg-orange-200/40 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] left-[-80px] w-[350px] h-[350px] rounded-full bg-green-200/30 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-orange-200">
              NS
            </div>
            <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              NagrikSathi
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="/" className="text-orange-500 font-semibold">Home</a>
            <a href="/submit" className="hover:text-orange-500 transition-colors">Submit Complaint</a>
            <a href="/track" className="hover:text-orange-500 transition-colors">Track Complaint</a>
            <a href="/about" className="hover:text-orange-500 transition-colors">About</a>
            <a href="/contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </nav>
          <a
            href="/submit"
            className="btn-primary text-sm hidden sm:inline-flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            File Complaint
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 relative z-10">
        <section className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-8">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-100 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              AI-Powered Civic Redressal
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl animate-fade-in-up" style={{ animationDelay: '80ms', fontFamily: 'Poppins, sans-serif' }}>
            Empowering Citizens,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Smart Governance
            </span>
          </h1>

          <p className="text-gray-500 max-w-xl text-base leading-relaxed animate-fade-in-up" style={{ animationDelay: '160ms' }}>
            NagrikSathi bridges the gap between citizens and authorities. File civic complaints and let our AI classify, prioritize, and route them instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '240ms' }}>
            <a href="/submit" className="btn-primary px-8 py-3.5 text-sm">
              Submit a Complaint →
            </a>
          </div>

          {/* Stats Bar */}
          <div className="glass-card w-full max-w-2xl grid grid-cols-3 divide-x divide-gray-100 mt-4 animate-fade-in-up" style={{ animationDelay: '320ms' }}>
            {[
              { label: 'Complaints Filed', value: '1,200+' },
              { label: 'Resolved', value: '89%' },
              { label: 'Avg Response Time', value: '2.4 days' },
            ].map((s) => (
              <div key={s.label} className="px-6 py-5 text-center">
                <div className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                ),
                title: 'Easy Submission',
                desc: 'File complaints in seconds. Select your category, describe the issue, and submit instantly from any device.',
                color: 'bg-orange-50 text-orange-500',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'AI Complaint Analysis',
                desc: 'Gemini AI automatically generates summaries, assigns priority levels, and creates routing tags in real time.',
                color: 'bg-green-50 text-green-500',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                ),
                title: 'Live Dashboard',
                desc: 'Monitor complaint statuses, resolution rates, and department workloads in real-time with rich analytics.',
                color: 'bg-blue-50 text-blue-500',
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="soft-card p-6 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${f.color}`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{f.icon}</svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8 text-center text-xs text-gray-400 flex flex-col items-center gap-3">
        <div>
          © {new Date().getFullYear()} NagrikSathi — Empowering citizens through AI-assisted public grievance resolution.
        </div>
        <div className="flex gap-4">
          <a href="/mp-dashboard" className="text-slate-400 hover:text-orange-500 transition-colors font-medium">MP Officer Portal</a>
        </div>
      </footer>
    </div>
  );
}
