import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

interface AttendanceSummary {
  percentage: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  smsSent: number;
}

export function GuardianAttendanceView({ summary }: { summary: AttendanceSummary }) {
  const { lang, t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState("May 2025");

  // Threshold colors
  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (pct >= 75) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 85) return "bg-green-500";
    if (pct >= 75) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Warning Banner if Attendance is Low */}
      {summary.percentage < 75 && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-xl flex gap-3 shadow-sm">
          <span className="material-symbols-outlined text-rose-600 shrink-0">warning</span>
          <div>
            <h4 className="font-bold text-rose-800">{lang === 'bn' ? 'সতর্কতা: উপস্থিতি ৭৫% এর নিচে' : 'Warning: Attendance below 75%'}</h4>
            <p className="text-sm text-rose-600 mt-1">
              {lang === 'bn' 
                ? 'আপনার সন্তানের উপস্থিতি সন্তোষজনক নয়। পরবর্তী পরীক্ষায় অংশগ্রহণের জন্য নূন্যতম ৭৫% উপস্থিতি বাধ্যতামূলক।' 
                : 'Your child\'s attendance is low. A minimum of 75% attendance is required to participate in final exams.'}
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`col-span-2 md:col-span-4 p-5 rounded-3xl border ${getPercentageColor(summary.percentage)} shadow-sm flex items-center justify-between`}>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-80">{lang === 'bn' ? 'মোট উপস্থিতি' : 'Total Attendance'}</p>
            <h2 className="text-4xl font-black mt-1">{summary.percentage}%</h2>
          </div>
          <div className="w-1/2 md:w-1/3">
            <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getProgressColor(summary.percentage)}`} style={{ width: `${summary.percentage}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold opacity-70">
              <span>0%</span>
              <span>75% Min</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-green-500 text-3xl mb-2">how_to_reg</span>
          <h4 className="text-2xl font-bold text-slate-900">{summary.present}</h4>
          <p className="text-xs font-semibold text-slate-500 uppercase">{lang === 'bn' ? 'উপস্থিত' : 'Present'}</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-rose-500 text-3xl mb-2">person_off</span>
          <h4 className="text-2xl font-bold text-slate-900">{summary.absent}</h4>
          <p className="text-xs font-semibold text-slate-500 uppercase">{lang === 'bn' ? 'অনুপস্থিত' : 'Absent'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-amber-500 text-3xl mb-2">schedule</span>
          <h4 className="text-2xl font-bold text-slate-900">{summary.late}</h4>
          <p className="text-xs font-semibold text-slate-500 uppercase">{lang === 'bn' ? 'বিলম্বে উপস্থিতি' : 'Late'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-indigo-500 text-3xl mb-2">sms</span>
          <h4 className="text-2xl font-bold text-slate-900">{summary.smsSent}</h4>
          <p className="text-xs font-semibold text-slate-500 uppercase">{lang === 'bn' ? 'এসএমএস পাঠানো হয়েছে' : 'SMS Alerts'}</p>
        </div>
      </div>

      {/* Monthly Heatmap */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">calendar_month</span>
            {lang === 'bn' ? 'মাসিক রিপোর্ট' : 'Monthly Report'}
          </h3>
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <button className="p-1 hover:bg-slate-200 rounded-md transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
            <span className="text-sm font-bold">{currentMonth}</span>
            <button className="p-1 hover:bg-slate-200 rounded-md transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-green-500"></span>{lang === 'bn' ? 'উপস্থিত' : 'Present'}</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-rose-500"></span>{lang === 'bn' ? 'অনুপস্থিত' : 'Absent'}</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-amber-500"></span>{lang === 'bn' ? 'বিলম্ব' : 'Late'}</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-slate-200 border border-slate-300"></span>{lang === 'bn' ? 'ছুটির দিন' : 'Holiday'}</div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase py-2">{day}</div>
          ))}
          
          {/* Empty days */}
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>
          
          {/* Days */}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            let status = 'present';
            let bg = 'bg-green-100 hover:bg-green-200 text-green-700';
            
            // Mock random statuses
            if (day === 5 || day === 14) { status = 'absent'; bg = 'bg-rose-100 hover:bg-rose-200 text-rose-700'; }
            if (day === 10) { status = 'late'; bg = 'bg-amber-100 hover:bg-amber-200 text-amber-700'; }
            if (day % 7 === 4 || day % 7 === 5) { status = 'holiday'; bg = 'bg-slate-100 text-slate-400 border border-slate-200'; }
            if (day > 18) { status = 'upcoming'; bg = 'bg-white border border-slate-200 text-slate-400'; }

            return (
              <div 
                key={day} 
                className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm md:text-base cursor-pointer transition-colors ${bg}`}
                title={`May ${day}: ${status.charAt(0).toUpperCase() + status.slice(1)}`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* SMS Alert History */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-indigo-600">sms</span>
          {lang === 'bn' ? 'এসএমএস হিস্ট্রি' : 'SMS Alert History'}
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, date: 'May 14', msgEn: 'Alex was absent today.', msgBn: 'অ্যালেক্স আজ অনুপস্থিত ছিল।', status: 'delivered', time: '10:00 AM' },
            { id: 2, date: 'May 10', msgEn: 'Alex arrived late (09:15 AM).', msgBn: 'অ্যালেক্স দেরিতে (০৯:১৫) উপস্থিত হয়েছে।', status: 'delivered', time: '09:20 AM' },
            { id: 3, date: 'May 05', msgEn: 'Alex was absent today.', msgBn: 'অ্যালেক্স আজ অনুপস্থিত ছিল।', status: 'failed', time: '10:00 AM' },
          ].map(sms => (
            <div key={sms.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${sms.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                <span className="material-symbols-outlined text-lg">{sms.status === 'delivered' ? 'mark_email_read' : 'error'}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-slate-900">{lang === 'bn' ? sms.msgBn : sms.msgEn}</p>
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">{sms.date}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-medium text-slate-500">{sms.time}</span>
                  {sms.status === 'failed' && (
                    <button className="text-xs font-bold text-rose-600 hover:text-rose-700 underline">{lang === 'bn' ? 'পুনরায় পাঠান' : 'Resend'}</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

