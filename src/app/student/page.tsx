"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { storage } from "@/lib/store";
import { Assignment, CalendarEvent } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";
import { Menu, X, LogOut, School } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import Calendar from "@/components/Calendar";
import Library from "@/components/Library";
import { StudentDashboardView } from "@/components/student/Dashboard";
import { AttendanceView } from "@/components/student/Attendance";
import { ResultsView } from "@/components/student/Results";
import { PaymentsView } from "@/components/student/Payments";
import { ProfileView } from "@/components/student/Profile";
import { NoticesView } from "@/components/student/Notices";
import { StudentAssignmentsView } from "@/components/student/Assignments";

export default function StudentDashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  );
}

function StudentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const studentData = {
    nameBn: "আলেক্স জনসন",
    nameEn: "Alex Johnson",
    class: "10",
    section: "A",
    roll: "12",
    studentId: "SMS-2025-0982",
    attendance: 82,
    feeDue: 2450,
    gpa: "A+",
    bloodGroup: "O+",
    dob: "12-10-2009",
    guardian: "জনাব আল আমিন",
    mobile: "017XXXXXXXX",
  };

  useEffect(() => {
    setAssignments(storage.getAssignments());
    setEvents(storage.getEvents());
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (!auth || role !== "student") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: t('dashboard') },
    { id: 'schedule', icon: 'calendar_month', label: t('schedule') },
    { id: 'attendance', icon: 'person_check', label: t('attendance') },
    { id: 'results', icon: 'military_tech', label: t('results') },
    { id: 'assignments', icon: 'assignment', label: t('assignments') },
    { id: 'library', icon: 'local_library', label: t('library') },
    { id: 'payments', icon: 'payments', label: t('payments') },
    { id: 'notices', icon: 'notifications', label: t('notices') },
    { id: 'profile', icon: 'person', label: t('profile') },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/student" className="text-xl font-bold tracking-tight text-[var(--brand-primary)] no-underline hover:text-[var(--brand-mid)] transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-mid)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <School size={18} />
            </div>
            <span className="hidden sm:block font-heading">GenSchool</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <div className="h-8 w-px bg-[var(--border-color)] hidden sm:block" />
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTabChange('profile')}>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">
                {lang === 'bn' ? studentData.nameBn : studentData.nameEn}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{t('profile')}</p>
            </div>
            <Image 
              alt="Profile" 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[var(--bg-secondary)] shadow-sm object-cover group-hover:border-[var(--brand-primary)]/30 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3rG7ibmqRj09ignTbmUiHQU9DmB-Jnsu49Yz0gHlMWSUwpaodkImSCPCkeBzUnsTzc4HOsHo-4-jOwAXc9tmHmJXdJVToj0htUrah-1VnLRA2kK1JszREZ16nAfPC9IgAMDJgqaUYYurP8QOJeIO1Pmlh67tu7DVEofqRGcahgPBbZDmfpjMWuVCgbdEQVIwXcq8vsfOkEB9g7OUwK8Iy1hF1vu19bzdcVw3l1TUjYMVcEr7PiLJ9Q-YpCewIIRwiUwjNekXtqU"
              width={40}
              height={40}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 overflow-hidden relative">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SideNavBar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col gap-1 p-4 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex items-center justify-between px-3 py-4 mb-2 md:mb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-heading">Dashboard</h2>
              <p className="text-xs text-[var(--text-muted)]">Student Portal</p>
            </div>
            <button 
              className="md:hidden p-2 -mr-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-muted)]"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-1.5">
            {menuItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => { handleTabChange(tab.id); setIsSidebarOpen(false); }}
                className={`nav-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold w-full text-left relative overflow-hidden group
                  ${activeTab === tab.id 
                    ? 'active' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--brand-primary)] border border-transparent'
                  }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-mid)] rounded-r-full" />
                )}
                <span className={`material-symbols-outlined transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-auto p-4 border-t border-[var(--border-color)]">
            <button 
              onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("userRole");
                router.replace("/login");
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm group w-full text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 h-full">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
            
            {activeTab === 'dashboard' && <StudentDashboardView assignments={assignments} events={events} studentData={studentData} />}
            
            {activeTab === 'schedule' && (
              <section className="h-[calc(100vh-180px)]">
                <Calendar events={events} />
              </section>
            )}

            {activeTab === 'attendance' && <AttendanceView summary={{ percentage: studentData.attendance, present: 45, absent: 3, late: 2, leave: 1 }} />}
            
            {activeTab === 'results' && <ResultsView exams={[
              { id: '1', name: 'Annual Exam 2024', term: 'Final', date: 'May 2024', gpa: '5.00', status: 'pass' },
              { id: '2', name: 'Mid Term 2024', term: 'Mid', date: 'Feb 2024', gpa: '4.85', status: 'pass' }
            ]} />}

            {activeTab === 'library' && (
              <section>
                <Library />
              </section>
            )}

            {activeTab === 'payments' && <PaymentsView totalDue={studentData.feeDue} invoices={[
              { id: 'inv-1', month: 'May 2025', category: 'Tuition Fee', amount: 1500, dueDate: '2025-05-15', status: 'due' },
              { id: 'inv-2', month: 'May 2025', category: 'Exam Fee', amount: 950, dueDate: '2025-05-15', status: 'due' },
              { id: 'inv-3', month: 'April 2025', category: 'Tuition Fee', amount: 1500, dueDate: '2025-04-15', status: 'paid' },
            ]} />}

            {activeTab === 'notices' && <NoticesView />}

            {activeTab === 'profile' && <ProfileView student={studentData} />}

            {activeTab === 'assignments' && <StudentAssignmentsView assignments={assignments} />}

          </div>
        </main>
      </div>
    </div>
  );
}
