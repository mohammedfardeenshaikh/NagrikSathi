'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  Bell, 
  Save,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import api from '@/lib/axios';

interface SettingsData {
  mp_name: string;
  constituency: string;
  email: string;
  notify_high_priority: boolean;
  notify_unresolved: boolean;
  notify_weekly: boolean;
}

export default function MPSettingsPage() {
  const [form, setForm] = useState<SettingsData>({
    mp_name: '',
    constituency: '',
    email: '',
    notify_high_priority: true,
    notify_unresolved: true,
    notify_weekly: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load settings from DB on mount
  useEffect(() => {
    api.get('/settings/')
      .then((res) => {
        setForm(res.data);
      })
      .catch(() => {
        setError('Could not load settings from server.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/settings/', form);
      setForm(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Portal Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure constituency parameters, representative details, and notification thresholds.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 animate-fade-in-up">
          <CheckCircle2 className="h-4 w-4" /> Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile parameters */}
        <div className="soft-card p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="h-4 w-4 text-blue-500" />
            Representative Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">MP Representative Name</label>
              <input
                type="text"
                value={form.mp_name}
                onChange={(e) => setForm({ ...form, mp_name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Constituency Name</label>
              <input
                type="text"
                value={form.constituency}
                onChange={(e) => setForm({ ...form, constituency: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Official Portal Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Division Mapping */}
        <div className="soft-card p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Building className="h-4 w-4 text-blue-500" />
            Division Triage Assignment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              ['Sanitation Triage Officer', 'Officer Sharma (Sanitation)'],
              ['PWD Roads Triage Officer', 'Officer Verma (PWD)'],
              ['Water Supply Triage Officer', 'Officer Gupta (Water Supply)'],
              ['Electricity Board Triage Officer', 'Officer Iyer (Electricity Board)'],
            ].map(([label, placeholder]) => (
              <div key={label} className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
                <input
                  type="text"
                  defaultValue={placeholder}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-300 font-semibold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications config */}
        <div className="soft-card p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bell className="h-4 w-4 text-blue-500" />
            Alert Thresholds
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notify_high_priority}
                onChange={(e) => setForm({ ...form, notify_high_priority: e.target.checked })}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Send SMS alert immediately for &quot;Critical&quot; priority classification.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notify_weekly}
                onChange={(e) => setForm({ ...form, notify_weekly: e.target.checked })}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Email weekly compiled PDF grievance status report.</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notify_unresolved}
                onChange={(e) => setForm({ ...form, notify_unresolved: e.target.checked })}
                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
              />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Notify MP directly if a complaint is unassigned for over 72 hours.</span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary py-3 px-6 text-xs flex items-center justify-center gap-2 cursor-pointer w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4" /> Save Configuration Parameters</>
          )}
        </button>

      </form>

    </div>
  );
}
