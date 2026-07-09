'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Settings, CheckCircle2, Clock, BarChart2,
  Search, X, Save, Loader2, Pencil, Trash2, Archive, Share2,
  Calendar, GraduationCap, AlertTriangle, Printer, Eye, Upload,
  Check
} from 'lucide-react';
import {
  getExams, createExam, updateExam, deleteExam,
  archiveExam, publishExam, getSchedules,
  createSchedule, updateSchedule, deleteSchedule, checkScheduleConflicts,
  getMarksBySchedule, setMarksEntry,
  getResults, getResultByStudent, generateResults,
  getExamAnalytics, validateMarks, calculateGrade,
  type Exam, type ExamSchedule, type ExamResult,
  type ExamStatus, type ConflictCheck, type ExamAnalytics,
} from '@/lib/examStore';

// ── Data Loaders ──
interface AcadClass { id: number; name: string; }
interface AcadSubject { id: number; name: string; code: string; type: string; classIds: number[]; }
interface StudentRecord { id: string; name: string; class: string; section: string; roll: string; }

function loadClasses(): AcadClass[] {
  try { const s = localStorage.getItem('academic_classes'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}
function loadSubjects(): AcadSubject[] {
  try { const s = localStorage.getItem('academic_subjects'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}
function loadStudents(): StudentRecord[] {
  try { const s = localStorage.getItem('students'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}
function loadStaff(): { id: string; name: string; role: string }[] {
  try { const s = localStorage.getItem('staff'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

const TABS = [
  { id: 'exams', label: 'Examinations', icon: FileText },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'marks', label: 'Marks Entry', icon: CheckCircle2 },
  { id: 'results', label: 'Results', icon: GraduationCap },
  { id: 'reportcards', label: 'Report Cards', icon: Printer },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

const ACADEMIC_YEARS = ['2026-2027', '2025-2026', '2024-2025'];
const TERMS = ['1st Term', '2nd Term', '3rd Term', 'Final'];
const EXAM_TYPES = ['Terminal', 'Class Test', 'Mid Term', 'Final', 'Pre-Test', 'Model Test', 'Quiz', 'Practical'];

export default function ExamManagementPage() {
  const [activeTab, setActiveTab] = useState('exams');
  const [searchTerm, setSearchTerm] = useState('');

  // Data
  const [exams, setExams] = useState<Exam[]>(() => getExams());
  const [schedules, setSchedules] = useState<ExamSchedule[]>(() => getSchedules());
  const [results, setResults] = useState<ExamResult[]>(() => getResults());
  const [classes, setClasses] = useState<AcadClass[]>([]);
  const [subjects, setSubjects] = useState<AcadSubject[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [staff, setStaff] = useState<{ id: string; name: string; role: string }[]>([]);

  useEffect(() => { setClasses(loadClasses()); }, []);
  useEffect(() => { setSubjects(loadSubjects()); }, []);
  useEffect(() => { setStudents(loadStudents()); }, []);
  useEffect(() => { setStaff(loadStaff()); }, []);
  useEffect(() => { setResults(getResults()); }, []);

  // ── Exam CRUD ──
  const [examModal, setExamModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data: Partial<Exam> }>({ open: false, mode: 'add', data: {} });
  const [examSaving, setExamSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; label: string } | null>(null);

  const openExamModal = (mode: 'add' | 'edit', data?: Exam) => {
    if (mode === 'add') {
      setExamModal({ open: true, mode, data: { name: '', academicYear: ACADEMIC_YEARS[0], term: TERMS[0], examType: EXAM_TYPES[0], startDate: '', endDate: '', classIds: [], sectionIds: [], description: '', status: 'draft' } });
    } else if (data) {
      setExamModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeExamModal = () => setExamModal(prev => ({ ...prev, open: false }));

  const handleSaveExam = () => {
    const d = examModal.data;
    if (!d.name?.trim()) return alert('Exam name is required.');
    if (!d.startDate) return alert('Start date is required.');
    if (!d.endDate) return alert('End date is required.');
    if (!d.classIds?.length) return alert('Select at least one applicable class.');
    setExamSaving(true);
    setTimeout(() => {
      const d2 = examModal.data;
      if (examModal.mode === 'add') {
        const created = createExam(d2 as any);
        setExams(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateExam(d2.id, d2);
        if (updated) setExams(prev => prev.map(e => e.id === d2.id ? updated : e));
      }
      setExamSaving(false);
      closeExamModal();
    }, 300);
  };

  const handleDeleteExam = (id: string) => {
    if (deleteExam(id)) {
      setExams(prev => prev.filter(e => e.id !== id));
      setSchedules(prev => prev.filter(s => s.examId !== id));
    }
    setConfirmDelete(null);
  };

  const handleArchiveExam = (id: string) => {
    const updated = archiveExam(id);
    if (updated) setExams(prev => prev.map(e => e.id === id ? updated : e));
  };

  const handlePublishExam = (id: string) => {
    const updated = publishExam(id);
    if (updated) setExams(prev => prev.map(e => e.id === id ? updated : e));
  };

  // ── Schedule Management ──
  const [selectedExamForSchedule, setSelectedExamForSchedule] = useState('');
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; mode: 'add' | 'edit'; data: Partial<ExamSchedule> }>({ open: false, mode: 'add', data: {} });
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleConflicts, setScheduleConflicts] = useState<ConflictCheck[]>([]);

  const filteredSchedules = useMemo(() => {
    if (!selectedExamForSchedule) return [];
    return schedules.filter(s => s.examId === selectedExamForSchedule).sort((a, b) => a.date.localeCompare(b.date));
  }, [schedules, selectedExamForSchedule]);

  const openScheduleModal = (mode: 'add' | 'edit', data?: ExamSchedule) => {
    if (mode === 'add') {
      setScheduleConflicts([]);
      setScheduleModal({ open: true, mode, data: { examId: selectedExamForSchedule, subjectId: 0, subjectName: '', date: '', startTime: '09:00', endTime: '10:00', room: '', invigilator: '', fullMarks: 100, passMarks: 33, isPractical: false } });
    } else if (data) {
      setScheduleConflicts([]);
      setScheduleModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeScheduleModal = () => { setScheduleModal(prev => ({ ...prev, open: false })); setScheduleConflicts([]); };

  const handleScheduleField = (field: string, value: any) => {
    setScheduleModal(prev => {
      const newData = { ...prev.data, [field]: value };
      if (field === 'subjectId' && value) {
        const sub = subjects.find(s => s.id === Number(value));
        if (sub) newData.subjectName = sub.name;
      }
      return { ...prev, data: newData };
    });
    setScheduleConflicts([]);
  };

  const checkConflicts = () => {
    const d = scheduleModal.data;
    if (!d.date || !d.startTime || !d.endTime) { alert('Fill date and time first.'); return; }
    const conflicts = checkScheduleConflicts(
      { examId: d.examId || selectedExamForSchedule, subjectId: d.subjectId || 0, subjectName: d.subjectName || '', date: d.date || '', startTime: d.startTime || '', endTime: d.endTime || '', room: d.room || '', invigilator: d.invigilator || '', fullMarks: d.fullMarks || 100, passMarks: d.passMarks || 33, isPractical: d.isPractical || false },
      scheduleModal.mode === 'edit' ? d.id : undefined
    );
    setScheduleConflicts(conflicts);
    if (conflicts.length > 0) {
      alert(`Found ${conflicts.length} conflict(s). Review before saving.`);
    } else {
      alert('No conflicts detected.');
    }
  };

  const handleSaveSchedule = () => {
    const d = scheduleModal.data;
    if (!d.subjectId) return alert('Select a subject.');
    if (!d.date) return alert('Select a date.');
    if (!d.startTime || !d.endTime) return alert('Set time slots.');
    if (!d.invigilator?.trim()) return alert('Assign an invigilator.');
    setScheduleSaving(true);
    setTimeout(() => {
      const d2 = scheduleModal.data;
      if (scheduleModal.mode === 'add') {
        const created = createSchedule({ examId: selectedExamForSchedule, subjectId: d2.subjectId || 0, subjectName: d2.subjectName || '', date: d2.date || '', startTime: d2.startTime || '', endTime: d2.endTime || '', room: d2.room || '', invigilator: d2.invigilator || '', fullMarks: d2.fullMarks || 100, passMarks: d2.passMarks || 33, isPractical: d2.isPractical || false });
        setSchedules(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateSchedule(d2.id, { ...d2, examId: selectedExamForSchedule });
        if (updated) setSchedules(prev => prev.map(s => s.id === d2.id ? updated : s));
      }
      setScheduleSaving(false);
      closeScheduleModal();
    }, 300);
  };

  const handleDeleteSchedule = (id: string) => {
    if (deleteSchedule(id)) setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // ── Marks Entry ──
  const [marksExamId, setMarksExamId] = useState('');
  const [marksScheduleId, setMarksScheduleId] = useState('');
  const [marksClassFilter, setMarksClassFilter] = useState('');
  const [marksSectionFilter, setMarksSectionFilter] = useState('');
  const [marksSearch, setMarksSearch] = useState('');
  type MarksData = { obtained: string; isAbsent: boolean; remarks: string };
  const [editingMarks, setEditingMarks] = useState<Record<string, Record<string, MarksData>>>({});
  const [bulkMarksValue, setBulkMarksValue] = useState('');
  const [showBulkEntry, setShowBulkEntry] = useState(false);

  const marksExamSchedules = useMemo(() => schedules.filter(s => s.examId === marksExamId).sort((a, b) => a.date.localeCompare(b.date)), [schedules, marksExamId]);

  const marksSelectedSchedule = useMemo(() => marksExamSchedules.find(s => s.id === marksScheduleId), [marksExamSchedules, marksScheduleId]);

  const marksStudents = useMemo(() => {
    const exam = exams.find(e => e.id === marksExamId);
    if (!exam) return [];
    return students.filter(s => {
      const classMatch = exam.classIds.length === 0 || exam.classIds.some(cid => {
        const cls = classes.find(c => c.id === cid);
        return cls && s.class === cls.name;
      });
      const sectionMatch = !marksSectionFilter || s.section?.startsWith(marksSectionFilter);
      const classFilterMatch = !marksClassFilter || s.class === marksClassFilter;
      const q = marksSearch.toLowerCase();
      const searchMatch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      return classMatch && sectionMatch && classFilterMatch && searchMatch;
    }).sort((a, b) => Number(a.roll || 0) - Number(b.roll || 0));
  }, [students, exams, marksExamId, marksClassFilter, marksSectionFilter, marksSearch, classes]);

  const marksClassOptions = useMemo(() => {
    const exam = exams.find(e => e.id === marksExamId);
    if (!exam) return [];
    return classes.filter(c => exam.classIds.includes(c.id)).map(c => c.name);
  }, [classes, exams, marksExamId]);

  useEffect(() => {
    if (marksScheduleId) {
      const scheduleMarks = getMarksBySchedule(marksScheduleId);
      const map: Record<string, { obtained: string; isAbsent: boolean; remarks: string }> = {};
      scheduleMarks.forEach(m => {
        map[m.studentId] = { obtained: String(m.obtainedMarks), isAbsent: m.isAbsent, remarks: m.remarks || '' };
      });
      if (!editingMarks[marksScheduleId]) {
        setEditingMarks(prev => ({ ...prev, [marksScheduleId]: {} as Record<string, MarksData> }));
      }
      setEditingMarks(prev => ({ ...prev, [marksScheduleId]: map }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marksScheduleId]);

  const handleMarksChange = (studentId: string, field: 'obtained' | 'remarks', value: string) => {
    setEditingMarks(prev => {
      const schedule = prev[marksScheduleId] ?? {} as Record<string, MarksData>;
      const student = schedule[studentId] ?? { obtained: '', isAbsent: false, remarks: '' };
      return { ...prev, [marksScheduleId]: { ...schedule, [studentId]: { ...student, [field]: value } } };
    });
  };

  const handleMarksAbsentToggle = (studentId: string) => {
    setEditingMarks(prev => {
      const schedule = prev[marksScheduleId] ?? {} as Record<string, MarksData>;
      const student = schedule[studentId] ?? { obtained: '', isAbsent: false, remarks: '' };
      return { ...prev, [marksScheduleId]: { ...schedule, [studentId]: { ...student, isAbsent: !student.isAbsent } } };
    });
  };

  const handleSaveMarks = () => {
    const schedule = marksSelectedSchedule;
    if (!schedule) return;
    const currentMarks = editingMarks[marksScheduleId] || {};
    let saved = 0;
    let errors = 0;
    marksStudents.forEach(s => {
      const entry = currentMarks[s.id];
      if (!entry) { errors++; return; }
      const obtained = Number(entry.obtained);
      const validationErrors = validateMarks(obtained, schedule.fullMarks);
      if (!entry.isAbsent && (!entry.obtained || entry.obtained === '')) { errors++; return; }
      if (!entry.isAbsent && validationErrors.length > 0) { errors++; return; }
      setMarksEntry(marksExamId, marksScheduleId, s.id, s.name, schedule.subjectId, schedule.subjectName, entry.isAbsent ? 0 : obtained, schedule.fullMarks, schedule.passMarks, entry.isAbsent, entry.remarks || '', 'Admin');
      saved++;
    });
      alert(`Saved marks for ${saved} student(s).${errors > 0 ? ` Skipped ${errors} invalid entries.` : ''}`);
  };

  const handleBulkSetMarks = () => {
    const schedule = marksSelectedSchedule;
    if (!schedule) return;
    const val = Number(bulkMarksValue);
    if (isNaN(val) || val < 0 || val > schedule.fullMarks) return alert(`Enter a valid marks value (0-${schedule.fullMarks}).`);
    const map: Record<string, MarksData> = { ...(editingMarks[marksScheduleId] || {}) };
    marksStudents.forEach(s => {
      if (!map[s.id]) map[s.id] = { obtained: String(val), isAbsent: false, remarks: '' };
      else map[s.id].obtained = String(val);
    });
    setEditingMarks(prev => ({ ...prev, [marksScheduleId]: map }));
    setBulkMarksValue('');
    setShowBulkEntry(false);
  };

  // ── Results ──
  const [resultExamId, setResultExamId] = useState('');
  const [resultClassFilter, setResultClassFilter] = useState('');
  const [resultSectionFilter, setResultSectionFilter] = useState('');
  const [resultSearch, setResultSearch] = useState('');
  const [generating, setGenerating] = useState(false);

  const filteredResults = useMemo(() => {
    let list = results.filter(r => r.examId === resultExamId);
    if (resultClassFilter) list = list.filter(r => r.className === resultClassFilter);
    if (resultSectionFilter) list = list.filter(r => r.section?.startsWith(resultSectionFilter));
    const q = resultSearch.toLowerCase();
    if (q) list = list.filter(r => r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q));
    return list.sort((a, b) => a.meritPosition - b.meritPosition);
  }, [results, resultExamId, resultClassFilter, resultSectionFilter, resultSearch]);

  const resultClassOptions = useMemo(() => {
    return [...new Set(results.filter(r => r.examId === resultExamId).map(r => r.className))];
  }, [results, resultExamId]);

  const handleGenerateResults = () => {
    if (!resultExamId) return alert('Select an exam first.');
    const exam = exams.find(e => e.id === resultExamId);
    if (!exam) return;
    const examSchedules = schedules.filter(s => s.examId === resultExamId);
    if (examSchedules.length === 0) return alert('No schedules defined for this exam. Add schedules first.');
    const targetStudents = students.filter(s => {
      return exam.classIds.length === 0 || exam.classIds.some(cid => {
        const cls = classes.find(c => c.id === cid);
        return cls && s.class === cls.name;
      });
    });
    if (targetStudents.length === 0) return alert('No students found for the selected exam classes.');
    setGenerating(true);
    setTimeout(() => {
      const generated = generateResults(resultExamId, targetStudents.map(s => ({ id: s.id, name: s.name, className: s.class, section: s.section })));
      setResults(getResults());
      setGenerating(false);
      alert(`Generated results for ${generated.length} student(s).`);
    }, 800);
  };

  const viewResultStudent = (studentId: string) => {
    if (!resultExamId) return;
    const result = getResultByStudent(resultExamId, studentId);
    if (result) setViewingResult(result);
  };

  // ── Report Cards ──
  const [reportExamId, setReportExamId] = useState('');
  const [reportClassFilter, setReportClassFilter] = useState('');
  const [reportSectionFilter, setReportSectionFilter] = useState('');
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);
  const [attendanceData] = useState<Record<string, any>>({});

  const reportResults = useMemo(() => {
    let list = results.filter(r => r.examId === reportExamId);
    if (reportClassFilter) list = list.filter(r => r.className === reportClassFilter);
    if (reportSectionFilter) list = list.filter(r => r.section?.startsWith(reportSectionFilter));
    return list.sort((a, b) => a.meritPosition - b.meritPosition);
  }, [results, reportExamId, reportClassFilter, reportSectionFilter]);

  const handlePrintReport = (result: ExamResult) => {
    const win = window.open('', '_blank');
    if (!win) return alert('Please allow popups for this site.');
    const exam = exams.find(e => e.id === result.examId);
    win.document.write(generateReportCardHTML(result, exam, attendanceData[result.studentId]));
    win.document.close();
    win.focus();
    win.print();
  };

  const handleBulkPrintReports = () => {
    const exam = exams.find(e => e.id === reportExamId);
    if (!exam || reportResults.length === 0) return alert('No results to print.');
    const win = window.open('', '_blank');
    if (!win) return alert('Please allow popups for this site.');
    let html = '';
    reportResults.forEach((r, i) => {
      if (i > 0) html += '<div style="page-break-after: always;"></div>';
      html += generateReportCardHTML(r, exam, attendanceData[r.studentId]);
    });
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  // ── Analytics ──
  const [analyticsExamId, setAnalyticsExamId] = useState('');
  const [analyticsData, setAnalyticsData] = useState<ExamAnalytics | null>(null);

  useEffect(() => {
    if (analyticsExamId) {
      setAnalyticsData(getExamAnalytics(analyticsExamId));
    } else {
      setAnalyticsData(null);
    }
  }, [analyticsExamId, results]);

  // ── Tab content ──
  const filteredExams = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return exams.filter(e => !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.examType.toLowerCase().includes(q));
  }, [exams, searchTerm]);

  const statusBadge = (status: ExamStatus) => {
    const map: Record<ExamStatus, { bg: string; text: string; border: string; icon: any }> = {
      draft: { bg: 'bg-[var(--bg-tertiary)]', text: 'text-[var(--text-primary)]', border: 'border-[var(--border-light)]', icon: Settings },
      upcoming: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: Clock },
      grading: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Settings },
      published: { bg: 'bg-[var(--green-50)]', text: 'text-[var(--green-800)]', border: 'border-[var(--green-200)]', icon: CheckCircle2 },
      archived: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Archive },
    };
    const s = map[status] || map.draft;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
        <s.icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Exam & Result Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage examinations, schedules, marks entry, results, and report cards.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'exams' && (
            <button onClick={() => openExamModal('add')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-brand-primary/20 transition-all flex items-center gap-2">
              <Plus size={16} /> Create Exam
            </button>
          )}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden glass-panel">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50 overflow-x-auto custom-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)]'} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="examTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ─── TAB: EXAMINATIONS ─── */}
            {activeTab === 'exams' && (
              <motion.div key="exams" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-4">
                  <div className="relative max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={16} /></div>
                    <input type="text" placeholder="Search exams..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-[var(--border-light)] rounded-xl text-sm bg-[var(--bg-tertiary)] placeholder-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left data-table">
                    <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                      <tr>
                        <th className="px-6 py-4 font-semibold rounded-tl-xl">Exam Name</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Academic Year</th>
                        <th className="px-6 py-4 font-semibold">Term</th>
                        <th className="px-6 py-4 font-semibold">Date Range</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-light)]">
                      {filteredExams.map(exam => (
                        <tr key={exam.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">
                            <div>{exam.name}</div>
                            <div className="text-xs text-[var(--text-muted)] font-normal mt-0.5">{exam.id}</div>
                          </td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{exam.examType}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{exam.academicYear}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">{exam.term}</td>
                          <td className="px-6 py-4 text-[var(--text-secondary)]">
                            <span className="text-xs">{new Date(exam.startDate).toLocaleDateString()} – {new Date(exam.endDate).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4">{statusBadge(exam.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openExamModal('edit', exam)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                              {exam.status !== 'archived' && exam.status !== 'published' && (
                                <button onClick={() => handlePublishExam(exam.id)} className="p-2 text-[var(--text-muted)] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Publish"><Share2 size={16} /></button>
                              )}
                              {exam.status !== 'archived' && (
                                <button onClick={() => handleArchiveExam(exam.id)} className="p-2 text-[var(--text-muted)] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Archive"><Archive size={16} /></button>
                              )}
                              <button onClick={() => setConfirmDelete({ type: 'exam', id: exam.id, label: exam.name })} className="p-2 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredExams.length === 0 && (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No exams found. Click "Create Exam" to begin.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ─── TAB: SCHEDULE ─── */}
            {activeTab === 'schedule' && (
              <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <select value={selectedExamForSchedule} onChange={e => setSelectedExamForSchedule(e.target.value)}
                    className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-72">
                    <option value="">Select an exam</option>
                    {exams.filter(e => e.status !== 'archived').map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.id})</option>
                    ))}
                  </select>
                  {selectedExamForSchedule && (
                    <button onClick={() => openScheduleModal('add')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all flex items-center gap-2">
                      <Plus size={16} /> Add Schedule
                    </button>
                  )}
                </div>

                {!selectedExamForSchedule ? (
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                    <Calendar size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Exam Schedule</h3>
                    <p className="text-sm max-w-sm text-center">Select an exam above to manage its schedule/routine.</p>
                  </div>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-12 text-sm text-[var(--text-muted)]">No schedules defined for this exam. Click "Add Schedule" to create one.</div>
                ) : (
                  <div className="overflow-x-auto">
<table className="w-full text-sm text-left data-table">
                  <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
                    <tr>
                      <th className="px-6 py-4 font-semibold rounded-tl-xl">Date</th>
                          <th className="px-6 py-4 font-semibold">Subject</th>
                          <th className="px-6 py-4 font-semibold">Time</th>
                          <th className="px-6 py-4 font-semibold">Room</th>
                          <th className="px-6 py-4 font-semibold">Invigilator</th>
                          <th className="px-6 py-4 font-semibold">Marks</th>
                          <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)]">
                        {filteredSchedules.map(sch => (
                          <tr key={sch.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{new Date(sch.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-[var(--text-primary)]">{sch.subjectName}</span>
                              {sch.isPractical && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Practical</span>}
                            </td>
                            <td className="px-6 py-4 text-[var(--text-secondary)]">{sch.startTime} – {sch.endTime}</td>
                            <td className="px-6 py-4 text-[var(--text-secondary)]">{sch.room || '—'}</td>
                            <td className="px-6 py-4 text-[var(--text-secondary)]">{sch.invigilator || '—'}</td>
                            <td className="px-6 py-4 text-[var(--text-secondary)]">{sch.passMarks}/{sch.fullMarks}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => openScheduleModal('edit', sch)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                                <button onClick={() => { if (confirm(`Delete schedule for ${sch.subjectName}?`)) handleDeleteSchedule(sch.id); }} className="p-2 text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── TAB: MARKS ENTRY ─── */}
            {activeTab === 'marks' && (
              <motion.div key="marks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <select value={marksExamId} onChange={e => { setMarksExamId(e.target.value); setMarksScheduleId(''); setMarksClassFilter(''); setMarksSectionFilter(''); }}
                    className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-64">
                    <option value="">Select Exam</option>
                    {exams.filter(e => e.status !== 'draft' && e.status !== 'archived').map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                  {marksExamId && (
                    <select value={marksScheduleId} onChange={e => setMarksScheduleId(e.target.value)}
                      className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-64">
                      <option value="">Select Subject Schedule</option>
                      {marksExamSchedules.map(sch => (
                        <option key={sch.id} value={sch.id}>{sch.subjectName} – {new Date(sch.date).toLocaleDateString()} ({sch.startTime})</option>
                      ))}
                    </select>
                  )}
                </div>

                {marksScheduleId && marksSelectedSchedule && (
                  <>
                    <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center">
                      <div className="text-sm text-[var(--text-secondary)] font-medium">
                        Subject: <span className="text-[var(--text-primary)]">{marksSelectedSchedule.subjectName}</span>
                        &nbsp;|&nbsp; Full Marks: <span className="text-[var(--text-primary)]">{marksSelectedSchedule.fullMarks}</span>
                        &nbsp;|&nbsp; Pass Marks: <span className="text-[var(--text-primary)]">{marksSelectedSchedule.passMarks}</span>
                      </div>
                      <div className="flex gap-2 ml-auto">
                        <select value={marksClassFilter} onChange={e => setMarksClassFilter(e.target.value)}
                          className="px-3 py-1.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                          <option value="">All Classes</option>
                          {marksClassOptions.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={14} /></div>
                          <input type="text" placeholder="Search student..." value={marksSearch} onChange={e => setMarksSearch(e.target.value)}
                            className="pl-8 pr-3 py-1.5 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-48" />
                        </div>
                        <button onClick={() => setShowBulkEntry(!showBulkEntry)} className="px-3 py-1.5 border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5">
                          <Upload size={14} /> Bulk
                        </button>
                      </div>
                    </div>

                    {showBulkEntry && (
                      <div className="flex items-center gap-3 mb-4 p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)]">
                        <span className="text-sm font-medium text-[var(--text-primary)]">Set all marks to:</span>
                        <input type="number" value={bulkMarksValue} onChange={e => setBulkMarksValue(e.target.value)} placeholder={`0-${marksSelectedSchedule.fullMarks}`}
                          className="w-24 px-3 py-1.5 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                        <button onClick={handleBulkSetMarks} className="px-3 py-1.5 bg-brand-primary hover:bg-brand-mid text-white rounded-xl text-sm font-medium transition-colors">Apply</button>
                        <button onClick={() => setShowBulkEntry(false)} className="px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm">Cancel</button>
                      </div>
                    )}

                    <div className="overflow-x-auto border border-[var(--border-light)] rounded-xl">
                      <table className="w-full text-sm text-left data-table">
                        <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Roll</th>
                            <th className="px-4 py-3 font-semibold">Student</th>
                            <th className="px-4 py-3 font-semibold">Class</th>
                            <th className="px-4 py-3 font-semibold">Obtained ({marksSelectedSchedule.fullMarks})</th>
                            <th className="px-4 py-3 font-semibold">Grade</th>
                            <th className="px-4 py-3 font-semibold">Absent</th>
                            <th className="px-4 py-3 font-semibold">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-light)]">
                          {marksStudents.map(s => {
                            const entry = editingMarks[marksScheduleId]?.[s.id] || { obtained: '', isAbsent: false, remarks: '' };
                            const obtained = Number(entry.obtained);
                            const isValid = !isNaN(obtained) && obtained >= 0 && obtained <= marksSelectedSchedule.fullMarks;
                            const percentage = isValid && !entry.isAbsent && marksSelectedSchedule.fullMarks > 0 ? (obtained / marksSelectedSchedule.fullMarks) * 100 : 0;
                            const { grade, gradePoint } = entry.isAbsent ? { grade: '—', gradePoint: 0 } : calculateGrade(percentage);
                            return (
                              <tr key={s.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                                <td className="px-4 py-3 text-[var(--text-secondary)] font-medium">{s.roll}</td>
                                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{s.name}</td>
                                <td className="px-4 py-3 text-[var(--text-secondary)]">{s.class}</td>
                                <td className="px-4 py-3">
                                  <input type="number" value={entry.obtained} onChange={e => handleMarksChange(s.id, 'obtained', e.target.value)}
                                    disabled={entry.isAbsent}
                                    className={`w-20 px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${entry.isAbsent ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]' : isValid ? 'border-[var(--border-light)]' : 'border-rose-300 bg-rose-50/30'}`}
                                    min={0} max={marksSelectedSchedule.fullMarks} />
                                  {!isValid && entry.obtained !== '' && <span className="text-[10px] text-rose-500 ml-1">Invalid</span>}
                                </td>
                                <td className="px-4 py-3">
                                  {entry.obtained !== '' && isValid && !entry.isAbsent && (
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{grade} ({gradePoint.toFixed(2)})</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <button onClick={() => handleMarksAbsentToggle(s.id)}
                                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${entry.isAbsent ? 'bg-rose-100 border-rose-300 text-rose-600' : 'border-[var(--border-light)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}`}>
                                    {entry.isAbsent && <X size={12} />}
                                  </button>
                                </td>
                                <td className="px-4 py-3">
                                  <input type="text" value={entry.remarks} onChange={e => handleMarksChange(s.id, 'remarks', e.target.value)}
                                    placeholder="—" className="w-full max-w-[120px] px-2 py-1 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                                </td>
                              </tr>
                            );
                          })}
                          {marksStudents.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No students found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button onClick={handleSaveMarks}
                        className="px-6 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2 bg-brand-primary hover:bg-brand-mid shadow-sm">
                        <Save size={16} /> Save Marks
                      </button>
                    </div>
                  </>
                )}

                {(!marksExamId || (marksExamId && marksExamSchedules.length === 0)) && marksExamId && (
                  <div className="text-center py-12 text-sm text-[var(--text-muted)]">No subject schedules found. Go to Schedule tab first.</div>
                )}

                {!marksExamId && (
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                    <CheckCircle2 size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Marks Entry Portal</h3>
                    <p className="text-sm max-w-sm text-center">Select an exam and subject schedule above to begin entering marks.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── TAB: RESULTS ─── */}
            {activeTab === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-end">
                  <div className="flex-1 flex flex-wrap gap-3">
                    <select value={resultExamId} onChange={e => { setResultExamId(e.target.value); setResultClassFilter(''); setResultSectionFilter(''); }}
                      className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-64">
                      <option value="">Select Exam</option>
                      {exams.filter(e => e.status !== 'draft').map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                      ))}
                    </select>
                    {resultExamId && (
                      <>
                        <select value={resultClassFilter} onChange={e => { setResultClassFilter(e.target.value); setResultSectionFilter(''); }}
                          className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-48">
                          <option value="">All Classes</option>
                          {resultClassOptions.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={16} /></div>
                          <input type="text" placeholder="Search student..." value={resultSearch} onChange={e => setResultSearch(e.target.value)}
                            className="pl-9 pr-3 py-2.5 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-56" />
                        </div>
                      </>
                    )}
                  </div>
                  {resultExamId && (
                    <div className="flex gap-2">
                      <button onClick={handleGenerateResults} disabled={generating}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2 ${generating ? 'bg-brand-mid/60 cursor-wait' : 'bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/80 shadow-sm'}`}>
                        {generating ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
                        {generating ? 'Generating...' : 'Generate Results'}
                      </button>
                    </div>
                  )}
                </div>

                {resultExamId && filteredResults.length > 0 && (
                  <div className="overflow-x-auto border border-[var(--border-light)] rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Merit</th>
                          <th className="px-4 py-3 font-semibold">Student</th>
                          <th className="px-4 py-3 font-semibold">Class</th>
                          <th className="px-4 py-3 font-semibold">Total</th>
                          <th className="px-4 py-3 font-semibold">GPA</th>
                          <th className="px-4 py-3 font-semibold">Grade</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)]">
                        {filteredResults.map(r => (
                          <tr key={r.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                r.meritPosition === 1 ? 'bg-amber-100 text-amber-700' :
                                r.meritPosition === 2 ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]' :
                                r.meritPosition === 3 ? 'bg-orange-100 text-orange-700' :
                                'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                              }`}>{r.meritPosition}</span>
                            </td>
                            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{r.studentName}<div className="text-xs text-[var(--text-muted)]">{r.studentId}</div></td>
                            <td className="px-4 py-3 text-[var(--text-secondary)]">{r.className}</td>
                            <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{r.totalMarks}/{r.totalFullMarks}</td>
                            <td className="px-4 py-3 font-bold text-lg">{r.gpa.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                                r.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' :
                                r.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                                r.grade === 'A-' ? 'bg-indigo-100 text-indigo-700' :
                                r.grade === 'F' ? 'bg-rose-100 text-rose-700' :
                                'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                              }`}>{r.grade}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                r.isPassed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>
                                {r.isPassed ? <CheckCircle2 size={12} /> : <X size={12} />}
                                {r.isPassed ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => viewResultStudent(r.studentId)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors" title="View Details"><Eye size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {resultExamId && filteredResults.length === 0 && (
                  <div className="text-center py-12 text-sm text-[var(--text-muted)]">
                    No results found. Click "Generate Results" to process marks into results.
                  </div>
                )}

                {!resultExamId && (
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                    <GraduationCap size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Exam Results</h3>
                    <p className="text-sm max-w-sm text-center">Select an exam above to view, generate, and manage results with GPA and merit positions.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── TAB: REPORT CARDS ─── */}
            {activeTab === 'reportcards' && (
              <motion.div key="reportcards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <select value={reportExamId} onChange={e => { setReportExamId(e.target.value); setReportClassFilter(''); setReportSectionFilter(''); }}
                    className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-64">
                    <option value="">Select Exam</option>
                    {exams.filter(e => e.status === 'published').map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                  {reportExamId && (
                    <>
                      <select value={reportClassFilter} onChange={e => { setReportClassFilter(e.target.value); setReportSectionFilter(''); }}
                        className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-48">
                        <option value="">All Classes</option>
                        {[...new Set(reportResults.map(r => r.className))].map(c => <option key={c}>{c}</option>)}
                      </select>
                      <button onClick={handleBulkPrintReports} disabled={reportResults.length === 0}
                        className="px-4 py-2.5 bg-[var(--text-primary)] hover:bg-[var(--text-primary)]/80 text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                        <Printer size={16} /> Print All ({reportResults.length})
                      </button>
                    </>
                  )}
                </div>

                {reportExamId && reportResults.length > 0 && (
                  <div className="overflow-x-auto border border-[var(--border-light)] rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Student</th>
                          <th className="px-4 py-3 font-semibold">Class</th>
                          <th className="px-4 py-3 font-semibold">GPA</th>
                          <th className="px-4 py-3 font-semibold">Grade</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)]">
                        {reportResults.map(r => (
                          <tr key={r.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{r.studentName}</td>
                            <td className="px-4 py-3 text-[var(--text-secondary)]">{r.className}</td>
                            <td className="px-4 py-3 font-bold">{r.gpa.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                                r.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' :
                                r.grade === 'F' ? 'bg-rose-100 text-rose-700' :
                                'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                              }`}>{r.grade}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                                r.isPassed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}>{r.isPassed ? 'Passed' : 'Failed'}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => handlePrintReport(r)} className="px-3 py-1.5 bg-brand-primary hover:bg-brand-mid text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto">
                                <Printer size={13} /> Print
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportExamId && reportResults.length === 0 && (
                  <div className="text-center py-12 text-sm text-[var(--text-muted)]">No results published for this exam. Publish results first.</div>
                )}

                {!reportExamId && (
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                    <Printer size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Report Cards</h3>
                    <p className="text-sm max-w-sm text-center">Select a published exam to generate and print individual or bulk report cards.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── TAB: ANALYTICS ─── */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-6">
                  <select value={analyticsExamId} onChange={e => setAnalyticsExamId(e.target.value)}
                    className="px-4 py-2.5 border border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-72">
                    <option value="">Select Exam</option>
                    {exams.filter(e => e.status === 'published').map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                {analyticsData ? (
                  <div className="space-y-6">
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <StatCard label="Total Students" value={String(analyticsData.totalStudents)} color="blue" />
                      <StatCard label="Appeared" value={String(analyticsData.appearedStudents)} color="indigo" />
                      <StatCard label="Passed" value={String(analyticsData.passedStudents)} color="emerald" />
                      <StatCard label="Failed" value={String(analyticsData.failedStudents)} color="rose" />
                      <StatCard label="Average GPA" value={analyticsData.averageGpa.toFixed(2)} color="amber" />
                    </div>

                    {/* Pass/Fail Rate */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Pass / Failure Rate</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-emerald-600 font-medium">Pass Rate</span>
                              <span className="font-bold text-[var(--text-primary)]">{analyticsData.passRate}%</span>
                            </div>
                            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5">
                              <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{ width: `${analyticsData.passRate}%` }} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-rose-600 font-medium">Failure Rate</span>
                              <span className="font-bold text-[var(--text-primary)]">{analyticsData.failureRate}%</span>
                            </div>
                            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5">
                              <div className="bg-rose-500 h-2.5 rounded-full transition-all" style={{ width: `${analyticsData.failureRate}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Class Performance</h4>
                        <div className="space-y-3">
                          {analyticsData.classPerformance.map(cp => (
                            <div key={cp.className}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-[var(--text-primary)] font-medium">{cp.className}</span>
                                <span className="text-[var(--text-secondary)]">{cp.averageGpa.toFixed(2)} GPA &bull; {cp.studentCount} students</span>
                              </div>
                              <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                                <div className="bg-brand-primary h-2 rounded-full transition-all progress-bar-fill" style={{ width: `${cp.passRate}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Top & Weak Performers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-500" /> Top Performers
                        </h4>
                        <div className="space-y-2">
                          {analyticsData.topPerformers.slice(0, 5).map((p, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--border-light)] last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[var(--text-muted)] w-5">{i + 1}.</span>
                                <span className="text-sm font-medium text-[var(--text-primary)]">{p.studentName}</span>
                              </div>
                              <span className="text-sm font-bold text-emerald-600">{p.gpa.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-rose-500" /> Needs Improvement
                        </h4>
                        <div className="space-y-2">
                          {analyticsData.weakPerformers.slice(0, 5).map((p, i) => (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-[var(--border-light)] last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[var(--text-muted)] w-5">{i + 1}.</span>
                                <span className="text-sm font-medium text-[var(--text-primary)]">{p.studentName}</span>
                              </div>
                              <span className="text-sm font-bold text-rose-600">{p.gpa.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Subject Performance */}
                    <div className="p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Subject-wise Performance</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                            <tr>
                              <th className="px-4 py-2 font-semibold">Subject</th>
                              <th className="px-4 py-2 font-semibold">Average Marks</th>
                              <th className="px-4 py-2 font-semibold">Full Marks</th>
                              <th className="px-4 py-2 font-semibold">Pass Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-light)]">
                            {analyticsData.subjectPerformance.map(sp => (
                              <tr key={sp.subjectName}>
                                <td className="px-4 py-2 font-medium text-[var(--text-primary)]">{sp.subjectName}</td>
                                <td className="px-4 py-2 text-[var(--text-secondary)]">{sp.averageMarks.toFixed(1)}</td>
                                <td className="px-4 py-2 text-[var(--text-secondary)]">{sp.fullMarks}</td>
                                <td className="px-4 py-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-[var(--bg-tertiary)] rounded-full h-2">
                                      <div className={`h-2 rounded-full ${sp.passRate >= 80 ? 'bg-emerald-500' : sp.passRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${sp.passRate}%` }} />
                                    </div>
                                    <span className={`text-xs font-medium ${sp.passRate >= 80 ? 'text-emerald-600' : sp.passRate >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{sp.passRate}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
                    <BarChart2 size={48} className="text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Exam Analytics</h3>
                    <p className="text-sm max-w-sm text-center">Select a published exam to view detailed performance analytics, pass rates, and subject analysis.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── EXAM MODAL ── */}
      <AnimatePresence>
        {examModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closeExamModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between sticky top-0 bg-[var(--bg-secondary)] z-10 rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">{examModal.mode === 'add' ? 'Create New Exam' : 'Edit Exam'}</h3>
                <button onClick={closeExamModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <FormField label="Exam Name" value={examModal.data.name || ''} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, name: v } }))} required />
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect label="Academic Year" value={examModal.data.academicYear || ACADEMIC_YEARS[0]} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, academicYear: v } }))} options={ACADEMIC_YEARS} />
                  <FormSelect label="Term/Semester" value={examModal.data.term || TERMS[0]} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, term: v } }))} options={TERMS} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormSelect label="Exam Type" value={examModal.data.examType || EXAM_TYPES[0]} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, examType: v } }))} options={EXAM_TYPES} />
                  <FormSelect label="Status" value={examModal.data.status || 'draft'} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, status: v as ExamStatus } }))} options={['draft', 'upcoming', 'grading', 'published', 'archived']} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Date" type="date" value={examModal.data.startDate || ''} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, startDate: v } }))} required />
                  <FormField label="End Date" type="date" value={examModal.data.endDate || ''} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, endDate: v } }))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">Applicable Classes <span className="text-rose-500">*</span></label>
                  <div className="max-h-40 overflow-y-auto border border-[var(--border-light)] rounded-xl p-2 space-y-0.5">
                    {classes.map(c => {
                      const checked = (examModal.data.classIds || []).includes(c.id);
                      return (
                        <label key={c.id} className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${checked ? 'bg-[var(--bg-tertiary)] text-brand-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                          <input type="checkbox" checked={checked} onChange={() => {
                            const ids: number[] = examModal.data.classIds || [];
                            setExamModal(prev => ({ ...prev, data: { ...prev.data, classIds: checked ? ids.filter(id => id !== c.id) : [...ids, c.id] } }));
                          }} className="w-4 h-4 rounded border-[var(--border-light)] text-brand-primary focus:ring-brand-primary" />
                          {c.name}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <FormField label="Description (optional)" value={examModal.data.description || ''} onChange={v => setExamModal(prev => ({ ...prev, data: { ...prev.data, description: v } }))} />
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                <button onClick={closeExamModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={handleSaveExam} disabled={examSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${examSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {examSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {examSaving ? 'Saving...' : examModal.mode === 'add' ? 'Create Exam' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── SCHEDULE MODAL ── */}
      <AnimatePresence>
        {scheduleModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closeScheduleModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">{scheduleModal.mode === 'add' ? 'Add' : 'Edit'} Schedule</h3>
                <button onClick={closeScheduleModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <FormSelect label="Subject" value={String(scheduleModal.data.subjectId || '')} onChange={v => handleScheduleField('subjectId', Number(v))} options={subjects.filter(s => {
                  const exam = exams.find(e => e.id === selectedExamForSchedule);
                  return !exam || exam.classIds.length === 0 || s.classIds.some(cid => exam.classIds.includes(cid));
                }).map(s => ({ value: String(s.id), label: `${s.name} (${s.code})` }))} required />
                <FormField label="Exam Date" type="date" value={scheduleModal.data.date || ''} onChange={v => handleScheduleField('date', v)} required />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Time" type="time" value={scheduleModal.data.startTime || ''} onChange={v => handleScheduleField('startTime', v)} required />
                  <FormField label="End Time" type="time" value={scheduleModal.data.endTime || ''} onChange={v => handleScheduleField('endTime', v)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Room (optional)" value={scheduleModal.data.room || ''} onChange={v => handleScheduleField('room', v)} />
                  <FormSelect label="Invigilator" value={scheduleModal.data.invigilator || ''} onChange={v => handleScheduleField('invigilator', v)} options={staff.map(s => ({ value: s.name, label: `${s.name} (${s.role})` }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Full Marks" type="number" value={String(scheduleModal.data.fullMarks || 100)} onChange={v => handleScheduleField('fullMarks', Number(v))} required />
                  <FormField label="Pass Marks" type="number" value={String(scheduleModal.data.passMarks || 33)} onChange={v => handleScheduleField('passMarks', Number(v))} required />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={scheduleModal.data.isPractical || false} onChange={e => handleScheduleField('isPractical', e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border-light)] text-brand-primary focus:ring-brand-primary" />
                  <span className="text-sm text-[var(--text-primary)]">Practical Examination</span>
                </label>

                {/* Conflict Check */}
                <div className="pt-2">
                  <button onClick={checkConflicts} className="px-4 py-2 border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <AlertTriangle size={15} /> Check Conflicts
                  </button>
                  {scheduleConflicts.length > 0 && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <p className="text-xs font-semibold badge-rose mb-1.5">{scheduleConflicts.length} Conflict(s) Detected:</p>
                      <ul className="space-y-1">
                        {scheduleConflicts.map((c, i) => (
                          <li key={i} className="text-xs text-rose-600 flex items-start gap-1.5">
                            <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                            <span>{c.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-[var(--border-light)] flex gap-3">
                {scheduleModal.mode === 'edit' && scheduleModal.data.id && (
                  <button onClick={() => { if (confirm('Delete this schedule entry?')) { handleDeleteSchedule(scheduleModal.data.id!); closeScheduleModal(); } }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                )}
                <button onClick={closeScheduleModal} className={`${scheduleModal.mode === 'edit' ? 'flex-1' : 'flex-1'} px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors`}>Cancel</button>
                <button onClick={handleSaveSchedule} disabled={scheduleSaving}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${scheduleSaving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm'}`}>
                  {scheduleSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {scheduleSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── RESULT VIEW MODAL ── */}
      <AnimatePresence>
        {viewingResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={() => setViewingResult(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-3xl z-10 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[var(--bg-secondary)] z-10 px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between rounded-t-2xl">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Result Details</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePrintReport(viewingResult)} className="px-3 py-1.5 bg-brand-primary hover:bg-brand-mid text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5">
                    <Printer size={14} /> Print
                  </button>
                  <button onClick={() => setViewingResult(null)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-light)]">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{viewingResult.studentName}</h2>
                    <p className="text-sm text-[var(--text-muted)]">{viewingResult.studentId} &bull; {viewingResult.className} &bull; {viewingResult.section}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-[var(--text-primary)]">{viewingResult.gpa.toFixed(2)}</div>
                    <div className={`text-sm font-semibold ${viewingResult.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {viewingResult.isPassed ? 'Passed' : 'Failed'} &bull; Merit #{viewingResult.meritPosition}
                    </div>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)]">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold text-left">Subject</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Full Marks</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Pass Marks</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Obtained</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Grade</th>
                      <th className="px-4 py-2.5 font-semibold text-center">GP</th>
                      <th className="px-4 py-2.5 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-light)]">
                    {viewingResult.subjectResults.map(sr => (
                      <tr key={sr.subjectId}>
                        <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">{sr.subjectName}</td>
                        <td className="px-4 py-2.5 text-center text-[var(--text-secondary)]">{sr.fullMarks}</td>
                        <td className="px-4 py-2.5 text-center text-[var(--text-secondary)]">{sr.passMarks}</td>
                        <td className="px-4 py-2.5 text-center font-semibold">{sr.isAbsent ? '—' : sr.obtainedMarks}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                            sr.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' :
                            sr.grade === 'F' || sr.grade === '—' ? 'bg-rose-100 text-rose-700' :
                            'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                          }`}>{sr.grade}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center font-medium">{sr.gradePoint.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-center">
                          {sr.isAbsent ? <span className="text-xs text-rose-500">Absent</span> : sr.isPassed ? <Check size={14} className="text-emerald-500 mx-auto" /> : <X size={14} className="text-rose-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[var(--bg-tertiary)] font-semibold">
                    <tr>
                      <td className="px-4 py-3 text-[var(--text-primary)]">Total</td>
                      <td className="px-4 py-3 text-center text-[var(--text-primary)]">{viewingResult.totalFullMarks}</td>
                      <td className="px-4 py-3 text-center text-[var(--text-primary)]"></td>
                      <td className="px-4 py-3 text-center text-[var(--text-primary)]">{viewingResult.totalMarks}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold ${
                          viewingResult.grade === 'A+' ? 'bg-emerald-100 text-emerald-700' :
                          viewingResult.grade === 'F' ? 'bg-rose-100 text-rose-700' :
                          'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                        }`}>{viewingResult.grade}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-[var(--text-primary)]">{viewingResult.gpa.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE CONFIRM ── */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-sm z-10 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-rose-600" /></div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Delete {confirmDelete.type === 'exam' ? 'Exam' : 'Schedule'}?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Are you sure you want to delete <span className="font-semibold text-[var(--text-primary)]">{confirmDelete.label}</span>? This will also remove associated schedules and marks.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={() => handleDeleteExam(confirmDelete.id)} className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared UI Components ──
function FormField({ label, value, onChange, type = 'text', required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label} {required && <span className="text-rose-500">*</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
    </div>
  );
}

function FormSelect({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] | string[]; required?: boolean }) {
  const opts = Array.isArray(options) ? (typeof options[0] === 'string' ? (options as string[]).map(o => ({ value: o, label: o })) : options as { value: string; label: string }[]) : [];
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label} {required && <span className="text-rose-500">*</span>}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-[var(--bg-secondary)]">
        <option value="">— Select —</option>
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorBar: Record<string, string> = { blue: 'bg-[var(--brand-primary)]', indigo: 'bg-[var(--brand-primary)]', emerald: 'bg-[var(--brand-primary)]', rose: 'bg-rose-500', amber: 'bg-amber-500' };
  return (
    <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-light)] shadow-sm flex items-center gap-4">
      <div className={`w-1.5 h-12 rounded-full ${colorBar[color] || 'bg-[var(--bg-tertiary)]0'}`} />
      <div>
        <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>
        <p className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── Report Card HTML Generator ──
function generateReportCardHTML(result: ExamResult, exam?: Exam, attendanceSummary?: any): string {
  const subjects = result.subjectResults.map(sr => `
    <tr>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;font-size:13px;">${sr.subjectName}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-size:13px;">${sr.fullMarks}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-size:13px;">${sr.obtainedMarks}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-size:13px;font-weight:bold;">${sr.grade}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-size:13px;">${sr.gradePoint.toFixed(2)}</td>
      <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center;font-size:13px;">${sr.isPassed ? 'PASS' : 'FAIL'}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Report Card - ${result.studentName}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #1e293b; }
  .container { max-width: 800px; margin: 0 auto; }
  .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { margin: 0; font-size: 24px; color: #1e293b; }
  .header h2 { margin: 4px 0; font-size: 18px; color: #475569; font-weight: 500; }
  .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; padding: 12px 16px; background: #f8fafc; border-radius: 8px; }
  .student-info div { font-size: 13px; }
  .student-info strong { color: #334155; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #f1f5f9; padding: 10px 12px; border: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; }
  td { padding: 8px 12px; border: 1px solid #e2e8f0; font-size: 13px; }
  .summary { display: flex; justify-content: space-between; margin-top: 16px; padding: 12px 16px; background: #f0fdf4; border-radius: 8px; }
  .summary-fail { background: #fef2f2; }
  .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  .grade-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-weight: bold; font-size: 16px; }
  .grade-Aplus { background: #d1fae5; color: #065f46; }
  .grade-A { background: #dbeafe; color: #1e40af; }
  .grade-F { background: #fecaca; color: #991b1b; }
</style></head><body>
<div class="container">
  <div class="header">
    <h1>${exam?.name || 'Examination Report Card'}</h1>
    <h2>${exam?.academicYear || ''} &bull; ${exam?.term || ''}</h2>
  </div>
  <div class="student-info">
    <div><strong>Student:</strong> ${result.studentName}</div>
    <div><strong>ID:</strong> ${result.studentId}</div>
    <div><strong>Class:</strong> ${result.className}</div>
    <div><strong>Section:</strong> ${result.section}</div>
  </div>
  <table>
    <thead><tr>
      <th style="text-align:left;">Subject</th><th>Full Marks</th><th>Obtained</th><th>Grade</th><th>GP</th><th>Status</th>
    </tr></thead>
    <tbody>${subjects}</tbody>
  </table>
  <div class="summary ${!result.isPassed ? 'summary-fail' : ''}">
    <div><strong>Total:</strong> ${result.totalMarks} / ${result.totalFullMarks}</div>
    <div><strong>GPA:</strong> ${result.gpa.toFixed(2)}</div>
    <div><strong>Grade:</strong> <span class="grade-badge grade-${result.grade}">${result.grade}</span></div>
    <div><strong>Merit:</strong> #${result.meritPosition}</div>
    <div><strong>Result:</strong> ${result.isPassed ? 'PASSED' : 'FAILED'}</div>
  </div>
  ${attendanceSummary ? `<div style="margin-top:12px;padding:8px 16px;background:#f8fafc;border-radius:8px;font-size:13px;"><strong>Attendance:</strong> Present: ${attendanceSummary.present || 0} | Absent: ${attendanceSummary.absent || 0} | Late: ${attendanceSummary.late || 0} | Leave: ${attendanceSummary.leave || 0} | Percentage: ${attendanceSummary.percentage || 0}%</div>` : ''}
  <div style="margin-top:16px;"><em style="font-size:12px;color:#64748b;">Teacher's Remarks: ___________________________________________________</em></div>
  <div class="footer">Generated by GenSchool Management System on ${new Date().toLocaleDateString()}</div>
</div></body></html>`;
}
