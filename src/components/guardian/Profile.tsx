import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { Phone, Mail, MapPin, UserPen, Plus, Unlink, Settings, Bell, Globe, Lock, ChevronRight } from "lucide-react";

interface Child {
  id: string;
  nameEn: string;
  nameBn: string;
  class: string;
  section: string;
  roll: string;
  avatar: string;
}

export function GuardianProfileView({ childrenList }: { childrenList: Child[] }) {
  const { lang, t } = useLanguage();
  
  const parentProfile = {
    nameEn: 'Alex Johnson',
    nameBn: 'অ্যালেক্স জনসন',
    relationEn: 'Father',
    relationBn: 'বাবা',
    phone: '01712-345678',
    email: 'alex.guardian@example.com',
    addressEn: '123, Dhanmondi, Dhaka',
    addressBn: '১২৩, ধানমন্ডি, ঢাকা'
  };

  return (
    <div className="space-y-6">
      
      <div className="card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/5 rounded-full blur-3xl -z-10" />
        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_GqNpLIO1iT-CowPy58VSjpKqUke_HfKK6Z9agSyZ7zvsVomKL2uT_qdQc9Oq0VzhPOjbpAnY1UxwxcOXoumvB6ehd3IH0glA_OM9cmbv91b0L9r8hs6kNCKMKN-vE8tvWeonoF16uGva8aDpOhZouX8byDgmKr9-ec9OkveAdoTgCTRrbOTXGmMpfSTqLuOx8Gvtetb6gH8GJOYrCz5dFHcfmguIhGBDDObNpGc-2vhoXnV1yypW-JhhmWJVciAudrRDcB-Ymio" 
          alt="Guardian" 
          className="w-24 h-24 rounded-full object-cover border-4 border-[var(--bg-secondary)] shadow-md"
          width={96}
          height={96}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{lang === 'bn' ? parentProfile.nameBn : parentProfile.nameEn}</h2>
          <p className="text-sm font-semibold text-[var(--brand-primary)] mt-1">{lang === 'bn' ? `সম্পর্ক: ${parentProfile.relationBn}` : `Relation: ${parentProfile.relationEn}`}</p>
          <div className="flex flex-col md:flex-row gap-3 mt-4 text-sm text-[var(--text-secondary)]">
            <span className="flex items-center justify-center md:justify-start gap-2">
              <Phone size={16} className="text-[var(--text-muted)]" />
              {parentProfile.phone}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-2">
              <Mail size={16} className="text-[var(--text-muted)]" />
              {parentProfile.email}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-2">
              <MapPin size={16} className="text-[var(--text-muted)]" />
              {lang === 'bn' ? parentProfile.addressBn : parentProfile.addressEn}
            </span>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm">
          <UserPen size={16} />
          {lang === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-[var(--brand-primary)]">
                <span className="material-symbols-outlined">family_restroom</span>
              </span>
              {lang === 'bn' ? 'যুক্ত সন্তানসমূহ' : 'Linked Children'}
            </h3>
            <button className="btn btn-ghost btn-sm">
              <Plus size={16} />
              {lang === 'bn' ? 'যুক্ত করুন' : 'Add Child'}
            </button>
          </div>
          
          <div className="space-y-4">
            {childrenList.map(child => (
              <div key={child.id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]/50">
                <div className="flex items-center gap-4">
                  <Image src={child.avatar} alt={child.nameEn} className="w-12 h-12 rounded-full border border-[var(--border-color)] object-cover" width={48} height={48} />
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{lang === 'bn' ? child.nameBn : child.nameEn}</h4>
                    <p className="text-xs text-[var(--text-muted)] font-medium">Class {child.class} &bull; Sec {child.section} &bull; Roll {child.roll}</p>
                  </div>
                </div>
                <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors" aria-label="Unlink">
                  <Unlink size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Settings size={18} className="text-[var(--brand-primary)]" />
            {lang === 'bn' ? 'সেটিংস এবং পছন্দ' : 'Settings & Preferences'}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)] hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-start gap-3">
                <Bell size={18} className="text-[var(--text-muted)] mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">{lang === 'bn' ? 'এসএমএস এলার্ট' : 'SMS Alerts'}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{lang === 'bn' ? 'উপস্থিতি এবং জরুরি নোটিশের জন্য' : 'For attendance and emergency notices'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--border-color)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)] hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-start gap-3">
                <Globe size={18} className="text-[var(--text-muted)] mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">{lang === 'bn' ? 'অ্যাপের ভাষা' : 'App Language'}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{lang === 'bn' ? 'বাংলা নির্বাচিত' : 'Selected: English'}</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">
                {lang === 'bn' ? 'English এ পরিবর্তন' : 'Change to বাংলা'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--border-color)] hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-start gap-3">
                <Lock size={18} className="text-[var(--text-muted)] mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)] text-sm">{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</h4>
                  <p className="text-xs text-[var(--text-muted)]">{lang === 'bn' ? 'আপনার একাউন্ট সুরক্ষিত রাখুন' : 'Keep your account secure'}</p>
                </div>
              </div>
              <button className="btn btn-ghost btn-icon-sm">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
