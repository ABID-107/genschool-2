"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

interface ResultsProps {
  exams: {
    id: string;
    name: string;
    term: string;
    date: string;
    gpa: string;
    status: 'pass' | 'fail';
  }[];
}

export function ResultsView({ exams }: ResultsProps) {
  const { lang, t } = useLanguage();
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  if (selectedExam) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-500">
        <button 
          onClick={() => setSelectedExam(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-4"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          ফিরে যান
        </button>

        {/* Result Detail Header */}
        <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-indigo-500"></div>
          <h2 className="text-xl font-bold font-bangla text-slate-900 mb-1">বার্ষিক পরীক্ষা - ২০২৪</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Class 10-A • Roll: 12</p>
          
          <div className="mt-6 flex justify-center gap-12">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Marks</p>
              <p className="text-2xl font-bold text-slate-900">৮৪২</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overall GPA</p>
              <p className="text-3xl font-bold text-indigo-600">৫.০০</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Position</p>
              <p className="text-2xl font-bold text-slate-900">৩য়</p>
            </div>
          </div>
        </div>

        {/* Subject-wise Table */}
        <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-bangla">বিষয়</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Written</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">MCQ</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Prac.</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { sub: "বাংলা ১ম", written: 65, mcq: 28, prac: "-", total: 93, grade: "A+" },
                  { sub: "বাংলা ২য়", written: 62, mcq: 27, prac: "-", total: 89, grade: "A+" },
                  { sub: "ইংরেজি ১ম", written: 88, mcq: "-", prac: "-", total: 88, grade: "A+" },
                  { sub: "গণিত", written: 68, mcq: 29, prac: "-", total: 97, grade: "A+" },
                  { sub: "পদার্থবিজ্ঞান", written: 45, mcq: 22, prac: 24, total: 91, grade: "A+" },
                  { sub: "রসায়ন", written: 42, mcq: 24, prac: 25, total: 91, grade: "A+" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 font-bangla">{row.sub}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-600 text-center">{row.written}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-600 text-center">{row.mcq}</td>
                    <td className="px-4 py-4 text-sm font-medium text-slate-600 text-center">{row.prac}</td>
                    <td className="px-4 py-4 text-sm font-bold text-indigo-600 text-center">{row.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100">{row.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span>
            ডাউনলোড মার্কশীট (বাংলা)
          </button>
          <button className="flex-1 py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Download (English)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 font-bangla mb-6">প্রকাশিত ফলাফলসমূহ</h3>
        <div className="space-y-4">
          {exams.map(exam => (
            <div 
              key={exam.id} 
              onClick={() => setSelectedExam(exam.id)}
              className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-indigo-50/50 hover:border-indigo-200 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 font-bangla leading-tight group-hover:text-indigo-700 transition-colors">{exam.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{exam.term} • {exam.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GPA</p>
                  <p className="text-lg font-bold text-indigo-600">{exam.gpa}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

