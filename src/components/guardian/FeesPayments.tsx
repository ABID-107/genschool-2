import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

interface Invoice {
  id: string;
  monthEn: string;
  monthBn: string;
  categoryEn: string;
  categoryBn: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: 'due' | 'paid' | 'partial';
}

export function GuardianFeesPaymentsView() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'due' | 'history'>('due');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'method' | 'otp' | 'success'>('select');
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalDue = 2450;
  
  const invoices: Invoice[] = [
    { id: 'inv-1', monthEn: 'May 2025', monthBn: 'মে ২০২৫', categoryEn: 'Tuition Fee', categoryBn: 'বেতন', amount: 1500, paid: 0, dueDate: 'May 15, 2025', status: 'due' },
    { id: 'inv-2', monthEn: 'May 2025', monthBn: 'মে ২০২৫', categoryEn: 'Exam Fee', categoryBn: 'পরীক্ষার ফি', amount: 950, paid: 0, dueDate: 'May 15, 2025', status: 'due' },
    { id: 'inv-3', monthEn: 'April 2025', monthBn: 'এপ্রিল ২০২৫', categoryEn: 'Tuition Fee', categoryBn: 'বেতন', amount: 1500, paid: 1500, dueDate: 'Apr 15, 2025', status: 'paid' },
    { id: 'inv-4', monthEn: 'March 2025', monthBn: 'মার্চ ২০২৫', categoryEn: 'Tuition + Transport', categoryBn: 'বেতন + যাতায়াত', amount: 2000, paid: 1000, dueDate: 'Mar 15, 2025', status: 'partial' },
  ];

  const dueInvoices = invoices.filter(inv => inv.status !== 'paid');
  const historyInvoices = invoices.filter(inv => inv.status === 'paid' || inv.status === 'partial');

  const handlePaymentSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Total Due Widget */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left w-full md:w-auto">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{lang === 'bn' ? 'মোট বকেয়া' : 'Total Due Amount'}</p>
            <h2 className="text-4xl md:text-5xl font-black text-rose-600 mt-2 mb-1">৳{totalDue}</h2>
            <p className="text-sm font-semibold text-rose-500">{lang === 'bn' ? 'সর্বশেষ জমার তারিখ: ১৫ মে, ২০২৫' : 'Due by: May 15, 2025'}</p>
          </div>
          
          <button 
            onClick={() => { setSelectedInvoice('all'); setPaymentStep('method'); }}
            className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">payments</span>
            {lang === 'bn' ? 'সব বকেয়া পরিশোধ করুন' : 'Pay Full Amount'}
          </button>
        </div>
      </div>

      {/* Payment Flow Modal Overlay */}
      {paymentStep !== 'select' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900">
                {paymentStep === 'method' && (lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method')}
                {paymentStep === 'otp' && (lang === 'bn' ? 'ভেরিফিকেশন' : 'Verification')}
                {paymentStep === 'success' && (lang === 'bn' ? 'সফল হয়েছে' : 'Payment Successful')}
              </h3>
              {paymentStep !== 'success' && (
                <button onClick={() => setPaymentStep('select')} className="p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>

            <div className="p-6">
              {paymentStep === 'method' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-sm text-slate-500">{lang === 'bn' ? 'পরিশোধের পরিমাণ' : 'Amount to Pay'}</p>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">৳{selectedInvoice === 'all' ? totalDue : dueInvoices.find(i => i.id === selectedInvoice)?.amount}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-2xl hover:border-pink-500 hover:bg-pink-50 transition-all">
                      <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">bKash</div>
                    </button>
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">Nagad</div>
                    </button>
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all">
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">Rocket</div>
                    </button>
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">Card</div>
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'otp' && (
                <div className="space-y-6 text-center">
                  <p className="text-sm text-slate-500 font-medium">
                    {lang === 'bn' ? 'আপনার মোবাইল নাম্বারে পাঠানো ওটিপি (OTP) দিন' : 'Enter the OTP sent to your mobile number'}
                  </p>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    placeholder="• • • •"
                    className="w-full text-center text-3xl font-bold tracking-[1em] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    onClick={handlePaymentSubmit}
                    disabled={otp.length !== 4 || isProcessing}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center"
                  >
                    {isProcessing ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : (lang === 'bn' ? 'নিশ্চিত করুন' : 'Confirm Payment')}
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{lang === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}</h3>
                    <p className="text-slate-500 mt-2">{lang === 'bn' ? 'আপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে।' : 'Your payment has been received successfully.'}</p>
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <button className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">download</span>
                      {lang === 'bn' ? 'রসিদ ডাউনলোড' : 'Download Receipt'}
                    </button>
                    <button onClick={() => setPaymentStep('select')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                      {lang === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 border border-slate-200 w-full md:w-max mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('due')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'due' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {lang === 'bn' ? 'বকেয়া ফি' : 'Due Fees'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'history' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {lang === 'bn' ? 'পেমেন্ট হিস্ট্রি' : 'Payment History'}
        </button>
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {(activeTab === 'due' ? dueInvoices : historyInvoices).map(invoice => (
          <div key={invoice.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="flex items-start gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-600' : 
                  invoice.status === 'partial' ? 'bg-amber-100 text-amber-600' : 
                  'bg-rose-100 text-rose-600'
                }`}>
                  <span className="material-symbols-outlined">
                    {invoice.status === 'paid' ? 'check_circle' : invoice.status === 'partial' ? 'incomplete_circle' : 'error'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{lang === 'bn' ? invoice.categoryBn : invoice.categoryEn}</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{lang === 'bn' ? invoice.monthBn : invoice.monthEn} • Due: {invoice.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase">{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</div>
                  <div className="text-xl font-bold text-slate-900">৳{invoice.amount}</div>
                  {invoice.status === 'partial' && (
                    <div className="text-xs font-bold text-amber-600">{lang === 'bn' ? `পরিশোধিত: ৳${invoice.paid}` : `Paid: ৳${invoice.paid}`}</div>
                  )}
                </div>
                
                {invoice.status !== 'paid' ? (
                  <button 
                    onClick={() => { setSelectedInvoice(invoice.id); setPaymentStep('method'); }}
                    className="px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition-colors border border-rose-200"
                  >
                    {lang === 'bn' ? 'পরিশোধ করুন' : 'Pay Now'}
                  </button>
                ) : (
                  <button className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-colors border border-slate-200 flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    {lang === 'bn' ? 'রসিদ' : 'Receipt'}
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

