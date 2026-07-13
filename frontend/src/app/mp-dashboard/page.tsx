'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Lightbulb, 
  Smile, 
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';

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
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  by_status: Record<string, number>;
}

const DEFAULT_STATS: Stats = {
  total: 12,
  pending: 5,
  in_progress: 4,
  resolved: 3,
  high_priority: 4,
  by_category: { 'Sanitation': 4, 'Road Infrastructure': 3, 'Water Supply': 3, 'Public Safety': 2 },
  by_priority: { 'Critical': 1, 'High': 3, 'Medium': 5, 'Low': 3 },
  by_status: { 'Pending': 5, 'In Progress': 4, 'Resolved': 3 }
};

const DEFAULT_COMPLAINTS: Complaint[] = [
  { id: 1, title: 'Major water pipeline contamination near Government Hospital', status: 'Pending', priority: 'Critical', ai_summary: 'Primary drinking water line suspected of sewage contamination near hospital.', tags: ['water', 'health-hazard', 'hospital'], created_at: new Date(Date.now() - 1000 * 3600 * 0.5).toISOString() },
  { id: 2, title: 'Road collapse on Sector 4 Main Crossing', status: 'In Progress', priority: 'High', ai_summary: 'Major structural caved-in road posing critical transport accidents risks.', tags: ['road', 'infrastructure', 'safety'], created_at: new Date(Date.now() - 1000 * 3600 * 2).toISOString() },
  { id: 3, title: 'Streetlights broken for 2 weeks in Ward 12', status: 'Pending', priority: 'Medium', ai_summary: 'Broken lights creating dangerous dark stretches, increasing crime safety risks.', tags: ['electricity', 'safety'], created_at: new Date(Date.now() - 1000 * 3600 * 12).toISOString() },
  { id: 4, title: 'Garbage accumulation near Sector 3 public park entrance', status: 'Resolved', priority: 'Low', ai_summary: 'Untimely garbage disposal causing public hygiene concerns and blocking path.', tags: ['hygiene', 'garbage'], created_at: new Date(Date.now() - 1000 * 3600 * 24).toISOString() }
];

