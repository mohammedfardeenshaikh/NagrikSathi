'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { 
  Search, 
  Filter, 
  FileText, 
  ArrowUpDown, 
  Check, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  NotebookPen, 
  Download, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  ai_summary?: string;
  priority_reason?: string;
  tags?: string[];
  ward?: string;
  assigned_officer?: string;
  internal_notes?: string;
  escalated: number;
  created_at: string;
}

const DEMO_COMPLAINTS: Complaint[] = [
  { id: 1, title: 'Major water pipeline contamination near Government Hospital', description: 'The main drinking water inlet supplying the Government Hospital and Ward 4 residential blocks has a sewage smell. Citizens report illness and discoloration. Needs immediate sanitation check.', status: 'Pending', priority: 'Critical', ai_summary: 'Primary drinking water line suspected of sewage contamination near hospital.', priority_reason: 'Immediate danger to public health and safety at an emergency care site.', tags: ['water', 'health-hazard', 'hospital'], ward: 'Ward 4', assigned_officer: '', internal_notes: '', escalated: 0, created_at: new Date(Date.now() - 1000 * 3600 * 0.5).toISOString() },
  { id: 2, title: 'Road collapse on Sector 4 Main Crossing', description: 'A massive pothole / road cave-in has occurred at the main intersection of Sector 4. It blocks two lanes and has already caused two minor motorcycle accidents. PWD needs to secure this site.', status: 'In Progress', priority: 'High', ai_summary: 'Major structural caved-in road posing critical transport accidents risks.', priority_reason: 'Serious public infrastructure hazard blocking primary transport corridors.', tags: ['road', 'infrastructure', 'safety'], ward: 'Ward 3', assigned_officer: 'Officer Verma (PWD)', internal_notes: 'Barricades have been set up by local traffic police.', escalated: 0, created_at: new Date(Date.now() - 1000 * 3600 * 2).toISOString() },
  { id: 3, title: 'Streetlights broken for 2 weeks in Ward 12', description: 'Streetlights from pole 45 to 58 on Park Avenue are dark. A commercial area with high evening footfall is now completely dark, causing safety concerns for women and residents.', status: 'Pending', priority: 'Medium', ai_summary: 'Broken lights creating dangerous dark stretches, increasing crime safety risks.', priority_reason: 'Important infrastructure safety issue promoting potential local security concerns.', tags: ['electricity', 'safety'], ward: 'Ward 12', assigned_officer: '', internal_notes: '', escalated: 0, created_at: new Date(Date.now() - 1000 * 3600 * 12).toISOString() },
  { id: 4, title: 'Garbage accumulation near Sector 3 public park entrance', description: 'Overloaded municipal dustbins and construction rubble dumped near the public park gates. Stagnant water and flies are gathering. Smells terrible.', status: 'Resolved', priority: 'Low', ai_summary: 'Untimely garbage disposal causing public hygiene concerns and blocking path.', priority_reason: 'Minor public hygiene inconvenience without immediate structural danger.', tags: ['hygiene', 'garbage'], ward: 'Ward 7', assigned_officer: 'Officer Sharma (Sanitation)', internal_notes: 'Waste cleared and bins replaced. Rubble moved.', escalated: 0, created_at: new Date(Date.now() - 1000 * 3600 * 24).toISOString() }
];

const OFFICERS = [
  'Officer Sharma (Sanitation)',
  'Officer Verma (PWD)',
  'Officer Gupta (Water Supply)',
  'Officer Iyer (Electricity Board)'
];

const WARDS = ['Ward 3', 'Ward 4', 'Ward 7', 'Ward 12', 'Ward 15'];

