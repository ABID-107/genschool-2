"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

import translationsData from '../data/translations.json';
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/lib/i18n";

const translations: Record<string, any> = translationsData;

export default function Home() {
  const { lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 h-17 flex items-center justify-between px-[5%] transition-shadow duration-300 ${isScrolled ? "glass-nav" : "bg-transparent"
          }`}
      >
        <a href="#" className="flex items-center gap-2.5 text-[1.5rem] font-bold text-[var(--text-primary)] no-underline font-bricolage">
          <div className="w-9 h-9 rounded-[10px] bg-linear-to-br from-brand-primary to-brand-mid flex items-center justify-center text-white font-extrabold">
            G
          </div>
          <span>GenSchool</span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            disabled={isNavigating}
            onClick={() => {
              if (isNavigating) return;
              setIsNavigating(true);
              router.push("/login");
            }}
            className={`px-5 py-2 rounded-[10px] glass-button cursor-pointer text-[.9rem] font-medium ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Login
          </button>
          <button
            disabled={isNavigating}
            onClick={() => {
              if (isNavigating) return;
              setIsNavigating(true);
              router.push("/demo");
            }}
            className={`px-5 py-2 rounded-[10px] glass-button-primary cursor-pointer text-[.9rem] font-medium ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t.demoBtn}
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="min-h-screen pt-30 pb-20 px-[5%] relative overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_20%,rgba(26,86,232,0.06)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(79,70,229,0.04)_0%,transparent_60%)]" />
        <div className="absolute inset-0 z-0 opacity-40 bg-[linear-gradient(rgba(26,86,232,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,232,0.04)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full bg-[#e8f0ff] border border-[rgba(26,86,232,0.2)] text-[.8rem] font-medium text-brand-primary mb-6">
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--brand-primary)] animate-pulse" />
              {t.heroBadge}
            </div>
            <h1 className="font-bricolage text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] mb-5">
              {t.heroTitle} <span className="bg-gradient-to-r from-brand-primary to-brand-mid bg-clip-text text-transparent">{t.heroTitleAccent}</span> {t.heroTitleEnd}
            </h1>
            <p className="text-[1.1rem] text-[var(--text-muted)] leading-[1.7] mb-9 max-w-[480px]">{t.heroSub}</p>
            <div className="flex gap-3 flex-wrap mb-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isNavigating}
                onClick={() => {
                  if (isNavigating) return;
                  setIsNavigating(true);
                  router.push("/login");
                }}
                className={`px-7 py-3 rounded-xl glass-button-primary cursor-pointer text-[1rem] font-medium ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {t.heroBtn1}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "var(--brand-primary)", color: "var(--brand-primary)", backgroundColor: "#e8f0ff" }}
                whileTap={{ scale: 0.98 }}
                disabled={isNavigating}
                onClick={() => {
                  if (isNavigating) return;
                  setIsNavigating(true);
                  router.push("/demo");
                }}
                className={`px-7 py-3 rounded-xl glass-button cursor-pointer text-[1rem] font-medium transition-all ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                  <div className="font-bricolage text-[1.7rem] font-bold text-[var(--text-primary)]">{stat.num}</div>
                  <div className="text-[.8rem] text-[#94a3b8] mt-[2px]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative glass-card p-7"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="font-bricolage text-[1rem] font-semibold">Dashboard Overview</div>
              <div className="flex gap-[6px]">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
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
                  className={`rounded-[14px] p-4 border border-[var(--border-light)] transition-all ${card.gradient ? "bg-gradient-to-br from-brand-primary to-brand-mid" : "bg-[var(--bg-secondary)]"}`}
                >
                  <div className="text-[1.3rem] mb-2">{card.icon}</div>
                  <div className={`font-bricolage text-[1.4rem] font-bold ${card.gradient ? "text-white" : "text-[var(--text-primary)]"}`}>{card.num}</div>
                  <div className={`text-[.75rem] mt-[2px] ${card.gradient ? "text-white/70" : "text-[#94a3b8]"}`}>{card.label}</div>
                </motion.div>
              ))}
            </div>
            <div>
              <div className="text-[.78rem] font-semibold text-[var(--text-muted)] mb-[10px] tracking-[.05em] uppercase">Performance</div>
              {[
                { label: "Math", val: "84%", w: 84, color: "var(--brand-primary)" },
                { label: "Science", val: "78%", w: 78, color: "#10b981" },
                { label: "English", val: "91%", w: 91, color: "#f59e0b" },
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-[10px] mb-2">
                  <div className="text-[.75rem] text-[var(--text-muted)] w-14 flex-shrink-0">{bar.label}</div>
                  <div className="flex-1 h-[7px] bg-[#eef1f8] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.w}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                  </div>
                  <span className="text-[.75rem] text-[var(--text-muted)]">{bar.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-mid opacity-20" />
      </section>

      {/* About */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-tertiary)] animate-in" id="about">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-brand-primary mb-3">{t.aboutLabel}</div>
            <h2 className="font-bricolage text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] mb-4">{t.aboutTitle}</h2>
            <p className="text-[1.05rem] text-[var(--text-muted)] leading-[1.7] max-w-[560px]">{t.aboutSub}</p>
            <div className="flex flex-col gap-3 mt-10">
              {[
                { icon: "🏫", bg: "#eff6ff", title: t.acard1t, desc: t.acard1d },
                { icon: "📚", bg: "#f0fdf4", title: t.acard2t, desc: t.acard2d },
                { icon: "🎓", bg: "#fef3c7", title: t.acard3t, desc: t.acard3d },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 items-start bg-[var(--bg-secondary)] rounded-[14px] p-[18px_20px] border border-[var(--border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
                >
                  <div
                    className="w-[42px] h-[42px] rounded-[10px] flex-shrink-0 flex items-center justify-center text-[1.1rem]"
                    style={{ backgroundColor: card.bg }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-bricolage text-[.95rem] font-semibold mb-1">{card.title}</h4>
                    <p className="text-[.85rem] text-[var(--text-muted)] leading-[1.6]">{card.desc}</p>
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
            className="bg-[var(--bg-secondary)] rounded-[28px] border border-[var(--border-light)] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
          >
            <h3 className="font-bricolage text-[1.1rem] font-semibold mb-6">{t.rolesTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "👑", bg: "#eff6ff", color: "var(--brand-primary)", label: "Admin" },
                { icon: "👨‍🏫", bg: "#f0fdf4", color: "#10b981", label: "Teacher" },
                { icon: "👩‍🎓", bg: "#fef3c7", color: "#d97706", label: "Student" },
                { icon: "👪", bg: "#fdf2f8", color: "#db2777", label: "Parent" },
                { icon: "👔", bg: "#f5f3ff", color: "#7c3aed", label: "Employee" },
                { icon: "📊", bg: "#fff1f2", color: "#e11d48", label: "Accountant" },
                { icon: "🗂️", bg: "#ecfdf5", color: "#059669", label: "Registrar" },
              ].map((role, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-4 px-4 py-2 rounded-xl text-[.85rem] font-medium cursor-default mx-1"
                  style={{ backgroundColor: role.bg, color: role.color }}
                >
                  {role.icon} {role.label}
                </motion.span>
              ))}
            </div>
            <div className="mt-6 p-5 bg-[var(--bg-tertiary)] rounded-[14px] border border-[var(--border-light)]">
              <div className="text-[.8rem] font-semibold text-[var(--text-muted)] uppercase tracking-[.06em] mb-3">{t.whyTitle}</div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "→", text: t.why1 },
                  { icon: "→", text: t.why2 },
                  { icon: "→", text: t.why3 },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-center text-[.88rem]">
                    <span style={{ color: "var(--brand-primary)" }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-secondary)] animate-in" id="features">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-brand-primary mb-3">{t.featLabel}</div>
            <h2 className="font-bricolage text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] mb-4">{t.featTitle}</h2>
            <p className="text-[1.05rem] text-[var(--text-muted)] leading-[1.7] mx-auto">{t.featSub}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {[
              { icon: "🔐", bg: "#eff6ff", title: t.f1t, desc: t.f1d },
              { icon: "🎨", bg: "#f0fdf4", title: t.f2t, desc: t.f2d },
              { icon: "👩‍🎓", bg: "#fef3c7", title: t.f3t, desc: t.f3d },
              { icon: "👨‍🏫", bg: "#fdf2f8", title: t.f4t, desc: t.f4d },
              { icon: "👪", bg: "#f5f3ff", title: t.f5t, desc: t.f5d },
              { icon: "👔", bg: "#fff1f2", title: t.f6t, desc: t.f6d },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[var(--bg-secondary)] rounded-[20px] p-7 border border-[var(--border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] relative overflow-hidden group glow-on-hover"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-primary to-brand-mid opacity-0 transition-opacity group-hover:opacity-100" />
                <div
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[1.4rem] mb-[18px]"
                  style={{ backgroundColor: feature.bg }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bricolage text-[1.05rem] font-semibold mb-[10px]">{feature.title}</h3>
                <p className="text-[.9rem] text-[var(--text-muted)] leading-[1.65]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-tertiary)] animate-in" id="benefits">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-brand-primary mb-3">{t.benLabel}</div>
            <h2 className="font-bricolage text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] mb-4">{t.benTitle}</h2>
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
                  <div className="w-7 h-7 rounded-full bg-[#e8f0ff] text-brand-primary flex items-center justify-center text-[.85rem] flex-shrink-0 mt-[2px]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bricolage text-[.95rem] font-semibold mb-1">{item.title}</h4>
                    <p className="text-[.85rem] text-[var(--text-muted)] leading-[1.65]">{item.desc}</p>
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
                className="bg-[var(--bg-secondary)] rounded-[20px] p-7 border border-[var(--border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] text-center glow-on-hover"
              >
                <div className="font-bricolage text-[2.2rem] font-bold bg-gradient-to-r from-brand-primary to-brand-mid bg-clip-text text-transparent">{item.num}</div>
                <div className="text-[.82rem] text-[var(--text-muted)] mt-[6px]">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[100px] px-[5%] bg-[var(--bg-secondary)] animate-in" id="testimonials">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-brand-primary mb-3">{t.testiLabel}</div>
            <h2 className="font-bricolage text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)]">{t.testiTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { q: t.t1q, name: t.t1n, role: t.t1r, initials: "RA", bg: "#eff6ff", color: "var(--brand-primary)" },
              { q: t.t2q, name: t.t2n, role: t.t2r, initials: "SN", bg: "#f0fdf4", color: "#10b981" },
              { q: t.t3q, name: t.t3n, role: t.t3r, initials: "MK", bg: "#fef3c7", color: "#d97706" },
              { q: t.t4q, name: t.t4n, role: t.t4r, initials: "FH", bg: "#fdf2f8", color: "#db2777" },
            ].map((testi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[var(--bg-secondary)] rounded-[20px] p-7 border border-[var(--border-light)] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] relative glow-on-hover"
              >
                <div className="absolute top-5 right-6 text-[3rem] text-[#e8f0ff] font-serif leading-none">&ldquo;</div>
                <div className="text-[.9rem] text-[#f59e0b] mb-3 tracking-[2px]">★★★★★</div>
                <p className="text-[.9rem] text-[var(--text-muted)] leading-[1.7] italic mb-5">{testi.q}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[.85rem] font-semibold flex-shrink-0"
                    style={{ backgroundColor: testi.bg, color: testi.color }}
                  >
                    {testi.initials}
                  </div>
                  <div>
                    <div className="font-bricolage text-[.92rem] font-semibold">{testi.name}</div>
                    <div className="text-[.78rem] text-[#94a3b8] mt-[2px]">{testi.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[100px] px-[5%] bg-gradient-to-br from-brand-primary to-brand-mid text-center" id="contact">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[700px] mx-auto"
        >
          <h2 className="font-bricolage text-[clamp(2rem,3.5vw,3rem)] font-bold text-white mb-4 tracking-[-0.025em]">{t.ctaTitle}</h2>
          <p className="text-[1.1rem] text-white/80 mb-9">{t.ctaSub}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/login")}
              className="px-7 py-3 rounded-xl bg-white text-brand-primary border-none cursor-pointer text-[1rem] font-semibold transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            >
              {t.ctaBtn1}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#fff", y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/demo")}
              className="px-7 py-3 rounded-xl bg-transparent text-white border-[1.5px] border-white/50 cursor-pointer text-[1rem] font-medium transition-all"
            >
              {t.ctaBtn2}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white/70 py-12 px-[5%]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-5">
          <div className="font-bricolage text-[1.2rem] font-bold text-white">GenSchool</div>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 text-[.85rem] no-underline transition-colors hover:text-white">{t.fp1}</a>
            <a href="#" className="text-white/60 text-[.85rem] no-underline transition-colors hover:text-white">{t.fp2}</a>
            <a href="#" className="text-white/60 text-[.85rem] no-underline transition-colors hover:text-white">{t.fp3}</a>
            <a href="#" className="text-white/60 text-[.85rem] no-underline transition-colors hover:text-white">{t.fp4}</a>
          </div>
          <div className="text-[.82rem] opacity-50">{t.footerCopy}</div>
        </div>
      </footer>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-5"
            onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[var(--bg-secondary)] rounded-[28px] p-9 max-w-[640px] w-full shadow-[0_12px_40px_rgba(15,23,42,0.12)] relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-light)] cursor-pointer flex items-center justify-center text-[var(--text-muted)] transition-all hover:bg-[#eef1f8] hover:text-[var(--text-primary)]"
              >
                ✕
              </button>
              <h3 className="font-bricolage text-[1.5rem] font-bold mb-2">{t.modalTitle}</h3>
              <p className="text-[.9rem] text-[var(--text-muted)] mb-7">{t.modalSub}</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: "👨‍🏫", name: t.r2n, desc: t.r2d },
                  { icon: "👩‍🎓", name: t.r3n, desc: t.r3d },
                  { icon: "👪", name: t.r4n, desc: t.r4d },
                  { icon: "👔", name: t.r5n, desc: t.r5d },
                ].map((role, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4 }}
                    onClick={(e) => {
                      const target = e.currentTarget;
                      target.style.borderColor = "var(--brand-primary)";
                      target.style.backgroundColor = "#e8f0ff";
                      setTimeout(() => {
                        target.style.borderColor = "transparent";
                        target.style.backgroundColor = "var(--bg-tertiary)";
                      }, 1200);
                    }}
                    className="bg-[var(--bg-tertiary)] rounded-[14px] p-5 text-center border-[1.5px] border-transparent cursor-pointer transition-all hover:bg-[#e8f0ff] hover:border-[var(--brand-primary)] hover:shadow-[0_8px_24px_rgba(26,86,232,0.15)] glow-on-hover"
                  >
                    <div className="text-[1.8rem] mb-[10px]">{role.icon}</div>
                    <div className="font-bricolage text-[.85rem] font-semibold text-[var(--text-primary)]">{role.name}</div>
                    <div className="text-[.72rem] text-[#94a3b8] mt-1">{role.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
