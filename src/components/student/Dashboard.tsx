"use client";

import { useLanguage } from "@/lib/i18n";
import { Assignment, CalendarEvent } from "@/lib/types";

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
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/50 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </div>
          <div>
            <h2 className="text-xl font-bold font-bangla text-slate-900 leading-tight">
              {lang === 'bn' ? studentData.nameBn : studentData.nameEn}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              {studentData.class}-{studentData.section} • Roll: {studentData.roll}
            </p>
            <p className="text-[10px] font-bold text-indigo-600 mt-0.5">ID: {studentData.studentId}</p>
          </div>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto">
          <p className="text-sm font-bold text-slate-800 font-bangla">আদর্শ উচ্চ বিদ্যালয়</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Academic Year 2025</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Classes Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 font-bangla text-lg">আজকের ক্লাসসমূহ</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-pulse">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('ongoing_class')}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { time: "09:00 - 09:45", subject: "গণিত", teacher: "জনাব রহিম", room: "১০১", current: true },
                { time: "09:50 - 10:35", subject: "বাংলা", teacher: "মিস আয়েশা", room: "১০২", current: false },
                { time: "১০:৪০ - ১১:২৫", subject: "ইংরেজি", teacher: "জনাব করিম", room: "১০৩", current: false },
              ].map((cls, idx) => (
                <div key={idx} className={`p-4 rounded-xl border transition-all flex items-center justify-between ${cls.current ? 'bg-indigo-50 border-indigo-200 shadow-sm scale-[1.02]' : 'bg-slate-50/50 border-slate-100 text-slate-500'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${cls.current ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className={`font-bold font-bangla ${cls.current ? 'text-indigo-900' : 'text-slate-700'}`}>{cls.subject}</p>
                      <p className="text-[11px] font-medium opacity-80">{cls.teacher} • Room {cls.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold">{cls.time}</p>
                    {cls.current && <p className="text-[9px] font-bold text-indigo-500 uppercase mt-1">১০ মিনিট {t('time_remaining')}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards Column */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-fit">
          {/* Attendance Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${studentData.attendance >= 85 ? 'bg-emerald-50 text-emerald-600' : studentData.attendance >= 75 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                <span className="material-symbols-outlined text-[20px]">person_check</span>
              </div>
              <span className={`text-xl font-bold font-heading ${studentData.attendance >= 85 ? 'text-emerald-600' : studentData.attendance >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                {studentData.attendance}%
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('attendance')}</p>
            {studentData.attendance < 75 && (
              <p className="text-[9px] font-bold text-rose-500 mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">warning</span> {t('exam_risk')}
              </p>
            )}
          </div>

          {/* Assignments Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <span className="material-symbols-outlined text-[20px]">assignment</span>
              </div>
              <span className="text-xl font-bold font-heading text-slate-900">{pendingCount}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('pending')} {t('assignments')}</p>
          </div>

          {/* GPA Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <span className="material-symbols-outlined text-[20px]">military_tech</span>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-md">{studentData.gpa}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('latest_gpa')}</p>
          </div>

          {/* Fee Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <span className="text-lg font-bold text-slate-900">৳{studentData.feeDue}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('fee_due')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

