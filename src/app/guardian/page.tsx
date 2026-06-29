"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { Menu, X, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

import { GuardianDashboardView } from "@/components/guardian/Dashboard";
import { GuardianAttendanceView } from "@/components/guardian/Attendance";
import { GuardianAcademicProgressView } from "@/components/guardian/AcademicProgress";
import { GuardianFeesPaymentsView } from "@/components/guardian/FeesPayments";
import { GuardianMessagesView } from "@/components/guardian/Messages";
import { GuardianProfileView } from "@/components/guardian/Profile";

export default function GuardianDashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GuardianDashboardContent />
    </Suspense>
  );
}

function GuardianDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChildId, setActiveChildId] = useState('c1');

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

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (!auth || role !== "guardian") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const childrenList = [
    { id: 'c1', nameEn: 'Zara Khan', nameBn: 'জারা খান', class: 'Class 8', section: 'B', roll: '05', avatar: '', attendance: 92, gpa: '4.85', feeDue: 1200, pendingAssignments: 2, currentClassEn: 'Class 8', currentClassBn: 'অষ্টম শ্রেণি', todayAttendance: 'present' as const },
    { id: 'c2', nameEn: 'Ayaan Khan', nameBn: 'আয়ান খান', class: 'Class 5', section: 'A', roll: '12', avatar: '', attendance: 88, gpa: '4.50', feeDue: 800, pendingAssignments: 1, currentClassEn: 'Class 5', currentClassBn: 'পঞ্চম শ্রেণি', todayAttendance: 'present' as const },
  ];

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', labelEn: 'Dashboard', labelBn: 'ড্যাশবোর্ড' },
    { id: 'attendance', icon: 'person_check', labelEn: 'Attendance', labelBn: 'উপস্থিতি' },
    { id: 'progress', icon: 'analytics', labelEn: 'Academic Progress', labelBn: 'একাডেমিক অগ্রগতি' },
    { id: 'fees', icon: 'payments', labelEn: 'Fees & Payments', labelBn: 'ফি ও পেমেন্ট' },
    { id: 'messages', icon: 'chat', labelEn: 'Messages', labelBn: 'মেসেজ' },
    { id: 'profile', icon: 'family_restroom', labelEn: 'Family & Profile', labelBn: 'পরিবার ও প্রোফাইল' },
  ];

  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${lang === 'bn' ? 'font-bangla' : ''}`}>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Link href="/guardian" className="text-xl font-bold tracking-tight text-[var(--brand-primary)] no-underline hover:text-[var(--brand-mid)] transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-mid)] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">family_home</span>
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
                {lang === 'bn' ? 'অ্যালেক্স জনসন (বাবা)' : 'Alex Johnson (Father)'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{lang === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian Portal'}</p>
            </div>
            <Image 
              alt="Profile" 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[var(--bg-secondary)] shadow-sm object-cover group-hover:border-[var(--brand-primary)]/30 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_GqNpLIO1iT-CowPy58VSjpKqUke_HfKK6Z9agSyZ7zvsVomKL2uT_qdQc9Oq0VzhPOjbpAnY1UxwxcOXoumvB6ehd3IH0glA_OM9cmbv91b0L9r8hs6kNCKMKN-vE8tvWeonoF16uGva8aDpOhZouX8byDgmKr9-ec9OkveAdoTgCTRrbOTXGmMpfSTqLuOx8Gvtetb6gH8GJOYrCz5dFHcfmguIhGBDDObNpGc-2vhoXnV1yypW-JhhmWJVciAudrRDcB-Ymio"
              width={40}
              height={40}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 overflow-hidden relative">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col gap-1 p-4 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex items-center justify-between px-3 py-4 mb-2 md:mb-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-heading">{lang === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian Portal'}</h2>
              <p className="text-xs text-[var(--text-muted)]">{lang === 'bn' ? 'সহজ ও নিরাপদ' : 'Simple & Secure'}</p>
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
                <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-auto p-4 border-t border-[var(--border-color)]">
            <button 
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("userRole");
                localStorage.removeItem("childUsername");
                router.replace("/login");
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm group w-full text-rose-500 hover:bg-rose-500/10"
            >
              <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
              <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 h-full">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20">
            
            {activeTab === 'dashboard' && <GuardianDashboardView childrenList={childrenList} activeChildId={activeChildId} onChildSwitch={setActiveChildId} />}
            
            {activeTab === 'attendance' && <GuardianAttendanceView summary={{ percentage: activeChild.attendance, present: 18, absent: 2, late: 1, leave: 0, smsSent: 3 }} />}
            
            {activeTab === 'progress' && <GuardianAcademicProgressView />}

            {activeTab === 'fees' && <GuardianFeesPaymentsView />}

            {activeTab === 'messages' && <GuardianMessagesView />}

            {activeTab === 'profile' && <GuardianProfileView childrenList={childrenList} />}

          </div>
        </main>
      </div>
    </div>
  );
}
