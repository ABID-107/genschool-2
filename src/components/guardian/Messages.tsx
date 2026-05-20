import { useLanguage } from "@/lib/i18n";
import { useState } from "react";

export function GuardianMessagesView() {
  const { lang, t } = useLanguage();
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const emergencyAlerts = [
    { id: 1, titleEn: 'School Closed Tomorrow', titleBn: 'আগামীকাল স্কুল বন্ধ', msgEn: 'Due to heavy rainfall, school will remain closed tomorrow.', msgBn: 'প্রবল বৃষ্টির কারণে আগামীকাল স্কুল বন্ধ থাকবে।', time: '10:00 AM' }
  ];

  const teachers = [
    { id: 't1', name: 'Dr. Sarah Smith', subject: 'Mathematics', subjectBn: 'গণিত', unread: 2, online: true, lastMsg: 'I have checked the recent assignment.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALO_z4Ai2nCWkDsLH-KVUDBlY711cCvGTJb8O6wlKdsDP18-9cMlUijirDqzOwxZ4wyVgWfDJs6S8WiCaCKl4r_yHH4qAb00_zsUSnTYQazLsclDqDVHi02nPXvufWK_FYvwqQsu5dlWNz3SmZUdSMbp7oAtiUk61SIEsddwnEmrop_4_gyosQCgE5rY16C3zxxJsq-Csx_y2tU3KV-6vFiEs8Ri-EkT4yXMrGoBZEc-pm4BelmuwPu47EfI3n5usS93tMpFc20_8' },
    { id: 't2', name: 'Mr. James Wilson', subject: 'Science', subjectBn: 'বিজ্ঞান', unread: 0, online: false, lastMsg: 'Please make sure Alex brings the project.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6sH7RjH5HgvygBAaBOfvf3pIw1zPrtFuKDPzGw68Xa35X9cIP65m3ZSz6p2JAXQgR7HS2jtxaUnOTC24C8HSmzDx5Eudhq7IAG4fETzbST9G8pc3EqvZ3zlcb6_BRF-dfWyeLERtyhlr8hKSjBUJ_zzCGG07LhOFM0nO_ZyTxoNj8jAyQbwkCuK7JC4Gy6Z0NR1bAMBxttxq6QxthGWWZlqmPLtmc0tSasicN53LYAQukKEnWOOCsqdZJRwt5s5iuAQFI6GXqsm8' }
  ];

  const activeTeacher = teachers.find(t => t.id === activeChat);

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
      
      {/* Emergency Alert (Always Visible at Top if present) */}
      {emergencyAlerts.map(alert => (
        <div key={alert.id} className="bg-rose-600 text-white p-4 rounded-2xl shadow-md mb-4 flex items-start gap-4 flex-shrink-0 animate-pulse">
          <span className="material-symbols-outlined text-3xl">campaign</span>
          <div>
            <h4 className="font-bold text-lg">{lang === 'bn' ? alert.titleBn : alert.titleEn}</h4>
            <p className="text-sm mt-1 text-rose-100">{lang === 'bn' ? alert.msgBn : alert.msgEn}</p>
            <p className="text-xs mt-2 opacity-80">{alert.time}</p>
          </div>
        </div>
      ))}

      {/* Main Chat Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex">
        
        {/* Contacts List (Hidden on mobile if chat is active) */}
        <div className={`w-full md:w-1/3 md:border-r border-slate-100 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{lang === 'bn' ? 'শিক্ষকগণ' : 'Teachers'}</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder={lang === 'bn' ? 'শিক্ষক খুঁজুন...' : 'Search teachers...'}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {teachers.map(teacher => (
              <button 
                key={teacher.id}
                onClick={() => setActiveChat(teacher.id)}
                className={`w-full p-4 flex items-center gap-3 transition-colors border-b border-slate-50 text-left ${activeChat === teacher.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <div className="relative">
                  <img src={teacher.avatar} alt={teacher.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  {teacher.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{teacher.name}</h5>
                    <span className="text-[10px] font-bold text-slate-400">10:30 AM</span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{lang === 'bn' ? teacher.subjectBn : teacher.subject}</p>
                  <p className="text-xs text-slate-500 truncate mt-1">{teacher.lastMsg}</p>
                </div>
                {teacher.unread > 0 && (
                  <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                    {teacher.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className={`w-full md:w-2/3 flex flex-col bg-slate-50/50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat && activeTeacher ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600 rounded-full"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <img src={activeTeacher.avatar} alt={activeTeacher.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{activeTeacher.name}</h4>
                    <p className={`text-xs font-semibold ${activeTeacher.online ? 'text-green-600' : 'text-slate-500'}`}>
                      {activeTeacher.online ? (lang === 'bn' ? 'অনলাইন' : 'Online') : (lang === 'bn' ? 'অফলাইন' : 'Offline')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined">call</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined">videocam</span>
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full">{lang === 'bn' ? 'আজ' : 'Today'}</span>
                </div>
                
                <div className="flex justify-start">
                  <div className="max-w-[85%] md:max-w-[70%] bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <p className="text-sm text-slate-800">
                      {lang === 'bn' 
                        ? 'নমস্কার, অ্যালেক্স গণিতে ভালো করছে, তবে তার জ্যামিতি অংশে একটু বেশি মনোযোগ দেওয়া প্রয়োজন।' 
                        : 'Hello! Alex is doing well in Mathematics, but needs a bit more focus on Geometry.'}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block">10:20 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[85%] md:max-w-[70%] bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 shadow-md">
                    <p className="text-sm">
                      {lang === 'bn' 
                        ? 'ধন্যবাদ জানানোর জন্য। আমি তাকে বাড়িতে জ্যামিতি অনুশীলনে সাহায্য করব।' 
                        : 'Thank you for letting me know. I will help him practice Geometry at home.'}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span className="text-[10px] font-bold text-indigo-200">10:30 AM</span>
                      <span className="material-symbols-outlined text-[14px] text-indigo-200">done_all</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <input 
                    type="text" 
                    placeholder={lang === 'bn' ? 'মেসেজ লিখুন...' : 'Type a message...'}
                    className="flex-1 bg-slate-100 border-none rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all shadow-md shrink-0">
                    <span className="material-symbols-outlined ml-1">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">forum</span>
              <h3 className="text-lg font-bold text-slate-600">{lang === 'bn' ? 'মেসেজ নির্বাচন করুন' : 'Select a message'}</h3>
              <p className="text-sm mt-1">{lang === 'bn' ? 'শিক্ষকের সাথে কথোপকথন শুরু করতে বাম পাশ থেকে নির্বাচন করুন।' : 'Choose a teacher from the list to start a conversation.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

