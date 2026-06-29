"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const initialTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTimeout(() => {
      setTheme(initialTheme);
    }, 0);
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

  if (theme === null) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="btn-icon btn-glass rounded-full hover:scale-105 active:scale-95"
      aria-label={theme === "light" ? "Enable dark mode" : "Enable light mode"}
    >
      {theme === "light" ? (
        <Moon size={16} />
      ) : (
        <Sun size={16} />
      )}
    </button>
  );
}
