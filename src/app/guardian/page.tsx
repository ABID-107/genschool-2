"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

import { GuardianDashboardView } from "@/components/guardian/Dashboard";
import { GuardianAttendanceView } from "@/components/guardian/Attendance";
import { GuardianAcademicProgressView } from "@/components/guardian/AcademicProgress";
import { GuardianFeesPaymentsView } from "@/components/guardian/FeesPayments";
import { GuardianMessagesView } from "@/components/guardian/Messages";
import { GuardianProfileView } from "@/components/guardian/Profile";

export default function GuardianDashboard() {
  return (
    <Suspense fallback={
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GuardianDashboardContent />
    </Suspense>
  );
}

function GuardianDashboardContent() {
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeChildId, setActiveChildId] = useState('c1');

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (!auth || role !== "guardian") {
      window.location.href = "/login";
    }
  }, []);

  const childrenList = [
    { id: 'c1', nameEn: 'Zara Khan', nameBn: 'জারা খান', class: 'Class 8', section: 'B', roll: '05', avatar: '', attendance: 92, gpa: '4.85', feeDue: 1200, pendingAssignments: 2, currentClassEn: 'Class 8', currentClassBn: 'অষ্টম শ্রেণি', todayAttendance: 'present' as const },
    { id: 'c2', nameEn: 'Ayaan Khan', nameBn: 'আয়ান খান', class: 'Class 5', section: 'A', roll: '12', avatar: '', attendance: 88, gpa: '4.50', feeDue: 800, pendingAssignments: 1, currentClassEn: 'Class 5', currentClassBn: 'পঞ্চম শ্রেণি', todayAttendance: 'present' as const },
  ];

  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  return (
    <div className="space-y-6 pb-20">
      {activeTab === 'dashboard' && <GuardianDashboardView childrenList={childrenList} activeChildId={activeChildId} onChildSwitch={setActiveChildId} />}

      {activeTab === 'attendance' && <GuardianAttendanceView summary={{ percentage: activeChild.attendance, present: 18, absent: 2, late: 1, leave: 0, smsSent: 3 }} />}

      {activeTab === 'progress' && <GuardianAcademicProgressView />}

      {activeTab === 'fees' && <GuardianFeesPaymentsView />}

      {activeTab === 'messages' && <GuardianMessagesView />}

      {activeTab === 'profile' && <GuardianProfileView childrenList={childrenList} />}
    </div>
  );
}
