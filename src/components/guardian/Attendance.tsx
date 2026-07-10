import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { AlertTriangle, UserCheck, UserX, Clock, MessageSquare, Calendar, ChevronLeft, ChevronRight, MailCheck, AlertCircle } from "lucide-react";

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

  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return "text-[var(--color-success)] bg-[var(--color-success-bg)] border-[var(--color-success)]/20";
    if (pct >= 75) return "text-[var(--color-warning)] bg-[var(--color-warning-bg)] border-[var(--color-warning)]/20";
    return "text-[var(--color-error)] bg-[var(--color-error-bg)] border-[var(--color-error)]/20";
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 85) return "bg-[var(--color-success)]";
    if (pct >= 75) return "bg-[var(--color-warning)]";
    return "bg-[var(--color-error)]";
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {summary.percentage < 75 && (
        <div className="bg-[var(--color-error-bg)] border-l-4 border-[var(--color-error)] p-4 rounded-xl flex gap-3 shadow-sm">
          <AlertTriangle className="text-[var(--color-error)] shrink-0" size={24} />
          <div>
            <h4 className="font-bold text-[var(--color-error)]">{lang === 'bn' ? 'সতর্কতা: উপস্থিতি ৭৫% এর নিচে' : 'Warning: Attendance below 75%'}</h4>
            <p className="text-sm text-[var(--color-error)]/80 mt-1">
              {lang === 'bn' 
                ? 'আপনার সন্তানের উপস্থিতি সন্তোষজনক নয়। পরবর্তী পরীক্ষায় অংশগ্রহণের জন্য নূন্যতম ৭৫% উপস্থিতি বাধ্যতামূলক।' 
                : 'Your child\'s attendance is low. A minimum of 75% attendance is required to participate in final exams.'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`col-span-2 md:col-span-4 p-5 rounded-3xl border ${getPercentageColor(summary.percentage)} shadow-sm flex items-center justify-between`}>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider opacity-80">{lang === 'bn' ? 'মোট উপস্থিতি' : 'Total Attendance'}</p>
            <h2 className="text-4xl font-black mt-1">{summary.percentage}%</h2>
          </div>
          <div className="w-1/2 md:w-1/3">
            <div className="w-full bg-[var(--bg-secondary)] h-3 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getProgressColor(summary.percentage)}`} style={{ width: `${summary.percentage}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-bold text-[var(--text-muted)]">
              <span>0%</span>
              <span>75% Min</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col justify-center items-center text-center">
          <UserCheck className="text-[var(--color-success)] mb-2" size={28} />
          <h4 className="text-2xl font-bold text-[var(--text-primary)]">{summary.present}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'উপস্থিত' : 'Present'}</p>
        </div>
        
        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col justify-center items-center text-center">
          <UserX className="text-[var(--color-error)] mb-2" size={28} />
          <h4 className="text-2xl font-bold text-[var(--text-primary)]">{summary.absent}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'অনুপস্থিত' : 'Absent'}</p>
        </div>

        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col justify-center items-center text-center">
          <Clock className="text-[var(--color-warning)] mb-2" size={28} />
          <h4 className="text-2xl font-bold text-[var(--text-primary)]">{summary.late}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'বিলম্বে উপস্থিতি' : 'Late'}</p>
        </div>

        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col justify-center items-center text-center">
          <MessageSquare className="text-[var(--brand-primary)] mb-2" size={28} />
          <h4 className="text-2xl font-bold text-[var(--text-primary)]">{summary.smsSent}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'এসএমএস পাঠানো হয়েছে' : 'SMS Alerts'}</p>
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Calendar size={20} className="text-[var(--brand-primary)]" />
            {lang === 'bn' ? 'মাসিক রিপোর্ট' : 'Monthly Report'}
          </h3>
          <div className="flex items-center gap-3 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-xl border border-[var(--border-color)]">
            <button className="p-1 hover:bg-[var(--bg-secondary)]/80 rounded-md transition-colors"><ChevronLeft size={16} /></button>
            <span className="text-sm font-bold">{currentMonth}</span>
            <button className="p-1 hover:bg-[var(--bg-secondary)]/80 rounded-md transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-[var(--text-muted)] mb-4 flex-wrap">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[var(--color-success)]"></span>{lang === 'bn' ? 'উপস্থিত' : 'Present'}</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[var(--color-error)]"></span>{lang === 'bn' ? 'অনুপস্থিত' : 'Absent'}</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[var(--color-warning)]"></span>{lang === 'bn' ? 'বিলম্ব' : 'Late'}</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)]"></span>{lang === 'bn' ? 'ছুটির দিন' : 'Holiday'}</div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-[var(--text-dim)] uppercase py-2">{day}</div>
          ))}
          
          <div className="aspect-square"></div>
          <div className="aspect-square"></div>
          
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            let status = 'present';
            let bg = 'bg-[var(--color-success-bg)] hover:bg-[var(--color-success-bg)]/80 text-[var(--color-success)]';
            
            if (day === 5 || day === 14) { status = 'absent'; bg = 'bg-[var(--color-error-bg)] hover:bg-[var(--color-error-bg)]/80 text-[var(--color-error)]'; }
            if (day === 10) { status = 'late'; bg = 'bg-[var(--color-warning-bg)] hover:bg-[var(--color-warning-bg)]/80 text-[var(--color-warning)]'; }
            if (day % 7 === 4 || day % 7 === 5) { status = 'holiday'; bg = 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'; }
            if (day > 18) { status = 'upcoming'; bg = 'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-dim)]'; }

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

      <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-[var(--brand-primary)]" />
          {lang === 'bn' ? 'এসএমএস হিস্ট্রি' : 'SMS Alert History'}
        </h3>
        <div className="space-y-3">
          {[
            { id: 1, date: 'May 14', msgEn: 'Alex was absent today.', msgBn: 'অ্যালেক্স আজ অনুপস্থিত ছিল।', status: 'delivered', time: '10:00 AM' },
            { id: 2, date: 'May 10', msgEn: 'Alex arrived late (09:15 AM).', msgBn: 'অ্যালেক্স দেরিতে (০৯:১৫) উপস্থিত হয়েছে।', status: 'delivered', time: '09:20 AM' },
            { id: 3, date: 'May 05', msgEn: 'Alex was absent today.', msgBn: 'অ্যালেক্স আজ অনুপস্থিত ছিল।', status: 'failed', time: '10:00 AM' },
          ].map(sms => (
            <div key={sms.id} className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${sms.status === 'delivered' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'}`}>
                {sms.status === 'delivered' ? <MailCheck size={18} /> : <AlertCircle size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{lang === 'bn' ? sms.msgBn : sms.msgEn}</p>
                  <span className="text-xs font-bold text-[var(--text-muted)] whitespace-nowrap ml-2">{sms.date}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-medium text-[var(--text-muted)]">{sms.time}</span>
                  {sms.status === 'failed' && (
                    <button className="text-xs font-bold text-[var(--color-error)] hover:text-[var(--color-error)]/80 underline">{lang === 'bn' ? 'পুনরায় পাঠান' : 'Resend'}</button>
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
