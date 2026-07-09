"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

export default function GlobalLanguageToggle() {
  const [lang, setLang] = useState<"EN" | "BN">("EN");

  const toggleLang = () => {
    setLang((prev) => (prev === "EN" ? "BN" : "EN"));
  };

  return (
    <button
      onClick={toggleLang}
      className="btn-icon btn-glass rounded-full gap-1.5 text-xs font-bold tracking-wider hover:scale-105 active:scale-95"
      aria-label={`Switch language to ${lang === "EN" ? "Bengali" : "English"}`}
    >
      <Globe size={14} />
      <span>{lang}</span>
    </button>
  );
}