"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "teacher" | "student" | "guardian">("admin");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userRole", role);
      if (role === "guardian") {
        localStorage.setItem("childUsername", email);
        router.push("/guardian");
      } else if (role === "student") {
        router.push("/student");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/teacher");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[var(--brand-deep)] relative overflow-hidden selection:bg-[var(--brand-primary)]/20 selection:text-[var(--brand-primary)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(var(--brand-rgb), 0.10) 0%, transparent 60%)," +
            "radial-gradient(ellipse 40% 30% at 80% 80%, rgba(var(--brand-rgb), 0.05) 0%, transparent 60%)",
        }}
      />
      <div className="absolute top-1/3 -left-20 w-[300px] h-[300px] rounded-full bg-[var(--brand-primary)]/10 blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-[250px] h-[250px] rounded-full bg-[var(--brand-accent)]/5 blur-[80px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link href="/" className="flex items-center justify-center gap-[10px] text-[1.8rem] font-bold text-white no-underline font-heading hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-accent)] to-amber-400 flex items-center justify-center text-white font-extrabold text-xl">
            G
          </div>
          <span>GenSchool</span>
        </Link>
        <h2 className="mt-8 text-center text-[1.8rem] font-bold tracking-tight text-white font-heading">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-white/50">
          Please sign in to access your dashboard.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px] z-10"
      >
        <div className="glass-card py-10 px-6 sm:px-12">
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-8 flex-wrap sm:flex-nowrap gap-1 sm:gap-0">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "admin"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "teacher"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "student"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("guardian")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "guardian"
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Guardian
            </button>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/80 mb-2">
                {role === "guardian" ? "Child's Username" : "Email address"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                  {role === "guardian" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  )}
                </span>
                <input
                  id="email"
                  name="email"
                  type={role === "guardian" ? "text" : "email"}
                  autoComplete={role === "guardian" ? "username" : "email"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/40 focus:border-[var(--brand-accent)]/60 transition-all"
                  placeholder={role === "guardian" ? "student_username" : role === "admin" ? "admin@genschool.com" : role === "teacher" ? "teacher@genschool.com" : "student@genschool.com"}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-white/80">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-[var(--brand-accent)] hover:text-amber-400 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-[18px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/40 focus:border-[var(--brand-accent)]/60 transition-all"
                  placeholder={role === "guardian" ? "DD-MM-YYYY" : "••••••••"}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[var(--brand-accent)] focus:ring-[var(--brand-accent)]/40"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/50">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-amber w-full btn-lg"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : "Sign in"}
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[var(--glass-bg)] px-2 text-white/40">Demo credentials</span>
                </div>
              </div>
              <div className="mt-4 text-center text-xs text-white/40">
                Any email and password will work for this demo.
              </div>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--glass-bg)] px-2 text-white/40">Administrator access</span>
              </div>
            </div>
            <Link
              href="/super-admin/login"
              className="btn btn-outline-amber w-full mt-4 no-underline"
            >
              <Shield size={16} />
              Super Admin Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}