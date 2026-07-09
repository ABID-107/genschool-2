'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Library, History, Settings, Plus, Search, Download, X, Save, Loader2,
  Pencil, Trash2, Eye, CheckCircle2, Clock, Ban, Undo2, Copy, ArrowUpDown,
  FileText, AlertTriangle, Calendar, Users, BookMarked, RotateCcw, DollarSign,
  TrendingUp, Archive, UserCheck,
} from 'lucide-react';
import {
  getBooks, createBook, updateBook, deleteBook, archiveBook, restoreBook,
  getBorrowRecords, issueBook, returnBook, renewBook, markAsLost, payFine,
  searchBooks, refreshOverdueStatus,
  getOverdueRecords, getPopularBooks, getInventoryReport,
  calculateFine, validateBook, validateISBN, exportBooksToCSV,
  BOOK_CATEGORIES, BOOK_LANGUAGES,
  loadClasses, loadStudents, loadTeachers, loadStaff,
  type Book, type BorrowRecord, type UserRole, type BookFilters,
} from '@/lib/libraryStore';

const TABS = [
  { id: 'catalog', label: 'Book Catalog', icon: Library },
  { id: 'transactions', label: 'Issue & Return', icon: BookOpen },
  { id: 'reports', label: 'Reports', icon: TrendingUp },
];

