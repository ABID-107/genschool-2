'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap,
  Layers,
  Book,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Loader2
} from 'lucide-react';

interface AcademicClass {
  id: number; name: string; code: string; grade: string; description: string; capacity: number; students: number; status: string;
}

interface AcademicSection {
  id: number; name: string; classId: number; capacity: number; teacher: string; description: string; students: number;
}

interface AcademicSubject {
  id: number; code: string; name: string; type: string; classIds: number[]; description: string;
}

const TABS = [
  { id: 'class', label: 'Class Manager', icon: GraduationCap },
  { id: 'section', label: 'Section Manager', icon: Layers },
  { id: 'subject', label: 'Subject Manager', icon: Book },
];

const defaultClasses: AcademicClass[] = [
  { id: 1, name: 'Class 6', code: 'CLS-6', grade: 'Grade 6', description: '', capacity: 150, students: 120, status: 'Active' },
  { id: 2, name: 'Class 7', code: 'CLS-7', grade: 'Grade 7', description: '', capacity: 150, students: 115, status: 'Active' },
  { id: 3, name: 'Class 8', code: 'CLS-8', grade: 'Grade 8', description: '', capacity: 180, students: 150, status: 'Active' },
  { id: 4, name: 'Class 9', code: 'CLS-9', grade: 'Grade 9', description: '', capacity: 160, students: 140, status: 'Active' },
  { id: 5, name: 'Class 10', code: 'CLS-10', grade: 'Grade 10', description: '', capacity: 160, students: 135, status: 'Active' },
];

const defaultSections: AcademicSection[] = [
  { id: 1, name: 'A', classId: 1, capacity: 45, teacher: '', description: '', students: 40 },
  { id: 2, name: 'B', classId: 1, capacity: 45, teacher: '', description: '', students: 42 },
  { id: 3, name: 'A (Science)', classId: 4, capacity: 50, teacher: '', description: '', students: 48 },
  { id: 4, name: 'B (Business)', classId: 4, capacity: 50, teacher: '', description: '', students: 46 },
  { id: 5, name: 'C (Arts)', classId: 4, capacity: 50, teacher: '', description: '', students: 46 },
  { id: 6, name: 'A', classId: 5, capacity: 48, teacher: '', description: '', students: 45 },
  { id: 7, name: 'B (Science)', classId: 2, capacity: 40, teacher: '', description: '', students: 38 },
  { id: 8, name: 'A', classId: 3, capacity: 50, teacher: '', description: '', students: 50 },
  { id: 9, name: 'B', classId: 3, capacity: 50, teacher: '', description: '', students: 48 },
  { id: 10, name: 'C', classId: 3, capacity: 50, teacher: '', description: '', students: 52 },
];

const defaultSubjects: AcademicSubject[] = [
  { id: 1, code: '101', name: 'Bangla 1st Paper', type: 'Core', classIds: [1, 2, 3, 4, 5], description: '' },
  { id: 2, code: '102', name: 'Bangla 2nd Paper', type: 'Core', classIds: [1, 2, 3, 4, 5], description: '' },
  { id: 3, code: '107', name: 'English 1st Paper', type: 'Core', classIds: [1, 2, 3, 4, 5], description: '' },
  { id: 4, code: '108', name: 'English 2nd Paper', type: 'Core', classIds: [1, 2, 3, 4, 5], description: '' },
  { id: 5, code: '109', name: 'Mathematics', type: 'Core', classIds: [1, 2, 3, 4, 5], description: '' },
  { id: 6, code: '136', name: 'Physics', type: 'Elective', classIds: [4, 5], description: '' },
];

function initFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) { const p = JSON.parse(stored); if (Array.isArray(p) && p.length) return p; }
  } catch {}
  return fallback;
}

