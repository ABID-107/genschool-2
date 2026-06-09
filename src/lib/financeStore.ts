'use client';

export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'overpaid' | 'refunded';
export type FeeCategory =
  | 'admission' | 'tuition' | 'exam' | 'registration' | 'library'
  | 'transport' | 'laboratory' | 'development' | 'custom';

export interface FeeStructureItem {
  category: FeeCategory;
  label: string;
  amount: number;
  isOptional: boolean;
}

export interface FeeStructure {
  id: string;
  name: string;
  classIds: number[];
  sectionIds: number[];
  items: FeeStructureItem[];
  frequency: 'monthly' | 'yearly' | 'one-time';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  feeStructureId: string;
  items: FeeStructureItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: PaymentStatus;
  dueDate: string;
  issueDate: string;
  discount: number;
  discountReason: string;
  fine: number;
  fineReason: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: 'cash' | 'bank' | 'mobile-banking' | 'card' | 'cheque';
  reference: string;
  note: string;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  receivedBy: string;
  paymentDate: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  studentId: string;
  studentName: string;
  feeStructureId: string;
  type: 'percentage' | 'fixed';
  value: number;
  reason: string;
  approvedBy: string;
  isActive: boolean;
  createdAt: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'mobile-banking';
  paidTo: string;
  receipt: string;
  expenseDate: string;
  createdBy: string;
  createdAt: string;
}