export default function MPComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWard, setFilterWard] = useState('All');

  // Modal / Detail View State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  // Action Form States (inside modal/detail side panel)
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [notes, setNotes] = useState('');
  const [actionStatus, setActionStatus] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints');
      setComplaints(res.data);
      setOffline(false);
    } catch {
      setComplaints(DEMO_COMPLAINTS);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Update URL priority filtering on mount if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('priority');
      if (p) setFilterPriority(p);
    }
  }, []);

  const handleUpdateComplaint = async (complaintId: number, patchData: Partial<Complaint>) => {
    try {
      const res = await api.patch(`/complaints/${complaintId}`, patchData);
      // Update local state
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, ...res.data } : c));
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint(prev => prev ? { ...prev, ...res.data } : null);
      }
      alert('Grievance updated successfully!');
    } catch (err) {
      // Offline edit support
      setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, ...patchData } : c));
      if (selectedComplaint && selectedComplaint.id === complaintId) {
        setSelectedComplaint(prev => prev ? { ...prev, ...patchData } : null);
      }
      alert('Offline mode: Updated locally.');
    }
  };

  const handleExportPDF = (comp: Complaint) => {
    // Print-friendly mock layout download
    const content = `
=============================================
         GOVERNMENT OF RAMPUR CONSTITUENCY
         OFFICIAL CIVIC GRIEVANCE REPORT
=============================================
COMPLAINT ID: #${comp.id}
DATE FILED: ${new Date(comp.created_at).toLocaleString()}
WARD / REGION: ${comp.ward || 'Ward 4'}
PRIORITY LEVEL: ${comp.priority.toUpperCase()}
CURRENT STATUS: ${comp.status}

TITLE: ${comp.title}
DESCRIPTION:
${comp.description}

---------------------------------------------
               AI ANALYSIS REPORT
---------------------------------------------
SUMMARY: ${comp.ai_summary || 'N/A'}
CLASSIFICATION RATIONALE:
${comp.priority_reason || 'N/A'}
ROUTING TAGS: ${comp.tags?.join(', ') || 'None'}

---------------------------------------------
           OFFICER & REDRESSAL NOTES
---------------------------------------------
ASSIGNED OFFICER: ${comp.assigned_officer || 'UNASSIGNED'}
ESCALATED ACTION: ${comp.escalated === 1 ? 'YES' : 'NO'}
INTERNAL REMARKS:
${comp.internal_notes || 'No remarks added.'}
=============================================
    Generated by NagrikSathi MP Representative System
`;
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `grievance_report_${comp.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'Resolved': return 'badge-resolved';
      case 'In Progress': return 'badge-inprogress';
      default: return 'badge-pending';
    }
  };

  // Filter complaints list
  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comp.id.toString() === searchTerm;
    const matchesPriority = filterPriority === 'All' || comp.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || comp.status === filterStatus;
    const matchesWard = filterWard === 'All' || comp.ward === filterWard;
    
    // Simple category mapping based on keywords/tags since database stores category_id
    let matchesCategory = true;
    if (filterCategory !== 'All') {
      const catLower = filterCategory.toLowerCase();
      matchesCategory = comp.title.toLowerCase().includes(catLower) || 
                        comp.description.toLowerCase().includes(catLower) ||
                        (comp.tags?.some(t => t.toLowerCase().includes(catLower)) ?? false);
    }

    return matchesSearch && matchesPriority && matchesStatus && matchesWard && matchesCategory;
  });

  // Priority Sort Order
  const priorityOrder: Record<string, number> = {
    'Critical': 0,
    'High': 1,
    'Medium': 2,
    'Low': 3
  };

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const orderA = priorityOrder[a.priority] ?? 4;
    const orderB = priorityOrder[b.priority] ?? 4;
    return orderA - orderB;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Constituency Grievance Ledger
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review, triage, assign, and update citizen complaints.
          </p>
        </div>
        {offline && (
          <span className="text-xs text-blue-500 font-bold bg-blue-500/10 px-3 py-1.5 rounded-full w-max">
            Offline Mode Active
          </span>
        )}
      </div>

      {/* Filters Box */}
      <div className="soft-card p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by text/ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Ward Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Wards</option>
            {WARDS.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Divisions</option>
            <option value="Water">Water Supply</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Road">Road Infra</option>
            <option value="Safety">Public Safety</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="soft-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Grievance ID</th>
                <th className="px-6 py-4">Complaint Title</th>
                <th className="px-6 py-4">Ward</th>
                <th className="px-6 py-4">AI Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Officer</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
                    <span className="block mt-2 font-medium">Retrieving database ledger...</span>
                  </td>
                </tr>
              ) : sortedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                    No complaints matching the selected filters found.
                  </td>
                </tr>
              ) : (
                sortedComplaints.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-400">#{comp.id}</td>
                    <td className="px-6 py-4 max-w-xs md:max-w-sm">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{comp.title}</div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{comp.ai_summary || comp.description}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">{comp.ward || 'Ward 4'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] border ${getPriorityBadge(comp.priority)}`}>
                        {comp.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${getStatusBadge(comp.status)}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {comp.assigned_officer ? (
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <UserCheck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          {comp.assigned_officer}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          setSelectedComplaint(comp);
                          setAssignedOfficer(comp.assigned_officer || '');
                          setNotes(comp.internal_notes || '');
                          setActionStatus(comp.status);
                        }}
                        className="text-blue-500 hover:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Manage <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details & Action Modal Panel (Glassmorphism Modal) */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col gap-6 animate-slide-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Grievance Management Portal</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Complaint ID #{selectedComplaint.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* AI Summary Block */}
            {selectedComplaint.ai_summary && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 space-y-2">
                <div className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Gemini AI Summary & Classification
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                  {selectedComplaint.ai_summary}
                </p>
                {selectedComplaint.priority_reason && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal italic">
                    Reason: {selectedComplaint.priority_reason}
                  </p>
                )}
              </div>
            )}

            {/* Description Details */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Citizen Narrative</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 leading-relaxed whitespace-pre-wrap">
                {selectedComplaint.description}
              </p>
            </div>

            {/* Meta Parameters */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ward Location</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedComplaint.ward || 'Ward 4'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Date</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                  {new Date(selectedComplaint.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Escalation Status</span>
                <p className="font-semibold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  {selectedComplaint.escalated === 1 ? (
                    <span className="text-red-500 flex items-center gap-1 font-bold">
                      <ShieldAlert className="h-4 w-4 shrink-0" /> ESCALATED TO MP
                    </span>
                  ) : (
                    <span className="text-slate-400">Standard Triage</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedComplaint.tags?.map(t => (
                    <span key={t} className="bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full text-[9px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Administrative Management Form */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <NotebookPen className="h-4 w-4 text-blue-500" />
                Administrative Actions
              </h4>

              {/* Status Update */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Redressal Status</label>
                <select
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Officer Assignment */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Assign Officer / Division</label>
                <select
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">— Unassigned —</option>
                  {OFFICERS.map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Remarks & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter internal notes, verification checks, or department directives..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs resize-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Modal Buttons Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleUpdateComplaint(selectedComplaint.id, {
                    status: actionStatus,
                    assigned_officer: assignedOfficer || undefined,
                    internal_notes: notes || undefined
                  })}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
                >
                  Save Updates
                </button>
                <button
                  onClick={() => handleUpdateComplaint(selectedComplaint.id, {
                    escalated: selectedComplaint.escalated === 1 ? 0 : 1
                  })}
                  className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition border cursor-pointer ${
                    selectedComplaint.escalated === 1 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-200/30 hover:bg-slate-100' 
                      : 'bg-red-600/10 text-red-500 border-red-500/30 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {selectedComplaint.escalated === 1 ? 'Cancel Escalation' : 'Escalate Complaint'}
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={() => handleExportPDF(selectedComplaint)}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800"
              >
                <Download className="h-4 w-4" /> Export Official Grievance (TXT)
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
