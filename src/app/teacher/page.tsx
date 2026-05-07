"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // New Course Form State
  const [isLiveClass, setIsLiveClass] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [courseModules, setCourseModules] = useState([
    { id: 'mod-1', title: 'Module 1: Getting Started', isExpanded: true, lessons: [{ id: 'les-1', title: 'Introduction' }] }
  ]);
  const [draggedLessonInfo, setDraggedLessonInfo] = useState<{ moduleId: string, lessonId: string } | null>(null);

  // Upload Lesson State
  const [uploadLessonTitle, setUploadLessonTitle] = useState("");
  const [uploadLessonDescription, setUploadLessonDescription] = useState("");
  const [uploadLessonFile, setUploadLessonFile] = useState<File | null>(null);
  const [uploadLessonThumbnail, setUploadLessonThumbnail] = useState<string | null>(null);
  const [uploadingState, setUploadingState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [uploadedLessonsList, setUploadedLessonsList] = useState<any[]>([]);

  // Course Materials State
  const [courseMaterials, setCourseMaterials] = useState([
    { id: 'mat-1', title: 'Syllabus_2024.pdf', description: 'Course syllabus and reading list for the semester', type: 'pdf', size: '2.4 MB', date: 'Updated 2h ago', moduleId: 'mod-1', fileUrl: 'dummy' },
    { id: 'mat-2', title: 'Introduction_Lecture.mp4', description: 'Recording of the first introductory session', type: 'video', size: '142 MB', date: 'Updated yesterday', moduleId: 'mod-1', fileUrl: 'dummy' },
    { id: 'mat-3', title: 'Research_Pack_Zip', description: 'Supplementary research materials and datasets', type: 'zip', size: '45 MB', date: 'Updated 3 days ago', moduleId: 'mod-1', fileUrl: 'dummy' }
  ]);
  const [materialSearchQuery, setMaterialSearchQuery] = useState("");
  const [materialFilterType, setMaterialFilterType] = useState("all");
  const [materialSortOrder, setMaterialSortOrder] = useState("latest");
  const [materialFilterModule, setMaterialFilterModule] = useState("all");

  const [previewMaterial, setPreviewMaterial] = useState<any | null>(null);

  const [isUploadMaterialOpen, setIsUploadMaterialOpen] = useState(false);
  const [uploadMatTitle, setUploadMatTitle] = useState("");
  const [uploadMatDescription, setUploadMatDescription] = useState("");
  const [uploadMatModule, setUploadMatModule] = useState("");
  const [uploadMatFile, setUploadMatFile] = useState<File | null>(null);
  const [isMatUploading, setIsMatUploading] = useState(false);
  const [uploadMatProgress, setUploadMatProgress] = useState(0);
  const [uploadMatSuccess, setUploadMatSuccess] = useState(false);
  const [uploadMatError, setUploadMatError] = useState("");

  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<any | null>(null);

  const [editMaterialTitle, setEditMaterialTitle] = useState("");
  const [editMaterialDescription, setEditMaterialDescription] = useState("");
  const [editMaterialFile, setEditMaterialFile] = useState<File | null>(null);
  const [editMaterialThumbnail, setEditMaterialThumbnail] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAndSortedMaterials = useMemo(() => {
    let result = courseMaterials;
    if (materialSearchQuery) {
      result = result.filter(m => m.title.toLowerCase().includes(materialSearchQuery.toLowerCase()));
    }
    if (materialFilterType !== "all") {
      result = result.filter(m => m.type === materialFilterType);
    }
    if (materialFilterModule !== "all") {
      result = result.filter(m => m.moduleId === materialFilterModule);
    }
    if (materialSortOrder === 'oldest') {
      return [...result].reverse();
    }
    return result;
  }, [courseMaterials, materialSearchQuery, materialFilterType, materialFilterModule, materialSortOrder]);

  const handleEditMaterialClick = (material: any) => {
    setEditingMaterial(material);
    setEditMaterialTitle(material.title);
    setEditMaterialDescription(material.description || "");
    setEditMaterialFile(null);
    setEditMaterialThumbnail(material.thumbnail || null);
  };

  const saveEditedMaterial = () => {
    setIsSavingEdit(true);
    setTimeout(() => {
      setCourseMaterials(courseMaterials.map(m => 
        m.id === editingMaterial.id ? { 
          ...m, 
          title: editMaterialTitle, 
          description: editMaterialDescription,
          thumbnail: editMaterialThumbnail,
          size: editMaterialFile ? (editMaterialFile.size / (1024 * 1024)).toFixed(1) + " MB" : m.size,
          date: 'Updated just now'
        } : m
      ));
      setIsSavingEdit(false);
      setEditingMaterial(null);
    }, 800);
  };

  const confirmDeleteMaterial = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setCourseMaterials(courseMaterials.filter(m => m.id !== materialToDelete.id));
      setIsDeleting(false);
      setMaterialToDelete(null);
    }, 800);
  };

  const handleEditMaterialThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditMaterialThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaterialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setUploadMatError("File exceeds 500MB limit.");
        return;
      }
      setUploadMatFile(file);
      setUploadMatError("");
    }
  };

  const handleMaterialDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setUploadMatError("File exceeds 500MB limit.");
        return;
      }
      setUploadMatFile(file);
      setUploadMatError("");
    }
  };

  const submitMaterialUpload = () => {
    if (!uploadMatTitle) {
      setUploadMatError("Material title is required.");
      return;
    }
    if (!uploadMatFile) {
      setUploadMatError("Please select a file to upload.");
      return;
    }
    setUploadMatError("");
    setIsMatUploading(true);
    setUploadMatProgress(0);

    const interval = setInterval(() => {
      setUploadMatProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadMatProgress(100);
      setUploadMatSuccess(true);
      
      const newType = uploadMatFile.type.includes('pdf') ? 'pdf' : 
                      uploadMatFile.type.includes('video') ? 'video' : 
                      uploadMatFile.name.endsWith('.zip') ? 'zip' : 
                      uploadMatFile.type.includes('presentation') ? 'ppt' : 'doc';

      setCourseMaterials([{
        id: `mat-${Date.now()}`,
        title: uploadMatTitle,
        description: uploadMatDescription,
        type: newType as any,
        size: (uploadMatFile.size / (1024 * 1024)).toFixed(1) + " MB",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        moduleId: uploadMatModule || '',
        fileUrl: 'dummy'
      }, ...courseMaterials]);
      
      setTimeout(() => {
        setIsMatUploading(false);
        setUploadMatProgress(0);
        setUploadMatSuccess(false);
        setIsUploadMaterialOpen(false);
        setUploadMatTitle("");
        setUploadMatDescription("");
        setUploadMatFile(null);
        setUploadMatModule("");
      }, 1500);
    }, 2000);
  };

  const handleLessonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setUploadErrorMessage("File exceeds 500MB limit.");
        setUploadingState("error");
        return;
      }
      setUploadLessonFile(file);
      setUploadingState("idle");
    }
  };

  const handleLessonThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadLessonThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLessonDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleLessonDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setUploadErrorMessage("File exceeds 500MB limit.");
        setUploadingState("error");
        return;
      }
      setUploadLessonFile(file);
      setUploadingState("idle");
    }
  };

  const submitLessonUpload = () => {
    if (!uploadLessonTitle) {
      setUploadErrorMessage("Lesson title is required.");
      setUploadingState("error");
      return;
    }
    if (!uploadLessonFile) {
      setUploadErrorMessage("Please upload a lesson file.");
      setUploadingState("error");
      return;
    }

    setUploadingState("uploading");
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setUploadingState("success");
      setUploadedLessonsList(prev => [{
        id: `upl-${Date.now()}`,
        title: uploadLessonTitle,
        description: uploadLessonDescription,
        filename: uploadLessonFile.name,
        size: (uploadLessonFile.size / (1024 * 1024)).toFixed(1) + " MB",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: uploadLessonFile.type.includes('video') ? 'video' : uploadLessonFile.type.includes('pdf') ? 'pdf' : 'doc'
      }, ...prev]);

      setUploadLessonTitle("");
      setUploadLessonDescription("");
      setUploadLessonFile(null);
      setUploadLessonThumbnail(null);

      setTimeout(() => {
        setUploadingState("idle");
        setUploadProgress(0);
      }, 3000);
    }, 2500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addModule = () => {
    setCourseModules([...courseModules, { id: `mod-${Date.now()}`, title: `New Module`, isExpanded: true, lessons: [] }]);
  };

  const addLesson = (moduleId: string) => {
    setCourseModules(courseModules.map(mod =>
      mod.id === moduleId
        ? { ...mod, lessons: [...mod.lessons, { id: `les-${Date.now()}`, title: 'New Lesson' }], isExpanded: true }
        : mod
    ));
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    setCourseModules(courseModules.map(mod => mod.id === moduleId ? { ...mod, title } : mod));
  };

  const updateLessonTitle = (moduleId: string, lessonId: string, title: string) => {
    setCourseModules(courseModules.map(mod =>
      mod.id === moduleId
        ? { ...mod, lessons: mod.lessons.map(les => les.id === lessonId ? { ...les, title } : les) }
        : mod
    ));
  };

  const removeModule = (moduleId: string) => {
    setCourseModules(courseModules.filter(mod => mod.id !== moduleId));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setCourseModules(courseModules.map(mod =>
      mod.id === moduleId ? { ...mod, lessons: mod.lessons.filter(les => les.id !== lessonId) } : mod
    ));
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setCourseModules(courseModules.map(mod => mod.id === moduleId ? { ...mod, isExpanded: !mod.isExpanded } : mod));
  };

  const handleDragStart = (e: React.DragEvent, moduleId: string, lessonId: string) => {
    setDraggedLessonInfo({ moduleId, lessonId });
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to prevent the dragged element from immediately snapping to the dragged image position visually
    setTimeout(() => {
      (e.target as HTMLElement).classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLessonInfo(null);
    (e.target as HTMLElement).classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetModuleId: string, targetLessonId: string | null) => {
    e.preventDefault();
    if (!draggedLessonInfo) return;

    const { moduleId: sourceModuleId, lessonId: sourceLessonId } = draggedLessonInfo;

    // Create deep copy
    let newModules = JSON.parse(JSON.stringify(courseModules));

    // Find source
    const sourceModuleIndex = newModules.findIndex((m: any) => m.id === sourceModuleId);
    const sourceModule = newModules[sourceModuleIndex];
    const lessonToMove = sourceModule.lessons.find((l: any) => l.id === sourceLessonId);

    // Remove from source
    sourceModule.lessons = sourceModule.lessons.filter((l: any) => l.id !== sourceLessonId);

    // Find target
    const targetModuleIndex = newModules.findIndex((m: any) => m.id === targetModuleId);
    const targetModule = newModules[targetModuleIndex];

    if (targetLessonId) {
      // Drop on specific lesson
      const targetLessonIndex = targetModule.lessons.findIndex((l: any) => l.id === targetLessonId);
      targetModule.lessons.splice(targetLessonIndex, 0, lessonToMove);
    } else {
      // Drop on empty module
      targetModule.lessons.push(lessonToMove);
    }

    setCourseModules(newModules);
  };

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
                  <button onClick={() => setActiveTab('new-course')} className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto justify-center">
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
                  {/* <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm flex items-center gap-4 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-rose-100/50 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-1">Revenue</p>
                      <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque']">$12.4k</h3>
                    </div>
                  </div> */}
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
                        <img alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-200 transition-all shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUta4-2rSjNLQv54bTrnBaHJlHYqBLCwluvy6Z-qkl2muGJjo5-X8J7rgxmlGxlOxVhHQpPOwZ8QZU53eDhssRtxqpkGoAGZNQdKd4RK9gAPh_NRBqujMIqqKc1Y27WuLkwKy5b7WAPnzbN6oSCzgea8HZtHQ43f1TdJQQF5srFfg02JXy-KqxxDFRUXNCzBBrTztv_viCaew6HWzTYxTQ5ULz3QQSWg9KChJ0rGyk2rwivadXFwW8llji83OV2jlAOjjcGAVNSmM" />
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
                        <img alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-amber-200 transition-all shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcwA27BIu8t0dk3RSo-2puJJ2zgtTzD38rprSs9BoEOsSlRSL3kGvyKO5aZZMKn1q3b9iUwYcRN-y6Bec3By2iGljlkpIu-8f8gVmN3HiiIhynJLlErYdboCAnGNydJy52ayUK2uR8lU72c2uU1dixaVqEJZ7wARZHikf0n5AKdCWdQ5tlMxdvyrFuyElNKsDUQjQp_LKmRwcsKBMRNb1lx-_7sMtkA4ErByyi_0ZW3EqSTTCzguM3Lq4PsJIA9EKFDyIkt_D8SCw" />
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
                        <img alt="Student" className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-emerald-200 transition-all shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATi5GzBnVwmc4Slm91afw20KBaB2zLMAzzvXy8WzU1sLPn3nCTz8J7ZegHggrD_0Dptx82NkXGIF8Up_Q9MstUc0B778cQdkTfrKI9VzMiwitqCAgc0rKifjv5-umVm1CLutzPjaxSQyZIu9ytFJU9-XoBfAi1PanUrUrLi3bqKnkzS63sNPVsls2cu7a1qD7AeqvCGnqrTlhMMRRs4Ga7LNSy5CHinFyUUyxk7wfPLJzCuksvKAb3JFPdEZsIqqC46AeMTtCjO1Q" />
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
              <section id="upload" className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm transition-shadow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 font-['Bricolage_Grotesque'] tracking-tight">Upload New Lesson</h3>

                  {uploadingState === 'success' && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 animate-in slide-in-from-top-2">
                      <span className="material-symbols-outlined">check_circle</span>
                      <p className="font-semibold text-sm">Lesson uploaded successfully!</p>
                    </div>
                  )}

                  {uploadingState === 'error' && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 animate-in slide-in-from-top-2">
                      <span className="material-symbols-outlined">error</span>
                      <p className="font-semibold text-sm">{uploadErrorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Lesson Title <span className="text-rose-500">*</span></label>
                        <input
                          type="text"
                          placeholder="e.g., Introduction to CSS Grid"
                          className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors"
                          value={uploadLessonTitle}
                          onChange={(e) => setUploadLessonTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Description <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                        <textarea
                          placeholder="Brief description of the lesson content..."
                          rows={4}
                          className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors resize-none"
                          value={uploadLessonDescription}
                          onChange={(e) => setUploadLessonDescription(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Thumbnail Image <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                        <div className="flex items-center gap-4">
                          {uploadLessonThumbnail ? (
                            <div className="relative">
                              <img src={uploadLessonThumbnail} alt="Thumbnail Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm" />
                              <button onClick={() => setUploadLessonThumbnail(null)} className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 rounded-full p-1 hover:bg-rose-200 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ) : (
                            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined text-2xl">image</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <label className="cursor-pointer bg-white border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors inline-block shadow-sm">
                              Upload Image
                              <input type="file" accept="image/*" onChange={handleLessonThumbnailUpload} className="hidden" />
                            </label>
                            <p className="text-xs text-slate-500 mt-1.5">Recommended size: 1280x720px</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-sm font-bold text-slate-700 ml-1">Lesson File <span className="text-rose-500">*</span></label>
                      <div
                        className={`flex-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group ${uploadLessonFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300/80 hover:border-indigo-500 hover:bg-indigo-50/50 bg-slate-50/30 cursor-pointer'}`}
                        onDragOver={handleLessonDragOver}
                        onDrop={handleLessonDropFile}
                      >
                        {!uploadLessonFile && <input type="file" onChange={handleLessonFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />}

                        {uploadLessonFile ? (
                          <div className="flex flex-col items-center w-full max-w-xs z-10">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                              <span className="material-symbols-outlined text-3xl">task</span>
                            </div>
                            <p className="font-bold text-slate-800 truncate w-full text-center">{uploadLessonFile.name}</p>
                            <p className="text-slate-500 text-sm mt-1">{(uploadLessonFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            <button onClick={() => setUploadLessonFile(null)} className="mt-4 text-rose-600 font-bold border border-rose-200 bg-white px-4 py-1.5 rounded-lg text-sm hover:bg-rose-50 transition-colors shadow-sm">
                              Remove File
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="w-16 h-16 bg-white text-slate-400 shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:text-indigo-600 group-hover:border-indigo-200 group-hover:bg-indigo-50/80 group-hover:scale-110 transition-all duration-300 z-10">
                              <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <p className="font-bold text-lg text-slate-800 z-10">Drag &amp; drop file here</p>
                            <p className="text-slate-500 text-sm mt-1.5 z-10">Support for MP4, PDF, and DOCX (Max 500MB)</p>
                            <div className="mt-6 text-indigo-600 font-bold border-2 border-indigo-600 px-6 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm z-10 pointer-events-none">
                              Browse Files
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {uploadingState === 'uploading' && (
                    <div className="mt-8 space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-slate-700">
                        <span>Uploading...</span>
                        <span className="text-indigo-600">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={submitLessonUpload}
                      disabled={uploadingState === 'uploading'}
                      className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${uploadingState === 'uploading' ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'}`}
                    >
                      {uploadingState === 'uploading' ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">upload</span>
                          Upload Lesson
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Uploaded Lessons List */}
                {uploadedLessonsList.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 font-['Bricolage_Grotesque'] tracking-tight">Recently Uploaded</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {uploadedLessonsList.map(lesson => (
                        <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-slate-200/60 rounded-xl hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-300 group">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all shadow-sm ${lesson.type === 'video' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100' :
                            lesson.type === 'pdf' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' :
                              'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                            }`}>
                            <span className="material-symbols-outlined">
                              {lesson.type === 'video' ? 'videocam' : lesson.type === 'pdf' ? 'description' : 'article'}
                            </span>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-bold text-slate-800 truncate">{lesson.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">{lesson.filename} • {lesson.size} • {lesson.date}</p>
                          </div>
                          <div className="flex gap-2 self-start sm:self-auto">
                            <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors">
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Tab: Course Materials */}
            {activeTab === 'materials' && (
              <section id="materials" className="animate-in fade-in duration-500">
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden w-full max-w-5xl hover:shadow-lg transition-shadow relative">
                  
                  {/* Header and Controls */}
                  <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">Course Materials</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage and organize your resources</p>
                      </div>
                      <button 
                        onClick={() => setIsUploadMaterialOpen(!isUploadMaterialOpen)}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">{isUploadMaterialOpen ? 'close' : 'add'}</span>
                        {isUploadMaterialOpen ? 'Cancel Upload' : 'Upload Material'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">search</span>
                        <input 
                          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                          placeholder="Search files..." 
                          type="text" 
                          value={materialSearchQuery}
                          onChange={(e) => setMaterialSearchQuery(e.target.value)}
                        />
                      </div>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600 cursor-pointer"
                        value={materialFilterType}
                        onChange={(e) => setMaterialFilterType(e.target.value)}
                      >
                        <option value="all">All File Types</option>
                        <option value="pdf">PDF Documents</option>
                        <option value="video">Video Files</option>
                        <option value="doc">Word Docs</option>
                        <option value="ppt">Presentations</option>
                        <option value="zip">ZIP Archives</option>
                      </select>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600 cursor-pointer"
                        value={materialFilterModule}
                        onChange={(e) => setMaterialFilterModule(e.target.value)}
                      >
                        <option value="all">All Modules</option>
                        {courseModules.map(mod => (
                          <option key={mod.id} value={mod.id}>{mod.title}</option>
                        ))}
                      </select>
                      <select 
                        className="w-full px-3 py-2 bg-white border border-slate-200/80 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600 cursor-pointer"
                        value={materialSortOrder}
                        onChange={(e) => setMaterialSortOrder(e.target.value)}
                      >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload Material Section */}
                  {isUploadMaterialOpen && (
                    <div className="mb-8 p-6 bg-slate-50 border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">Upload New Material</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Title <span className="text-rose-500">*</span></label>
                            <input 
                              type="text" 
                              placeholder="e.g., Week 1 Reading Materials"
                              className="w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3 outline-none bg-white transition-colors text-sm"
                              value={uploadMatTitle}
                              onChange={(e) => setUploadMatTitle(e.target.value)}
                              disabled={isMatUploading}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                            <textarea 
                              placeholder="Optional description of the material..."
                              className="w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3 outline-none bg-white transition-colors resize-none text-sm"
                              rows={2}
                              value={uploadMatDescription}
                              onChange={(e) => setUploadMatDescription(e.target.value)}
                              disabled={isMatUploading}
                            ></textarea>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Assign to Module</label>
                            <select 
                              className="w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3 outline-none bg-white transition-colors text-sm text-slate-600 cursor-pointer"
                              value={uploadMatModule}
                              onChange={(e) => setUploadMatModule(e.target.value)}
                              disabled={isMatUploading}
                            >
                              <option value="">No Module (Unassigned)</option>
                              {courseModules.map(mod => (
                                <option key={mod.id} value={mod.id}>{mod.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 flex flex-col">
                          <label className="text-sm font-bold text-slate-700 ml-1">File <span className="text-rose-500">*</span></label>
                          <div 
                            className={`flex-1 border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group ${uploadMatFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 bg-white cursor-pointer'}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleMaterialDrop}
                          >
                            {!uploadMatFile && <input type="file" onChange={handleMaterialFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isMatUploading} />}
                            
                            {uploadMatFile ? (
                              <div className="flex flex-col items-center w-full z-10">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                                </div>
                                <p className="font-bold text-slate-800 text-sm truncate w-full px-2">{uploadMatFile.name}</p>
                                <p className="text-slate-500 text-xs mt-0.5">{(uploadMatFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                {!isMatUploading && (
                                  <button onClick={() => setUploadMatFile(null)} className="mt-3 text-rose-600 font-bold border border-rose-200 bg-white px-3 py-1 rounded-lg text-xs hover:bg-rose-50 transition-colors">
                                    Remove
                                  </button>
                                )}
                              </div>
                            ) : (
                              <>
                                <div className="w-12 h-12 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl flex items-center justify-center mb-2 group-hover:text-indigo-600 group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-all z-10">
                                  <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                </div>
                                <p className="font-bold text-slate-700 text-sm z-10">Click or drag file</p>
                                <p className="text-slate-500 text-[10px] mt-1 z-10 max-w-[120px]">PDF, DOC, PPT, MP4, ZIP up to 500MB</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {uploadMatError && (
                        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm font-medium animate-in fade-in">
                          <span className="material-symbols-outlined text-[18px]">error</span>
                          {uploadMatError}
                        </div>
                      )}
                      
                      {isMatUploading && (
                        <div className="mt-6 space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Uploading & Processing...</span>
                            <span className="text-indigo-600">{uploadMatProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-200" style={{ width: `${uploadMatProgress}%` }}></div>
                          </div>
                        </div>
                      )}

                      {uploadMatSuccess && (
                        <div className="mt-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700 text-sm font-medium animate-in slide-in-from-bottom-2">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Material uploaded successfully!
                        </div>
                      )}
                      
                      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                        <button 
                          onClick={submitMaterialUpload}
                          disabled={isMatUploading || uploadMatSuccess}
                          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          {isMatUploading ? (
                            <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Uploading...</>
                          ) : (
                            <><span className="material-symbols-outlined text-[18px]">upload</span> Upload File</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Materials Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                    {filteredAndSortedMaterials.map(material => {
                      const iconMap: Record<string, string> = {
                        pdf: 'description',
                        video: 'videocam',
                        zip: 'folder_zip',
                        ppt: 'slideshow',
                        doc: 'article',
                        other: 'insert_drive_file'
                      };
                      const colorMap: Record<string, string> = {
                        pdf: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100 border-rose-100',
                        video: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 border-indigo-100',
                        zip: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 border-emerald-100',
                        ppt: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100 border-amber-100',
                        doc: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 border-blue-100',
                        other: 'bg-slate-50 text-slate-600 group-hover:bg-slate-100 border-slate-200'
                      };
                      const assignedModule = courseModules.find(m => m.id === material.moduleId);

                      return (
                        <div key={material.id} className="flex flex-col p-4 border border-slate-200/80 rounded-xl hover:bg-slate-50 hover:shadow-md hover:border-indigo-200 transition-all duration-300 group relative">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all border ${colorMap[material.type] || colorMap.other}`}>
                              <span className="material-symbols-outlined">{iconMap[material.type] || iconMap.other}</span>
                            </div>
                            <div className="flex-1 overflow-hidden pr-2">
                              <h4 className="text-sm font-bold text-slate-800 truncate" title={material.title}>{material.title}</h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[2rem]">{material.description || "No description provided."}</p>
                            </div>
                            
                            <div className="flex flex-col gap-1 sm:flex-row opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-lg p-0.5 shadow-sm border border-slate-100">
                              <button onClick={(e) => { e.stopPropagation(); setPreviewMaterial(material); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Preview"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                              <button onClick={(e) => { e.stopPropagation(); handleEditMaterialClick(material); }} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                              <button onClick={(e) => { e.stopPropagation(); setMaterialToDelete(material); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">{material.type}</span>
                              <span>{material.size}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              {assignedModule && <span className="text-indigo-500 truncate max-w-[120px]" title={assignedModule.title}>{assignedModule.title}</span>}
                              <span>{material.date}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {filteredAndSortedMaterials.length === 0 && (
                      <div className="md:col-span-2 text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">search_off</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-1">No materials found</h4>
                        <p className="text-sm text-slate-500">Try adjusting your search or filters, or upload a new material.</p>
                        <button onClick={() => setIsUploadMaterialOpen(true)} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Upload Material</button>
                      </div>
                    )}
                  </div>

                  {/* Edit Modal */}
                  {editingMaterial && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !isSavingEdit && setEditingMaterial(null)}></div>
                      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                          <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque']">Edit Material</h3>
                          <button onClick={() => !isSavingEdit && setEditingMaterial(null)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors disabled:opacity-50" disabled={isSavingEdit}>
                            <span className="material-symbols-outlined text-[20px]">close</span>
                          </button>
                        </div>
                        <div className="p-6 space-y-5">
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Title</label>
                            <input 
                              type="text" 
                              className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3 outline-none bg-slate-50/50 hover:bg-white transition-colors text-sm"
                              value={editMaterialTitle}
                              onChange={(e) => setEditMaterialTitle(e.target.value)}
                              disabled={isSavingEdit}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 ml-1">Description <span className="text-xs font-normal text-slate-400">(Optional)</span></label>
                            <textarea 
                              className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3 outline-none bg-slate-50/50 hover:bg-white transition-colors resize-none text-sm"
                              rows={3}
                              value={editMaterialDescription}
                              onChange={(e) => setEditMaterialDescription(e.target.value)}
                              disabled={isSavingEdit}
                            ></textarea>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-sm font-bold text-slate-700 ml-1">Update File</label>
                              <label className={`block border border-slate-200 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors ${isSavingEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                                <span className="material-symbols-outlined text-slate-400 mb-1">upload_file</span>
                                <p className="text-xs font-bold text-indigo-600">Choose file</p>
                                <p className="text-[10px] text-slate-500 mt-1 truncate">{editMaterialFile ? editMaterialFile.name : 'No file chosen'}</p>
                                <input type="file" className="hidden" onChange={(e) => setEditMaterialFile(e.target.files?.[0] || null)} disabled={isSavingEdit} />
                              </label>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-bold text-slate-700 ml-1">Thumbnail Image</label>
                              <div className="flex flex-col gap-2">
                                {editMaterialThumbnail ? (
                                  <div className="relative h-16 w-full rounded-xl overflow-hidden border border-slate-200">
                                    <img src={editMaterialThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <button onClick={() => setEditMaterialThumbnail(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70 transition-colors" disabled={isSavingEdit}>
                                      <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                  </div>
                                ) : (
                                  <label className={`block border border-slate-200 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors ${isSavingEdit ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <span className="material-symbols-outlined text-slate-400 mb-1">image</span>
                                    <p className="text-xs font-bold text-indigo-600">Upload image</p>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleEditMaterialThumbnailUpload} disabled={isSavingEdit} />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                          <button onClick={() => setEditingMaterial(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors disabled:opacity-50" disabled={isSavingEdit}>Cancel</button>
                          <button onClick={saveEditedMaterial} disabled={isSavingEdit || !editMaterialTitle} className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2">
                            {isSavingEdit ? (
                              <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Saving...</>
                            ) : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {materialToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => !isDeleting && setMaterialToDelete(null)}></div>
                      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Material?</h3>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to delete "<span className="font-semibold text-slate-700">{materialToDelete.title}</span>"? This action cannot be undone.</p>
                        <div className="flex gap-3 w-full">
                          <button onClick={() => setMaterialToDelete(null)} className="flex-1 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-xl transition-colors disabled:opacity-50" disabled={isDeleting}>Cancel</button>
                          <button onClick={confirmDeleteMaterial} disabled={isDeleting} className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-md shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2">
                            {isDeleting ? (
                              <><span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Deleting...</>
                            ) : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview Modal */}
                  {previewMaterial && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
                      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setPreviewMaterial(null)}></div>
                      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <span className="material-symbols-outlined">
                                {previewMaterial.type === 'video' ? 'videocam' : previewMaterial.type === 'pdf' ? 'description' : 'insert_drive_file'}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{previewMaterial.title}</h3>
                              <p className="text-xs text-slate-500">{previewMaterial.size} • {previewMaterial.type.toUpperCase()}</p>
                            </div>
                          </div>
                          <button onClick={() => setPreviewMaterial(null)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-[24px]">close</span>
                          </button>
                        </div>
                        <div className="flex-1 overflow-hidden bg-slate-100 relative min-h-[400px] flex items-center justify-center p-6">
                          {previewMaterial.type === 'video' ? (
                            <div className="w-full max-w-2xl bg-black rounded-xl aspect-video flex items-center justify-center shadow-lg border border-slate-800">
                              <span className="material-symbols-outlined text-white text-6xl opacity-50">play_circle</span>
                            </div>
                          ) : previewMaterial.type === 'pdf' ? (
                            <div className="w-full max-w-2xl h-full bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col items-center justify-center">
                              <span className="material-symbols-outlined text-rose-300 text-6xl mb-4">picture_as_pdf</span>
                              <p className="text-slate-500 font-medium">PDF Preview (Mock)</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">inventory_2</span>
                              <h4 className="text-lg font-bold text-slate-700 mb-2">No preview available</h4>
                              <p className="text-sm text-slate-500">This file type cannot be previewed in the browser.</p>
                              <button className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-colors">Download File</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                        <input className="w-full pl-10 pr-4 py-2 border border-slate-200/80 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white/80 transition-all" placeholder="Search students..." type="text" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="p-4 flex items-center gap-3 bg-indigo-50/80 border-r-4 border-indigo-500 cursor-pointer hover:bg-indigo-50 transition-colors">
                        <img alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5YtzuGGhQtoMSYb1z4CZnqzzcbjq48xkrOrRAS800ySrm9ocI5a1BzLYwxIk0eZnIcgUfFelkA_eQMCMIc7W08pM-TNUrEQ6mXISeFxVR6YfFBWO1eJoxwM9CgWegDXdxbPoVGlQZxdbmq74kNvWgTuV2Ms4t1n07gHVb4LG_ao3lxXxeamT2cw4fEHaXZ-GRkv6nwiprw6xMch0nuLsJBE30XbcNwDgFCq9ntroDL6ffKWyYToxeDEiPLoO48Pjk38Y0tPqGFSk" />
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className="text-sm font-bold text-slate-900 truncate">Alice Lin</h4>
                            <span className="text-[10px] text-indigo-600 font-bold">2m ago</span>
                          </div>
                          <p className="text-xs text-indigo-600 font-medium truncate">Professor, I had a question about the assignment deadline...</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-center gap-3 hover:bg-white cursor-pointer transition-colors border-b border-slate-100">
                        <img alt="John" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8gYSxsWIXMDJgBjagtAXPCLznBLwOX3tX91ZKO1QApfFfzvMpXemInFjapK_SL975FXP5atiFYnV9MrfDspQpMEP3S0p8hsB_v3RUiQBcWjIWJR1Q1FvCajAygB3f3k1g870DiNbZW8WXYOnx8Uvlf2Q8Nvwye97E9lHwRnwGMBZ-RmRfKbclN-RyH1HupK7BprpxsdP6g9Z3ITKw4EIF_HRwaojxOktYUbH0FcuJKyQ_M0kZUEhKC0hNYdgn1zpIDF6koegTO8" />
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
                          <img alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk7Wsjskynl2H5KXiECGBzgWR0Hvt0bSNn7-cg5jZS-lQ0Er7esj0N3SyiGOTxgCx92nEYZv8IT8Fj86UZ6VPrEcvcABG8HENglXyWqnEclvYp_Xh_Z449VX2aygqq4jg1mO-nYvCx3fl2-xuEX_1JAW6HfWjBPpVELirlTSEq-2bX4ICAQnHQVf67hRONetlckhbPzDpoKM9kULnCc--Ahe9IW68YL8tqaVrfFRULnVFCWgiiK-3c025F8JbTI1JU39_WgzQUA_M" />
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
                        <input className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[.95rem] py-1" placeholder="Type a message..." type="text" />
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
                              <img alt="Alice" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mHyOpfSCUbiESMFCtXc425X4i_scXPSJ355x5z2tvsXovxMF4YcauUy9SPqHOhBZMVzunimUCkt808Po8jmGgPhKLI3ls39stBnquuE7NPpSItbEWhSqFuJAAxCG9oF-xwoZkfS2oFGkVIV8TmanlvL8KvUUwo0BpAgW0X4NWCCS713yUgurEW0qIjQC-02tAu1H0LyB8iDQvisNYRjeyXlJ51_cVO2s5hmGwHDSGbtJQbc5tr_ZEkYSeaPhw3KbygvS3VNKB1U" />
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
                              <img alt="John" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmPoMtVfIX5bjeysfE5jkYUNIIW75DMIK5Iomw2TOqwAKMsjNMVnAoL9HrEjPvWSvgxLmnZsBUQFm9FYfe6MpexIcSgwv9Ny1D46trNo71N_fRZP1cDVK1iFoeCvkL9JfKTtQd2yalMe_jLtSELGcfH6YD2ElEhlWh-U8zK1hnzpV0HeRKHTQ-PcVKiidLKbQCjNKVfylWp69brSrGaEmo20TuUuZvb7rS4jpaO5_N1kJbbe8PLg5dgbY9ZlzKN9wuR9zHn_gayFc" />
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
                              <img alt="Mark" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDcgi-CLEqUU8zIHTUR56qJbJoiJAZY8qrON2bZktQHFCl-IFRykhaMeyKz7MGz8KOeHAFu3ItwGrVG1FbSovsUICpIhke9K8wrwXQneuNanWHIqWGJYtZKqXQPAH2xHIHupzl4oSi7hgzB7CeE0jM21JjNubI6Ldp2-DEErJHEFf5ByfmLIsMtkuqMAWyhwHYq4XThBV7i-doIZmIJWfH31bbwDkDTxUduW5mB-u4O1x10rpZ7fkV0f-oz3uiZNCoVQ92ia2HCHI" />
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
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRoIrPJRN_BrWX01RR8f0AidZH8aBVFIbIfr9_PGC963olWCk0-KoGdC5jetNAN_dbBUWheyA615feqT02UyK-L-rw8bO9gZfTpU0ToSOaOrT1dS8JifmmzWea4HtSIv5kFsc8AWakRrSeKz2fbD2Fu0w6sgKIWs8HBux0lwkHMh6EsVTI0oY2gM4w7cCd0tBeKJ4WJYHOmuSW6To4zEaPvDSnyMFIO6VUhTyq2hI8LUKT6-Az2vrawQOh6dlvzGA8nn_0XH1SQ-c" />
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
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAFTxG276x_Z4LVfft4tt1hBs7bup9oQmpfVV2XgMnl7dXKG5teUkOp1eTTIC_FRxEWUBOI21u5Yxlvz83VaDGyuSn0bGIRJMdLZ-bo8366x0UwzF0yk6HOePwihU1EVgPocRR-a5N2F9D4lL6l6cjQwbpy5-S_4GTtRraaG6nSDEfqOf6PkoSxZWZg3RqkaVbETOuludXT4IVGx2tTVVF-ZIvLAFeJCXvCj5fWKFU-iFJ1tXaJBrP_v99VUrEHsbl4LGLpMFvmVo" />
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
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa0y1_Zx64Vgpu1sMu9xw0D21fYr7vU5hcCkBQXpcHFLdtifXectSd8jDSEChWVsLzVjG_BVJREON9Ixmx_k58jWMqote5seR0GvxoGM3QEHEQ8PdjfWle-sdVCsbIsLCcZ-aFATKOjBdSlBYPNf9n8u2RbYQBk4WOSMlUf-PbMDt-QHfh9XN9ZF0mrE2QbOjXGg6bcIzn72uabgWpnVmv9L29dAqXlx5iYvad-RX_EfICXDPRssCHxZKUwoOU_YAT_a-2R0hFUe0" />
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

            {/* Tab: New Course Creation */}
            {activeTab === 'new-course' && (
              <section id="new-course" className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-6 pb-24">
                <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setActiveTab('dashboard')} className="p-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 rounded-full transition-colors shadow-sm">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque'] tracking-tight">Create New Course</h2>
                    <p className="text-sm text-slate-500">Set up the foundation, curriculum, and schedule for your new course.</p>
                  </div>
                </div>

                {/* Card 1: Basic Course Information */}
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">info</span></div>
                    Basic Information
                  </h3>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Course Title</label>
                        <input type="text" placeholder="e.g., Introduction to Advanced UI Design" className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Subject & Category</label>
                        <select className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer text-slate-700">
                          <option value="">Select a category...</option>
                          <option>Design & Art</option>
                          <option>Computer Science</option>
                          <option>Mathematics</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Target Class / Grade</label>
                        <select className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer text-slate-700">
                          <option value="">Select a grade level...</option>
                          <option>Beginner / Freshman</option>
                          <option>Intermediate / Sophomore</option>
                          <option>Advanced / Senior</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Short Description</label>
                      <textarea placeholder="A brief summary of the course (max 150 characters)..." maxLength={150} rows={2} className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors resize-none"></textarea>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1 flex justify-between">
                        <span>Detailed Syllabus / Description</span>
                        <span className="text-xs font-normal text-slate-400">Optional</span>
                      </label>
                      <textarea placeholder="Provide a comprehensive breakdown of what students will learn..." rows={4} className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors resize-y"></textarea>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Course Thumbnail</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 hover:border-indigo-400 transition-all cursor-pointer relative overflow-hidden bg-slate-50/50">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        {thumbnailPreview ? (
                          <div className="w-full flex flex-col items-center">
                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-32 object-cover rounded-xl border border-slate-200 shadow-sm mb-3" />
                            <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Change Image</p>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-white text-slate-400 shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-3">
                              <span className="material-symbols-outlined text-2xl">image</span>
                            </div>
                            <p className="font-semibold text-sm text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Course Structure */}
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">view_list</span></div>
                      Course Structure
                    </h3>
                    <button onClick={addModule} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">add</span> Add Module
                    </button>
                  </div>

                  <div className="space-y-4">
                    {courseModules.map((module, mIndex) => (
                      <div key={module.id} className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <button onClick={() => toggleModuleExpansion(module.id)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                              <span className="material-symbols-outlined">{module.isExpanded ? 'expand_more' : 'chevron_right'}</span>
                            </button>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                              className="font-bold text-slate-800 bg-transparent border-none focus:ring-0 p-0 text-base w-full max-w-sm focus:outline-none placeholder-slate-400"
                              placeholder="Module Title..."
                            />
                          </div>
                          <button onClick={() => removeModule(module.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>

                        {module.isExpanded && (
                          <div
                            className="p-4 pt-2 space-y-2 border-t border-slate-100 min-h-[60px]"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, module.id, null)}
                          >
                            {module.lessons.map((lesson, lIndex) => (
                              <div
                                key={lesson.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, module.id, lesson.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={(e) => { e.stopPropagation(); handleDrop(e, module.id, lesson.id); }}
                                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm group hover:border-indigo-200 transition-all cursor-move"
                              >
                                <span className="material-symbols-outlined text-slate-300 cursor-grab active:cursor-grabbing">drag_indicator</span>
                                <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">{mIndex + 1}.{lIndex + 1}</div>
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLessonTitle(module.id, lesson.id, e.target.value)}
                                  className="flex-1 text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 p-0 focus:outline-none placeholder-slate-400"
                                  placeholder="Lesson Title..."
                                />
                                <button onClick={() => removeLesson(module.id, lesson.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md hover:bg-rose-50">
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                              </div>
                            ))}
                            <button onClick={() => addLesson(module.id)} className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-lg text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-1 mt-2">
                              <span className="material-symbols-outlined text-[16px]">add</span> Add Lesson
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {courseModules.length === 0 && (
                      <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p>No modules added yet. Start by adding a module!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 3: Scheduling */}
                <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200/50 shadow-sm transition-shadow">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">calendar_month</span></div>
                    Scheduling Options
                  </h3>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">Start Date</label>
                        <input type="date" className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors text-slate-700 cursor-text" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-700 ml-1">End Date <span className="text-xs font-normal text-slate-400 ml-1">(Optional)</span></label>
                        <input type="date" className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-slate-50/50 hover:bg-white transition-colors text-slate-700 cursor-text" />
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800">Live Class Schedule</h4>
                          <p className="text-sm text-slate-500 mt-0.5">Will this course include synchronous live sessions?</p>
                        </div>
                        <button
                          onClick={() => setIsLiveClass(!isLiveClass)}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLiveClass ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                          <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isLiveClass ? 'translate-x-6' : 'translate-x-0'}`}></span>
                        </button>
                      </div>

                      {/* Dynamic Live Class Fields */}
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden transition-all duration-500 ease-in-out ${isLiveClass ? 'max-h-[500px] opacity-100 mt-5 pt-5 border-t border-slate-200' : 'max-h-0 opacity-0 mt-0 pt-0'}`}>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Class Time</label>
                          <input type="time" className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-white hover:bg-slate-50 transition-colors text-slate-700" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Automated Reminders</label>
                          <select className="w-full border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-3.5 outline-none bg-white hover:bg-slate-50 transition-colors text-slate-700">
                            <option>1 Hour Before</option>
                            <option>24 Hours Before</option>
                            <option>15 Minutes Before</option>
                            <option>No Reminders</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 right-0 md:left-[280px] bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40 p-4 transition-all">
                  <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
                    <button onClick={() => setActiveTab('dashboard')} className="w-full sm:w-auto px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                      Cancel
                    </button>
                    <button className="w-full sm:w-auto px-6 py-2.5 border-2 border-slate-200/80 text-slate-700 font-bold hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                      Save Draft
                    </button>
                    <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      Publish Course
                    </button>
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
