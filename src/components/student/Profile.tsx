"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { QrCode, GraduationCap, IdCard } from "lucide-react";

interface ProfileProps {
  student: {
    nameBn: string;
    nameEn: string;
    class: string;
    section: string;
    roll: string;
    studentId: string;
    bloodGroup: string;
    dob: string;
    guardian: string;
    mobile: string;
  };
}

export function ProfileView({ student }: ProfileProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Student ID Card Look */}
      <div className="bg-gradient-to-br from-[var(--brand-deep)] to-[var(--green-900)] rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group max-w-sm mx-auto">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 rounded-2xl border-4 border-white/20 overflow-hidden mb-6 shadow-xl group-hover:scale-105 transition-all duration-500">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3rG7ibmqRj09ignTbmUiHQU9DmB-Jnsu49Yz0gHlMWSUwpaodkImSCPCkeBzUnsTzc4HOsHo-4-jOwAXc9tmHmJXdJVToj0htUrah-1VnLRA2kK1JszREZ16nAfPC9IgAMDJgqaUYYurP8QOJeIO1Pmlh67tu7DVEofqRGcahgPBbZDmfpjMWuVCgbdEQVIwXcq8vsfOkEB9g7OUwK8Iy1hF1vu19bzdcVw3l1TUjYMVcEr7PiLJ9Q-YpCewIIRwiUwjNekXtqU" className="w-full h-full object-cover" alt="Student" width={128} height={128} />
          </div>
          <h2 className="text-2xl font-bold font-bangla text-center">{lang === 'bn' ? student.nameBn : student.nameEn}</h2>
          <p className="text-[var(--green-200)] text-sm font-bold uppercase tracking-widest mt-1">ID: {student.studentId}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-8 w-full border-t border-white/10 pt-6">
            <div>
              <p className="text-[10px] font-bold text-[var(--green-300)] uppercase tracking-wider mb-1">Class</p>
              <p className="text-sm font-bold">{student.class}-{student.section}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--green-300)] uppercase tracking-wider mb-1">Roll</p>
              <p className="text-sm font-bold">{student.roll}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--green-300)] uppercase tracking-wider mb-1">Blood Group</p>
              <p className="text-sm font-bold text-[var(--color-error)]">{student.bloodGroup}</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-lg p-1.5 flex items-center justify-center">
                <QrCode size={28} className="text-[var(--text-primary)]" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <GraduationCap size={80} />
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] rounded-2xl border border-[var(--border-color)]/50 p-6 shadow-sm space-y-8">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-bangla mb-4 border-b border-slate-50 pb-2">ব্যক্তিগত তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Full Name (Bangla)</p>
              <p className="text-sm font-bold text-[var(--text-secondary)] font-bangla">{student.nameBn}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Full Name (English)</p>
              <p className="text-sm font-bold text-[var(--text-secondary)]">{student.nameEn}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Date of Birth</p>
              <p className="text-sm font-bold text-[var(--text-secondary)]">{student.dob}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Mobile No.</p>
              <p className="text-sm font-bold text-[var(--brand-primary)]">{student.mobile}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-bangla mb-4 border-b border-slate-50 pb-2">অভিভাবকের তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Guardian Name</p>
              <p className="text-sm font-bold text-[var(--text-secondary)] font-bangla">{student.guardian}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Relation</p>
              <p className="text-sm font-bold text-[var(--text-secondary)]">Father</p>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--green-50)] hover:text-[var(--brand-primary)] transition-all border border-[var(--border-light)]">
          <IdCard size={20} />
          ডাউনলোড স্টুডেন্ট আইডি কার্ড (PDF)
        </button>
      </div>
    </div>
  );
}

