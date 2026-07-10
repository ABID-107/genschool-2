"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { storage } from "@/lib/store";
import { Assignment, CalendarEvent } from "@/lib/types";

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
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StudentDashboardContent />
    </Suspense>
  );
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

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
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="space-y-6 pb-20">
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
  );
}
