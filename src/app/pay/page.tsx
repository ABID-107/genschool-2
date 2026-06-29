"use client";

import { useState } from "react";
import Link from "next/link";

export default function PublicPaymentPortal() {
  const [studentId, setStudentId] = useState("");
  const [step, setStep] = useState<'search' | 'verify' | 'payment'>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setStep('payment');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen font-bangla pb-20">
      <header className="glass-nav py-6 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">G</div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">আদর্শ উচ্চ বিদ্যালয়</h1>
          </Link>
          <div className="text-right">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Fee Portal</p>
            <p className="text-sm font-bold text-rose-600">অনলাইন পেমেন্ট</p>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4">
        {step === 'search' && (
          <div className="glass-card p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">ফি পরিশোধ করুন</h2>
            <p className="text-[var(--text-muted)] text-center text-sm mb-8">স্টুডেন্ট আইডি দিয়ে বকেয়া ফি চেক করুন</p>
            
            <form onSubmit={handleSearch} className="space-y-6">
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
                ) : "ফি চেক করুন"}
              </button>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div className="glass-card p-8 animate-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 text-center">ভেরিফিকেশন</h2>
            <p className="text-[var(--text-muted)] text-center text-sm mb-8 font-bangla">আপনার নিবন্ধিত মোবাইল নাম্বারে একটি ৪-সংখ্যার ওটিপি (OTP) পাঠানো হয়েছে</p>
            
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  required
                  maxLength={4}
                  placeholder="OTP"
                  className="glass-input w-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-2xl py-5 px-5 outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans font-bold text-center text-2xl tracking-[1em]"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="glass-button-primary w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
              >
                ভেরিফাই করুন
              </button>
            </form>
          </div>
        )}

        {step === 'payment' && (
          <div className="glass-card p-8 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <p className="text-sm font-bold text-[var(--text-muted)] uppercase">Alex Johnson • SMS-2025-0982</p>
              <h2 className="text-4xl font-bold text-[var(--text-primary)] mt-2 font-heading">৳২,৪৫০.০০</h2>
              <p className="text-xs font-bold text-rose-500 mt-1">মোট বকেয়া ফি</p>
            </div>

            <div className="space-y-4">
              <button className="w-full py-4 bg-[#E2136E] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                <span className="material-symbols-outlined">account_balance_wallet</span> bKash পেমেন্ট
              </button>
              <button className="w-full py-4 bg-[#F7941D] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                <span className="material-symbols-outlined">account_balance_wallet</span> Nagad পেমেন্ট
              </button>
            </div>

            <button onClick={() => setStep('search')} className="w-full py-2 text-[var(--text-muted)] font-bold text-sm mt-8">ক্যান্সেল করুন</button>
          </div>
        )}
      </main>
    </div>
  );
}
