export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';
export type UserType = 'student' | 'teacher' | 'staff';

export interface AttendanceRecord {
  id: string;
  date: string;
  userId: string;
  userName: string;
  userType: UserType;
  status: AttendanceStatus;
  time?: string;
  method?: string;
  note?: string;
  updatedAt: string;
}

export interface AttendanceFilters {
  date?: string;
  startDate?: string;
  endDate?: string;
  userType?: UserType;
  status?: AttendanceStatus;
  userId?: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  percentage: number;
}

const STORAGE_KEY = 'attendance_records';

function loadRecords(): AttendanceRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveRecords(records: AttendanceRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function markOrUpdateAttendance(
  date: string,
  userId: string,
  userName: string,
  userType: UserType,
  status: AttendanceStatus,
  time?: string,
  method?: string
): AttendanceRecord {
  const records = loadRecords();
  const existing = records.findIndex(r => r.date === date && r.userId === userId && r.userType === userType);
  const now = new Date().toISOString();
  if (existing >= 0) {
    records[existing] = { ...records[existing], status, time: time || records[existing].time, method: method || records[existing].method, updatedAt: now };
    saveRecords(records);
    return records[existing];
  }
  const record: AttendanceRecord = {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    date, userId, userName, userType, status,
    time: time || now.slice(11, 16),
    method: method || 'Manual',
    updatedAt: now,
  };
  records.push(record);
  saveRecords(records);
  return record;
}

export function updateAttendanceById(id: string, updates: Partial<AttendanceRecord>): AttendanceRecord | null {
  const records = loadRecords();
  const idx = records.findIndex(r => r.id === id);
  if (idx < 0) return null;
  records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() };
  saveRecords(records);
  return records[idx];
}

export function deleteAttendance(id: string): boolean {
  const records = loadRecords();
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length === records.length) return false;
  saveRecords(filtered);
  return true;
}

export function getAttendance(filters: AttendanceFilters): AttendanceRecord[] {
  const records = loadRecords();
  return records.filter(r => {
    if (filters.date && r.date !== filters.date) return false;
    if (filters.startDate && r.date < filters.startDate) return false;
    if (filters.endDate && r.date > filters.endDate) return false;
    if (filters.userType && r.userType !== filters.userType) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.userId && r.userId !== filters.userId) return false;
    return true;
  });
}

export function getAttendanceByDate(date: string, userType: UserType = 'student'): AttendanceRecord[] {
  return getAttendance({ date, userType });
}

export function getUserAttendanceHistory(userId: string, userType: UserType = 'student'): AttendanceRecord[] {
  return getAttendance({ userId, userType });
}

export function getSummary(records: AttendanceRecord[]): AttendanceSummary {
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const leave = records.filter(r => r.status === 'leave').length;
  const total = present + absent + late + leave;
  return {
    total,
    present,
    absent,
    late,
    leave,
    percentage: total > 0 ? Math.round((present / total) * 100) : 0,
  };
}

export function getMonthlySummary(year: number, month: number, userType: UserType = 'student'): AttendanceSummary {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const records = getAttendance({
    startDate: `${monthStr}-01`,
    endDate: `${monthStr}-31`,
    userType,
  });
  return getSummary(records);
}

export function validateAttendanceInput(
  date: string,
  userId: string,
  userType: UserType,
  status: AttendanceStatus
): string[] {
  const errors: string[] = [];
  if (!date) errors.push('Date is required');
  if (!userId) errors.push('User ID is required');
  if (!userType || !['student', 'teacher', 'staff'].includes(userType)) errors.push('Valid user type is required');
  if (!status || !['present', 'absent', 'late', 'leave'].includes(status)) errors.push('Valid status is required (present, absent, late, leave)');
  return errors;
}
