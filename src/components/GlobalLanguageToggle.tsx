"use client";

import { useLanguage } from "@/lib/i18n";
import { useEffect, useState } from "react";

export default function GlobalLanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={toggleLang}
        className="flex items-center gap-2.5 px-4 py-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-2xl rounded-full text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:bg-white/90 dark:hover:bg-slate-900/90 active:scale-95 group relative"
        aria-label={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
      >
        {/* Globe icon using Google Material Symbols */}
        <span className="material-symbols-outlined text-[20px] transition-transform duration-500 group-hover:rotate-45">
          language
        </span>
        
        <span className="font-semibold text-xs tracking-wider uppercase">
          {lang === "bn" ? "English" : "বাংলা"}
        </span>

        {/* Dynamic Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </div>
  );
}

