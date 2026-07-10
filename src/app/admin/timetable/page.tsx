'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Printer,
  Share2,
  AlertTriangle,
  Clock,
  X,
  Save,
  Trash2,
  Loader2,
  Plus,
  Pencil,
  List
} from 'lucide-react';

interface Period {
  id: string;
  label: string;
  start: string;
  end: string;
  isBreak: boolean;
}

interface TimetableEntry {
  subject: string;
  teacher: string;
  room: string;
  color: Color;
}

type DaySchedule = Partial<Record<string, TimetableEntry>>;
type ClassSchedule = Record<string, DaySchedule>;

const colors = ['indigo', 'blue', 'emerald', 'violet', 'rose', 'amber', 'slate', 'cyan', 'orange', 'teal'] as const;
type Color = typeof colors[number];

const colorStyles: Record<Color, { bg: string; border: string; text: string; bar: string }> = {
  indigo:  { bg: 'bg-[var(--green-50)]',  border: 'border-[var(--green-200)]',  text: 'text-[var(--green-800)]',  bar: 'bg-[var(--brand-primary)]' },
  blue:    { bg: 'bg-[var(--green-50)]',    border: 'border-[var(--green-200)]',    text: 'text-[var(--green-800)]',    bar: 'bg-[var(--brand-mid)]' },
  emerald: { bg: 'bg-[var(--green-50)]', border: 'border-[var(--green-200)]', text: 'text-[var(--green-800)]', bar: 'bg-[var(--brand-light)]' },
  violet:  { bg: 'bg-[var(--green-50)]',  border: 'border-[var(--green-200)]',  text: 'text-[var(--green-800)]',  bar: 'bg-[var(--brand-deep)]' },
  rose:    { bg: 'bg-[var(--color-error-bg)]',    border: 'border-[var(--color-error)]/20',    text: 'text-[var(--color-error)]',    bar: 'bg-[var(--color-error)]' },
  amber:   { bg: 'bg-[var(--color-warning-bg)]',   border: 'border-[var(--color-warning)]/20',   text: 'text-[var(--color-warning)]',   bar: 'bg-[var(--color-warning)]' },
  slate:   { bg: 'bg-[var(--bg-secondary)]',   border: 'border-[var(--border-color)]',   text: 'text-[var(--text-secondary)]',   bar: 'bg-slate-500' },
  cyan:    { bg: 'bg-[var(--green-50)]',    border: 'border-[var(--green-200)]',    text: 'text-[var(--green-800)]',    bar: 'bg-[var(--brand-light)]' },
  orange:  { bg: 'bg-[var(--color-warning-bg)]',  border: 'border-[var(--color-warning)]/20',  text: 'text-[var(--color-warning)]',  bar: 'bg-[var(--color-warning)]' },
  teal:    { bg: 'bg-[var(--green-50)]', border: 'border-[var(--green-200)]', text: 'text-[var(--green-800)]', bar: 'bg-[var(--brand-mid)]' },
};

const allDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const workingDays = allDays.filter(d => d !== 'Friday');

const defaultPeriods: Period[] = [
  { id: 'p1', label: '08:00 AM', start: '08:00', end: '08:45', isBreak: false },
  { id: 'p2', label: '09:00 AM', start: '09:00', end: '09:45', isBreak: false },
  { id: 'p3', label: '10:00 AM', start: '10:00', end: '10:45', isBreak: false },
  { id: 'p4', label: '11:00 AM', start: '11:00', end: '11:45', isBreak: false },
  { id: 'p5', label: '12:00 PM', start: '12:00', end: '12:45', isBreak: true },
  { id: 'p6', label: '01:00 PM', start: '13:00', end: '13:45', isBreak: false },
  { id: 'p7', label: '02:00 PM', start: '14:00', end: '14:45', isBreak: false },
];

const defaultClassOptions = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const defaultSectionOptions = ['Section A', 'Section B', 'Section C'];

let periodCounter = 8;

function initPeriods(): Period[] {
  try {
    const stored = localStorage.getItem('timetable_periods');
    if (stored) {
      const p = JSON.parse(stored);
      if (Array.isArray(p) && p.length) {
        const maxId = p.reduce((mx: number, x: Period) => {
          const n = parseInt(x.id.replace('p', ''), 10);
          return isNaN(n) ? mx : Math.max(mx, n);
        }, 7);
        periodCounter = maxId + 1;
        return p;
      }
    }
  } catch {}
  return defaultPeriods;
}

