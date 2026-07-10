"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

interface AttendanceProps {
  summary: {
    percentage: number;
    present: number;
    absent: number;
    late: number;
    leave: number;
  };
}

export function AttendanceView({ summary }: AttendanceProps) {
  const { lang, t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const getStatus = (day: number) => {
    if (day % 7 === 5) return 'holiday';
    if (day === 3 || day === 12) return 'absent';
    if (day === 8) return 'late';
    if (day > new Date().getDate() && currentMonth.getMonth() === new Date().getMonth()) return 'future';
    return 'present';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className={`text-6xl font-bold font-heading ${summary.percentage >= 85 ? 'text-[var(--color-success)]' : summary.percentage >= 75 ? 'text-[var(--color-warning)]' : 'text-[var(--color-error)]'}`}>
              {summary.percentage}%
            </h1>
            <p className={`text-sm font-bold mt-2 font-bangla ${summary.percentage >= 75 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
              {summary.percentage >= 75 ? t('attendance_eligible') : t('attendance_warning')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 w-full">
            {[
              { label: "Present", value: summary.present, color: "text-[var(--color-success)]", bg: "bg-[var(--color-success-bg)]", code: "P" },
              { label: "Absent", value: summary.absent, color: "text-[var(--color-error)]", bg: "bg-[var(--color-error-bg)]", code: "A" },
              { label: "Late", value: summary.late, color: "text-[var(--color-warning)]", bg: "bg-[var(--color-warning-bg)]", code: "L" },
              { label: "Leave", value: summary.leave, color: "text-[var(--color-info)]", bg: "bg-[var(--color-info-bg)]", code: "LV" },
            ].map(item => (
              <div key={item.label} className={`${item.bg} p-4 rounded-xl border border-[var(--border-light)] flex flex-col items-center justify-center text-center`}>
                <span className={`text-xl font-bold font-heading ${item.color}`}>{item.value}</span>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{item.label} ({item.code})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[var(--text-primary)] font-bangla">উপস্থিতির ক্যালেন্ডার</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg"><ChevronLeft size={20} /></button>
              <span className="text-sm font-bold text-[var(--text-secondary)] min-w-[100px] text-center">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[var(--text-dim)] uppercase py-2 font-bangla">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getStatus(day);
              const colorClass = {
                present: 'bg-[var(--color-success)] text-white',
                absent: 'bg-[var(--color-error)] text-white',
                late: 'bg-[var(--color-warning)] text-white',
                holiday: 'bg-[var(--bg-secondary)] text-[var(--text-muted)]',
                future: 'bg-[var(--bg-secondary)]/50 text-[var(--text-dim)]',
              }[status];
              
              return (
                <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-110 cursor-pointer ${colorClass}`}>
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-[var(--border-light)]">
            {[
              { label: "উপস্থিত", color: "bg-[var(--color-success)]" },
              { label: "অনুপস্থিত", color: "bg-[var(--color-error)]" },
              { label: "দেরি", color: "bg-[var(--color-warning)]" },
              { label: "ছুটি/বন্ধ", color: "bg-[var(--bg-secondary)]" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <span className="text-[10px] font-bold text-[var(--text-muted)] font-bangla">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm overflow-hidden">
          <h3 className="font-bold text-[var(--text-primary)] font-bangla mb-4">বিষয়ভিত্তিক উপস্থিতি</h3>
          <div className="space-y-4">
            {[
              { subject: "গণিত", percent: 92 },
              { subject: "বাংলা", percent: 88 },
              { subject: "ইংরেজি", percent: 72 },
              { subject: "বিজ্ঞান", percent: 95 },
              { subject: "ধর্ম", percent: 100 },
            ].map(sub => (
              <div key={sub.subject} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[var(--text-secondary)] font-bangla">{sub.subject}</span>
                  <span className={sub.percent < 75 ? 'text-[var(--color-error)]' : 'text-[var(--text-muted)]'}>{sub.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${sub.percent < 75 ? 'bg-[var(--color-error)]' : 'bg-[var(--color-success)]'}`}
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-xl text-xs font-bold border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/80 transition-colors flex items-center justify-center gap-2">
            <Download size={18} />
            ডাউনলোড রিপোর্ট (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
