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
      case 'attendance': return <Calendar size={20} className="text-blue-500" />;
      case 'academic': return <FileBarChart size={20} className="text-indigo-500" />;
      default: return <FileText size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Reports Management</h1>
          <p className="text-sm text-slate-500 mt-1">View, download, and manage your generated reports.</p>
        </div>
        <Link href="/admin/dashboard">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Back to Dashboard
          </button>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Report Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date Generated</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-slate-200 mb-3" />
                      <p className="font-medium text-slate-600">No reports found</p>
                      <p className="text-sm">Generated reports will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          {getReportIcon(report.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{report.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{report.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-slate-600 font-medium">{report.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      {report.status === 'completed' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Completed
                        </span>
                      ) : report.status === 'generating' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 flex items-center w-fit gap-1.5">
                          <Loader2 size={12} className="animate-spin" />
                          Generating
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700 border border-rose-200 flex items-center w-fit gap-1.5">
                          <AlertCircle size={12} />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {report.size || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          disabled={report.status !== 'completed'}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
