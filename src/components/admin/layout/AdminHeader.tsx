'use client';

import { Bell, Search, User, Menu } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-16 bg-[var(--bg-secondary)]/70 backdrop-blur-md border-b border-[var(--border-light)] flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-brand-primary">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="glass-input block w-full pl-10 pr-3 py-2 sm:text-sm"
            placeholder="Search students, staff, or settings (Press '/' to focus)"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pl-4">
        <button className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[var(--bg-secondary)]" />
        </button>

        <div className="h-8 w-px bg-[var(--border-light)] mx-1" />

        <button className="flex items-center gap-3 hover:bg-[var(--bg-tertiary)] p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-[var(--border-color)]">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-mid flex items-center justify-center text-white shadow-inner">
            <User size={18} />
          </div>
          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight">Admin User</span>
            <span className="text-xs text-[var(--text-muted)]">Super Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
