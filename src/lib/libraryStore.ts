'use client';

// ── Types ──
export type UserRole = 'student' | 'teacher' | 'staff';
export type BorrowStatus = 'issued' | 'returned' | 'overdue' | 'lost';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  category: string;
  language: string;
  classIds: number[];
  subject: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  description: string;
  thumbnail: string;
  pdfUrl: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  classId?: number;
  section?: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  renewCount: number;
  status: BorrowStatus;
  fine: number;
  finePaid: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Storage ──
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

// ── ID Generation ──
let bookCounter = 6;
function nextBookId(): string {
  bookCounter++;
  return `BK-${String(bookCounter).padStart(4, '0')}`;
}

let borrowCounter = 0;
function nextBorrowId(): string {
  borrowCounter++;
  return `BRW-${Date.now()}-${borrowCounter}`;
}

// ── Default Books ──
const defaultBooks: Book[] = [
  {
    id: 'BK-0001', isbn: '978-0-262-53001-3', title: 'Fundamentals of Calculus',
    author: 'Gilbert Strang', publisher: 'MIT Press', edition: '2nd Edition',
    category: 'Mathematics', language: 'English', classIds: [5], subject: 'Mathematics',
    publicationYear: 2010, totalCopies: 5, availableCopies: 4,
    shelfLocation: 'Shelf A-12', description: 'A comprehensive guide to calculus fundamentals.',
    thumbnail: 'https://images.unsplash.com/photo-1543004629-141a4446255c?auto=format&fit=crop&q=80&w=200',
    pdfUrl: 'https://ocw.mit.edu/ans7870/resources/Strang/Edited/Calculus/Calculus.pdf',
    isArchived: false, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'BK-0002', isbn: '978-0-13-235088-4', title: 'Clean Code',
    author: 'Robert C. Martin', publisher: 'Prentice Hall', edition: '1st Edition',
    category: 'Programming', language: 'English', classIds: [], subject: 'Computer Science',
    publicationYear: 2008, totalCopies: 3, availableCopies: 3,
    shelfLocation: 'Shelf B-05', description: 'A handbook of agile software craftsmanship.',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=200',
    pdfUrl: 'https://web.archive.org/web/20180328221805/http://files.meetup.com/1837728/Clean%20Code.pdf',
    isArchived: false, createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'BK-0003', isbn: '978-0-7432-7356-5', title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald', publisher: 'Scribner', edition: 'Reprint Edition',
    category: 'English', language: 'English', classIds: [5], subject: 'English Literature',
    publicationYear: 1925, totalCopies: 4, availableCopies: 3,
    shelfLocation: 'Shelf C-08', description: 'A classic of American literature.',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200',
    pdfUrl: 'https://www.planetpublish.com/wp-content/uploads/2011/11/The_Great_Gatsby.pdf',
    isArchived: false, createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: 'BK-0004', isbn: '978-0-19-953556-6', title: 'Bangla Grammar for High School',
    author: 'Dr. Muhammad Shahidullah', publisher: 'University Press', edition: '3rd Edition',
    category: 'Language', language: 'Bengali', classIds: [1, 2, 3], subject: 'Bangla',
    publicationYear: 2015, totalCopies: 10, availableCopies: 10,
    shelfLocation: 'Shelf D-01', description: 'Comprehensive Bangla grammar textbook for high school students.',
    thumbnail: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?auto=format&fit=crop&q=80&w=200',
    pdfUrl: '', isArchived: false,
    createdAt: '2024-04-01T00:00:00Z', updatedAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'BK-0005', isbn: '978-0-07-174135-3', title: 'Physics for Scientists and Engineers',
    author: 'Serway & Jewett', publisher: 'McGraw Hill', edition: '9th Edition',
    category: 'Science', language: 'English', classIds: [5], subject: 'Physics',
    publicationYear: 2013, totalCopies: 6, availableCopies: 5,
    shelfLocation: 'Shelf A-08', description: 'Standard physics textbook for higher secondary students.',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200',
    pdfUrl: '', isArchived: false,
    createdAt: '2024-05-10T00:00:00Z', updatedAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 'BK-0006', isbn: '978-0-691-17903-0', title: 'Islamic Studies for Class 9-10',
    author: 'National Curriculum Board', publisher: 'NCTB', edition: '2024 Edition',
    category: 'Islamic Studies', language: 'Bengali', classIds: [3, 4], subject: 'Islamic Studies',
    publicationYear: 2024, totalCopies: 15, availableCopies: 15,
    shelfLocation: 'Shelf D-04', description: 'NCTB approved Islamic Studies textbook.',
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200',
    pdfUrl: '', isArchived: false,
    createdAt: '2024-06-01T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z',
  },
];

