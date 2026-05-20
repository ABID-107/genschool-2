"use client";

import { useLanguage } from "@/lib/i18n";

export function NoticesView() {
  const { lang, t } = useLanguage();

  const notices = [
    { id: 1, titleBn: "বার্ষিক পরীক্ষার সময়সূচী ২০২৪", titleEn: "Annual Exam Schedule 2024", date: "১০ মে, ২০২৫", category: "Exam", important: true },
    { id: 2, titleBn: "আগামীকাল স্কুল বন্ধের নোটিশ", titleEn: "Notice: School Closed Tomorrow", date: "০৯ মে, ২০২৫", category: "Holiday", important: false },
    { id: 3, titleBn: "নতুন স্কুল ড্রেস সংগ্রহ সংক্রান্ত", titleEn: "Regarding New School Dress Collection", date: "০৭ মে, ২০২৫", category: "General", important: false },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
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
      </div>
    </div>
  );
}

