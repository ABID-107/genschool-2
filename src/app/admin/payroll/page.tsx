'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote, FileText, Settings, Download, Plus, Search, CheckCircle2, Clock, X, Save, Loader2, Pencil, Trash2, Ban, CreditCard, Users, TrendingUp, UserCheck, AlertTriangle, DollarSign, Calendar
} from 'lucide-react';
import {
  getSalaryStructures, createSalaryStructure, updateSalaryStructure,
  getSalaryDisbursements, generateSalary, approveSalary, paySalary,
  exportToCSV, validateSalaryStructure,
  type SalaryStructure, type SalaryDisbursement, type SalaryType, type SalaryStatus,
} from '@/lib/financeStore';

interface EmployeeRecord {
  id: string;
  name: string;
  type: SalaryType;
  department: string;
  designation: string;
}

function loadEmployees(): EmployeeRecord[] {
  try {
    const s = localStorage.getItem('payroll_employees');
    if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; }
  } catch { }
  const defaults: EmployeeRecord[] = [
    { id: 'EMP-001', name: 'Dr. Sarah Rahman', type: 'teacher', department: 'Science', designation: 'Senior Teacher' },
    { id: 'EMP-002', name: 'Mr. Kamal Hossain', type: 'teacher', department: 'Mathematics', designation: 'Teacher' },
    { id: 'EMP-003', name: 'Ms. Farida Begum', type: 'teacher', department: 'English', designation: 'Teacher' },
    { id: 'EMP-004', name: 'Mr. Abdul Malek', type: 'staff', department: 'Administration', designation: 'Accountant' },
    { id: 'EMP-005', name: 'Mrs. Shahida Parvin', type: 'staff', department: 'Library', designation: 'Librarian' },
    { id: 'EMP-006', name: 'Mr. Rafiq Uddin', type: 'staff', department: 'Maintenance', designation: 'Caretaker' },
  ];
  localStorage.setItem('payroll_employees', JSON.stringify(defaults));
  return defaults;
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'mobile-banking', label: 'Mobile Banking' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TABS = [
  { id: 'structures', label: 'Salary Structures', icon: Settings },
  { id: 'disbursements', label: 'Payroll Processing', icon: DollarSign },
  { id: 'payments', label: 'Payment History', icon: CreditCard },
];

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    paid: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: CheckCircle2 },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
    approved: { bg: 'bg-[var(--bg-tertiary)]', text: 'text-brand-primary', border: 'border-[var(--border-light)]', icon: UserCheck },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Ban },
  };
  const s = map[status.toLowerCase()] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <s.icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function PayrollManagementPage() {
  const [activeTab, setActiveTab] = useState('structures');

  // Data
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>(() => getSalaryStructures());
  const [disbursements, setDisbursements] = useState<SalaryDisbursement[]>(() => getSalaryDisbursements());

  useEffect(() => { setEmployees(loadEmployees()); }, []);

  const refreshStructures = () => setSalaryStructures(getSalaryStructures());
  const refreshDisbursements = () => setDisbursements(getSalaryDisbursements());

  // ── Structure Modal ──
  const [structModal, setStructModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: Partial<SalaryStructure> }>({
    open: false, mode: 'create', data: {}
  });
  const [structSaving, setStructSaving] = useState(false);

  const openStructModal = (mode: 'create' | 'edit', data?: SalaryStructure) => {
    if (mode === 'create') {
      setStructModal({
        open: true, mode, data: {
          employeeId: '', employeeName: '', employeeType: 'teacher',
          baseSalary: 0, houseRent: 0, medical: 0, transport: 0, bonus: 0, deductions: 0,
          bankAccount: '', isActive: true,
        }
      });
    } else if (data) {
      setStructModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeStructModal = () => setStructModal(p => ({ ...p, open: false }));

  const handleSaveStructure = () => {
    const d = structModal.data;
    if (!d.employeeId) return alert('Select an employee.');
    if (!d.baseSalary || d.baseSalary <= 0) return alert('Base salary must be greater than zero.');
    setStructSaving(true);
    setTimeout(() => {
      const d2 = structModal.data;
      if (structModal.mode === 'create') {
        const created = createSalaryStructure({
          employeeId: d2.employeeId!, employeeName: d2.employeeName!, employeeType: d2.employeeType!,
          baseSalary: d2.baseSalary!, houseRent: d2.houseRent || 0, medical: d2.medical || 0,
          transport: d2.transport || 0, bonus: d2.bonus || 0, deductions: d2.deductions || 0,
          bankAccount: d2.bankAccount || '', isActive: true,
        });
        setSalaryStructures(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateSalaryStructure(d2.id, d2);
        if (updated) setSalaryStructures(prev => prev.map(s => s.id === d2.id ? updated : s));
      }
      setStructSaving(false);
      closeStructModal();
    }, 300);
  };

  const handleDeleteStructure = (id: string) => {
    const list = getSalaryStructures().filter(s => s.id !== id);
    if (list.length === getSalaryStructures().length) return;
    localStorage.setItem('finance_salary_structures', JSON.stringify(list));
    refreshStructures();
  };

  // ── Generate Salary Modal ──
  const [genModal, setGenModal] = useState<{ open: boolean }>({ open: false });
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [genMethod, setGenMethod] = useState<'cash' | 'bank' | 'mobile-banking'>('bank');
  const [genResults, setGenResults] = useState<SalaryDisbursement[]>([]);
  const [genSaving, setGenSaving] = useState(false);

  const openGenModal = () => {
    setGenMonth(new Date().getMonth() + 1);
    setGenYear(new Date().getFullYear());
    setGenResults([]);
    setGenMethod('bank');
    setGenModal({ open: true });
  };
  const closeGenModal = () => setGenModal(p => ({ ...p, open: false }));

  const handleGeneratePayroll = () => {
    const activeStructures = getSalaryStructures().filter(s => s.isActive);
    if (!activeStructures.length) return alert('No active salary structures found. Create salary structures first.');
    setGenSaving(true);
    setTimeout(() => {
      const results: SalaryDisbursement[] = [];
      for (const s of activeStructures) {
        const r = generateSalary(s.employeeId, genMonth, genYear, 0, 0, genMethod);
        if (r) results.push(r);
      }
      setGenResults(results);
      refreshDisbursements();
      setGenSaving(false);
    }, 500);
  };

  // ── Approve / Pay Modals ──
  const [payModal, setPayModal] = useState<{ open: boolean; disbursement: SalaryDisbursement | null; data: Partial<SalaryDisbursement> }>({
    open: false, disbursement: null, data: {}
  });

  const openPayModal = (d: SalaryDisbursement) => {
    setPayModal({
      open: true, disbursement: d, data: {
        paidAmount: d.totalPayable, paymentDate: new Date().toISOString().split('T')[0], paymentMethod: d.paymentMethod, note: d.note,
      }
    });
  };
  const closePayModal = () => setPayModal(p => ({ ...p, open: false }));

  const handlePaySalary = () => {
    const d = payModal.disbursement;
    const pd = payModal.data;
    if (!d) return;
    if (!pd.paidAmount || pd.paidAmount <= 0) return alert('Amount must be greater than zero.');
    if (!pd.paymentDate) return alert('Payment date is required.');
    paySalary(d.id, pd.paidAmount, pd.paymentDate);
    refreshDisbursements();
    closePayModal();
  };

  const handleApproveSalary = (id: string) => {
    approveSalary(id, 'Admin');
    refreshDisbursements();
  };

  // ── Filters ──
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredDisbursements = useMemo(() => {
    let list = [...disbursements];
    const q = searchTerm.toLowerCase();
    if (q) list = list.filter(d => d.employeeName.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
    if (statusFilter) list = list.filter(d => d.status === statusFilter);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [disbursements, searchTerm, statusFilter]);

  // ── KPIs ──
  const kpiData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const mtdDisbursements = disbursements.filter(d => d.month === currentMonth && d.year === currentYear && d.status === 'paid');
    const totalPayroll = mtdDisbursements.reduce((s, d) => s + d.paidAmount, 0);
    const pendingCount = disbursements.filter(d => d.status === 'pending' || d.status === 'approved').length;
    const activeStaff = getSalaryStructures().filter(s => s.isActive).length;
    const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return { totalPayroll, pendingCount, activeStaff, monthStr };
  }, [disbursements]);

  // ── Export ──
  const handleExport = () => {
    exportToCSV(
      ['Disbursement ID', 'Employee', 'Type', 'Month', 'Year', 'Base', 'House Rent', 'Medical', 'Transport', 'Bonus', 'Deductions', 'Overtime', 'Attendance Deduction', 'Total Payable', 'Paid', 'Status', 'Payment Date'],
      disbursements.map(d => [d.id, d.employeeName, d.employeeType, MONTHS[d.month - 1], String(d.year), String(d.baseSalary), String(d.houseRent), String(d.medical), String(d.transport), String(d.bonus), String(d.deductions), String(d.overtimePay), String(d.attendanceDeduction), String(d.totalPayable), String(d.paidAmount), d.status, d.paymentDate || '']),
      `payroll-${new Date().toISOString().split('T')[0]}.csv`
    );
  };

  // Helper
  const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';

  const activeStructures = useMemo(() => salaryStructures.filter(s => s.isActive), [salaryStructures]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Staff Payroll</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage salaries, disbursements, and payment processing.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'structures' && (
            <button onClick={() => openStructModal('create')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
              <Plus size={16} /> Add Structure
            </button>
          )}
          {activeTab === 'disbursements' && (
            <>
              <button onClick={handleExport} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                <Download size={16} /> Export
              </button>
              <button onClick={openGenModal} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
                <DollarSign size={16} /> Process Payroll
              </button>
            </>
          )}
          {activeTab === 'payments' && (
            <button onClick={handleExport} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Download size={16} /> Export
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group glass-card">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500 transform group-hover:scale-110 transition-transform"><Banknote size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Total Payroll (MTD)</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 relative z-10">৳ {kpiData.totalPayroll.toLocaleString()}</p>
        </div>
        <div className="stat-card bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group glass-card">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500 transform group-hover:scale-110 transition-transform"><FileText size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Pending Approvals</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 relative z-10">{kpiData.pendingCount}</p>
        </div>
        <div className="stat-card bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm relative overflow-hidden group glass-card">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-primary transform group-hover:scale-110 transition-transform"><Users size={48} /></div>
          <p className="text-sm font-medium text-[var(--text-muted)] relative z-10">Active Staff</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 relative z-10">{kpiData.activeStaff}</p>
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
              {activeTab === tab.id && <motion.div layoutId="payrollTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ── Salary Structures Tab ── */}
            {activeTab === 'structures' && (
              <motion.div key="structures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salaryStructures.map(s => {
                    const emp = employees.find(e => e.id === s.employeeId);
                    return (
                      <div key={s.id} className={`p-5 rounded-2xl border shadow-sm transition-all ${s.isActive ? 'bg-[var(--bg-secondary)] border-[var(--border-light)]' : 'bg-[var(--bg-tertiary)] border-[var(--border-light)] opacity-70'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-[var(--text-primary)]">{s.employeeName}</h3>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.id} &bull; {emp?.designation || s.employeeType}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openStructModal('edit', s)} className="p-1.5 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><Pencil size={15} /></button>
                            <button onClick={() => { if (confirm(`Delete salary structure for ${s.employeeName}?`)) handleDeleteStructure(s.id); }} className="p-1.5 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)]">Base Salary</span><span className="font-medium text-[var(--text-primary)]">৳ {s.baseSalary.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)]">House Rent</span><span className="font-medium text-[var(--text-primary)]">৳ {s.houseRent.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)]">Medical</span><span className="font-medium text-[var(--text-primary)]">৳ {s.medical.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)]">Transport</span><span className="font-medium text-[var(--text-primary)]">৳ {s.transport.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)]">Bonus</span><span className="font-medium text-emerald-600">৳ {s.bonus.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between text-sm"><span className="text-[var(--text-muted)]">Deductions</span><span className="font-medium text-rose-600">-৳ {s.deductions.toLocaleString()}</span></div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--border-light)] flex justify-between text-sm font-semibold">
                          <span className="text-[var(--text-primary)]">Total</span>
                          <span className="text-[var(--text-primary)]">৳ {s.totalSalary.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                  {salaryStructures.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-sm text-[var(--text-muted)]">No salary structures defined. Click "Add Structure" to create one.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Payroll Processing Tab ── */}
            {activeTab === 'disbursements' && (
              <motion.div key="disbursements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={18} /></div>
                    <input type="text" placeholder="Search employee or disbursement ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-[var(--border-light)] rounded-xl leading-5 bg-[var(--bg-tertiary)] placeholder-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary sm:text-sm transition-all" />
                  </div>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full sm:w-40">
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                      <tr>
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">Disbursement ID</th>
                        <th className="px-6 py-4 font-semibold">Employee</th>
                        <th className="px-6 py-4 font-semibold">Period</th>
                        <th className="px-6 py-4 font-semibold">Total Payable</th>
                        <th className="px-6 py-4 font-semibold">Paid</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {filteredDisbursements.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No payroll records found. Click "Process Payroll" to generate salaries.</td></tr>
                      ) : filteredDisbursements.map(d => (
                        <tr key={d.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--text-secondary)]">{d.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[var(--text-primary)]">{d.employeeName}</div>
                            <div className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">{d.employeeType}</div>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{MONTHS[d.month - 1]} {d.year}</td>
                          <td className="px-6 py-4 font-bold text-[var(--text-primary)]">৳ {d.totalPayable.toLocaleString()}</td>
                          <td className="px-6 py-4 badge-green font-medium">৳ {d.paidAmount.toLocaleString()}</td>
                          <td className="px-6 py-4">{statusBadge(d.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              {d.status === 'pending' && (
                                <button onClick={() => handleApproveSalary(d.id)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="Approve"><UserCheck size={16} /></button>
                              )}
                              {(d.status === 'approved' || d.status === 'pending') && (
                                <button onClick={() => openPayModal(d)} className="p-2 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark as Paid"><CreditCard size={16} /></button>
                              )}
                              {d.status === 'paid' && (
                                <span className="text-xs text-[var(--text-muted)] italic px-2">Paid</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Payment History Tab ── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                      <tr>
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">Disbursement ID</th>
                        <th className="px-6 py-4 font-semibold">Employee</th>
                        <th className="px-6 py-4 font-semibold">Period</th>
                        <th className="px-6 py-4 font-semibold">Total Payable</th>
                        <th className="px-6 py-4 font-semibold">Amount Paid</th>
                        <th className="px-6 py-4 font-semibold">Payment Date</th>
                        <th className="px-6 py-4 font-semibold">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {disbursements.filter(d => d.status === 'paid').length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No payments made yet. Process and pay salaries from the Payroll Processing tab.</td></tr>
                      ) : disbursements.filter(d => d.status === 'paid').sort((a, b) => b.paymentDate.localeCompare(a.paymentDate)).map(d => (
                        <tr key={d.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--text-secondary)]">{d.id}</td>
                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{d.employeeName}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{MONTHS[d.month - 1]} {d.year}</td>
                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">৳ {d.totalPayable.toLocaleString()}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">৳ {d.paidAmount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{d.paymentDate ? new Date(d.paymentDate).toLocaleDateString() : '—'}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)] capitalize">{d.paymentMethod.replace('-', ' ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Salary Structure Modal ── */}
      <AnimatePresence>
        {structModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closeStructModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)] z-10 rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">{structModal.mode === 'create' ? 'Create' : 'Edit'} Salary Structure</h3>
                <button onClick={closeStructModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Employee <span className="text-rose-500">*</span></label>
                  <select value={structModal.data.employeeId || ''} onChange={e => {
                    const emp = employees.find(em => em.id === e.target.value);
                    setStructModal(p => ({ ...p, data: { ...p.data, employeeId: e.target.value, employeeName: emp?.name || '', employeeType: emp?.type || 'teacher' } }));
                  }} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                    <option value="">— Select —</option>
                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Base Salary <span className="text-rose-500">*</span></label>
                    <input type="number" value={structModal.data.baseSalary || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, baseSalary: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">House Rent</label>
                    <input type="number" value={structModal.data.houseRent || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, houseRent: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Medical Allowance</label>
                    <input type="number" value={structModal.data.medical || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, medical: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Transport Allowance</label>
                    <input type="number" value={structModal.data.transport || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, transport: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Bonus</label>
                    <input type="number" value={structModal.data.bonus || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, bonus: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Deductions (PF, Tax, etc.)</label>
                    <input type="number" value={structModal.data.deductions || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, deductions: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Bank Account</label>
                  <input type="text" value={structModal.data.bankAccount || ''} onChange={e => setStructModal(p => ({ ...p, data: { ...p.data, bankAccount: e.target.value } }))}
                    placeholder="Account number for bank transfer" className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                {structModal.data.baseSalary && (
                  <div className="flex justify-between text-sm font-semibold p-3 bg-[var(--bg-tertiary)] rounded-xl">
                    <span className="text-[var(--text-primary)]">Total Salary</span>
                    <span className="text-[var(--text-primary)]">৳ {(Number(structModal.data.baseSalary || 0) + Number(structModal.data.houseRent || 0) + Number(structModal.data.medical || 0) + Number(structModal.data.transport || 0) + Number(structModal.data.bonus || 0) - Number(structModal.data.deductions || 0)).toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeStructModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleSaveStructure} disabled={structSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${structSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {structSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {structModal.mode === 'create' ? 'Create Structure' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Generate Payroll Modal ── */}
      <AnimatePresence>
        {genModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closeGenModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)] z-10 rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Process Monthly Payroll</h3>
                <button onClick={closeGenModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-[var(--text-muted)]">Generate salary disbursements for all active staff for the selected period.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Month</label>
                    <select value={genMonth} onChange={e => setGenMonth(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                      {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Year</label>
                    <input type="number" value={genYear} onChange={e => setGenYear(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Payment Method</label>
                  <select value={genMethod} onChange={e => setGenMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                    {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select></div>

                {genResults.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2"><CheckCircle2 size={16} /> Payroll Generated</div>
                    <p className="text-sm text-emerald-600">{genResults.length} salary disbursement(s) created for {MONTHS[genMonth - 1]} {genYear}.</p>
                    <p className="text-sm text-emerald-600 font-semibold mt-1">Total: ৳ {genResults.reduce((s, r) => s + r.totalPayable, 0).toLocaleString()}</p>
                  </div>
                )}

                <div className="text-sm text-[var(--text-muted)] bg-[var(--bg-tertiary)] rounded-xl p-3">
                  <span className="font-medium text-[var(--text-primary)]">Active Structures: </span>
                  {activeStructures.length} employee(s) will be processed.
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeGenModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Close</button>
                {genResults.length === 0 && (
                  <button onClick={handleGeneratePayroll} disabled={genSaving}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${genSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                    {genSaving ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
                    Generate Payroll
                  </button>
                )}
                {genResults.length > 0 && (
                  <button onClick={closeGenModal}
                    className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors">
                    Done
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Pay Salary Modal ── */}
      <AnimatePresence>
        {payModal.open && payModal.disbursement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closePayModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-md z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Pay Salary</h3>
                <button onClick={closePayModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm bg-[var(--bg-tertiary)] rounded-xl p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Employee:</span><span className="font-medium text-[var(--text-primary)]">{payModal.disbursement.employeeName}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Period:</span><span className="font-medium text-[var(--text-primary)]">{MONTHS[payModal.disbursement.month - 1]} {payModal.disbursement.year}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Total Payable:</span><span className="font-bold text-emerald-600">৳ {payModal.disbursement.totalPayable.toLocaleString()}</span></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Amount <span className="text-rose-500">*</span></label>
                  <input type="number" value={payModal.data.paidAmount || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, paidAmount: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Payment Method</label>
                    <select value={payModal.data.paymentMethod || 'bank'} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, paymentMethod: e.target.value as any } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                      {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Payment Date</label>
                    <input type="date" value={payModal.data.paymentDate || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, paymentDate: e.target.value } }))}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Note</label>
                  <textarea value={payModal.data.note || ''} onChange={e => setPayModal(p => ({ ...p, data: { ...p.data, note: e.target.value } }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[60px]" /></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closePayModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handlePaySalary}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Confirm Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