const statusBadge = (status: string) => {
  const map: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    issued: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: BookMarked },
    returned: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: CheckCircle2 },
    overdue: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Clock },
    lost: { bg: 'bg-[var(--bg-tertiary)]', text: 'text-[var(--text-secondary)]', border: 'border-[var(--border-light)]', icon: Ban },
  };
  const s = map[status] || map.issued;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <s.icon size={12} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function LibraryManagementPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => { setBooks(getBooks()); }, []);
  useEffect(() => { setBorrowRecords(getBorrowRecords()); }, []);
  useEffect(() => { setClasses(loadClasses()); }, []);
  useEffect(() => { setStudents(loadStudents()); }, []);
  useEffect(() => { setTeachers(loadTeachers()); }, []);
  useEffect(() => { setStaff(loadStaff()); }, []);

  const refreshBooks = useCallback(() => setBooks(getBooks()), []);
  const refreshBorrows = useCallback(() => {
    refreshOverdueStatus();
    setBorrowRecords(getBorrowRecords());
  }, []);

  // ── Search & Filters (Catalog) ──
  const [filters, setFilters] = useState<BookFilters>({ isArchived: false });
  const [searchInput, setSearchInput] = useState('');

  const filteredBooks = useMemo(() => searchBooks(filters), [filters, books]);

  // ── KPI Data ──
  const inventory = useMemo(() => getInventoryReport(), [books, borrowRecords]);
  const overdueCount = useMemo(() => getOverdueRecords().length, [borrowRecords]);

  const applyFilters = useCallback((updates: Partial<BookFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // ── Book Modal ──
  const [bookModal, setBookModal] = useState<{
    open: boolean; mode: 'create' | 'edit' | 'view'; data: Partial<Book>;
  }>({ open: false, mode: 'create', data: {} });
  const [bookSaving, setBookSaving] = useState(false);

  const openBookModal = (mode: 'create' | 'edit' | 'view', data?: Book) => {
    if (mode === 'create') {
      setBookModal({
        open: true, mode, data: {
          isbn: '', title: '', author: '', publisher: '', edition: '', category: 'General Knowledge',
          language: 'English', classIds: [], subject: '', publicationYear: new Date().getFullYear(),
          totalCopies: 1, availableCopies: 0, shelfLocation: '', description: '',
          thumbnail: '', pdfUrl: '', isArchived: false,
        },
      });
    } else if (data) {
      setBookModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeBookModal = () => setBookModal(p => ({ ...p, open: false }));

  const handleSaveBook = () => {
    const d = bookModal.data;
    const errors = validateBook(d);
    if (errors.length) return alert(errors.join('\n'));
    const isbnErr = validateISBN(d.isbn || '', bookModal.mode === 'edit' ? d.id : undefined);
    if (isbnErr) return alert(isbnErr);
    setBookSaving(true);
    setTimeout(() => {
      const d2 = bookModal.data;
      if (bookModal.mode === 'create') {
        const created = createBook({
          isbn: d2.isbn!, title: d2.title!, author: d2.author!, publisher: d2.publisher || '',
          edition: d2.edition || '', category: d2.category!, language: d2.language || 'English',
          classIds: d2.classIds || [], subject: d2.subject || '',
          publicationYear: d2.publicationYear || new Date().getFullYear(),
          totalCopies: d2.totalCopies!, shelfLocation: d2.shelfLocation || '',
          description: d2.description || '', thumbnail: d2.thumbnail || '', pdfUrl: d2.pdfUrl || '',
          isArchived: false,
        });
        setBooks(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateBook(d2.id, d2);
        if (updated) setBooks(prev => prev.map(b => b.id === d2.id ? updated : b));
      }
      setBookSaving(false);
      closeBookModal();
    }, 300);
  };

  const handleBookAction = (action: string, id: string) => {
    switch (action) {
      case 'delete':
        if (confirm('Delete this book? This cannot be undone.')) {
          if (!deleteBook(id)) alert('Cannot delete: book is currently issued.');
          refreshBooks();
        }
        break;
      case 'archive':
        archiveBook(id);
        refreshBooks();
        break;
      case 'restore':
        restoreBook(id);
        refreshBooks();
        break;
    }
  };

  // ── Issue Modal ──
  const [issueModal, setIssueModal] = useState<{ open: boolean; bookId?: string }>({ open: false });
  const [issueData, setIssueData] = useState({
    bookId: '', userId: '', userName: '', userRole: 'student' as UserRole,
    dueDate: '', classId: undefined as number | undefined, section: '',
  });
  const [issueSaving, setIssueSaving] = useState(false);

  const openIssueModal = (bookId?: string) => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    setIssueData({
      bookId: bookId || '', userId: '', userName: '', userRole: 'student',
      dueDate: d.toISOString().split('T')[0], classId: undefined, section: '',
    });
    setIssueModal({ open: true });
  };
  const closeIssueModal = () => setIssueModal(p => ({ ...p, open: false }));

  const handleIssue = () => {
    if (!issueData.bookId) return alert('Select a book.');
    if (!issueData.userId) return alert('Select a user.');
    if (!issueData.dueDate) return alert('Set a due date.');
    setIssueSaving(true);
    setTimeout(() => {
      const result = issueBook(
        issueData.bookId, issueData.userId, issueData.userName, issueData.userRole,
        issueData.dueDate, issueData.classId, issueData.section,
      );
      if (!result) {
        alert('Cannot issue: book unavailable or already issued to this user.');
        setIssueSaving(false);
        return;
      }
      refreshBooks();
      refreshBorrows();
      setIssueSaving(false);
      closeIssueModal();
    }, 300);
  };

  // ── Return Modal ──
  const [returnModal, setReturnModal] = useState<{ open: boolean; record: BorrowRecord | null }>({ open: false, record: null });
  const [returnDate, setReturnDate] = useState('');

  const openReturnModal = (record: BorrowRecord) => {
    setReturnDate(new Date().toISOString().split('T')[0]);
    setReturnModal({ open: true, record });
  };
  const closeReturnModal = () => setReturnModal(p => ({ ...p, open: false }));

  const handleReturn = () => {
    if (!returnModal.record) return;
    returnBook(returnModal.record.id, returnDate);
    refreshBooks();
    refreshBorrows();
    closeReturnModal();
  };

  // ── Reports ──
  const [reportType, setReportType] = useState<'inventory' | 'overdue' | 'popular'>('inventory');
  const popularBooks = useMemo(() => getPopularBooks(10), [borrowRecords]);
  const overdueRecords = useMemo(() => getOverdueRecords(), [borrowRecords]);

  // ── View helpers ──
  const getUserOptions = () => {
    const role = issueData.userRole;
    if (role === 'student') return students;
    if (role === 'teacher') return teachers;
    return staff;
  };

  const toggleBookClass = (classId: number) => {
    setBookModal(prev => {
      const ids = prev.data.classIds || [];
      return { ...prev, data: { ...prev.data, classIds: ids.includes(classId) ? ids.filter(id => id !== classId) : [...ids, classId] } };
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Library Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage books, issuing, returns, and library reports.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'catalog' && (
            <>
              <button onClick={() => { setFilters(p => ({ ...p, isArchived: !p.isArchived })); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border shadow-sm ${filters.isArchived ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]'}`}>
                <Archive size={16} className="inline mr-1.5" />{filters.isArchived ? 'Archived' : 'Active'}
              </button>
              <button onClick={() => exportBooksToCSV(books)} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                <Download size={16} /> Export
              </button>
              <button onClick={() => openBookModal('create')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
                <Plus size={16} /> Add Book
              </button>
            </>
          )}
          {activeTab === 'transactions' && (
            <button onClick={() => openIssueModal()} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
              <Plus size={16} /> Issue a Book
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <p className="text-sm font-medium text-[var(--text-muted)]">Total Books</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{inventory.totalBooks}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{inventory.totalCopies} total copies</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <p className="text-sm font-medium text-[var(--text-muted)]">Available Copies</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{inventory.availableCopies}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <p className="text-sm font-medium text-[var(--text-muted)]">Currently Issued</p>
          <p className="text-2xl font-bold text-brand-primary mt-1">{inventory.issuedCopies}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-light)] shadow-sm">
          <p className="text-sm font-medium text-[var(--text-muted)]">Overdue Returns</p>
          <p className={`text-2xl font-bold mt-1 ${overdueCount > 0 ? 'text-rose-600' : 'text-[var(--text-primary)]'}`}>{overdueCount}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden glass-panel">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'}`}>
              <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)]'} />
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="libraryTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
            </button>
          ))}
        </div>

        <div className="p-0">
          <AnimatePresence mode="wait">
            {/* ── Catalog Tab ── */}
            {activeTab === 'catalog' && (
              <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="p-4 border-b border-[var(--border-light)] flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                  <div className="relative flex-1 w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={18} /></div>
                    <input type="text" placeholder="Search by title, author, ISBN, publisher..." value={searchInput}
                      onChange={e => { setSearchInput(e.target.value); applyFilters({ search: e.target.value }); }}
                      className="block w-full pl-10 pr-3 py-2 border border-[var(--border-light)] rounded-xl leading-5 bg-[var(--bg-tertiary)] placeholder-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary sm:text-sm transition-all" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select value={filters.category || ''} onChange={e => applyFilters({ category: e.target.value || undefined })}
                      className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                      <option value="">All Categories</option>
                      {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={filters.language || ''} onChange={e => applyFilters({ language: e.target.value || undefined })}
                      className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                      <option value="">All Languages</option>
                      {BOOK_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={filters.availability || 'all'} onChange={e => applyFilters({ availability: e.target.value as any || undefined })}
                      className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                      <option value="all">All Copies</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Title</th>
                        <th className="px-6 py-4 font-semibold">Author</th>
                        <th className="px-6 py-4 font-semibold">ISBN</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Copies</th>
                        <th className="px-6 py-4 font-semibold">Available</th>
                        <th className="px-6 py-4 font-semibold">Shelf</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {filteredBooks.map(book => (
                        <tr key={book.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[var(--text-primary)]">{book.title}</div>
                            <div className="text-xs text-[var(--text-muted)] mt-0.5">{book.id}</div>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{book.author}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)] font-mono text-xs">{book.isbn}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                              {book.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{book.totalCopies}</td>
                          <td className="px-6 py-4">
                            <span className={`font-medium ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {book.availableCopies}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{book.shelfLocation || '—'}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <button onClick={() => openBookModal('view', book)} className="p-1.5 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="View"><Eye size={15} /></button>
                              <button onClick={() => openBookModal('edit', book)} className="p-1.5 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="Edit"><Pencil size={15} /></button>
                              {!filters.isArchived && book.availableCopies > 0 && (
                                <button onClick={() => openIssueModal(book.id)} className="p-1.5 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Issue"><BookMarked size={15} /></button>
                              )}
                              {!filters.isArchived ? (
                                <button onClick={() => handleBookAction('archive', book.id)} className="p-1.5 text-[var(--text-muted)] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Archive"><Archive size={15} /></button>
                              ) : (
                                <button onClick={() => handleBookAction('restore', book.id)} className="p-1.5 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="Restore"><Undo2 size={15} /></button>
                              )}
                              <button onClick={() => handleBookAction('delete', book.id)} className="p-1.5 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredBooks.length === 0 && (
                        <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">{filters.isArchived ? 'No archived books.' : 'No books in catalog. Add your first book.'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Transactions Tab ── */}
            {activeTab === 'transactions' && (
              <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="p-4 border-b border-[var(--border-light)]">
                  <div className="flex gap-2">
                    {['all', 'issued', 'returned', 'overdue', 'lost'].map(s => (
                      <button key={s} onClick={() => { /* could filter */ }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${s === 'all' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]'}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Book</th>
                        <th className="px-6 py-4 font-semibold">Borrower</th>
                        <th className="px-6 py-4 font-semibold">Role</th>
                        <th className="px-6 py-4 font-semibold">Issue Date</th>
                        <th className="px-6 py-4 font-semibold">Due Date</th>
                        <th className="px-6 py-4 font-semibold">Return Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Fine</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {borrowRecords.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).map(record => (
                        <tr key={record.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{record.bookTitle}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-[var(--text-primary)]">{record.userName}</div>
                            <div className="text-xs text-[var(--text-muted)]">{record.userId}</div>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-secondary)] capitalize">{record.userRole}</td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(record.issueDate).toLocaleDateString()}</td>
                          <td className={`px-6 py-4 font-medium ${record.status === 'overdue' ? 'text-rose-600' : 'text-[var(--text-secondary)]'}`}>
                            {new Date(record.dueDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-[var(--text-muted)]">{record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '—'}</td>
                          <td className="px-6 py-4">{statusBadge(record.status)}</td>
                          <td className="px-6 py-4">
                            {record.fine > 0 ? (
                              <span className={`font-medium ${record.finePaid ? 'text-[var(--text-muted)]' : 'text-rose-600'}`}>
                                ৳{record.fine}{record.finePaid ? ' (paid)' : ''}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              {record.status === 'issued' && (
                                <>
                                  <button onClick={() => openReturnModal(record)} className="p-1.5 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Return"><RotateCcw size={15} /></button>
                                  <button onClick={() => { if (renewBook(record.id)) refreshBorrows(); else alert('Cannot renew (max 2 renewals).'); }} className="p-1.5 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="Renew"><RotateCcw size={15} /></button>
                                  <button onClick={() => { markAsLost(record.id); refreshBooks(); refreshBorrows(); }} className="p-1.5 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Mark Lost"><Ban size={15} /></button>
                                </>
                              )}
                              {record.status === 'overdue' && (
                                <>
                                  <button onClick={() => openReturnModal(record)} className="p-1.5 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Return"><RotateCcw size={15} /></button>
                                  {!record.finePaid && record.fine > 0 && (
                                    <button onClick={() => { payFine(record.id); refreshBorrows(); }} className="p-1.5 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Pay Fine"><DollarSign size={15} /></button>
                                  )}
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {borrowRecords.length === 0 && (
                        <tr><td colSpan={9} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No borrow records yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── Reports Tab ── */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6">
                <div className="flex gap-3 mb-6">
                  {[
                    { id: 'inventory', label: 'Inventory Summary' },
                    { id: 'overdue', label: 'Overdue Books' },
                    { id: 'popular', label: 'Popular Books' },
                  ].map(r => (
                    <button key={r.id} onClick={() => setReportType(r.id as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${reportType === r.id ? 'bg-brand-primary text-white border-brand-primary' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]'}`}>
                      {r.label}
                    </button>
                  ))}
                </div>

                {reportType === 'inventory' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Total Titles</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{inventory.totalBooks}</p>
                    </div>
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Total Copies</p>
                      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{inventory.totalCopies}</p>
                    </div>
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Available</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">{inventory.availableCopies}</p>
                    </div>
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Issued</p>
                      <p className="text-2xl font-bold text-brand-primary mt-1">{inventory.issuedCopies}</p>
                    </div>
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Lost</p>
                      <p className="text-2xl font-bold text-rose-600 mt-1">{inventory.lostCopies}</p>
                    </div>
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <p className="text-sm text-[var(--text-muted)]">Archived</p>
                      <p className="text-2xl font-bold text-amber-600 mt-1">{inventory.archivedBooks}</p>
                    </div>
                  </div>
                )}

                {reportType === 'overdue' && (
                  <div className="overflow-x-auto">
                    {overdueRecords.length === 0 ? (
                      <div className="text-center py-12 text-sm text-[var(--text-muted)]">No overdue books. All books have been returned on time.</div>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                          <tr>
                            <th className="px-6 py-4 font-semibold">Book</th>
                            <th className="px-6 py-4 font-semibold">Borrower</th>
                            <th className="px-6 py-4 font-semibold">Issue Date</th>
                            <th className="px-6 py-4 font-semibold">Due Date</th>
                            <th className="px-6 py-4 font-semibold">Days Overdue</th>
                            <th className="px-6 py-4 font-semibold">Fine</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                          {overdueRecords.map(r => {
                            const daysOver = Math.ceil((new Date().getTime() - new Date(r.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                            return (
                              <tr key={r.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{r.bookTitle}</td>
                                <td className="px-6 py-4">{r.userName}</td>
                                <td className="px-6 py-4 text-[var(--text-muted)]">{new Date(r.issueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-rose-600 font-medium">{new Date(r.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className="font-bold text-rose-600">{daysOver}</span></td>
                                <td className="px-6 py-4 font-medium text-rose-600">৳{r.fine}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {reportType === 'popular' && (
                  <div className="overflow-x-auto">
                    {popularBooks.length === 0 ? (
                      <div className="text-center py-12 text-sm text-[var(--text-muted)]">No borrowing data available yet.</div>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                          <tr>
                            <th className="px-6 py-4 font-semibold">#</th>
                            <th className="px-6 py-4 font-semibold">Book</th>
                            <th className="px-6 py-4 font-semibold">Times Borrowed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                          {popularBooks.map((b, i) => (
                            <tr key={b.bookId} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                              <td className="px-6 py-4 text-[var(--text-muted)] font-medium">{i + 1}</td>
                              <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{b.bookTitle}</td>
                              <td className="px-6 py-4"><span className="font-bold text-brand-primary">{b.borrowCount}x</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Book Modal ── */}
      <AnimatePresence>
        {bookModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closeBookModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)] z-10 rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">
                  {bookModal.mode === 'create' ? 'Add Book' : bookModal.mode === 'edit' ? 'Edit Book' : 'Book Details'}
                </h3>
                <button onClick={closeBookModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Title <span className="text-rose-500">*</span></label>
                    <input type="text" value={bookModal.data.title || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, title: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Author <span className="text-rose-500">*</span></label>
                    <input type="text" value={bookModal.data.author || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, author: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">ISBN <span className="text-rose-500">*</span></label>
                    <input type="text" value={bookModal.data.isbn || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, isbn: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Publisher</label>
                    <input type="text" value={bookModal.data.publisher || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, publisher: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Edition</label>
                    <input type="text" value={bookModal.data.edition || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, edition: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Category <span className="text-rose-500">*</span></label>
                    <select value={bookModal.data.category || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, category: e.target.value } }))}
                      disabled={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] disabled:bg-[var(--bg-tertiary)]">
                      {BOOK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Language</label>
                    <select value={bookModal.data.language || 'English'} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, language: e.target.value } }))}
                      disabled={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] disabled:bg-[var(--bg-tertiary)]">
                      {BOOK_LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Subject</label>
                    <input type="text" value={bookModal.data.subject || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, subject: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Publication Year</label>
                    <input type="number" value={bookModal.data.publicationYear || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, publicationYear: Number(e.target.value) } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Total Copies <span className="text-rose-500">*</span></label>
                    <input type="number" value={bookModal.data.totalCopies || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, totalCopies: Number(e.target.value) } }))}
                      readOnly={bookModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                  <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Shelf Location</label>
                    <input type="text" value={bookModal.data.shelfLocation || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, shelfLocation: e.target.value } }))}
                      readOnly={bookModal.mode === 'view'}
                      placeholder="e.g. Shelf A-12"
                      className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>
                </div>

                {/* Class Association */}
                {bookModal.mode !== 'view' && (
                  <div>
                    <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">Associated Classes</label>
                    <div className="flex flex-wrap gap-1.5">
                      {classes.map(c => {
                        const checked = (bookModal.data.classIds || []).includes(c.id);
                        return (
                          <button key={c.id} type="button" onClick={() => toggleBookClass(c.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${checked ? 'bg-brand-primary text-white border-brand-primary' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border-light)] hover:bg-[var(--bg-tertiary)]'}`}>
                            {c.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {bookModal.mode === 'view' && bookModal.data.classIds && bookModal.data.classIds.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">Associated Classes</label>
                    <div className="flex flex-wrap gap-1.5">
                      {bookModal.data.classIds.map(cid => {
                        const cls = classes.find(c => c.id === cid);
                        return cls ? (
                          <span key={cid} className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-brand-primary text-white border-brand-primary">{cls.name}</span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Description</label>
                  <textarea value={bookModal.data.description || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, description: e.target.value } }))}
                    readOnly={bookModal.mode === 'view'}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[60px] bg-[var(--bg-secondary)] read-only:bg-[var(--bg-tertiary)]" /></div>

                {bookModal.mode !== 'view' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Thumbnail URL</label>
                      <input type="text" value={bookModal.data.thumbnail || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, thumbnail: e.target.value } }))}
                        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]" /></div>
                    <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">PDF URL (digital resource)</label>
                      <input type="text" value={bookModal.data.pdfUrl || ''} onChange={e => setBookModal(p => ({ ...p, data: { ...p.data, pdfUrl: e.target.value } }))}
                        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]" /></div>
                  </div>
                )}

                {bookModal.mode === 'view' && (
                  <div className="text-sm bg-[var(--bg-tertiary)] rounded-xl p-3 space-y-1">
                    <div className="flex justify-between"><span className="text-[var(--text-muted)]">Copies:</span><span className="font-medium text-[var(--text-primary)]">{bookModal.data.availableCopies} / {bookModal.data.totalCopies} available</span></div>
                    {bookModal.data.pdfUrl && <div className="flex justify-between"><span className="text-[var(--text-muted)]">Digital:</span><a href={bookModal.data.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Open PDF</a></div>}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeBookModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">
                  {bookModal.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {bookModal.mode !== 'view' && (
                  <button onClick={handleSaveBook} disabled={bookSaving}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${bookSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                    {bookSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {bookModal.mode === 'create' ? 'Add Book' : 'Save Changes'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Issue Book Modal ── */}
      <AnimatePresence>
        {issueModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closeIssueModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Issue a Book</h3>
                <button onClick={closeIssueModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Book <span className="text-rose-500">*</span></label>
                  <select value={issueData.bookId} onChange={e => setIssueData(p => ({ ...p, bookId: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                    <option value="">— Select —</option>
                    {books.filter(b => !b.isArchived && b.availableCopies > 0).map(b => (
                      <option key={b.id} value={b.id}>{b.title} ({b.availableCopies} available)</option>
                    ))}
                  </select></div>

                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">User Role</label>
                  <select value={issueData.userRole} onChange={e => setIssueData(p => ({ ...p, userRole: e.target.value as UserRole, userId: '', userName: '' }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                  </select></div>

                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">User <span className="text-rose-500">*</span></label>
                  <select value={issueData.userId} onChange={e => {
                    const users = getUserOptions();
                    const u = users.find((u: any) => u.id === e.target.value);
                    setIssueData(p => ({ ...p, userId: e.target.value, userName: u?.name || u?.fullName || '', classId: u?.class ? Number(u.class) : undefined, section: u?.section || '' }));
                  }} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-[var(--bg-secondary)]">
                    <option value="">— Select —</option>
                    {getUserOptions().map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name || u.fullName} ({u.id})</option>
                    ))}
                  </select></div>

                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Due Date <span className="text-rose-500">*</span></label>
                  <input type="date" value={issueData.dueDate} onChange={e => setIssueData(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeIssueModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleIssue} disabled={issueSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${issueSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {issueSaving ? <Loader2 size={16} className="animate-spin" /> : <BookMarked size={16} />}
                  Issue Book
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Return Book Modal ── */}
      <AnimatePresence>
        {returnModal.open && returnModal.record && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/30 backdrop-blur-sm" onClick={closeReturnModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-md z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Return Book</h3>
                <button onClick={closeReturnModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-sm bg-[var(--bg-tertiary)] rounded-xl p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Book:</span><span className="font-medium text-[var(--text-primary)]">{returnModal.record.bookTitle}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Borrower:</span><span className="font-medium text-[var(--text-primary)]">{returnModal.record.userName}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Due Date:</span><span className="font-medium text-[var(--text-primary)]">{new Date(returnModal.record.dueDate).toLocaleDateString()}</span></div>
                  {(() => {
                    const fine = calculateFine(returnModal.record.dueDate, returnDate || new Date().toISOString().split('T')[0]);
                    return fine > 0 ? (
                      <div className="flex justify-between"><span className="text-[var(--text-muted)]">Fine:</span><span className="font-bold text-rose-600">৳{fine}</span></div>
                    ) : null;
                  })()}
                </div>
                <div className="space-y-1"><label className="text-sm font-medium text-[var(--text-primary)]">Return Date</label>
                    <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" /></div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeReturnModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleReturn} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Confirm Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
