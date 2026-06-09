"use client";

import { useState, useEffect } from "react";

export type Language = "bn" | "en";

export const translations = {
  bn: {
    dashboard: "ড্যাশবোর্ড",
    schedule: "রুটিন",
    assignments: "অ্যাসাইনমেন্ট",
    library: "লাইব্রেরি",
    teachers: "শিক্ষক",
    payments: "পেমেন্ট",
    emergency: "জরুরি",
    chat: "চ্যাট",
    comments: "মন্তব্য",
    attendance: "উপস্থিতি",
    results: "ফলাফল",
    notices: "নোটিশ",
    profile: "প্রোফাইল",
    logout: "লগআউট",
    ongoing_class: "ক্লাস চলছে",
    time_remaining: "বাকি আছে",
    exam_risk: "পরীক্ষায় ঝুঁকির সম্ভাবনা",
    pending: "বাকি",
    latest_gpa: "সর্বশেষ জিপিএ",
    fee_due: "বকেয়া ফি",
    recently_published: "সম্প্রতি প্রকাশিত",
    pay_now: "এখনি পরিশোধ করুন",
    attendance_eligible: "পরীক্ষায় অংশগ্রহণের জন্য যোগ্য",
    attendance_warning: "সতর্কতা: আপনার উপস্থিতি ন্যূনতম সীমার নিচে",
  },
  en: {
    dashboard: "Dashboard",
    schedule: "Schedule",
    assignments: "Assignments",
    library: "Library",
    teachers: "Teachers",
    payments: "Payments",
    emergency: "Emergency",
    chat: "Chat",
    comments: "Comments",
    attendance: "Attendance",
    results: "Results",
    notices: "Notices",
    profile: "Profile",
    logout: "Log Out",
    ongoing_class: "Class Ongoing",
    time_remaining: "Remaining",
    exam_risk: "Exam Eligibility Risk",
    pending: "Pending",
    latest_gpa: "Latest GPA",
    fee_due: "Fee Due",
    recently_published: "Recently Published",
    pay_now: "Pay Now",
    attendance_eligible: "Eligible for Examinations",
    attendance_warning: "Warning: Your attendance is below threshold",
  }
};

let globalLang: Language = "bn";
const listeners = new Set<(lang: Language) => void>();

export function useLanguage() {
  // Always start with the static default to match Server-Side Rendering (preventing hydration mismatch)
  const [lang, setLang] = useState<Language>(globalLang);

  useEffect(() => {
    // Only access localStorage on the client after hydration is complete
    const saved = localStorage.getItem("preferredLanguage") as Language;
    if (saved && saved !== globalLang) {
      globalLang = saved;
      listeners.forEach((listener) => listener(saved));
    } else {
      // Otherwise ensure local state matches the active global language
      setLang(globalLang);
    }

    const handleChange = (newLang: Language) => {
      setLang(newLang);
    };

    listeners.add(handleChange);

    // Synchronize cross-tab preferredLanguage updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "preferredLanguage" && e.newValue) {
        const newLang = e.newValue as Language;
        globalLang = newLang;
        listeners.forEach((listener) => listener(newLang));
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      listeners.delete(handleChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleLang = () => {
    const newLang = lang === "bn" ? "en" : "bn";
    globalLang = newLang;
    localStorage.setItem("preferredLanguage", newLang);
    listeners.forEach((listener) => listener(newLang));
  };

  const t = (key: keyof typeof translations["en"]) => {
    return translations[lang][key] || key;
  };

  return { lang, toggleLang, t };
}

