'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Category { id: number; name: string; }
interface SubCategory { id: number; name: string; category_id: number; }

export default function SubmitComplaintPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', category_id: '', subcategory_id: '' });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string; result?: any }>({ type: 'idle', message: '' });

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.data);
      if (res.data.length > 0) setFormData((f) => ({ ...f, category_id: String(res.data[0].id) }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!formData.category_id) return;
    api.get(`/subcategories?category_id=${formData.category_id}`).then((res) => {
      setSubcategories(res.data);
      setFormData((f) => ({ ...f, subcategory_id: '' }));
    }).catch(() => {});
  }, [formData.category_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setStatus({ type: 'error', message: 'Please fill in the title and description.' });
      return;
    }
    setStatus({ type: 'loading', message: 'Submitting complaint & processing AI analysis...' });
    try {
      const payload = {
        user_id: 1,
        category_id: parseInt(formData.category_id),
        subcategory_id: formData.subcategory_id ? parseInt(formData.subcategory_id) : null,
        title: formData.title,
        description: formData.description,
      };
      const response = await api.post('/complaints/', payload);
      setStatus({ type: 'success', message: `Complaint #${response.data.id} submitted successfully!`, result: response.data });
      setFormData((f) => ({ ...f, title: '', description: '', subcategory_id: '' }));
    } catch (err: any) {
      setStatus({ type: 'error', message: err.response?.data?.detail || 'Submission failed. Is the backend running?' });
    }
  };

  const priorityColor = (p: string) =>
    p === 'High' ? '#DC2626' : p === 'Medium' ? '#D97706' : '#16A34A';

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
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="/dashboard" className="hover:text-orange-500 transition-colors">Dashboard</a>
            <a href="/submit" className="text-orange-500 font-semibold">Submit</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-2xl mx-auto w-full px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-xs font-semibold px-4 py-1.5 rounded-full border border-orange-100 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Citizen Empowerment Portal
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Submit a Complaint
          </h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Describe the issue. Our Gemini AI will summarize, assign priority, and generate routing tags automatically.
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="title">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Broken water pipeline on Main Street"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                required
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="category">Category</label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="subcategory">
                  Subcategory <span className="text-gray-300">(optional)</span>
                </label>
                <select
                  id="subcategory"
                  value={formData.subcategory_id}
                  onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition text-sm"
                >
                  <option value="">— None —</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider" htmlFor="description">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Describe the issue in detail. Our AI will analyze this text to extract key facts, urgency, and routing tags..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none text-sm"
                required
              />
            </div>

            {/* Status Banner */}
            {status.type !== 'idle' && (
              <div className={`rounded-2xl p-4 text-sm border transition-all ${
                status.type === 'loading' ? 'bg-orange-50 border-orange-100 text-orange-700' :
                status.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
                'bg-red-50 border-red-100 text-red-600'
              }`}>
                <div className="flex items-center gap-2 font-medium mb-1">
                  {status.type === 'loading' && (
                    <svg className="animate-spin h-4 w-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {status.type === 'success' && <span className="text-green-500">✓</span>}
                  {status.type === 'error' && <span className="text-red-500">✕</span>}
                  {status.message}
                </div>

                {/* AI Result Card */}
                {status.type === 'success' && status.result && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded-xl p-3 border border-green-100">
                      <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">AI Summary</div>
                      <p className="text-gray-700 leading-relaxed">{status.result.ai_summary}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-green-100">
                      <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Priority</div>
                      <span className="font-bold text-sm" style={{ color: priorityColor(status.result.priority) }}>
                        {status.result.priority}
                      </span>
                      <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">{status.result.priority_reason}</p>
                    </div>
                    {status.result.tags?.length > 0 && (
                      <div className="col-span-2 bg-white rounded-xl p-3 border border-green-100">
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">Tags</div>
                        <div className="flex flex-wrap gap-1.5">
                          {status.result.tags.map((tag: string) => (
                            <span key={tag} className="bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="btn-primary w-full py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status.type === 'loading' ? 'Analyzing with AI...' : 'Submit Complaint'}
            </button>
          </form>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} NagrikSathi — Empowering citizens through AI-assisted public grievance resolution.
      </footer>
    </div>
  );
}
