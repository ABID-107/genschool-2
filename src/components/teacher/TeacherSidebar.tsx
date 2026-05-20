interface TeacherSidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onCloseSidebar: () => void;
  onSignOut: () => void;
}

export function TeacherSidebar({ isOpen, activeTab, onTabChange, onCloseSidebar, onSignOut }: TeacherSidebarProps) {
  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'attendance', icon: 'check_circle', label: 'Attendance' },
    { id: 'lessons', icon: 'auto_stories', label: 'Lessons' },
    { id: 'materials', icon: 'folder_open', label: 'Materials' },
    { id: 'assignments', icon: 'assignment', label: 'Assignments' },
    { id: 'schedule', icon: 'calendar_month', label: 'Schedule' },
    { id: 'chat', icon: 'chat', label: 'Chat' },
    { id: 'payments', icon: 'payments', label: 'Payments' },
    { id: 'performance', icon: 'trending_up', label: 'Performance' },
  ];

  return (
    <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[280px] glass-sidebar flex flex-col gap-1 p-4 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center justify-between px-3 py-4 mb-2 md:mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-bricolage">Teacher Portal</h2>
          <p className="text-xs text-slate-500">Academic Management</p>
        </div>
        <button
          className="md:hidden p-2 -mr-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
          onClick={onCloseSidebar}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <nav className="flex flex-col gap-1.5">
        {navItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => { onTabChange(tab.id); onCloseSidebar(); }}
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
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <button 
          onClick={onSignOut}
          className="flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 font-semibold text-sm group mx-2 mb-2"
        >
          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

