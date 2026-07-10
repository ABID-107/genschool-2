import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
import { Megaphone, Search, ArrowLeft, Phone, Video, CheckCheck, PlusCircle, Send, MessageCircle } from "lucide-react";


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
        <div key={alert.id} className="bg-[var(--color-error)] text-white p-4 rounded-2xl shadow-md mb-4 flex items-start gap-4 flex-shrink-0 animate-pulse">
          <Megaphone size={28} />
          <div>
            <h4 className="font-bold text-lg">{lang === 'bn' ? alert.titleBn : alert.titleEn}</h4>
            <p className="text-sm mt-1 text-[var(--color-error-bg)]">{lang === 'bn' ? alert.msgBn : alert.msgEn}</p>
            <p className="text-xs mt-2 opacity-80">{alert.time}</p>
          </div>
        </div>
      ))}

      {/* Main Chat Container */}
      <div className="flex-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-3xl shadow-sm overflow-hidden flex">
        
        {/* Contacts List (Hidden on mobile if chat is active) */}
        <div className={`w-full md:w-1/3 md:border-r border-[var(--border-light)] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-[var(--bg-secondary)] border-b border-[var(--border-light)]">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{lang === 'bn' ? 'শিক্ষকগণ' : 'Teachers'}</h3>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-[var(--text-dim)]" />
              <input 
                type="text" 
                placeholder={lang === 'bn' ? 'শিক্ষক খুঁজুন...' : 'Search teachers...'}
                className="w-full pl-9 pr-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {teachers.map(teacher => (
              <button 
                key={teacher.id}
                onClick={() => setActiveChat(teacher.id)}
                className={`w-full p-4 flex items-center gap-3 transition-colors border-b border-[var(--border-light)] text-left ${activeChat === teacher.id ? 'bg-[var(--color-success-bg)] border-l-4 border-l-[var(--brand-primary)]' : 'hover:bg-[var(--bg-secondary)] border-l-4 border-l-transparent'}`}
              >
                <div className="relative">
                  <Image src={teacher.avatar} alt={teacher.name} className="w-12 h-12 rounded-full object-cover border border-[var(--border-color)]" width={48} height={48} />
                  {teacher.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-success)] border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h5 className="font-bold text-[var(--text-primary)] text-sm truncate">{teacher.name}</h5>
                    <span className="text-[10px] font-bold text-[var(--text-dim)]">10:30 AM</span>
                  </div>
                  <p className="text-xs font-semibold text-[var(--brand-primary)] mt-0.5">{lang === 'bn' ? teacher.subjectBn : teacher.subject}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-1">{teacher.lastMsg}</p>
                </div>
                {teacher.unread > 0 && (
                  <span className="w-5 h-5 bg-[var(--brand-primary)] text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                    {teacher.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className={`w-full md:w-2/3 flex flex-col bg-[var(--bg-secondary)]/50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat && activeTeacher ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-[var(--bg-tertiary)] border-b border-[var(--border-light)] flex justify-between items-center z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 -ml-2 text-[var(--text-dim)] hover:text-[var(--brand-primary)] rounded-full"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <Image src={activeTeacher.avatar} alt={activeTeacher.name} className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{activeTeacher.name}</h4>
                    <p className={`text-xs font-semibold ${activeTeacher.online ? 'text-[var(--color-success)]' : 'text-[var(--text-muted)]'}`}>
                      {activeTeacher.online ? (lang === 'bn' ? 'অনলাইন' : 'Online') : (lang === 'bn' ? 'অফলাইন' : 'Offline')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center justify-center transition-colors">
                    <Phone size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center justify-center transition-colors">
                    <Video size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                <div className="flex justify-center">
                  <span className="text-[10px] font-bold text-[var(--text-dim)] bg-[var(--border-color)]/50 px-3 py-1 rounded-full">{lang === 'bn' ? 'আজ' : 'Today'}</span>
                </div>
                
                <div className="flex justify-start">
                  <div className="max-w-[85%] md:max-w-[70%] bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {lang === 'bn' 
                        ? 'নমস্কার, অ্যালেক্স গণিতে ভালো করছে, তবে তার জ্যামিতি অংশে একটু বেশি মনোযোগ দেওয়া প্রয়োজন।' 
                        : 'Hello! Alex is doing well in Mathematics, but needs a bit more focus on Geometry.'}
                    </p>
                    <span className="text-[10px] font-bold text-[var(--text-dim)] mt-2 block">10:20 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[85%] md:max-w-[70%] bg-[var(--brand-primary)] text-white rounded-2xl rounded-tr-none p-4 shadow-md">
                    <p className="text-sm">
                      {lang === 'bn' 
                        ? 'ধন্যবাদ জানানোর জন্য। আমি তাকে বাড়িতে জ্যামিতি অনুশীলনে সাহায্য করব।' 
                        : 'Thank you for letting me know. I will help him practice Geometry at home.'}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span className="text-[10px] font-bold text-[var(--color-success-bg)]">10:30 AM</span>
                      <CheckCheck size={14} className="text-[var(--color-success-bg)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-[var(--bg-tertiary)] border-t border-[var(--border-light)]">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-[var(--text-dim)] hover:text-[var(--brand-primary)] transition-colors">
                    <PlusCircle size={20} />
                  </button>
                  <input 
                    type="text" 
                    placeholder={lang === 'bn' ? 'মেসেজ লিখুন...' : 'Type a message...'}
                    className="flex-1 bg-[var(--bg-secondary)] border-none rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20"
                  />
                  <button className="w-12 h-12 bg-[var(--brand-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--brand-mid)] active:scale-95 transition-all shadow-md shrink-0">
                    <Send size={20} className="ml-1" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-dim)] p-8 text-center">
              <MessageCircle size={56} className="mb-4 opacity-20" />
              <h3 className="text-lg font-bold text-[var(--text-secondary)]">{lang === 'bn' ? 'মেসেজ নির্বাচন করুন' : 'Select a message'}</h3>
              <p className="text-sm mt-1">{lang === 'bn' ? 'শিক্ষকের সাথে কথোপকথন শুরু করতে বাম পাশ থেকে নির্বাচন করুন।' : 'Choose a teacher from the list to start a conversation.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
