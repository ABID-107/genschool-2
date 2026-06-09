"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { getNoticesByAudience, NOTICE_CATEGORIES, NOTICE_PRIORITIES, type Notice } from "@/lib/noticeStore";

export function NoticesView() {
  const { lang, t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const studentClass = 5;
    setNotices(getNoticesByAudience('students', studentClass));
  }, []);

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      exam: 'bg-amber-100 text-amber-700',
      holiday: 'bg-rose-100 text-rose-700',
      academic: 'bg-indigo-100 text-indigo-700',
      emergency: 'bg-red-100 text-red-700',
      general: 'bg-slate-100 text-slate-700',
      finance: 'bg-emerald-100 text-emerald-700',
      event: 'bg-purple-100 text-purple-700',
      sports: 'bg-cyan-100 text-cyan-700',
    };
    return map[cat] || 'bg-indigo-100 text-indigo-700';
  };

  const priorityIcon = (p: string) => {
    const map: Record<string, string> = {
      urgent: '🔴',
      high: '🟠',
      medium: '🔵',
      low: '⚪',
    };
    return map[p] || '';
  };
=======
import { useLanguage } from "@/lib/i18n";

export function NoticesView() {
  const { lang, t } = useLanguage();

  const notices = [
    { id: 1, titleBn: "বার্ষিক পরীক্ষার সময়সূচী ২০২৪", titleEn: "Annual Exam Schedule 2024", date: "১০ মে, ২০২৫", category: "Exam", important: true },
    { id: 2, titleBn: "আগামীকাল স্কুল বন্ধের নোটিশ", titleEn: "Notice: School Closed Tomorrow", date: "০৯ মে, ২০২৫", category: "Holiday", important: false },
    { id: 3, titleBn: "নতুন স্কুল ড্রেস সংগ্রহ সংক্রান্ত", titleEn: "Regarding New School Dress Collection", date: "০৭ মে, ২০২৫", category: "General", important: false },
  ];
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
<<<<<<< HEAD
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 font-bangla">
            {lang === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}
          </h3>
          {notices.length > 0 && (
            <span className="text-xs text-slate-400">{notices.length} notice{notices.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {notices.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            {lang === 'bn' ? 'কোনো নোটিশ নেই।' : 'No notices available.'}
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className={`p-5 rounded-2xl border transition-all hover:shadow-md cursor-pointer group ${notice.priority === 'urgent' ? 'bg-red-50/30 border-red-100' : notice.priority === 'high' ? 'bg-amber-50/30 border-amber-100' : 'bg-slate-50/50 border-slate-100'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${categoryColor(notice.category)}`}>
                      {NOTICE_CATEGORIES.find(c => c.value === notice.category)?.label || notice.category}
                    </span>
                    {notice.priority === 'urgent' && (
                      <span className="text-[10px] font-bold text-red-600">URGENT</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-bangla">
                    {new Date(notice.publishDate).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 font-bangla group-hover:text-indigo-600 transition-colors mb-1">
                  {notice.title}
                </h4>
                {notice.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{notice.description}</p>
                )}
                {notice.attachments.length > 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                    <span className="material-symbols-outlined text-[14px]">attach_file</span>
                    {notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
=======
        <h3 className="text-xl font-bold text-slate-900 font-bangla mb-6">নোটিশ বোর্ড</h3>
        <div className="space-y-4">
          {notices.map(notice => (
            <div key={notice.id} className={`p-5 rounded-2xl border transition-all hover:shadow-md cursor-pointer group ${notice.important ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-slate-100'}`}>
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  notice.category === 'Exam' ? 'bg-amber-100 text-amber-700' :
                  notice.category === 'Holiday' ? 'bg-rose-100 text-rose-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {notice.category}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-bangla">{notice.date}</span>
              </div>
              <h4 className="font-bold text-slate-800 font-bangla group-hover:text-indigo-600 transition-colors">
                {lang === 'bn' ? notice.titleBn : notice.titleEn}
              </h4>
            </div>
          ))}
        </div>
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
