"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { CheckCircle, Calendar, Wallet, CreditCard, Download } from "lucide-react";

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
      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-10 shadow-sm text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[var(--color-success)]/20">
          <CheckCircle size={36} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-bangla mb-2">পেমেন্ট সফল হয়েছে!</h2>
        <p className="text-[var(--text-muted)] text-sm max-w-xs mx-auto mb-8 font-bangla">আপনার ফি পরিশোধ করা হয়েছে। এসএমএস এর মাধ্যমে কনফার্মেশন পাঠানো হয়েছে।</p>
        
        <div className="w-full max-w-sm bg-[var(--bg-secondary)] rounded-2xl p-6 mb-8 text-left space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">Transaction ID</span>
            <span className="font-bold text-[var(--text-secondary)]">BK20250510_982</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">Amount Paid</span>
            <span className="font-bold text-[var(--text-secondary)]">৳{totalDue}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)] font-bold uppercase tracking-wider">Method</span>
            <span className="font-bold text-[var(--text-secondary)] uppercase">{selectedMethod}</span>
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <button onClick={() => setStep('summary')} className="flex-1 py-3 bg-[var(--brand-primary)] text-white rounded-xl font-bold shadow-md">
            ফিরে যান
          </button>
          <button className="flex-1 py-3 border-2 border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl font-bold flex items-center justify-center gap-2">
            <Download size={18} /> Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Current Due Card */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-8 text-white shadow-xl shadow-[var(--color-error)]/20 relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2 font-bangla">মোট বকেয়া ফি</p>
          <h1 className="text-5xl font-bold font-heading mb-6 tracking-tight">৳{totalDue}</h1>
          <div className="flex items-center gap-2 text-rose-100 text-xs font-bold bg-[var(--bg-tertiary)] px-4 py-2 rounded-full w-fit">
            <Calendar size={16} />
            শেষ তারিখ: ১৫ মে, ২০২৫
          </div>
          <button 
            onClick={() => setStep('method')}
            className="mt-8 w-full py-4 bg-[var(--bg-tertiary)] text-[var(--color-error)] rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {t('pay_now')}
          </button>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-all duration-500">
          <Wallet size={160} />
        </div>
      </div>

      {step === 'method' && (
        <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-6 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="font-bold text-[var(--text-primary)] font-bangla mb-6">পেমেন্ট মাধ্যম সিলেক্ট করুন</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { id: 'bkash', name: 'bKash', color: 'bg-[#E2136E]' },
              { id: 'nagad', name: 'Nagad', color: 'bg-[#F7941D]' },
              { id: 'rocket', name: 'Rocket', color: 'bg-[#8B318F]' },
              { id: 'card', name: 'Card', color: 'bg-[var(--brand-primary)]' },
            ].map(method => (
              <button 
                key={method.id}
                onClick={() => { setSelectedMethod(method.id); setStep('success'); }}
                className="p-6 border border-[var(--border-light)] rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-[var(--green-200)] hover:bg-[var(--bg-secondary)] transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${method.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  {method.id === 'card' ? <CreditCard size={24} /> : <Wallet size={24} />}
                </div>
                <span className="font-bold text-[var(--text-secondary)] text-sm">{method.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep('summary')} className="mt-8 text-[var(--text-muted)] font-bold text-sm w-full text-center hover:text-[var(--text-secondary)] transition-colors">ফিরে যান</button>
        </div>
      )}

      {/* Invoice List */}
      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-[var(--text-primary)] font-bangla">ইনভয়েস লিস্ট</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--bg-secondary)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Fee Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">{inv.month}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">{inv.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)] font-heading">৳{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      inv.status === 'paid' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/20' :
                      inv.status === 'overdue' ? 'bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error)]/20 animate-pulse' :
                      'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning)]/20'
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

