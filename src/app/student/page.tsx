"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

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
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fc]">
        <svg className="animate-spin h-8 w-8 text-[#1a56e8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans h-screen overflow-hidden flex flex-col">
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
            <span className="hidden sm:block font-['Bricolage_Grotesque']">EduPortal</span>
          </Link>
        </div>
        
        <div className="flex items-center flex-1 max-w-xl mx-4 hidden md:flex">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="w-full bg-slate-100/50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all outline-none" placeholder="Search resources, grades, or teachers..." type="text"/>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1">
            <button className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hidden sm:flex text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <button className="hidden sm:flex text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors p-2 rounded-full cursor-pointer active:scale-95">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Alex Johnson</p>
              <p className="text-xs text-slate-500">Student</p>
            </div>
            <img 
              alt="Student profile avatar" 
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm object-cover group-hover:border-indigo-200 transition-all" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3rG7ibmqRj09ignTbmUiHQU9DmB-Jnsu49Yz0gHlMWSUwpaodkImSCPCkeBzUnsTzc4HOsHo-4-jOwAXc9tmHmJXdJVToj0htUrah-1VnLRA2kK1JszREZ16nAfPC9IgAMDJgqaUYYurP8QOJeIO1Pmlh67tu7DVEofqRGcahgPBbZDmfpjMWuVCgbdEQVIwXcq8vsfOkEB9g7OUwK8Iy1hF1vu19bzdcVw3l1TUjYMVcEr7PiLJ9Q-YpCewIIRwiUwjNekXtqU"
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
              <h2 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque']">Student Workspace</h2>
              <p className="text-xs text-slate-500">Academic Portal</p>
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
              { id: 'materials', icon: 'book_2', label: 'Materials' },
              { id: 'teachers', icon: 'school', label: 'Teachers' },
              { id: 'payments', icon: 'payments', label: 'Payments' },
              { id: 'emergency', icon: 'emergency', label: 'Emergency' },
              { id: 'chat', icon: 'chat', label: 'Chat' },
              { id: 'comments', icon: 'forum', label: 'Comments' },
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
          
          <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50/50 rounded-2xl">
            <div className="flex items-center gap-3">
              <img className="w-10 h-10 rounded-full object-cover shadow-sm" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3rG7ibmqRj09ignTbmUiHQU9DmB-Jnsu49Yz0gHlMWSUwpaodkImSCPCkeBzUnsTzc4HOsHo-4-jOwAXc9tmHmJXdJVToj0htUrah-1VnLRA2kK1JszREZ16nAfPC9IgAMDJgqaUYYurP8QOJeIO1Pmlh67tu7DVEofqRGcahgPBbZDmfpjMWuVCgbdEQVIwXcq8vsfOkEB9g7OUwK8Iy1hF1vu19bzdcVw3l1TUjYMVcEr7PiLJ9Q-YpCewIIRwiUwjNekXtqU"/>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">Alex Johnson</p>
                <p className="text-xs text-slate-500 truncate font-medium">Class 10-A</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-4 md:p-8 h-full relative">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
            
            {/* Tab: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <section id="dashboard" className="animate-in fade-in duration-500 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative group flex-shrink-0">
                      <img className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition-all" alt="Alex Johnson" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA651jetLR0eswyBzuwB0hJCTYs16SdRFrjixyTG3cT3yeTtvZQeaxuc4aUhdcUkCJK3obpaoyvvE-Pw55l79f9YBQ9TZ4eIWIQwKxZLKDoBUiiCxcs8uCS7URURI75DNglzdH1MPgGOQZWUgj22gTp0evpliyX1Dpn4varPVTtJu1PU7Yn1w7RgnSt7HuAwzvmLDYgK949PHkfZC2iwfrklfsrsflSpuGCdmXM0t0eWKLINdMDpERGUfBgOxWdMHY67TAP2tqhwfc"/>
                      <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      </button>
                    </div>
                    <div className="flex-1 w-full">
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight mb-1">Alex Johnson</h2>
                      <p className="text-slate-500 text-sm font-medium mb-5">Class 10-A • Student ID: #20240982</p>
                      <div className="flex flex-wrap gap-3">
                        <button className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm">
                          Change Picture
                        </button>
                        <button className="border-2 border-slate-200/80 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col">
                      <p className="text-sm font-semibold text-indigo-200 mb-auto">Current Academic Standing</p>
                      <div className="flex justify-between items-end mt-8">
                        <div>
                          <p className="text-4xl sm:text-5xl font-bold font-['Bricolage_Grotesque'] tracking-tight">3.82</p>
                          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mt-1">Overall GPA</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl sm:text-5xl font-bold font-['Bricolage_Grotesque'] tracking-tight">94%</p>
                          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mt-1">Attendance</p>
                        </div>
                      </div>
                    </div>
                    {/* Abstract decoration */}
                    <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[140px]">insights</span>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                  </div>
                </div>

                {/* Quick Shortcuts on Dashboard */}
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight mt-8 mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { title: "Schedule", icon: "calendar_month", color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Assignments", icon: "assignment", color: "text-indigo-600", bg: "bg-indigo-50" },
                    { title: "Library", icon: "local_library", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { title: "Grades", icon: "military_tech", color: "text-amber-600", bg: "bg-amber-50" },
                  ].map((item, i) => (
                    <button key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200/50 p-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 group">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{item.title}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Tab: Course Materials */}
            {activeTab === 'materials' && (
              <section id="materials" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">Course Materials</h3>
                    <div className="relative w-full sm:w-64">
                      <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]">search</span>
                      <input className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="Search files..." type="text"/>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Material Item 1 */}
                    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Math_Logic_Lecture_04.pdf</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">2.4 MB • Uploaded 2 days ago</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download</span>
                      </button>
                    </div>

                    {/* Material Item 2 */}
                    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined">folder_zip</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">History_Notes_Term_1.zip</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">14.8 MB • Uploaded Yesterday</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download</span>
                      </button>
                    </div>

                    {/* Material Item 3 */}
                    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <span className="material-symbols-outlined">slideshow</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Biology_Cell_Structure.pptx</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">8.1 MB • Uploaded Today</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Teachers */}
            {activeTab === 'teachers' && (
              <section id="teachers" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 md:p-8 shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 font-['Bricolage_Grotesque'] tracking-tight">Your Teachers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Teacher Card 1 */}
                    <div className="p-6 border border-slate-200/60 rounded-2xl hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col items-center text-center bg-white group">
                      <img className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 mb-4 group-hover:scale-105 transition-transform shadow-sm" alt="Dr. Smith" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXBdAnDoVAw1pQx0MqV_CZBT2tlSdWX--037pUxFUye4NUs7oZb15wo5r_Mf1ClP_oHCXmR1uwH_bVwq0aUh9-gULq4zhTR-6CPMi7evyj9Ve0dmNqQBj4-mNZjy6FNkJgE-SowB9i3OLPcFHadDNLNvPMLl6LS5HPKNIXqZnx3p0U2JeW4ZgTywRMoewjpaJUoAVH_51i19bLLQZl7LVjUOCgvwOnUWBrhFzkdOfWYlfAT89MXMWaj3Rlh-Iet4YlhgLo_r6HnZQ"/>
                      <p className="font-bold text-lg text-slate-900 font-['Bricolage_Grotesque']">Dr. Smith</p>
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mt-2 mb-4">Mathematics</span>
                      <button className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">mail</span> Message
                      </button>
                    </div>

                    {/* Teacher Card 2 */}
                    <div className="p-6 border border-slate-200/60 rounded-2xl hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col items-center text-center bg-white group">
                      <img className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 mb-4 group-hover:scale-105 transition-transform shadow-sm" alt="Prof. Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZaMS-RplF3kYnqQLfQVCaGWd39U3kFDCUyzyXUTKey_IfJ78mgtjGb7fbRROQ1I0zJL8ajpZScUjOdzeOsprAIzSVN2VNofnCdrRyg876IXQ-dWB_BRMXjhOkZKPMyZmos9E2Cabx69v5ZZGMkTe6rwAO8d-0cFz2kc3luE5RF9eThjElT_HHau5ffjkNeKLr1IR5p45PSF2c9GVR--2Say-WaiEXkg2rz30WwhxMRhSvAz9dlCPv1duyzwJcQ03Ywcd6LIA9Fo"/>
                      <p className="font-bold text-lg text-slate-900 font-['Bricolage_Grotesque']">Prof. Miller</p>
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full mt-2 mb-4">History & Arts</span>
                      <button className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">mail</span> Message
                      </button>
                    </div>

                    {/* Teacher Card 3 */}
                    <div className="p-6 border border-slate-200/60 rounded-2xl hover:shadow-lg hover:border-indigo-100 transition-all flex flex-col items-center text-center bg-white group">
                      <img className="w-20 h-20 rounded-full object-cover ring-4 ring-slate-50 mb-4 group-hover:scale-105 transition-transform shadow-sm" alt="Ms. Garcia" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCefY1dnk8qasaBSoMANI4nYM8_2tOjpIfThdIuWTpJIgZxvDYkdnws7WcFJmYu2Fl2CsDLPtuu0QHJAPm2-4DSACDW_UguVPCHPSQc1OyZHJ_7JFkXC7KHWDEbRokxBOUQfPbQhCa7WC0kTyqps6NzUYYMWOIZNRveCBsJyywaNyO5_U6JJMQWeU_tba74JWxEukIROqhif4gfeW33qKoeCFhCB4ZxWOiQ4QbQPQ5ku1-szNsBIbrwy8wi5AYF5wule2mCMWqYjK0"/>
                      <p className="font-bold text-lg text-slate-900 font-['Bricolage_Grotesque']">Ms. Garcia</p>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full mt-2 mb-4">Biology</span>
                      <button className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">mail</span> Message
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Payments */}
            {activeTab === 'payments' && (
              <section id="payments" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">Financial Summary</h3>
                      <p className="text-slate-500 text-sm mt-1 font-medium">Term 2 - Spring Semester</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200 shadow-sm">
                      Payment Pending
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">check</span></div>
                        <p className="text-sm font-semibold text-slate-500">Paid Amount</p>
                      </div>
                      <p className="text-3xl font-bold text-slate-900 font-['Bricolage_Grotesque']">$1,500.00</p>
                    </div>
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">priority_high</span></div>
                        <p className="text-sm font-semibold text-rose-700">Due Amount</p>
                      </div>
                      <p className="text-3xl font-bold text-rose-700 font-['Bricolage_Grotesque']">$200.00</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                    <button className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      Download Invoice
                    </button>
                    <button className="px-6 py-3.5 border-2 border-slate-200/80 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]">
                      <span className="material-symbols-outlined">print</span>
                      <span className="sm:hidden">Print</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Emergency */}
            {activeTab === 'emergency' && (
              <section id="emergency" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 md:p-8 shadow-sm">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-['Bricolage_Grotesque'] tracking-tight">Emergency Services</h3>
                  <p className="text-slate-500 text-sm mb-8">Quick access to campus and local emergency contacts.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex flex-col items-center text-center hover:bg-rose-100 hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">emergency</span>
                      </div>
                      <p className="font-bold text-lg text-rose-900 mb-1">Hospital</p>
                      <p className="text-sm font-semibold text-rose-700 bg-rose-200/50 px-3 py-1 rounded-full">911-EXT-HOS</p>
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center text-center hover:bg-blue-100 hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">local_police</span>
                      </div>
                      <p className="font-bold text-lg text-blue-900 mb-1">Police</p>
                      <p className="text-sm font-semibold text-blue-700 bg-blue-200/50 px-3 py-1 rounded-full">911-EXT-POL</p>
                    </div>

                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center hover:bg-emerald-100 hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">ambulance</span>
                      </div>
                      <p className="font-bold text-lg text-emerald-900 mb-1">Ambulance</p>
                      <p className="text-sm font-semibold text-emerald-700 bg-emerald-200/50 px-3 py-1 rounded-full">911-EXT-AMB</p>
                    </div>

                    <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col items-center text-center hover:bg-amber-100 hover:shadow-md transition-all cursor-pointer group">
                      <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-2xl">fire_truck</span>
                      </div>
                      <p className="font-bold text-lg text-amber-900 mb-1">Fire</p>
                      <p className="text-sm font-semibold text-amber-700 bg-amber-200/50 px-3 py-1 rounded-full">911-EXT-FIRE</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Chat */}
            {activeTab === 'chat' && (
              <section id="chat" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex h-[calc(100vh-200px)] min-h-[500px] max-h-[700px] max-w-5xl mx-auto">
                  {/* Chat Sidebar */}
                  <div className="w-full md:w-72 border-r border-slate-200/60 flex flex-col bg-slate-50/50 hidden md:flex">
                    <div className="p-4 border-b border-slate-200/60 bg-white/50">
                      <h4 className="font-bold text-slate-900 font-['Bricolage_Grotesque']">Messages</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="p-4 bg-indigo-50 border-l-4 border-indigo-600 flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <img className="w-10 h-10 rounded-full object-cover shadow-sm" alt="Dr. Smith" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXBdAnDoVAw1pQx0MqV_CZBT2tlSdWX--037pUxFUye4NUs7oZb15wo5r_Mf1ClP_oHCXmR1uwH_bVwq0aUh9-gULq4zhTR-6CPMi7evyj9Ve0dmNqQBj4-mNZjy6FNkJgE-SowB9i3OLPcFHadDNLNvPMLl6LS5HPKNIXqZnx3p0U2JeW4ZgTywRMoewjpaJUoAVH_51i19bLLQZl7LVjUOCgvwOnUWBrhFzkdOfWYlfAT89MXMWaj3Rlh-Iet4YlhgLo_r6HnZQ"/>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-900 truncate">Dr. Smith</p>
                          <p className="text-xs text-indigo-600 font-semibold">Active Now</p>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-white flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-100">
                        <img className="w-10 h-10 rounded-full object-cover shadow-sm" alt="Prof. Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZaMS-RplF3kYnqQLfQVCaGWd39U3kFDCUyzyXUTKey_IfJ78mgtjGb7fbRROQ1I0zJL8ajpZScUjOdzeOsprAIzSVN2VNofnCdrRyg876IXQ-dWB_BRMXjhOkZKPMyZmos9E2Cabx69v5ZZGMkTe6rwAO8d-0cFz2kc3luE5RF9eThjElT_HHau5ffjkNeKLr1IR5p45PSF2c9GVR--2Say-WaiEXkg2rz30WwhxMRhSvAz9dlCPv1duyzwJcQ03Ywcd6LIA9Fo"/>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-slate-700 truncate">Prof. Miller</p>
                          <p className="text-xs text-slate-400">2h ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Main Area */}
                  <div className="flex-1 flex flex-col bg-white/60 relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200/60 flex items-center gap-3 bg-white/80 backdrop-blur-md z-10 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-slate-200 md:hidden overflow-hidden">
                        <img alt="Dr. Smith" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXBdAnDoVAw1pQx0MqV_CZBT2tlSdWX--037pUxFUye4NUs7oZb15wo5r_Mf1ClP_oHCXmR1uwH_bVwq0aUh9-gULq4zhTR-6CPMi7evyj9Ve0dmNqQBj4-mNZjy6FNkJgE-SowB9i3OLPcFHadDNLNvPMLl6LS5HPKNIXqZnx3p0U2JeW4ZgTywRMoewjpaJUoAVH_51i19bLLQZl7LVjUOCgvwOnUWBrhFzkdOfWYlfAT89MXMWaj3Rlh-Iet4YlhgLo_r6HnZQ" className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Dr. Smith <span className="hidden sm:inline-block px-2 py-0.5 ml-2 bg-indigo-50 text-indigo-600 text-[10px] uppercase tracking-wider rounded-full font-bold">Mathematics</span></p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar space-y-6 z-10">
                      <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
                        <img className="w-8 h-8 rounded-full object-cover shadow-sm mt-1 flex-shrink-0" alt="Dr. Smith" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXBdAnDoVAw1pQx0MqV_CZBT2tlSdWX--037pUxFUye4NUs7oZb15wo5r_Mf1ClP_oHCXmR1uwH_bVwq0aUh9-gULq4zhTR-6CPMi7evyj9Ve0dmNqQBj4-mNZjy6FNkJgE-SowB9i3OLPcFHadDNLNvPMLl6LS5HPKNIXqZnx3p0U2JeW4ZgTywRMoewjpaJUoAVH_51i19bLLQZl7LVjUOCgvwOnUWBrhFzkdOfWYlfAT89MXMWaj3Rlh-Iet4YlhgLo_r6HnZQ"/>
                        <div>
                          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl rounded-tl-sm shadow-sm text-[.95rem] text-slate-700 leading-relaxed hover:shadow-md transition-shadow">
                            Hello Alex, did you have a chance to look at the calculus materials I uploaded this morning?
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 mt-1.5 ml-1">10:15 AM</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 flex-row-reverse max-w-[85%] md:max-w-[70%] ml-auto">
                        <div>
                          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-md shadow-indigo-500/20 text-[.95rem] leading-relaxed hover:shadow-lg hover:shadow-indigo-500/30 transition-shadow">
                            Yes Dr. Smith! I just finished the second module. The examples were very helpful.
                          </div>
                          <p className="text-[11px] font-medium text-slate-400 mt-1.5 mr-1 text-right">10:22 AM</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/60 z-10">
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-2 py-1.5 md:px-4 md:py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all shadow-sm">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"><span className="material-symbols-outlined">attach_file</span></button>
                        <input className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[.95rem] py-1 px-2" placeholder="Type your message..." type="text"/>
                        <button className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex-shrink-0">
                          <span className="material-symbols-outlined ml-1 text-[18px]">send</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Tab: Comments / Feedback */}
            {activeTab === 'comments' && (
              <section id="comments" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 md:p-8 shadow-sm max-w-4xl">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 font-['Bricolage_Grotesque'] tracking-tight">Recent Feedback</h3>
                  
                  <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200/80 ml-2">
                    
                    {/* Feedback Item 1 */}
                    <div className="relative pl-12">
                      <div className="absolute -left-1 top-0 w-10 h-10 bg-indigo-50 border-2 border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center z-10 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900">Prof. Miller</p>
                            <p className="text-xs font-semibold text-indigo-600 mt-0.5">History & Arts</p>
                          </div>
                          <p className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Today, 09:30 AM</p>
                        </div>
                        <p className="text-[.95rem] text-slate-700 leading-relaxed italic bg-slate-50/50 p-4 rounded-xl border-l-4 border-indigo-500">
                          "Excellent work on the historical analysis of the Renaissance. Your bibliography was exceptionally thorough."
                        </p>
                      </div>
                    </div>

                    {/* Feedback Item 2 */}
                    <div className="relative pl-12">
                      <div className="absolute -left-1 top-0 w-10 h-10 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center z-10 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900">Ms. Garcia</p>
                            <p className="text-xs font-semibold text-emerald-600 mt-0.5">Biology</p>
                          </div>
                          <p className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Yesterday</p>
                        </div>
                        <p className="text-[.95rem] text-slate-700 leading-relaxed italic bg-slate-50/50 p-4 rounded-xl border-l-4 border-emerald-500">
                          "Great improvement in the lab report formatting. Keep this level of detail for the finals."
                        </p>
                      </div>
                    </div>

                    {/* Feedback Item 3 */}
                    <div className="relative pl-12">
                      <div className="absolute -left-1 top-0 w-10 h-10 bg-amber-50 border-2 border-amber-200 text-amber-600 rounded-full flex items-center justify-center z-10 shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">star</span>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-amber-100 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-slate-900">Dr. Smith</p>
                            <p className="text-xs font-semibold text-amber-600 mt-0.5">Mathematics</p>
                          </div>
                          <p className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">Oct 12, 2023</p>
                        </div>
                        <p className="text-[.95rem] text-slate-700 leading-relaxed italic bg-slate-50/50 p-4 rounded-xl border-l-4 border-amber-500">
                          "Consistently participating in class discussions. Well done, Alex."
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>

      {/* FAB for quick messaging */}
      <button 
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-110 hover:shadow-indigo-500/40 transition-all active:scale-95 z-50 group"
        onClick={() => setActiveTab('chat')}
      >
        <span className="material-symbols-outlined text-[24px] group-hover:rotate-12 transition-transform">add_comment</span>
      </button>

    </div>
  );
}