function buildDefaultSchedule(periods: Period[]): ClassSchedule {
  const monday: DaySchedule = {};
  const tuesday: DaySchedule = {};

  const timeMap: Record<string, string> = {};
  periods.forEach(p => { timeMap[p.label] = p.id; });

  const m1 = timeMap['08:00 AM']; if (m1) monday[m1] = { subject: 'Physics', teacher: 'Dr. Hasan', room: 'R-101', color: 'indigo' };
  const m2 = timeMap['09:00 AM']; if (m2) monday[m2] = { subject: 'Mathematics', teacher: 'Abdul Karim', room: 'R-101', color: 'blue' };
  const m3 = timeMap['10:00 AM']; if (m3) monday[m3] = { subject: 'Chemistry', teacher: 'S. Akter', room: 'Lab-1', color: 'emerald' };
  const m4 = timeMap['11:00 AM']; if (m4) monday[m4] = { subject: 'English', teacher: 'F. Yeasmin', room: 'R-101', color: 'violet' };
  const m6 = timeMap['01:00 PM']; if (m6) monday[m6] = { subject: 'Bangla', teacher: 'M. Ali', room: 'R-101', color: 'rose' };
  const m7 = timeMap['02:00 PM']; if (m7) monday[m7] = { subject: 'Biology', teacher: 'Dr. Rahman', room: 'R-101', color: 'amber' };

  const t1 = timeMap['08:00 AM']; if (t1) tuesday[t1] = { subject: 'Mathematics', teacher: 'Abdul Karim', room: 'R-101', color: 'blue' };
  const t2 = timeMap['09:00 AM']; if (t2) tuesday[t2] = { subject: 'Physics', teacher: 'Dr. Hasan', room: 'R-101', color: 'indigo' };
  const t3 = timeMap['10:00 AM']; if (t3) tuesday[t3] = { subject: 'Biology', teacher: 'Dr. Rahman', room: 'Lab-2', color: 'amber' };
  const t4 = timeMap['11:00 AM']; if (t4) tuesday[t4] = { subject: 'Religion', teacher: 'H. Uddin', room: 'R-101', color: 'slate' };

  return {
    Monday: monday,
    Tuesday: tuesday,
    Saturday: {},
    Sunday: {},
    Wednesday: {},
    Thursday: {},
  };
}

function initStore(periods: Period[]): Record<string, Record<string, ClassSchedule>> {
  try {
    const stored = localStorage.getItem('timetable_store');
    if (stored) {
      const p = JSON.parse(stored);
      if (p && typeof p === 'object') return p;
    }
  } catch {}
  return { 'Class 10': { 'Section A': buildDefaultSchedule(periods) } };
}

function initAcademicClasses(): string[] {
  try {
    const stored = localStorage.getItem('academic_classes');
    if (stored) {
      const p = JSON.parse(stored);
      if (Array.isArray(p)) return p.map((c: any) => c.name);
    }
  } catch {}
  return defaultClassOptions;
}

function initAcademicSections(): string[] {
  try {
    const stored = localStorage.getItem('academic_sections');
    if (stored) {
      const p = JSON.parse(stored);
      if (Array.isArray(p)) return [...new Set(p.map((s: any) => s.name))];
    }
  } catch {}
  return defaultSectionOptions;
}

function conflictKey(teacher: string, day: string): string {
  return `${teacher}||${day}`;
}