// ── Default Borrow Records ──
const defaultBorrows: BorrowRecord[] = [
  {
    id: 'BRW-1', bookId: 'BK-0001', bookTitle: 'Fundamentals of Calculus',
    userId: 'STU-2023-001', userName: 'Aarav Rahman', userRole: 'student',
    classId: 5, section: 'A', issueDate: '2026-05-20', dueDate: '2026-06-03',
    returnDate: null, renewCount: 0, status: 'issued', fine: 0, finePaid: true, notes: '',
    createdAt: '2026-05-20T00:00:00Z', updatedAt: '2026-05-20T00:00:00Z',
  },
  {
    id: 'BRW-2', bookId: 'BK-0003', bookTitle: 'The Great Gatsby',
    userId: 'STU-2023-001', userName: 'Aarav Rahman', userRole: 'student',
    classId: 5, section: 'A', issueDate: '2026-05-15', dueDate: '2026-05-29',
    returnDate: '2026-05-28', renewCount: 0, status: 'returned', fine: 0, finePaid: true, notes: '',
    createdAt: '2026-05-15T00:00:00Z', updatedAt: '2026-05-28T00:00:00Z',
  },
  {
    id: 'BRW-3', bookId: 'BK-0005', bookTitle: 'Physics for Scientists and Engineers',
    userId: 'STU-2023-002', userName: 'Zara Khan', userRole: 'student',
    classId: 5, section: 'B', issueDate: '2026-05-10', dueDate: '2026-05-24',
    returnDate: null, renewCount: 1, status: 'overdue', fine: 5, finePaid: false, notes: '',
    createdAt: '2026-05-10T00:00:00Z', updatedAt: '2026-05-10T00:00:00Z',
  },
];

// ── Books CRUD ──
export function getBooks(): Book[] {
  return loadFromStorage<Book>('library_books', defaultBooks);
}

function saveBooks(data: Book[]): void {
  saveToStorage('library_books', data);
}

export function getBook(id: string): Book | undefined {
  return getBooks().find(b => b.id === id);
}

export function createBook(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'availableCopies'>): Book {
  const list = getBooks();
  const now = new Date().toISOString();
  const book: Book = {
    ...data, id: nextBookId(), availableCopies: data.totalCopies,
    createdAt: now, updatedAt: now,
  };
  list.push(book);
  saveBooks(list);
  return book;
}

export function updateBook(id: string, data: Partial<Book>): Book | null {
  const list = getBooks();
  const idx = list.findIndex(b => b.id === id);
  if (idx < 0) return null;
  const updated = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  list[idx] = updated;
  saveBooks(list);
  return list[idx];
}

export function deleteBook(id: string): boolean {
  const borrows = getBorrowRecords();
  if (borrows.some(b => b.bookId === id && b.status === 'issued')) return false;
  const list = getBooks().filter(b => b.id !== id);
  if (list.length === getBooks().length) return false;
  saveBooks(list);
  return true;
}

export function archiveBook(id: string): Book | null {
  return updateBook(id, { isArchived: true });
}

export function restoreBook(id: string): Book | null {
  return updateBook(id, { isArchived: false });
}

// ── Borrow Records ──
export function getBorrowRecords(): BorrowRecord[] {
  return loadFromStorage<BorrowRecord>('library_borrows', defaultBorrows);
}

function saveBorrowRecords(data: BorrowRecord[]): void {
  saveToStorage('library_borrows', data);
}

export function issueBook(
  bookId: string, userId: string, userName: string, userRole: UserRole,
  dueDate: string, classId?: number, section?: string,
): BorrowRecord | null {
  const books = getBooks();
  const book = books.find(b => b.id === bookId);
  if (!book || book.availableCopies <= 0) return null;
  const existing = getBorrowRecords().find(
    b => b.bookId === bookId && b.userId === userId && b.status === 'issued'
  );
  if (existing) return null;

  const list = getBorrowRecords();
  const now = new Date().toISOString();
  const record: BorrowRecord = {
    id: nextBorrowId(), bookId, bookTitle: book.title,
    userId, userName, userRole, classId, section,
    issueDate: now.split('T')[0], dueDate,
    returnDate: null, renewCount: 0, status: 'issued',
    fine: 0, finePaid: true, notes: '',
    createdAt: now, updatedAt: now,
  };
  list.push(record);
  saveBorrowRecords(list);

  book.availableCopies--;
  book.updatedAt = now;
  saveBooks(books);
  return record;
}

