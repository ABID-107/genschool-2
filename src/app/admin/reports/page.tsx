'use client';

import { motion } from 'framer-motion';
import { useReportStore } from '@/store/useReportStore';
import { 
  FileText, 
  Download, 
  Trash2, 
  Loader2, 
  FileSpreadsheet, 
  FileBarChart,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const { reports, deleteReport } = useReportStore();

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'financial': return <FileSpreadsheet size={20} className="text-emerald-500" />;
      case 'attendance': return <Calendar size={20} className="text-brand-primary" />;
      case 'academic': return <FileBarChart size={20} className="text-brand-primary" />;
      default: return <FileText size={20} className="text-[var(--text-muted)]" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Reports Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">View, download, and manage your generated reports.</p>
        </div>
        <Link href="/admin/dashboard">
          <button className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Back to Dashboard
          </button>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-sm overflow-hidden book-page"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left data-table">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-medium">Report Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Generated</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-[var(--border-light)] mb-3" />
                      <p className="font-medium text-[var(--text-secondary)]">No reports found</p>
                      <p className="text-sm">Generated reports will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
                          {getReportIcon(report.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">{report.name}</div>
                          <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{report.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-[var(--text-secondary)] font-medium">{report.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      {report.status === 'completed' ? (
                        <span className="badge badge-green">
                          Completed
                        </span>
                      ) : report.status === 'generating' ? (
                        <span className="badge inline-flex items-center w-fit gap-1.5 bg-[var(--bg-tertiary)] text-brand-primary border-[var(--border-light)]">
                          <Loader2 size={12} className="animate-spin" />
                          Generating
                        </span>
                      ) : (
                        <span className="badge badge-rose inline-flex items-center w-fit gap-1.5">
                          <AlertCircle size={12} />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)]">
                      {new Date(report.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-[var(--text-muted)] font-medium">
                      {report.size || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          disabled={report.status !== 'completed'}
                          className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
