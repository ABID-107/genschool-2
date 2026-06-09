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
  FileBarChart
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
      className="relative h-screen bg-slate-900 text-white border-r border-slate-800 flex flex-col z-20"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 font-bold text-xl tracking-tight text-white"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">GenSchool</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-600 transition-colors z-30"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <Link key={item.name} href={item.path}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-blue-500/15 text-blue-400' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                  
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

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-slate-800">
        <div className="space-y-1">
          <Link href="/admin/settings">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors group">
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors group"
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium text-sm">Log Out</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
