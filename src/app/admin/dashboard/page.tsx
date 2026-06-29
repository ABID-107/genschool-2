'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReportStore, ReportType } from '@/store/useReportStore';
import Link from 'next/link';
import { 
  Users, 
  Wallet, 
  GraduationCap, 
  UserX,
  MoreVertical,
  CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const stats = [
  {
    name: 'Total Students',
    value: '2,450',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'navy'
  },
  {
    name: 'Total Teachers',
    value: '142',
    change: '+3.2%',
    trend: 'up',
    icon: GraduationCap,
    color: 'navy'
  },
  {
    name: 'Revenue (MTD)',
    value: '৳ 2.4M',
    change: '+8.1%',
    trend: 'up',
    icon: Wallet,
    color: 'emerald'
  },
  {
    name: 'Absent Today',
    value: '84',
    change: '-2.4%',
    trend: 'down',
    icon: UserX,
    color: 'rose'
  }
];

const revenueData = [
  { name: 'Jan', total: 1500000 },
  { name: 'Feb', total: 1800000 },
  { name: 'Mar', total: 2200000 },
  { name: 'Apr', total: 1900000 },
  { name: 'May', total: 2400000 },
  { name: 'Jun', total: 2800000 },
];

const attendanceData = [
  { name: 'Mon', present: 95, absent: 5 },
  { name: 'Tue', present: 92, absent: 8 },
  { name: 'Wed', present: 96, absent: 4 },
  { name: 'Thu', present: 94, absent: 6 },
  { name: 'Fri', present: 90, absent: 10 },
];

type ScheduleType = 'meeting' | 'event' | 'class';
type ScheduleStatus = 'completed' | 'ongoing' | 'upcoming';

interface ScheduleItem {
  id: number;
  title: string;
  time: string;
  endTime: string;
  type: ScheduleType;
  status: ScheduleStatus;
  location: string;
  participants: string[];
}

const initialSchedule: ScheduleItem[] = [
  { id: 1, title: 'Staff Briefing', time: '08:30 AM', endTime: '09:00 AM', type: 'meeting', status: 'completed', location: 'Staff Room', participants: ['AS', 'MR', 'TK'] },
  { id: 2, title: 'Physics Grade 10', time: '09:15 AM', endTime: '10:00 AM', type: 'class', status: 'ongoing', location: 'Room 302', participants: ['10A'] },
  { id: 3, title: 'Parent Teacher Conference', time: '11:30 AM', endTime: '01:00 PM', type: 'meeting', status: 'upcoming', location: 'Main Hall', participants: ['Parents'] },
  { id: 4, title: 'Annual Sports Day Prep', time: '04:00 PM', endTime: '05:30 PM', type: 'event', status: 'upcoming', location: 'Sports Ground', participants: ['Com'] },
];

const reportTypes = [
  { id: 'daily', name: 'Daily Summary', icon: FileText },
  { id: 'financial', name: 'Financial Report', icon: FileSpreadsheet },
  { id: 'attendance', name: 'Attendance Export', icon: Download },
];

const recentPayments = [
  { id: 'TRX-1092', student: 'Aarav Rahman', class: 'Class 10', amount: 4500, status: 'Completed', date: 'Today, 10:24 AM' },
  { id: 'TRX-1093', student: 'Zara Khan', class: 'Class 8', amount: 3200, status: 'Completed', date: 'Today, 09:15 AM' },
  { id: 'TRX-1094', student: 'Omar Farooq', class: 'Class 12', amount: 5500, status: 'Pending', date: 'Yesterday' },
];

export default function AdminDashboard() {
  const addReport = useReportStore((state) => state.addReport);
  const updateReportStatus = useReportStore((state) => state.updateReportStatus);

  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>(initialSchedule);
  const [activeTab, setActiveTab] = useState<'all' | ScheduleType>('all');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleItem>>({ 
    title: '', time: '', endTime: '', location: '', type: 'meeting', status: 'upcoming', participants: [] 
  });

  const iconColors: Record<string, string> = {
    navy: 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10',
    emerald: 'text-emerald-600 bg-emerald-100',
    rose: 'text-rose-600 bg-rose-100',
  };

  const handleGenerateReport = (reportId: string) => {
    setIsReportMenuOpen(false);
    setIsGenerating(true);
    setGenerationSuccess(false);

    const reportName = reportTypes.find(r => r.id === reportId)?.name || 'Custom Report';
    const newStoreReportId = addReport({ name: reportName, type: reportId as ReportType, status: 'generating' });

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);
      updateReportStatus(newStoreReportId, 'completed', { size: '1.2 MB' });
      setTimeout(() => {
        setGenerationSuccess(false);
      }, 4000);
    }, 2000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.time) return;
    
    const eventToAdd: ScheduleItem = {
      id: Date.now(),
      title: newEvent.title!,
      time: newEvent.time!,
      endTime: newEvent.endTime || '1:00 PM',
      type: newEvent.type as ScheduleType,
      status: 'upcoming',
      location: newEvent.location || 'TBA',
      participants: newEvent.participants || []
    };

    setScheduleData(prev => [...prev, eventToAdd]);
    setIsAddEventModalOpen(false);
    setNewEvent({ title: '', time: '', endTime: '', location: '', type: 'meeting', status: 'upcoming', participants: [] });
  };

  const filteredSchedule = scheduleData.filter(item => activeTab === 'all' || item.type === activeTab);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Overview</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Welcome back, here is what is happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-sm">
            <CalendarIcon size={16} className="text-[var(--text-muted)]" />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          <div className="relative">
            {generationSuccess ? (
              <Link href="/admin/reports">
                <motion.button 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="btn btn-sm badge-green"
                >
                  <CheckCircle2 size={16} />
                  View Report
                </motion.button>
              </Link>
            ) : (
              <button 
                onClick={() => !isGenerating && setIsReportMenuOpen(!isReportMenuOpen)}
                disabled={isGenerating}
                className={`btn btn-sm ${
                  isGenerating 
                    ? 'btn-ghost cursor-wait'
                    : 'btn-primary'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Generate Report
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isReportMenuOpen ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            )}

            <AnimatePresence>
              {isReportMenuOpen && !isGenerating && !generationSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-[var(--bg-secondary)] rounded-xl shadow-lg border border-[var(--border-color)] overflow-hidden z-50"
                >
                  <div className="p-2 border-b border-[var(--border-color)]">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2">Select Report</p>
                  </div>
                  <div className="p-1">
                    {reportTypes.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => handleGenerateReport(report.id)}
                        className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-3 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors">
                          <report.icon size={14} />
                        </div>
                        {report.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {isReportMenuOpen && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsReportMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColors[stat.color]} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
                stat.trend === 'up' ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-[var(--text-muted)] text-sm font-medium">{stat.name}</h3>
              <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Revenue Analytics</h3>
              <p className="text-sm text-[var(--text-muted)]">Fee collection trends over the last 6 months</p>
            </div>
            <button className="btn btn-ghost btn-icon" aria-label="More options">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickFormatter={(value) => `৳${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value) => [typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="var(--brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attendance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Student Attendance</h3>
              <p className="text-sm text-[var(--text-muted)]">Weekly average</p>
            </div>
            <button className="btn btn-ghost btn-icon" aria-label="More options">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-tertiary)' }}
                  contentStyle={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                  formatter={(value) => [`${value}%`, undefined]}
                />
                <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="absent" name="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Payments */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card lg:col-span-2 overflow-hidden"
        >
          <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Recent Payments</h3>
              <p className="text-sm text-[var(--text-muted)]">Latest fee collections across all branches</p>
            </div>
            <Link href="/admin/finance" className="text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-mid)] no-underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="font-medium">{payment.id}</td>
                    <td>
                      <div className="font-medium text-[var(--text-primary)]">{payment.student}</div>
                      <div className="text-xs text-[var(--text-muted)]">{payment.class}</div>
                    </td>
                    <td className="font-semibold">৳ {payment.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        payment.status === 'Completed' ? 'badge-green' : 'badge-amber'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="text-[var(--text-muted)]">{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card flex flex-col"
        >
          <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Today's Schedule</h3>
              <p className="text-sm text-[var(--text-muted)]">Upcoming events & classes</p>
            </div>
            <button 
              onClick={() => setIsAddEventModalOpen(true)}
              className="btn btn-ghost btn-icon bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80" 
              title="Add Event"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="px-6 py-3 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
            <div className="flex gap-2">
              {(['all', 'meeting', 'class', 'event'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize ${
                    activeTab === tab 
                      ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredSchedule.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={item.id} 
                    className="flex gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--brand-primary)]/30 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <div className={`text-xs font-bold ${
                        item.status === 'ongoing' ? 'text-[var(--brand-primary)]' :
                        item.status === 'completed' ? 'text-[var(--text-muted)] line-through' :
                        'text-[var(--text-primary)]'
                      }`}>
                        {item.time.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">{item.time.split(' ')[1]}</div>
                    </div>

                    <div className="relative flex-1">
                      {item.status === 'ongoing' && (
                        <div className="absolute -left-3 top-1.5 w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]">
                          <div className="absolute inset-0 rounded-full bg-[var(--brand-primary)] animate-ping opacity-75"></div>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-semibold text-sm ${item.status === 'completed' ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'} group-hover:text-[var(--brand-primary)] transition-colors`}>
                          {item.title}
                        </h4>
                        <span className={`badge ${
                          item.type === 'meeting' ? 'badge-navy' : 
                          item.type === 'class' ? 'badge-green' : 
                          'badge-amber'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs font-medium text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {item.endTime}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {item.participants.map((p, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[9px] font-bold text-white shadow-sm ${
                              ['bg-[var(--brand-primary)]', 'bg-emerald-500', 'bg-rose-500', 'bg-[var(--brand-mid)]', 'bg-amber-500'][i % 5]
                            }`}>
                              {p.substring(0, 2).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {item.participants.length > 0 && (
                          <span className="text-[10px] text-[var(--text-muted)] font-medium ml-1">
                            {item.participants.length} {item.type === 'class' ? 'Class' : 'People'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredSchedule.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-title">No events</div>
                  <div className="empty-state-desc">No {activeTab !== 'all' ? activeTab + 's' : 'events'} scheduled for today.</div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-[var(--border-color)]">
            <Link href="/admin/timetable" className="btn btn-ghost w-full justify-center">
              View Full Calendar
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddEventModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal-content max-w-md"
            >
              <div className="modal-header">
                <h3 className="font-bold text-[var(--text-primary)] text-lg">Add New Event</h3>
                <button 
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="btn btn-ghost btn-icon"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="modal-body space-y-4">
                <div>
                  <label className="label" htmlFor="event-title">Event Title</label>
                  <input 
                    id="event-title"
                    type="text" 
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="input"
                    placeholder="e.g. Staff Meeting"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="event-start">Start Time</label>
                    <input 
                      id="event-start"
                      type="text" 
                      required
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="input"
                      placeholder="e.g. 09:00 AM"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="event-end">End Time</label>
                    <input 
                      id="event-end"
                      type="text" 
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                      className="input"
                      placeholder="e.g. 10:00 AM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="event-location">Location</label>
                    <input 
                      id="event-location"
                      type="text" 
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="input"
                      placeholder="e.g. Room 302"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="event-type">Type</label>
                    <select 
                      id="event-type"
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value as ScheduleType})}
                      className="select"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="class">Class</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="event-participants">Participants</label>
                  <input 
                    id="event-participants"
                    type="text" 
                    value={newEvent.participants?.join(', ')}
                    onChange={(e) => setNewEvent({...newEvent, participants: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="input"
                    placeholder="e.g. AS, MR"
                  />
                </div>
              </form>
              <div className="modal-footer">
                <button 
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  onClick={handleAddEvent}
                  className="btn btn-primary flex-1"
                >
                  Save Event
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
