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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const validateForm = (): boolean => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      router.replace("/super-admin");
    } else {
      setError(result.error || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--brand-deep)] relative overflow-hidden selection:bg-[var(--brand-primary)]/20 selection:text-[var(--brand-primary)]">
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

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px]"
        >
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand-accent)] to-amber-400 shadow-lg shadow-[var(--color-warning)]/25 mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Super Admin
            </h1>
            <p className="text-sm text-white/50 mt-1.5">
              Platform-level access for system administrators
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-card p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-[var(--color-error)] bg-[var(--color-error)]/10 border border-rose-500/20 rounded-xl px-4 py-2.5 mb-5"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-5" onSubmit={handleLogin} noValidate>
              <div>
                <label
                  htmlFor="sa-email"
                  className="block text-sm font-medium text-white/80 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Mail size={16} />
                  </div>
                  <input
                    id="sa-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                      setError("");
                    }}
                    className={`block w-full h-11 bg-white/5 border text-white placeholder-white/30 rounded-xl pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                      emailError
                        ? "border-rose-400/50 focus:ring-rose-500/20 focus:border-rose-400"
                        : "border-white/10 focus:ring-[var(--brand-accent)]/40 focus:border-[var(--brand-accent)]/60"
                    }`}
                    placeholder="admin@genschool.com"
                    autoComplete="email"
                  />
                </div>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-[var(--color-error)] mt-1"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>

              <div>
                <label
                  htmlFor="sa-password"
                  className="block text-sm font-medium text-white/80 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                    <Lock size={16} />
                  </div>
                  <input
                    id="sa-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                      setError("");
                    }}
                    className={`block w-full h-11 bg-white/5 border text-white placeholder-white/30 rounded-xl pl-10 pr-10 text-sm focus:outline-none focus:ring-2 transition-all ${
                      passwordError
                        ? "border-rose-400/50 focus:ring-rose-500/20 focus:border-rose-400"
                        : "border-white/10 focus:ring-[var(--brand-accent)]/40 focus:border-[var(--brand-accent)]/60"
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/70 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-[var(--color-error)] mt-1"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-amber w-full btn-lg"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Access Platform"
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-white/40 text-center">
                Any email and password will work for this demo.
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-sm text-white/50 hover:text-[var(--brand-accent)] transition-colors"
            >
              &larr; Back to login
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="py-4 text-center relative z-10">
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()} GenSchool. All rights reserved.
        </p>
      </div>
    </div>
  );
}