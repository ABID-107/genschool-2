'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, School, Users, BookOpen, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function DemoTeacherPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/demo" className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--text-secondary)]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)]">Teacher Dashboard</h1>
            <p className="text-xs text-[var(--text-muted)]">Demo Mode</p>
          </div>
        </div>
        <span className="badge badge-amber">
          Demo Preview
        </span>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'My Classes', value: '6', icon: School },
            { label: 'Total Students', value: '184', icon: Users },
            { label: 'Assignments', value: '12', icon: BookOpen },
            { label: 'Avg Performance', value: '87%', icon: BarChart3 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="stat-card flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--green-50)] flex items-center justify-center text-[var(--brand-primary)]">
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {[
                { time: '08:00 AM', subject: 'Mathematics', class: 'Grade 10A' },
                { time: '09:00 AM', subject: 'Physics', class: 'Grade 11B' },
                { time: '10:00 AM', subject: 'Chemistry', class: 'Grade 12A' },
                { time: '11:30 AM', subject: 'Mathematics', class: 'Grade 9C' },
              ].map((slot) => (
                <div key={slot.time} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <Clock size={16} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-sm font-medium text-[var(--text-secondary)] w-20">{slot.time}</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{slot.subject}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-auto">{slot.class}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                'Submitted grades for Grade 10A Midterms',
                'New assignment created: Algebra Basics',
                'Attendance marked for Grade 11B',
                'Posted learning materials for Chemistry',
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)] mt-2 shrink-0" />
                  <p className="text-sm text-[var(--text-secondary)]">{activity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}