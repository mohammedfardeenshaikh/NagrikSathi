'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Blobs */}
      <div className="fixed top-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-orange-200/40 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-80px] left-[-60px] w-[300px] h-[300px] rounded-full bg-green-200/30 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-orange-200">NS</div>
            <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>NagrikSathi</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="/submit" className="hover:text-orange-500 transition-colors">Submit Complaint</a>
            <a href="/track" className="hover:text-orange-500 transition-colors">Track Complaint</a>
            <a href="/about" className="text-orange-500 font-semibold">About</a>
            <a href="/contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Digital Governance Initiative
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            About NagrikSathi
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Bridges the gap between citizens and elected representatives through advanced AI and automation.
          </p>
        </div>

        {/* Content Card */}
        <div className="soft-card p-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Our Vision</h3>
            <p>
              NagrikSathi is a next-generation platform designed to revolutionize citizen grievance redressal. By providing citizens with a simple, immediate way to submit complaints, and utilizing cutting-edge Large Language Models (LLMs) to automatically categorize, summarize, and prioritize issues, we help local administrations run efficiently.
            </p>
            <p>
              Rather than scrolling through thousands of unorganized emails or paper forms, Members of Parliament (MPs) and constituency administrators are provided with a structured, priority-ranked dashboard that instantly highlights critical risks to public safety, water contamination, roads, and electricity.
            </p>
          </div>

          <div className="space-y-4 text-gray-600 text-sm leading-relaxed pt-4 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Key Capabilities</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-gray-900">AI Summary:</strong> Generates concise one-sentence summaries of long, unstructured complaints.</li>
              <li><strong className="text-gray-900">Priority Assessment:</strong> Identifies urgent safety and public health hazards to assign Critical/High/Medium/Low priorities.</li>
              <li><strong className="text-gray-900">Dynamic Tagging:</strong> Creates routing tags automatically to help route cases to the correct department.</li>
              <li><strong className="text-gray-900">Analytics Breakdown:</strong> Provides MPs with visual statistics, category breakdowns, and ward activity maps.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-8 text-center text-xs text-gray-400 flex flex-col items-center gap-3 mt-8">
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
