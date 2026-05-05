"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuardianDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentName, setStudentName] = useState("Leo Johnson");
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    
    if (!auth || role !== "guardian") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      const childUsername = localStorage.getItem("childUsername");
      if (childUsername) {
        let formatted = childUsername;
        if (formatted.includes("@")) formatted = formatted.split("@")[0];
        formatted = formatted.split(/[\.\-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        if (formatted.trim() !== "") {
          setStudentName(formatted);
        }
      }
    }
  }, [router]);

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

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("childUsername");
    router.push("/login");
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .stagger-grid > div {
            opacity: 0;
            animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}} />
      
      {/* SideNavBar */}
      <aside className="fixed inset-y-0 left-0 w-72 flex flex-col p-4 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-none font-sans text-base font-medium">
        <div className="mb-8 px-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white" data-icon="school">school</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">EduPortal</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Guardian Access</p>
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
            <span>Progress</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined" data-icon="chat">chat</span>
            <span>Messages</span>
          </a>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1">
          <a className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
            <span>Support</span>
          </a>
          <a onClick={handleLogout} className="cursor-pointer flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 ease-in-out">
            <span className="material-symbols-outlined" data-icon="logout">logout</span>
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* TopAppBar */}
      <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 h-16 ml-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm font-sans text-sm antialiased">
        <div className="flex items-center gap-4">
          <span className="text-on-surface-variant font-medium">Student: <span className="text-primary font-bold">{studentName}</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined text-gray-500 hover:bg-gray-50 p-2 rounded-full" data-icon="notifications">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </div>
          <span className="material-symbols-outlined text-gray-500 hover:bg-gray-50 p-2 rounded-full cursor-pointer active:opacity-80" data-icon="settings">settings</span>
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface">Alex Johnson</p>
              <p className="text-xs text-on-surface-variant">Guardian</p>
            </div>
            <img alt="Guardian profile" className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_GqNpLIO1iT-CowPy58VSjpKqUke_HfKK6Z9agSyZ7zvsVomKL2uT_qdQc9Oq0VzhPOjbpAnY1UxwxcOXoumvB6ehd3IH0glA_OM9cmbv91b0L9r8hs6kNCKMKN-vE8tvWeonoF16uGva8aDpOhZouX8byDgmKr9-ec9OkveAdoTgCTRrbOTXGmMpfSTqLuOx8Gvtetb6gH8GJOYrCz5dFHcfmguIhGBDDObNpGc-2vhoXnV1yypW-JhhmWJVciAudrRDcB-Ymio"/>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="ml-72 pt-16 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Progress Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-on-surface">Academic Progress</h2>
              <p className="text-base text-on-surface-variant">Overview of {studentName}'s performance and status.</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-2 bg-primary-container text-on-primary-container text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
              <span className="material-symbols-outlined" data-icon="download">download</span>
              Report Card
            </button>
          </div>

          {/* Academic Calendar & Stats Section */}
          <div className="grid grid-cols-12 gap-8 animate-[fadeInUp_0.5s_ease-out_forwards]">
            
            <div className="col-span-12 lg:col-span-8 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600 bg-indigo-50 p-2 rounded-lg" data-icon="calendar_month">calendar_month</span>
                  <h3 className="text-xl font-bold text-slate-800">Academic Calendar</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-on-surface-variant bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>Present</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>Absent</div>
                  <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-green-600 leading-none">check_circle</span>HW OK</div>
                  <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-red-600 leading-none">cancel</span>HW Missed</div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-2">
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2">Mon</div>
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2">Tue</div>
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2">Wed</div>
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2">Thu</div>
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2">Fri</div>
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2 text-gray-300">Sat</div>
                <div className="text-center text-xs font-bold text-gray-400 uppercase py-2 text-gray-300">Sun</div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 stagger-grid">
                <div className="h-24"></div>
                <div className="h-24"></div>
                <div className="h-24"></div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-gray-400">1</span>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="material-symbols-outlined text-green-600 text-base" data-icon="check_circle">check_circle</span>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg transform -translate-y-8 whitespace-nowrap">Present • All HW Submitted</div>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-gray-400">2</span>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="material-symbols-outlined text-red-600 text-base" data-icon="cancel">cancel</span>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-100/50 rounded-lg p-2 border border-dashed border-gray-200">
                  <span className="text-sm font-bold text-gray-300">3</span>
                </div>
                
                <div className="h-24 bg-gray-100/50 rounded-lg p-2 border border-dashed border-gray-200">
                  <span className="text-sm font-bold text-gray-300">4</span>
                </div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-gray-400">5</span>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="material-symbols-outlined text-gray-300 text-base" data-icon="block">block</span>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-gray-400">6</span>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="material-symbols-outlined text-green-600 text-base" data-icon="check_circle">check_circle</span>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-gray-400">7</span>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="material-symbols-outlined text-green-600 text-base" data-icon="check_circle">check_circle</span>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-gray-400">8</span>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="material-symbols-outlined text-green-600 text-base" data-icon="check_circle">check_circle</span>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-50 rounded-lg p-2 border border-transparent hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all group relative cursor-help">
                  <span className="text-sm font-bold text-indigo-600">9</span>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="material-symbols-outlined text-green-600 text-base" data-icon="check_circle">check_circle</span>
                  </div>
                </div>
                
                <div className="h-24 bg-gray-100/50 rounded-lg p-2 border border-dashed border-gray-200"><span className="text-sm font-bold text-gray-300">10</span></div>
                <div className="h-24 bg-gray-100/50 rounded-lg p-2 border border-dashed border-gray-200"><span className="text-sm font-bold text-gray-300">11</span></div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <span className="material-symbols-outlined text-[180px]" data-icon="query_stats">query_stats</span>
                </div>
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined" data-icon="insights">insights</span>
                  Monthly Stats
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-indigo-100 text-[10px] uppercase font-black tracking-widest">Days Present</p>
                    <p className="text-2xl font-bold">18/20</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-indigo-100 text-[10px] uppercase font-black tracking-widest">Days Absent</p>
                    <p className="text-2xl font-bold">02</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-indigo-100 text-[10px] uppercase font-black tracking-widest">HW Submitted</p>
                    <p className="text-2xl font-bold text-green-300">14</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-indigo-100 text-[10px] uppercase font-black tracking-widest">HW Missed</p>
                    <p className="text-2xl font-bold text-red-300">01</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span>Attendance Score</span>
                    <span className="font-bold">90%</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: "90%" }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-on-surface mb-4">Quick Tips</h4>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-indigo-600 text-sm" data-icon="lightbulb">lightbulb</span>
                    {studentName}'s best attendance days are Tuesdays.
                  </li>
                  <li className="flex gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-sm" data-icon="priority_high">priority_high</span>
                    Science homework is usually due on Thursdays.
                  </li>
                </ul>
              </div>
            </div>
            
          </div>

          {/* Fees & Payments Widget */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600 bg-indigo-50 p-2 rounded-lg" data-icon="payments">payments</span>
                  <h3 className="text-xl font-bold">Fees &amp; Payments</h3>
                </div>
                <span className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                  Pending Action
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-50 pt-8">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Paid</p>
                  <p className="text-3xl font-bold text-indigo-600">$1,200</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Current Due</p>
                  <p className="text-3xl font-bold text-on-surface">$450</p>
                  <p className="text-xs text-error font-medium">Due in 5 days</p>
                </div>
                <div className="flex items-center justify-center">
                  <button className="w-full py-3 px-6 bg-surface-container-highest text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold rounded-lg border border-outline-variant">
                    View Full Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher Reviews Section */}
          <div className="col-span-12 space-y-6">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined" data-icon="comment">comment</span>
              Teacher Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <img alt="Dr. Sarah Smith" className="w-12 h-12 rounded-full border border-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALO_z4Ai2nCWkDsLH-KVUDBlY711cCvGTJb8O6wlKdsDP18-9cMlUijirDqzOwxZ4wyVgWfDJs6S8WiCaCKl4r_yHH4qAb00_zsUSnTYQazLsclDqDVHi02nPXvufWK_FYvwqQsu5dlWNz3SmZUdSMbp7oAtiUk61SIEsddwnEmrop_4_gyosQCgE5rY16C3zxxJsq-Csx_y2tU3KV-6vFiEs8Ri-EkT4yXMrGoBZEc-pm4BelmuwPu47EfI3n5usS93tMpFc20_8"/>
                    <div>
                      <h4 className="font-bold text-on-surface">Dr. Sarah Smith</h4>
                      <p className="text-sm text-indigo-600 font-semibold">Mathematics</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-tertiary-fixed text-tertiary-container text-xs font-bold rounded-full border border-tertiary-container/10">Good</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 italic text-on-surface-variant text-sm leading-relaxed border-l-4 border-indigo-400">
                  "{studentName} is showing great improvement in Algebra. Logical reasoning is becoming more precise."
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-sm" data-icon="check_circle">check_circle</span>
                    <span className="text-xs font-medium text-on-surface-variant">Homework: Submitted</span>
                  </div>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">Message Sarah</button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <img alt="Mr. James Wilson" className="w-12 h-12 rounded-full border border-gray-100 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6sH7RjH5HgvygBAaBOfvf3pIw1zPrtFuKDPzGw68Xa35X9cIP65m3ZSz6p2JAXQgR7HS2jtxaUnOTC24C8HSmzDx5Eudhq7IAG4fETzbST9G8pc3EqvZ3zlcb6_BRF-dfWyeLERtyhlr8hKSjBUJ_zzCGG07LhOFM0nO_ZyTxoNj8jAyQbwkCuK7JC4Gy6Z0NR1bAMBxttxq6QxthGWWZlqmPLtmc0tSasicN53LYAQukKEnWOOCsqdZJRwt5s5iuAQFI6GXqsm8"/>
                    <div>
                      <h4 className="font-bold text-on-surface">Mr. James Wilson</h4>
                      <p className="text-sm text-indigo-600 font-semibold">Science</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100">Average</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 italic text-on-surface-variant text-sm leading-relaxed border-l-4 border-amber-400">
                  "Focus on the upcoming biology project. Great participation in lab sessions."
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-sm" data-icon="cancel">cancel</span>
                    <span className="text-xs font-medium text-on-surface-variant">Homework: Not Submitted</span>
                  </div>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">Message James</button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Conversations Section */}
          <div className="col-span-12 mt-12 pb-12">
            <h3 className="text-xl font-bold text-on-surface mb-6">Recent Conversations</h3>
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex h-[500px]">
              
              {/* Left Panel: Teacher List */}
              <div className="w-1/3 border-r border-gray-100 flex flex-col">
                <div className="p-4 bg-gray-50/50 border-b border-gray-100">
                  <div className="relative">
                    <input className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-indigo-500 outline-none" placeholder="Search teachers..." type="text"/>
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm" data-icon="search">search</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-4 flex items-center gap-3 hover:bg-indigo-50/30 cursor-pointer border-b border-gray-50">
                    <img alt="Sarah Smith" className="w-10 h-10 rounded-full border border-gray-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSyCMYyt1x5_CDjRu_Q8llMWE7oiFXqEvMC7KPn_Qg7gF3vdE3qFoXHVOGNWvjep0tuQnBEDc4_gjwMG5BE_dgOalmyx86eP82djwYho666abOHdBNPDrJoXeVK5sKkoKN0UAQZk27RwuN4N7bnIlW4gVi239xZNjGAjUwFhv2kDmjRHga3iDurymKHeUj8pKIhJi63SlRB_e-COGRzLq5A2smSYRf_MB_nshkIyJIZzI0yGiaFREgPCdTNK1xc5KlTuvq6hQLzAs"/>
                    <div className="flex-1 overflow-hidden">
                      <h5 className="font-bold text-sm truncate">Dr. Sarah Smith</h5>
                      <p className="text-xs text-on-surface-variant truncate">Mathematics</p>
                    </div>
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  </div>
                  <div className="p-4 flex items-center gap-3 bg-indigo-50 border-l-4 border-indigo-600">
                    <img alt="Maria Garcia" className="w-10 h-10 rounded-full border border-gray-200 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhTgE3H46F3MvQQLZTKbK8CasfjJIg_tYkbO7KgwUC7yt1-ZstUSj_RGOGOEbJ4JyAScXPSNzFJWRCn5YjTL_DA-4HFGFq-XC0zLJQ-aadnEVJgZRYUzUJFNO_8ZKNpPr6HnzGHm1k7PFsY-Ml5in43laVU7JDcUYre39dkfihQRDs-BPoRjbnYXrhMI8HdCrMZzbcaet6Njo9_joCcT4Dg4Yk7LyGVsQX3X2Jy8Hqw1JXKeTeehfMT4XewtQNu2VG5wvwajO39wo"/>
                    <div className="flex-1 overflow-hidden">
                      <h5 className="font-bold text-sm truncate">Maria Garcia</h5>
                      <p className="text-xs text-indigo-700 font-semibold truncate">History</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Panel: Active Chat */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img alt="Maria Garcia" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYdqcVTxyftTmqw7_aMk3gb7qG7g3yF6w_DmE7xny8Ed1G9cLyKMLF4KZFDPza4E2q-4MPr39sWZ4n5fXRXCT8VqtDIwa8YH1v87uEh-JsQfSIais21dTIUz6htyLOh8CELps-rJTGh40SZLPc6T-J-RbOlsZaQWxoImNG4zG3a-b_vNejXfMD1Vh5duSYpN9lMWoXhgmWn7BvW_jBx0dkSIszY7qC4KCRCDoO5Ljj4ykQ6wqkLaHtMOj7ikzaOurb0qf5EbihkiU"/>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div>
                      <h5 className="font-bold text-on-surface">Maria Garcia</h5>
                      <p className="text-xs text-green-600 font-medium">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 p-2 hover:bg-gray-50 rounded-full cursor-pointer" data-icon="videocam">videocam</span>
                    <span className="material-symbols-outlined text-gray-400 p-2 hover:bg-gray-50 rounded-full cursor-pointer" data-icon="info">info</span>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/30">
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <p className="text-sm text-on-surface">Hello Alex! I'm suggesting {studentName} joins the History Bowl team. What do you think?</p>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">10:20 AM</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <span className="material-symbols-outlined" data-icon="attach_file">attach_file</span>
                    </button>
                    <input className="flex-1 border-none focus:ring-0 bg-gray-100 rounded-full px-6 py-3 text-sm outline-none" placeholder="Type a message..." type="text"/>
                    <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 shadow-md">
                      <span className="material-symbols-outlined" data-icon="send" data-weight="fill">send</span>
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
