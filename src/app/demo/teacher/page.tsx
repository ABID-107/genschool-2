'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, School, Users, BookOpen, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function DemoTeacherPage() {
  return (
    <div className="min-h-screen bg-navy-50">
      <header className="bg-white border-b border-navy-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/demo" className="p-2 rounded-lg hover:bg-navy-100 transition-colors">
            <ArrowLeft size={20} className="text-navy-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-navy-900">Teacher Dashboard</h1>
            <p className="text-xs text-navy-500">Demo Mode</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs font-semibold">
          Demo Preview
        </span>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Classes', value: '6', icon: School, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Students', value: '184', icon: Users, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
            { label: 'Assignments', value: '12', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Avg Performance', value: '87%', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-sm text-navy-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-base font-semibold text-navy-900 mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {[
                { time: '08:00 AM', subject: 'Mathematics', class: 'Grade 10A' },
                { time: '09:00 AM', subject: 'Physics', class: 'Grade 11B' },
                { time: '10:00 AM', subject: 'Chemistry', class: 'Grade 12A' },
                { time: '11:30 AM', subject: 'Mathematics', class: 'Grade 9C' },
              ].map((slot) => (
                <div key={slot.time} className="flex items-center gap-4 p-3 rounded-lg bg-navy-50">
                  <Clock size={16} className="text-navy-400 shrink-0" />
                  <span className="text-sm font-medium text-navy-700 w-20">{slot.time}</span>
                  <span className="text-sm font-semibold text-navy-900">{slot.subject}</span>
                  <span className="text-xs text-navy-500 ml-auto">{slot.class}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-semibold text-navy-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                'Submitted grades for Grade 10A Midterms',
                'New assignment created: Algebra Basics',
                'Attendance marked for Grade 11B',
                'Posted learning materials for Chemistry',
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-navy-50">
                  <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 shrink-0" />
                  <p className="text-sm text-navy-700">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
