'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Download, 
  UserPlus, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  Clock,
  Eye,
  UserPen,
  Ban,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

const studentsData = [
  { id: 'STU-2023-001', name: 'Aarav Rahman', class: 'Class 10', section: 'A - Science', roll: '12', status: 'Active', guardian: 'Shafiq Rahman' },
  { id: 'STU-2023-002', name: 'Zara Khan', class: 'Class 8', section: 'B', roll: '05', status: 'Active', guardian: 'Kamal Khan' },
  { id: 'STU-2023-003', name: 'Omar Farooq', class: 'Class 12', section: 'Science', roll: '45', status: 'Pending', guardian: 'Tariq Farooq' },
  { id: 'STU-2023-004', name: 'Nadia Islam', class: 'Class 9', section: 'C - Arts', roll: '22', status: 'Active', guardian: 'Rafiq Islam' },
  { id: 'STU-2023-005', name: 'Ishaan Ali', class: 'Class 6', section: 'A', roll: '18', status: 'Suspended', guardian: 'Mehedi Ali' },
];

const ITEMS_PER_PAGE = 5;

const actionItems = [
  { id: 'view', label: 'View Profile', icon: Eye },
  { id: 'edit', label: 'Edit Student', icon: UserPen },
  { id: 'suspend', label: 'Suspend Student', icon: Ban },
  { id: 'delete', label: 'Delete Student', icon: Trash2, danger: true },
];

export default function StudentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMenuStudentId, setActionMenuStudentId] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState(studentsData);

  const [academicClassNames, setAcademicClassNames] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('students');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllStudents(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const newOnes = parsed.filter((s: any) => !existingIds.has(s.id));
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('academic_classes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAcademicClassNames(parsed.map((c: any) => c.name));
        }
      } catch {}
    }
  }, []);

  const classOptions = useMemo(() => {
    const fromStudents = [...new Set(allStudents.map(s => s.class))];
    return [...new Set([...academicClassNames, ...fromStudents])].sort();
  }, [academicClassNames, allStudents]);

  const statusOptions = useMemo(() => {
    return [...new Set(allStudents.map(s => s.status))];
  }, [allStudents]);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm
        || student.name.toLowerCase().includes(q)
        || student.id.toLowerCase().includes(q)
        || student.guardian.toLowerCase().includes(q);
      const matchesClass = !classFilter || student.class === classFilter;
      const matchesStatus = !statusFilter || student.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [allStudents, searchTerm, classFilter, statusFilter]);

  const safePage = Math.min(currentPage, Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE)));
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
  const paginatedStudents = filteredStudents.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const handleExport = () => {
    const headers = ['Student ID,Name,Class,Section,Roll,Guardian,Status'];
    const rows = filteredStudents.map(s =>
      `"${s.id}","${s.name}","${s.class}","${s.section}","${s.roll}","${s.guardian}","${s.status}"`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAction = (actionId: string, studentId: string) => {
    setActionMenuStudentId(null);
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    switch (actionId) {
      case 'view':
      case 'edit':
        break;
      case 'suspend':
        if (confirm(`Suspend ${student.name}?`)) {
          alert(`${student.name} has been suspended.`);
        }
        break;
      case 'delete':
        if (confirm(`Delete ${student.name} permanently? This action cannot be undone.`)) {
          alert(`${student.name} has been deleted.`);
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Student Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage enrollments, IDs, and student records.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="bg-[var(--bg-secondary)] border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <Download size={16} />
            Export
          </button>
          <Link href="/admin/students/new">
            <button className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-brand-primary/20 transition-all flex items-center gap-2">
              <UserPlus size={16} />
              Add Student
            </button>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl border-[var(--border-light)] shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by student name, ID, or guardian..."
            className="block w-full pl-10 pr-3 py-2.5 border-[var(--border-light)] rounded-xl leading-5 bg-[var(--bg-tertiary)] placeholder-slate-400 focus:outline-none focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary sm:text-sm transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-[var(--bg-tertiary)] border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All Classes</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-[var(--bg-tertiary)] border-[var(--border-light)] rounded-xl text-sm text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(st => (
              <option key={st} value={st.toLowerCase()}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-sm overflow-hidden book-page"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left data-table">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] border-b border-[var(--border-light)]">
              <tr>
                <th className="px-6 py-4 font-semibold">Student</th>
                <th className="px-6 py-4 font-semibold">Student ID</th>
                <th className="px-6 py-4 font-semibold">Class & Section</th>
                <th className="px-6 py-4 font-semibold">Guardian</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-mid flex items-center justify-center text-white font-bold border border-brand-primary">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--text-primary)] group-hover:text-brand-primary transition-colors">{student.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">Roll: {student.roll}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[var(--text-secondary)]">{student.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-[var(--text-primary)]">{student.class}</div>
                    <div className="text-xs text-[var(--text-muted)]">{student.section}</div>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{student.guardian}</td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      student.status === 'Active' ? 'badge-green' : 
                      student.status === 'Pending' ? 'badge-amber' : 
                      'badge-rose'
                    }`}>
                      {student.status === 'Active' && <CheckCircle2 size={14} />}
                      {student.status === 'Pending' && <Clock size={14} />}
                      {student.status === 'Suspended' && <XCircle size={14} />}
                      {student.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() => setActionMenuStudentId(actionMenuStudentId === student.id ? null : student.id)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    <AnimatePresence>
                      {actionMenuStudentId === student.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActionMenuStudentId(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 4 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-0 top-12 z-50 w-48 bg-[var(--bg-secondary)] rounded-xl shadow-lg border-[var(--border-light)] overflow-hidden"
                          >
                            <div className="p-1">
                              {actionItems.map(item => (
                                <button
                                  key={item.id}
                                  onClick={() => handleAction(item.id, student.id)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-3 transition-colors ${
                                    item.danger
                                      ? 'text-rose-600 hover:bg-rose-50'
                                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                  }`}
                                >
                                  <item.icon size={15} className="shrink-0" />
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">
                    No students match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--border-light)] flex items-center justify-between bg-[var(--bg-tertiary)]/50">
            <span className="text-sm text-[var(--text-muted)]">
              Showing {Math.min(filteredStudents.length, 1 + (safePage - 1) * ITEMS_PER_PAGE)} to {Math.min(filteredStudents.length, safePage * ITEMS_PER_PAGE)} of {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-2">
              <button
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded-lg text-sm transition-colors ${
                    page === safePage
                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20'
                      : 'border-[var(--border-light)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p - 1))}
                className="px-3 py-1 border-[var(--border-light)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
