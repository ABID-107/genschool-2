"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { ArrowLeft, Download, FileText, ChevronRight } from "lucide-react";

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
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] font-bold text-sm mb-4"
        >
          <ArrowLeft size={20} />
          ফিরে যান
        </button>

        {/* Result Detail Header */}
        <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-6 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-[var(--brand-primary)]"></div>
          <h2 className="text-xl font-bold font-bangla text-[var(--text-primary)] mb-1">বার্ষিক পরীক্ষা - ২০২৪</h2>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Class 10-A • Roll: 12</p>
          
          <div className="mt-6 flex justify-center gap-12">
            <div className="text-center">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Marks</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">৮৪২</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Overall GPA</p>
              <p className="text-3xl font-bold text-[var(--brand-primary)]">৫.০০</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Position</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">৩য়</p>
            </div>
          </div>
        </div>

        {/* Subject-wise Table */}
        <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-light)]">
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-bangla">বিষয়</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Written</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">MCQ</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Prac.</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Grade</th>
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
                  <tr key={idx} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-[var(--text-secondary)] font-bangla">{row.sub}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[var(--text-secondary)] text-center">{row.written}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[var(--text-secondary)] text-center">{row.mcq}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[var(--text-secondary)] text-center">{row.prac}</td>
                    <td className="px-4 py-4 text-sm font-bold text-[var(--brand-primary)] text-center">{row.total}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-[var(--green-50)] text-[var(--brand-primary)] text-[10px] font-bold rounded-md border border-[var(--green-100)]">{row.grade}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button className="flex-1 py-4 bg-[var(--brand-primary)] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[var(--brand-primary)]/20 active:scale-[0.98] transition-all">
            <Download size={20} />
            ডাউনলোড মার্কশীট (বাংলা)
          </button>
          <button className="flex-1 py-4 border-2 border-[var(--border-color)] text-[var(--text-secondary)] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--bg-secondary)] transition-all active:scale-[0.98]">
            <Download size={20} />
            Download (English)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[var(--text-primary)] font-bangla mb-6">প্রকাশিত ফলাফলসমূহ</h3>
        <div className="space-y-4">
          {exams.map(exam => (
            <div 
              key={exam.id} 
              onClick={() => setSelectedExam(exam.id)}
              className="p-4 border border-[var(--border-light)] rounded-2xl flex items-center justify-between hover:bg-[var(--green-50)]/50 hover:border-[var(--green-200)] cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-xl flex items-center justify-center group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-all shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] font-bangla leading-tight group-hover:text-[var(--brand-deep)] transition-colors">{exam.name}</h4>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{exam.term} • {exam.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">GPA</p>
                  <p className="text-lg font-bold text-[var(--brand-primary)]">{exam.gpa}</p>
                </div>
                <ChevronRight size={20} className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

