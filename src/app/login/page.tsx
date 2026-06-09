"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "teacher" | "student" | "guardian">("admin");
  const router = useRouter();


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network request
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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500/20 selection:text-indigo-600">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#1a56e8]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#4f46e5]/5 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link href="/" className="flex items-center justify-center gap-[10px] text-[1.8rem] font-bold text-[#0f172a] no-underline font-bricolage hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a56e8] to-[#4f46e5] flex items-center justify-center text-white font-extrabold text-xl">
            G
          </div>
          <span>GenSchool</span>
        </Link>
        <h2 className="mt-8 text-center text-[1.8rem] font-bold tracking-tight text-[#0f172a] font-bricolage">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[#475569]">
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
          <div className="flex bg-slate-50 border border-slate-200 p-1 rounded-xl mb-8 flex-wrap sm:flex-nowrap gap-1 sm:gap-0">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "admin"
                  ? "bg-white text-[#1a56e8] shadow-sm border border-[#e2e8f0]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "teacher"
                  ? "bg-white text-[#1a56e8] shadow-sm border border-[#e2e8f0]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "student"
                  ? "bg-white text-[#1a56e8] shadow-sm border border-[#e2e8f0]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("guardian")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                role === "guardian"
                  ? "bg-white text-[#1a56e8] shadow-sm border border-[#e2e8f0]"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              Guardian
            </button>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0f172a] mb-2">
                {role === "guardian" ? "Child's Username" : "Email address"}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-[#94a3b8] text-[20px]">{role === "guardian" ? "person" : "mail"}</span>
                <input
                  id="email"
                  name="email"
                  type={role === "guardian" ? "text" : "email"}
                  autoComplete={role === "guardian" ? "username" : "email"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f8f9fc] text-[#0f172a] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/20 focus:border-[#1a56e8] transition-all sm:text-sm"
                  placeholder={role === "guardian" ? "student_username" : role === "admin" ? "admin@genschool.com" : role === "teacher" ? "teacher@genschool.com" : "student@genschool.com"}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0f172a]">
                  Password
                </label>
                <a href="#" className="text-sm font-medium text-[#1a56e8] hover:text-[#0f3ab5] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-[#94a3b8] text-[20px]">lock</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-[#e2e8f0] bg-[#f8f9fc] text-[#0f172a] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a56e8]/20 focus:border-[#1a56e8] transition-all sm:text-sm"
                  placeholder={role === "guardian" ? "DD-MM-YYYY" : "••••••••"}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#1a56e8] focus:ring-[#1a56e8]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#475569]">
                Remember me
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold glass-button-primary disabled:opacity-70 disabled:cursor-not-allowed"
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
                  <div className="w-full border-t border-[#e2e8f0]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-[#94a3b8]">Demo credentials</span>
                </div>
              </div>
              <div className="mt-4 text-center text-xs text-[#475569]">
                Any email and password will work for this demo.
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

