import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Wallet, CreditCard, X, CheckCircle, Loader, Download, AlertCircle, MinusCircle, ChevronDown } from "lucide-react";

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
      <div className="bg-[var(--bg-tertiary)] rounded-3xl p-6 md:p-8 border border-[var(--border-color)] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Wallet size={120} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left w-full md:w-auto">
            <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">{lang === 'bn' ? 'মোট বকেয়া' : 'Total Due Amount'}</p>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-error)] mt-2 mb-1">৳{totalDue}</h2>
            <p className="text-sm font-semibold text-[var(--color-error)]">{lang === 'bn' ? 'সর্বশেষ জমার তারিখ: ১৫ মে, ২০২৫' : 'Due by: May 15, 2025'}</p>
          </div>
          
          <button 
            onClick={() => { setSelectedInvoice('all'); setPaymentStep('method'); }}
            className="w-full md:w-auto bg-[var(--color-error)] hover:brightness-90 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[var(--color-error-bg)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Wallet size={20} />
            {lang === 'bn' ? 'সব বকেয়া পরিশোধ করুন' : 'Pay Full Amount'}
          </button>
        </div>
      </div>

      {/* Payment Flow Modal Overlay */}
      {paymentStep !== 'select' && (
        <div className="fixed inset-0 bg-[var(--text-primary)]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--bg-tertiary)] rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="p-4 border-b border-[var(--border-light)] flex justify-between items-center bg-[var(--bg-secondary)]">
              <h3 className="font-bold text-[var(--text-primary)]">
                {paymentStep === 'method' && (lang === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method')}
                {paymentStep === 'otp' && (lang === 'bn' ? 'ভেরিফিকেশন' : 'Verification')}
                {paymentStep === 'success' && (lang === 'bn' ? 'সফল হয়েছে' : 'Payment Successful')}
              </h3>
              {paymentStep !== 'success' && (
                <button onClick={() => setPaymentStep('select')} className="p-2 text-[var(--text-dim)] hover:text-[var(--color-error)] rounded-full hover:bg-[var(--color-error-bg)] transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="p-6">
              {paymentStep === 'method' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-sm text-[var(--text-muted)]">{lang === 'bn' ? 'পরিশোধের পরিমাণ' : 'Amount to Pay'}</p>
                    <h3 className="text-3xl font-black text-[var(--text-primary)] mt-1">৳{selectedInvoice === 'all' ? totalDue : dueInvoices.find(i => i.id === selectedInvoice)?.amount}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-[var(--border-color)] rounded-2xl hover:border-[var(--color-info)] hover:bg-[var(--color-info-bg)] transition-all">
                      <div className="w-12 h-12 bg-[var(--color-info-bg)] text-[var(--color-info)] rounded-full flex items-center justify-center font-bold">bKash</div>
                    </button>
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-[var(--border-color)] rounded-2xl hover:border-[var(--color-warning)] hover:bg-[var(--color-warning-bg)] transition-all">
                      <div className="w-12 h-12 bg-[var(--color-warning-bg)] text-[var(--color-warning)] rounded-full flex items-center justify-center font-bold">Nagad</div>
                    </button>
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-[var(--border-color)] rounded-2xl hover:border-[var(--color-info)] hover:bg-[var(--color-info-bg)] transition-all">
                      <div className="w-12 h-12 bg-[var(--color-info-bg)] text-[var(--color-info)] rounded-full flex items-center justify-center font-bold">Rocket</div>
                    </button>
                    <button onClick={() => setPaymentStep('otp')} className="flex flex-col items-center gap-2 p-4 border border-[var(--border-color)] rounded-2xl hover:border-[var(--brand-primary)] hover:bg-[var(--color-success-bg)] transition-all">
                      <div className="w-12 h-12 bg-[var(--color-success-bg)] text-[var(--brand-primary)] rounded-full flex items-center justify-center font-bold">Card</div>
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'otp' && (
                <div className="space-y-6 text-center">
                  <p className="text-sm text-[var(--text-muted)] font-medium">
                    {lang === 'bn' ? 'আপনার মোবাইল নাম্বারে পাঠানো ওটিপি (OTP) দিন' : 'Enter the OTP sent to your mobile number'}
                  </p>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={4}
                    placeholder="• • • •"
                    className="w-full text-center text-3xl font-bold tracking-[1em] p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                  <button 
                    onClick={handlePaymentSubmit}
                    disabled={otp.length !== 4 || isProcessing}
                    className="w-full py-4 bg-[var(--brand-primary)] text-white rounded-2xl font-bold hover:brightness-90 disabled:opacity-50 transition-all flex items-center justify-center"
                  >
                    {isProcessing ? <Loader size={20} className="animate-spin" /> : (lang === 'bn' ? 'নিশ্চিত করুন' : 'Confirm Payment')}
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-[var(--color-success-bg)] text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={36} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)]">{lang === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}</h3>
                    <p className="text-[var(--text-muted)] mt-2">{lang === 'bn' ? 'আপনার পেমেন্ট সফলভাবে গৃহীত হয়েছে।' : 'Your payment has been received successfully.'}</p>
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <button className="w-full py-4 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-2xl font-bold hover:bg-[var(--border-color)] transition-all flex items-center justify-center gap-2">
                      <Download size={20} />
                      {lang === 'bn' ? 'রসিদ ডাউনলোড' : 'Download Receipt'}
                    </button>
                    <button onClick={() => setPaymentStep('select')} className="w-full py-4 bg-[var(--brand-primary)] text-white rounded-2xl font-bold hover:brightness-90 transition-all">
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
      <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 border border-[var(--border-color)] w-full md:w-max mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab('due')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'due' ? 'bg-[var(--color-success-bg)] text-[var(--brand-mid)] shadow-sm border border-[var(--color-success-bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'bn' ? 'বকেয়া ফি' : 'Due Fees'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'history' ? 'bg-[var(--color-success-bg)] text-[var(--brand-mid)] shadow-sm border border-[var(--color-success-bg)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {lang === 'bn' ? 'পেমেন্ট হিস্ট্রি' : 'Payment History'}
        </button>
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {(activeTab === 'due' ? dueInvoices : historyInvoices).map(invoice => (
          <div key={invoice.id} className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="flex items-start gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  invoice.status === 'paid' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 
                  invoice.status === 'partial' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' : 
                  'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                }`}>
                  {invoice.status === 'paid' ? <CheckCircle size={20} /> : invoice.status === 'partial' ? <MinusCircle size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{lang === 'bn' ? invoice.categoryBn : invoice.categoryEn}</h4>
                  <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">{lang === 'bn' ? invoice.monthBn : invoice.monthEn} • Due: {invoice.dueDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8 border-t border-[var(--border-light)] md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <div className="text-xs font-bold text-[var(--text-dim)] uppercase">{lang === 'bn' ? 'পরিমাণ' : 'Amount'}</div>
                  <div className="text-xl font-bold text-[var(--text-primary)]">৳{invoice.amount}</div>
                  {invoice.status === 'partial' && (
                    <div className="text-xs font-bold text-[var(--color-warning)]">{lang === 'bn' ? `পরিশোধিত: ৳${invoice.paid}` : `Paid: ৳${invoice.paid}`}</div>
                  )}
                </div>
                
                {invoice.status !== 'paid' ? (
                  <button 
                    onClick={() => { setSelectedInvoice(invoice.id); setPaymentStep('method'); }}
                    className="px-6 py-2.5 bg-[var(--color-error-bg)] hover:bg-[var(--color-error-bg)] text-[var(--color-error)] font-bold rounded-xl transition-colors border border-[var(--color-error-bg)]"
                  >
                    {lang === 'bn' ? 'পরিশোধ করুন' : 'Pay Now'}
                  </button>
                ) : (
                  <button className="px-4 py-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-bold rounded-xl transition-colors border border-[var(--border-color)] flex items-center gap-2 text-sm">
                    <Download size={18} />
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
