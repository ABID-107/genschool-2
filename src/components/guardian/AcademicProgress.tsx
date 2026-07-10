import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { TrendingUp, Download, FileText, CheckCircle, Clock, AlertTriangle, MessageSquare } from "lucide-react";


interface ExamResult {
  term: string;
  termBn: string;
  gpa: string;
  totalMarks: number;
  obtainedMarks: number;
}

export function GuardianAcademicProgressView() {
  const { lang, t } = useLanguage();

  const results: ExamResult[] = [
    { term: '1st Term Exam', termBn: '১ম সাময়িক পরীক্ষা', gpa: '4.85', totalMarks: 1000, obtainedMarks: 890 },
    { term: 'Mid Term Exam', termBn: 'অর্ধ-বার্ষিক পরীক্ষা', gpa: '4.92', totalMarks: 1000, obtainedMarks: 915 },
  ];

  const assignments = [
    { id: 1, subject: 'Mathematics', subjectBn: 'গণিত', topic: 'Algebra Ch-4', topicBn: 'বীজগণিত অধ্যায় ৪', dueDate: 'May 18, 2025', status: 'pending' },
    { id: 2, subject: 'Science', subjectBn: 'বিজ্ঞান', topic: 'Physics Project', topicBn: 'পদার্থবিজ্ঞান প্রজেক্ট', dueDate: 'May 16, 2025', status: 'submitted' },
    { id: 3, subject: 'English', subjectBn: 'ইংরেজি', topic: 'Essay Writing', topicBn: 'প্রবন্ধ রচনা', dueDate: 'May 14, 2025', status: 'missed' },
  ];

  const teacherFeedback = [
    { id: 1, teacher: 'Dr. Sarah Smith', subject: 'Mathematics', subjectBn: 'গণিত', rating: 'Good', ratingBn: 'ভালো', feedbackEn: 'Excellent improvement in logical reasoning.', feedbackBn: 'যৌক্তিক যুক্তিতে চমৎকার উন্নতি হয়েছে।', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALO_z4Ai2nCWkDsLH-KVUDBlY711cCvGTJb8O6wlKdsDP18-9cMlUijirDqzOwxZ4wyVgWfDJs6S8WiCaCKl4r_yHH4qAb00_zsUSnTYQazLsclDqDVHi02nPXvufWK_FYvwqQsu5dlWNz3SmZUdSMbp7oAtiUk61SIEsddwnEmrop_4_gyosQCgE5rY16C3zxxJsq-Csx_y2tU3KV-6vFiEs8Ri-EkT4yXMrGoBZEc-pm4BelmuwPu47EfI3n5usS93tMpFc20_8' },
    { id: 2, teacher: 'Mr. James Wilson', subject: 'Science', subjectBn: 'বিজ্ঞান', rating: 'Average', ratingBn: 'চলনসই', feedbackEn: 'Needs more focus on theoretical concepts.', feedbackBn: 'তাত্ত্বিক বিষয়গুলোতে আরও মনোযোগ দেওয়া প্রয়োজন।', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6sH7RjH5HgvygBAaBOfvf3pIw1zPrtFuKDPzGw68Xa35X9cIP65m3ZSz6p2JAXQgR7HS2jtxaUnOTC24C8HSmzDx5Eudhq7IAG4fETzbST9G8pc3EqvZ3zlcb6_BRF-dfWyeLERtyhlr8hKSjBUJ_zzCGG07LhOFM0nO_ZyTxoNj8jAyQbwkCuK7JC4Gy6Z0NR1bAMBxttxq6QxthGWWZlqmPLtmc0tSasicN53LYAQukKEnWOOCsqdZJRwt5s5iuAQFI6GXqsm8' }
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Header with Download Report Card Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--brand-primary)] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <TrendingUp size={150} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold">{lang === 'bn' ? 'একাডেমিক অগ্রগতি' : 'Academic Progress'}</h2>
          <p className="text-[var(--color-success-bg)] text-sm mt-1">{lang === 'bn' ? 'চলতি শিক্ষাবর্ষ ২০২৫' : 'Current Academic Year 2025'}</p>
        </div>
        <button className="relative z-10 w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--brand-mid)] font-bold rounded-2xl hover:bg-[var(--color-success-bg)] active:scale-95 transition-all shadow-sm">
          <Download size={20} />
          {lang === 'bn' ? 'রিপোর্ট কার্ড ডাউনলোড' : 'Report Card PDF'}
        </button>
      </div>

      {/* Results Summary & GPA Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{lang === 'bn' ? 'পরীক্ষার ফলাফল' : 'Exam Results'}</h3>
          <div className="space-y-4">
            {results.map((res, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
                <div>
                  <h4 className="font-bold text-[var(--text-secondary)]">{lang === 'bn' ? res.termBn : res.term}</h4>
                  <p className="text-xs text-[var(--text-muted)] font-medium mt-1">
                    {lang === 'bn' ? `প্রাপ্ত নম্বর: ${res.obtainedMarks} / ${res.totalMarks}` : `Marks: ${res.obtainedMarks} / ${res.totalMarks}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'জিপিএ' : 'GPA'}</div>
                  <div className="text-2xl font-black text-[var(--brand-primary)]">{res.gpa}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{lang === 'bn' ? 'জিপিএ ট্রেন্ড' : 'GPA Trend'}</h3>
          {/* Simple simulated line chart */}
          <div className="relative h-32 w-full mt-4">
            <div className="absolute inset-0 flex items-end justify-between px-2">
              <div className="w-full border-b-2 border-dashed border-[var(--border-color)] absolute bottom-0"></div>
              <div className="w-full border-b-2 border-dashed border-[var(--border-color)] absolute bottom-1/2"></div>
              <div className="w-full border-b-2 border-dashed border-[var(--border-color)] absolute top-0"></div>
              
              <div className="relative flex flex-col items-center justify-end h-full z-10">
                <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--bg-tertiary)] px-1 -translate-y-2">4.20</span>
                <div className="w-3 h-3 bg-[var(--brand-primary)] rounded-full border-2 border-white mb-[-6px]"></div>
              </div>
              <div className="relative flex flex-col items-center justify-end h-full z-10 pb-8">
                <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--bg-tertiary)] px-1 -translate-y-2">4.85</span>
                <div className="w-3 h-3 bg-[var(--brand-primary)] rounded-full border-2 border-white mb-[-6px]"></div>
              </div>
              <div className="relative flex flex-col items-center justify-end h-full z-10 pb-12">
                <span className="text-xs font-bold text-[var(--brand-primary)] bg-[var(--bg-tertiary)] px-1 -translate-y-2">4.92</span>
                <div className="w-3 h-3 bg-[var(--brand-primary)] rounded-full border-2 border-white mb-[-6px]"></div>
              </div>
            </div>
            {/* SVG Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M 5,95 L 50,60 L 95,20" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex justify-between mt-4 px-2 text-xs font-bold text-[var(--text-muted)]">
            <span>{lang === 'bn' ? 'প্রথম' : 'Term 1'}</span>
            <span>{lang === 'bn' ? 'অর্ধ' : 'Mid'}</span>
            <span>{lang === 'bn' ? 'বার্ষিক' : 'Final'}</span>
          </div>
        </div>
      </div>

      {/* Assignment Tracking */}
      <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FileText size={20} className="text-[var(--color-error)]" />
            {lang === 'bn' ? 'অ্যাসাইনমেন্ট ট্র্যাকিং' : 'Assignment Tracking'}
          </h3>
          <button className="text-sm font-bold text-[var(--brand-primary)]">{lang === 'bn' ? 'সব দেখুন' : 'View All'}</button>
        </div>
        
        <div className="space-y-3">
          {assignments.map(ass => (
            <div key={ass.id} className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  ass.status === 'submitted' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' :
                  ass.status === 'pending' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' :
                  'bg-[var(--color-error-bg)] text-[var(--color-error)]'
                }`}>
                  {ass.status === 'submitted' ? <CheckCircle size={18} /> : ass.status === 'pending' ? <Clock size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">{lang === 'bn' ? ass.topicBn : ass.topic}</h4>
                  <p className="text-xs font-semibold text-[var(--text-muted)] mt-0.5">{lang === 'bn' ? ass.subjectBn : ass.subject} • Due: {ass.dueDate}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  ass.status === 'submitted' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-bg)]' :
                  ass.status === 'pending' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] border border-[var(--color-warning-bg)]' :
                  'bg-[var(--color-error-bg)] text-[var(--color-error)] border border-[var(--color-error-bg)]'
                }`}>
                {ass.status === 'submitted' ? (lang === 'bn' ? 'জমা দেওয়া হয়েছে' : 'Submitted') :
                 ass.status === 'pending' ? (lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending') :
                 (lang === 'bn' ? 'বাদ পড়েছে' : 'Missed')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Feedback */}
      <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 mb-6">
          <MessageSquare size={20} className="text-[var(--brand-primary)]" />
          {lang === 'bn' ? 'শিক্ষকদের মতামত' : 'Teacher Feedback'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teacherFeedback.map(feedback => (
            <div key={feedback.id} className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <Image src={feedback.avatar} alt={feedback.teacher} className="w-10 h-10 rounded-full border border-[var(--border-light)] object-cover" width={40} height={40} />
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-sm">{feedback.teacher}</h4>
                    <p className="text-xs font-semibold text-[var(--brand-primary)]">{lang === 'bn' ? feedback.subjectBn : feedback.subject}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-md ${
                  feedback.rating === 'Good' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]'
                }`}>
                  {lang === 'bn' ? feedback.ratingBn : feedback.rating}
                </span>
              </div>
              <div className="bg-[var(--bg-secondary)] rounded-xl p-4 italic text-sm text-[var(--text-secondary)] border-l-4 border-[var(--brand-light)]">
                "{lang === 'bn' ? feedback.feedbackBn : feedback.feedbackEn}"
              </div>
              <div className="mt-4 flex justify-end">
                <button className="text-xs font-bold text-[var(--brand-primary)] hover:text-[var(--brand-mid)] transition-colors flex items-center gap-1">
                  <MessageSquare size={14} />
                  {lang === 'bn' ? 'শিক্ষককে মেসেজ দিন' : 'Message Teacher'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
