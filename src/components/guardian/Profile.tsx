import { useLanguage } from "@/lib/i18n";

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
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10"></div>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_GqNpLIO1iT-CowPy58VSjpKqUke_HfKK6Z9agSyZ7zvsVomKL2uT_qdQc9Oq0VzhPOjbpAnY1UxwxcOXoumvB6ehd3IH0glA_OM9cmbv91b0L9r8hs6kNCKMKN-vE8tvWeonoF16uGva8aDpOhZouX8byDgmKr9-ec9OkveAdoTgCTRrbOTXGmMpfSTqLuOx8Gvtetb6gH8GJOYrCz5dFHcfmguIhGBDDObNpGc-2vhoXnV1yypW-JhhmWJVciAudrRDcB-Ymio" 
          alt="Guardian" 
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">{lang === 'bn' ? parentProfile.nameBn : parentProfile.nameEn}</h2>
          <p className="text-sm font-semibold text-indigo-600 mt-1">{lang === 'bn' ? `সম্পর্ক: ${parentProfile.relationBn}` : `Relation: ${parentProfile.relationEn}`}</p>
          <div className="flex flex-col md:flex-row gap-3 mt-4 text-sm text-slate-600">
            <span className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">call</span>
              {parentProfile.phone}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
              {parentProfile.email}
            </span>
            <span className="flex items-center justify-center md:justify-start gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">location_on</span>
              {lang === 'bn' ? parentProfile.addressBn : parentProfile.addressEn}
            </span>
          </div>
        </div>
        <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm">
          {lang === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Linked Children Management */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">family_restroom</span>
              {lang === 'bn' ? 'যুক্ত সন্তানসমূহ' : 'Linked Children'}
            </h3>
            <button className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
              {lang === 'bn' ? 'যুক্ত করুন' : 'Add Child'}
            </button>
          </div>
          
          <div className="space-y-4">
            {childrenList.map(child => (
              <div key={child.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-4">
                  <img src={child.avatar} alt={child.nameEn} className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{lang === 'bn' ? child.nameBn : child.nameEn}</h4>
                    <p className="text-xs text-slate-500 font-medium">Class {child.class} • Sec {child.section} • Roll {child.roll}</p>
                  </div>
                </div>
                <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors tooltip-trigger" title={lang === 'bn' ? 'আনলিঙ্ক করুন' : 'Unlink'}>
                  <span className="material-symbols-outlined">link_off</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings & Preferences */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">settings</span>
            {lang === 'bn' ? 'সেটিংস এবং পছন্দ' : 'Settings & Preferences'}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 mt-0.5">notifications_active</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{lang === 'bn' ? 'এসএমএস এলার্ট' : 'SMS Alerts'}</h4>
                  <p className="text-xs text-slate-500">{lang === 'bn' ? 'উপস্থিতি এবং জরুরি নোটিশের জন্য' : 'For attendance and emergency notices'}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 mt-0.5">g_translate</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{lang === 'bn' ? 'অ্যাপের ভাষা' : 'App Language'}</h4>
                  <p className="text-xs text-slate-500">{lang === 'bn' ? 'বাংলা নির্বাচিত' : 'Selected: English'}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors">
                {lang === 'bn' ? 'English এ পরিবর্তন' : 'Change to বাংলা'}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-slate-400 mt-0.5">password</span>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</h4>
                  <p className="text-xs text-slate-500">{lang === 'bn' ? 'আপনার একাউন্ট সুরক্ষিত রাখুন' : 'Keep your account secure'}</p>
                </div>
              </div>
              <button className="p-2 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

