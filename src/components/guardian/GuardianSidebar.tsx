'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  TrendingUp,
  Wallet,
  MessageSquare,
  User,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'attendance', icon: ClipboardCheck, label: 'Attendance' },
  { id: 'progress', icon: TrendingUp, label: 'Academic Progress' },
  { id: 'fees', icon: Wallet, label: 'Fees & Payments' },
  { id: 'messages', icon: MessageSquare, label: 'Messages' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function GuardianSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "dashboard";

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`);
    setIsMobileOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("childUsername");
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-[var(--text-primary)]/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-3 left-3 z-50 md:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors bg-[var(--bg-secondary)]/80 backdrop-blur-sm shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative h-screen glass-sidebar flex flex-col z-20 hidden md:flex"
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-sidebar)]">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 font-bold text-xl tracking-tight text-[var(--text-sidebar)]"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-deep)] flex items-center justify-center text-white shadow-sm">
                  <GraduationCap size={20} />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-light)]">
                  GenSchool
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-[var(--sidebar-hover-bg)] text-[var(--brand-accent)] flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white shadow-lg hover:bg-[var(--brand-mid)] transition-colors z-30"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="w-full no-underline"
                >
                  <div
                    className={`nav-item ${
                      isActive ? 'active' : ''
                    }`}
                  >
                    <item.icon size={20} />

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="font-medium whitespace-nowrap overflow-hidden text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-2 py-1 rounded-md bg-[var(--bg-sidebar)] text-[var(--text-sidebar)] text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-sidebar)]">
          <div className="space-y-1">
            <button
              onClick={handleSignOut}
              className="w-full nav-item text-rose-400 hover:text-rose-300"
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="font-medium text-sm">Log Out</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed md:hidden inset-y-0 left-0 z-50 w-[280px] glass-sidebar flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-sidebar)]">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-[var(--text-sidebar)]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-deep)] flex items-center justify-center text-white shadow-sm">
              <GraduationCap size={20} />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-light)]">
              GenSchool
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 -mr-2 text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="w-full no-underline"
                >
                  <div className={`nav-item ${isActive ? 'active' : ''}`}>
                    <item.icon size={20} />
                    <span className="font-medium whitespace-nowrap overflow-hidden text-sm">
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-[var(--border-sidebar)]">
          <button
            onClick={handleSignOut}
            className="w-full nav-item text-rose-400 hover:text-rose-300"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
