'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RefreshCw,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ReportData {
  title: string;
  generatedAt: string;
  scope: string;
  metrics: {
    totalComplaints: number;
    pendingCount: number;
    inProgressCount: number;
    resolvedCount: number;
    resolutionRate: string;
    avgTime: string;
  };
  rows: Array<{
    category: string;
    total: number;
    pending: number;
    resolved: number;
    rate: string;
  }>;
}

const REPORT_TEMPLATES: Record<string, ReportData> = {
  'Monthly': {
    title: 'Monthly Constituency Redressal Audit',
    generatedAt: new Date().toLocaleString(),
    scope: 'Current Month (July 2026)',
    metrics: { totalComplaints: 24, pendingCount: 8, inProgressCount: 6, resolvedCount: 10, resolutionRate: '41.6%', avgTime: '2.8 Days' },
    rows: [
      { category: 'Water Supply', total: 8, pending: 3, resolved: 5, rate: '62.5%' },
      { category: 'Sanitation', total: 7, pending: 2, resolved: 5, rate: '71.4%' },
      { category: 'Road Infrastructure', total: 6, pending: 2, resolved: 4, rate: '66.7%' },
      { category: 'Public Safety', total: 3, pending: 1, resolved: 2, rate: '66.7%' }
    ]
  },
  'Constituency': {
    title: 'Rampur Ward-wise Redressal Ledger',
    generatedAt: new Date().toLocaleString(),
    scope: 'Constituency Wards Aggregation',
    metrics: { totalComplaints: 52, pendingCount: 12, inProgressCount: 15, resolvedCount: 25, resolutionRate: '48.1%', avgTime: '2.4 Days' },
    rows: [
      { category: 'Ward 3', total: 12, pending: 2, resolved: 10, rate: '83.3%' },
      { category: 'Ward 4', total: 18, pending: 6, resolved: 12, rate: '66.7%' },
      { category: 'Ward 7', total: 8, pending: 1, resolved: 7, rate: '87.5%' },
      { category: 'Ward 12', total: 10, pending: 2, resolved: 8, rate: '80.0%' },
      { category: 'Ward 15', total: 4, pending: 1, resolved: 3, rate: '75.0%' }
    ]
  },
  'Department': {
    title: 'Municipal Department Performance Index',
    generatedAt: new Date().toLocaleString(),
    scope: 'Division Performance Metrics',
    metrics: { totalComplaints: 40, pendingCount: 10, inProgressCount: 10, resolvedCount: 20, resolutionRate: '50.0%', avgTime: '3.1 Days' },
    rows: [
      { category: 'PWD (Road Division)', total: 14, pending: 4, resolved: 10, rate: '71.4%' },
      { category: 'Water & Sewage Board', total: 12, pending: 3, resolved: 9, rate: '75.0%' },
      { category: 'Municipal Sanitation Board', total: 9, pending: 2, resolved: 7, rate: '77.8%' },
      { category: 'Electricity Distribution Corp', total: 5, pending: 1, resolved: 4, rate: '80.0%' }
    ]
  },
  'Resolution': {
    title: 'Constituency Grievance Resolution Audit',
    generatedAt: new Date().toLocaleString(),
    scope: 'Resolution Rate & Timings Analytics',
    metrics: { totalComplaints: 60, pendingCount: 5, inProgressCount: 10, resolvedCount: 45, resolutionRate: '75.0%', avgTime: '1.9 Days' },
    rows: [
      { category: 'Critical Priority Cases', total: 8, pending: 0, resolved: 8, rate: '100%' },
      { category: 'High Priority Cases', total: 16, pending: 1, resolved: 15, rate: '93.8%' },
      { category: 'Medium Priority Cases', total: 24, pending: 2, resolved: 22, rate: '91.7%' },
      { category: 'Low Priority Cases', total: 12, pending: 2, resolved: 10, rate: '83.3%' }
    ]
  }
};

