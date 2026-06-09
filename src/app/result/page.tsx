"use client";

import { useState } from "react";
import Link from "next/link";

export default function PublicResultPortal() {
  const [studentId, setStudentId] = useState("");
  const [exam, setExam] = useState("");
  const [verification, setVerification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const fetchResult = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setResult({
        nameBn: "আলেক্স জনসন",
        nameEn: "Alex Johnson",
        class: "10",
        roll: "12",
        gpa: "5.00",
        status: "PASSED",
        subjects: [
          { name: "বাংলা", written: 65, mcq: 28, total: 93, grade: "A+" },
          { name: "ইংরেজি", written: 88, mcq: "-", total: 88, grade: "A+" },
          { name: "গণিত", written: 68, mcq: 29, total: 97, grade: "A+" },
        ]
      });
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-tertiary)] font-bangla pb-20">
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-light)] py-6 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">G</div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">আদর্শ উচ্চ বিদ্যালয়</h1>
          </Link>
          <div className="text-right">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Public Portal</p>
            <p className="text-sm font-bold text-brand-primary">অনলাইন ফলাফল</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4">
        {!result ? (
          <div className="glass-card bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-light)] p-8 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">ফলাফল দেখুন</h2>
            <p className="text-[var(--text-muted)] text-center text-sm mb-8">সঠিক তথ্য দিয়ে আপনার পরীক্ষার ফলাফল সংগ্রহ করুন</p>
            
            <form onSubmit={fetchResult} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 ml-1">স্টুডেন্ট আইডি (Student ID)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SMS-2025-0982"
                  className="glass-input w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans font-bold"
                  value={studentId}
                  onChange={e => setStudentId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 ml-1">পরীক্ষা নির্বাচন করুন</label>
                <select 
                  className="glass-input w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-bold appearance-none cursor-pointer"
                  value={exam}
                  onChange={e => setExam(e.target.value)}
                >
                  <option value="">পরীক্ষা সিলেক্ট করুন</option>
                  <option value="annual-2024">বার্ষিক পরীক্ষা ২০২৪</option>
                  <option value="mid-2024">অর্ধ-বার্ষিক পরীক্ষা ২০২৪</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2 ml-1">মোবাইল নাম্বারের শেষ ৪ ডিজিট</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••"
                  maxLength={4}
                  className="glass-input w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans font-bold text-center tracking-[0.5em]"
                  value={verification}
                  onChange={e => setVerification(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="glass-button-primary w-full py-4 bg-brand-primary hover:bg-brand-mid text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "ফলাফল দেখুন"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="book-page bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-light)] p-8 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">{result.nameBn}</h2>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{result.nameEn}</p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-2xl">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">GPA</p>
                  <p className="text-2xl font-bold text-brand-primary">{result.gpa}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Status</p>
                  <p className="text-2xl font-bold text-emerald-600">{result.status}</p>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-light)]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[var(--bg-tertiary)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3 text-center">Total</th>
                      <th className="px-4 py-3 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--bg-tertiary)]">
                    {result.subjects.map((s: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm font-bold text-[var(--text-primary)]">{s.name}</td>
                        <td className="px-4 py-3 text-sm font-bold text-[var(--text-primary)] text-center">{s.total}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] text-brand-primary text-[10px] font-bold rounded-md">{s.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button onClick={() => setResult(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <span className="material-symbols-outlined">print</span> প্রিন্ট / ডাউনলোড করুন
            </button>
            <button onClick={() => setResult(null)} className="w-full py-2 text-[var(--text-muted)] font-bold text-sm">নতুন করে সার্চ করুন</button>
          </div>
        )}
      </main>
    </div>
  );
}
