'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Complaint {
  id: number;
  title: string;
  category_id?: number;
  status: string;
  priority: string;
  ai_summary?: string;
  tags?: string[];
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  high_priority: number;
}

const DEMO_COMPLAINTS: Complaint[] = [
  { id: 1, title: 'Broken water pipeline on Main Street', status: 'In Progress', priority: 'High', ai_summary: 'A major leak in the primary water supply pipeline causing street flooding.', tags: ['water-leak', 'infrastructure'], created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 2, title: 'Streetlights not working on Park Avenue', status: 'Pending', priority: 'Medium', ai_summary: 'Multiple streetlights are out for three days, making the lane unsafe at night.', tags: ['electricity', 'safety'], created_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 3, title: 'Garbage dump near community park', status: 'Resolved', priority: 'Low', ai_summary: 'Accumulated waste at colony park entrance has been cleared.', tags: ['sanitation', 'hygiene'], created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 4, title: 'Pothole cluster near school gate', status: 'Pending', priority: 'High', ai_summary: 'Deep potholes in front of the school exit, posing risk to children.', tags: ['road-safety', 'pothole'], created_at: new Date(Date.now() - 3600000 * 36).toISOString() },
];

function timeAgo(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, in_progress: 0, resolved: 0, high_priority: 0 });
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setOffline(false);
      const [statsRes, compRes] = await Promise.all([
        api.get('/dashboard/stats').catch(() => ({ data: { total: 4, pending: 2, in_progress: 1, resolved: 1, high_priority: 2 } })),
        api.get('/complaints').catch(() => ({ data: DEMO_COMPLAINTS })),
      ]);
      setStats(statsRes.data);
      setComplaints(compRes.data);
    } catch {
      setStats({ total: 4, pending: 2, in_progress: 1, resolved: 1, high_priority: 2 });
      setComplaints(DEMO_COMPLAINTS);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const priorityClass = (p: string) =>
    p === 'High' ? 'badge-high' : p === 'Medium' ? 'badge-medium' : 'badge-low';

  const statusClass = (s: string) =>
    s === 'Resolved' ? 'badge-resolved' : s === 'In Progress' ? 'badge-inprogress' : 'badge-pending';

  const statCards = [
    { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-white', icon: '📋' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⏳' },
    { label: 'In Progress', value: stats.in_progress, color: 'text-blue-600', bg: 'bg-blue-50', icon: '🔄' },
    { label: 'Resolved', value: stats.resolved, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
    { label: 'High Priority', value: stats.high_priority, color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Blobs */}
      <div className="fixed top-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full bg-orange-200/30 blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-[-80px] left-[-60px] w-[300px] h-[300px] rounded-full bg-green-200/20 blur-[100px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-orange-200">NS</div>
            <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>NagrikSathi</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="/dashboard" className="text-orange-500 font-semibold">Dashboard</a>
            <a href="/submit" className="hover:text-orange-500 transition-colors">Submit</a>
          </nav>
          <button
            onClick={fetchData}
            className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-gray-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Page Title */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Real-time monitoring of civic complaints and AI classification.</p>
        </div>

        {/* Offline Banner */}
        {offline && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-amber-700 text-sm flex items-center gap-2">
            <span>⚠️</span> Showing demonstration data — could not connect to API server.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {statCards.map((s, i) => (
            <div key={s.label} className={`soft-card p-5 flex flex-col gap-2 ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <span className={`text-3xl font-extrabold ${s.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {loading ? '—' : s.value}
              </span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          {/* Category Chart */}
          <div className="soft-card p-6 space-y-5">
            <div>
              <h2 className="font-bold text-gray-900 text-base" style={{ fontFamily: 'Poppins, sans-serif' }}>Category Breakdown</h2>
              <p className="text-xs text-gray-400 mt-0.5">Reported issues by department</p>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Sanitation', pct: 35, color: 'bg-orange-400' },
                { name: 'Road Infrastructure', pct: 28, color: 'bg-blue-400' },
                { name: 'Water Supply', pct: 20, color: 'bg-green-400' },
                { name: 'Public Safety', pct: 17, color: 'bg-purple-400' },
              ].map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-900 font-semibold">{item.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaints List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Recent Submissions
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </h2>
              <a href="/submit" className="btn-primary text-xs py-2 px-4">+ New</a>
            </div>

            <div className="space-y-4">
              {complaints.map((comp, i) => (
                <div
                  key={comp.id}
                  className="soft-card p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
                  style={{ animationDelay: `${200 + i * 60}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">#{comp.id}</span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-400">{timeAgo(comp.created_at)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{comp.title}</h3>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${priorityClass(comp.priority)}`}>
                        {comp.priority}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${statusClass(comp.status)}`}>
                        {comp.status}
                      </span>
                    </div>
                  </div>

                  {comp.ai_summary && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2.5">
                      <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        ⚡ AI Summary
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{comp.ai_summary}</p>
                    </div>
                  )}

                  {comp.tags && comp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {comp.tags.map((t) => (
                        <span key={t} className="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-5 text-center text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} NagrikSathi — Empowering citizens through AI-assisted public grievance resolution.
      </footer>
    </div>
  );
}
