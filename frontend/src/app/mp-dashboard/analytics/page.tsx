'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

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

// Trends Mock Data
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const TREND_COUNTS = [10, 15, 8, 22, 14, 25, 12];

const WARDS = ['Ward 3', 'Ward 4', 'Ward 7', 'Ward 12', 'Ward 15'];
const CATEGORIES = ['Water Supply', 'Sanitation', 'Road Infrastructure', 'Public Safety'];

// Ward-wise reports mock
const WARD_REPORTS: Record<string, number> = {
  'Ward 4': 5,
  'Ward 3': 3,
  'Ward 12': 2,
  'Ward 7': 1,
  'Ward 15': 1
};

// Heatmap Matrix Mock [CategoryIdx][WardIdx]
const HEATMAP_MATRIX = [
  [1, 3, 0, 0, 1], // Water
  [0, 1, 1, 2, 0], // Sanitation
  [2, 0, 0, 0, 0], // Road
  [0, 1, 0, 1, 0]  // Safety
];

export default function MPAnalyticsPage() {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
      setOffline(false);
    } catch {
      setStats(DEFAULT_STATS);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 1. Line/Area Chart calculations (Monthly Trends)
  const maxTrendVal = Math.max(...TREND_COUNTS) || 1;
  const chartHeight = 120;
  const chartWidth = 500;
  const padding = 15;
  
  const points = TREND_COUNTS.map((val, idx) => {
    const x = padding + (idx / (TREND_COUNTS.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (val / maxTrendVal) * (chartHeight - padding * 2);
    return { x, y };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z` 
    : '';

  // Donut/Radial Calculations (Resolution Rate)
  const totalCases = stats.total || 1;
  const resolvedCases = stats.resolved || 0;
  const resolutionRate = Math.round((resolvedCases / totalCases) * 100);
  const strokeDash = 2 * Math.PI * 30; // Radius = 30
  const strokeDashOffset = strokeDash - (resolutionRate / 100) * strokeDash;

  // Category percentage helper
  const totalCatSum = Object.values(stats.by_category || {}).reduce((a, b) => a + b, 0) || 1;
  const categorySummary = Object.entries(stats.by_category || {}).map(([name, val]) => ({
    name,
    val,
    pct: Math.round((val / totalCatSum) * 100)
  }));

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Constituency Diagnostic Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time charts, metrics, and spatial hotspots distribution.
          </p>
        </div>
        <button 
          onClick={fetchStats}
          className="btn-secondary py-2 px-4 text-xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Connection Mode indicator */}
      {offline && (
        <div className="bg-blue-950/20 border border-blue-900/30 text-blue-400 rounded-2xl p-4 text-xs font-medium flex items-center gap-2">
          <span>ℹ️</span> Displaying mock constituency telemetry — FastAPI server is currently offline.
        </div>
      )}

      {/* Grid of Main Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Monthly Complaint Trends (Area Chart) */}
        <div className="soft-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Monthly Complaint Trends</h3>
              <p className="text-[10px] text-slate-400">Monthly report submission telemetry</p>
            </div>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>

          <div className="relative pt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.5, 1].map((val, idx) => {
                const y = padding + val * (chartHeight - padding * 2);
                return (
                  <line 
                    key={idx} 
                    x1={padding} 
                    y1={y} 
                    x2={chartWidth - padding} 
                    y2={y} 
                    stroke="rgba(148, 163, 184, 0.15)" 
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Path and Area fill */}
              {points.length > 0 && (
                <>
                  <path d={areaD} fill="url(#chartGradient)" />
                  <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {/* Dots */}
              {points.map((p, idx) => (
                <circle 
                  key={idx} 
                  cx={p.x} 
                  cy={p.y} 
                  r="3.5" 
                  fill="#ffffff" 
                  stroke="#3B82F6" 
                  strokeWidth="2.5" 
                  className="hover:scale-125 transition-transform duration-150 cursor-pointer"
                />
              ))}
            </svg>
            
            {/* X Axis Labels */}
            <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1.5 mt-2">
              {MONTHS.map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Rate and Priority Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Resolution Donut Chart */}
          <div className="soft-card p-6 flex flex-col items-center justify-between text-center gap-4">
            <div className="w-full text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Resolution Rate</h3>
              <p className="text-[10px] text-slate-400">Total solved complaints percentage</p>
            </div>

            <div className="relative h-24 w-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="48" 
                  cy="48" 
                  r="30" 
                  fill="transparent" 
                  stroke="rgba(148, 163, 184, 0.1)" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="48" 
                  cy="48" 
                  r="30" 
                  fill="transparent" 
                  stroke="#10B981" 
                  strokeWidth="8" 
                  strokeDasharray={strokeDash}
                  strokeDashoffset={strokeDashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">{resolutionRate}%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Closed</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-semibold">
              {stats.resolved} of {stats.total} grievances resolved
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="soft-card p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Priority Distribution</h3>
              <p className="text-[10px] text-slate-400">Grievances by urgency levels</p>
            </div>

            <div className="space-y-2">
              {Object.entries(stats.by_priority || {}).map(([lvl, count]) => {
                const totalPrioritySum = Object.values(stats.by_priority || {}).reduce((a, b) => a + b, 0) || 1;
                const percentage = Math.round((count / totalPrioritySum) * 100);
                const colors: Record<string, string> = {
                  'Critical': 'bg-red-700',
                  'High': 'bg-red-400',
                  'Medium': 'bg-amber-400',
                  'Low': 'bg-emerald-400'
                };
                return (
                  <div key={lvl} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      <span>{lvl}</span>
                      <span>{count} ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[lvl] || 'bg-slate-400'} rounded-full`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Ward-wise & Spatial Heatmap Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ward wise horizontal bar chart */}
        <div className="soft-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>Ward-wise Distribution</h3>
            <p className="text-[10px] text-slate-400">Complaints mapped by municipal ward</p>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(WARD_REPORTS).map(([ward, count], idx) => {
              const maxCount = Math.max(...Object.values(WARD_REPORTS)) || 1;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={ward} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">{ward}</span>
                    <span className="text-slate-950 dark:text-white font-bold">{count} cases</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Heatmap Grid comparing category vs ward */}
        <div className="soft-card p-6 md:col-span-2 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 animate-pulse" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <MapPin className="h-4 w-4 text-red-500" />
              Grievance Spatial Heatmap
            </h3>
            <p className="text-[10px] text-slate-400">Density matrix of complaint categories across municipal Wards</p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-center border-collapse text-[10px]">
              <thead>
                <tr>
                  <th className="p-2 border-b border-slate-100 dark:border-slate-800 text-left font-bold text-slate-400">Category \ Ward</th>
                  {WARDS.map(w => (
                    <th key={w} className="p-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-400">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat, catIdx) => (
                  <tr key={cat}>
                    <td className="p-2 border-b border-slate-100 dark:border-slate-800 text-left font-semibold text-slate-600 dark:text-slate-400">{cat}</td>
                    {WARDS.map((ward, wardIdx) => {
                      const value = HEATMAP_MATRIX[catIdx]?.[wardIdx] || 0;
                      // Opacity based on density value
                      const bgClasses = [
                        'bg-slate-100 dark:bg-slate-950 text-slate-400', // 0
                        'bg-blue-600/20 text-blue-600 dark:text-blue-400 font-medium', // 1
                        'bg-blue-600/40 text-blue-800 dark:text-blue-300 font-bold', // 2
                        'bg-blue-600/70 text-white font-extrabold shadow-sm' // 3+
                      ];
                      const selectedBg = bgClasses[Math.min(value, 3)];
                      return (
                        <td key={ward} className="p-1 border-b border-slate-100 dark:border-slate-800">
                          <div className={`h-8 w-12 rounded-lg flex items-center justify-center mx-auto transition-transform hover:scale-105 duration-100 cursor-help ${selectedBg}`} title={`${value} reports in ${ward} for ${cat}`}>
                            {value}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
