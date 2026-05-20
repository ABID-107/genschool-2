"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // Check initial theme from document class
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  // Don't render until mounted to prevent hydration mismatch with icons
  if (theme === null) {
    return <div className="w-9 h-9"></div>;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full glass-button flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle Dark Mode"
    >
      <span className="material-symbols-outlined text-[20px] text-[var(--text-primary)] transition-transform duration-300">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}

