"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

interface PaymentsProps {
  totalDue: number;
  invoices: {
    id: string;
    month: string;
    category: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'partial' | 'due' | 'overdue';
  }[];
}

export function PaymentsView({ totalDue, invoices }: PaymentsProps) {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState<'summary' | 'method' | 'success'>('summary');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  if (step === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/50 p-10 shadow-sm text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-bangla mb-2">পেমেন্ট সফল হয়েছে!</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-bangla">আপনার ফি পরিশোধ করা হয়েছে। এসএমএস এর মাধ্যমে কনফার্মেশন পাঠানো হয়েছে।</p>
        
        <div className="w-full max-w-sm bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Transaction ID</span>
            <span className="font-bold text-slate-700">BK20250510_982</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Amount Paid</span>
            <span className="font-bold text-slate-700">৳{totalDue}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Method</span>
            <span className="font-bold text-slate-700 uppercase">{selectedMethod}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <button onClick={() => setStep('summary')} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md">
            ফিরে যান
          </button>
          <button className="flex-1 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Current Due Card */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2 font-bangla">মোট বকেয়া ফি</p>
          <h1 className="text-5xl font-bold font-bricolage mb-6 tracking-tight">৳{totalDue}</h1>
          <div className="flex items-center gap-2 text-rose-100 text-xs font-bold bg-white/10 px-4 py-2 rounded-full w-fit">
            <span className="material-symbols-outlined text-[16px]">event</span>
            শেষ তারিখ: ১৫ মে, ২০২৫
          </div>
          <button 
            onClick={() => setStep('method')}
            className="mt-8 w-full py-4 bg-white text-rose-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {t('pay_now')}
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-all duration-500">
          <span className="material-symbols-outlined text-[160px]">payments</span>
        </div>
      </div>

      {step === 'method' && (
        <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-bold text-slate-900 font-bangla mb-6">পেমেন্ট মাধ্যম সিলেক্ট করুন</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { id: 'bkash', name: 'bKash', color: 'bg-[#E2136E]' },
              { id: 'nagad', name: 'Nagad', color: 'bg-[#F7941D]' },
              { id: 'rocket', name: 'Rocket', color: 'bg-[#8B318F]' },
              { id: 'card', name: 'Card', color: 'bg-indigo-600' },
            ].map(method => (
              <button 
                key={method.id}
                onClick={() => { setSelectedMethod(method.id); setStep('success'); }}
                className="p-6 border border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-200 hover:bg-slate-50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${method.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined">{method.id === 'card' ? 'credit_card' : 'account_balance_wallet'}</span>
                </div>
                <span className="font-bold text-slate-700 text-sm">{method.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('summary')} className="mt-8 text-slate-400 font-bold text-sm w-full text-center hover:text-slate-600 transition-colors">ফিরে যান</button>
        </div>
      )}

      {/* Invoice List */}
      <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-slate-900 font-bangla">ইনভয়েস লিস্ট</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Fee Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{inv.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{inv.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 font-bricolage">৳{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      inv.status === 'overdue' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

