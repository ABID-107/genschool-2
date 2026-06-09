import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928

interface Child {
  id: string;
  nameEn: string;
  nameBn: string;
  class: string;
  section: string;
  roll: string;
  avatar: string;
  attendance: number;
  gpa: string;
  feeDue: number;
  pendingAssignments: number;
  currentClassEn: string;
  currentClassBn: string;
  todayAttendance: 'present' | 'absent' | 'leave';
}

export function GuardianDashboardView({ 
  childrenList, 
  activeChildId, 
  onChildSwitch 
}: { 
  childrenList: Child[], 
  activeChildId: string,
  onChildSwitch: (id: string) => void 
}) {
  const { lang, t } = useLanguage();
  const activeChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  const recentActivities = [
    { id: 1, type: 'payment', titleEn: 'Payment Confirmed', titleBn: 'পেমেন্ট নিশ্চিত করা হয়েছে', descEn: 'Received $450 for Tuition Fee', descBn: 'বেতন বাবদ ৪৫০ টাকা গ্রহণ করা হয়েছে', time: '10:30 AM', date: 'Today', icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-100' },
    { id: 2, type: 'attendance', titleEn: 'Student Present', titleBn: 'শিক্ষার্থী উপস্থিত', descEn: 'Entered school premises', descBn: 'বিদ্যালয়ে প্রবেশ করেছে', time: '08:15 AM', date: 'Today', icon: 'sensor_door', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 3, type: 'notice', titleEn: 'New Notice', titleBn: 'নতুন নোটিশ', descEn: 'School will remain closed tomorrow', descBn: 'আগামীকাল বিদ্যালয় বন্ধ থাকবে', time: 'Yesterday', date: 'May 16', icon: 'campaign', color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 4, type: 'assignment', titleEn: 'Math Assignment Due', titleBn: 'গণিতের কাজ জমা দিতে হবে', descEn: 'Algebra equations chapter 4', descBn: 'বীজগণিত সমীকরণ অধ্যায় ৪', time: '2 Days ago', date: 'May 15', icon: 'assignment_late', color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Child Selector */}
      <div className="flex overflow-x-auto gap-4 pb-2 custom-scrollbar">
        {childrenList.map(child => (
          <button
            key={child.id}
            onClick={() => onChildSwitch(child.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl min-w-[200px] transition-all border ${
              activeChildId === child.id 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
            }`}
          >
<<<<<<< HEAD
            <Image src={child.avatar} alt={child.nameEn} className={`w-12 h-12 rounded-full object-cover border-2 ${activeChildId === child.id ? 'border-indigo-300' : 'border-slate-100'}`} width={48} height={48} />
=======
            <img src={child.avatar} alt={child.nameEn} className={`w-12 h-12 rounded-full object-cover border-2 ${activeChildId === child.id ? 'border-indigo-300' : 'border-slate-100'}`} />
>>>>>>> 8415be89a19eb0a8cc90a95ab8737463a8d29928
            <div className="text-left">
              <p className="font-bold text-sm leading-tight">{lang === 'bn' ? child.nameBn : child.nameEn}</p>
              <p className={`text-xs ${activeChildId === child.id ? 'text-indigo-100' : 'text-slate-500'}`}>Class {child.class} • Sec {child.section}</p>
            </div>
          </button>
        ))}
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-semibold whitespace-nowrap">
          <span className="material-symbols-outlined">add</span>
          {lang === 'bn' ? 'সন্তান যুক্ত করুন' : 'Add Child'}
        </button>
      </div>

      {/* Today's Status */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">{lang === 'bn' ? 'আজকের আপডেট' : "Today's Status"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeChild.todayAttendance === 'present' ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
              <span className="material-symbols-outlined text-2xl">{activeChild.todayAttendance === 'present' ? 'how_to_reg' : 'person_off'}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">{lang === 'bn' ? 'উপস্থিতি' : 'Attendance'}</p>
              <p className="text-lg font-bold text-slate-900">
                {activeChild.todayAttendance === 'present' ? (lang === 'bn' ? 'উপস্থিত' : 'Present') : (lang === 'bn' ? 'অনুপস্থিত' : 'Absent')}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">sms</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">{lang === 'bn' ? 'এসএমএস এলার্ট' : 'SMS Alert'}</p>
              <p className="text-lg font-bold text-slate-900">{lang === 'bn' ? 'পাঠানো হয়েছে' : 'Sent at 08:15 AM'}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">{lang === 'bn' ? 'বর্তমান ক্লাস' : 'Current Class'}</p>
              <p className="text-lg font-bold text-slate-900">{lang === 'bn' ? activeChild.currentClassBn : activeChild.currentClassEn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">fact_check</span>
            </div>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-1">{activeChild.attendance}%</h4>
          <p className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'মোট উপস্থিতি' : 'Total Attendance'}</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">military_tech</span>
            </div>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-1">{activeChild.gpa}</h4>
          <p className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'সর্বশেষ জিপিএ' : 'Latest GPA'}</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </div>
          </div>
          <h4 className="text-2xl font-bold text-rose-600 mb-1">৳{activeChild.feeDue}</h4>
          <p className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'বকেয়া ফি' : 'Fee Due'}</p>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <span className="material-symbols-outlined text-xl">assignment_late</span>
            </div>
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-1">{activeChild.pendingAssignments}</h4>
          <p className="text-xs font-semibold text-slate-500">{lang === 'bn' ? 'অসম্পূর্ণ কাজ' : 'Pending Tasks'}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">history</span>
            {lang === 'bn' ? 'সাম্প্রতিক কার্যাবলী' : 'Recent Activity'}
          </h3>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">{lang === 'bn' ? 'সব দেখুন' : 'View All'}</button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivities.map(activity => (
            <div key={activity.id} className="p-5 md:p-6 flex gap-4 hover:bg-slate-50 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${activity.bg} ${activity.color}`}>
                <span className="material-symbols-outlined text-2xl">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-slate-900 text-sm md:text-base">{lang === 'bn' ? activity.titleBn : activity.titleEn}</h4>
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap ml-2">{activity.date}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{lang === 'bn' ? activity.descBn : activity.descEn}</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

