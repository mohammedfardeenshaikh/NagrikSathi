'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  ai_summary?: string;
  priority_reason?: string;
  tags?: string[];
  created_at: string;
}

export default function TrackComplaintPage() {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlId = params.get('id');
      if (urlId) {
        setSearchId(urlId);
        setLoading(true);
        setError('');
        setComplaint(null);
        api.get(`/complaints/${urlId}`).then((res) => {
          setComplaint(res.data);
        }).catch((err) => {
          if (err.response?.status === 404) {
            setError(`Complaint with ID #${urlId} was not found. Please verify the ID.`);
          } else {
            setError('Could not connect to the server to fetch complaint details.');
          }
        }).finally(() => {
          setLoading(false);
        });
      }
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const res = await api.get(`/complaints/${searchId}`);
      setComplaint(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`Complaint with ID #${searchId} was not found. Please verify the ID.`);
      } else {
        setError('Could not connect to the server to fetch complaint details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['Pending', 'In Progress', 'Resolved'];
    return steps.indexOf(status);
  };

  const getPriorityColor = (p: string) => {
    return p === 'Critical' ? 'text-red-800 bg-red-100 border-red-200' :
           p === 'High' ? 'text-red-600 bg-red-50 border-red-100' :
           p === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-100' :
           'text-green-600 bg-green-50 border-green-100';
  };

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
            <a href="/track" className="text-orange-500 font-semibold">Track Complaint</a>
            <a href="/about" className="hover:text-orange-500 transition-colors">About</a>
            <a href="/contact" className="hover:text-orange-500 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Grievance Tracking System
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Track Your Complaint
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Enter the unique ID assigned to your complaint during submission to monitor its analysis and resolution progress.
          </p>
        </div>

        {/* Search Box */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">#</span>
              <input
                type="number"
                placeholder="Enter Complaint ID (e.g. 1)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-8 pr-4 py-3.5 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3.5 px-6 text-sm shrink-0 flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : 'Track'}
            </button>
          </form>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 mt-5 text-sm font-medium animate-fade-in-up">
            ⚠️ {error}
          </div>
        )}

        {/* Search Result */}
        {complaint && (
          <div className="soft-card p-6 mt-6 space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Complaint #{complaint.id}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{complaint.title}</h3>
                <span className="text-[11px] text-gray-400">Filed on {new Date(complaint.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resolution Timeline</h4>
              
              <div className="relative flex justify-between items-center py-4 px-2">
                {/* Horizontal progress bar line */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[3px] bg-gray-200 z-0">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-500" 
                    style={{ width: `${(getStatusStep(complaint.status) / 2) * 100}%` }}
                  />
                </div>

                {['Pending', 'In Progress', 'Resolved'].map((step, idx) => {
                  const currentIdx = getStatusStep(complaint.status);
                  const isCompleted = idx <= currentIdx;
                  const isActive = idx === currentIdx;

                  return (
                    <div key={step} className="flex flex-col items-center z-10 relative">
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all duration-300 border-2 ${
                        isCompleted 
                          ? 'bg-orange-500 border-orange-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      } ${isActive ? 'scale-110 ring-4 ring-orange-100' : ''}`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className={`text-xs font-semibold mt-2 ${
                        isCompleted ? 'text-orange-600' : 'text-gray-400'
                      }`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Summary Block */}
            {complaint.ai_summary && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">
                  ⚡ AI Grievance Summary
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{complaint.ai_summary}</p>
                {complaint.priority_reason && (
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed italic">
                    Reason: {complaint.priority_reason}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Citizen Description</span>
              <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-2xl p-4 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            {/* Tags */}
            {complaint.tags && complaint.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Routing Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {complaint.tags.map((t) => (
                    <span key={t} className="text-[11px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
