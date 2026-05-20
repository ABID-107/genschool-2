"use client";

import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

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
      <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group max-w-sm mx-auto">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 rounded-2xl border-4 border-white/20 overflow-hidden mb-6 shadow-xl group-hover:scale-105 transition-all duration-500">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3rG7ibmqRj09ignTbmUiHQU9DmB-Jnsu49Yz0gHlMWSUwpaodkImSCPCkeBzUnsTzc4HOsHo-4-jOwAXc9tmHmJXdJVToj0htUrah-1VnLRA2kK1JszREZ16nAfPC9IgAMDJgqaUYYurP8QOJeIO1Pmlh67tu7DVEofqRGcahgPBbZDmfpjMWuVCgbdEQVIwXcq8vsfOkEB9g7OUwK8Iy1hF1vu19bzdcVw3l1TUjYMVcEr7PiLJ9Q-YpCewIIRwiUwjNekXtqU" className="w-full h-full object-cover" alt="Student" />
          </div>
          <h2 className="text-2xl font-bold font-bangla text-center">{lang === 'bn' ? student.nameBn : student.nameEn}</h2>
          <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mt-1">ID: {student.studentId}</p>
          
          <div className="mt-8 grid grid-cols-2 gap-8 w-full border-t border-white/10 pt-6">
            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Class</p>
              <p className="text-sm font-bold">{student.class}-{student.section}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Roll</p>
              <p className="text-sm font-bold">{student.roll}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-1">Blood Group</p>
              <p className="text-sm font-bold text-rose-400">{student.bloodGroup}</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-900 text-3xl">qr_code_2</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <span className="material-symbols-outlined text-[80px]">school</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 shadow-sm space-y-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-bangla mb-4 border-b border-slate-50 pb-2">ব্যক্তিগত তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name (Bangla)</p>
              <p className="text-sm font-bold text-slate-700 font-bangla">{student.nameBn}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name (English)</p>
              <p className="text-sm font-bold text-slate-700">{student.nameEn}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
              <p className="text-sm font-bold text-slate-700">{student.dob}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mobile No.</p>
              <p className="text-sm font-bold text-indigo-600">{student.mobile}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 font-bangla mb-4 border-b border-slate-50 pb-2">অভিভাবকের তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Guardian Name</p>
              <p className="text-sm font-bold text-slate-700 font-bangla">{student.guardian}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Relation</p>
              <p className="text-sm font-bold text-slate-700">Father</p>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
          <span className="material-symbols-outlined text-[20px]">badge</span>
          ডাউনলোড স্টুডেন্ট আইডি কার্ড (PDF)
        </button>
      </div>
    </div>
  );
}

