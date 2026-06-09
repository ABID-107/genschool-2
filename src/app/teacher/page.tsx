"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { TeacherTopNav } from "@/components/teacher/TeacherTopNav";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { LessonUpload } from "@/components/teacher/LessonUpload";
import { Attendance } from "@/components/teacher/Attendance";
import { Assignments } from "@/components/teacher/Assignments";
import { DashboardOverview } from "@/components/teacher/dashboard/DashboardOverview";
import { storage } from "@/lib/store";
import { Assignment, Submission, CalendarEvent } from "@/lib/types";
import Calendar from "@/components/Calendar";

export default function TeacherDashboard() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin h-8 w-8 text-[#1a56e8] border-4 border-current border-t-transparent rounded-full"></div>
      </div>
    }>
      <TeacherDashboardContent />
    </Suspense>
  );
}

function TeacherDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // New Course Form State
  const [isLiveClass, setIsLiveClass] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [courseModules, setCourseModules] = useState([
    { id: 'mod-1', title: 'Module 1: Getting Started', isExpanded: true, lessons: [{ id: 'les-1', title: 'Introduction' }] }
  ]);
  const [draggedLessonInfo, setDraggedLessonInfo] = useState<{ moduleId: string, lessonId: string } | null>(null);

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

  // ── Assignment System State ──────────────────────────────────────
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Load data from storage on mount
  useEffect(() => {
    setAssignments(storage.getAssignments());
    setEvents(storage.getEvents());
    // In a real app, submissions would be fetched per assignment
    // For this mock, we'll initialize some if they don't exist
    const savedAssignments = storage.getAssignments();
    if (savedAssignments.length > 0) {
      setAssignments(savedAssignments);
    }
  }, []);

  // Assignment UI state
  const [assignmentView, setAssignmentView] = useState<'list' | 'create' | 'edit' | 'submissions'>('list');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  // Create/Edit form state
  const [aFormTitle, setAFormTitle] = useState('');
  const [aFormSubject, setAFormSubject] = useState('Visual Communication');
  const [aFormClass, setAFormClass] = useState('Sophomore (A)');
  const [aFormType, setAFormType] = useState('Project Submission');
  const [aFormInstructions, setAFormInstructions] = useState('');
  const [aFormDueDate, setAFormDueDate] = useState('');
  const [aFormDueTime, setAFormDueTime] = useState('23:59');
  const [aFormMarks, setAFormMarks] = useState(100);
  const [aFormError, setAFormError] = useState('');
  const [aFormSaving, setAFormSaving] = useState(false);

  // Grading state
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradeSaving, setGradeSaving] = useState(false);

  // Delete assignment confirmation
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [isDeletingAssignment, setIsDeletingAssignment] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openCreateAssignment = () => {
    setAFormTitle(''); setAFormSubject('Visual Communication'); setAFormClass('Sophomore (A)');
    setAFormType('Project Submission'); setAFormInstructions(''); setAFormDueDate('');
    setAFormDueTime('23:59'); setAFormMarks(100); setAFormError('');
    setAssignmentView('create');
  };

  const openEditAssignment = (asgn: Assignment) => {
    setAFormTitle(asgn.title); setAFormSubject(asgn.subject); setAFormClass(asgn.classGroup || 'Sophomore (A)');
    setAFormType(asgn.type); setAFormInstructions(asgn.instructions); setAFormDueDate(asgn.dueDate);
    setAFormDueTime(asgn.dueTime); setAFormMarks(asgn.totalMarks); setAFormError('');
    setSelectedAssignment(asgn); setAssignmentView('edit');
  };

  const saveAssignment = (publish: boolean) => {
    if (!aFormTitle.trim()) { setAFormError('Assignment title is required.'); return; }
    if (!aFormDueDate) { setAFormError('Due date is required.'); return; }
    if (!aFormInstructions.trim()) { setAFormError('Instructions are required.'); return; }
    setAFormSaving(true); setAFormError('');
    setTimeout(() => {
      let updatedAssignments: Assignment[];
      if (assignmentView === 'edit' && selectedAssignment) {
        updatedAssignments = assignments.map(a => a.id === selectedAssignment.id
          ? { ...a, title: aFormTitle, subject: aFormSubject, classGroup: aFormClass, type: aFormType, instructions: aFormInstructions, dueDate: aFormDueDate, dueTime: aFormDueTime, totalMarks: aFormMarks, status: publish ? 'published' : 'draft' }
          : a);
        showToast('Assignment updated successfully!');
      } else {
        const newAsgn: Assignment = { 
          id: `asgn-${Date.now()}`, 
          title: aFormTitle, 
          subject: aFormSubject, 
          teacher: 'Dr. Sarah Jenkins', 
          classGroup: aFormClass,
          type: aFormType, 
          instructions: aFormInstructions, 
          dueDate: aFormDueDate, 
          dueTime: aFormDueTime, 
          totalMarks: aFormMarks, 
          status: publish ? 'published' : 'draft' 
        };
        updatedAssignments = [newAsgn, ...assignments];
        
        // Also add to calendar if published
        if (publish) {
          const newEvent: CalendarEvent = {
            id: `evt-asgn-${Date.now()}`,
            title: `Deadline: ${aFormTitle}`,
            type: 'homework',
            start: `${aFormDueDate}T${aFormDueTime}`,
            end: `${aFormDueDate}T${aFormDueTime}`,
            subject: aFormSubject,
            description: `Submission deadline for ${aFormTitle}`
          };
          const updatedEvents = [newEvent, ...events];
          setEvents(updatedEvents);
          storage.saveEvents(updatedEvents);
        }
        
        showToast(publish ? 'Assignment published successfully!' : 'Assignment saved as draft!');
      }
      setAssignments(updatedAssignments);
      storage.saveAssignments(updatedAssignments);
      setAFormSaving(false); setAssignmentView('list'); setSelectedAssignment(null);
    }, 900);
  };

  const deleteAssignment = () => {
    if (!assignmentToDelete) return;
    setIsDeletingAssignment(true);
    setTimeout(() => {
      const updatedAssignments = assignments.filter(a => a.id !== assignmentToDelete.id);
      setAssignments(updatedAssignments);
      storage.saveAssignments(updatedAssignments);
      
      setSubmissions(prev => prev.filter(s => s.assignmentId !== assignmentToDelete.id));
      setIsDeletingAssignment(false); setAssignmentToDelete(null);
      showToast('Assignment deleted.');
    }, 700);
  };

  const openSubmissionsView = (asgn: Assignment) => {
    setSelectedAssignment(asgn); setGradingSubmission(null);
    setGradeMarks(''); setGradeFeedback('');
    setAssignmentView('submissions');
  };

  const openGrading = (sub: Submission) => {
    setGradingSubmission(sub);
    setGradeMarks(sub.marks?.toString() ?? '');
    setGradeFeedback(sub.feedback ?? '');
  };

  const saveGrade = () => {
    if (!gradingSubmission || !selectedAssignment) return;
    const marksNum = parseInt(gradeMarks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > selectedAssignment.totalMarks) {
      showToast(`Marks must be between 0 and ${selectedAssignment.totalMarks}.`, 'error'); return;
    }
    setGradeSaving(true);
    setTimeout(() => {
      const updatedSubmissions = submissions.map(s => s.id === gradingSubmission.id
        ? { ...s, marks: marksNum, feedback: gradeFeedback, status: 'graded' as const } : s);
      setSubmissions(updatedSubmissions);
      
      // Update assignments list to reflect graded status if applicable
      const updatedAssignments = assignments.map(a => a.id === selectedAssignment.id ? {
        ...a, marks: marksNum, feedback: gradeFeedback, status: 'graded' as const
      } : a);
      setAssignments(updatedAssignments);
      storage.saveAssignments(updatedAssignments);
      
      setGradeSaving(false); setGradingSubmission(null);
      showToast('Grade saved successfully!');
    }, 700);
  };

  const getAssignmentSubmissions = (asgnId: string) => submissions.filter(s => s.assignmentId === asgnId);
  const getSubmissionCounts = (asgnId: string) => {
    const subs = getAssignmentSubmissions(asgnId);
    return { total: subs.length, submitted: subs.filter(s => s.status !== 'not_submitted').length, graded: subs.filter(s => s.status === 'graded').length };
  };
  const isOverdue = (dueDate: string, dueTime: string) => new Date(`${dueDate}T${dueTime}`) < new Date();

  const statusConfig: Record<Submission['status'], { label: string; color: string; icon: string }> = {
    not_submitted: { label: 'Not Submitted', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: 'schedule' },
    submitted: { label: 'Submitted', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'task_alt' },
    late: { label: 'Late', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'warning' },
    graded: { label: 'Graded', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'military_tech' },
  };

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
<<<<<<< HEAD
    const newModules = JSON.parse(JSON.stringify(courseModules));
