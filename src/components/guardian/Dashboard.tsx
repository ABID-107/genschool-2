import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { Plus, UserCheck, UserX, MessageSquare, Clock, ClipboardCheck, TrendingUp, Wallet, AlertTriangle, CheckCircle, DoorOpen, Megaphone, History } from "lucide-react";


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
    { id: 1, type: 'payment', titleEn: 'Payment Confirmed', titleBn: 'পেমেন্ট নিশ্চিত করা হয়েছে', descEn: 'Received $450 for Tuition Fee', descBn: 'বেতন বাবদ ৪৫০ টাকা গ্রহণ করা হয়েছে', time: '10:30 AM', date: 'Today', icon: 'check_circle', color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success-bg)]' },
    { id: 2, type: 'attendance', titleEn: 'Student Present', titleBn: 'শিক্ষার্থী উপস্থিত', descEn: 'Entered school premises', descBn: 'বিদ্যালয়ে প্রবেশ করেছে', time: '08:15 AM', date: 'Today', icon: 'sensor_door', color: 'text-[var(--brand-primary)]', bg: 'bg-[var(--color-success-bg)]' },
    { id: 3, type: 'notice', titleEn: 'New Notice', titleBn: 'নতুন নোটিশ', descEn: 'School will remain closed tomorrow', descBn: 'আগামীকাল বিদ্যালয় বন্ধ থাকবে', time: 'Yesterday', date: 'May 16', icon: 'campaign', color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-bg)]' },
    { id: 4, type: 'assignment', titleEn: 'Math Assignment Due', titleBn: 'গণিতের কাজ জমা দিতে হবে', descEn: 'Algebra equations chapter 4', descBn: 'বীজগণিত সমীকরণ অধ্যায় ৪', time: '2 Days ago', date: 'May 15', icon: 'assignment_late', color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error-bg)]' },
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
                ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] shadow-md shadow-[var(--color-success-bg)]' 
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--brand-light)]'
            }`}
          >
            <Image src={child.avatar} alt={child.nameEn} className={`w-12 h-12 rounded-full object-cover border-2 ${activeChildId === child.id ? 'border-[var(--brand-light)]' : 'border-[var(--border-light)]'}`} width={48} height={48} />
            <div className="text-left">
              <p className="font-bold text-sm leading-tight">{lang === 'bn' ? child.nameBn : child.nameEn}</p>
              <p className={`text-xs ${activeChildId === child.id ? 'text-[var(--color-success-bg)]' : 'text-[var(--text-muted)]'}`}>Class {child.class} • Sec {child.section}</p>
            </div>
          </button>
        ))}
        
        <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--brand-light)] hover:text-[var(--brand-primary)] hover:bg-[var(--color-success-bg)] transition-all font-semibold whitespace-nowrap">
          <Plus size={20} />
          {lang === 'bn' ? 'সন্তান যুক্ত করুন' : 'Add Child'}
        </button>
      </div>

      {/* Today's Status */}
      <div>
        <h3 className="text-lg font-bold text-[var(--text-secondary)] mb-4">{lang === 'bn' ? 'আজকের আপডেট' : "Today's Status"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-tertiary)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeChild.todayAttendance === 'present' ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]' : 'bg-[var(--color-error-bg)] text-[var(--color-error)]'}`}>
              {activeChild.todayAttendance === 'present' ? <UserCheck size={24} /> : <UserX size={24} />}
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'উপস্থিতি' : 'Attendance'}</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {activeChild.todayAttendance === 'present' ? (lang === 'bn' ? 'উপস্থিত' : 'Present') : (lang === 'bn' ? 'অনুপস্থিত' : 'Absent')}
              </p>
            </div>
          </div>
          
          <div className="bg-[var(--bg-tertiary)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] text-[var(--brand-primary)] flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'এসএমএস এলার্ট' : 'SMS Alert'}</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{lang === 'bn' ? 'পাঠানো হয়েছে' : 'Sent at 08:15 AM'}</p>
            </div>
          </div>
          
          <div className="bg-[var(--bg-tertiary)] rounded-2xl p-5 border border-[var(--border-color)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-warning-bg)] text-[var(--color-warning)] flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase">{lang === 'bn' ? 'বর্তমান ক্লাস' : 'Current Class'}</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{lang === 'bn' ? activeChild.currentClassBn : activeChild.currentClassEn}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[var(--color-success-bg)] text-[var(--brand-primary)] rounded-lg">
              <ClipboardCheck size={20} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{activeChild.attendance}%</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)]">{lang === 'bn' ? 'মোট উপস্থিতি' : 'Total Attendance'}</p>
        </div>
        
        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[var(--color-info-bg)] text-[var(--color-info)] rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{activeChild.gpa}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)]">{lang === 'bn' ? 'সর্বশেষ জিপিএ' : 'Latest GPA'}</p>
        </div>
        
        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-lg">
              <Wallet size={20} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[var(--color-error)] mb-1">৳{activeChild.feeDue}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)]">{lang === 'bn' ? 'বকেয়া ফি' : 'Fee Due'}</p>
        </div>
        
        <div className="bg-[var(--bg-tertiary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-[var(--color-warning-bg)] text-[var(--color-warning)] rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{activeChild.pendingAssignments}</h4>
          <p className="text-xs font-semibold text-[var(--text-muted)]">{lang === 'bn' ? 'অসম্পূর্ণ কাজ' : 'Pending Tasks'}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--bg-tertiary)] rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[var(--border-light)] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <History size={20} className="text-[var(--brand-primary)]" />
            {lang === 'bn' ? 'সাম্প্রতিক কার্যাবলী' : 'Recent Activity'}
          </h3>
          <button className="text-sm font-bold text-[var(--brand-primary)] hover:text-[var(--brand-mid)]">{lang === 'bn' ? 'সব দেখুন' : 'View All'}</button>
        </div>
        <div className="divide-y divide-[var(--border-light)]">
          {recentActivities.map(activity => (
            <div key={activity.id} className="p-5 md:p-6 flex gap-4 hover:bg-[var(--bg-secondary)] transition-colors">
              <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${activity.bg} ${activity.color}`}>
                {activity.icon === 'check_circle' ? <CheckCircle size={24} /> :
                 activity.icon === 'sensor_door' ? <DoorOpen size={24} /> :
                 activity.icon === 'campaign' ? <Megaphone size={24} /> :
                 <AlertTriangle size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-[var(--text-primary)] text-sm md:text-base">{lang === 'bn' ? activity.titleBn : activity.titleEn}</h4>
                  <span className="text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap ml-2">{activity.date}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{lang === 'bn' ? activity.descBn : activity.descEn}</p>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-md">
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