export default function MPOverviewPage() {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [statsRes, compRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/complaints')
        ]);
        setStats(statsRes.data);
        setComplaints(compRes.data);
      } catch (err) {
        console.warn('Backend unavailable, falling back to mock data.', err);
        setStats(DEFAULT_STATS);
        setComplaints(DEFAULT_COMPLAINTS);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Priority Sort Order
  const priorityOrder: Record<string, number> = {
    'Critical': 0,
    'High': 1,
    'Medium': 2,
    'Low': 3
  };

  const sortedComplaints = [...complaints]
    .sort((a, b) => {
      const orderA = priorityOrder[a.priority] ?? 4;
      const orderB = priorityOrder[b.priority] ?? 4;
      return orderA - orderB;
    })
    .slice(0, 4); // Limit to top 4 recent sorted grievances

  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const cardColors = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const statusColors = (status: string) => {
    switch (status) {
      case 'Resolved': return 'badge-resolved';
      case 'In Progress': return 'badge-inprogress';
      default: return 'badge-pending';
    }
  };

  // Dynamic category calculations
  const totalCatSum = Object.values(stats.by_category || {}).reduce((a, b) => a + b, 0) || 1;
  const categoriesList = Object.entries(stats.by_category || {}).map(([name, count]) => ({
    name,
    count,
    pct: Math.round((count / totalCatSum) * 100)
  }));

  const categoryColorsList = ['bg-orange-500', 'bg-blue-500', 'bg-emerald-500', 'bg-indigo-500'];

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Welcome & Time Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Welcome back, Dr. Ramesh Kumar
          </h1>
          <p className="text-sm text-gray-500">
            Here is the status of your constituency, Rampur.
          </p>
        </div>
        <div className="text-xs text-gray-500 bg-white border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2 w-max shadow-sm">
          <Clock className="h-4 w-4 text-orange-400" />
          Last synced: {new Date().toLocaleTimeString()} (Grievance Hotspot Active)
        </div>
      </div>

      {/* Connection Banner */}
      {error && (
        <div className="bg-orange-50 border border-orange-100 text-orange-600 rounded-2xl p-4 text-xs font-medium flex items-center gap-2">
          <span>ℹ️</span> Showing demonstration constituency data — FastAPI backend is offline.
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Total Complaints', value: stats.total, sub: 'All lifetime cases', color: 'text-gray-900', icon: FileText, bg: 'bg-gray-50' },
          { label: 'Pending Review', value: stats.pending, sub: 'Awaiting triage', color: 'text-amber-600', icon: Clock, bg: 'bg-amber-50' },
          { label: 'In Progress', value: stats.in_progress, sub: 'Under department action', color: 'text-orange-500', icon: TrendingUp, bg: 'bg-orange-50' },
          { label: 'Resolved', value: stats.resolved, sub: 'Successfully closed', color: 'text-emerald-600', icon: CheckCircle2, bg: 'bg-emerald-50' },
          { label: 'High/Critical Priority', value: stats.high_priority, sub: 'Requires immediate action', color: 'text-red-500', icon: AlertTriangle, bg: 'bg-red-50' },
          { label: 'Avg Resolution Time', value: '2.4 days', sub: 'Last 30-day index', color: 'text-orange-500', icon: Clock, bg: 'bg-orange-50' },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="soft-card p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">{c.label}</span>
                <div className={`h-7 w-7 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <Icon className={`h-3.5 w-3.5 ${c.color}`} />
                </div>
              </div>
              <span className={`text-2xl font-extrabold ${c.color}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                {loading ? '—' : c.value}
              </span>
              <span className="text-[10px] text-gray-400">{c.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="soft-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Gemini AI Constituency Insights
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Automated diagnostic intelligence on citizens requests</p>
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">Updated Just Now</span>
            </div>

            {/* AI Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Constituency Executive Summary</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl whitespace-pre-line">
                Rampur has reported an increase of sanitation-related issues by 15% this week. A major drinking water line sewage contamination issue in Ward 4 presents an immediate public health emergency. Ground road erosion and potholes near Sector 4 have led to transport warnings. Regular streetlight malfunctions continue to impact citizen safety scores in Ward 12.
              </p>
            </div>

            {/* AI Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trending issues & recommended actions */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/10">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Trending Hotspot Issues
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                  <li>Pipeline sewage leakage (Ward 4)</li>
                  <li>Road erosion and deep potholes (Sector 4)</li>
                  <li>Overdue landfill clearing delays</li>
                </ul>
              </div>

              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/10">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-blue-500" />
                  Recommended Actions
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc list-inside">
                  <li>Dispatch medical teams to Ward 4</li>
                  <li>Coordinate road repairs with PWD</li>
                  <li>Deploy municipal garbage trucks</li>
                </ul>
              </div>

              {/* Frequently reported & Sentiment */}
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/10">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  Emerging Problems & Hot Wards
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                  <li><strong>Ward 4:</strong> High frequency (Water contamination)</li>
                  <li><strong>Sector 4:</strong> Road damage risk</li>
                  <li><strong>Ward 12:</strong> Safety complaints</li>
                </ul>
              </div>

              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/10">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smile className="h-4 w-4 text-emerald-500" />
                  Public Sentiment Index
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Concerned/Anxious</span>
                    <span className="text-red-500">62%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '62%' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Sentiment indicates frustration regarding pipeline bursts and infrastructure response delay.</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Breakdown & Submissions */}
        <div className="space-y-6">
          
          {/* Category breakdown */}
          <div className="soft-card p-6 space-y-5">
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Category Workloads</h2>
              <p className="text-xs text-slate-400 mt-0.5">Complaints sorted by municipal division</p>
            </div>

            <div className="space-y-4">
              {categoriesList.map((item, idx) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    <span className="text-slate-950 dark:text-white font-bold">{item.count} cases ({item.pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${categoryColorsList[idx % 4]} rounded-full transition-all duration-700`} 
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent complaints */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Critical Action Items</h2>
              <a 
                href="/mp-dashboard/complaints" 
                className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-6 text-xs text-slate-400">Loading complaints...</div>
              ) : sortedComplaints.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">No active complaints.</div>
              ) : (
                sortedComplaints.map((comp) => (
                  <div key={comp.id} className="soft-card p-4 space-y-2 border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400">#{comp.id} • {timeAgo(comp.created_at)}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${cardColors(comp.priority)}`}>
                        {comp.priority}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs text-slate-950 dark:text-white leading-tight">{comp.title}</h4>
                    {comp.ai_summary && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        {comp.ai_summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors(comp.status)}`}>
                        {comp.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