export default function MPReportsPage() {
  const [reportType, setReportType] = useState<'Monthly' | 'Constituency' | 'Department' | 'Resolution'>('Monthly');
  const [selectedMonth, setSelectedMonth] = useState('July 2026');
  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<ReportData | null>(REPORT_TEMPLATES['Monthly']);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setActiveReport(REPORT_TEMPLATES[reportType]);
      setGenerating(false);
    }, 800);
  };

  const handleExportText = () => {
    if (!activeReport) return;
    let content = `
============================================================
              GOVERNMENT OF RAMPUR CONSTITUENCY
               OFFICIAL MUNICIPAL AUDIT REPORT
============================================================
REPORT TYPE: ${activeReport.title}
GENERATED AT: ${activeReport.generatedAt}
TIME SCOPE: ${activeReport.scope}

------------------------------------------------------------
                     KEY PERFORMANCE METRICS
------------------------------------------------------------
Total Grievances Filed : ${activeReport.metrics.totalComplaints}
Awaiting Triage        : ${activeReport.metrics.pendingCount}
Under Active Action    : ${activeReport.metrics.inProgressCount}
Successfully Resolved  : ${activeReport.metrics.resolvedCount}
Total Resolution Rate  : ${activeReport.metrics.resolutionRate}
Average Resolution Time: ${activeReport.metrics.avgTime}

------------------------------------------------------------
                    MUNICIPAL SUB-DIVISION MATRIX
------------------------------------------------------------
${String("Sub-Division / Category").padEnd(30)} | ${"Total".padEnd(8)} | ${"Pending".padEnd(8)} | ${"Resolved".padEnd(8)} | ${"Rate"}
------------------------------------------------------------
`;
    activeReport.rows.forEach(r => {
      content += `${r.category.padEnd(30)} | ${String(r.total).padEnd(8)} | ${String(r.pending).padEnd(8)} | ${String(r.resolved).padEnd(8)} | ${r.rate}\n`;
    });
    content += `============================================================\n`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportType.toLowerCase()}_report_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportCSV = () => {
    if (!activeReport) return;
    let csv = `Category,Total,Pending,Resolved,Resolution Rate\n`;
    activeReport.rows.forEach(r => {
      csv += `"${r.category}",${r.total},${r.pending},${r.resolved},"${r.rate}"\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `${reportType.toLowerCase()}_report_${Date.now()}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Constituency Report Cockpit
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compile monthly audits, performance indices, and export official summaries.
        </p>
      </div>

      {/* Control Panel */}
      <div className="soft-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Building className="h-3.5 w-3.5" />
            Report Structure
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
          >
            <option value="Monthly">Monthly Audits</option>
            <option value="Constituency">Constituency Wards Report</option>
            <option value="Department">Department Performance Index</option>
            <option value="Resolution">Grievance Resolution Summary</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Month Interval
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-blue-500"
          >
            <option value="July 2026">July 2026 (Current)</option>
            <option value="June 2026">June 2026</option>
            <option value="May 2026">May 2026</option>
            <option value="Q2 2026">Q2 2026 Aggregation</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary py-2.5 text-xs flex items-center justify-center gap-2 cursor-pointer w-full"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Compiling Report...' : 'Compile Document'}
        </button>
      </div>

      {/* Generated Report Output */}
      {activeReport && (
        <div className="soft-card p-6 space-y-6 animate-fade-in-up">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Compiled Document
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{activeReport.title}</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Scope: {activeReport.scope} • Generated: {activeReport.generatedAt}</p>
            </div>
            
            {/* Export buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleExportText}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
                title="Export as PDF/Text document"
              >
                <FileText className="h-4 w-4 text-red-500" /> Export PDF (TXT)
              </button>
              <button
                onClick={handleExportCSV}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
                title="Export to Excel Spreadsheet"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export Excel (CSV)
              </button>
            </div>
          </div>

          {/* Key Indicators Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {[
              { label: 'Grievances', val: activeReport.metrics.totalComplaints },
              { label: 'Pending', val: activeReport.metrics.pendingCount, color: 'text-amber-500' },
              { label: 'Active', val: activeReport.metrics.inProgressCount, color: 'text-blue-500' },
              { label: 'Resolved', val: activeReport.metrics.resolvedCount, color: 'text-emerald-500' },
              { label: 'Close Rate', val: activeReport.metrics.resolutionRate, color: 'text-emerald-500' },
              { label: 'Avg Speed', val: activeReport.metrics.avgTime, color: 'text-indigo-500' }
            ].map((m, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850 flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">{m.label}</span>
                <span className={`text-sm font-extrabold ${m.color || 'text-slate-900 dark:text-white'}`}>{m.val}</span>
              </div>
            ))}
          </div>

          {/* Detailed Division Matrix */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Redressal Matrix Analysis</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Category/Region Scope</th>
                    <th className="px-4 py-3">Total Issues</th>
                    <th className="px-4 py-3">Awaiting Action</th>
                    <th className="px-4 py-3">Closed Actions</th>
                    <th className="px-4 py-3 text-right">Performance Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeReport.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/10">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-200">{row.category}</td>
                      <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">{row.total}</td>
                      <td className="px-4 py-3 font-medium text-slate-650">{row.pending}</td>
                      <td className="px-4 py-3 font-medium text-emerald-600">{row.resolved}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 text-right">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
