import { create } from 'zustand';

export type ReportStatus = 'generating' | 'completed' | 'failed';
export type ReportType = 'daily' | 'financial' | 'attendance' | 'academic';

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  size?: string;
  url?: string;
}

interface ReportState {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => string;
  updateReportStatus: (id: string, status: ReportStatus, extra?: Partial<Report>) => void;
  deleteReport: (id: string) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [
    {
      id: 'rpt-001',
      name: 'Financial Overview Q2',
      type: 'financial',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      size: '2.4 MB'
    },
    {
      id: 'rpt-002',
      name: 'Attendance Summary - May',
      type: 'attendance',
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      size: '1.1 MB'
    }
  ],
  addReport: (report) => {
    const newReport: Report = {
      ...report,
      id: `rpt-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ reports: [newReport, ...state.reports] }));
    return newReport.id;
  },
  updateReportStatus: (id, status, extra) => 
    set((state) => ({
      reports: state.reports.map((r) => 
        r.id === id ? { ...r, status, ...extra } : r
      )
    })),
  deleteReport: (id) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id)
    }))
}));