export function returnBook(borrowId: string, returnDate?: string): BorrowRecord | null {
  const list = getBorrowRecords();
  const idx = list.findIndex(b => b.id === borrowId);
  if (idx < 0 || list[idx].status === 'returned') return null;
  const now = returnDate || new Date().toISOString().split('T')[0];
  const fine = calculateFine(list[idx].dueDate, now);
  list[idx] = { ...list[idx], returnDate: now, status: 'returned', fine, updatedAt: new Date().toISOString() };
  saveBorrowRecords(list);

  const books = getBooks();
  const book = books.find(b => b.id === list[idx].bookId);
  if (book) {
    book.availableCopies++;
    book.updatedAt = new Date().toISOString();
    saveBooks(books);
  }
  return list[idx];
}

export function renewBook(borrowId: string, extraDays: number = 14): BorrowRecord | null {
  const list = getBorrowRecords();
  const idx = list.findIndex(b => b.id === borrowId);
  if (idx < 0 || list[idx].status !== 'issued' || list[idx].renewCount >= 2) return null;
  const currentDue = new Date(list[idx].dueDate);
  currentDue.setDate(currentDue.getDate() + extraDays);
  list[idx] = {
    ...list[idx], dueDate: currentDue.toISOString().split('T')[0],
    renewCount: list[idx].renewCount + 1, updatedAt: new Date().toISOString(),
  };
  saveBorrowRecords(list);
  return list[idx];
}

export function markAsLost(borrowId: string): BorrowRecord | null {
  const list = getBorrowRecords();
  const idx = list.findIndex(b => b.id === borrowId);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status: 'lost', fine: list[idx].fine || 200, updatedAt: new Date().toISOString() };
  saveBorrowRecords(list);

  const books = getBooks();
  const book = books.find(b => b.id === list[idx].bookId);
  if (book) {
    book.totalCopies = Math.max(0, book.totalCopies - 1);
    book.availableCopies = Math.max(0, book.availableCopies - 1);
    saveBooks(books);
  }
  return list[idx];
}

export function payFine(borrowId: string): BorrowRecord | null {
  const list = getBorrowRecords();
  const idx = list.findIndex(b => b.id === borrowId);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], finePaid: true, updatedAt: new Date().toISOString() };
  saveBorrowRecords(list);
  return list[idx];
}