=======
    let newModules = JSON.parse(JSON.stringify(courseModules));
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928

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
      <TeacherTopNav
        onToggleSidebar={() => setIsSidebarOpen(true)}
        teacherName="Dr. Sarah Jenkins"
        teacherRole="Senior Educator"
        avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCW_k1UDJKVTHEb0vxQzYL6VWv9GY90kK7a7iRg-LqTHQ6_3ChbNeshcUf0XN_KFMzFLuCC27LFsWygLjphkw2pxAfmtLf0fNQ0e4h_S4tkGHHsBYlJ2OtxdMsraFPxjORddmtIH6BUJ4DM5zzewdyqkdcQOuNkOe0eTK_qDfy8B6knNUw2_z0cLmJwlBRBr3XR7Od38LUJju-YCUFxNN5HoTefz3L09BoJtFHNNeXlO4_xhM3hlJef9ALLRbqoUXw0bMp9uQAkJTs"
        onSignOut={() => {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("userRole");
<<<<<<< HEAD
          router.replace("/login");
=======
          router.push("/login");
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
        }}
      />

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
        <TeacherSidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          onSignOut={() => {
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("userRole");
<<<<<<< HEAD
            router.replace("/login");
=======
            router.push("/login");
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-4 md:p-8 h-full relative">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-12">

            {/* Tab: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                assignments={assignments}
                events={events}
                onTabChange={handleTabChange}
                teacherName="Dr. Sarah Jenkins"
              />
            )}

            {/* Tab: Attendance */}
            {activeTab === 'attendance' && (
              <Attendance />
            )}

            {/* Tab: Upload Lessons */}
            {activeTab === 'lessons' && (
              <section id="upload" className="animate-in fade-in duration-500 max-w-5xl mx-auto space-y-6">
                <LessonUpload onUploadSuccess={(lesson) => setUploadedLessonsList(prev => [lesson, ...prev])} />
                
                {/* Display uploaded lessons list */}
                {uploadedLessonsList.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-lg mb-4">Recent Uploads</h4>
                    <div className="space-y-3">
                      {uploadedLessonsList.map(lesson => (
                        <div key={lesson.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="material-symbols-outlined text-indigo-500">article</span>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{lesson.title}</p>
                            <p className="text-xs text-slate-500">{lesson.filename} • {lesson.size}</p>
                          </div>
                          <span className="text-xs text-slate-400">{lesson.date}</span>
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
                        <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Course Materials</h3>
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
                          <h3 className="text-xl font-bold text-slate-900 font-bricolage">Edit Material</h3>
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
<<<<<<< HEAD
                                    <Image src={editMaterialThumbnail} alt="Thumbnail" fill className="object-cover" unoptimized />
=======
                                    <img src={editMaterialThumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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

            {/* Tab: Schedule Management */}
            {activeTab === 'schedule' && (
              <section id="schedule" className="animate-in fade-in duration-500 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Academic Calendar</h3>
                    <p className="text-sm text-slate-500 mt-1">Schedule classes, exams, and events for your students</p>
                  </div>
                  <button 
                    onClick={() => {
                      const title = prompt('Event Title:');
                      const type = prompt('Type (class, exam, event, homework):') as any;
                      const date = prompt('Date (YYYY-MM-DD):');
                      const time = prompt('Time (HH:mm):');
                      if (title && date && time) {
                        const newEvent: CalendarEvent = {
                          id: `evt-${Date.now()}`,
                          title,
                          type: type || 'event',
                          start: `${date}T${time}:00`,
                          end: `${date}T${time}:00`,
                          teacher: 'Dr. Sarah Jenkins'
                        };
                        const updatedEvents = [newEvent, ...events];
                        setEvents(updatedEvents);
                        storage.saveEvents(updatedEvents);
                        showToast('Event scheduled successfully!');
                      }
                    }}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Schedule Event
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/50 p-6 shadow-sm">
                    <Calendar events={events} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 px-2">Upcoming Schedule</h4>
                    <div className="space-y-3">
                      {events.sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map(evt => (
                        <div key={evt.id} className="p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                              evt.type === 'class' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                              evt.type === 'exam' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              'bg-slate-50 text-slate-600 border-slate-100'
                            }`}>
                              {evt.type}
                            </span>
                            <button 
                              onClick={() => {
                                const updated = events.filter(e => e.id !== evt.id);
                                setEvents(updated);
                                storage.saveEvents(updated);
                                showToast('Event removed.');
                              }}
                              className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm">{evt.title}</h5>
                          <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-slate-400">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              {new Date(evt.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              {new Date(evt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
            {activeTab === 'assignments' && (
              <section id="assignments" className="animate-in fade-in duration-500 space-y-6">
                
                {/* 1. Assignments List View */}
                {assignmentView === 'list' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Manage Assignments</h3>
                        <p className="text-sm text-slate-500 mt-1">Track student progress and grade submissions</p>
                      </div>
                      <button 
                        onClick={openCreateAssignment}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Create Assignment
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {assignments.map(asgn => {
                        const counts = getSubmissionCounts(asgn.id);
                        const progress = (counts.submitted / (counts.total || 1)) * 100;
                        const overdue = isOverdue(asgn.dueDate, asgn.dueTime) && counts.submitted < counts.total;

                        return (
                          <div key={asgn.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden">
                            {asgn.status === 'draft' && (
                              <div className="absolute top-0 right-0 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-bl-xl border-b border-l border-slate-200/50">Draft</div>
                            )}
                            
                            <div className="flex justify-between items-start mb-4">
                              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                <span className="material-symbols-outlined text-[20px]">
                                  {asgn.type === 'Quiz / Test' ? 'quiz' : asgn.type === 'Discussion Post' ? 'forum' : 'assignment'}
                                </span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditAssignment(asgn)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                <button onClick={() => setAssignmentToDelete(asgn)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                              </div>
                            </div>

                            <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{asgn.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mb-4">{asgn.subject} • {asgn.classGroup}</p>

                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-[11px] font-bold mb-1.5 text-slate-700 uppercase tracking-wider">
                                  <span>Submissions</span>
                                  <span className="text-indigo-600">{counts.submitted}/{counts.total || 0}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${overdue ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-400 to-indigo-600'}`}
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <span className={`material-symbols-outlined text-[16px] ${overdue ? 'text-rose-500 animate-pulse' : ''}`}>event</span>
                                  <span className={`text-[11px] font-bold ${overdue ? 'text-rose-500' : ''}`}>
                                    Due {new Date(asgn.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                                <button 
                                  onClick={() => openSubmissionsView(asgn)}
                                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 group/btn"
                                >
                                  Review
                                  <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {assignments.length === 0 && (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">
                          <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                            <span className="material-symbols-outlined text-4xl">assignment_add</span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 mb-2 font-bricolage">No assignments yet</h4>
                          <p className="text-slate-500 max-w-xs mb-8">Create your first assignment to start tracking student progress and grading work.</p>
                          <button onClick={openCreateAssignment} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">Create New Assignment</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Create/Edit Assignment View */}
                {(assignmentView === 'create' || assignmentView === 'edit') && (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <button onClick={() => setAssignmentView('list')} className="p-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 rounded-full transition-colors shadow-sm">
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">
                          {assignmentView === 'create' ? 'Create New Assignment' : 'Edit Assignment'}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">Fill in the details to set up the learning task</p>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-slate-200/50 shadow-sm space-y-8">
                      {aFormError && (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 animate-in slide-in-from-top-2">
                          <span className="material-symbols-outlined">error</span>
                          <p className="font-bold text-sm">{aFormError}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Assignment Title <span className="text-rose-500">*</span></label>
                          <input 
                            type="text" 
                            placeholder="e.g., Final Year Thesis Proposal"
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors font-medium shadow-sm"
                            value={aFormTitle}
                            onChange={e => setAFormTitle(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                          <select 
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer text-slate-700 shadow-sm"
                            value={aFormSubject}
                            onChange={e => setAFormSubject(e.target.value)}
                          >
                            <option>Visual Communication</option>
                            <option>History of Art</option>
                            <option>Color Theory</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Class / Grade</label>
                          <select 
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer text-slate-700 shadow-sm"
                            value={aFormClass}
                            onChange={e => setAFormClass(e.target.value)}
                          >
                            <option>Sophomore (A)</option>
                            <option>Sophomore (B)</option>
                            <option>Senior Advanced</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Assignment Type</label>
                          <select 
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors cursor-pointer text-slate-700 shadow-sm"
                            value={aFormType}
                            onChange={e => setAFormType(e.target.value)}
                          >
                            <option>Project Submission</option>
                            <option>Quiz / Test</option>
                            <option>Discussion Post</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Total Marks</label>
                          <input 
                            type="number" 
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors shadow-sm"
                            value={aFormMarks}
                            onChange={e => setAFormMarks(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Due Date <span className="text-rose-500">*</span></label>
                          <input 
                            type="date" 
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors shadow-sm"
                            value={aFormDueDate}
                            onChange={e => setAFormDueDate(e.target.value)}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 ml-1">Due Time</label>
                          <input 
                            type="time" 
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-4 outline-none bg-slate-50/50 hover:bg-white transition-colors shadow-sm"
                            value={aFormDueTime}
                            onChange={e => setAFormDueTime(e.target.value)}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1.5 pt-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Detailed Instructions <span className="text-rose-500">*</span></label>
                          <textarea 
                            rows={6}
                            placeholder="Provide clear steps and requirements for students..."
                            className="w-full border border-slate-200/80 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 p-5 outline-none bg-slate-50/50 hover:bg-white transition-colors shadow-sm resize-none"
                            value={aFormInstructions}
                            onChange={e => setAFormInstructions(e.target.value)}
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-slate-100">
                        <button 
                          onClick={() => saveAssignment(false)}
                          disabled={aFormSaving}
                          className="px-8 py-3.5 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
                        >
                          Save as Draft
                        </button>
                        <button 
                          onClick={() => saveAssignment(true)}
                          disabled={aFormSaving}
                          className="px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {aFormSaving ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[20px]">send</span>
                              Publish Assignment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Submissions Table View */}
                {assignmentView === 'submissions' && selectedAssignment && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <button onClick={() => setAssignmentView('list')} className="p-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-600 rounded-full transition-colors shadow-sm">
                        <span className="material-symbols-outlined">arrow_back</span>
                      </button>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Review Submissions</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{selectedAssignment.title}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/50 shadow-sm">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Assignment Info</h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Class</p>
                              <p className="text-sm font-bold text-slate-800">{selectedAssignment.classGroup}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Due Date</p>
                              <p className="text-sm font-bold text-slate-800">{new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Marks</p>
                              <p className="text-sm font-bold text-indigo-600 font-bricolage text-lg">{selectedAssignment.totalMarks}</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2">
                            <button onClick={() => openEditAssignment(selectedAssignment)} className="w-full py-2.5 bg-slate-50 text-slate-700 font-bold text-xs rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">edit</span> Edit Details
                            </button>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                          <div className="flex justify-between items-start mb-6">
                            <h4 className="font-bold">Grading Status</h4>
                            <span className="material-symbols-outlined text-indigo-200">analytics</span>
                          </div>
                          {(() => {
                            const counts = getSubmissionCounts(selectedAssignment.id);
                            return (
                              <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl border border-white/10">
                                  <span className="text-xs font-semibold opacity-80">Submitted</span>
                                  <span className="font-bold">{counts.submitted}/{counts.total}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl border border-white/10">
                                  <span className="text-xs font-semibold opacity-80">Graded</span>
                                  <span className="font-bold">{counts.graded}/{counts.submitted}</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full mt-4">
                                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${(counts.graded / (counts.submitted || 1)) * 100}%` }}></div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left">
                              <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                                <tr>
                                  <th className="px-6 py-5">Student</th>
                                  <th className="px-6 py-5">Status</th>
                                  <th className="px-6 py-5">Submission Date</th>
                                  <th className="px-6 py-5">Grade</th>
                                  <th className="px-6 py-5 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {getAssignmentSubmissions(selectedAssignment.id).map(sub => {
                                  const config = statusConfig[sub.status];
                                  return (
                                    <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors group">
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
<<<<<<< HEAD
                                          <Image alt={sub.studentName} className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" src={sub.studentAvatar} width={36} height={36} />
=======
                                          <img alt={sub.studentName} className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" src={sub.studentAvatar} />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
                                          <span className="text-sm font-bold text-slate-800">{sub.studentName}</span>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${config.color}`}>
                                          <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
                                          {config.label}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <p className="text-xs font-medium text-slate-500">
                                          {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                        </p>
                                      </td>
                                      <td className="px-6 py-4">
                                        {sub.status === 'graded' ? (
                                          <span className="text-sm font-bold text-indigo-600 font-bricolage bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                            {sub.marks}/{selectedAssignment.totalMarks}
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Not Graded</span>
                                        )}
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        {sub.status !== 'not_submitted' ? (
                                          <button 
                                            onClick={() => openGrading(sub)}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm active:scale-95"
                                          >
                                            {sub.status === 'graded' ? 'Update Grade' : 'Grade Now'}
                                          </button>
                                        ) : (
                                          <button className="px-4 py-2 bg-slate-50 text-slate-300 text-[11px] font-bold rounded-xl cursor-not-allowed border border-slate-100">
                                            No Submission
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
<<<<<<< HEAD
                        <Image alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5YtzuGGhQtoMSYb1z4CZnqzzcbjq48xkrOrRAS800ySrm9ocI5a1BzLYwxIk0eZnIcgUfFelkA_eQMCMIc7W08pM-TNUrEQ6mXISeFxVR6YfFBWO1eJoxwM9CgWegDXdxbPoVGlQZxdbmq74kNvWgTuV2Ms4t1n07gHVb4LG_ao3lxXxeamT2cw4fEHaXZ-GRkv6nwiprw6xMch0nuLsJBE30XbcNwDgFCq9ntroDL6ffKWyYToxeDEiPLoO48Pjk38Y0tPqGFSk" width={40} height={40} />
=======
                        <img alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5YtzuGGhQtoMSYb1z4CZnqzzcbjq48xkrOrRAS800ySrm9ocI5a1BzLYwxIk0eZnIcgUfFelkA_eQMCMIc7W08pM-TNUrEQ6mXISeFxVR6YfFBWO1eJoxwM9CgWegDXdxbPoVGlQZxdbmq74kNvWgTuV2Ms4t1n07gHVb4LG_ao3lxXxeamT2cw4fEHaXZ-GRkv6nwiprw6xMch0nuLsJBE30XbcNwDgFCq9ntroDL6ffKWyYToxeDEiPLoO48Pjk38Y0tPqGFSk" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
                        <div className="flex-1 overflow-hidden">
                          <div className="flex justify-between items-start mb-0.5">
                            <h4 className="text-sm font-bold text-slate-900 truncate">Alice Lin</h4>
                            <span className="text-[10px] text-indigo-600 font-bold">2m ago</span>
                          </div>
                          <p className="text-xs text-indigo-600 font-medium truncate">Professor, I had a question about the assignment deadline...</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-center gap-3 hover:bg-white cursor-pointer transition-colors border-b border-slate-100">
<<<<<<< HEAD
                        <Image alt="John" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8gYSxsWIXMDJgBjagtAXPCLznBLwOX3tX91ZKO1QApfFfzvMpXemInFjapK_SL975FXP5atiFYnV9MrfDspQpMEP3S0p8hsB_v3RUiQBcWjIWJR1Q1FvCajAygB3f3k1g870DiNbZW8WXYOnx8Uvlf2Q8Nvwye97E9lHwRnwGMBZ-RmRfKbclN-RyH1HupK7BprpxsdP6g9Z3ITKw4EIF_HRwaojxOktYUbH0FcuJKyQ_M0kZUEhKC0hNYdgn1zpIDF6koegTO8" width={40} height={40} />
=======
                        <img alt="John" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8gYSxsWIXMDJgBjagtAXPCLznBLwOX3tX91ZKO1QApfFfzvMpXemInFjapK_SL975FXP5atiFYnV9MrfDspQpMEP3S0p8hsB_v3RUiQBcWjIWJR1Q1FvCajAygB3f3k1g870DiNbZW8WXYOnx8Uvlf2Q8Nvwye97E9lHwRnwGMBZ-RmRfKbclN-RyH1HupK7BprpxsdP6g9Z3ITKw4EIF_HRwaojxOktYUbH0FcuJKyQ_M0kZUEhKC0hNYdgn1zpIDF6koegTO8" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
<<<<<<< HEAD
                          <Image alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk7Wsjskynl2H5KXiECGBzgWR0Hvt0bSNn7-cg5jZS-lQ0Er7esj0N3SyiGOTxgCx92nEYZv8IT8Fj86UZ6VPrEcvcABG8HENglXyWqnEclvYp_Xh_Z449VX2aygqq4jg1mO-nYvCx3fl2-xuEX_1JAW6HfWjBPpVELirlTSEq-2bX4ICAQnHQVf67hRONetlckhbPzDpoKM9kULnCc--Ahe9IW68YL8tqaVrfFRULnVFCWgiiK-3c025F8JbTI1JU39_WgzQUA_M" width={40} height={40} />
=======
                          <img alt="Alice" className="w-10 h-10 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk7Wsjskynl2H5KXiECGBzgWR0Hvt0bSNn7-cg5jZS-lQ0Er7esj0N3SyiGOTxgCx92nEYZv8IT8Fj86UZ6VPrEcvcABG8HENglXyWqnEclvYp_Xh_Z449VX2aygqq4jg1mO-nYvCx3fl2-xuEX_1JAW6HfWjBPpVELirlTSEq-2bX4ICAQnHQVf67hRONetlckhbPzDpoKM9kULnCc--Ahe9IW68YL8tqaVrfFRULnVFCWgiiK-3c025F8JbTI1JU39_WgzQUA_M" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
                    <h3 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Student Payments</h3>
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
<<<<<<< HEAD
                              <Image alt="Alice" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mHyOpfSCUbiESMFCtXc425X4i_scXPSJ355x5z2tvsXovxMF4YcauUy9SPqHOhBZMVzunimUCkt808Po8jmGgPhKLI3ls39stBnquuE7NPpSItbEWhSqFuJAAxCG9oF-xwoZkfS2oFGkVIV8TmanlvL8KvUUwo0BpAgW0X4NWCCS713yUgurEW0qIjQC-02tAu1H0LyB8iDQvisNYRjeyXlJ51_cVO2s5hmGwHDSGbtJQbc5tr_ZEkYSeaPhw3KbygvS3VNKB1U" width={36} height={36} />
=======
                              <img alt="Alice" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9mHyOpfSCUbiESMFCtXc425X4i_scXPSJ355x5z2tvsXovxMF4YcauUy9SPqHOhBZMVzunimUCkt808Po8jmGgPhKLI3ls39stBnquuE7NPpSItbEWhSqFuJAAxCG9oF-xwoZkfS2oFGkVIV8TmanlvL8KvUUwo0BpAgW0X4NWCCS713yUgurEW0qIjQC-02tAu1H0LyB8iDQvisNYRjeyXlJ51_cVO2s5hmGwHDSGbtJQbc5tr_ZEkYSeaPhw3KbygvS3VNKB1U" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
<<<<<<< HEAD
                              <Image alt="John" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmPoMtVfIX5bjeysfE5jkYUNIIW75DMIK5Iomw2TOqwAKMsjNMVnAoL9HrEjPvWSvgxLmnZsBUQFm9FYfe6MpexIcSgwv9Ny1D46trNo71N_fRZP1cDVK1iFoeCvkL9JfKTtQd2yalMe_jLtSELGcfH6YD2ElEhlWh-U8zK1hnzpV0HeRKHTQ-PcVKiidLKbQCjNKVfylWp69brSrGaEmo20TuUuZvb7rS4jpaO5_N1kJbbe8PLg5dgbY9ZlzKN9wuR9zHn_gayFc" width={36} height={36} />
=======
                              <img alt="John" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmPoMtVfIX5bjeysfE5jkYUNIIW75DMIK5Iomw2TOqwAKMsjNMVnAoL9HrEjPvWSvgxLmnZsBUQFm9FYfe6MpexIcSgwv9Ny1D46trNo71N_fRZP1cDVK1iFoeCvkL9JfKTtQd2yalMe_jLtSELGcfH6YD2ElEhlWh-U8zK1hnzpV0HeRKHTQ-PcVKiidLKbQCjNKVfylWp69brSrGaEmo20TuUuZvb7rS4jpaO5_N1kJbbe8PLg5dgbY9ZlzKN9wuR9zHn_gayFc" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
<<<<<<< HEAD
                              <Image alt="Mark" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDcgi-CLEqUU8zIHTUR56qJbJoiJAZY8qrON2bZktQHFCl-IFRykhaMeyKz7MGz8KOeHAFu3ItwGrVG1FbSovsUICpIhke9K8wrwXQneuNanWHIqWGJYtZKqXQPAH2xHIHupzl4oSi7hgzB7CeE0jM21JjNubI6Ldp2-DEErJHEFf5ByfmLIsMtkuqMAWyhwHYq4XThBV7i-doIZmIJWfH31bbwDkDTxUduW5mB-u4O1x10rpZ7fkV0f-oz3uiZNCoVQ92ia2HCHI" width={36} height={36} />
=======
                              <img alt="Mark" className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDcgi-CLEqUU8zIHTUR56qJbJoiJAZY8qrON2bZktQHFCl-IFRykhaMeyKz7MGz8KOeHAFu3ItwGrVG1FbSovsUICpIhke9K8wrwXQneuNanWHIqWGJYtZKqXQPAH2xHIHupzl4oSi7hgzB7CeE0jM21JjNubI6Ldp2-DEErJHEFf5ByfmLIsMtkuqMAWyhwHYq4XThBV7i-doIZmIJWfH31bbwDkDTxUduW5mB-u4O1x10rpZ7fkV0f-oz3uiZNCoVQ92ia2HCHI" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
                <h3 className="text-2xl font-bold text-slate-900 mb-6 md:mb-8 font-bricolage tracking-tight">Student Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {/* Performance Card 1 */}
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-6">
<<<<<<< HEAD
                      <Image alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRoIrPJRN_BrWX01RR8f0AidZH8aBVFIbIfr9_PGC963olWCk0-KoGdC5jetNAN_dbBUWheyA615feqT02UyK-L-rw8bO9gZfTpU0ToSOaOrT1dS8JifmmzWea4HtSIv5kFsc8AWakRrSeKz2fbD2Fu0w6sgKIWs8HBux0lwkHMh6EsVTI0oY2gM4w7cCd0tBeKJ4WJYHOmuSW6To4zEaPvDSnyMFIO6VUhTyq2hI8LUKT6-Az2vrawQOh6dlvzGA8nn_0XH1SQ-c" width={56} height={56} />
=======
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRoIrPJRN_BrWX01RR8f0AidZH8aBVFIbIfr9_PGC963olWCk0-KoGdC5jetNAN_dbBUWheyA615feqT02UyK-L-rw8bO9gZfTpU0ToSOaOrT1dS8JifmmzWea4HtSIv5kFsc8AWakRrSeKz2fbD2Fu0w6sgKIWs8HBux0lwkHMh6EsVTI0oY2gM4w7cCd0tBeKJ4WJYHOmuSW6To4zEaPvDSnyMFIO6VUhTyq2hI8LUKT6-Az2vrawQOh6dlvzGA8nn_0XH1SQ-c" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
<<<<<<< HEAD
                      <Image alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAFTxG276x_Z4LVfft4tt1hBs7bup9oQmpfVV2XgMnl7dXKG5teUkOp1eTTIC_FRxEWUBOI21u5Yxlvz83VaDGyuSn0bGIRJMdLZ-bo8366x0UwzF0yk6HOePwihU1EVgPocRR-a5N2F9D4lL6l6cjQwbpy5-S_4GTtRraaG6nSDEfqOf6PkoSxZWZg3RqkaVbETOuludXT4IVGx2tTVVF-ZIvLAFeJCXvCj5fWKFU-iFJ1tXaJBrP_v99VUrEHsbl4LGLpMFvmVo" width={56} height={56} />
=======
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAFTxG276x_Z4LVfft4tt1hBs7bup9oQmpfVV2XgMnl7dXKG5teUkOp1eTTIC_FRxEWUBOI21u5Yxlvz83VaDGyuSn0bGIRJMdLZ-bo8366x0UwzF0yk6HOePwihU1EVgPocRR-a5N2F9D4lL6l6cjQwbpy5-S_4GTtRraaG6nSDEfqOf6PkoSxZWZg3RqkaVbETOuludXT4IVGx2tTVVF-ZIvLAFeJCXvCj5fWKFU-iFJ1tXaJBrP_v99VUrEHsbl4LGLpMFvmVo" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
<<<<<<< HEAD
                      <Image alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa0y1_Zx64Vgpu1sMu9xw0D21fYr7vU5hcCkBQXpcHFLdtifXectSd8jDSEChWVsLzVjG_BVJREON9Ixmx_k58jWMqote5seR0GvxoGM3QEHEQ8PdjfWle-sdVCsbIsLCcZ-aFATKOjBdSlBYPNf9n8u2RbYQBk4WOSMlUf-PbMDt-QHfh9XN9ZF0mrE2QbOjXGg6bcIzn72uabgWpnVmv9L29dAqXlx5iYvad-RX_EfICXDPRssCHxZKUwoOU_YAT_a-2R0hFUe0" width={56} height={56} />
=======
                      <img alt="Student" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50 shadow-sm group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa0y1_Zx64Vgpu1sMu9xw0D21fYr7vU5hcCkBQXpcHFLdtifXectSd8jDSEChWVsLzVjG_BVJREON9Ixmx_k58jWMqote5seR0GvxoGM3QEHEQ8PdjfWle-sdVCsbIsLCcZ-aFATKOjBdSlBYPNf9n8u2RbYQBk4WOSMlUf-PbMDt-QHfh9XN9ZF0mrE2QbOjXGg6bcIzn72uabgWpnVmv9L29dAqXlx5iYvad-RX_EfICXDPRssCHxZKUwoOU_YAT_a-2R0hFUe0" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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
                    <h2 className="text-2xl font-bold text-slate-900 font-bricolage tracking-tight">Create New Course</h2>
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
<<<<<<< HEAD
                            <Image src={thumbnailPreview} alt="Thumbnail Preview" width={200} height={128} className="h-32 object-cover rounded-xl border border-slate-200 shadow-sm mb-3" unoptimized />
=======
                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-32 object-cover rounded-xl border border-slate-200 shadow-sm mb-3" />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
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

      {/* ── Assignment Overlays ────────────────────────────────────── */}

      {/* 1. Grading Sidebar */}
      {gradingSubmission && selectedAssignment && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setGradingSubmission(null)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h4 className="font-bold text-slate-900">Grade Submission</h4>
                <p className="text-xs text-slate-500 font-medium">{gradingSubmission.studentName}</p>
              </div>
              <button onClick={() => setGradingSubmission(null)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm border border-transparent hover:border-slate-100">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted File</h5>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-pointer hover:bg-white hover:border-indigo-200 transition-all">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[28px]">description</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{gradingSubmission.fileName || 'submission.pdf'}</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase">2.4 MB • PDF Document</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">download</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex justify-between">
                    Marks Obtained
                    <span className="text-indigo-600 font-bricolage font-normal">out of {selectedAssignment.totalMarks}</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full border border-slate-200 rounded-2xl p-4 pr-16 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 font-bold text-lg text-slate-800"
                      placeholder="0"
                      value={gradeMarks}
                      onChange={e => setGradeMarks(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">/ {selectedAssignment.totalMarks}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Teacher Feedback</label>
                  <textarea 
                    rows={8}
                    className="w-full border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 text-sm resize-none"
                    placeholder="Provide constructive feedback for the student..."
                    value={gradeFeedback}
                    onChange={e => setGradeFeedback(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={saveGrade}
                disabled={gradeSaving}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {gradeSaving ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Submit Grade & Feedback
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Delete Assignment Confirmation */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setAssignmentToDelete(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-2 font-bricolage">Delete Assignment?</h4>
            <p className="text-sm text-slate-500 mb-8 px-4">This action cannot be undone. All student submissions and grades for <span className="font-bold text-slate-700">"{assignmentToDelete.title}"</span> will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setAssignmentToDelete(null)} className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button 
                onClick={deleteAssignment}
                disabled={isDeletingAssignment}
                className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeletingAssignment ? 'Deleting...' : 'Delete Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Global Toast Notifications */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500`}>
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${toast.type === 'success' ? 'bg-emerald-600/90 text-white border-emerald-400/20' : 'bg-rose-600/90 text-white border-rose-400/20'}`}>
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <p className="text-sm font-bold tracking-tight">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

