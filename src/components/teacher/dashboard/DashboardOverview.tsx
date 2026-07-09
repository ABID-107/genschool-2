import { Assignment, CalendarEvent, Submission } from "@/lib/types";

interface DashboardOverviewProps {
  assignments: Assignment[];
  events: CalendarEvent[];
  onTabChange: (tab: string) => void;
  teacherName: string;
}

export function DashboardOverview({ assignments, events, onTabChange, teacherName }: DashboardOverviewProps) {
  return (
    <section id="overview" className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2 font-heading tracking-tight">Welcome back, {teacherName}</h1>
          <p className="text-sm md:text-base text-slate-500">Here's what's happening with your classes today.</p>
        </div>
        <button onClick={() => onTabChange('new-course')} className="glass-button-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 w-full md:w-auto justify-center">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Course
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="glass-card p-6 flex items-center gap-4 group">
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--green-50)] to-[var(--green-100)]/50 text-[var(--brand-primary)] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">1,284</h3>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 group">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Active Courses</p>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">12</h3>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 group">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
            <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Assignments</p>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">{assignments.length}</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

