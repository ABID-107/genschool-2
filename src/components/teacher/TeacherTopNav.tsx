import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

interface TeacherTopNavProps {
  onToggleSidebar: () => void;
  teacherName: string;
  teacherRole: string;
  avatarUrl: string;
  onSignOut: () => void;
}

export function TeacherTopNav({ onToggleSidebar, teacherName, teacherRole, avatarUrl, onSignOut }: TeacherTopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav flex items-center justify-between px-4 md:px-6 w-full transition-all duration-300">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="md:hidden p-2 -ml-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors"
          onClick={onToggleSidebar}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/demo" className="text-xl font-bold tracking-tight text-brand-primary no-underline hover:text-brand-mid transition-colors flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-mid flex items-center justify-center text-brand-light shadow-md shadow-brand-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[18px]">school</span>
          </div>
          <span className="hidden sm:block">EduPlatform</span>
        </Link>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <ThemeToggle />
        {/* Placeholder for notifications/settings - can be moved to component later */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-brand-primary transition-colors">{teacherName}</p>
            <p className="text-xs text-[var(--text-muted)]">{teacherRole}</p>
          </div>
          <Image
            alt="Teacher profile avatar"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[var(--bg-secondary)] shadow-sm object-cover group-hover:border-brand-accent/30 transition-all"
            src={avatarUrl}
            width={40}
            height={40}
          />
        </div>
      </div>
    </header>
  );
}