// ── Fine Calculation ──
export function calculateFine(dueDate: string, returnDate: string): number {
  const due = new Date(dueDate);
  const ret = new Date(returnDate);
  if (ret <= due) return 0;
  const diffDays = Math.ceil((ret.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays * 5;
}

export function refreshOverdueStatus(): number {
  const list = getBorrowRecords();
  let count = 0;
  const today = new Date().toISOString().split('T')[0];
  for (const record of list) {
    if (record.status === 'issued' && record.dueDate < today) {
      record.status = 'overdue';
      record.fine = calculateFine(record.dueDate, today);
      record.updatedAt = new Date().toISOString();
      count++;
    }
  }
  if (count > 0) saveBorrowRecords(list);
  return count;
}

// ── Search & Filters ──
export interface BookFilters {
  search?: string;
  category?: string;
  isbn?: string;
  author?: string;
  subject?: string;
  classId?: number;
  language?: string;
  availability?: 'all' | 'available' | 'unavailable';
  isArchived?: boolean;
}

export function searchBooks(filters: BookFilters): Book[] {
  let list = getBooks().filter(b => b.isArchived === (filters.isArchived ?? false));
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.publisher.toLowerCase().includes(q)
    );
  }
  if (filters.category) list = list.filter(b => b.category === filters.category);
  if (filters.isbn) list = list.filter(b => b.isbn.toLowerCase().includes(filters.isbn!.toLowerCase()));
  if (filters.author) list = list.filter(b => b.author.toLowerCase().includes(filters.author!.toLowerCase()));
  if (filters.subject) list = list.filter(b => b.subject.toLowerCase().includes(filters.subject!.toLowerCase()));
  if (filters.classId) list = list.filter(b => b.classIds.includes(filters.classId!));
  if (filters.language) list = list.filter(b => b.language === filters.language);
  if (filters.availability === 'available') list = list.filter(b => b.availableCopies > 0);
  if (filters.availability === 'unavailable') list = list.filter(b => b.availableCopies <= 0);
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ── Reports ──
export function getIssuedRecords(filters?: { status?: string; userId?: string; userRole?: string }): BorrowRecord[] {
  let list = getBorrowRecords();
  if (filters?.status) list = list.filter(r => r.status === filters.status);
  if (filters?.userId) list = list.filter(r => r.userId === filters.userId);
  if (filters?.userRole) list = list.filter(r => r.userRole === filters.userRole);
  return list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
}

export function getOverdueRecords(): BorrowRecord[] {
  return getBorrowRecords().filter(r => r.status === 'overdue' || (r.status === 'issued' && r.dueDate < new Date().toISOString().split('T')[0]));
}

export function getPopularBooks(limit: number = 10): { bookId: string; bookTitle: string; borrowCount: number }[] {
  const records = getBorrowRecords();
  const countMap: Record<string, number> = {};
  for (const r of records) {
    countMap[r.bookId] = (countMap[r.bookId] || 0) + 1;
  }
  return Object.entries(countMap)
    .map(([bookId, borrowCount]) => ({
      bookId, bookTitle: records.find(r => r.bookId === bookId)?.bookTitle || 'Unknown',
      borrowCount,
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, limit);
}

export function getStudentUsage(studentId: string): { total: number; issued: number; returned: number; overdue: number; lost: number } {
  const records = getBorrowRecords().filter(r => r.userId === studentId);
  return {
    total: records.length,
    issued: records.filter(r => r.status === 'issued').length,
    returned: records.filter(r => r.status === 'returned').length,
    overdue: records.filter(r => r.status === 'overdue').length,
    lost: records.filter(r => r.status === 'lost').length,
  };
}

export function getInventoryReport(): { totalBooks: number; totalCopies: number; availableCopies: number; issuedCopies: number; lostCopies: number; archivedBooks: number } {
  const books = getBooks();
  const records = getBorrowRecords();
  return {
    totalBooks: books.filter(b => !b.isArchived).length,
    totalCopies: books.filter(b => !b.isArchived).reduce((s, b) => s + b.totalCopies, 0),
    availableCopies: books.filter(b => !b.isArchived).reduce((s, b) => s + b.availableCopies, 0),
    issuedCopies: records.filter(r => r.status === 'issued' || r.status === 'overdue').length,
    lostCopies: records.filter(r => r.status === 'lost').length,
    archivedBooks: books.filter(b => b.isArchived).length,
  };
}

// ── Validation ──
export function validateBook(data: Partial<Book>): string[] {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push('Book title is required.');
  if (!data.author?.trim()) errors.push('Author is required.');
  if (!data.isbn?.trim()) errors.push('ISBN is required.');
  if (!data.category?.trim()) errors.push('Category is required.');
  if (!data.totalCopies || data.totalCopies <= 0) errors.push('Total copies must be greater than zero.');
  if (data.publicationYear && (data.publicationYear < 1000 || data.publicationYear > new Date().getFullYear())) {
    errors.push('Invalid publication year.');
  }
  return errors;
}

function isDuplicateISBN(isbn: string, excludeId?: string): boolean {
  return getBooks().some(b => b.isbn.toLowerCase() === isbn.toLowerCase() && b.id !== excludeId);
}

export function validateISBN(isbn: string, excludeId?: string): string | null {
  if (!isbn.trim()) return 'ISBN is required.';
  if (isDuplicateISBN(isbn, excludeId)) return 'A book with this ISBN already exists.';
  return null;
}

// ── Export ──
export function exportBooksToCSV(books: Book[]): void {
  const headers = ['ID', 'Title', 'ISBN', 'Author', 'Publisher', 'Edition', 'Category', 'Language', 'Subject', 'Year', 'Total Copies', 'Available', 'Shelf'];
  const rows = books.map(b => [b.id, b.title, b.isbn, b.author, b.publisher, b.edition, b.category, b.language, b.subject, String(b.publicationYear), String(b.totalCopies), String(b.availableCopies), b.shelfLocation]);
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `library-books-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Helpers ──
export const BOOK_CATEGORIES = [
  'Mathematics', 'Science', 'English', 'Programming', 'Islamic Studies',
  'General Knowledge', 'Language', 'History', 'Geography', 'Bangla',
  'Art', 'Biography', 'Reference', 'Fiction', 'Non-Fiction', 'Other',
];

export const BOOK_LANGUAGES = ['English', 'Bengali', 'Arabic', 'Hindi', 'Urdu'];

export function loadClasses(): { id: number; name: string }[] {
  try { const s = localStorage.getItem('academic_classes'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

export function loadStudents(): { id: string; name: string; class: string; section: string; roll: string }[] {
  try { const s = localStorage.getItem('students'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

export function loadTeachers() {
  try { const s = localStorage.getItem('teachers'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

export function loadStaff() {
  try { const s = localStorage.getItem('staff'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}
