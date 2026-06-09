'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellRing, MessageSquare, Send, Plus, Search, CheckCircle2, Clock, X, Save, Loader2,
  Pencil, Trash2, Eye, Ban, Undo2, Copy, ArrowUpDown, Download, AlertTriangle,
  Calendar, Users, Tag, FileText, Archive,
} from 'lucide-react';
import {
  getNotices, createNotice, updateNotice, deleteNotice,
  publishNotice, scheduleNotice, archiveNotice, restoreNotice, duplicateNotice,
  searchNotices, validateNotice, exportNoticesToCSV,
  NOTICE_CATEGORIES, NOTICE_PRIORITIES, AUDIENCE_OPTIONS, NOTICE_STATUSES,
  type Notice, type NoticeStatus, type NoticeCategory, type NoticePriority,
  type AudienceType, type AudienceTarget, type NoticeFilters,
} from '@/lib/noticeStore';

function loadClasses(): { id: number; name: string }[] {
  try { const s = localStorage.getItem('academic_classes'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

function loadSections(): { id: string; name: string }[] {
  try { const s = localStorage.getItem('academic_sections'); if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; } } catch {}
  return [];
}

const TABS = [
  { id: 'notices', label: 'Notice Board', icon: BellRing },
  { id: 'sms', label: 'SMS Broadcasts', icon: MessageSquare },
];

export default function NoticeBoardPage() {
  const [activeTab, setActiveTab] = useState('notices');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);

  // Search & filters
  const [filters, setFilters] = useState<NoticeFilters>({});
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => { setNotices(getNotices()); }, []);
  useEffect(() => { setClasses(loadClasses()); }, []);
  useEffect(() => { setSections(loadSections()); }, []);

  const refreshNotices = useCallback(() => setNotices(getNotices()), []);

  // ── Filtered Data ──
  const filteredNotices = useMemo(() => searchNotices(filters), [filters, notices]);

  // ── KPI Data ──
  const kpi = useMemo(() => ({
    published: notices.filter(n => n.status === 'published').length,
    scheduled: notices.filter(n => n.status === 'scheduled').length,
    draft: notices.filter(n => n.status === 'draft').length,
    archived: notices.filter(n => n.status === 'archived').length,
  }), [notices]);

  // ── Notice Modal ──
  const [noticeModal, setNoticeModal] = useState<{
    open: boolean; mode: 'create' | 'edit' | 'view'; data: Partial<Notice>;
  }>({ open: false, mode: 'create', data: {} });
  const [noticeSaving, setNoticeSaving] = useState(false);

  const openNoticeModal = (mode: 'create' | 'edit' | 'view', data?: Notice) => {
    if (mode === 'create') {
      setNoticeModal({
        open: true, mode, data: {
          title: '', description: '', category: 'general', priority: 'medium',
          audience: [{ type: 'all' }], publishDate: new Date().toISOString().split('T')[0],
          expiryDate: '', author: '', status: 'draft', attachments: [],
        },
      });
    } else if (data) {
      setNoticeModal({ open: true, mode, data: { ...data } });
    }
  };
  const closeNoticeModal = () => setNoticeModal(p => ({ ...p, open: false }));

  const handleSaveNotice = () => {
    const d = noticeModal.data;
    const errors = validateNotice(d);
    if (errors.length) return alert(errors.join('\n'));
    setNoticeSaving(true);
    setTimeout(() => {
      const d2 = noticeModal.data;
      if (noticeModal.mode === 'create') {
        const created = createNotice({
          title: d2.title!, description: d2.description!, category: d2.category!,
          priority: d2.priority!, audience: d2.audience!,
          publishDate: d2.publishDate!, expiryDate: d2.expiryDate || '',
          author: d2.author!, status: d2.status || 'draft', attachments: d2.attachments || [],
        });
        setNotices(prev => [...prev, created]);
      } else if (d2.id) {
        const updated = updateNotice(d2.id, d2);
        if (updated) setNotices(prev => prev.map(n => n.id === d2.id ? updated : n));
      }
      setNoticeSaving(false);
      closeNoticeModal();
    }, 300);
  };

  const handleAction = (action: string, id: string) => {
    switch (action) {
      case 'publish':
        publishNotice(id);
        refreshNotices();
        break;
      case 'archive':
        archiveNotice(id);
        refreshNotices();
        break;
      case 'restore':
        restoreNotice(id);
        refreshNotices();
        break;
      case 'duplicate':
        const dup = duplicateNotice(id);
        if (dup) setNotices(prev => [...prev, dup]);
        break;
      case 'delete':
        if (confirm('Delete this notice? This cannot be undone.')) {
          deleteNotice(id);
          refreshNotices();
        }
        break;
    }
  };

  // ── Audience Helpers ──
  const toggleAudience = (type: AudienceType | 'class' | 'section') => {
    setNoticeModal(prev => {
      const current = prev.data.audience || [];
      const exists = current.some(a => a.type === type);
      return {
        ...prev, data: {
          ...prev.data,
          audience: exists ? current.filter(a => !(a.type === type)) : [...current, { type }],
        },
      };
    });
  };

  const setAudienceClass = (classId: number, className: string) => {
    setNoticeModal(prev => {
      const current = prev.data.audience || [];
      const exists = current.some(a => a.type === 'class' && a.id === classId);
      return {
        ...prev, data: {
          ...prev.data,
          audience: exists
            ? current.filter(a => !(a.type === 'class' && a.id === classId))
            : [...current.filter(a => a.type !== 'all'), { type: 'class', id: classId, label: className }],
        },
      };
    });
  };

  // ── Attachment helpers ──
  const addAttachment = () => {
    const name = prompt('Enter file name (e.g. notice.pdf):');
    if (!name) return;
    setNoticeModal(prev => ({
      ...prev, data: {
        ...prev.data,
        attachments: [...(prev.data.attachments || []), {
          id: `att-${Date.now()}`, name, type: name.split('.').pop() || 'unknown',
          size: 0, data: '',
        }],
      },
    }));
  };

  const removeAttachment = (attId: string) => {
    setNoticeModal(prev => ({
      ...prev, data: {
        ...prev.data,
        attachments: (prev.data.attachments || []).filter(a => a.id !== attId),
      },
    }));
  };

  // ── Filters ──
  const applyFilters = useCallback((updates: Partial<NoticeFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  // ── Status Badge ──
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; border: string; icon: any }> = {
      published: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
      scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Clock },
      draft: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: FileText },
      archived: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Archive },
    };
    const s = map[status] || map.draft;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
        <s.icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const priorityBadge = (priority: string) => {
    const p = NOTICE_PRIORITIES.find(p => p.value === priority);
    if (!p) return null;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${p.color}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const audienceLabel = (targets: AudienceTarget[]) => {
    if (targets.some(a => a.type === 'all')) return 'All Users';
    return targets.map(a => a.label || a.type.charAt(0).toUpperCase() + a.type.slice(1)).join(', ');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notice Board & Communication</h1>
          <p className="text-sm text-slate-500 mt-1">Manage notices, target audiences, and broadcast communications.</p>
        </div>
        {activeTab === 'notices' && (
          <div className="flex items-center gap-3">
            <button onClick={() => exportNoticesToCSV(notices)} className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Download size={16} /> Export
            </button>
            <button onClick={() => openNoticeModal('create')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md transition-all flex items-center gap-2">
              <Plus size={16} /> Create Notice
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Published</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{kpi.published}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Scheduled</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{kpi.scheduled}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Drafts</p>
            <p className="text-2xl font-bold text-slate-600 mt-1">{kpi.draft}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Archived</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{kpi.archived}</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="noticeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        <div className="p-0">
          <AnimatePresence mode="wait">
            {/* ── Notice Board Tab ── */}
            {activeTab === 'notices' && (
              <motion.div key="notices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Filters */}
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                  <div className="relative flex-1 w-full md:max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Search size={18} /></div>
                    <input type="text" placeholder="Search notices..." value={searchInput}
                      onChange={e => { setSearchInput(e.target.value); applyFilters({ search: e.target.value }); }}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select value={filters.category || ''} onChange={e => applyFilters({ category: e.target.value as any })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">All Categories</option>
                      {NOTICE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <select value={filters.priority || ''} onChange={e => applyFilters({ priority: e.target.value as any })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">All Priorities</option>
                      {NOTICE_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                    <select value={filters.status || ''} onChange={e => applyFilters({ status: e.target.value as any })}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="">All Statuses</option>
                      {NOTICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Title</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Priority</th>
                        <th className="px-6 py-4 font-semibold">Audience</th>
                        <th className="px-6 py-4 font-semibold">Author</th>
                        <th className="px-6 py-4 font-semibold">Publish Date</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredNotices.map(notice => (
                        <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{notice.title}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{notice.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              {NOTICE_CATEGORIES.find(c => c.value === notice.category)?.label || notice.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">{priorityBadge(notice.priority)}</td>
                          <td className="px-6 py-4 text-slate-600 max-w-[120px] truncate" title={audienceLabel(notice.audience)}>
                            {audienceLabel(notice.audience)}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{notice.author}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(notice.publishDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{statusBadge(notice.status)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              <button onClick={() => openNoticeModal('view', notice)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye size={15} /></button>
                              <button onClick={() => openNoticeModal('edit', notice)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><Pencil size={15} /></button>
                              <button onClick={() => handleAction('duplicate', notice.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Duplicate"><Copy size={15} /></button>
                              {notice.status === 'draft' && (
                                <button onClick={() => handleAction('publish', notice.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Publish"><CheckCircle2 size={15} /></button>
                              )}
                              {notice.status === 'published' && (
                                <button onClick={() => handleAction('archive', notice.id)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Archive"><Archive size={15} /></button>
                              )}
                              {notice.status === 'archived' && (
                                <button onClick={() => handleAction('restore', notice.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Restore"><Undo2 size={15} /></button>
                              )}
                              <button onClick={() => handleAction('delete', notice.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredNotices.length === 0 && (
                        <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">No notices found. Create a new notice to get started.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── SMS Tab ── */}
            {activeTab === 'sms' && (
              <motion.div key="sms" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 md:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-4 items-start text-blue-800">
                    <MessageSquare className="flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm">
                      <p className="font-semibold">SMS Gateway Active</p>
                      <p className="mt-1 opacity-90">You have 1,450 SMS credits remaining. Supports Bangla Unicode and English characters.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Select Audience <span className="text-rose-500">*</span></label>
                      <select className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 bg-white">
                        <option>All Guardians (Defaulters)</option>
                        <option>All Guardians (Class 10)</option>
                        <option>All Teachers</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 flex justify-between">
                        <span>Message Content <span className="text-rose-500">*</span></span>
                        <span className="text-slate-400 text-xs">0 / 160 characters (1 SMS)</span>
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 min-h-[120px]"
                        placeholder="Type your message here...">
                      </textarea>
                    </div>
                    <button className="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2">
                      <Send size={18} />
                      Send SMS Broadcast
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Create/Edit/View Notice Modal ── */}
      <AnimatePresence>
        {noticeModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeNoticeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl z-10 max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
                <h3 className="font-bold text-slate-800 text-lg">
                  {noticeModal.mode === 'create' ? 'Create Notice' : noticeModal.mode === 'edit' ? 'Edit Notice' : 'View Notice'}
                </h3>
                <button onClick={closeNoticeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-5">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Title <span className="text-rose-500">*</span></label>
                  <input type="text" value={noticeModal.data.title || ''} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, title: e.target.value } }))}
                    readOnly={noticeModal.mode === 'view'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white read-only:bg-slate-50 read-only:text-slate-600" />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Description <span className="text-rose-500">*</span></label>
                  <textarea value={noticeModal.data.description || ''} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, description: e.target.value } }))}
                    readOnly={noticeModal.mode === 'view'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px] bg-white read-only:bg-slate-50 read-only:text-slate-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Category <span className="text-rose-500">*</span></label>
                    <select value={noticeModal.data.category || 'general'} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, category: e.target.value as NoticeCategory } }))}
                      disabled={noticeModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white disabled:bg-slate-50">
                      {NOTICE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Priority <span className="text-rose-500">*</span></label>
                    <select value={noticeModal.data.priority || 'medium'} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, priority: e.target.value as NoticePriority } }))}
                      disabled={noticeModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white disabled:bg-slate-50">
                      {NOTICE_PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Publish Date */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Publish Date <span className="text-rose-500">*</span></label>
                    <input type="date" value={noticeModal.data.publishDate || ''} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, publishDate: e.target.value } }))}
                      readOnly={noticeModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white read-only:bg-slate-50" />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Expiry Date</label>
                    <input type="date" value={noticeModal.data.expiryDate || ''} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, expiryDate: e.target.value } }))}
                      readOnly={noticeModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white read-only:bg-slate-50" />
                    <p className="text-xs text-slate-400 mt-0.5">Leave empty for no expiration.</p>
                  </div>
                </div>

                {/* Author + Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Author <span className="text-rose-500">*</span></label>
                    <input type="text" value={noticeModal.data.author || ''} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, author: e.target.value } }))}
                      readOnly={noticeModal.mode === 'view'}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white read-only:bg-slate-50" />
                  </div>
                  {noticeModal.mode !== 'view' && (
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700">Status</label>
                      <select value={noticeModal.data.status || 'draft'} onChange={e => setNoticeModal(p => ({ ...p, data: { ...p.data, status: e.target.value as NoticeStatus } }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                        {NOTICE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {/* Target Audience */}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Target Audience <span className="text-rose-500">*</span></label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {AUDIENCE_OPTIONS.map(a => {
                        const checked = (noticeModal.data.audience || []).some(at => at.type === a.value);
                        return (
                          <button key={a.value} type="button" disabled={noticeModal.mode === 'view'}
                            onClick={() => toggleAudience(a.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${checked ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'} disabled:opacity-60`}>
                            {a.label}
                          </button>
                        );
                      })}
                    </div>
                    {(noticeModal.data.audience || []).some(a => a.type === 'all') && (
                      <p className="text-xs text-slate-400">Selecting "All Users" overrides other selections.</p>
                    )}
                    {/* Class selection */}
                    {classes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-slate-500 mb-1.5">Specific Classes:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {classes.map(c => {
                            const checked = (noticeModal.data.audience || []).some(a => a.type === 'class' && a.id === c.id);
                            return (
                              <button key={c.id} type="button" disabled={noticeModal.mode === 'view'}
                                onClick={() => setAudienceClass(c.id, c.name)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${checked ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'} disabled:opacity-60`}>
                                {c.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Attachments */}
                {noticeModal.mode !== 'view' && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Attachments</label>
                    {(noticeModal.data.attachments || []).length > 0 && (
                      <div className="space-y-1.5 mb-2">
                        {(noticeModal.data.attachments || []).map(att => (
                          <div key={att.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl text-sm">
                            <FileText size={14} className="text-slate-400" />
                            <span className="flex-1 text-slate-700">{att.name}</span>
                            <span className="text-xs text-slate-400 uppercase">.{att.type}</span>
                            <button onClick={() => removeAttachment(att.id)} className="p-0.5 text-slate-400 hover:text-rose-600"><X size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={addAttachment} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Plus size={12} /> Add Attachment
                    </button>
                  </div>
                )}

                {/* View mode: show attachments read-only */}
                {noticeModal.mode === 'view' && (noticeModal.data.attachments || []).length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Attachments</label>
                    <div className="space-y-1.5">
                      {(noticeModal.data.attachments || []).map(att => (
                        <div key={att.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl text-sm">
                          <FileText size={14} className="text-slate-400" />
                          <span className="flex-1 text-slate-700">{att.name}</span>
                          <span className="text-xs text-slate-400 uppercase">.{att.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View mode: show audience summary */}
                {noticeModal.mode === 'view' && (
                  <div className="text-sm bg-slate-50 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between"><span className="text-slate-500">Status:</span><span>{statusBadge(noticeModal.data.status || 'draft')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Audience:</span><span className="font-medium text-slate-700">{audienceLabel(noticeModal.data.audience || [])}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">ID:</span><span className="font-mono text-xs text-slate-600">{noticeModal.data.id}</span></div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
                <button onClick={closeNoticeModal} className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                  {noticeModal.mode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {noticeModal.mode !== 'view' && (
                  <button onClick={handleSaveNotice} disabled={noticeSaving}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2 ${noticeSaving ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`}>
                    {noticeSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {noticeModal.mode === 'create' ? 'Create Notice' : 'Save Changes'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
