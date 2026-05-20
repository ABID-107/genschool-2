"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import ThemeToggle from "@/components/ThemeToggle";

// Guardian Components
import { GuardianDashboardView } from "@/components/guardian/Dashboard";
import { GuardianAttendanceView } from "@/components/guardian/Attendance";
import { GuardianAcademicProgressView } from "@/components/guardian/AcademicProgress";
import { GuardianFeesPaymentsView } from "@/components/guardian/FeesPayments";
import { GuardianMessagesView } from "@/components/guardian/Messages";
import { GuardianProfileView } from "@/components/guardian/Profile";

export default function GuardianDashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin h-8 w-8 text-[#1a56e8] border-4 border-current border-t-transparent rounded-full"></div>
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
  const { lang, toggleLang, t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChildId, setActiveChildId] = useState('c1');

  // Sync activeTab with URL
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

  // Mock Children Data
  const childrenList = [
    {
      id: 'c1',
      nameEn: 'Alex Johnson',
      nameBn: 'অ্যালেক্স জনসন',
      class: '10',
      section: 'A',
      roll: '12',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3rG7ibmqRj09ignTbmUiHQU9DmB-Jnsu49Yz0gHlMWSUwpaodkImSCPCkeBzUnsTzc4HOsHo-4-jOwAXc9tmHmJXdJVToj0htUrah-1VnLRA2kK1JszREZ16nAfPC9IgAMDJgqaUYYurP8QOJeIO1Pmlh67tu7DVEofqRGcahgPBbZDmfpjMWuVCgbdEQVIwXcq8vsfOkEB9g7OUwK8Iy1hF1vu19bzdcVw3l1TUjYMVcEr7PiLJ9Q-YpCewIIRwiUwjNekXtqU',
      attendance: 82,
      gpa: 'A+',
      feeDue: 2450,
      pendingAssignments: 3,
      currentClassEn: 'Mathematics (Room 102)',
      currentClassBn: 'গণিত (রুম ১০২)',
      todayAttendance: 'present' as const
    },
    {
      id: 'c2',
      nameEn: 'Emma Johnson',
      nameBn: 'এমা জনসন',
      class: '7',
      section: 'B',
      roll: '05',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2e2wE_L08R1M1x3H2q1B5C-Z8_U9x8rB2M1Z0s3B5D3l3k6Q9t7l0K3n5U8W2t2C3R3t9W2U9u4C3M1w9M6x3r5M2w9U6y8L0B3c7u4M1c6l2u0L2w3H4D5Q5U3Y8C3s2M3E2s1', // placeholder if missing real avatar, but keeping simple
      attendance: 95,
      gpa: 'A',
      feeDue: 1500,
      pendingAssignments: 1,
      currentClassEn: 'Science Lab',
      currentClassBn: 'বিজ্ঞান ল্যাব',
      todayAttendance: 'present' as const
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fc]">
        <svg className="animate-spin h-8 w-8 text-[#1a56e8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
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
    <div className={`text-slate-900 font-sans h-screen overflow-hidden flex flex-col ${lang === 'bn' ? 'font-bangla' : ''}`}>
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-nav flex items-center justify-between px-4 md:px-6 w-full transition-all duration-300">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link href="/guardian" className="text-xl font-bold tracking-tight text-indigo-600 no-underline hover:text-indigo-700 transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">family_home</span>
            </div>
            <span className="hidden sm:block font-bricolage">GenSchool</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <button 
            onClick={toggleLang}
            className="px-4 py-1.5 bg-slate-100 hover:bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold transition-all border border-slate-200 active:scale-95"
          >
            {lang === 'bn' ? 'English' : 'বাংলা'}
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTabChange('profile')}>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {lang === 'bn' ? 'অ্যালেক্স জনসন (বাবা)' : 'Alex Johnson (Father)'}
              </p>
              <p className="text-xs text-slate-500">{lang === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian Portal'}</p>
            </div>
            <img 
              alt="Guardian profile avatar" 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm object-cover group-hover:border-indigo-200 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_GqNpLIO1iT-CowPy58VSjpKqUke_HfKK6Z9agSyZ7zvsVomKL2uT_qdQc9Oq0VzhPOjbpAnY1UxwxcOXoumvB6ehd3IH0glA_OM9cmbv91b0L9r8hs6kNCKMKN-vE8tvWeonoF16uGva8aDpOhZouX8byDgmKr9-ec9OkveAdoTgCTRrbOTXGmMpfSTqLuOx8Gvtetb6gH8GJOYrCz5dFHcfmguIhGBDDObNpGc-2vhoXnV1yypW-JhhmWJVciAudrRDcB-Ymio"
            />
          </div>
        </div>
      </header>

      {/* SideNavBar & Main Content Wrapper */}
      <div className="flex flex-1 pt-16 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* SideNavBar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] glass-sidebar flex flex-col gap-1 p-4 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex items-center justify-between px-3 py-4 mb-2 md:mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-bricolage">{lang === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian Portal'}</h2>
              <p className="text-xs text-slate-500">{lang === 'bn' ? 'সহজ ও নিরাপদ' : 'Simple & Secure'}</p>
            </div>
            <button 
              className="md:hidden p-2 -mr-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <nav className="flex flex-col gap-1.5">
            {menuItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => { handleTabChange(tab.id); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out font-sans text-sm font-semibold w-full text-left relative overflow-hidden group
                  ${activeTab === tab.id 
                    ? 'text-indigo-700 bg-indigo-50/80 shadow-sm border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 border border-transparent'
                  }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full"></div>
                )}
                <span className={`material-symbols-outlined transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>{tab.icon}</span>
                <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
              </button>
            ))}
          </nav>
          
          <div className="mt-auto p-4 border-t border-slate-100">
            <button 
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("userRole");
                router.push("/login");
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 font-semibold text-sm group w-full"
            >
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">logout</span>
              <span>{lang === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 h-full relative">
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

