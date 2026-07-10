"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Menu, X, Shield, LogIn, GraduationCap } from "lucide-react";

import translationsData from '../data/translations.json';
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/lib/i18n";

const translations: Record<string, any> = translationsData;

export default function Home() {
  const { lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const role = localStorage.getItem("userRole");
    if (auth === "true") {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateTo = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(path);
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-[5%] transition-all duration-300 ${
          isScrolled ? "glass-nav shadow-sm" : "bg-transparent"
        }`}
      >
        <a href="#" className="flex items-center gap-2.5 text-[1.5rem] font-bold text-[var(--text-primary)] no-underline font-heading">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-deep)] flex items-center justify-center text-white font-extrabold">
            G
          </div>
          <span>GenSchool</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#about" className="text-[0.875rem] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline">{t.aboutLabel || "About"}</a>
          <a href="#features" className="text-[0.875rem] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline">{t.featLabel || "Features"}</a>
          <a href="#testimonials" className="text-[0.875rem] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline">{t.testiLabel || "Testimonials"}</a>
          <a href="#contact" className="text-[0.875rem] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline">{t.ctaTitle || "Contact"}</a>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            disabled={isNavigating}
            onClick={() => navigateTo("/login")}
            className="btn btn-ghost btn-sm hidden sm:flex"
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            disabled={isNavigating}
            onClick={() => navigateTo("/super-admin/login")}
            className="btn btn-outline-amber btn-sm hidden sm:flex"
          >
            <Shield size={16} />
            Super Admin
          </button>
          <button
            disabled={isNavigating}
            onClick={() => navigateTo("/demo")}
            className="btn btn-primary btn-sm hidden sm:flex"
          >
            {t.demoBtn}
          </button>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-lg md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline">About</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline">Features</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors no-underline">Testimonials</a>
              <div className="border-t border-[var(--border-color)] my-2" />
              <button onClick={() => { setIsMobileMenuOpen(false); navigateTo("/login"); }} className="btn btn-ghost w-full justify-start">Login</button>
              <button onClick={() => { setIsMobileMenuOpen(false); navigateTo("/super-admin/login"); }} className="btn btn-outline-amber w-full justify-start">Super Admin</button>
              <button onClick={() => { setIsMobileMenuOpen(false); navigateTo("/demo"); }} className="btn btn-primary w-full">Demo</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-screen pt-28 pb-20 px-[5%] overflow-hidden flex items-center bg-[var(--brand-deep)] cinematic-hero">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(var(--brand-rgb),0.15)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(var(--brand-rgb),0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 z-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="floating-orb floating-orb-1 top-1/4 -left-20" />
        <div className="floating-orb floating-orb-2 bottom-1/4 -right-20" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent)' }} />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] text-[0.8rem] font-medium text-white/70 mb-6 backdrop-blur-md">
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--brand-accent)] animate-pulse" />
              {t.heroBadge}
            </div>
            <h1 className="font-heading text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white mb-5">
              {t.heroTitle}{' '}
              <span className="bg-gradient-to-r from-[var(--brand-accent)] to-amber-400 bg-clip-text text-transparent">{t.heroTitleAccent}</span>{' '}
              {t.heroTitleEnd}
            </h1>
            <p className="text-[1.1rem] text-white/60 leading-[1.7] mb-9 max-w-[480px]">{t.heroSub}</p>
            <div className="flex gap-3 flex-wrap mb-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isNavigating}
                onClick={() => navigateTo("/login")}
                className="btn btn-amber btn-lg"
              >
                {t.heroBtn1}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.5)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isNavigating}
                onClick={() => navigateTo("/demo")}
                className="px-7 py-3 rounded-xl bg-transparent text-white border border-white/20 cursor-pointer text-[1rem] font-medium transition-all"
              >
                {t.heroBtn2}
              </motion.button>
            </div>
            <div className="flex gap-7 pt-8 border-t border-[var(--border-light)]">
              {[
                { num: "500+", label: t.stat1 },
                { num: "50K+", label: t.stat2 },
                { num: "99.9%", label: t.stat3 },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="font-heading text-[1.7rem] font-bold text-white">{stat.num}</div>
                  <div className="text-[0.8rem] text-white/40 mt-[2px]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block glass-card p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="font-heading text-[1rem] font-semibold text-white">Dashboard Overview</div>
              <div className="flex gap-[6px]">
                <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)]" />
                <div className="w-2 h-2 rounded-full bg-[var(--brand-light)]" />
                <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: "👩‍🎓", num: "1,248", label: "Students" },
                { icon: "👨‍🏫", num: "86", label: "Teachers" },
                { icon: "📋", num: "24", label: "Classes" },
                { icon: "✅", num: "96%", label: "Attendance", gradient: true },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className={`rounded-[14px] p-4 border border-[var(--border-light)] transition-all ${card.gradient ? "bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-deep)]" : "bg-[var(--bg-tertiary)]"}`}
                >
                  <div className="text-[1.3rem] mb-2">{card.icon}</div>
                  <div className="font-heading text-[1.4rem] font-bold text-white">{card.num}</div>
                  <div className={`text-[0.75rem] mt-[2px] ${card.gradient ? "text-white/60" : "text-white/40"}`}>{card.label}</div>
                </motion.div>
              ))}
            </div>
            <div>
              <div className="text-[0.78rem] font-semibold text-white/40 mb-[10px] tracking-[0.05em] uppercase">Performance</div>
              {[
                { label: "Math", val: "84%", w: 84, color: "var(--brand-accent)" },
                { label: "Science", val: "78%", w: 78, color: "var(--brand-light)" },
                { label: "English", val: "91%", w: 91, color: "var(--brand-primary)" },
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-[10px] mb-2">
                  <div className="text-[0.75rem] text-white/40 w-14 flex-shrink-0">{bar.label}</div>
                  <div className="flex-1 h-[7px] bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.w}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                  </div>
                  <span className="text-[0.75rem] text-white/40">{bar.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] opacity-30" />
      </section>

      {/* About */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-tertiary)]" id="about">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-[var(--brand-primary)] mb-3">{t.aboutLabel}</div>
            <h2 className="font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] mb-4">{t.aboutTitle}</h2>
            <p className="text-[1.05rem] text-[var(--text-muted)] leading-[1.7] max-w-[560px]">{t.aboutSub}</p>
            <div className="flex flex-col gap-3 mt-10">
              {[
                { icon: "🏫", title: t.acard1t, desc: t.acard1d },
                { icon: "📚", title: t.acard2t, desc: t.acard2d },
                { icon: "🎓", title: t.acard3t, desc: t.acard3d },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="card card-hover flex gap-4 items-start p-[18px_20px]"
                >
                  <div className="w-[42px] h-[42px] rounded-[var(--radius-md)] flex-shrink-0 flex items-center justify-center text-[1.1rem] bg-[var(--bg-primary)] border border-[var(--border-light)]">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-heading text-[0.95rem] font-semibold mb-1">{card.title}</h4>
                    <p className="text-[0.85rem] text-[var(--text-muted)] leading-[1.6]">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8"
          >
            <h3 className="font-heading text-[1.1rem] font-semibold mb-6">{t.rolesTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "👑", label: "Admin" },
                { icon: "👨‍🏫", label: "Teacher" },
                { icon: "👩‍🎓", label: "Student" },
                { icon: "👪", label: "Parent" },
                { icon: "👔", label: "Employee" },
                { icon: "📊", label: "Accountant" },
                { icon: "🗂️", label: "Registrar" },
              ].map((role, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.85rem] font-medium cursor-default bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-light)]"
                >
                  {role.icon} {role.label}
                </motion.span>
              ))}
            </div>
            <div className="mt-6 p-5 bg-[var(--bg-tertiary)] rounded-[var(--radius-lg)] border border-[var(--border-light)]">
              <div className="text-[0.8rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em] mb-3">{t.whyTitle}</div>
              <div className="flex flex-col gap-2">
                {[
                  { text: t.why1 },
                  { text: t.why2 },
                  { text: t.why3 },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-center text-[0.88rem] text-[var(--text-secondary)]">
                    <span className="text-[var(--brand-primary)]">→</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-secondary)]" id="features">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <div className="text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-[var(--brand-primary)] mb-3">{t.featLabel}</div>
            <h2 className="font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] mb-4">{t.featTitle}</h2>
            <p className="text-[1.05rem] text-[var(--text-muted)] leading-[1.7] mx-auto">{t.featSub}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { icon: "🔐", title: t.f1t, desc: t.f1d },
              { icon: "🎨", title: t.f2t, desc: t.f2d },
              { icon: "👩‍🎓", title: t.f3t, desc: t.f3d },
              { icon: "👨‍🏫", title: t.f4t, desc: t.f4d },
              { icon: "👪", title: t.f5t, desc: t.f5d },
              { icon: "👔", title: t.f6t, desc: t.f6d },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="card card-hover p-7 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="w-[52px] h-[52px] rounded-[var(--radius-lg)] flex items-center justify-center text-[1.4rem] mb-[18px] bg-[var(--bg-tertiary)] border border-[var(--border-light)]">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-[1.05rem] font-semibold mb-[10px]">{feature.title}</h3>
                <p className="text-[0.9rem] text-[var(--text-muted)] leading-[1.65]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-tertiary)]" id="benefits">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-[var(--brand-primary)] mb-3">{t.benLabel}</div>
            <h2 className="font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] mb-4">{t.benTitle}</h2>
            <p className="text-[1.05rem] text-[var(--text-muted)] leading-[1.7] max-w-[560px]">{t.benSub}</p>
            <div className="mt-9 flex flex-col gap-5">
              {[
                { icon: "⏱", title: t.b1t, desc: t.b1d },
                { icon: "🏛", title: t.b2t, desc: t.b2d },
                { icon: "✨", title: t.b3t, desc: t.b3d },
                { icon: "📈", title: t.b4t, desc: t.b4d },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-primary)] text-[var(--brand-primary)] border border-[var(--border-light)] flex items-center justify-center text-[0.85rem] flex-shrink-0 mt-[2px]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-heading text-[0.95rem] font-semibold mb-1">{item.title}</h4>
                    <p className="text-[0.85rem] text-[var(--text-muted)] leading-[1.65]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: "10×", label: t.bn1 },
              { num: "98%", label: t.bn2 },
              { num: "40%", label: t.bn3 },
              { num: "24/7", label: t.bn4 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="stat-card text-center"
              >
                <div className="font-heading text-[2.2rem] font-bold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-mid)] bg-clip-text text-transparent">{item.num}</div>
                <div className="text-[0.82rem] text-[var(--text-muted)] mt-[6px]">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-secondary)]" id="testimonials">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <div className="text-[0.78rem] font-semibold tracking-[0.1em] uppercase text-[var(--brand-primary)] mb-3">{t.testiLabel}</div>
            <h2 className="font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)]">{t.testiTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { q: t.t1q, name: t.t1n, role: t.t1r, initials: "RA" },
              { q: t.t2q, name: t.t2n, role: t.t2r, initials: "SN" },
              { q: t.t3q, name: t.t3n, role: t.t3r, initials: "MK" },
              { q: t.t4q, name: t.t4n, role: t.t4r, initials: "FH" },
            ].map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="card card-hover p-7 relative"
              >
                <div className="absolute top-5 right-6 text-[3rem] text-[var(--brand-primary)]/10 font-heading leading-none">&ldquo;</div>
                <div className="text-[0.9rem] text-[var(--brand-accent)] mb-3 tracking-[2px]">★★★★★</div>
                <p className="text-[0.9rem] text-[var(--text-muted)] leading-[1.7] italic mb-5">{testi.q}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[0.85rem] font-semibold flex-shrink-0 bg-[var(--bg-tertiary)] text-[var(--brand-primary)] border border-[var(--border-light)]">
                    {testi.initials}
                  </div>
                  <div>
                    <div className="font-heading text-[0.92rem] font-semibold text-[var(--text-primary)]">{testi.name}</div>
                    <div className="text-[0.78rem] text-[var(--text-muted)] mt-[2px]">{testi.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[100px] px-[5%] bg-[var(--brand-deep)] text-center relative overflow-hidden" id="contact">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(var(--brand-rgb),0.12)_0%,transparent_60%)]" />
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-[var(--brand-accent)]/5 blur-[100px]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[700px] mx-auto relative z-10"
        >
          <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold text-white mb-4 tracking-[-0.025em]">{t.ctaTitle}</h2>
          <p className="text-[1.1rem] text-white/60 mb-9">{t.ctaSub}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("/login")}
              className="btn btn-amber btn-lg"
            >
              {t.ctaBtn1}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.4)", y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateTo("/demo")}
              className="px-7 py-3 rounded-xl bg-transparent text-white border border-white/20 cursor-pointer text-[1rem] font-medium transition-all"
            >
              {t.ctaBtn2}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--brand-deep)] text-white/70 py-12 px-[5%] border-t border-[var(--border-light)]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-5">
          <div className="font-heading text-[1.2rem] font-bold text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-mid)] flex items-center justify-center text-white font-extrabold text-sm">G</div>
              GenSchool
            </div>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 text-[0.85rem] no-underline transition-colors hover:text-white">{t.fp1}</a>
            <a href="#" className="text-white/50 text-[0.85rem] no-underline transition-colors hover:text-white">{t.fp2}</a>
            <a href="#" className="text-white/50 text-[0.85rem] no-underline transition-colors hover:text-white">{t.fp3}</a>
            <a href="#" className="text-white/50 text-[0.85rem] no-underline transition-colors hover:text-white">{t.fp4}</a>
          </div>
          <div className="text-[0.82rem] opacity-50">{t.footerCopy}</div>
        </div>
      </footer>
    </>
  );
}