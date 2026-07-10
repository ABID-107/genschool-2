'use client';

export type NoticeStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type NoticePriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoticeCategory =
  | 'general' | 'academic' | 'holiday' | 'exam' | 'event'
  | 'emergency' | 'finance' | 'sports' | 'other';

export type AudienceType =
  | 'all' | 'students' | 'teachers' | 'guardians' | 'staff';

export interface AudienceTarget {
  type: AudienceType | 'class' | 'section';
  id?: number | string;
  label?: string;
}

export interface NoticeAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  priority: NoticePriority;
  audience: AudienceTarget[];
  publishDate: string;
  expiryDate: string;
  author: string;
  status: NoticeStatus;
  attachments: NoticeAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface NoticeFilters {
  search?: string;
  category?: NoticeCategory | '';
  priority?: NoticePriority | '';
  audience?: AudienceType | '';
  status?: NoticeStatus | '';
  dateFrom?: string;
  dateTo?: string;
  author?: string;
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
let noticeCounter = 3;
function nextNoticeId(): string {
  noticeCounter++;
  return `NOT-${String(noticeCounter).padStart(3, '0')}`;
}

// ── Default Data ──
const defaultNotices: Notice[] = [
  {
    id: 'NOT-001', title: 'Eid-ul-Fitr Vacation Notice',
    description: 'School will remain closed from June 10 to June 20, 2026 on the occasion of Eid-ul-Fitr. All students and staff are advised to plan accordingly.',
    category: 'holiday', priority: 'medium',
    audience: [{ type: 'all' }],
    publishDate: '2026-06-01', expiryDate: '2026-06-20',
    author: 'Admin', status: 'published',
    attachments: [], createdAt: '2026-05-28T00:00:00Z', updatedAt: '2026-05-28T00:00:00Z',
  },
  {
    id: 'NOT-002', title: 'Class 10 Special Preparatory Classes',
    description: 'Special preparatory classes for Class 10 board exams will begin from July 1. Attendance is mandatory for all Class 10 students.',
    category: 'academic', priority: 'high',
    audience: [{ type: 'class', id: 5, label: 'Class 10' }],
    publishDate: '2026-06-15', expiryDate: '2026-06-30',
    author: 'Admin', status: 'scheduled',
    attachments: [], createdAt: '2026-05-29T00:00:00Z', updatedAt: '2026-05-29T00:00:00Z',
  },
  {
    id: 'NOT-003', title: 'Monthly Tuition Fee Reminder',
    description: 'This is a reminder that monthly tuition fees are due by June 10. Late payments will incur a fine of ৳50 per day.',
    category: 'finance', priority: 'medium',
    audience: [{ type: 'guardians' }],
    publishDate: '2026-06-01', expiryDate: '2026-06-15',
    author: 'Accounts', status: 'published',
    attachments: [], createdAt: '2026-05-30T00:00:00Z', updatedAt: '2026-05-30T00:00:00Z',
  },
];

// ── CRUD ──
export function getNotices(): Notice[] {
  const notices = loadFromStorage<Notice>('notice_board', defaultNotices);
  return notices.map(n => ({
    ...n,
    status: autoUpdateStatus(n),
  }));
}

function saveNotices(data: Notice[]): void {
  saveToStorage('notice_board', data);
}

function autoUpdateStatus(notice: Notice): NoticeStatus {
  if (notice.status === 'archived') return 'archived';
  const now = new Date();
  const publish = new Date(notice.publishDate);
  const expiry = notice.expiryDate ? new Date(notice.expiryDate) : null;
  if (notice.status === 'scheduled' && publish <= now) return 'published';
  if (notice.status === 'published' && expiry && expiry < now) return 'archived';
  return notice.status;
}

export function createNotice(data: Omit<Notice, 'id' | 'createdAt' | 'updatedAt'>): Notice {
  const list = getNotices();
  const now = new Date().toISOString();
  const status = data.status === 'scheduled' && new Date(data.publishDate) <= new Date()
    ? 'published' : data.status;
  const notice: Notice = {
    ...data, id: nextNoticeId(), status, createdAt: now, updatedAt: now,
  };
  list.push(notice);
  saveNotices(list);
  return notice;
}

export function updateNotice(id: string, data: Partial<Notice>): Notice | null {
  const list = getNotices();
  const idx = list.findIndex(n => n.id === id);
  if (idx < 0) return null;
  const updated = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  updated.status = autoUpdateStatus(updated);
  list[idx] = updated;
  saveNotices(list);
  return list[idx];
}

export function deleteNotice(id: string): boolean {
  const list = getNotices().filter(n => n.id !== id);
  if (list.length === getNotices().length) return false;
  saveNotices(list);
  return true;
}

// ── Workflow Actions ──
export function publishNotice(id: string): Notice | null {
  return updateNotice(id, { status: 'published', publishDate: new Date().toISOString().split('T')[0] });
}

export function scheduleNotice(id: string, publishDate: string): Notice | null {
  return updateNotice(id, { status: 'scheduled', publishDate });
}

export function archiveNotice(id: string): Notice | null {
  return updateNotice(id, { status: 'archived' });
}

export function restoreNotice(id: string): Notice | null {
  return updateNotice(id, { status: 'draft' });
}

export function duplicateNotice(id: string): Notice | null {
  const original = getNotices().find(n => n.id === id);
  if (!original) return null;
  return createNotice({
    title: `${original.title} (Copy)`,
    description: original.description,
    category: original.category,
    priority: original.priority,
    audience: [...original.audience],
    publishDate: original.publishDate,
    expiryDate: original.expiryDate,
    author: original.author,
    status: 'draft',
    attachments: [],
  });
}

// ── Search & Filter ──
export function searchNotices(filters: NoticeFilters): Notice[] {
  let list = getNotices();
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.author.toLowerCase().includes(q) ||
      n.id.toLowerCase().includes(q)
    );
  }
  if (filters.category) list = list.filter(n => n.category === filters.category);
  if (filters.priority) list = list.filter(n => n.priority === filters.priority);
  if (filters.status) list = list.filter(n => n.status === filters.status);
  if (filters.audience) {
    list = list.filter(n => n.audience.some(a => a.type === filters.audience || a.type === 'all'));
  }
  if (filters.author) {
    list = list.filter(n => n.author.toLowerCase().includes(filters.author!.toLowerCase()));
  }
  if (filters.dateFrom) {
    list = list.filter(n => n.publishDate >= filters.dateFrom!);
  }
  if (filters.dateTo) {
    list = list.filter(n => n.publishDate <= filters.dateTo!);
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ── Visibility ──
export function getNoticesByAudience(
  role: 'all' | 'students' | 'teachers' | 'guardians' | 'staff',
  classId?: number,
  sectionId?: string,
): Notice[] {
  const now = new Date().toISOString().split('T')[0];
  return getNotices().filter(n => {
    if (n.status !== 'published') return false;
    if (n.expiryDate && n.expiryDate < now) return false;
    if (n.publishDate > now) return false;
    if (role === 'all') return true;
    return n.audience.some(a => {
      if (a.type === 'all') return true;
      if (a.type === role) return true;
      if (a.type === 'class' && classId && a.id === classId) return true;
      if (a.type === 'section' && sectionId && a.id === sectionId) return true;
      return false;
    });
  }).sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const pa = priorityOrder[a.priority];
    const pb = priorityOrder[b.priority];
    if (pa !== pb) return pa - pb;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });
}

