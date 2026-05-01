"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
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

  return (
    <div className="bg-teacher-background text-teacher-on-surface font-sans h-screen overflow-hidden flex flex-col">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm flex items-center justify-between px-4 md:px-6 w-full transition-all duration-300">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link href="/demo" className="text-xl font-bold tracking-tight text-indigo-600 no-underline hover:text-indigo-700 transition-colors flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[18px]">school</span>
            </div>
            <span className="hidden sm:block">EduPlatform</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1 md:gap-2">
            <button className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hidden sm:flex text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Dr. Sarah Jenkins</p>
              <p className="text-xs text-slate-500">Senior Educator</p>
            </div>
            <img 
              alt="Teacher profile avatar" 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm object-cover group-hover:border-indigo-200 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW_k1UDJKVTHEb0vxQzYL6VWv9GY90kK7a7iRg-LqTHQ6_3ChbNeshcUf0XN_KFMzFLuCC27LFsWygLjphkw2pxAfmtLf0fNQ0e4h_S4tkGHHsBYlJ2OtxdMsraFPxjORddmtIH6BUJ4DM5zzewdyqkdcQOuNkOe0eTK_qDfy8B6knNUw2_z0cLmJwlBRBr3XR7Od38LUJju-YCUFxNN5HoTefz3L09BoJtFHNNeXlO4_xhM3hlJef9ALLRbqoUXw0bMp9uQAkJTs"
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
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] bg-white/95 backdrop-blur-xl md:bg-white border-r border-slate-200/50 flex flex-col gap-1 p-4 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex items-center justify-between px-3 py-4 mb-2 md:mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque']">Teacher Portal</h2>
              <p className="text-xs text-slate-500">Academic Management</p>
            </div>
            <button 
              className="md:hidden p-2 -mr-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
              { id: 'lessons', icon: 'auto_stories', label: 'Lessons' },
              { id: 'materials', icon: 'folder_open', label: 'Materials' },
              { id: 'assignments', icon: 'assignment', label: 'Assignments' },
              { id: 'chat', icon: 'chat', label: 'Chat' },
              { id: 'payments', icon: 'payments', label: 'Payments' },
              { id: 'performance', icon: 'trending_up', label: 'Performance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
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
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto pt-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-5 border border-indigo-100/50 rounded-2xl backdrop-blur-sm bg-white/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-indigo-500 text-[18px]">cloud</span>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Storage</p>
              </div>
              <div className="h-2 w-full bg-indigo-100/50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-3/4 rounded-full"></div>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-3">7.5 GB <span className="text-slate-400 font-normal">/ 10 GB used</span></p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-4 md:p-8 h-full relative">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-12">
            
            {/* Tab: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <section id="overview" className="animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-2 font-['Bricolage_Grotesque'] tracking-tight">Welcome back, Dr. Jenkins</h1>
                    <p className="text-sm md:text-base text-slate-500">Here's what's happening with your classes today.</p>
                  </div>
                  <button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto justify-center">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    New Course
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Stats Cards */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-4 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-indigo-100/50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <span className="material-symbols-outlined text-2xl">group</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Total Students</p>
                      <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">1,284</h3>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-4 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Active Courses</p>
                      <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">12</h3>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-4 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Assignments</p>
                      <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">48</h3>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-4 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Revenue</p>
                      <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">$12.4k</h3>
                    </div>
                  </div>
                </div>
                {/* Bento Grid Layout for Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 md:mt-8">
                  <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">Student Progress</h3>
                      <select className="w-full sm:w-auto border border-slate-200/80 rounded-xl text-sm px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                      </select>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <img alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-200 transition-all shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUta4-2rSjNLQv54bTrnBaHJlHYqBLCwluvy6Z-qkl2muGJjo5-X8J7rgxmlGxlOxVhHQpPOwZ8QZU53eDhssRtxqpkGoAGZNQdKd4RK9gAPh_NRBqujMIqqKc1Y27WuLkwKy5b7WAPnzbN6oSCzgea8HZtHQ43f1TdJQQF5srFfg02JXy-KqxxDFRUXNCzBBrTztv_viCaew6HWzTYxTQ5ULz3QQSWg9KChJ0rGyk2rwivadXFwW8llji83OV2jlAOjjcGAVNSmM"/>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-slate-800">Jane Doe</span>
                            <span className="text-sm font-bold text-indigo-600">88%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 w-[88%] rounded-full group-hover:shadow-[0_0_10px_rgba(79,70,229,0.4)] transition-shadow"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <img alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-amber-200 transition-all shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcwA27BIu8t0dk3RSo-2puJJ2zgtTzD38rprSs9BoEOsSlRSL3kGvyKO5aZZMKn1q3b9iUwYcRN-y6Bec3By2iGljlkpIu-8f8gVmN3HiiIhynJLlErYdboCAnGNydJy52ayUK2uR8lU72c2uU1dixaVqEJZ7wARZHikf0n5AKdCWdQ5tlMxdvyrFuyElNKsDUQjQp_LKmRwcsKBMRNb1lx-_7sMtkA4ErByyi_0ZW3EqSTTCzguM3Lq4PsJIA9EKFDyIkt_D8SCw"/>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-slate-800">Mark Smith</span>
                            <span className="text-sm font-bold text-amber-500">72%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-[72%] rounded-full group-hover:shadow-[0_0_10px_rgba(245,158,11,0.4)] transition-shadow"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                        <img alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-200 transition-all shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATi5GzBnVwmc4Slm91afw20KBaB2zLMAzzvXy8WzU1sLPn3nCTz8J7ZegHggrD_0Dptx82NkXGIF8Up_Q9MstUc0B778cQdkTfrKI9VzMiwitqCAgc0rKifjv5-umVm1CLutzPjaxSQyZIu9ytFJU9-XoBfAi1PanUrUrLi3bqKnkzS63sNPVsls2cu7a1qD7AeqvCGnqrTlhMMRRs4Ga7LNSy5CHinFyUUyxk7wfPLJzCuksvKAb3JFPdEZsIqqC46AeMTtCjO1Q"/>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-slate-800">Alice Lin</span>
                            <span className="text-sm font-bold text-emerald-500">95%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[95%] rounded-full group-hover:shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-shadow"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 rounded-2xl text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-indigo-900/20 group hover:shadow-indigo-900/40 transition-shadow">
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                        <span className="material-symbols-outlined text-white">event</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 font-['Bricolage_Grotesque'] tracking-tight">Upcoming Session</h3>
                      <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">Advanced UI Design Principles</p>
                      <div className="mt-6 flex items-center gap-2 bg-black/20 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                        <span className="material-symbols-outlined text-[18px] text-indigo-200">schedule</span>
                        <span className="text-sm font-semibold tracking-wide">14:00 - 15:30</span>
                      </div>
                    </div>
                    <button className="bg-white text-indigo-700 w-full py-3.5 rounded-xl font-bold text-sm relative z-10 hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10 active:scale-[0.98] mt-8 group-hover:-translate-y-1">
                      Join Meeting
                    </button>
                    {/* Abstract decoration */}
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-400/40 transition-colors"></div>
                    <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-indigo-400/30 rounded-full blur-2xl group-hover:bg-indigo-400/40 transition-colors"></div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Upload Lessons */}
            {activeTab === 'lessons' && (
              <section id="upload" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm max-w-4xl hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 font-['Bricolage_Grotesque'] tracking-tight">Upload Lessons</h3>
                  <div className="border-2 border-dashed border-slate-300/80 rounded-2xl p-8 md:p-16 flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-300 cursor-pointer group bg-slate-50/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="w-20 h-20 bg-white text-slate-400 shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:bg-indigo-50/80 group-hover:scale-110 transition-all duration-300 z-10">
                      <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                    </div>
                    <p className="font-bold text-xl text-slate-800 z-10">Drag &amp; drop files here</p>
                    <p className="text-slate-500 text-sm mt-2 z-10">Support for MP4, PDF, and DOCX (Max 500MB)</p>
                    <button className="mt-8 text-indigo-600 font-bold border-2 border-indigo-600 px-8 py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 z-10">
                      Browse Files
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Course Materials */}
            {activeTab === 'materials' && (
              <section id="materials" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden max-w-4xl hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">Course Materials</h3>
                    <div className="relative w-full sm:w-auto">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                      <input className="w-full sm:w-[250px] pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Search files..." type="text"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex items-center gap-4 p-4 border border-slate-200/60 rounded-xl hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-300 group cursor-pointer">
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-rose-100 transition-all">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Syllabus_2024.pdf</p>
                        <p className="text-xs text-slate-500 mt-0.5">2.4 MB • Updated 2h ago</p>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-slate-200/60 rounded-xl hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-300 group cursor-pointer">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-indigo-100 transition-all">
                        <span className="material-symbols-outlined">videocam</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Introduction_Lecture.mp4</p>
                        <p className="text-xs text-slate-500 mt-0.5">142 MB • Updated yesterday</p>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-slate-200/60 rounded-xl hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-300 group cursor-pointer">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:bg-emerald-100 transition-all">
                        <span className="material-symbols-outlined">folder</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Research_Pack_Zip</p>
                        <p className="text-xs text-slate-500 mt-0.5">45 MB • Updated 3 days ago</p>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">edit</span></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-xl">delete</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Create Assignment */}
            {activeTab === 'assignments' && (
              <section id="assignments" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm max-w-5xl hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 md:mb-8 font-['Bricolage_Grotesque'] tracking-tight">Create New Assignment</h3>
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={e => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                      <select className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <option>Visual Communication</option>
                        <option>History of Art</option>
                        <option>Color Theory</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Class / Grade</label>
                      <select className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <option>Sophomore (A)</option>
                        <option>Sophomore (B)</option>
                        <option>Senior Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Assignment Type</label>
                      <select className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                        <option>Project Submission</option>
                        <option>Quiz / Test</option>
                        <option>Discussion Post</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 space-y-2 mt-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Instructions</label>
                      <textarea className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-slate-50 transition-colors min-h-[160px] resize-y" placeholder="Detailed assignment description..."></textarea>
                    </div>
                    <div className="md:col-span-3 flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-4 pt-6 border-t border-slate-100">
                      <button className="px-6 py-2.5 border-2 border-slate-200/80 rounded-xl font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all" type="button">Save Draft</button>
                      <button className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all" type="submit">Publish Assignment</button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            {/* Tab: Student Chat */}
            {activeTab === 'chat' && (
              <section id="chat" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex h-[calc(100vh-180px)] min-h-[500px] max-h-[700px] max-w-6xl mx-auto hover:shadow-lg transition-shadow">
                  <div className="w-full md:w-[320px] border-r border-slate-200/60 flex flex-col flex-shrink-0 bg-slate-50/30 hidden md:flex">
                    <div className="p-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-md">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                        <input className="w-full pl-10 pr-4 py-2 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white/80 transition-all" placeholder="Search students..." type="text"/>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="p-4 flex items-center gap-3 bg-indigo-50/80 border-r-4 border-indigo-500 cursor-pointer hover:bg-indigo-50 transition-colors">
                        <img alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5YtzuGGhQtoMSYb1z4CZnqzzcbjq48xkrOrRAS800ySrm9ocI5a1BzLYwxIk0eZnIcgUfFelkA_eQMCMIc7W08pM-TNUrEQ6mXISeFxVR6YfFBWO1eJoxwM9CgWegDXdxbPoVGlQZxdbmq74kNvWgTuV2Ms4t1n07gHVb4LG_ao3lxXxeamT2cw4fEHaXZ-GRkv6nwiprw6xMch0nuLsJBE30XbcNwDgFCq9ntroDL6ffKWyYToxeDEiPLoO48Pjk38Y0tPqGFSk"/>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className="text-sm font-bold text-slate-900 truncate">Alice Lin</h4>
                            <span className="text-[10px] text-indigo-600 font-bold">2m ago</span>
                          </div>
                          <p className="text-xs text-indigo-600 font-medium truncate">Professor, I had a question about the assignment deadline...</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-center gap-3 hover:bg-white cursor-pointer transition-colors border-b border-slate-100">
                        <img alt="John" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8gYSxsWIXMDJgBjagtAXPCLznBLwOX3tX91ZKO1QApfFfzvMpXemInFjapK_SL975FXP5atiFYnV9MrfDspQpMEP3S0p8hsB_v3RUiQBcWjIWJR1Q1FvCajAygB3f3k1g870DiNbZW8WXYOnx8Uvlf2Q8Nvwye97E9lHwRnwGMBZ-RmRfKbclN-RyH1HupK7BprpxsdP6g9Z3ITKw4EIF_HRwaojxOktYUbH0FcuJKyQ_M0kZUEhKC0hNYdgn1zpIDF6koegTO8"/>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className="text-sm font-bold text-slate-700 truncate">John Davis</h4>
                            <span className="text-[10px] text-slate-400 font-semibold">1h ago</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">Thanks for the feedback on my last project!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col bg-white/60 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <div className="px-4 md:px-6 py-4 border-b border-slate-200/60 flex items-center justify-between shadow-sm z-10 bg-white/80 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk7Wsjskynl2H5KXiECGBzgWR0Hvt0bSNn7-cg5jZS-lQ0Er7esj0N3SyiGOTxgCx92nEYZv8IT8Fj86UZ6VPrEcvcABG8HENglXyWqnEclvYp_Xh_Z449VX2aygqq4jg1mO-nYvCx3fl2-xuEX_1JAW6HfWjBPpVELirlTSEq-2bX4ICAQnHQVf67hRONetlckhbPzDpoKM9kULnCc--Ahe9IW68YL8tqaVrfFRULnVFCWgiiK-3c025F8JbTI1JU39_WgzQUA_M"/>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900">Alice Lin</h4>
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
                        </div>
                      </div>
                      <div className="flex gap-1 md:gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><span className="material-symbols-outlined">call</span></button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><span className="material-symbols-outlined">videocam</span></button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                      </div>
                    </div>
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar space-y-6 z-10">
                      <div className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-sm text-[.95rem] text-slate-700 leading-relaxed hover:shadow-md transition-shadow">
                          Professor, I had a question about the assignment deadline. Can we submit by Monday morning?
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 mt-1.5 ml-1">10:42 AM</span>
                      </div>
                      <div className="flex flex-col items-end ml-auto max-w-[85%] md:max-w-[70%]">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md shadow-indigo-500/20 text-[.95rem] leading-relaxed hover:shadow-lg hover:shadow-indigo-500/30 transition-shadow">
                          Hello Alice! Yes, the portal will remain open until Monday at 9:00 AM.
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 mt-1.5 mr-1 text-right">10:45 AM</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/60 z-10">
                      <div className="flex items-center gap-2 md:gap-3 bg-white border border-slate-200 rounded-full px-2 py-1.5 md:px-4 md:py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all shadow-sm">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"><span className="material-symbols-outlined">attach_file</span></button>
                        <input className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[.95rem] py-1" placeholder="Type a message..." type="text"/>
                        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex-shrink-0"><span className="material-symbols-outlined text-[18px] ml-1">send</span></button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Payments */}
            {activeTab === 'payments' && (
              <section id="payments" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden max-w-6xl mx-auto hover:shadow-lg transition-shadow">
                  <div className="p-6 border-b border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md">
                    <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">Student Payments</h3>
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-700 border-2 border-slate-200/80 px-5 py-2.5 rounded-xl hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export Report
                    </button>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left min-w-[700px]">
                      <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200/60">
                        <tr>
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Course</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80">
                        <tr className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img alt="Alice" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mHyOpfSCUbiESMFCtXc425X4i_scXPSJ355x5z2tvsXovxMF4YcauUy9SPqHOhBZMVzunimUCkt808Po8jmGgPhKLI3ls39stBnquuE7NPpSItbEWhSqFuJAAxCG9oF-xwoZkfS2oFGkVIV8TmanlvL8KvUUwo0BpAgW0X4NWCCS713yUgurEW0qIjQC-02tAu1H0LyB8iDQvisNYRjeyXlJ51_cVO2s5hmGwHDSGbtJQbc5tr_ZEkYSeaPhw3KbygvS3VNKB1U"/>
                              <span className="text-sm font-bold text-slate-800">Alice Lin</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">Visual Design Fundamentals</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">$450.00</td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 12, 2023</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md border border-emerald-200/50 shadow-sm">Paid</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"><span className="material-symbols-outlined text-[20px]">receipt_long</span></button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img alt="John" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmPoMtVfIX5bjeysfE5jkYUNIIW75DMIK5Iomw2TOqwAKMsjNMVnAoL9HrEjPvWSvgxLmnZsBUQFm9FYfe6MpexIcSgwv9Ny1D46trNo71N_fRZP1cDVK1iFoeCvkL9JfKTtQd2yalMe_jLtSELGcfH6YD2ElEhlWh-U8zK1hnzpV0HeRKHTQ-PcVKiidLKbQCjNKVfylWp69brSrGaEmo20TuUuZvb7rS4jpaO5_N1kJbbe8PLg5dgbY9ZlzKN9wuR9zHn_gayFc"/>
                              <span className="text-sm font-bold text-slate-800">John Davis</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">Advanced Typography</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">$450.00</td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 10, 2023</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md border border-amber-200/50 shadow-sm">Pending</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"><span className="material-symbols-outlined text-[20px]">receipt_long</span></button>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img alt="Mark" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDcgi-CLEqUU8zIHTUR56qJbJoiJAZY8qrON2bZktQHFCl-IFRykhaMeyKz7MGz8KOeHAFu3ItwGrVG1FbSovsUICpIhke9K8wrwXQneuNanWHIqWGJYtZKqXQPAH2xHIHupzl4oSi7hgzB7CeE0jM21JjNubI6Ldp2-DEErJHEFf5ByfmLIsMtkuqMAWyhwHYq4XThBV7i-doIZmIJWfH31bbwDkDTxUduW5mB-u4O1x10rpZ7fkV0f-oz3uiZNCoVQ92ia2HCHI"/>
                              <span className="text-sm font-bold text-slate-800">Mark Smith</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 font-medium">UI/UX Masterclass</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">$1,200.00</td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">Oct 08, 2023</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-200/50 shadow-sm">Overdue</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"><span className="material-symbols-outlined text-[20px]">receipt_long</span></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Student Performance */}
            {activeTab === 'performance' && (
              <section id="performance" className="animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 md:mb-8 font-['Bricolage_Grotesque'] tracking-tight">Student Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Performance Card 1 */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRoIrPJRN_BrWX01RR8f0AidZH8aBVFIbIfr9_PGC963olWCk0-KoGdC5jetNAN_dbBUWheyA615feqT02UyK-L-rw8bO9gZfTpU0ToSOaOrT1dS8JifmmzWea4HtSIv5kFsc8AWakRrSeKz2fbD2Fu0w6sgKIWs8HBux0lwkHMh6EsVTI0oY2gM4w7cCd0tBeKJ4WJYHOmuSW6To4zEaPvDSnyMFIO6VUhTyq2hI8LUKT6-Az2vrawQOh6dlvzGA8nn_0XH1SQ-c"/>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">Alice Lin</h4>
                        <p className="text-sm font-medium text-slate-500">Advanced UI Design</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1.5 text-slate-700">
                          <span>Assignment Score</span>
                          <span className="text-indigo-600">98%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 w-[98%] rounded-full group-hover:shadow-[0_0_8px_rgba(79,70,229,0.5)] transition-shadow"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1.5 text-slate-700">
                          <span>Attendance</span>
                          <span className="text-emerald-600">100%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[100%] rounded-full group-hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-shadow"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                      </div>
                      <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 hover:scale-[1.02] transition-all">Details</button>
                    </div>
                  </div>
                  {/* Performance Card 2 */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAFTxG276x_Z4LVfft4tt1hBs7bup9oQmpfVV2XgMnl7dXKG5teUkOp1eTTIC_FRxEWUBOI21u5Yxlvz83VaDGyuSn0bGIRJMdLZ-bo8366x0UwzF0yk6HOePwihU1EVgPocRR-a5N2F9D4lL6l6cjQwbpy5-S_4GTtRraaG6nSDEfqOf6PkoSxZWZg3RqkaVbETOuludXT4IVGx2tTVVF-ZIvLAFeJCXvCj5fWKFU-iFJ1tXaJBrP_v99VUrEHsbl4LGLpMFvmVo"/>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">John Davis</h4>
                        <p className="text-sm font-medium text-slate-500">History of Arts</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1.5 text-slate-700">
                          <span>Assignment Score</span>
                          <span className="text-amber-500">65%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-[65%] rounded-full group-hover:shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-shadow"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1.5 text-slate-700">
                          <span>Attendance</span>
                          <span className="text-rose-500">45%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-rose-400 to-rose-500 w-[45%] rounded-full group-hover:shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-shadow"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-slate-200 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-slate-200 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-slate-200 text-[18px]">star</span>
                      </div>
                      <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 hover:scale-[1.02] transition-all">Details</button>
                    </div>
                  </div>
                  {/* Performance Card 3 */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa0y1_Zx64Vgpu1sMu9xw0D21fYr7vU5hcCkBQXpcHFLdtifXectSd8jDSEChWVsLzVjG_BVJREON9Ixmx_k58jWMqote5seR0GvxoGM3QEHEQ8PdjfWle-sdVCsbIsLCcZ-aFATKOjBdSlBYPNf9n8u2RbYQBk4WOSMlUf-PbMDt-QHfh9XN9ZF0mrE2QbOjXGg6bcIzn72uabgWpnVmv9L29dAqXlx5iYvad-RX_EfICXDPRssCHxZKUwoOU_YAT_a-2R0hFUe0"/>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">Mark Smith</h4>
                        <p className="text-sm font-medium text-slate-500">UX Research Pro</p>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1.5 text-slate-700">
                          <span>Assignment Score</span>
                          <span className="text-indigo-600">82%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 w-[82%] rounded-full group-hover:shadow-[0_0_8px_rgba(79,70,229,0.5)] transition-shadow"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-1.5 text-slate-700">
                          <span>Attendance</span>
                          <span className="text-emerald-500">92%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[92%] rounded-full group-hover:shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-shadow"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-amber-400 text-[18px]">star</span>
                        <span className="material-symbols-outlined text-slate-200 text-[18px]">star</span>
                      </div>
                      <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 hover:scale-[1.02] transition-all">Details</button>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
