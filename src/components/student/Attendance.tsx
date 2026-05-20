"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

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

  // Mock data for heatmap
  const getStatus = (day: number) => {
    if (day % 7 === 5) return 'holiday'; // Fridays
    if (day === 3 || day === 12) return 'absent';
    if (day === 8) return 'late';
    if (day > new Date().getDate() && currentMonth.getMonth() === new Date().getMonth()) return 'future';
    return 'present';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* S-P3: Summary Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className={`text-6xl font-bold font-bricolage ${summary.percentage >= 85 ? 'text-emerald-600' : summary.percentage >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
              {summary.percentage}%
            </h1>
            <p className={`text-sm font-bold mt-2 font-bangla ${summary.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {summary.percentage >= 75 ? t('attendance_eligible') : t('attendance_warning')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 w-full">
            {[
              { label: "Present", value: summary.present, color: "text-emerald-600", bg: "bg-emerald-50", code: "P" },
              { label: "Absent", value: summary.absent, color: "text-rose-600", bg: "bg-rose-50", code: "A" },
              { label: "Late", value: summary.late, color: "text-amber-600", bg: "bg-amber-50", code: "L" },
              { label: "Leave", value: summary.leave, color: "text-blue-600", bg: "bg-blue-50", code: "LV" },
            ].map(item => (
              <div key={item.label} className={`${item.bg} p-4 rounded-xl border border-white/50 flex flex-col items-center justify-center text-center`}>
                <span className={`text-xl font-bold font-bricolage ${item.color}`}>{item.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{item.label} ({item.code})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Heatmap */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 font-bangla">উপস্থিতির ক্যালেন্ডার</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg"><span className="material-symbols-outlined">chevron_left</span></button>
              <span className="text-sm font-bold text-slate-700 min-w-[100px] text-center">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'].map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-2 font-bangla">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getStatus(day);
              const colorClass = {
                present: 'bg-emerald-500 text-white',
                absent: 'bg-rose-500 text-white',
                late: 'bg-amber-500 text-white',
                holiday: 'bg-slate-100 text-slate-400',
                future: 'bg-slate-50 text-slate-200',
              }[status];
              
              return (
                <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-110 cursor-pointer ${colorClass}`}>
                  {day}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-slate-50">
            {[
              { label: "উপস্থিত", color: "bg-emerald-500" },
              { label: "অনুপস্থিত", color: "bg-rose-500" },
              { label: "দেরি", color: "bg-amber-500" },
              { label: "ছুটি/বন্ধ", color: "bg-slate-100" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <span className="text-[10px] font-bold text-slate-500 font-bangla">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-900 font-bangla mb-4">বিষয়ভিত্তিক উপস্থিতি</h3>
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
                  <span className="text-slate-700 font-bangla">{sub.subject}</span>
                  <span className={sub.percent < 75 ? 'text-rose-600' : 'text-slate-500'}>{sub.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${sub.percent < 75 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span>
            ডাউনলোড রিপোর্ট (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}

