'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ReceiptText, TrendingUp, TrendingDown, Download, Plus, Search,
  CheckCircle2, Clock, X, Save, Loader2, Pencil, Trash2, Eye, Ban, Undo2,
  ListFilter, Printer, ArrowUpDown, CreditCard, Banknote, PiggyBank,
  FileText, AlertTriangle, ChevronDown
} from 'lucide-react';
import {
  getFeeStructures, createFeeStructure, updateFeeStructure, deleteFeeStructure,
  getInvoices, createInvoice, updateInvoice, deleteInvoice, markInvoiceRefunded,
  getPayments, receivePayment, updatePayment, cancelPayment, refundPayment,
  getExpenseCategories, getExpenses, createExpense, updateExpense, deleteExpense,
  getDiscounts, createDiscount, getDueInvoices,
  getDateRangeCollections, getMonthlySummary, getProfitLoss, exportToCSV, generateInvoiceNumber,
  validateExpense, getSalaryDisbursements,
  type FeeStructure, type FeeStructureItem, type Invoice, type Payment,
  type Expense, type ExpenseCategory, type PaymentStatus, type FeeCategory,
} from '@/lib/financeStore';

interface StudentRecord { id: string; name: string; class: string; section: string; roll: string; }

function loadStudents(): StudentRecord[] {
  try { const s = localStorage.getItem('students'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}
function loadClasses(): { id: number; name: string }[] {
  try { const s = localStorage.getItem('academic_classes'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

const FEE_CATEGORIES: { value: FeeCategory; label: string }[] = [
  { value: 'admission', label: 'Admission Fee' },
  { value: 'tuition', label: 'Monthly Tuition' },
  { value: 'exam', label: 'Exam Fee' },
  { value: 'registration', label: 'Registration Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'laboratory', label: 'Laboratory Fee' },
  { value: 'development', label: 'Development Fee' },
  { value: 'custom', label: 'Custom Fee' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'mobile-banking', label: 'Mobile Banking' },
  { value: 'card', label: 'Card' },
  { value: 'cheque', label: 'Cheque' },
];

const TABS = [
  { id: 'invoices', label: 'Invoices', icon: ReceiptText },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'structures', label: 'Fee Structures', icon: PiggyBank },
  { id: 'expenses', label: 'Expenses', icon: Banknote },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function FinanceManagementPage() {
  const [activeTab, setActiveTab] = useState('invoices');

  // Data
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInvoices());
  const [payments, setPayments] = useState<Payment[]>(() => getPayments());
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(() => getFeeStructures());
  const [expenses, setExpenses] = useState<Expense[]>(() => getExpenses());
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);

  useEffect(() => { setStudents(loadStudents()); }, []);
  useEffect(() => { setClasses(loadClasses()); }, []);
  useEffect(() => { setDiscounts(getDiscounts()); }, []);

  const refreshInvoices = () => { setInvoices(getInvoices()); };
  const refreshPayments = () => { setPayments(getPayments()); };

  // Search / filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ── Invoice Modal ──
  const [invModal, setInvModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<Invoice> }>({ open: false, mode: 'create', data: {} });
  const [invSaving, setInvSaving] = useState(false);

  const openCreateInvoice = () => {
    setInvModal({ open: true, mode: 'create', data: { studentId: '', studentName: '', className: '', section: '', items: [], totalAmount: 0, paidAmount: 0, dueDate: '', issueDate: new Date().toISOString().split('T')[0], discount: 0, fine: 0, notes: '', feeStructureId: '' } });
  };
  const closeInvModal = () => setInvModal(p => ({ ...p, open: false }));

  const handleCreateInvoice = () => {
    const d = invModal.data;
    if (!d.studentId) return alert('Select a student.');
    if (!d.items?.length) return alert('Add at least one fee item.');
    if (!d.dueDate) return alert('Set a due date.');
    setInvSaving(true);
    setTimeout(() => {
      const total = (d.items || []).reduce((s, i) => s + i.amount, 0);
      const fine = d.fine || 0;
      const discount = d.discount || 0;
      const invoice = createInvoice({
        studentId: d.studentId!, studentName: d.studentName!, className: d.className!, section: d.section!,
        feeStructureId: d.feeStructureId || '',
        items: d.items!, totalAmount: total, dueDate: d.dueDate!, issueDate: d.issueDate || new Date().toISOString().split('T')[0],
        discount, discountReason: d.discountReason || '',
        fine, fineReason: d.fineReason || '',
        notes: d.notes || '', paidAmount: 0, dueAmount: total, status: 'unpaid',
      });
      refreshInvoices();
      setInvSaving(false);
      closeInvModal();
    }, 300);
  };

  const handleDeleteInvoice = (id: string) => {
    if (deleteInvoice(id)) refreshInvoices();
    else alert('Cannot delete: payments exist for this invoice.');
  };

  const handleRefundInvoice = (id: string) => {
    if (confirm('Mark this invoice as refunded?')) {
      markInvoiceRefunded(id);
      refreshInvoices();
    }
  };

  // ── Payment Modal ──
  const [payModal, setPayModal] = useState<{ open: boolean; invoice: Invoice | null; data: Partial<Payment> }>({ open: false, invoice: null, data: {} });
  const [paySaving, setPaySaving] = useState(false);

  const openReceivePayment = (invoice: Invoice) => {
    setPayModal({ open: true, invoice, data: { invoiceId: invoice.id, studentId: invoice.studentId, studentName: invoice.studentName, amount: invoice.dueAmount, method: 'cash', reference: '', note: '', status: 'completed', receivedBy: 'Admin', paymentDate: new Date().toISOString().split('T')[0] } });
  };
  const closePayModal = () => setPayModal(p => ({ ...p, open: false }));

  const handleReceivePayment = () => {
    const d = payModal.data;
    if (!d.amount || d.amount <= 0) return alert('Amount must be greater than zero.');
    setPaySaving(true);
    setTimeout(() => {
      receivePayment({
        invoiceId: d.invoiceId!, studentId: d.studentId!, studentName: d.studentName!,
        amount: d.amount!, method: d.method! as any, reference: d.reference || '', note: d.note || '',
        status: 'completed', receivedBy: d.receivedBy || 'Admin', paymentDate: d.paymentDate || new Date().toISOString().split('T')[0],
      });
      refreshPayments();
      refreshInvoices();
      setPaySaving(false);
      closePayModal();
    }, 300);
  };

  // ── Fee Structure Modal ──
  const [fsModal, setFsModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<FeeStructure> }>({ open: false, mode: 'create', data: {} });
  const [fsSaving, setFsSaving] = useState(false);

  const openFSModal = (mode: 'create' | 'edit', data?: FeeStructure) => {
    if (mode === 'create') {
      setFsModal({ open: true, mode, data: { name: '', classIds: [], sectionIds: [], items: [{ category: 'tuition', label: '', amount: 0, isOptional: false }], frequency: 'monthly', isActive: true } });
    } else if (data) {
      setFsModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeFSModal = () => setFsModal(p => ({ ...p, open: false }));

  const handleFSItemChange = (idx: number, field: keyof FeeStructureItem, value: any) => {
    setFsModal(prev => {
      const items = [...(prev.data.items || [])];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, data: { ...prev.data, items } };
    });
  };
  const addFSItem = () => {
    setFsModal(prev => ({ ...prev, data: { ...prev.data, items: [...(prev.data.items || []), { category: 'custom', label: '', amount: 0, isOptional: false }] } }));
  };
  const removeFSItem = (idx: number) => {
    setFsModal(prev => ({ ...prev, data: { ...prev.data, items: (prev.data.items || []).filter((_, i) => i !== idx) } }));
  };

  const handleSaveFS = () => {
    const d = fsModal.data;
    if (!d.name?.trim()) return alert('Fee structure name is required.');
    if (!d.classIds?.length) return alert('Select at least one class.');
    if (!d.items?.length || d.items.some(i => !i.label || i.amount <= 0)) return alert('All fee items must have a label and amount.');
    setFsSaving(true);
    setTimeout(() => {
      const d2 = fsModal.data;
      if (fsModal.mode === 'create') {
        const created = createFeeStructure({ name: d2.name!, classIds: d2.classIds!, sectionIds: d2.sectionIds || [], items: d2.items!, frequency: d2.frequency!, isActive: true });
        setFeeStructures(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateFeeStructure(d2.id, d2);
        if (updated) setFeeStructures(prev => prev.map(f => f.id === d2.id ? updated : f));
      }
      setFsSaving(false);
      closeFSModal();
    }, 300);
  };

  // ── Expense Modal ──
  const [expModal, setExpModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data: Partial<Expense> }>({ open: false, mode: 'add', data: {} });
  const [expSaving, setExpSaving] = useState(false);
  const [expCategories, setExpCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => { setExpCategories(getExpenseCategories()); }, []);

  const openExpModal = (mode: 'add' | 'edit', data?: Expense) => {
    if (mode === 'add') {
      setExpModal({ open: true, mode, data: { categoryId: expCategories[0]?.id || '', categoryName: expCategories[0]?.name || '', title: '', description: '', amount: 0, paymentMethod: 'cash', paidTo: '', receipt: '', expenseDate: new Date().toISOString().split('T')[0], createdBy: 'Admin' } });
    } else if (data) {
      setExpModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeExpModal = () => setExpModal(p => ({ ...p, open: false }));

  const handleSaveExpense = () => {
    const d = expModal.data;
    const errors = validateExpense(d);
    if (errors.length) return alert(errors.join('\n'));
    setExpSaving(true);
    setTimeout(() => {
      const d2 = expModal.data;
      const cat = expCategories.find(c => c.id === d2.categoryId);
      if (expModal.mode === 'add') {
        const created = createExpense({ ...d2 as any, categoryName: cat?.name || '' });
        setExpenses(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateExpense(d2.id, { ...d2, categoryName: cat?.name || '' });
        if (updated) setExpenses(prev => prev.map(e => e.id === d2.id ? updated : e));
      }
      setExpSaving(false);
      closeExpModal();
    }, 300);
  };

  // ── Reports ──
  const [reportDateRange, setReportDateRange] = useState({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'profit-loss' | 'due'>('monthly');

  const reportData = useMemo(() => {
    switch (reportType) {
      case 'monthly': {
        const now = new Date();
        return getMonthlySummary(now.getFullYear(), now.getMonth() + 1);
      }
      case 'profit-loss':
        return getProfitLoss(reportDateRange.start, reportDateRange.end);
      case 'due':
        return getDueInvoices();
      default:
        return null;
    }
  }, [reportType, reportDateRange, payments, invoices, expenses]);

  // ── Filtered Data ──
  const filteredInvoices = useMemo(() => {
    let list = [...invoices];
    const q = searchTerm.toLowerCase();
    if (q) list = list.filter(i => i.id.toLowerCase().includes(q) || i.studentName.toLowerCase().includes(q));
    if (statusFilter) list = list.filter(i => i.status === statusFilter);
    return list;
  }, [invoices, searchTerm, statusFilter]);

  // KPI calculations
  const kpiData = useMemo(() => {
    const now = new Date();
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyPayments = payments.filter(p => p.status === 'completed' && p.paymentDate.startsWith(monthStr));
    const totalRevenue = monthlyPayments.reduce((s, p) => s + p.amount, 0);
    const totalDues = invoices.filter(i => i.status === 'unpaid' || i.status === 'partial').reduce((s, i) => s + i.dueAmount, 0);
    const monthlyExpenses = expenses.filter(e => e.expenseDate.startsWith(monthStr)).reduce((s, e) => s + e.amount, 0);
    const netBalance = totalRevenue - monthlyExpenses;
    return { totalRevenue, totalDues, monthlyExpenses, netBalance };
  }, [payments, invoices, expenses]);

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; border: string; icon: any }> = {
      paid: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: CheckCircle2 },
      unpaid: { bg: 'bg-[var(--color-error-bg)]', text: 'text-[var(--color-error)]', border: 'border-[var(--color-error)]/20', icon: Clock },
      partial: { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', border: 'border-[var(--color-warning)]/20', icon: Clock },
      overpaid: { bg: 'bg-[var(--color-info-bg)]', text: 'text-[var(--color-info)]', border: 'border-[var(--color-info)]/20', icon: TrendingUp },
      refunded: { bg: 'bg-[var(--bg-tertiary)]', text: 'text-[var(--text-secondary)]', border: 'border-[var(--border-light)]', icon: Undo2 },
      completed: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: CheckCircle2 },
      pending: { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', border: 'border-[var(--color-warning)]/20', icon: Clock },
      cancelled: { bg: 'bg-[var(--color-error-bg)]', text: 'text-[var(--color-error)]', border: 'border-[var(--color-error)]/20', icon: Ban },
    };
    const s = map[status.toLowerCase()] || map.unpaid;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
        <s.icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // ── Export ──
  const handleExport = (type: string) => {
    if (type === 'invoices') {
      exportToCSV(
        ['Invoice ID', 'Student', 'Class', 'Total', 'Paid', 'Due', 'Status', 'Due Date'],
        filteredInvoices.map(i => [i.id, i.studentName, i.className, String(i.totalAmount), String(i.paidAmount), String(i.dueAmount), i.status, i.dueDate]),
        `invoices-${new Date().toISOString().split('T')[0]}.csv`
      );
    } else if (type === 'payments') {
      exportToCSV(
        ['Payment ID', 'Invoice ID', 'Student', 'Amount', 'Method', 'Status', 'Date'],
        payments.map(p => [p.id, p.invoiceId, p.studentName, String(p.amount), p.method, p.status, p.paymentDate]),
        `payments-${new Date().toISOString().split('T')[0]}.csv`
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Finance & Fee Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage fee structures, invoices, payments, expenses, and financial reports.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'invoices' && (
            <>
              <button onClick={() => handleExport('invoices')} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                <Download size={16} /> Export
              </button>
              <button onClick={openCreateInvoice} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
                <Plus size={16} /> Create Invoice
              </button>
            </>
          )}
          {activeTab === 'payments' && (
            <button onClick={() => handleExport('payments')} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          )}
          {activeTab === 'structures' && (
            <button onClick={() => openFSModal('create')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
              <Plus size={16} /> Add Structure
            </button>
          )}
          {activeTab === 'expenses' && (
            <button onClick={() => openExpModal('add')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
              <Plus size={16} /> Add Expense
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--brand-primary)] transform group-hover:scale-110 transition-transform"><Wallet size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Total Revenue (MTD)</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 relative z-10">৳ {kpiData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500 transform group-hover:scale-110 transition-transform"><TrendingDown size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Pending Dues</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 relative z-10">৳ {kpiData.totalDues.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500 transform group-hover:scale-110 transition-transform"><TrendingDown size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Total Expenses (MTD)</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 relative z-10">৳ {kpiData.monthlyExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500 transform group-hover:scale-110 transition-transform"><PiggyBank size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Net Balance</p>
          <p className={`text-2xl font-bold mt-1 relative z-10 ${kpiData.netBalance >= 0 ? 'text-[var(--text-primary)]' : 'text-[var(--color-error)]'}`}>৳ {kpiData.netBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden glass-panel">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50 overflow-x-auto custom-scrollbar">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}`}>
              <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)]'} />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="financeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ── Invoices Tab ── */}
            {activeTab === 'invoices' && (
              <motion.div key="invoices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={18} /></div>
                    <input type="text" placeholder="Search by invoice ID or student..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-[var(--border-light)] rounded-xl leading-5 bg-[var(--bg-tertiary)] placeholder-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary sm:text-sm transition-all" />
                  </div>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full sm:w-40">
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="overpaid">Overpaid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                      <tr>
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">Invoice</th>
                        <th className="px-6 py-4 font-semibold">Student</th>
                        <th className="px-6 py-4 font-semibold">Total</th>
                        <th className="px-6 py-4 font-semibold">Paid</th>
                        <th className="px-6 py-4 font-semibold">Due</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {filteredInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--text-secondary)]">{inv.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[var(--text-primary)]">{inv.studentName}</div>
                            <div className="text-xs text-[var(--text-muted)] mt-0.5">{inv.className}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-[var(--text-primary)]">৳ {inv.totalAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-[var(--color-success)] font-medium">৳ {inv.paidAmount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={inv.dueAmount > 0 ? 'text-[var(--color-error)] font-medium' : 'text-[var(--text-muted)]'}>{inv.dueAmount > 0 ? `৳ ${inv.dueAmount.toLocaleString()}` : '—'}</span>
                          </td>
                          <td className="px-6 py-4">{statusBadge(inv.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              {inv.status !== 'refunded' && (
                                <button onClick={() => openReceivePayment(inv)} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-success)] hover:bg-[var(--color-success-bg)] rounded-lg transition-colors" title="Receive Payment"><CreditCard size={16} /></button>
                              )}
                              <button onClick={() => handleRefundInvoice(inv.id)} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-warning)] hover:bg-[var(--color-warning-bg)] rounded-lg transition-colors" title="Refund"><Undo2 size={16} /></button>
                              <button onClick={() => { if (confirm(`Delete invoice ${inv.id}?`)) handleDeleteInvoice(inv.id); }} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredInvoices.length === 0 && (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No invoices found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Payments Tab ── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                      <tr>
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">Payment ID</th>
                        <th className="px-6 py-4 font-semibold">Invoice</th>
                        <th className="px-6 py-4 font-semibold">Student</th>
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Method</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {payments.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No payments recorded yet. Receive payments from the Invoices tab.</td></tr>
                      ) : payments.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)).map(p => (
                        <tr key={p.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--text-secondary)]">{p.id}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{p.invoiceId}</td>
                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{p.studentName}</td>
                          <td className="px-6 py-4 font-bold text-[var(--text-primary)]">৳ {p.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)] capitalize">{p.method.replace('-', ' ')}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{statusBadge(p.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Fee Structures Tab ── */}
            {activeTab === 'structures' && (
              <motion.div key="structures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feeStructures.map(fs => (
                    <div key={fs.id} className={`p-5 rounded-2xl border shadow-sm transition-all ${fs.isActive ? 'bg-[var(--bg-secondary)] border-[var(--border-light)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-light)] opacity-70'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{fs.name}</h3>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{fs.id} &bull; {fs.frequency} &bull; {fs.classIds.length} class(es)</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => openFSModal('edit', fs)} className="p-1.5 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><Pencil size={15} /></button>
                          <button onClick={() => { if (confirm(`Delete ${fs.name}?`)) { deleteFeeStructure(fs.id); setFeeStructures(prev => prev.filter(f => f.id !== fs.id)); } }} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors"><Trash2 size={15} /></button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {fs.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">{item.label}</span>
                            <span className="font-medium text-[var(--text-primary)]">৳ {item.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-[var(--border-light)] flex justify-between text-sm font-semibold">
                        <span className="text-[var(--text-primary)]">Total</span>
                        <span className="text-[var(--text-primary)]">৳ {fs.items.reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {feeStructures.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-sm text-[var(--text-muted)]">No fee structures defined.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Expenses Tab ── */}
            {activeTab === 'expenses' && (
              <motion.div key="expenses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                      <tr>
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">Date</th>
                        <th className="px-6 py-4 font-semibold">Title</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Amount</th>
                        <th className="px-6 py-4 font-semibold">Payment Method</th>
                        <th className="px-6 py-4 font-semibold">Paid To</th>
                        <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {expenses.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No expenses recorded.</td></tr>
                      ) : expenses.sort((a, b) => b.expenseDate.localeCompare(a.expenseDate)).map(exp => (
                        <tr key={exp.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{exp.title}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-primary)]">{exp.categoryName}</span>
                          </td>
                          <td className="px-6 py-4 font-bold text-[var(--color-error)]">৳ {exp.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)] capitalize">{exp.paymentMethod.replace('-', ' ')}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{exp.paidTo}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openExpModal('edit', exp)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><Pencil size={16} /></button>
                              <button onClick={() => { if (confirm(`Delete expense "${exp.title}"?`)) { deleteExpense(exp.id); setExpenses(prev => prev.filter(e => e.id !== exp.id)); } }} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Reports Tab ── */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <select value={reportType} onChange={e => setReportType(e.target.value as any)}
                    className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-56">
                    <option value="monthly">Monthly Summary</option>
                    <option value="profit-loss">Profit & Loss</option>
                    <option value="due">Due List</option>
                  </select>
                  {reportType === 'profit-loss' && (
                    <div className="flex gap-3">
                      <input type="date" value={reportDateRange.start} onChange={e => setReportDateRange(p => ({ ...p, start: e.target.value }))}
                        className="px-4 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                      <input type="date" value={reportDateRange.end} onChange={e => setReportDateRange(p => ({ ...p, end: e.target.value }))}
                        className="px-4 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                  )}
                </div>

                {reportType === 'monthly' && reportData && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Collections</p>
                      <p className="text-xl font-bold text-[var(--color-success)] mt-1">৳ {(reportData as any).totalCollections?.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Expenses</p>
                      <p className="text-xl font-bold text-[var(--color-error)] mt-1">৳ {(reportData as any).totalExpenses?.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Net Income</p>
                      <p className={`text-xl font-bold mt-1 ${(reportData as any).netIncome >= 0 ? 'text-[var(--text-primary)]' : 'text-[var(--color-error)]'}`}>৳ {(reportData as any).netIncome?.toLocaleString() || 0}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Transactions</p>
                      <p className="text-xl font-bold text-[var(--text-primary)] mt-1">{(reportData as any).collectionCount || 0}</p>
                    </div>
                  </div>
                )}

                {reportType === 'profit-loss' && reportData && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <p className="text-sm text-[var(--text-muted)]">Total Revenue</p>
                        <p className="text-xl font-bold text-[var(--color-success)] mt-1">৳ {(reportData as any).totalRevenue?.toLocaleString() || 0}</p>
                      </div>
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <p className="text-sm text-[var(--text-muted)]">Total Expenses</p>
                        <p className="text-xl font-bold text-[var(--color-error)] mt-1">৳ {(reportData as any).totalExpenses?.toLocaleString() || 0}</p>
                      </div>
                      <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <p className="text-sm text-[var(--text-muted)]">Net Profit/Loss</p>
                        <p className={`text-xl font-bold mt-1 ${(reportData as any).netProfit >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                          ৳ {(reportData as any).netProfit?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Revenue by Category</h4>
                        {Object.entries((reportData as any).revenueByCategory || {}).length > 0 ? (
                          <div className="space-y-2">
                            {Object.entries((reportData as any).revenueByCategory).map(([cat, amt]) => (
                              <div key={cat} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">{cat}</span>
                                <span className="font-medium text-[var(--color-success)]">৳ {(amt as number).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-sm text-[var(--text-muted)]">No revenue data.</p>}
                      </div>
                      <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Expense by Category</h4>
                        {Object.entries((reportData as any).expenseByCategory || {}).length > 0 ? (
                          <div className="space-y-2">
                            {Object.entries((reportData as any).expenseByCategory).map(([cat, amt]) => (
                              <div key={cat} className="flex justify-between text-sm">
                                <span className="text-[var(--text-secondary)]">{cat}</span>
                                <span className="font-medium text-[var(--color-error)]">৳ {(amt as number).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-sm text-[var(--text-muted)]">No expense data.</p>}
                      </div>
                    </div>
                  </div>
                )}

                {reportType === 'due' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                        <tr>
                          <th className="px-6 py-4 font-semibold rounded-tl-xl">Student</th>
                          <th className="px-6 py-4 font-semibold">Invoice</th>
                          <th className="px-6 py-4 font-semibold">Total</th>
                          <th className="px-6 py-4 font-semibold">Paid</th>
                          <th className="px-6 py-4 font-semibold">Due</th>
                          <th className="px-6 py-4 font-semibold">Due Date</th>
                          <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)]">
                        {(reportData as Invoice[]).length === 0 ? (
                          <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No dues outstanding.</td></tr>
                        ) : (reportData as Invoice[]).map(inv => (
                          <tr key={inv.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{inv.studentName}</td>
                            <td className="px-6 py-4 text-[var(--text-secondary)]">{inv.id}</td>
                            <td className="px-6 py-4 font-medium">৳ {inv.totalAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-[var(--color-success)]">৳ {inv.paidAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 font-bold text-[var(--color-error)]">৳ {inv.dueAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(inv.dueDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">{statusBadge(inv.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Create Invoice Modal ── */}
      <AnimatePresence>
        {invModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closeInvModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)] z-10 rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Create Invoice</h3>
                <button onClick={closeInvModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Student <span className="text-rose-500">*</span></label>
                  <select value={invModal.data.studentId || ''} onChange={e => {
                    const s = students.find(st => st.id === e.target.value);
                    setInvModal(prev => ({ ...prev, data: { ...prev.data, studentId: e.target.value, studentName: s?.name || '', className: s?.class || '', section: s?.section || '' } }));
                  }} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                    <option value="">— Select —</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Issue Date</label><input type="date" value={invModal.data.issueDate || ''} onChange={e => setInvModal(p => ({ ...p, data: { ...p.data, issueDate: e.target.value } }))} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Due Date <span className="text-rose-500">*</span></label><input type="date" value={invModal.data.dueDate || ''} onChange={e => setInvModal(p => ({ ...p, data: { ...p.data, dueDate: e.target.value } }))} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                {/* Fee Items */}
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">Fee Items <span className="text-rose-500">*</span></label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {(invModal.data.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-[var(--bg-tertiary)] rounded-xl">
                        <select value={item.category} onChange={e => {
                          const items = [...(invModal.data.items || [])];
                          const cat = FEE_CATEGORIES.find(c => c.value === e.target.value);
                          items[idx] = { ...items[idx], category: e.target.value as FeeCategory, label: cat?.label || '' };
                          setInvModal(p => ({ ...p, data: { ...p.data, items } }));
                        }} className="flex-1 px-2 py-1 border border-[var(--border-light)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                          {FEE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        <input type="number" value={item.amount || ''} onChange={e => {
                          const items = [...(invModal.data.items || [])];
                          items[idx] = { ...items[idx], amount: Number(e.target.value) };
                          setInvModal(p => ({ ...p, data: { ...p.data, items, totalAmount: items.reduce((s, i) => s + i.amount, 0) } }));
                        }} placeholder="Amount" className="w-24 px-2 py-1 border border-[var(--border-light)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                        <button onClick={() => {
                          const items = (invModal.data.items || []).filter((_, i) => i !== idx);
                          setInvModal(p => ({ ...p, data: { ...p.data, items, totalAmount: items.reduce((s, i) => s + i.amount, 0) } }));
                        }} className="p-1 text-[var(--text-muted)] hover:text-[var(--color-error)]"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setInvModal(p => ({ ...p, data: { ...p.data, items: [...(p.data.items || []), { category: 'custom' as FeeCategory, label: 'Custom Fee', amount: 0, isOptional: false }] } }))}
                    className="mt-2 text-xs text-brand-primary hover:text-brand-mid font-medium flex items-center gap-1"><Plus size={12} /> Add Item</button>
                </div>
                <div className="flex justify-between text-sm font-semibold p-3 bg-[var(--bg-tertiary)] rounded-xl">
                  <span className="text-[var(--text-primary)]">Total Amount</span>
                  <span className="text-[var(--text-primary)]">৳ {((invModal.data.items || []).reduce((s, i) => s + i.amount, 0)).toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Discount</label><input type="number" value={invModal.data.discount || 0} onChange={e => setInvModal(p => ({ ...p, data: { ...p.data, discount: Number(e.target.value) } }))} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Fine/Late Fee</label><input type="number" value={invModal.data.fine || 0} onChange={e => setInvModal(p => ({ ...p, data: { ...p.data, fine: Number(e.target.value) } }))} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Notes</label><textarea value={invModal.data.notes || ''} onChange={e => setInvModal(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[60px]" /></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeInvModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleCreateInvoice} disabled={invSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${invSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {invSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Create Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Payment Modal ── */}
      <AnimatePresence>
        {payModal.open && payModal.invoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closePayModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-md z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Receive Payment</h3>
                <button onClick={closePayModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm bg-[var(--bg-tertiary)] rounded-xl p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Invoice:</span><span className="font-medium text-[var(--text-primary)]">{payModal.invoice.id}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Student:</span><span className="font-medium text-[var(--text-primary)]">{payModal.invoice.studentName}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Total Due:</span><span className="font-bold text-[var(--color-error)]">৳ {payModal.invoice.dueAmount.toLocaleString()}</span></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Amount <span className="text-rose-500">*</span></label>
                  <input type="number" value={payModal.data.amount || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, amount: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Method</label>
                    <select value={payModal.data.method || 'cash'} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, method: e.target.value as any } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                      {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Date</label>
                    <input type="date" value={payModal.data.paymentDate || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, paymentDate: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Reference (optional)</label>
                  <input type="text" value={payModal.data.reference || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, reference: e.target.value } }))}
                    placeholder="Cheque no, trx ID..." className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Note</label>
                  <textarea value={payModal.data.note || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, note: e.target.value } }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[60px]" /></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closePayModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleReceivePayment} disabled={paySaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${paySaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-[var(--color-success)] hover:bg-[var(--color-success)]/80 shadow-sm'}`}>
                  {paySaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Receive Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Fee Structure Modal ── */}
      <AnimatePresence>
        {fsModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closeFSModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)] z-10 rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">{fsModal.mode === 'create' ? 'Create' : 'Edit'} Fee Structure</h3>
                <button onClick={closeFSModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Structure Name <span className="text-rose-500">*</span></label>
                  <input type="text" value={fsModal.data.name || ''} onChange={e => setFsModal(p => ({ ...p, data: { ...p.data, name: e.target.value } }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Frequency</label>
                    <select value={fsModal.data.frequency || 'monthly'} onChange={e => setFsModal(p => ({ ...p, data: { ...p.data, frequency: e.target.value as any } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one-time">One Time</option>
                    </select></div>
                </div>
                {/* Applicable Classes */}
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">Applicable Classes <span className="text-rose-500">*</span></label>
                  <div className="max-h-32 overflow-y-auto border border-[var(--border-light)] rounded-xl p-2 space-y-0.5">
                    {classes.map(c => {
                      const checked = (fsModal.data.classIds || []).includes(c.id);
                      return (
                        <label key={c.id} className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${checked ? 'bg-[var(--bg-tertiary)] text-brand-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            const ids: number[] = fsModal.data.classIds || [];
                            setFsModal(p => ({ ...p, data: { ...p.data, classIds: checked ? ids.filter(id => id !== c.id) : [...ids, c.id] } }));
                          }} className="w-4 h-4 rounded border-[var(--border-light)] text-brand-primary focus:ring-brand-primary" />
                          {c.name}
                        </label>
                      );
                    })}
                  </div>
                </div>
                {/* Fee Items */}
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">Fee Items</label>
                  <div className="space-y-2">
                    {(fsModal.data.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-[var(--bg-tertiary)] rounded-xl">
                        <select value={item.category} onChange={e => handleFSItemChange(idx, 'category', e.target.value)}
                          className="flex-1 px-2 py-1 border border-[var(--border-light)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                          {FEE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                        <input type="number" value={item.amount || ''} onChange={e => handleFSItemChange(idx, 'amount', Number(e.target.value))}
                          placeholder="Amount" className="w-20 px-2 py-1 border border-[var(--border-light)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                        <button onClick={() => removeFSItem(idx)} className="p-1 text-[var(--text-muted)] hover:text-[var(--color-error)]"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addFSItem} className="mt-2 text-xs text-brand-primary hover:text-brand-mid font-medium flex items-center gap-1"><Plus size={12} /> Add Item</button>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeFSModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleSaveFS} disabled={fsSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${fsSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {fsSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {fsModal.mode === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Expense Modal ── */}
      <AnimatePresence>
        {expModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closeExpModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">{expModal.mode === 'add' ? 'Add' : 'Edit'} Expense</h3>
                <button onClick={closeExpModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Title <span className="text-rose-500">*</span></label>
                    <input type="text" value={expModal.data.title || ''} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, title: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Category <span className="text-rose-500">*</span></label>
                    <select value={expModal.data.categoryId || ''} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, categoryId: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                      {expCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Amount <span className="text-rose-500">*</span></label>
                    <input type="number" value={expModal.data.amount || ''} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, amount: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Payment Method</label>
                    <select value={expModal.data.paymentMethod || 'cash'} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, paymentMethod: e.target.value as any } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                      <option value="cash">Cash</option>
                      <option value="bank">Bank</option>
                      <option value="mobile-banking">Mobile Banking</option>
                    </select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Paid To <span className="text-rose-500">*</span></label>
                    <input type="text" value={expModal.data.paidTo || ''} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, paidTo: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Date <span className="text-rose-500">*</span></label>
                    <input type="date" value={expModal.data.expenseDate || ''} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, expenseDate: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Description</label>
                  <textarea value={expModal.data.description || ''} onChange={e => setExpModal(p => ({ ...p, data: { ...p.data, description: e.target.value } }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[60px]" /></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeExpModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleSaveExpense} disabled={expSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${expSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {expSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {expModal.mode === 'add' ? 'Add Expense' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
