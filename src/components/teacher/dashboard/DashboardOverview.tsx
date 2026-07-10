import { Assignment, CalendarEvent } from "@/lib/types";
import { Plus, Users, BookOpen, FileText } from 'lucide-react';

interface DashboardOverviewProps {
  assignments: Assignment[];
  events: CalendarEvent[];
  onTabChange: (tab: string) => void;
  teacherName: string;
}

export function DashboardOverview({ assignments, events, onTabChange, teacherName }: DashboardOverviewProps) {
  return (
    <section id="overview" className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Welcome back, {teacherName}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Here is what is happening with your classes today.</p>
        </div>
        <button
          onClick={() => onTabChange('new-course')}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <Plus size={16} />
          New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--green-50)] text-[var(--brand-primary)] flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] font-medium">Total Students</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] font-heading">1,284</h3>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] font-medium">Active Courses</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] font-heading">12</h3>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-warning-bg)] text-[var(--color-warning)] flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] font-medium">Assignments</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] font-heading">{assignments.length}</h3>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-info-bg)] text-[var(--color-info)] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)] font-medium">Attendance Rate</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] font-heading">94%</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
