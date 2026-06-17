"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSuperAdminStore } from "@/store/superAdminStore";

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const login = useSuperAdminStore((s) => s.login);
  const isAuthenticated = useSuperAdminStore((s) => s.isAuthenticated);
  const hydrate = useSuperAdminStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/super-admin");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/super-admin");
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    } catch {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Dev Mode Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Development Mode
            </span>
          </div>

          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 mb-4">
              <Shield size={28} className="text-navy-950" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Super Admin
            </h1>
            <p className="text-sm text-navy-400 mt-1.5">
              Platform-level access for system administrators
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-navy-900/80 backdrop-blur-sm rounded-2xl border border-navy-800 p-8 shadow-2xl">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="sa-email"
                  className="block text-sm font-medium text-navy-300 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-500">
                    <Mail size={16} />
                  </div>
                  <input
                    id="sa-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-navy-800/60 border border-navy-700 text-white placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
                    placeholder="superadmin@genschool.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="sa-password"
                  className="block text-sm font-medium text-navy-300 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-500">
                    <Lock size={16} />
                  </div>
                  <input
                    id="sa-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-navy-800/60 border border-navy-700 text-white placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-navy-500 hover:text-navy-300 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 font-bold text-sm hover:from-amber-400 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Access Platform"
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-navy-800">
              <p className="text-center text-xs text-navy-500">
                Authorized personnel only. Unauthorized access is prohibited.
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
              <Link
                href="/"
                className="text-sm text-navy-500 hover:text-navy-300 transition-colors"
              >
                &larr; Back to GenSchool
              </Link>
          </div>
        </motion.div>
      </div>

      <div className="py-4 text-center">
        <p className="text-xs text-navy-600">
          &copy; {new Date().getFullYear()} GenSchool. All rights reserved.
        </p>
      </div>
    </div>
  );
}