export default function TimetableManagerPage() {
  const [periods, setPeriods] = useState<Period[]>(() => initPeriods());
  const [store, setStore] = useState<Record<string, Record<string, ClassSchedule>>>(() => initStore(initPeriods()));
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [classOptions, setClassOptions] = useState<string[]>(() => initAcademicClasses());
  const [sectionOptions, setSectionOptions] = useState<string[]>(() => initAcademicSections());
  const [modal, setModal] = useState<{
    open: boolean; mode: 'add' | 'edit'; day: string; periodId: string; data: TimetableEntry;
  } | null>(null);
  const [periodModal, setPeriodModal] = useState<{
    mode: 'add' | 'edit'; data: Period;
  } | null>(null);
  const [classSectionModal, setClassSectionModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Persist
  useEffect(() => { localStorage.setItem('timetable_periods', JSON.stringify(periods)); }, [periods]);
  useEffect(() => { localStorage.setItem('timetable_store', JSON.stringify(store)); }, [store]);

  // Sync academic classes/sections from localStorage on mount
  useEffect(() => {
    const storedClasses = localStorage.getItem('academic_classes');
    if (storedClasses) {
      try {
        const p = JSON.parse(storedClasses);
        if (Array.isArray(p)) setClassOptions(p.map((c: any) => c.name));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const storedSections = localStorage.getItem('academic_sections');
    if (storedSections) {
      try {
        const p = JSON.parse(storedSections);
        if (Array.isArray(p)) setSectionOptions([...new Set(p.map((s: any) => s.name))]);
      } catch {}
    }
  }, []);

  // Ensure selected section exists for current class
  useEffect(() => {
    if (!store[selectedClass]) {
      setStore(prev => ({ ...prev, [selectedClass]: { 'Section A': {} } }));
    } else if (!store[selectedClass][selectedSection]) {
      const keys = Object.keys(store[selectedClass]);
      setSelectedSection(keys[0] || 'Section A');
    }
  }, [selectedClass, selectedSection, store]);

  const currentSchedule: ClassSchedule = useMemo(
    () => store[selectedClass]?.[selectedSection] || {},
    [store, selectedClass, selectedSection]
  );

  const getEntry = (day: string, periodId: string): TimetableEntry | undefined =>
    currentSchedule[day]?.[periodId];

  const openAdd = (day: string, periodId: string) => {
    setModal({
      open: true, mode: 'add', day, periodId,
      data: { subject: '', teacher: '', room: '', color: 'blue' },
    });
  };

  const openEdit = (day: string, periodId: string) => {
    const entry = getEntry(day, periodId);
    if (entry) setModal({ open: true, mode: 'edit', day, periodId, data: { ...entry } });
  };

  const closeModal = () => setModal(null);

  const handleSave = () => {
    if (!modal) return;
    if (!modal.data.subject.trim()) return alert('Subject name is required.');
    setSaving(true);
    setTimeout(() => {
      const m = modal!;
      setStore(prev => {
        const updated = { ...prev };
        if (!updated[selectedClass]) updated[selectedClass] = {};
        if (!updated[selectedClass][selectedSection]) updated[selectedClass][selectedSection] = {};
        const schedule = { ...updated[selectedClass][selectedSection] };
        const daySchedule = { ...(schedule[m.day] || {}) };
        daySchedule[m.periodId] = { ...m.data };
        schedule[m.day] = daySchedule;
        updated[selectedClass][selectedSection] = schedule;
        return updated;
      });
      setSaving(false);
      closeModal();
    }, 300);
  };

  const handleDelete = () => {
    if (!modal) return;
    setStore(prev => {
      const updated = { ...prev };
      const schedule = { ...(updated[selectedClass]?.[selectedSection] || {}) };
      const daySchedule = { ...(schedule[modal!.day] || {}) };
      delete daySchedule[modal!.periodId];
      schedule[modal!.day] = daySchedule;
      if (!updated[selectedClass]) updated[selectedClass] = {};
      updated[selectedClass][selectedSection] = schedule;
      return updated;
    });
    closeModal();
  };

  // Period management
  const openAddPeriod = () => {
    periodCounter++;
    setPeriodModal({
      mode: 'add',
      data: { id: `p${periodCounter}`, label: '', start: '09:00', end: '09:45', isBreak: false },
    });
  };

  const openEditPeriod = (p: Period) => {
    setPeriodModal({ mode: 'edit', data: { ...p } });
  };

  const handleSavePeriod = () => {
    if (!periodModal) return;
    const d = periodModal.data;
    if (!d.label.trim()) return alert('Period label is required.');
    if (periodModal.mode === 'add') {
      setPeriods(prev => [...prev, d]);
    } else {
      setPeriods(prev => prev.map(p => p.id === d.id ? d : p));
    }
    setPeriodModal(null);
  };

  const handleDeletePeriod = (id: string) => {
    setPeriods(prev => prev.filter(p => p.id !== id));
    setPeriodModal(null);
  };

  // Class/Section management
  const handleAddClass = () => {
    const name = newClassName.trim();
    if (!name) return alert('Class name is required.');
    if (classOptions.includes(name)) return alert('Class already exists.');
    setClassOptions(prev => [...prev, name].sort());
    // Sync to academic_classes localStorage
    try {
      const stored = localStorage.getItem('academic_classes');
      const classes = stored ? JSON.parse(stored) : [];
      if (Array.isArray(classes)) {
        const nextId = Math.max(0, ...classes.map((c: any) => c.id)) + 1;
        classes.push({ id: nextId, name, code: '', grade: '', description: '', students: 0, status: 'Active' });
        localStorage.setItem('academic_classes', JSON.stringify(classes));
      }
    } catch {}
    setNewClassName('');
  };

  const handleAddSection = () => {
    const name = newSectionName.trim();
    if (!name) return alert('Section name is required.');
    if (sectionOptions.includes(name)) return alert('Section already exists.');
    setSectionOptions(prev => [...prev, name].sort());
    // Sync to academic_sections localStorage
    try {
      const stored = localStorage.getItem('academic_sections');
      const sections = stored ? JSON.parse(stored) : [];
      if (Array.isArray(sections)) {
        const nextId = Math.max(0, ...sections.map((s: any) => s.id)) + 1;
        sections.push({ id: nextId, name, classId: 1, capacity: 45, teacher: '', description: '', students: 0 });
        localStorage.setItem('academic_sections', JSON.stringify(sections));
      }
    } catch {}
    setNewSectionName('');
  };

  // Conflict detection
  const conflicts = useMemo(() => {
    const teacherDayMap: Record<string, { day: string; periodId: string }[]> = {};
    for (const day of workingDays) {
      for (const period of periods) {
        if (period.isBreak) continue;
        const entry = currentSchedule[day]?.[period.id];
        if (entry && entry.teacher) {
          const key = conflictKey(entry.teacher, day);
          if (!teacherDayMap[key]) teacherDayMap[key] = [];
          teacherDayMap[key].push({ day, periodId: period.id });
        }
      }
    }
    const result: Set<string> = new Set();
    for (const slots of Object.values(teacherDayMap)) {
      if (slots.length > 1) {
        slots.forEach(s => result.add(`${s.day}|${s.periodId}`));
      }
    }
    return result;
  }, [currentSchedule, periods]);

  const handlePrint = () => { window.print(); };
  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Timetable Manager</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {periods.length} periods &bull; {workingDays.length} academic days &bull; Friday holiday
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handlePrint} className="bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Printer size={16} /> Print
          </button>
          <button onClick={handlePublish} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-brand-primary/20 transition-all flex items-center gap-2">
            <Share2 size={16} />
            {published ? 'Published!' : 'Publish Timetable'}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border border-[var(--border-light)] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedClass}
            onChange={e => {
              setSelectedClass(e.target.value);
              if (!store[e.target.value]?.[selectedSection]) {
                setSelectedSection(sectionOptions[0] || 'Section A');
              }
            }}
            className="px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full sm:w-auto"
          >
            {classOptions.map(c => <option key={c}>{c}</option>)}
          </select>
          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-light)] rounded-xl text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full sm:w-auto"
          >
            {sectionOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={openAddPeriod}
            className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Clock size={16} /> Periods
          </button>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]"></span> Valid
          </div>
          <div className={`flex items-center gap-1.5 ${conflicts.size > 0 ? 'text-[var(--color-error)]' : 'text-[var(--text-muted)]'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${conflicts.size > 0 ? 'bg-[var(--color-error)]' : 'bg-[var(--border-light)]'}`}></span>
            {conflicts.size > 0 ? `${conflicts.size} Conflict${conflicts.size > 1 ? 's' : ''} Detected` : 'No Conflicts'}
          </div>
          <div className="relative">
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
              <Settings size={18} />
            </button>
            {settingsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSettingsOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-light)] shadow-lg p-2 min-w-[180px]">
                  <button onClick={() => { setClassSectionModal(true); setSettingsOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors flex items-center gap-2">
                    <List size={15} /> Manage Classes & Sections
                  </button>
                  <button onClick={() => { setSettingsOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
                    Export as CSV
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] shadow-sm overflow-hidden overflow-x-auto glass-panel animate-in">
        <table className="w-full text-sm text-left border-collapse min-w-[900px] data-table">
          <thead>
            <tr>
              <th className="px-4 py-4 font-semibold text-[var(--text-muted)] bg-[var(--bg-tertiary)] border-b border-r border-[var(--border-light)] w-24 text-center">
                <Clock size={16} className="mx-auto mb-1 opacity-50" />
                Period
              </th>
              {allDays.map(day => (
                <th key={day} className={`px-4 py-4 font-semibold border-b border-r border-[var(--border-light)] last:border-r-0 text-center ${day === 'Friday' ? 'bg-[var(--bg-tertiary)] text-[var(--color-warning)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'}`}>
                  {day}
                  {day === 'Friday' && <div className="text-[10px] font-normal mt-0.5">Holiday</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => {
              const isBreak = period.isBreak;
              return (
                <tr key={period.id}>
                  <td className="px-4 py-4 font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] border-b border-r border-[var(--border-light)] text-center text-xs">
                    <div>{period.label}</div>
                    {!isBreak && period.start && (
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{period.start} - {period.end}</div>
                    )}
                    {isBreak && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Break</div>}
                  </td>
                  {isBreak ? (
                    <td colSpan={allDays.length} className="px-4 py-3 font-semibold text-[var(--text-muted)] bg-[var(--bg-tertiary)] border-b border-[var(--border-light)] text-center tracking-widest uppercase">
                      {period.label} &mdash; BREAK
                    </td>
                  ) : (
                    allDays.map(day => {
                      if (day === 'Friday') {
                        return (
                          <td key={`${day}-${period.id}`} className="p-2 border-b border-r border-[var(--border-light)] bg-[var(--color-warning-bg)]/30 text-center align-middle">
                            <span className="text-xs font-medium text-[var(--color-warning)]">HOLIDAY</span>
                          </td>
                        );
                      }
                      const slotData = getEntry(day, period.id);
                      const hasConflict = slotData && conflicts.has(`${day}|${period.id}`);
                      return (
                        <td
                          key={`${day}-${period.id}`}
                          onClick={() => slotData ? openEdit(day, period.id) : openAdd(day, period.id)}
                          className="p-2 border-b border-r border-[var(--border-light)] last:border-r-0 bg-[var(--bg-secondary)] group hover:bg-[var(--bg-tertiary)]/50 transition-colors align-top cursor-pointer"
                        >
                          {slotData ? (
                            <motion.div
                              layoutId={`${day}-${period.id}`}
                              className={`p-3 rounded-xl border ${colorStyles[slotData.color].bg} ${colorStyles[slotData.color].border} cursor-default hover:shadow-md transition-shadow relative overflow-hidden`}
                            >
                              <div className={`absolute top-0 left-0 w-1 h-full ${colorStyles[slotData.color].bar}`} />
                              <div className={`font-bold ${colorStyles[slotData.color].text} text-sm mb-1`}>{slotData.subject}</div>
                              <div className="text-xs font-medium text-[var(--text-secondary)]">{slotData.teacher}</div>
                              <div className="text-xs text-[var(--text-muted)] mt-1 flex items-center justify-between">
                                <span>{slotData.room}</span>
                                {hasConflict && (
                                  <div className="w-5 h-5 rounded-full bg-[var(--color-error-bg)] text-[var(--color-error)] flex items-center justify-center" title="Teacher double booked">
                                    <AlertTriangle size={12} />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <div className="h-full w-full min-h-[80px] rounded-xl border-2 border-dashed border-[var(--border-light)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs font-medium text-[var(--text-muted)]">Click to add</span>
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Timetable Entry Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-md z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">{modal.mode === 'add' ? 'Add' : 'Edit'} Timetable Entry</h3>
                <button onClick={closeModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2 text-sm text-[var(--text-muted)] mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-tertiary)] font-medium">{modal.day}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-tertiary)] font-medium">{periods.find(p => p.id === modal.periodId)?.label || modal.periodId}</span>
                </div>
                <Field label="Subject Name" value={modal.data.subject} onChange={v => setModal(m => m ? { ...m, data: { ...m.data, subject: v } } : null)} />
                <Field label="Teacher" value={modal.data.teacher} onChange={v => setModal(m => m ? { ...m, data: { ...m.data, teacher: v } } : null)} />
                <Field label="Room" value={modal.data.room} onChange={v => setModal(m => m ? { ...m, data: { ...m.data, room: v } } : null)} />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--text-primary)]">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => (
                      <button key={color} type="button" onClick={() => setModal(m => m ? { ...m, data: { ...m.data, color } } : null)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${colorStyles[color].bg} ${colorStyles[color].border} ${modal.data.color === color ? 'ring-2 ring-offset-2 ring-brand-primary scale-110' : ''}`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-[var(--border-light)] mt-6">
                  {modal.mode === 'edit' && (
                    <button onClick={handleDelete} className="px-4 py-2 bg-[var(--color-error)] hover:bg-[var(--color-error)] text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                  <button onClick={closeModal} className={`${modal.mode === 'edit' ? 'flex-1' : 'flex-1'} px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors`}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${saving ? 'bg-brand-mid/60 cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm shadow-brand-primary/20'}`}
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Period Manager Modal */}
      <AnimatePresence>
        {periodModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={() => setPeriodModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-2xl z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Manage Periods</h3>
                <button onClick={() => setPeriodModal(null)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Current period list */}
                <div className="space-y-2">
                  {periods.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border-light)]">
                      <span className="text-xs font-medium text-[var(--text-muted)] w-6">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--text-primary)]">{p.label}</span>
                          {p.isBreak && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-warning-bg)] text-[var(--color-warning)] font-medium">Break</span>}
                        </div>
                        {!p.isBreak && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">{p.start} - {p.end}</div>
                        )}
                      </div>
                      <button onClick={() => openEditPeriod(p)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDeletePeriod(p.id)} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new period form */}
                <div className="border-t border-[var(--border-light)] pt-4">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Add New Period</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Label</label>
                      <input type="text" value={periodModal.data.label} onChange={e => setPeriodModal(pm => pm ? { ...pm, data: { ...pm.data, label: e.target.value } } : null)}
                        placeholder="e.g., 08:00 AM" className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">Start</label>
                      <input type="time" value={periodModal.data.start} onChange={e => setPeriodModal(pm => pm ? { ...pm, data: { ...pm.data, start: e.target.value } } : null)}
                        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--text-muted)]">End</label>
                      <input type="time" value={periodModal.data.end} onChange={e => setPeriodModal(pm => pm ? { ...pm, data: { ...pm.data, end: e.target.value } } : null)}
                        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={periodModal.data.isBreak} onChange={e => setPeriodModal(pm => pm ? { ...pm, data: { ...pm.data, isBreak: e.target.checked } } : null)}
                          className="w-4 h-4 rounded border-[var(--border-light)] text-brand-primary focus:ring-brand-primary" />
                        <span className="text-sm text-[var(--text-secondary)]">Break period</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleSavePeriod} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                      <Plus size={16} /> {periodModal.mode === 'add' ? 'Add Period' : 'Update Period'}
                    </button>
                    {periodModal.mode === 'edit' && (
                      <button onClick={() => handleDeletePeriod(periodModal.data.id)} className="px-4 py-2 bg-[var(--color-error)] hover:bg-[var(--color-error)] text-white rounded-xl text-sm font-medium shadow-sm transition-colors flex items-center gap-2">
                        <Trash2 size={16} /> Delete This Period
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Class & Section Manager Modal */}
      <AnimatePresence>
        {classSectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={() => setClassSectionModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-lg z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Classes & Sections</h3>
                <button onClick={() => setClassSectionModal(false)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Classes */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Classes ({classOptions.length})</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {classOptions.map(c => (
                      <span key={c} className="px-3 py-1.5 bg-[var(--bg-tertiary)] text-brand-primary rounded-lg text-sm font-medium border border-brand-primary/30">{c}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)}
                      placeholder="New class name..." className="flex-1 px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      onKeyDown={e => e.key === 'Enter' && handleAddClass()}
                    />
                    <button onClick={handleAddClass} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
                {/* Sections */}
                <div className="border-t border-[var(--border-light)] pt-4">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Sections ({sectionOptions.length})</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sectionOptions.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-[var(--bg-tertiary)] text-brand-primary rounded-lg text-sm font-medium border border-brand-primary/30">{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text" value={newSectionName} onChange={e => setNewSectionName(e.target.value)}
                      placeholder="New section name..." className="flex-1 px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      onKeyDown={e => e.key === 'Enter' && handleAddSection()}
                    />
                    <button onClick={handleAddSection} className="px-4 py-2 bg-brand-primary hover:bg-brand-mid text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Published Toast */}
      <AnimatePresence>
        {published && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-6 right-6 bg-[var(--brand-primary)] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50"
          >
            Timetable published successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 border border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
    </div>
  );
}