export type SalaryType = 'teacher' | 'staff';
export type SalaryStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface SalaryStructure {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeType: SalaryType;
  baseSalary: number;
  houseRent: number;
  medical: number;
  transport: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
  bankAccount: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryDisbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeType: SalaryType;
  month: number;
  year: number;
  baseSalary: number;
  houseRent: number;
  medical: number;
  transport: number;
  bonus: number;
  deductions: number;
  overtimePay: number;
  attendanceDeduction: number;
  totalPayable: number;
  paidAmount: number;
  status: SalaryStatus;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank' | 'mobile-banking';
  note: string;
  approvedBy: string;
  createdAt: string;
}

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) { const p = JSON.parse(stored); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Fee Structures ──
let fsCounter = 3;
function nextFSId(): string {
  fsCounter++;
  return `FS-${String(fsCounter).padStart(3, '0')}`;
}

const defaultFeeStructures: FeeStructure[] = [
  {
    id: 'FS-001', name: 'Monthly Tuition (Class 6-10)',
    classIds: [1, 2, 3, 4, 5], sectionIds: [],
    items: [
      { category: 'tuition', label: 'Tuition Fee', amount: 2000, isOptional: false },
      { category: 'library', label: 'Library Fee', amount: 200, isOptional: false },
      { category: 'laboratory', label: 'Lab Fee', amount: 300, isOptional: false },
      { category: 'transport', label: 'Transport Fee', amount: 1000, isOptional: true },
    ],
    frequency: 'monthly', isActive: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'FS-002', name: 'Annual Admission Package',
    classIds: [1, 2, 3, 4, 5], sectionIds: [],
    items: [
      { category: 'admission', label: 'Admission Fee', amount: 5000, isOptional: false },
      { category: 'registration', label: 'Registration Fee', amount: 1000, isOptional: false },
      { category: 'development', label: 'Development Fee', amount: 2000, isOptional: false },
    ],
    frequency: 'one-time', isActive: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'FS-003', name: 'Exam Fee (Class 10)',
    classIds: [5], sectionIds: [],
    items: [
      { category: 'exam', label: 'Exam Fee', amount: 1500, isOptional: false },
      { category: 'custom', label: 'Practical Exam Fee', amount: 500, isOptional: false },
    ],
    frequency: 'one-time', isActive: true, createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z',
  },
];

export function getFeeStructures(): FeeStructure[] {
  return loadFromStorage<FeeStructure>('finance_fee_structures', defaultFeeStructures);
}
export function saveFeeStructures(data: FeeStructure[]): void { saveToStorage('finance_fee_structures', data); }

export function createFeeStructure(data: Omit<FeeStructure, 'id' | 'createdAt' | 'updatedAt'>): FeeStructure {
  const list = getFeeStructures();
  const now = new Date().toISOString();
  const item: FeeStructure = { ...data, id: nextFSId(), createdAt: now, updatedAt: now };
  list.push(item);
  saveFeeStructures(list);
  return item;
}

export function updateFeeStructure(id: string, data: Partial<FeeStructure>): FeeStructure | null {
  const list = getFeeStructures();
  const idx = list.findIndex(f => f.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  saveFeeStructures(list);
  return list[idx];
}

export function deleteFeeStructure(id: string): boolean {
  const list = getFeeStructures().filter(f => f.id !== id);
  if (list.length === getFeeStructures().length) return false;
  saveFeeStructures(list);
  return true;
}

// ── Invoices ──
let invCounter = 4;
function nextInvId(): string {
  invCounter++;
  return `INV-${new Date().getFullYear()}-${String(invCounter).padStart(3, '0')}`;
}

export function getInvoices(): Invoice[] {
  return loadFromStorage<Invoice>('finance_invoices', defaultInvoices);
}
export function saveInvoices(data: Invoice[]): void { saveToStorage('finance_invoices', data); }

const defaultInvoices: Invoice[] = [
  { id: 'INV-2026-001', studentId: 'STU-2023-001', studentName: 'Aarav Rahman', className: 'Class 10', section: 'A - Science', feeStructureId: 'FS-001', items: [{ category: 'tuition', label: 'Tuition Fee', amount: 2000, isOptional: false }, { category: 'library', label: 'Library Fee', amount: 200, isOptional: false }, { category: 'laboratory', label: 'Lab Fee', amount: 300, isOptional: false }], totalAmount: 2500, paidAmount: 2500, dueAmount: 0, status: 'paid', dueDate: '2026-06-10', issueDate: '2026-06-01', discount: 0, discountReason: '', fine: 0, fineReason: '', notes: '', createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z' },
  { id: 'INV-2026-002', studentId: 'STU-2023-002', studentName: 'Zara Khan', className: 'Class 8', section: 'B', feeStructureId: 'FS-001', items: [{ category: 'tuition', label: 'Tuition Fee', amount: 2000, isOptional: false }, { category: 'library', label: 'Library Fee', amount: 200, isOptional: false }], totalAmount: 2200, paidAmount: 2200, dueAmount: 0, status: 'paid', dueDate: '2026-06-10', issueDate: '2026-06-02', discount: 0, discountReason: '', fine: 0, fineReason: '', notes: '', createdAt: '2026-06-02T00:00:00Z', updatedAt: '2026-06-02T00:00:00Z' },
  { id: 'INV-2026-003', studentId: 'STU-2023-003', studentName: 'Omar Farooq', className: 'Class 12', section: 'Science', feeStructureId: 'FS-002', items: [{ category: 'admission', label: 'Admission Fee', amount: 5000, isOptional: false }, { category: 'registration', label: 'Registration Fee', amount: 1000, isOptional: false }], totalAmount: 6000, paidAmount: 0, dueAmount: 6000, status: 'unpaid', dueDate: '2026-06-15', issueDate: '2026-06-03', discount: 0, discountReason: '', fine: 0, fineReason: '', notes: '', createdAt: '2026-06-03T00:00:00Z', updatedAt: '2026-06-03T00:00:00Z' },
  { id: 'INV-2026-004', studentId: 'STU-2023-004', studentName: 'Nadia Islam', className: 'Class 9', section: 'C - Arts', feeStructureId: 'FS-001', items: [{ category: 'tuition', label: 'Tuition Fee', amount: 2000, isOptional: false }, { category: 'transport', label: 'Transport Fee', amount: 1000, isOptional: true }], totalAmount: 3000, paidAmount: 2000, dueAmount: 1000, status: 'partial', dueDate: '2026-06-10', issueDate: '2026-06-03', discount: 0, discountReason: '', fine: 0, fineReason: '', notes: '', createdAt: '2026-06-03T00:00:00Z', updatedAt: '2026-06-03T00:00:00Z' },
];

export function createInvoice(data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice {
  const list = getInvoices();
  const now = new Date().toISOString();
  const invoice: Invoice = {
    ...data, id: nextInvId(),
    paidAmount: 0, dueAmount: data.totalAmount, status: 'unpaid',
    createdAt: now, updatedAt: now,
  };
  list.push(invoice);
  saveInvoices(list);
  return invoice;
}

export function updateInvoice(id: string, data: Partial<Invoice>): Invoice | null {
  const list = getInvoices();
  const idx = list.findIndex(i => i.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.paidAmount !== undefined || data.totalAmount !== undefined) {
    const inv = list[idx];
    inv.dueAmount = inv.totalAmount - inv.paidAmount - inv.discount + inv.fine;
    if (inv.dueAmount <= 0 && inv.paidAmount > 0) inv.status = inv.paidAmount > inv.totalAmount ? 'overpaid' : 'paid';
    else if (inv.paidAmount > 0) inv.status = 'partial';
    else inv.status = 'unpaid';
  }
  saveInvoices(list);
  return list[idx];
}

export function deleteInvoice(id: string): boolean {
  const payments = getPayments();
  if (payments.some(p => p.invoiceId === id)) return false;
  const list = getInvoices().filter(i => i.id !== id);
  if (list.length === getInvoices().length) return false;
  saveInvoices(list);
  return true;
}

export function markInvoiceRefunded(id: string): Invoice | null {
  return updateInvoice(id, { status: 'refunded', paidAmount: 0, dueAmount: 0 });
}

// ── Payments ──
let payCounter = 0;
function nextPayId(): string {
  payCounter++;
  return `PAY-${Date.now()}-${payCounter}`;
}

export function getPayments(): Payment[] {
  return loadFromStorage<Payment>('finance_payments', []);
}
export function savePayments(data: Payment[]): void { saveToStorage('finance_payments', data); }

export function receivePayment(data: Omit<Payment, 'id' | 'createdAt'>): { payment: Payment; invoice: Invoice } {
  const payments = getPayments();
  const payment: Payment = { ...data, id: nextPayId(), createdAt: new Date().toISOString() };
  payments.push(payment);
  savePayments(payments);

  const invoice = updateInvoice(data.invoiceId, {
    paidAmount: getInvoicePaidTotal(data.invoiceId) + data.amount,
  });
  return { payment, invoice: invoice! };
}

function getInvoicePaidTotal(invoiceId: string): number {
  return getPayments()
    .filter(p => p.invoiceId === invoiceId && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
}

export function updatePayment(id: string, data: Partial<Payment>): Payment | null {
  const list = getPayments();
  const idx = list.findIndex(p => p.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data };
  savePayments(list);

  const invoice = getInvoices().find(i => i.id === list[idx].invoiceId);
  if (invoice) {
    updateInvoice(invoice.id, { paidAmount: getInvoicePaidTotal(invoice.id) });
  }
  return list[idx];
}

export function cancelPayment(id: string): Payment | null {
  return updatePayment(id, { status: 'cancelled' });
}

export function refundPayment(id: string): Payment | null {
  return updatePayment(id, { status: 'refunded' });
}

// ── Discounts ──
let discCounter = 0;
function nextDiscId(): string {
  discCounter++;
  return `DISC-${Date.now()}-${discCounter}`;
}

export function getDiscounts(): Discount[] {
  return loadFromStorage<Discount>('finance_discounts', []);
}
export function saveDiscounts(data: Discount[]): void { saveToStorage('finance_discounts', data); }

export function createDiscount(data: Omit<Discount, 'id' | 'createdAt'>): Discount {
  const list = getDiscounts();
  const discount: Discount = { ...data, id: nextDiscId(), createdAt: new Date().toISOString() };
  list.push(discount);
  saveDiscounts(list);
  return discount;
}

export function updateDiscount(id: string, data: Partial<Discount>): Discount | null {
  const list = getDiscounts();
  const idx = list.findIndex(d => d.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data };
  saveDiscounts(list);
  return list[idx];
}

// ── Expenses ──
let expCounter = 0;
function nextExpId(): string {
  expCounter++;
  return `EXP-${Date.now()}-${expCounter}`;
}

const defaultExpenseCategories: ExpenseCategory[] = [
  { id: 'ec-1', name: 'Utilities', description: 'Electricity, water, gas, internet' },
  { id: 'ec-2', name: 'Rent', description: 'Building and facility rent' },
  { id: 'ec-3', name: 'Maintenance', description: 'Repairs and maintenance' },
  { id: 'ec-4', name: 'Equipment', description: 'Furniture, computers, lab equipment' },
  { id: 'ec-5', name: 'Marketing', description: 'Advertising and promotions' },
  { id: 'ec-6', name: 'Transportation', description: 'Vehicle fuel, maintenance, driver salary' },
  { id: 'ec-7', name: 'Miscellaneous', description: 'Other expenses' },
];

export function getExpenseCategories(): ExpenseCategory[] {
  return loadFromStorage<ExpenseCategory>('finance_expense_categories', defaultExpenseCategories);
}

export function getExpenses(): Expense[] {
  return loadFromStorage<Expense>('finance_expenses', []);
}
export function saveExpenses(data: Expense[]): void { saveToStorage('finance_expenses', data); }

export function createExpense(data: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const list = getExpenses();
  const expense: Expense = { ...data, id: nextExpId(), createdAt: new Date().toISOString() };
  list.push(expense);
  saveExpenses(list);
  return expense;
}

export function updateExpense(id: string, data: Partial<Expense>): Expense | null {
  const list = getExpenses();
  const idx = list.findIndex(e => e.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], ...data };
  saveExpenses(list);
  return list[idx];
}

export function deleteExpense(id: string): boolean {
  const list = getExpenses().filter(e => e.id !== id);
  if (list.length === getExpenses().length) return false;
  saveExpenses(list);
  return true;
}

// ── Salary ──
let salStructCounter = 0;
function nextSalStructId(): string {
  salStructCounter++;
  return `SALSTR-${Date.now()}-${salStructCounter}`;
}

export function getSalaryStructures(): SalaryStructure[] {
  return loadFromStorage<SalaryStructure>('finance_salary_structures', []);
}
export function saveSalaryStructures(data: SalaryStructure[]): void { saveToStorage('finance_salary_structures', data); }

export function createSalaryStructure(data: Omit<SalaryStructure, 'id' | 'createdAt' | 'updatedAt' | 'totalSalary'>): SalaryStructure {
  const list = getSalaryStructures();
  const now = new Date().toISOString();
  const total = data.baseSalary + data.houseRent + data.medical + data.transport + data.bonus - data.deductions;
  const item: SalaryStructure = { ...data, id: nextSalStructId(), totalSalary: total, createdAt: now, updatedAt: now };
  list.push(item);
  saveSalaryStructures(list);
  return item;
}

export function updateSalaryStructure(id: string, data: Partial<SalaryStructure>): SalaryStructure | null {
  const list = getSalaryStructures();
  const idx = list.findIndex(s => s.id === id);
  if (idx < 0) return null;
  const updated = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.baseSalary !== undefined || data.houseRent !== undefined || data.medical !== undefined || data.transport !== undefined || data.bonus !== undefined || data.deductions !== undefined) {
    updated.totalSalary = updated.baseSalary + updated.houseRent + updated.medical + updated.transport + updated.bonus - updated.deductions;
  }
  list[idx] = updated;
  saveSalaryStructures(list);
  return list[idx];
}

// ── Salary Disbursements ──
let salDisbCounter = 0;
function nextSalDisbId(): string {
  salDisbCounter++;
  return `SAL-${Date.now()}-${salDisbCounter}`;
}

export function getSalaryDisbursements(): SalaryDisbursement[] {
  return loadFromStorage<SalaryDisbursement>('finance_salary_disbursements', []);
}
export function saveSalaryDisbursements(data: SalaryDisbursement[]): void { saveToStorage('finance_salary_disbursements', data); }

export function generateSalary(employeeId: string, month: number, year: number, overtimePay: number = 0, attendanceDeduction: number = 0, paymentMethod: 'cash' | 'bank' | 'mobile-banking' = 'bank'): SalaryDisbursement | null {
  const structure = getSalaryStructures().find(s => s.employeeId === employeeId);
  if (!structure) return null;
  const existing = getSalaryDisbursements().find(d => d.employeeId === employeeId && d.month === month && d.year === year);
  if (existing) return existing;

  const list = getSalaryDisbursements();
  const totalPayable = structure.totalSalary + overtimePay - attendanceDeduction;
  const disbursement: SalaryDisbursement = {
    id: nextSalDisbId(),
    employeeId: structure.employeeId,
    employeeName: structure.employeeName,
    employeeType: structure.employeeType,
    month, year,
    baseSalary: structure.baseSalary,
    houseRent: structure.houseRent,
    medical: structure.medical,
    transport: structure.transport,
    bonus: structure.bonus,
    deductions: structure.deductions,
    overtimePay, attendanceDeduction,
    totalPayable, paidAmount: 0,
    status: 'pending',
    paymentDate: '',
    paymentMethod,
    note: '', approvedBy: '',
    createdAt: new Date().toISOString(),
  };
  list.push(disbursement);
  saveSalaryDisbursements(list);
  return disbursement;
}

export function bulkGenerateSalary(staffList: { id: string; month: number; year: number }[]): SalaryDisbursement[] {
  const results: SalaryDisbursement[] = [];
  for (const s of staffList) {
    const r = generateSalary(s.id, s.month, s.year);
    if (r) results.push(r);
  }
  return results;
}

export function approveSalary(id: string, approvedBy: string): SalaryDisbursement | null {
  const list = getSalaryDisbursements();
  const idx = list.findIndex(d => d.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status: 'approved', approvedBy };
  saveSalaryDisbursements(list);
  return list[idx];
}

export function paySalary(id: string, paidAmount: number, paymentDate: string): SalaryDisbursement | null {
  const list = getSalaryDisbursements();
  const idx = list.findIndex(d => d.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status: 'paid', paidAmount, paymentDate };
  saveSalaryDisbursements(list);
  return list[idx];
}

// ── Reports ──
export interface CollectionReport {
  date: string;
  totalCollected: number;
  transactionCount: number;
  byMethod: Record<string, number>;
}

export interface DailySummary {
  date: string;
  totalCollections: number;
  totalExpenses: number;
  netIncome: number;
  collectionCount: number;
}

export function getDailyCollections(date: string): CollectionReport {
  const payments = getPayments().filter(p => p.status === 'completed' && p.paymentDate === date);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const byMethod: Record<string, number> = {};
  payments.forEach(p => { byMethod[p.method] = (byMethod[p.method] || 0) + p.amount; });
  return { date, totalCollected, transactionCount: payments.length, byMethod };
}

export function getDateRangeCollections(startDate: string, endDate: string): CollectionReport[] {
  const reports: CollectionReport[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const report = getDailyCollections(dateStr);
    if (report.transactionCount > 0) reports.push(report);
  }
  return reports;
}

export function getDueInvoices(): Invoice[] {
  return getInvoices().filter(i => i.status === 'unpaid' || i.status === 'partial');
}

export function getMonthlySummary(year: number, month: number): DailySummary {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const startDate = `${monthStr}-01`;
  const endDate = `${monthStr}-31`;
  const payments = getPayments().filter(p => p.status === 'completed' && p.paymentDate >= startDate && p.paymentDate <= endDate);
  const expenses = getExpenses().filter(e => e.expenseDate >= startDate && e.expenseDate <= endDate);
  const totalCollections = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  return { date: monthStr, totalCollections, totalExpenses, netIncome: totalCollections - totalExpenses, collectionCount: payments.length };
}

export function getProfitLoss(startDate: string, endDate: string): { totalRevenue: number; totalExpenses: number; netProfit: number; revenueByCategory: Record<string, number>; expenseByCategory: Record<string, number> } {
  const payments = getPayments().filter(p => p.status === 'completed' && p.paymentDate >= startDate && p.paymentDate <= endDate);
  const expenses = getExpenses().filter(e => e.expenseDate >= startDate && e.expenseDate <= endDate);
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const revenueByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};
  payments.forEach(p => { revenueByCategory['Fee Collection'] = (revenueByCategory['Fee Collection'] || 0) + p.amount; });
  expenses.forEach(e => { expenseByCategory[e.categoryName] = (expenseByCategory[e.categoryName] || 0) + e.amount; });
  return { totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses, revenueByCategory, expenseByCategory };
}

// ── Validators ──
export function validatePayment(amount: number, invoiceId: string): string[] {
  const errors: string[] = [];
  if (!amount || amount <= 0) errors.push('Payment amount must be greater than zero.');
  const invoice = getInvoices().find(i => i.id === invoiceId);
  if (!invoice) errors.push('Invoice not found.');
  return errors;
}

export function validateExpense(data: Partial<Expense>): string[] {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push('Expense title is required.');
  if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than zero.');
  if (!data.categoryId) errors.push('Category is required.');
  if (!data.expenseDate) errors.push('Date is required.');
  if (!data.paidTo?.trim()) errors.push('Payee is required.');
  return errors;
}

export function validateSalaryStructure(data: Partial<SalaryStructure>): string[] {
  const errors: string[] = [];
  if (!data.employeeId) errors.push('Employee is required.');
  if (!data.baseSalary || data.baseSalary <= 0) errors.push('Base salary must be greater than zero.');
  return errors;
}

export function exportToCSV(headers: string[], rows: string[][], filename: string): void {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateInvoiceNumber(): string {
  invCounter = Math.max(invCounter, getInvoices().length + 1);
  return `INV-${new Date().getFullYear()}-${String(invCounter).padStart(3, '0')}`;
}
