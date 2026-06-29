'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  GraduationCap, 
  Calendar, 
  Clock, 
  FileText, 
  Wallet, 
  BellRing, 
  Bus, 
  Building2, 
  BookOpen, 
  Banknote,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  FileBarChart,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Students', icon: Users, path: '/admin/students' },
  { name: 'Staff', icon: UserSquare2, path: '/admin/staff' },
  { name: 'Academic', icon: GraduationCap, path: '/admin/academic' },
  { name: 'Timetable', icon: Calendar, path: '/admin/timetable' },
  { name: 'Attendance', icon: Clock, path: '/admin/attendance' },
  { name: 'Exams', icon: FileText, path: '/admin/exams' },
  { name: 'Finance', icon: Wallet, path: '/admin/finance' },
  { name: 'Notice Board', icon: BellRing, path: '/admin/notices' },
  { name: 'Transport', icon: Bus, path: '/admin/transport' },
  { name: 'Hostel', icon: Building2, path: '/admin/hostel' },
  { name: 'Library', icon: BookOpen, path: '/admin/library' },
  { name: 'Payroll', icon: Banknote, path: '/admin/payroll' },
  { name: 'Reports', icon: FileBarChart, path: '/admin/reports' },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  return (
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--navy-500)] to-[var(--navy-800)] flex items-center justify-center text-white shadow-sm">
                <GraduationCap size={20} />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-light)]">GenSchool</span>
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
          {MENU_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link key={item.name} href={item.path} className="no-underline">
                <div
                  className={`nav-item ${
                    isActive 
                      ? 'active' 
                      : ''
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
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 rounded-md bg-[var(--navy-900)] text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-[var(--border-sidebar)]">
        <div className="space-y-1">
          <Link href="/admin/settings" className="no-underline">
            <div className="nav-item">
              <Settings size={20} />
              {!isCollapsed && <span className="font-medium text-sm">Settings</span>}
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated");
              localStorage.removeItem("userRole");
              router.replace("/login");
            }}
            className="w-full nav-item text-rose-400 hover:text-rose-300"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium text-sm">Log Out</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
