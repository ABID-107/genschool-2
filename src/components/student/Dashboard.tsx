"use client";

import { useLanguage } from "@/lib/i18n";
import { Assignment, CalendarEvent } from "@/lib/types";
import { User, ClipboardCheck, FileText, TrendingUp, Wallet, AlertTriangle } from "lucide-react";

interface DashboardProps {
  assignments: Assignment[];
  events: CalendarEvent[];
  studentData: {
    nameBn: string;
    nameEn: string;
    class: string;
    section: string;
    roll: string;
    studentId: string;
    attendance: number;
    feeDue: number;
    gpa: string;
  };
}

export function StudentDashboardView({ assignments, events, studentData }: DashboardProps) {
  const { lang, t } = useLanguage();

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* S-P1: Top Identity Bar */}
      <div className="bg-[var(--bg-tertiary)] backdrop-blur-md rounded-2xl border border-[var(--border-color)]/50 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-16 h-16 rounded-xl bg-[var(--green-100)] flex items-center justify-center text-[var(--brand-primary)] flex-shrink-0">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-bangla text-[var(--text-primary)] leading-tight">
              {lang === 'bn' ? studentData.nameBn : studentData.nameEn}
            </h2>
            <p className="text-xs font-semibold text-[var(--text-muted)] mt-1 uppercase tracking-wider">
              {studentData.class}-{studentData.section} • Roll: {studentData.roll}
            </p>
            <p className="text-[10px] font-bold text-[var(--brand-primary)] mt-0.5">ID: {studentData.studentId}</p>
          </div>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
          <p className="text-sm font-bold text-[var(--text-primary)] font-bangla">আদর্শ উচ্চ বিদ্যালয়</p>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Academic Year 2025</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-6 shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[var(--text-primary)] font-bangla text-lg">আজকের ক্লাসসমূহ</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full border border-[var(--color-success)]/20 animate-pulse">
                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('ongoing_class')}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { time: "09:00 - 09:45", subject: "গণিত", teacher: "জনাব রহিম", room: "১০১", current: true },
                { time: "09:50 - 10:35", subject: "বাংলা", teacher: "মিস আয়েশা", room: "১০২", current: false },
                { time: "১০:৪০ - ১১:২৫", subject: "ইংরেজি", teacher: "জনাব করিম", room: "১০৩", current: false },
              ].map((cls, idx) => (
                <div key={idx} className={`p-4 rounded-xl border transition-all flex items-center justify-between ${cls.current ? 'bg-[var(--green-50)] border-[var(--green-200)] shadow-sm scale-[1.02]' : 'bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-muted)]'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${cls.current ? 'bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--green-200)]' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className={`font-bold font-bangla ${cls.current ? 'text-[var(--brand-deep)]' : 'text-[var(--text-secondary)]'}`}>{cls.subject}</p>
                      <p className="text-[11px] font-medium opacity-80">{cls.teacher} • Room {cls.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{cls.time}</p>
                    {cls.current && <p className="text-[9px] font-bold text-[var(--brand-primary)] uppercase mt-1">১০ মিনিট {t('time_remaining')}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards Column */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-fit">
          {/* Attendance Card */}
          <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)]/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${studentData.attendance >= 85 ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : studentData.attendance >= 75 ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'}`}>
                <ClipboardCheck size={20} />
              </div>
              <span className={`text-xl font-bold font-heading ${studentData.attendance >= 85 ? 'text-[var(--color-success)]' : studentData.attendance >= 75 ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]'}`}>
                {studentData.attendance}%
              </span>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t('attendance')}</p>
            {studentData.attendance < 75 && (
              <p className="text-[9px] font-bold text-[var(--color-error)] mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> {t('exam_risk')}
              </p>
            )}
          </div>

          {/* Assignments Card */}
          <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)]/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-[var(--green-50)] text-[var(--brand-primary)]">
                <FileText size={20} />
              </div>
              <span className="text-xl font-bold font-heading text-[var(--text-primary)]">{pendingCount}</span>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t('pending')} {t('assignments')}</p>
          </div>

          {/* GPA Card */}
          <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)]/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-[var(--color-warning-bg)] text-[var(--color-warning)]">
                <TrendingUp size={20} />
              </div>
              <span className="px-2 py-0.5 bg-[var(--color-warning-bg)] text-[var(--color-warning)] text-xs font-bold rounded-md">{studentData.gpa}</span>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t('latest_gpa')}</p>
          </div>

          {/* Fee Card */}
          <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)]/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-[var(--color-error-bg)] text-[var(--color-error)]">
                <Wallet size={20} />
              </div>
              <span className="text-lg font-bold text-[var(--text-primary)]">৳{studentData.feeDue}</span>
            </div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{t('fee_due')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

