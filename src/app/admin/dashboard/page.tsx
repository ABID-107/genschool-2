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
  Calendar as CalendarIcon,
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
    color: 'blue'
  },
  {
    name: 'Total Teachers',
    value: '142',
    change: '+3.2%',
    trend: 'up',
    icon: GraduationCap,
    color: 'indigo'
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

  // Report Generator State
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  
  // Schedule State
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>(initialSchedule);
  const [activeTab, setActiveTab] = useState<'all' | ScheduleType>('all');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleItem>>({ 
    title: '', time: '', endTime: '', location: '', type: 'meeting', status: 'upcoming', participants: [] 
  });

  // Resolved color classes (Tailwind JIT needs complete class names)
  const iconColorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    rose: 'bg-rose-50 text-rose-500',
  };
  const decoColorMap: Record<string, string> = {
    blue: 'bg-blue-50',
    indigo: 'bg-indigo-50',
    emerald: 'bg-emerald-50',
    rose: 'bg-rose-50',
  };

  const handleGenerateReport = (reportId: string) => {
    setIsReportMenuOpen(false);
    setIsGenerating(true);
    setGenerationSuccess(false);

    const reportName = reportTypes.find(r => r.id === reportId)?.name || 'Custom Report';
    const newStoreReportId = addReport({ name: reportName, type: reportId as ReportType, status: 'generating' });

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationSuccess(true);
      updateReportStatus(newStoreReportId, 'completed', { size: '1.2 MB' });
      
      // Reset success message after 4 seconds
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
      endTime: newEvent.endTime || '1:00 PM', // Fallback
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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, here is what is happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 items-center gap-2 shadow-sm">
            <CalendarIcon size={16} className="text-slate-400" />
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          
          {/* Report Generator Component */}
          <div className="relative">
            {generationSuccess ? (
              <Link href="/admin/reports">
                <motion.button 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  View Report
                </motion.button>
              </Link>
            ) : (
              <button 
                onClick={() => !isGenerating && setIsReportMenuOpen(!isReportMenuOpen)}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all ${
                  isGenerating 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 cursor-wait'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
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
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                >
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Select Report</p>
                  </div>
                  <div className="p-1">
                    {reportTypes.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => handleGenerateReport(report.id)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3 transition-colors group"
                      >
                        <div className="p-1.5 rounded-md bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <report.icon size={14} />
                        </div>
                        {report.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Overlay to close dropdown when clicking outside */}
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
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorMap[stat.color]} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">{stat.name}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1 tracking-tight">{stat.value}</p>
            </div>
            {/* Background decoration */}
            <div className={`absolute -right-6 -bottom-6 w-24 h-24 ${decoColorMap[stat.color]} rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-2xl`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Revenue Analytics</h3>
              <p className="text-sm text-slate-500">Fee collection trends over the last 6 months</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `৳${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [typeof value === 'number' ? `৳${value.toLocaleString()}` : String(value), 'Revenue']}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attendance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Student Attendance</h3>
              <p className="text-sm text-slate-500">Weekly average</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
          className="bg-white rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recent Payments</h3>
              <p className="text-sm text-slate-500">Latest fee collections across all branches</p>
            </div>
            <Link href="/admin/finance" className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{payment.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{payment.student}</div>
                      <div className="text-xs text-slate-500">{payment.class}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">৳ {payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{payment.date}</td>
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
          className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col"
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Today's Schedule</h3>
              <p className="text-sm text-slate-500">Upcoming events & classes</p>
            </div>
            <button 
              onClick={() => setIsAddEventModalOpen(true)}
              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" 
              title="Add Event"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex gap-2">
              {(['all', 'meeting', 'class', 'event'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-200 bg-slate-100'
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
                    className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Status Indicator */}
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <div className={`text-xs font-bold ${
                        item.status === 'ongoing' ? 'text-blue-600' :
                        item.status === 'completed' ? 'text-slate-400 line-through' :
                        'text-slate-700'
                      }`}>
                        {item.time.split(' ')[0]}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.time.split(' ')[1]}</div>
                    </div>

                    <div className="relative flex-1">
                      {/* Ongoing pulsing dot */}
                      {item.status === 'ongoing' && (
                        <div className="absolute -left-3 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-500">
                          <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-semibold text-sm ${item.status === 'completed' ? 'text-slate-500' : 'text-slate-800'} group-hover:text-blue-600 transition-colors`}>
                          {item.title}
                        </h4>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${
                          item.type === 'meeting' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                          item.type === 'class' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={12} className={item.status === 'completed' ? 'text-slate-400' : 'text-slate-400'} />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" />
                          {item.endTime}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {item.participants.map((p, i) => (
                            <div key={i} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm ${
                              ['bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-indigo-500', 'bg-amber-500'][i % 5]
                            }`}>
                              {p.substring(0, 2).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {item.participants.length > 0 && (
                          <span className="text-[10px] text-slate-400 font-medium ml-1">
                            {item.participants.length} {item.type === 'class' ? 'Class' : 'People'}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredSchedule.length === 0 && (
                <div className="text-center py-8 text-sm text-slate-500">
                  No {activeTab !== 'all' ? activeTab + 's' : 'events'} scheduled for today.
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-slate-100">
            <Link href="/admin/timetable" className="block w-full py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 text-center">
              View Full Calendar
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsAddEventModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden z-10 flex flex-col"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">Add New Event</h3>
                <button 
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. Staff Meeting"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                    <input 
                      type="text" 
                      required
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="e.g. 09:00 AM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                    <input 
                      type="text" 
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="e.g. 10:00 AM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input 
                      type="text" 
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="e.g. Room 302"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select 
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value as ScheduleType})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="class">Class</option>
                      <option value="event">Event</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Participants (comma separated initials)</label>
                  <input 
                    type="text" 
                    value={newEvent.participants?.join(', ')}
                    onChange={(e) => setNewEvent({...newEvent, participants: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    placeholder="e.g. AS, MR"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddEventModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-500/20"
                  >
                    Save Event
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
