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
        setAllStudents(prev =>
          prev.map(s => s.id === studentId
            ? { ...s, status: s.status === 'Suspended' ? 'Active' : 'Suspended' }
            : s
          )
        );
        break;
      case 'delete':
        setAllStudents(prev => prev.filter(s => s.id !== studentId));
        break;
    }
  };

  const badgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'badge-green';
      case 'pending': return 'badge-amber';
      case 'suspended': return 'badge-rose';
      default: return 'badge-slate';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Students</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage student records and enrollment</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn btn-secondary btn-sm">
            <Download size={16} />
            Export
          </button>
          <Link href="/admin/students/new" className="btn btn-primary btn-sm">
            <UserPlus size={16} />
            Add Student
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="input pl-10"
              placeholder="Search by name, ID, or guardian..."
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}
            className="select sm:w-44"
          >
            <option value="">All Classes</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="select sm:w-40"
          >
            <option value="">All Status</option>
            {statusOptions.map(st => (
              <option key={st} value={st.toLowerCase()}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Section</th>
                <th>Roll</th>
                <th>Status</th>
                <th>Guardian</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="font-mono text-xs text-[var(--text-muted)]">{student.id}</td>
                    <td className="font-medium text-[var(--text-primary)]">{student.name}</td>
                    <td>{student.class}</td>
                    <td>{student.section}</td>
                    <td>{student.roll}</td>
                    <td>
                      <span className={`badge ${badgeVariant(student.status)}`}>
                        {student.status === 'Active' ? <CheckCircle2 size={12} /> : student.status === 'Pending' ? <Clock size={12} /> : <XCircle size={12} />}
                        {student.status}
                      </span>
                    </td>
                    <td className="text-[var(--text-muted)]">{student.guardian}</td>
                    <td className="text-right relative">
                      <button
                        onClick={() => setActionMenuStudentId(actionMenuStudentId === student.id ? null : student.id)}
                        className="btn btn-ghost btn-icon-sm"
                        aria-label="Actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      <AnimatePresence>
                        {actionMenuStudentId === student.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-1 w-44 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-lg z-50 overflow-hidden"
                          >
                            <div className="p-1">
                              {actionItems.map(action => (
                                <button
                                  key={action.id}
                                  onClick={() => handleAction(action.id, student.id)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-3 transition-colors ${
                                    action.danger
                                      ? 'text-rose-500 hover:bg-rose-50'
                                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                  }`}
                                >
                                  <action.icon size={14} />
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Search size={24} />
                      </div>
                      <div className="empty-state-title">No students found</div>
                      <div className="empty-state-desc">Try adjusting your search or filter criteria.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
            <p className="text-sm text-[var(--text-muted)]">
              Showing {(safePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(safePage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                disabled={safePage <= 1}
                className="btn btn-ghost btn-sm disabled:opacity-30"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === safePage
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                disabled={safePage >= totalPages}
                className="btn btn-ghost btn-sm disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
