'use client';

import { Bell, Search, User, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TeacherHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="h-16 bg-[var(--bg-secondary)]/70 backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)]">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input pl-10 pr-3 py-2 text-sm"
            placeholder="Search lessons, students, or materials..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pl-4">
        <button onClick={toggleTheme} className="btn-icon relative" aria-label="Toggle theme">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="btn-icon relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-[var(--brand-accent)] ring-2 ring-[var(--bg-secondary)]" />
        </button>

        <div className="h-8 w-px bg-[var(--border-color)] mx-1" />

        <button className="btn-ghost flex items-center gap-3 p-1.5 pr-3 rounded-full">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-mid)] flex items-center justify-center text-white shadow-inner">
            <User size={18} />
          </div>
          <div className="flex flex-col items-start hidden sm:flex">
            <span className="text-sm font-semibold text-[var(--text-primary)] leading-tight">Dr. Sarah Jenkins</span>
            <span className="text-xs text-[var(--text-muted)]">Senior Educator</span>
          </div>
        </button>
      </div>
    </header>
  );
}
