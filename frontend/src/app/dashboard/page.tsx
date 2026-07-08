'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Complaint {
  id: number;
  title: string;
  category: string;
  location: string;
  status: string;
  priority: string; // High, Medium, Low
  summary?: string;
  tags?: string[]; // array of strings
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  high_priority: number;
}

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    high_priority: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch stats and complaints in parallel
      const [statsRes, complaintsRes] = await Promise.all([
        api.get('/dashboard/stats').catch(() => ({
          data: { total: 4, pending: 2, in_progress: 1, resolved: 1, high_priority: 2 },
        })),
        api.get('/complaints').catch(() => ({
          data: [
            {
              id: 1,
              title: 'Broken water pipeline on Main Street',
              category: 'Water Supply',
              location: 'Sector 4, Block C',
              status: 'In Progress',
              priority: 'High',
              summary: 'A major leak in the primary water supply pipeline causing street flooding and low pressure.',
              tags: ['water-leak', 'infrastructure', 'flooding'],
              created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
              id: 2,
              title: 'Streetlights not working',
              category: 'Public Safety',
              location: 'Park Avenue Lane 3',
              status: 'Pending',
              priority: 'Medium',
              summary: 'Multiple street lights are out of order for the last three days, making the lane unsafe at night.',
              tags: ['electricity', 'safety', 'streetlight'],
              created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            },
            {
              id: 3,
              title: 'Garbage dump near community park',
              category: 'Sanitation',
              location: 'Greenwood Colony',
              status: 'Resolved',
              priority: 'Low',
              summary: 'Accumulated waste disposal pile cleared from the entrance gate of the colony community park.',
              tags: ['waste-management', 'sanitation', 'hygiene'],
              created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
            {
              id: 4,
              title: 'Pothole cluster near school gate',
              category: 'Road Infrastructure',
              location: 'St. Mary School Road',
              status: 'Pending',
              priority: 'High',
              summary: 'Deep potholes right in front of the school exit gate, posing a risk to school buses and children.',
              tags: ['road-safety', 'pothole', 'accident-prone'],
              created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
            },
          ],
        })),
      ]);

      setStats(statsRes.data);
      setComplaints(complaintsRes.data);
    } catch (err: any) {
      console.error(err);
      setError('Could not connect to API server. Showing offline demonstration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
            <a href="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors">Dashboard</a>
            <a href="/submit" className="hover:text-indigo-400 transition-colors">Submit Complaint</a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8 w-full flex-grow relative z-10 space-y-8">
        {/* Upper Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time monitoring of civic complaints and automated AI classification.
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium py-2 px-4 rounded-xl flex items-center gap-2 text-sm transition"
          >
            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Info Banner if Offline */}
        {error && (
          <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl text-amber-300 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="underline font-semibold hover:text-amber-200">Dismiss</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Card 1: Total */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Total Complaints</span>
            <span className="text-3xl font-extrabold text-slate-100 mt-2">{stats.total}</span>
          </div>
          {/* Card 2: Pending */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Pending</span>
            <span className="text-3xl font-extrabold text-yellow-500 mt-2">{stats.pending}</span>
          </div>
          {/* Card 3: In Progress */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">In Progress</span>
            <span className="text-3xl font-extrabold text-blue-400 mt-2">{stats.in_progress}</span>
          </div>
          {/* Card 4: Resolved */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur flex flex-col justify-between">
            <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Resolved</span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-2">{stats.resolved}</span>
          </div>
          {/* Card 5: High Priority */}
          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-2xl p-5 backdrop-blur flex flex-col justify-between col-span-2 md:col-span-1">
            <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">High Priority</span>
            <span className="text-3xl font-extrabold text-indigo-300 mt-2">{stats.high_priority}</span>
          </div>
        </div>

        {/* Main Grid: Graph Mockup & List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Distribution Chart Mockup */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur space-y-6">
            <div>
              <h2 className="font-semibold text-base">Category Distribution</h2>
              <p className="text-xs text-slate-500">Breakdown of reported issues by category</p>
            </div>
            
            {/* Custom Styled CSS Chart */}
            <div className="space-y-4 pt-2">
              {[
                { name: 'Water Supply', count: 1, percentage: '25%', color: 'bg-blue-500' },
                { name: 'Sanitation', count: 1, percentage: '25%', color: 'bg-emerald-500' },
                { name: 'Public Safety', count: 1, percentage: '25%', color: 'bg-yellow-500' },
                { name: 'Road Infrastructure', count: 1, percentage: '25%', color: 'bg-indigo-500' },
                { name: 'Electricity', count: 0, percentage: '0%', color: 'bg-violet-500' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">{item.name}</span>
                    <span className="text-slate-200">{item.count} ({item.percentage})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.percentage }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaints Table/List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              Recent Submissions
              {loading && (
                <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
            </h2>

            <div className="space-y-4">
              {complaints.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur hover:border-slate-700/80 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-indigo-400 font-medium px-2 py-0.5 rounded-full bg-indigo-950/50 border border-indigo-900/40">
                          {comp.category}
                        </span>
                        <span className="text-xs text-slate-500">#{comp.id}</span>
                      </div>
                      <h3 className="font-bold text-base text-slate-100">{comp.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {comp.location}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {/* Priority Badge */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                          comp.priority === 'High'
                            ? 'bg-rose-950/40 border-rose-800/50 text-rose-400'
                            : comp.priority === 'Medium'
                            ? 'bg-yellow-950/40 border-yellow-800/50 text-yellow-400'
                            : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                      >
                        {comp.priority} Priority
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                          comp.status === 'Resolved'
                            ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                            : comp.status === 'In Progress'
                            ? 'bg-blue-950/40 border-blue-800/50 text-blue-400'
                            : 'bg-yellow-950/40 border-yellow-850/40 text-yellow-400'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>
                  </div>

                  {/* AI Summary Section */}
                  {comp.summary && (
                    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-900 text-xs text-slate-300 space-y-1">
                      <div className="font-semibold text-slate-400 flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AI Summary
                      </div>
                      <p>{comp.summary}</p>
                    </div>
                  )}

                  {/* AI Tags Section */}
                  {comp.tags && comp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] uppercase font-bold text-slate-600 mr-1">Tags:</span>
                      {comp.tags.map((t) => (
                        <span key={t} className="text-[10px] text-slate-400 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-md">
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} NagrikSathi. Empowering citizens through AI-assisted public grievance resolution.</p>
      </footer>
    </div>
  );
}