export default function AcademicStructurePage() {
  const [activeTab, setActiveTab] = useState('class');
  const [search, setSearch] = useState('');

  const [classes, setClasses] = useState<AcademicClass[]>(() => initFromStorage('academic_classes', defaultClasses));
  const [sections, setSections] = useState<AcademicSection[]>(() => initFromStorage('academic_sections', defaultSections));
  const [subjects, setSubjects] = useState<AcademicSubject[]>(() => initFromStorage('academic_subjects', defaultSubjects));

  useEffect(() => localStorage.setItem('academic_classes', JSON.stringify(classes)), [classes]);
  useEffect(() => localStorage.setItem('academic_sections', JSON.stringify(sections)), [sections]);
  useEffect(() => localStorage.setItem('academic_subjects', JSON.stringify(subjects)), [subjects]);

  // Modal state shared across all entity types
  const [modal, setModal] = useState<{
    open: boolean; mode: 'add' | 'edit'; entity: 'class' | 'section' | 'subject'; data: any;
  }>({ open: false, mode: 'add', entity: 'class', data: null });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ entity: string; id: number; label: string } | null>(null);

  const sectionCountByClass = useMemo(() => {
    const map: Record<number, number> = {};
    sections.forEach(s => { map[s.classId] = (map[s.classId] || 0) + 1; });
    return map;
  }, [sections]);

  const classMap = useMemo(() => {
    const map: Record<number, string> = {};
    classes.forEach(c => { map[c.id] = c.name; });
    return map;
  }, [classes]);

  const filteredClasses = useMemo(() => {
    if (!search) return classes;
    const q = search.toLowerCase();
    return classes.filter(c => c.name.toLowerCase().includes(q));
  }, [classes, search]);

  const filteredSections = useMemo(() => {
    if (!search) return sections;
    const q = search.toLowerCase();
    return sections.filter(s => s.name.toLowerCase().includes(q) || (classMap[s.classId] || '').toLowerCase().includes(q));
  }, [sections, search, classMap]);

  const filteredSubjects = useMemo(() => {
    if (!search) return subjects;
    const q = search.toLowerCase();
    return subjects.filter(s => s.name.toLowerCase().includes(q) || s.code.includes(q) || s.type.toLowerCase().includes(q));
  }, [subjects, search]);

  const nextId = (arr: { id: number }[]) => Math.max(0, ...arr.map(x => x.id)) + 1;

  const openAdd = (entity: 'class' | 'section' | 'subject') => {
    const base = entity === 'class' ? { name: '', code: '', grade: '', description: '', capacity: 0, students: 0, status: 'Active' }
      : entity === 'section' ? { name: '', classId: classes[0]?.id || 0, capacity: 45, teacher: '', description: '', students: 0 }
      : { code: `SUB-${String(nextId(subjects) + 1).padStart(3, '0')}`, name: '', type: 'Core', classIds: [] as number[], description: '' };
    setModal({ open: true, mode: 'add', entity, data: base });
    setSearch('');
  };

  const openEdit = (entity: 'class' | 'section' | 'subject', data: any) => {
    setModal({ open: true, mode: 'edit', entity, data: { ...data } });
  };

  const closeModal = () => setModal(prev => ({ ...prev, open: false }));

  const handleSave = () => {
    const d = modal.data;
    if (!d.name?.trim()) return alert(`Please enter a ${modal.entity} name.`);
    if (modal.entity === 'class' || modal.entity === 'section') {
      const cap = Number(d.capacity);
      if (isNaN(cap) || cap < 0) return alert('Capacity must be a valid positive number.');
    }
    if (modal.entity === 'subject' && !d.classIds?.length) return alert('Please select at least one applicable class.');
    setSaving(true);
    setTimeout(() => {
      const d = modal.data;
      if (modal.entity === 'class') {
        setClasses(prev => {
          if (modal.mode === 'add') return [...prev, { ...d, id: nextId(prev) }];
          return prev.map(c => c.id === d.id ? d : c);
        });
      } else if (modal.entity === 'section') {
        setSections(prev => {
          if (modal.mode === 'add') return [...prev, { ...d, id: nextId(prev) }];
          return prev.map(s => s.id === d.id ? d : s);
        });
      } else {
        const classIds = typeof d.classIds === 'string'
          ? d.classIds.split(',').map((s: string) => Number(s.trim())).filter(Boolean)
          : d.classIds;
        const payload = { ...d, classIds };
        setSubjects(prev => {
          if (modal.mode === 'add') return [...prev, { ...payload, id: nextId(prev) }];
          return prev.map(s => s.id === payload.id ? payload : s);
        });
      }
      setSaving(false);
      closeModal();
    }, 300);
  };

  const handleDelete = (entity: 'class' | 'section' | 'subject', id: number, label: string) => {
    setConfirmDelete({ entity, id, label });
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const { entity, id } = confirmDelete;
    if (entity === 'class') setClasses(prev => prev.filter(c => c.id !== id));
    else if (entity === 'section') setSections(prev => prev.filter(s => s.id !== id));
    else setSubjects(prev => prev.filter(s => s.id !== id));
    setConfirmDelete(null);
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'class':
        return (
          <table className="w-full text-sm text-left data-table">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Class Name</th>
                <th className="px-6 py-4 font-semibold">Total Sections</th>
                <th className="px-6 py-4 font-semibold">Enrolled / Capacity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredClasses.map(cls => (
                <tr key={cls.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{cls.name}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{sectionCountByClass[cls.id] || 0}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{cls.students}{cls.capacity > 0 ? ` / ${cls.capacity}` : ''}</td>
                  <td className="px-6 py-4">
                    <span className="badge badge-green">{cls.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit('class', cls)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete('class', cls.id, cls.name)} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClasses.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No classes found.</td></tr>
              )}
            </tbody>
          </table>
        );
      case 'section':
        return (
          <table className="w-full text-sm text-left data-table">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Section Name</th>
                <th className="px-6 py-4 font-semibold">Class</th>
                <th className="px-6 py-4 font-semibold">Capacity</th>
                <th className="px-6 py-4 font-semibold">Students</th>
                <th className="px-6 py-4 font-semibold">Available</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredSections.map(s => (
                <tr key={s.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{s.name}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{classMap[s.classId] || `Class ${s.classId}`}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{s.capacity}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{s.students}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${s.capacity - s.students > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                      {s.capacity - s.students}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit('section', s)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete('section', s.id, s.name)} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSections.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No sections found.</td></tr>
              )}
            </tbody>
          </table>
        );
      case 'subject':
        return (
          <table className="w-full text-sm text-left data-table">
            <thead className="text-xs text-[var(--text-muted)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
              <tr>
                <th className="px-6 py-4 font-semibold rounded-tl-xl">Subject Code</th>
                <th className="px-6 py-4 font-semibold">Subject Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Assigned Classes</th>
                <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              {filteredSubjects.map(subject => (
                <tr key={subject.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--text-secondary)]">{subject.code}</td>
                  <td className="px-6 py-4 font-semibold text-[var(--text-primary)]">{subject.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      subject.type === 'Core' ? 'badge bg-[var(--bg-tertiary)] text-brand-primary border-[var(--border-light)]'
                      : subject.type === 'Elective' ? 'bg-[var(--color-info-bg)] text-[var(--color-info)] border-[var(--color-info)]/20'
                      : subject.type === 'Practical' ? 'badge-green'
                      : subject.type === 'Lab' ? 'badge-amber'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--border-light)]'
                    }`}>{subject.type}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">
                    {subject.classIds.map(id => classMap[id]).filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit('subject', subject)} className="p-2 text-[var(--text-muted)] hover:text-brand-primary hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete('subject', subject.id, subject.name)} className="p-2 text-[var(--text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-bg)] rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-[var(--text-muted)]">No subjects found.</td></tr>
              )}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Academic Structure</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage classes, sections, and subjects.</p>
        </div>
        <button onClick={() => openAdd(activeTab as any)} className="bg-brand-primary hover:bg-brand-mid text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md shadow-brand-primary/20 transition-all flex items-center gap-2">
          <Plus size={16} />
          Add New {activeTab === 'class' ? 'Class' : activeTab === 'section' ? 'Section' : 'Subject'}
        </button>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl border-[var(--border-light)] shadow-sm overflow-hidden book-page">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-light)] bg-[var(--bg-tertiary)]/50 overflow-x-auto custom-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch(''); }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-primary' : 'text-[var(--text-muted)]'} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="academicTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-[var(--border-light)]">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)]"><Search size={16} /></div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border-[var(--border-light)] rounded-xl text-sm bg-[var(--bg-tertiary)] placeholder-[var(--text-muted)] focus:outline-none focus:bg-[var(--bg-secondary)] focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="overflow-x-auto">{renderTable()}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border-[var(--border-light)] w-full max-w-md z-10">
              <div className="px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">
                  {modal.mode === 'add' ? 'Add' : 'Edit'} {modal.entity === 'class' ? 'Class' : modal.entity === 'section' ? 'Section' : 'Subject'}
                </h3>
                <button onClick={closeModal} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                {modal.entity === 'class' && (
                  <>
                    <Field label="Class Name" value={modal.data.name} onChange={v => setModal(m => ({ ...m, data: { ...m.data, name: v } }))} />
                    <Field label="Class Code (optional)" value={modal.data.code} onChange={v => setModal(m => ({ ...m, data: { ...m.data, code: v } }))} />
                    <Field label="Academic Level/Grade" value={modal.data.grade} onChange={v => setModal(m => ({ ...m, data: { ...m.data, grade: v } }))} />
                    <Field label="Total Student Capacity" type="number" value={String(modal.data.capacity)} onChange={v => setModal(m => ({ ...m, data: { ...m.data, capacity: Number(v) } }))} />
                    <Field label="Description (optional)" value={modal.data.description} onChange={v => setModal(m => ({ ...m, data: { ...m.data, description: v } }))} />
                    <Select label="Status" value={modal.data.status} onChange={v => setModal(m => ({ ...m, data: { ...m.data, status: v } }))} options={['Active', 'Inactive']} />
                  </>
                )}
                {modal.entity === 'section' && (
                  <>
                    <Field label="Section Name" value={modal.data.name} onChange={v => setModal(m => ({ ...m, data: { ...m.data, name: v } }))} />
                    <Select label="Associated Class" value={String(modal.data.classId)} onChange={v => setModal(m => ({ ...m, data: { ...m.data, classId: Number(v) } }))} options={classes.map(c => ({ value: String(c.id), label: c.name }))} />
                    <Field label="Section Capacity" type="number" value={String(modal.data.capacity)} onChange={v => setModal(m => ({ ...m, data: { ...m.data, capacity: Number(v) } }))} />
                    <Field label="Class Teacher (if applicable)" value={modal.data.teacher} onChange={v => setModal(m => ({ ...m, data: { ...m.data, teacher: v } }))} />
                    <Field label="Description (optional)" value={modal.data.description} onChange={v => setModal(m => ({ ...m, data: { ...m.data, description: v } }))} />
                  </>
                )}
                {modal.entity === 'subject' && (
                  <>
                    <Field label="Subject Name" value={modal.data.name} onChange={v => setModal(m => ({ ...m, data: { ...m.data, name: v } }))} />
                    <Field label="Subject Code (optional)" value={modal.data.code} onChange={v => setModal(m => ({ ...m, data: { ...m.data, code: v } }))} />
                    <Select label="Subject Type" value={modal.data.type} onChange={v => setModal(m => ({ ...m, data: { ...m.data, type: v } }))} options={['Core', 'Elective', 'Optional', 'Practical', 'Lab']} />
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-[var(--text-primary)]">Applicable Classes <span className="text-[var(--color-error)]">*</span></label>
                      <div className="max-h-44 overflow-y-auto border-[var(--border-light)] rounded-xl p-2 space-y-0.5">
                        {classes.map(c => {
                          const checked = (modal.data.classIds || []).includes(c.id);
                          return (
                            <label key={c.id} className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${checked ? 'bg-[var(--bg-tertiary)] text-brand-primary' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                              <input type="checkbox" checked={checked} onChange={() => {
                                const ids: number[] = modal.data.classIds || [];
                                setModal(m => ({ ...m, data: { ...m.data, classIds: checked ? ids.filter(id => id !== c.id) : [...ids, c.id] } }));
                              }} className="w-4 h-4 rounded border-[var(--border-color)] text-brand-primary focus:ring-brand-primary" />
                              {c.name}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <Field label="Description (optional)" value={modal.data.description} onChange={v => setModal(m => ({ ...m, data: { ...m.data, description: v } }))} />
                  </>
                )}
                <div className="flex gap-3 pt-4 border-t border-[var(--border-light)] mt-6">
                  <button onClick={closeModal} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${saving ? 'bg-brand-mid cursor-wait' : 'bg-brand-primary hover:bg-brand-mid shadow-sm shadow-brand-primary/20'}`}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : modal.mode === 'add' ? 'Add' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[var(--bg-secondary)] rounded-2xl shadow-xl border-[var(--border-light)] w-full max-w-sm z-10 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-error-bg)] flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-[var(--color-error)]" /></div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Delete {confirmDelete.entity}?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                Are you sure you want to delete <span className="font-semibold text-[var(--text-primary)]">{confirmDelete.label}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl text-sm font-medium transition-colors">Cancel</button>
                <button onClick={confirmDeleteAction} className="flex-1 px-4 py-2 bg-[var(--color-error)] hover:bg-[var(--color-error)] text-white rounded-xl text-sm font-medium transition-colors shadow-sm">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] | string[] }) {
  const opts = Array.isArray(options) ? (typeof options[0] === 'string' ? (options as string[]).map(o => ({ value: o, label: o })) : options as { value: string; label: string }[]) : [];
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2 border-[var(--border-light)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-[var(--bg-secondary)]">{opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
    </div>
  );
}
