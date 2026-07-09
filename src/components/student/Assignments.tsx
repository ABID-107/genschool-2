"use client";

import { useLanguage } from "@/lib/i18n";
import { Assignment } from "@/lib/types";
import { useState } from "react";

interface AssignmentsProps {
  assignments: Assignment[];
}

export function StudentAssignmentsView({ assignments }: AssignmentsProps) {
  const { lang, t } = useLanguage();
  const [selectedAsgn, setSelectedAsgn] = useState<Assignment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedAsgn(null);
      }, 2000);
    }, 1500);
  };

  if (selectedAsgn) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right duration-500">
        <button 
          onClick={() => setSelectedAsgn(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-[var(--brand-primary)] font-bold text-sm mb-4"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          ফিরে যান
        </button>

        <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-2 py-1 bg-[var(--green-50)] text-[var(--brand-primary)] text-[10px] font-bold rounded-md border border-[var(--green-100)] uppercase tracking-widest">{selectedAsgn.subject}</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 font-bangla">{selectedAsgn.title}</h2>
              <p className="text-xs font-bold text-slate-400 mt-1">শিক্ষক: {selectedAsgn.teacher}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marks</p>
              <p className="text-xl font-bold text-slate-900">{selectedAsgn.totalMarks}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">নির্দেশনা</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-bangla">{selectedAsgn.instructions}</p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[var(--brand-light)] transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-[var(--brand-primary)] transition-colors">cloud_upload</span>
                <p className="text-sm font-bold text-slate-500 mt-2 font-bangla group-hover:text-[var(--brand-primary)] transition-colors">আপনার ফাইল এখানে ড্র্যাগ করুন অথবা ক্লিক করুন</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PDF, DOCX, JPG (Max 10MB)</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--brand-primary)] text-white rounded-2xl font-bold shadow-lg shadow-[var(--brand-primary)]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "জমা দিন (Submit Now)"}
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50 text-emerald-600 p-6 rounded-2xl text-center animate-in zoom-in-95">
              <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
              <p className="font-bold font-bangla">আপনার অ্যাসাইনমেন্ট সফলভাবে জমা হয়েছে!</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 font-bangla mb-6">আপনার অ্যাসাইনমেন্টসমূহ</h3>
        
        <div className="space-y-4">
          {assignments.map(asgn => (
            <div 
              key={asgn.id} 
              onClick={() => setSelectedAsgn(asgn)}
              className="p-5 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--green-200)] hover:bg-[var(--green-50)]/30 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 ${
                  asgn.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 
                  asgn.status === 'submitted' ? 'bg-[var(--green-50)] text-[var(--brand-primary)]' : 
                  'bg-amber-50 text-amber-600'
                }`}>
                  <span className="material-symbols-outlined text-2xl">
                    {asgn.status === 'graded' ? 'verified' : asgn.status === 'submitted' ? 'description' : 'pending_actions'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 font-bangla leading-tight group-hover:text-[var(--brand-deep)] transition-colors">{asgn.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{asgn.subject}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-rose-400 font-bangla">শেষ সময়: {asgn.dueDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    asgn.status === 'graded' ? 'text-emerald-600' : 
                    asgn.status === 'submitted' ? 'text-[var(--brand-primary)]' : 
                    'text-amber-600'
                  }`}>{asgn.status}</p>
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