// ── Scheduling ──
export function publishScheduledNotices(): number {
  const list = getNotices();
  let count = 0;
  const now = new Date();
  for (const notice of list) {
    if (notice.status === 'scheduled' && new Date(notice.publishDate) <= now) {
      notice.status = 'published';
      notice.updatedAt = now.toISOString();
      count++;
    }
  }
  if (count > 0) saveNotices(list);
  return count;
}

export function archiveExpiredNotices(): number {
  const list = getNotices();
  let count = 0;
  const now = new Date().toISOString().split('T')[0];
  for (const notice of list) {
    if (notice.status === 'published' && notice.expiryDate && notice.expiryDate < now) {
      notice.status = 'archived';
      notice.updatedAt = new Date().toISOString();
      count++;
    }
  }
  if (count > 0) saveNotices(list);
  return count;
}

// ── Validation ──
export function validateNotice(data: Partial<Notice>): string[] {
  const errors: string[] = [];
  if (!data.title?.trim()) errors.push('Title is required.');
  if (!data.description?.trim()) errors.push('Description is required.');
  if (!data.publishDate) errors.push('Publish date is required.');
  if (!data.audience?.length) errors.push('At least one audience target is required.');
  if (!data.author?.trim()) errors.push('Author is required.');
  if (data.expiryDate && data.publishDate && data.expiryDate < data.publishDate) {
    errors.push('Expiry date must be on or after publish date.');
  }
  return errors;
}

// ── Export ──
export function exportNoticesToCSV(notices: Notice[]): void {
  const headers = ['ID', 'Title', 'Category', 'Priority', 'Audience', 'Author', 'Status', 'Publish Date', 'Expiry Date', 'Created At'];
  const rows = notices.map(n => [
    n.id, n.title, n.category, n.priority,
    n.audience.map(a => a.label || a.type).join('; '),
    n.author, n.status, n.publishDate, n.expiryDate || '', n.createdAt,
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notices-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Helpers ──
export const NOTICE_CATEGORIES: { value: NoticeCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'academic', label: 'Academic' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'exam', label: 'Exam' },
  { value: 'event', label: 'Event' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'finance', label: 'Finance' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

export const NOTICE_PRIORITIES: { value: NoticePriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-[var(--text-muted)] bg-[var(--bg-secondary)]' },
  { value: 'medium', label: 'Medium', color: 'text-[var(--color-info)] bg-[var(--color-info-bg)]' },
  { value: 'high', label: 'High', color: 'text-[var(--color-warning)] bg-[var(--color-warning-bg)]' },
  { value: 'urgent', label: 'Urgent', color: 'text-[var(--color-error)] bg-[var(--color-error-bg)]' },
];

export const AUDIENCE_OPTIONS: { value: AudienceType | 'class' | 'section'; label: string }[] = [
  { value: 'all', label: 'All Users' },
  { value: 'students', label: 'Students' },
  { value: 'teachers', label: 'Teachers' },
  { value: 'guardians', label: 'Guardians' },
  { value: 'staff', label: 'Staff' },
];

export const NOTICE_STATUSES: { value: NoticeStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];
