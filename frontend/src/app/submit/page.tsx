'use client';

import React, { useState } from 'react';
import api from '@/lib/axios';

export default function SubmitComplaintPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Sanitation',
    location: '',
    citizen_name: '',
    citizen_contact: '',
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const categories = [
    'Sanitation',
    'Road Infrastructure',
    'Water Supply',
    'Electricity',
    'Public Safety',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setStatus({ type: 'error', message: 'Please fill in the title and description.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Submitting complaint & processing AI analysis...' });

    try {
      // POST to FastAPI backend endpoint
      const response = await api.post('/complaints', formData);
      setStatus({
        type: 'success',
        message: `Complaint submitted successfully! ID: ${response.data.id || 'N/A'}. AI is classifying priority...`,
      });
      setFormData({
        title: '',
        description: '',
        category: 'Sanitation',
        location: '',
        citizen_name: '',
        citizen_contact: '',
      });
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: 'error',
        message: err.response?.data?.detail || 'Failed to submit complaint. Is the backend running?',
      });
    }
  };

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
            <a href="/submit" className="text-indigo-400 hover:text-indigo-300 transition-colors">Submit Complaint</a>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-6 py-12 w-full flex-grow flex flex-col justify-center relative z-10">
        <div className="text-center mb-10">
          <span className="text-indigo-400 font-semibold text-sm tracking-wider uppercase bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-800/30">
            Citizen Empowerment Portal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-4 mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Submit a Complaint
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm">
            File your grievance. Our AI system will summarize, classify priority, and route it to the appropriate department.
          </p>
        </div>

        {/* Complaint Form Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="title">
                  Complaint Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Broken water pipeline on Main Street"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500/80 transition"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-950 text-slate-100">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="location">
                  Location / Address
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g. Sector 4, Block C, Metro Station"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="description">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Provide details about the issue. Our AI will analyze this description to extract details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition resize-none"
                  required
                />
              </div>

              {/* Citizen Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="name">
                  Your Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.citizen_name}
                  onChange={(e) => setFormData({ ...formData, citizen_name: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="contact">
                  Contact Number (Optional)
                </label>
                <input
                  id="contact"
                  type="text"
                  placeholder="e.g. +91 9876543210"
                  value={formData.citizen_contact}
                  onChange={(e) => setFormData({ ...formData, citizen_contact: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition"
                />
              </div>
            </div>

            {/* Status Messages */}
            {status.type !== 'idle' && (
              <div
                className={`p-4 rounded-xl border text-sm flex items-center gap-3 transition-all ${
                  status.type === 'loading'
                    ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-300'
                    : status.type === 'success'
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                }`}
              >
                {status.type === 'loading' && (
                  <svg className="animate-spin h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                <span>{status.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="flex-1 cursor-pointer bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none text-center"
              >
                {status.type === 'loading' ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} NagrikSathi. Empowering citizens through AI-assisted public grievance resolution.</p>
      </footer>
    </div>
  );
}
