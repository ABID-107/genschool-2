'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Check,
  Search,
  MessageSquareWarning
} from 'lucide-react';
import { markOrUpdateAttendance, getAttendanceByDate, getSummary } from '@/lib/attendance';
import type { AttendanceRecord, AttendanceStatus } from '@/lib/attendance';

const colorBarMap: Record<string, string> = {
  blue: 'bg-brand-primary',
  emerald: 'bg-[var(--brand-primary)]',
  rose: 'bg-[var(--color-error)]',
  amber: 'bg-[var(--color-warning)]',
};

export default function AttendanceManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Load students and academic data on mount
  useEffect(() => {
    const students = loadStudents();
    setAllStudents(students);
    const classes = loadAcademicClasses();
    setClassOptions(classes);
    if (classes.length > 0) setSelectedClass(classes[0]);
    const sections = loadAcademicSections();
    setSectionOptions(sections);
  }, []);

  // Load attendance records when date changes
  useEffect(() => {
    setAttendanceRecords(getAttendanceByDate(selectedDate));
  }, [selectedDate]);

  // Filter students by class + section + search
  const filteredStudents = useMemo(() => {
    return allStudents.filter(s => {
      const matchesClass = !selectedClass || s.class === selectedClass;
      const matchesSection = !selectedSection || s.section?.startsWith(selectedSection);
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      return matchesClass && matchesSection && matchesSearch;
    });
  }, [allStudents, selectedClass, selectedSection, searchTerm]);

  // Merge attendance records into student rows
  const studentRows = useMemo(() => {
    return filteredStudents.map(s => {
      const record = attendanceRecords.find(r => r.userId === s.id);
      return {
        ...s,
        attendanceStatus: (record?.status || '') as AttendanceStatus,
        attendanceTime: record?.time || '-',
        attendanceMethod: record?.method || '-',
      };
    });
  }, [filteredStudents, attendanceRecords]);

  // Compute stats
  const stats = useMemo(() => {
    const summary = getSummary(attendanceRecords);
    const totalStudents = filteredStudents.length;
    return [
      { label: 'Total Students', value: String(totalStudents), color: 'blue' },
      { label: 'Present', value: String(summary.present), color: 'emerald' },
      { label: 'Absent', value: String(summary.absent), color: 'rose' },
      { label: 'Late', value: String(summary.late), color: 'amber' },
    ];
  }, [filteredStudents, attendanceRecords]);

  // Filtered section options based on selected class
  const filteredSectionOptions = useMemo(() => {
    if (!selectedClass) return sectionOptions;
    const sectionsInClass = allStudents
      .filter(s => s.class === selectedClass)
      .map(s => s.section)
      .filter(Boolean);
    return [...new Set([...sectionOptions, ...sectionsInClass])];
  }, [selectedClass, sectionOptions, allStudents]);

  const handleMark = (studentId: string, studentName: string, status: AttendanceStatus) => {
    const record = markOrUpdateAttendance(selectedDate, studentId, studentName, 'student', status);
    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => r.userId !== studentId);
      return [...filtered, record];
    });
  };

  const handleSave = () => {
    alert(`Attendance saved for ${selectedDate}. Present: ${stats[1].value}, Absent: ${stats[2].value}, Late: ${stats[3].value}`);
  };

  const handleExport = () => {
    const headers = ['Student ID,Name,Status,Time,Method'];
    const rows = studentRows.map(s =>
      `"${s.id}","${s.name}","${s.attendanceStatus || 'Unmarked'}","${s.attendanceTime}","${s.attendanceMethod}"`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Attendance Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track student attendance, view reports, and manage leaves.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
          <button onClick={() => alert('SMS notification service coming soon.')} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-brand-primary/20 transition-all flex items-center gap-2">
            <MessageSquareWarning size={16} />
            Send SMS to Absentees
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-[var(--bg-secondary)] p-4 rounded-2xl border-[var(--border-light)] shadow-sm flex items-center gap-4 stat-card">
            <div className={`w-1.5 h-12 rounded-full ${colorBarMap[stat.color] || 'bg-brand-primary'}`} />
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">{stat.label}</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-sm overflow-hidden book-page">
        {/* Controls */}
        <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-[var(--text-secondary)]"
              />
            </div>
            <select
              value={selectedClass}
              onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); }}
              className="px-4 py-2 border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-auto"
            >
              <option value="">All Classes</option>
              {classOptions.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              className="px-4 py-2 border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-full md:w-auto"
            >
              <option value="">All Sections</option>
              {filteredSectionOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-[var(--text-secondary)]"
            />
          </div>
        </div>

        {/* Student List Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left data-table">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Roll</th>
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Time In</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {studentRows.map((student) => (
                <tr key={student.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-[var(--text-secondary)]">{student.roll}</td>
                  <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{student.name}</td>
                  <td className="px-6 py-4">
                    {student.attendanceStatus ? (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        student.attendanceStatus === 'present' ? 'badge-green' :
                        student.attendanceStatus === 'late' ? 'badge-amber' :
                        student.attendanceStatus === 'leave' ? 'bg-[var(--bg-tertiary)] text-brand-primary border-[var(--border-light)]' :
                        'badge-rose'
                      }`}>
                        {student.attendanceStatus === 'present' && <CheckCircle2 size={14} />}
                        {student.attendanceStatus === 'late' && <Clock size={14} />}
                        {student.attendanceStatus === 'leave' && <CheckCircle2 size={14} />}
                        {student.attendanceStatus === 'absent' && <XCircle size={14} />}
                        {student.attendanceStatus.charAt(0).toUpperCase() + student.attendanceStatus.slice(1)}
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[var(--text-muted)]">{student.attendanceTime}</td>
                  <td className="px-6 py-4 text-[var(--text-muted)]">{student.attendanceMethod}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleMark(student.id, student.name, 'present')}
                        className="p-1.5 text-[var(--color-success)] hover:bg-[var(--color-success-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--color-success)]/20"
                        title="Mark Present"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleMark(student.id, student.name, 'absent')}
                        className="p-1.5 text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--color-error)]/20"
                        title="Mark Absent"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleMark(student.id, student.name, 'late')}
                        className="p-1.5 text-[var(--color-warning)] hover:bg-[var(--color-warning-bg)] rounded-lg transition-colors border border-transparent hover:border-[var(--color-warning)]/20"
                        title="Mark Late"
                      >
                        <Clock size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {studentRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">
                    {allStudents.length === 0 ? 'No students found. Add students first.' : 'No students match the selected filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] bg-[var(--bg-tertiary)]/50 flex justify-between items-center">
          <span className="text-sm text-[var(--text-muted)]">
            Showing {studentRows.length} student{studentRows.length !== 1 ? 's' : ''}
            {selectedClass ? ` for ${selectedClass}` : ''}
            {selectedSection ? ` ${selectedSection}` : ''}
            {' on '}{selectedDate}
          </span>
          <button onClick={handleSave} className="bg-[var(--text-primary)] hover:bg-[var(--text-primary)] text-white px-6 py-2 rounded-xl text-sm font-medium shadow-md transition-all">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

function loadStudents(): any[] {
  try {
    const stored = localStorage.getItem('students');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

function loadAcademicClasses(): string[] {
  try {
    const stored = localStorage.getItem('academic_classes');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.map((c: any) => c.name);
    }
  } catch {}
  return [];
}

function loadAcademicSections(): string[] {
  try {
    const stored = localStorage.getItem('academic_sections');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return [...new Set(parsed.map((s: any) => s.name))];
    }
  } catch {}
  return [];
}
