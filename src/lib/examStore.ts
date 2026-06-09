'use client';

export type ExamStatus = 'draft' | 'upcoming' | 'grading' | 'published' | 'archived';

export interface Exam {
  id: string;
  name: string;
  academicYear: string;
  term: string;
  examType: string;
  startDate: string;
  endDate: string;
  classIds: number[];
  sectionIds: number[];
  description: string;
  status: ExamStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExamSchedule {
  id: string;
  examId: string;
  subjectId: number;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  invigilator: string;
  fullMarks: number;
  passMarks: number;
  isPractical: boolean;
  createdAt: string;
}

export interface MarksEntry {
  id: string;
  examId: string;
  scheduleId: string;
  studentId: string;
  studentName: string;
  subjectId: number;
  subjectName: string;
  obtainedMarks: number;
  fullMarks: number;
  passMarks: number;
  grade: string;
  gradePoint: number;
  isAbsent: boolean;
  remarks: string;
  enteredBy: string;
  enteredAt: string;
}

export interface SubjectResult {
  subjectId: number;
  subjectName: string;
  fullMarks: number;
  passMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoint: number;
  isAbsent: boolean;
  isPassed: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  totalMarks: number;
  totalFullMarks: number;
  gpa: number;
  grade: string;
  meritPosition: number;
  isPassed: boolean;
  subjectResults: SubjectResult[];
  generatedAt: string;
}

export interface GradeConfig {
  label: string;
  minPercent: number;
  maxPercent: number;
  gradePoint: number;
}

export const DEFAULT_GRADE_CONFIG: GradeConfig[] = [
  { label: 'A+', minPercent: 80, maxPercent: 100, gradePoint: 5.00 },
  { label: 'A',  minPercent: 70, maxPercent: 79,  gradePoint: 4.00 },
  { label: 'A-', minPercent: 60, maxPercent: 69,  gradePoint: 3.50 },
  { label: 'B',  minPercent: 50, maxPercent: 59,  gradePoint: 3.00 },
  { label: 'C',  minPercent: 40, maxPercent: 49,  gradePoint: 2.00 },
  { label: 'D',  minPercent: 33, maxPercent: 39,  gradePoint: 1.00 },
  { label: 'F',  minPercent: 0,  maxPercent: 32,  gradePoint: 0.00 },
];

const STORAGE_KEYS = {
  EXAMS: 'exam_exams',
  SCHEDULES: 'exam_schedules',
  MARKS: 'exam_marks',
  RESULTS: 'exam_results',
  GRADE_CONFIG: 'exam_grade_config',
};

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

let examIdCounter = 3;
function nextExamId(): string {
  examIdCounter++;
  return `EXM-${new Date().getFullYear()}-${String(examIdCounter).padStart(2, '0')}`;
}

let scheduleIdCounter = 0;
function nextScheduleId(): string {
  scheduleIdCounter++;
  return `sch-${Date.now()}-${scheduleIdCounter}`;
}

let marksIdCounter = 0;
function nextMarksId(): string {
  marksIdCounter++;
  return `mrk-${Date.now()}-${marksIdCounter}`;
}

let resultIdCounter = 0;
function nextResultId(): string {
  resultIdCounter++;
  return `res-${Date.now()}-${resultIdCounter}`;
}

const defaultExams: Exam[] = [
  { id: 'EXM-26-01', name: 'Half-Yearly Examination 2026', academicYear: '2026-2027', term: '1st Term', examType: 'Terminal', startDate: '2026-06-15', endDate: '2026-06-30', classIds: [1, 2, 3, 4, 5], sectionIds: [], description: 'Comprehensive half-yearly assessment for all classes.', status: 'upcoming', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
  { id: 'EXM-26-02', name: 'Class Test 1 - Mathematics', academicYear: '2026-2027', term: '1st Term', examType: 'Class Test', startDate: '2026-05-20', endDate: '2026-05-20', classIds: [5], sectionIds: [], description: '', status: 'grading', createdAt: '2026-04-01T08:00:00Z', updatedAt: '2026-04-01T08:00:00Z' },
  { id: 'EXM-26-03', name: 'Annual Examination 2025', academicYear: '2025-2026', term: 'Final', examType: 'Final', startDate: '2025-11-10', endDate: '2025-11-30', classIds: [1, 2, 3, 4, 5], sectionIds: [], description: '', status: 'published', createdAt: '2025-09-01T10:00:00Z', updatedAt: '2025-09-01T10:00:00Z' },
];

export function calculateGrade(percentage: number, config: GradeConfig[] = DEFAULT_GRADE_CONFIG): { grade: string; gradePoint: number } {
  for (const g of config) {
    if (percentage >= g.minPercent && percentage <= g.maxPercent) {
      return { grade: g.label, gradePoint: g.gradePoint };
    }
  }
  return { grade: 'F', gradePoint: 0 };
}

export function getExams(): Exam[] {
  return loadFromStorage<Exam>(STORAGE_KEYS.EXAMS, defaultExams);
}

export function saveExams(exams: Exam[]): void {
  saveToStorage(STORAGE_KEYS.EXAMS, exams);
}

export function getExamById(id: string): Exam | undefined {
  return getExams().find(e => e.id === id);
}

export function createExam(data: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Exam {
  const exams = getExams();
  const now = new Date().toISOString();
  const exam: Exam = { ...data, id: nextExamId(), createdAt: now, updatedAt: now };
  exams.push(exam);
  saveExams(exams);
  return exam;
}

export function updateExam(id: string, data: Partial<Exam>): Exam | null {
  const exams = getExams();
  const idx = exams.findIndex(e => e.id === id);
  if (idx < 0) return null;
  exams[idx] = { ...exams[idx], ...data, updatedAt: new Date().toISOString() };
  saveExams(exams);
  return exams[idx];
}

export function deleteExam(id: string): boolean {
  const exams = getExams();
  const filtered = exams.filter(e => e.id !== id);
  if (filtered.length === exams.length) return false;
  saveExams(filtered);
  const schedules = getSchedulesByExam(id);
  schedules.forEach(s => deleteMarksBySchedule(s.id));
  const allSchedules = getSchedules();
  saveToStorage(STORAGE_KEYS.SCHEDULES, allSchedules.filter(s => s.examId !== id));
  const allResults = getResults();
  saveToStorage(STORAGE_KEYS.RESULTS, allResults.filter(r => r.examId !== id));
  return true;
}

export function archiveExam(id: string): Exam | null {
  return updateExam(id, { status: 'archived' });
}

export function publishExam(id: string): Exam | null {
  return updateExam(id, { status: 'published' });
}

// Schedule Management
export function getSchedules(): ExamSchedule[] {
  return loadFromStorage<ExamSchedule>(STORAGE_KEYS.SCHEDULES, []);
}

export function getSchedulesByExam(examId: string): ExamSchedule[] {
  return getSchedules().filter(s => s.examId === examId);
}

export function getScheduleById(id: string): ExamSchedule | undefined {
  return getSchedules().find(s => s.id === id);
}

export function createSchedule(data: Omit<ExamSchedule, 'id' | 'createdAt'>): ExamSchedule {
  const schedules = getSchedules();
  const schedule: ExamSchedule = { ...data, id: nextScheduleId(), createdAt: new Date().toISOString() };
  schedules.push(schedule);
  saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
  return schedule;
}

export function updateSchedule(id: string, data: Partial<ExamSchedule>): ExamSchedule | null {
  const schedules = getSchedules();
  const idx = schedules.findIndex(s => s.id === id);
  if (idx < 0) return null;
  schedules[idx] = { ...schedules[idx], ...data };
  saveToStorage(STORAGE_KEYS.SCHEDULES, schedules);
  return schedules[idx];
}

export function deleteSchedule(id: string): boolean {
  const schedules = getSchedules();
  const filtered = schedules.filter(s => s.id !== id);
  if (filtered.length === schedules.length) return false;
  saveToStorage(STORAGE_KEYS.SCHEDULES, filtered);
  deleteMarksBySchedule(id);
  return true;
}

export interface ConflictCheck {
  type: 'teacher' | 'room' | 'time';
  message: string;
  scheduleIds: string[];
}

export function checkScheduleConflicts(newSchedule: Omit<ExamSchedule, 'id' | 'createdAt'>, excludeId?: string): ConflictCheck[] {
  const schedules = getSchedules().filter(s => excludeId ? s.id !== excludeId : true);
  const conflicts: ConflictCheck[] = [];

  const sameDay = schedules.filter(s => s.date === newSchedule.date);

  for (const s of sameDay) {
    const newStart = timeToMinutes(newSchedule.startTime);
    const newEnd = timeToMinutes(newSchedule.endTime);
    const existStart = timeToMinutes(s.startTime);
    const existEnd = timeToMinutes(s.endTime);

    const timeOverlap = newStart < existEnd && newEnd > existStart;
    if (!timeOverlap) continue;

    if (s.invigilator && s.invigilator === newSchedule.invigilator) {
      conflicts.push({
        type: 'teacher',
        message: `Teacher "${s.invigilator}" is already assigned to "${s.subjectName}" on ${s.date} (${s.startTime}-${s.endTime})`,
        scheduleIds: [s.id],
      });
    }
    if (s.room && s.room === newSchedule.room) {
      conflicts.push({
        type: 'room',
        message: `Room "${s.room}" is already booked for "${s.subjectName}" on ${s.date} (${s.startTime}-${s.endTime})`,
        scheduleIds: [s.id],
      });
    }
    if (timeOverlap && s.subjectId === newSchedule.subjectId) {
      conflicts.push({
        type: 'time',
        message: `Time overlap with "${s.subjectName}" (${s.startTime}-${s.endTime})`,
        scheduleIds: [s.id],
      });
    }
  }

  return conflicts;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Marks Management
export function getMarks(): MarksEntry[] {
  return loadFromStorage<MarksEntry>(STORAGE_KEYS.MARKS, []);
}

export function getMarksByExam(examId: string): MarksEntry[] {
  return getMarks().filter(m => m.examId === examId);
}

export function getMarksBySchedule(scheduleId: string): MarksEntry[] {
  return getMarks().filter(m => m.scheduleId === scheduleId);
}

export function getMarksByStudent(examId: string, studentId: string): MarksEntry[] {
  return getMarks().filter(m => m.examId === examId && m.studentId === studentId);
}

export function setMarksEntry(
  examId: string,
  scheduleId: string,
  studentId: string,
  studentName: string,
  subjectId: number,
  subjectName: string,
  obtainedMarks: number,
  fullMarks: number,
  passMarks: number,
  isAbsent: boolean,
  remarks: string,
  enteredBy: string
): MarksEntry {
  const marks = getMarks();
  const existing = marks.findIndex(m => m.scheduleId === scheduleId && m.studentId === studentId);
  const percentage = !isAbsent && fullMarks > 0 ? (obtainedMarks / fullMarks) * 100 : 0;
  const { grade, gradePoint } = isAbsent ? { grade: '—', gradePoint: 0 } : calculateGrade(percentage);

  const entry: MarksEntry = {
    id: existing >= 0 ? marks[existing].id : nextMarksId(),
    examId, scheduleId, studentId, studentName, subjectId, subjectName,
    obtainedMarks, fullMarks, passMarks, grade, gradePoint,
    isAbsent, remarks, enteredBy,
    enteredAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    marks[existing] = entry;
  } else {
    marks.push(entry);
  }
  saveToStorage(STORAGE_KEYS.MARKS, marks);
  return entry;
}

export function deleteMarksBySchedule(scheduleId: string): void {
  const marks = getMarks();
  saveToStorage(STORAGE_KEYS.MARKS, marks.filter(m => m.scheduleId !== scheduleId));
}

export function deleteMarksByStudent(examId: string, studentId: string): void {
  const marks = getMarks();
  saveToStorage(STORAGE_KEYS.MARKS, marks.filter(m => !(m.examId === examId && m.studentId === studentId)));
}

export function bulkSetMarks(entries: Omit<MarksEntry, 'id' | 'grade' | 'gradePoint' | 'enteredAt'>[]): MarksEntry[] {
  const results: MarksEntry[] = [];
  for (const e of entries) {
    const r = setMarksEntry(e.examId, e.scheduleId, e.studentId, e.studentName, e.subjectId, e.subjectName, e.obtainedMarks, e.fullMarks, e.passMarks, e.isAbsent, e.remarks, e.enteredBy);
    results.push(r);
  }
  return results;
}

export function validateMarks(obtained: number, full: number): string[] {
  const errors: string[] = [];
  if (obtained < 0) errors.push('Obtained marks cannot be negative');
  if (full <= 0) errors.push('Full marks must be greater than zero');
  if (obtained > full) errors.push('Obtained marks cannot exceed full marks');
  return errors;
}

// Result Processing
export function getResults(): ExamResult[] {
  return loadFromStorage<ExamResult>(STORAGE_KEYS.RESULTS, []);
}

export function getResultsByExam(examId: string): ExamResult[] {
  return getResults().filter(r => r.examId === examId);
}

export function getResultByStudent(examId: string, studentId: string): ExamResult | undefined {
  return getResults().find(r => r.examId === examId && r.studentId === studentId);
}

export function generateResults(examId: string, students: { id: string; name: string; className: string; section: string }[]): ExamResult[] {
  const schedules = getSchedulesByExam(examId);
  if (schedules.length === 0) return [];
  const marks = getMarksByExam(examId);
  const existingResults = getResults();
  const filteredExisting = existingResults.filter(r => r.examId !== examId);

  const results: ExamResult[] = [];

  for (const student of students) {
    const studentMarks = marks.filter(m => m.studentId === student.id);
    const subjectResults: SubjectResult[] = [];

    for (const s of schedules) {
      const mark = studentMarks.find(m => m.scheduleId === s.id);
      if (mark) {
        subjectResults.push({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          fullMarks: s.fullMarks,
          passMarks: s.passMarks,
          obtainedMarks: mark.isAbsent ? 0 : mark.obtainedMarks,
          grade: mark.grade,
          gradePoint: mark.gradePoint,
          isAbsent: mark.isAbsent,
          isPassed: mark.isAbsent ? false : mark.obtainedMarks >= s.passMarks,
        });
      } else {
        subjectResults.push({
          subjectId: s.subjectId,
          subjectName: s.subjectName,
          fullMarks: s.fullMarks,
          passMarks: s.passMarks,
          obtainedMarks: 0,
          grade: '—',
          gradePoint: 0,
          isAbsent: true,
          isPassed: false,
        });
      }
    }

    const totalMarks = subjectResults.reduce((sum, sr) => sum + (sr.isAbsent ? 0 : sr.obtainedMarks), 0);
    const totalFullMarks = subjectResults.reduce((sum, sr) => sum + sr.fullMarks, 0);
    const totalGradePoints = subjectResults.reduce((sum, sr) => sum + sr.gradePoint, 0);
    const subjectCount = subjectResults.length;
    const gpa = subjectCount > 0 ? Math.round((totalGradePoints / subjectCount) * 100) / 100 : 0;
    const passedSubjects = subjectResults.filter(sr => sr.isPassed).length;
    const isPassed = subjectResults.every(sr => sr.isPassed);
    const { grade } = calculateGrade(passedSubjects / subjectCount * 100);

    results.push({
      id: nextResultId(),
      examId,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      section: student.section,
      totalMarks,
      totalFullMarks,
      gpa,
      grade,
      meritPosition: 0,
      isPassed,
      subjectResults,
      generatedAt: new Date().toISOString(),
    });
  }

  results.sort((a, b) => b.gpa - a.gpa || b.totalMarks - a.totalMarks);
  results.forEach((r, i) => { r.meritPosition = i + 1; });

  const allResults = [...filteredExisting, ...results];
  saveToStorage(STORAGE_KEYS.RESULTS, allResults);
  return results;
}

export function deleteResult(id: string): boolean {
  const results = getResults();
  const filtered = results.filter(r => r.id !== id);
  if (filtered.length === results.length) return false;
  saveToStorage(STORAGE_KEYS.RESULTS, filtered);
  return true;
}

// Grade Config
export function getGradeConfig(): GradeConfig[] {
  if (typeof window === 'undefined') return DEFAULT_GRADE_CONFIG;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GRADE_CONFIG);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return DEFAULT_GRADE_CONFIG;
}

export function saveGradeConfig(config: GradeConfig[]): void {
  saveToStorage(STORAGE_KEYS.GRADE_CONFIG, config);
}

// Analytics
export interface ExamAnalytics {
  totalStudents: number;
  appearedStudents: number;
  passedStudents: number;
  failedStudents: number;
  passRate: number;
  failureRate: number;
  averageGpa: number;
  topPerformers: { studentName: string; gpa: number; totalMarks: number }[];
  weakPerformers: { studentName: string; gpa: number; totalMarks: number }[];
  subjectPerformance: { subjectName: string; averageMarks: number; passRate: number; fullMarks: number }[];
  classPerformance: { className: string; averageGpa: number; passRate: number; studentCount: number }[];
}

export function getExamAnalytics(examId: string): ExamAnalytics | null {
  const results = getResultsByExam(examId);
  if (results.length === 0) return null;

  const totalStudents = results.length;
  const appearedStudents = results.filter(r => r.subjectResults.some(sr => !sr.isAbsent)).length;
  const passedStudents = results.filter(r => r.isPassed).length;
  const failedStudents = totalStudents - passedStudents;
  const passRate = totalStudents > 0 ? Math.round((passedStudents / totalStudents) * 100) : 0;
  const failureRate = 100 - passRate;
  const averageGpa = totalStudents > 0 ? Math.round((results.reduce((s, r) => s + r.gpa, 0) / totalStudents) * 100) / 100 : 0;

  const sortedByGpa = [...results].sort((a, b) => b.gpa - a.gpa);
  const topPerformers = sortedByGpa.slice(0, 10).map(r => ({ studentName: r.studentName, gpa: r.gpa, totalMarks: r.totalMarks }));
  const weakPerformers = sortedByGpa.slice(-10).reverse().map(r => ({ studentName: r.studentName, gpa: r.gpa, totalMarks: r.totalMarks }));

  const subjectMap: Record<number, { name: string; totalMarks: number; passCount: number; studentCount: number; fullMarks: number }> = {};
  for (const r of results) {
    for (const sr of r.subjectResults) {
      if (!subjectMap[sr.subjectId]) {
        subjectMap[sr.subjectId] = { name: sr.subjectName, totalMarks: 0, passCount: 0, studentCount: 0, fullMarks: sr.fullMarks };
      }
      subjectMap[sr.subjectId].totalMarks += sr.obtainedMarks;
      subjectMap[sr.subjectId].studentCount++;
      if (sr.isPassed) subjectMap[sr.subjectId].passCount++;
    }
  }
  const subjectPerformance = Object.values(subjectMap).map(s => ({
    subjectName: s.name,
    averageMarks: s.studentCount > 0 ? Math.round((s.totalMarks / s.studentCount) * 100) / 100 : 0,
    passRate: s.studentCount > 0 ? Math.round((s.passCount / s.studentCount) * 100) : 0,
    fullMarks: s.fullMarks,
  }));

  const classMap: Record<string, { totalGpa: number; passCount: number; count: number }> = {};
  for (const r of results) {
    if (!classMap[r.className]) classMap[r.className] = { totalGpa: 0, passCount: 0, count: 0 };
    classMap[r.className].totalGpa += r.gpa;
    classMap[r.className].count++;
    if (r.isPassed) classMap[r.className].passCount++;
  }
  const classPerformance = Object.entries(classMap).map(([name, d]) => ({
    className: name,
    averageGpa: Math.round((d.totalGpa / d.count) * 100) / 100,
    passRate: Math.round((d.passCount / d.count) * 100),
    studentCount: d.count,
  }));

  return { totalStudents, appearedStudents, passedStudents, failedStudents, passRate, failureRate, averageGpa, topPerformers, weakPerformers, subjectPerformance, classPerformance };
}
