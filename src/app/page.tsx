"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const translations = {
  en: {
    heroBadge: "Now serving 500+ institutions",
    heroTitle: "All-in-One",
    heroTitleAccent: "Smart Education",
    heroTitleEnd: "Management Platform",
    heroSub: "GenSchool unifies every corner of your institution — students, teachers, parents, and staff — into one beautifully simple platform.",
    heroBtn1: "Get Started",
    heroBtn2: "View Demo",
    stat1: "Institutions",
    stat2: "Students Managed",
    stat3: "Uptime",
    aboutLabel: "About GenSchool",
    aboutTitle: "Education management, reimagined for the modern era",
    aboutSub: "GenSchool was built to solve a fundamental challenge: institutions using dozens of disconnected tools, causing data loss, miscommunication, and wasted time. We built one platform to replace them all.",
    acard1t: "Schools & Colleges",
    acard1d: "Full academic lifecycle from admissions to graduation, all in one place.",
    acard2t: "Coaching Centers",
    acard2d: "Batch management, flexible scheduling, and fee tracking built for coaching.",
    acard3t: "Universities",
    acard3d: "Scalable multi-department management with powerful reporting tools.",
    rolesTitle: "Multi-Role Access System",
    whyTitle: "Why GenSchool?",
    why1: "Replaces 10+ fragmented tools with one unified system",
    why2: "Real-time communication between all stakeholders",
    why3: "Configurable for any institution size or type",
    featLabel: "Key Features",
    featTitle: "Everything your institution needs",
    featSub: "Powerful tools crafted for every role, every workflow, every institution type.",
    f1t: "Multi-Role Login System",
    f1d: "Secure, separate portals for admins, teachers, students, parents, and employees — each with tailored dashboards and access permissions.",
    f2t: "Customizable Portals",
    f2d: "Brand the platform with your institution's logo, colors, and domain. Configure workflows to match exactly how your school operates.",
    f3t: "Student Management",
    f3d: "Full student profiles, attendance tracking, grade books, report cards, and progress monitoring — everything a school needs in one view.",
    f4t: "Teacher Management",
    f4d: "Class scheduling, lesson planning, gradebook management, leave tracking, and performance evaluations all in one workspace.",
    f5t: "Parent Communication",
    f5d: "Keep parents informed with real-time updates on attendance, results, and announcements. In-app messaging and push notifications included.",
    f6t: "Employee Management",
    f6d: "HR workflows for non-teaching staff — payroll, leave management, task assignments, and performance tracking made effortless.",
    benLabel: "Why Choose Us",
    benTitle: "Built to make institutions thrive",
    benSub: "GenSchool doesn't just digitize your school — it transforms how your institution operates, communicates, and grows.",
    b1t: "Saves Time — 10+ hours/week",
    b1d: "Automate repetitive tasks like attendance, fee reminders, and report generation. Focus on education, not paperwork.",
    b2t: "Centralized System",
    b2d: "One source of truth for all institutional data. No more scattered spreadsheets, missing records, or duplicate entries.",
    b3t: "Easy to Use — No Training Needed",
    b3d: "Designed with simplicity in mind. Staff can get started in minutes with our intuitive interface and guided onboarding.",
    b4t: "Scales With Your Institution",
    b4d: "Whether you manage 50 students or 50,000, GenSchool scales seamlessly. Add campuses, roles, and departments at any time.",
    bn1: "Faster Reporting",
    bn2: "Customer Satisfaction",
    bn3: "Cost Reduction",
    bn4: "Support Available",
    testiLabel: "Testimonials",
    testiTitle: "Trusted by institutions across Bangladesh",
    t1q: "GenSchool transformed how we manage our school. Parent communication, attendance, and exams — all from one screen. I can&apos;t imagine going back.",
    t1n: "Rafiqul Alam",
    t1r: "Principal, Dhaka Model School",
    t2q: "As a teacher, the gradebook and lesson planner alone are worth it. Parents get real-time updates and the admin load on us dropped by half.",
    t2n: "Sharmila Nandi",
    t2r: "Senior Teacher, Chittagong College",
    t3q: "Finally a system that speaks my language — both literally and figuratively. The Bangla interface and local support made adoption smooth for our entire staff.",
    t3n: "Mohammed Karim",
    t3r: "Director, Sylhet Coaching Center",
    t4q: "As a parent I can track my child's attendance, results, and fees from my phone. GenSchool keeps me connected to my child's education every single day.",
    t4n: "Fatima Hossain",
    t4r: "Parent, Rajshahi International School",
    ctaTitle: "Ready to transform your institution?",
    ctaSub: "Join 500+ schools already running smarter with GenSchool. Setup takes less than a day.",
    ctaBtn1: "Start Free Trial",
    ctaBtn2: "Explore Demo",
    fp1: "Privacy",
    fp2: "Terms",
    fp3: "Support",
    fp4: "Contact",
    footerCopy: "© 2025 GenSchool. All rights reserved.",
    modalTitle: "Choose Your Portal",
    modalSub: "Select a role to explore the demo experience tailored just for you.",
    r1n: "Admin",
    r1d: "Full control",
    r2n: "Teacher",
    r2d: "Class & grades",
    r3n: "Student",
    r3d: "Learn & track",
    r4n: "Parent",
    r4d: "Stay informed",
    r5n: "Employee",
    r5d: "HR & tasks",
    demoBtn: "Demo",
  },
  bn: {
    heroBadge: "৫০০+ প্রতিষ্ঠানকে সেবা দিচ্ছে",
    heroTitle: "সব-এক-তে",
    heroTitleAccent: "স্মার্ট শিক্ষা",
    heroTitleEnd: "ব্যবস্থাপনা প্ল্যাটফর্ম",
    heroSub: "জেনস্কুল আপনার প্রতিষ্ঠানের শিক্ষার্থী, শিক্ষক, অভিভাবক এবং কর্মীদের একটি সুন্দর ও সহজ প্ল্যাটফর্মে একত্রিত করে।",
    heroBtn1: "শুরু করুন",
    heroBtn2: "ডেমো দেখুন",
    stat1: "প্রতিষ্ঠান",
    stat2: "শিক্ষার্থী পরিচালিত",
    stat3: "আপটাইম",
    aboutLabel: "জেনস্কুল সম্পর্কে",
    aboutTitle: "আধুনিক যুগের জন্য পুনর্কল্পিত শিক্ষা ব্যবস্থাপনা",
    aboutSub: "জেনস্কুল একটি মৌলিক সমস্যার সমাধান করতে তৈরি হয়েছে: প্রতিষ্ঠানগুলো অনেক আলাদা টুল ব্যবহার করে তথ্য হারায়, ভুল বোঝাবুঝি হয় এবং সময় নষ্ট হয়। আমরা সবগুলোকে প্রতিস্থাপন করতে একটি প্ল্যাটফর্ম তৈরি করেছি।",
    acard1t: "স্কুল ও কলেজ",
    acard1d: "ভর্তি থেকে স্নাতক পর্যন্ত সম্পূর্ণ একাডেমিক জীবনচক্র, সব এক জায়গায়।",
    acard2t: "কোচিং সেন্টার",
    acard2d: "ব্যাচ ম্যানেজমেন্ট, নমনীয় সময়সূচী এবং ফি ট্র্যাকিং।",
    acard3t: "বিশ্ববিদ্যালয়",
    acard3d: "শক্তিশালী রিপোর্টিং সহ স্কেলযোগ্য মাল্টি-বিভাগ ব্যবস্থাপনা।",
    rolesTitle: "মাল্টি-রোল অ্যাক্সেস সিস্টেম",
    whyTitle: "কেন জেনস্কুল?",
    why1: "১০+ বিচ্ছিন্ন টুলকে একটি ঐক্যবদ্ধ সিস্টেমে প্রতিস্থাপন করে",
    why2: "সকল স্টেকহোল্ডারের মধ্যে রিয়েল-টাইম যোগাযোগ",
    why3: "যেকোনো প্রতিষ্ঠানের আকার বা ধরনের জন্য কনফিগারযোগ্য",
    featLabel: "মূল বৈশিষ্ট্য",
    featTitle: "আপনার প্রতিষ্ঠানের জন্য সব কিছু",
    featSub: "প্রতিটি ভূমিকা, প্রতিটি ওয়ার্কফ্লো, প্রতিটি প্রতিষ্ঠানের ধরনের জন্য তৈরি শক্তিশালী টুল।",
    f1t: "মাল্টি-রোল লগইন সিস্টেম",
    f1d: "অ্যাডমিন, শিক্ষক, শিক্ষার্থী, অভিভাবক এবং কর্মীদের জন্য আলাদা নিরাপদ পোর্টাল — প্রতিটির জন্য কাস্টম ড্যাশবোর্ড এবং অ্যাক্সেস পারমিশন।",
    f2t: "কাস্টমাইজযোগ্য পোর্টাল",
    f2d: "আপনার প্রতিষ্ঠানের লোগো, রং এবং ডোমেইন দিয়ে প্ল্যাটফর্ম ব্র্যান্ড করুন। আপনার স্কুল যেভাবে কাজ করে সেই অনুযায়ী ওয়ার্কফ্লো কনফিগার করুন।",
    f3t: "শিক্ষার্থী ব্যবস্থাপনা",
    f3d: "সম্পূর্ণ প্রোফাইল, উপস্থিতি ট্র্যাকিং, গ্রেডবুক, রিপোর্ট কার্ড এবং অগ্রগতি পর্যবেক্ষণ — একটি ভিউতে একটি স্কুলের জন্য প্রয়োজনীয় সব কিছু।",
    f4t: "শিক্ষক ব্যবস্থাপনা",
    f4d: "ক্লাস শিডিউলিং, পাঠ পরিকল্পনা, গ্রেডবুক ব্যবস্থাপনা, ছুটি ট্র্যাকিং এবং পারফরম্যান্স ইভ্যালুয়েশন সব এক ওয়ার্কস্পেসে।",
    f5t: "অভিভাবক যোগাযোগ",
    f5d: "উপস্থিতি, ফলাফল এবং ঘোষণার রিয়েল-টাইম আপডেট দিয়ে অভিভাবকদের সচেতন রাখুন। ইন-অ্যাপ মেসেজিং এবং পুশ নোটিফিকেশন অন্তর্ভুক্ত।",
    f6t: "কর্মী ব্যবস্থাপনা",
    f6d: "শিক্ষণ-বহির্ভূত কর্মীদের জন্য HR ওয়ার্কফ্লো — বেতন, ছুটি ব্যবস্থাপনা, কাজ বরাদ্দ এবং পারফরম্যান্স ট্র্যাকিং সহজ।",
    benLabel: "কেন আমাদের বেছে নেবেন",
    benTitle: "প্রতিষ্ঠানকে সমৃদ্ধ করতে নির্মিত",
    benSub: "জেনস্কুল শুধু আপনার স্কুলকে ডিজিটাইজ করে না — এটি আপনার প্রতিষ্ঠানের পরিচালনা, যোগাযোগ এবং বিকাশকে রূপান্তরিত করে।",
    b1t: "সময় বাঁচায় — সপ্তাহে ১০+ ঘন্টা",
    b1d: "উপস্থিতি, ফি রিমাইন্ডার এবং রিপোর্ট তৈরি করার মতো পুনরাবৃত্তিমূলক কাজগুলি স্বয়ংক্রিয় করুন। কাগজের কাজ নয়, শিক্ষার উপর মনোযোগ দিন।",
    b2t: "কেন্দ্রীভূত সিস্টেম",
    b2d: "সমস্ত প্রাতিষ্ঠানিক তথ্যের জন্য একটি সত্যের উৎস। আর বিক্ষিপ্ত স্প্রেডশিট, হারানো রেকর্ড বা ডুপ্লিকেট এন্ট্রি নেই।",
    b3t: "ব্যবহার করা সহজ — কোনো প্রশিক্ষণ দরকার নেই",
    b3d: "সরলতার কথা মাথায় রেখে ডিজাইন করা হয়েছে। কর্মীরা আমাদের সহজ ইন্টারফেস এবং গাইডেড অনবোর্ডিংয়ের মিনিটের মধ্যে শুরু করতে পারেন।",
    b4t: "আপনার প্রতিষ্ঠানের সাথে স্কেল করে",
    b4d: "আপনি ৫০ বা ৫০,০০০ শিক্ষার্থী পরিচালনা করুন না কেন, জেনস্কুল নির্বিঘ্নে স্কেল করে। যেকোনো সময় ক্যাম্পাস, রোল এবং বিভাগ যোগ করুন।",
    bn1: "দ্রুততর রিপোর্টিং",
    bn2: "গ্রাহক সন্তুষ্টি",
    bn3: "খরচ কমানো",
    bn4: "সাপোর্ট উপলব্ধ",
    testiLabel: "প্রশংসাপত্র",
    testiTitle: "বাংলাদেশের প্রতিষ্ঠানগুলোর বিশ্বাসের সঙ্গী",
    t1q: "জেনস্কুল আমাদের স্কুল পরিচালনার পদ্ধতি পরিবর্তন করে দিয়েছে। অভিভাবক যোগাযোগ, উপস্থিতি, এবং পরীক্ষা — সব একটি স্ক্রিন থেকে। ফিরে যাওয়ার কথা ভাবতে পারি না।",
    t1n: "রফিকুল আলম",
    t1r: "অধ্যক্ষ, ঢাকা মডেল স্কুল",
    t2q: "একজন শিক্ষক হিসেবে, গ্রেডবুক এবং পাঠ পরিকল্পনার টুল একাই মূল্যবান। অভিভাবকরা রিয়েল-টাইম আপডেট পায় এবং আমাদের প্রশাসনিক কাজের চাপ অর্ধেকে নেমে এসেছে।",
    t2n: "শর্মিলা নন্দী",
    t2r: "সিনিয়র শিক্ষক, চট্টগ্রাম কলেজ",
    t3q: "অবশেষে একটি সিস্টেম যা আমার ভাষায় কথা বলে — আক্ষরিক এবং রূপক উভয় অর্থেই। বাংলা ইন্টারফেস এবং স্থানীয় সাপোর্ট আমাদের পুরো কর্মীদের জন্য গ্রহণ সহজ করেছে।",
    t3n: "মোহাম্মদ করিম",
    t3r: "পরিচালক, সিলেট কোচিং সেন্টার",
    t4q: "একজন অভিভাবক হিসেবে আমি আমার ফোন থেকে আমার সন্তানের উপস্থিতি, ফলাফল এবং ফি ট্র্যাক করতে পারি। জেনস্কুল আমাকে প্রতিদিন আমার সন্তানের শিক্ষার সাথে সংযুক্ত রাখে।",
    t4n: "ফাতিমা হোসেন",
    t4r: "অভিভাবক, রাজশাহী ইন্টারন্যাশনাল স্কুল",
    ctaTitle: "আপনার প্রতিষ্ঠান রূপান্তরিত করতে প্রস্তুত?",
    ctaSub: "জেনস্কুলের সাথে ইতিমধ্যে ৫০০+ স্কুল স্মার্টভাবে চলছে। সেটআপ একদিনেরও কম সময়ে হয়।",
    ctaBtn1: "বিনামূল্যে শুরু করুন",
    ctaBtn2: "ডেমো অন্বেষণ করুন",
    fp1: "গোপনীয়তা",
    fp2: "শর্তাবলী",
    fp3: "সাপোর্ট",
    fp4: "যোগাযোগ",
    footerCopy: "© ২০২৫ জেনস্কুল। সর্বস্বত্ব সংরক্ষিত।",
    modalTitle: "আপনার পোর্টাল বেছে নিন",
    modalSub: "আপনার জন্য কাস্টমাইজড ডেমো অভিজ্ঞতা অন্বেষণ করতে একটি ভূমিকা বেছে নিন।",
    r1n: "অ্যাডমিন",
    r1d: "সম্পূর্ণ নিয়ন্ত্রণ",
    r2n: "শিক্ষক",
    r2d: "ক্লাস ও গ্রেড",
    r3n: "শিক্ষার্থী",
    r3d: "শেখা ও ট্র্যাক",
    r4n: "অভিভাবক",
    r4d: "সচেতন থাকুন",
    r5n: "কর্মী",
    r5d: "HR ও কাজ",
    demoBtn: "ডেমো",
  },
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "bn" : "en"));
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-[5%] border-b transition-shadow duration-300 ${isScrolled ? "bg-white/88 backdrop-blur-xl shadow-[0_4px_16px_rgba(15,23,42,0.08)]" : "bg-white/88 backdrop-blur-xl border-[#e2e8f0]"
          }`}
      >
        <a href="#" className="flex items-center gap-[10px] text-[1.5rem] font-bold text-[#0f172a] no-underline font-['Bricolage_Grotesque']">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1a56e8] to-[#4f46e5] flex items-center justify-center text-white font-extrabold">
            G
          </div>
          <span>GenSchool</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-4 py-[7px] rounded-lg border border-[#e2e8f0] bg-transparent cursor-pointer text-[.85rem] font-medium text-[#475569] transition-all hover:border-[#1a56e8] hover:text-[#1a56e8] hover:bg-[#e8f0ff]"
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-[10px] bg-[#1a56e8] text-white border-none cursor-pointer text-[.9rem] font-medium transition-all hover:bg-[#0f3ab5] hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(26,86,232,0.35)] shadow-[0_2px_8px_rgba(26,86,232,0.25)]"
          >
            {t.demoBtn}
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="min-h-screen pt-[120px] pb-[80px] px-[5%] relative overflow-hidden flex items-center bg-white">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_20%,rgba(26,86,232,0.06)_0%,transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(79,70,229,0.04)_0%,transparent_60%)]" />
        <div className="absolute inset-0 z-0 opacity-40 bg-[linear-gradient(rgba(26,86,232,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,86,232,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative z-10 max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full bg-[#e8f0ff] border border-[rgba(26,86,232,0.2)] text-[.8rem] font-medium text-[#1a56e8] mb-6">
              <span className="w-[7px] h-[7px] rounded-full bg-[#1a56e8] animate-pulse" />
              {t.heroBadge}
            </div>
            <h1 className="font-['Bricolage_Grotesque'] text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#0f172a] mb-5">
              {t.heroTitle} <span className="bg-gradient-to-r from-[#1a56e8] to-[#4f46e5] bg-clip-text text-transparent">{t.heroTitleAccent}</span> {t.heroTitleEnd}
            </h1>
            <p className="text-[1.1rem] text-[#475569] leading-[1.7] mb-9 max-w-[480px]">{t.heroSub}</p>
            <div className="flex gap-3 flex-wrap mb-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3 rounded-xl bg-[#1a56e8] text-white border-none cursor-pointer text-[1rem] font-medium transition-all hover:bg-[#0f3ab5] hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(26,86,232,0.4)] shadow-[0_4px_16px_rgba(26,86,232,0.3)]"
              >
                {t.heroBtn1}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, borderColor: "#1a56e8", color: "#1a56e8", backgroundColor: "#e8f0ff" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="px-7 py-3 rounded-xl bg-transparent text-[#0f172a] border-[1.5px] border-[#e2e8f0] cursor-pointer text-[1rem] font-medium transition-all"
              >
                {t.heroBtn2}
              </motion.button>
            </div>
            <div className="flex gap-7 pt-8 border-t border-[#e2e8f0]">
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
                  <div className="font-['Bricolage_Grotesque'] text-[1.7rem] font-bold text-[#0f172a]">{stat.num}</div>
                  <div className="text-[.8rem] text-[#94a3b8] mt-[2px]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block relative rounded-[28px] bg-[#f8f9fc] border border-[#e2e8f0] p-7 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="font-['Bricolage_Grotesque'] text-[1rem] font-semibold">Dashboard Overview</div>
              <div className="flex gap-[6px]">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                <div className="w-2 h-2 rounded-full bg-[#1a56e8]" />
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
                  className={`rounded-[14px] p-4 border border-[#e2e8f0] transition-all ${card.gradient ? "bg-gradient-to-br from-[#1a56e8] to-[#4f46e5]" : "bg-white"}`}
                >
                  <div className="text-[1.3rem] mb-2">{card.icon}</div>
                  <div className={`font-['Bricolage_Grotesque'] text-[1.4rem] font-bold ${card.gradient ? "text-white" : "text-[#0f172a]"}`}>{card.num}</div>
                  <div className={`text-[.75rem] mt-[2px] ${card.gradient ? "text-white/70" : "text-[#94a3b8]"}`}>{card.label}</div>
                </motion.div>
              ))}
            </div>
            <div>
              <div className="text-[.78rem] font-semibold text-[#475569] mb-[10px] tracking-[.05em] uppercase">Performance</div>
              {[
                { label: "Math", val: "84%", w: 84, color: "#1a56e8" },
                { label: "Science", val: "78%", w: 78, color: "#10b981" },
                { label: "English", val: "91%", w: 91, color: "#f59e0b" },
              ].map((bar, i) => (
                <div key={i} className="flex items-center gap-[10px] mb-2">
                  <div className="text-[.75rem] text-[#475569] w-14 flex-shrink-0">{bar.label}</div>
                  <div className="flex-1 h-[7px] bg-[#eef1f8] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.w}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                  </div>
                  <span className="text-[.75rem] text-[#475569]">{bar.val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="py-[100px] px-[5%] bg-[#f8f9fc]" id="about">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-[#1a56e8] mb-3">{t.aboutLabel}</div>
            <h2 className="font-['Bricolage_Grotesque'] text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#0f172a] mb-4">{t.aboutTitle}</h2>
            <p className="text-[1.05rem] text-[#475569] leading-[1.7] max-w-[560px]">{t.aboutSub}</p>
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
                  className="flex gap-4 items-start bg-white rounded-[14px] p-[18px_20px] border border-[#e2e8f0] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)]"
                >
                  <div
                    className="w-[42px] h-[42px] rounded-[10px] flex-shrink-0 flex items-center justify-center text-[1.1rem]"
                    style={{ backgroundColor: card.bg }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="font-['Bricolage_Grotesque'] text-[.95rem] font-semibold mb-1">{card.title}</h4>
                    <p className="text-[.85rem] text-[#475569] leading-[1.6]">{card.desc}</p>
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
            className="bg-white rounded-[28px] border border-[#e2e8f0] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
          >
            <h3 className="font-['Bricolage_Grotesque'] text-[1.1rem] font-semibold mb-6">{t.rolesTitle}</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "👑", bg: "#eff6ff", color: "#1a56e8", label: "Admin" },
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
            <div className="mt-6 p-5 bg-[#f8f9fc] rounded-[14px] border border-[#e2e8f0]">
              <div className="text-[.8rem] font-semibold text-[#475569] uppercase tracking-[.06em] mb-3">{t.whyTitle}</div>
              <div className="flex flex-col gap-2">
                {[
                  { icon: "→", text: t.why1 },
                  { icon: "→", text: t.why2 },
                  { icon: "→", text: t.why3 },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 items-center text-[.88rem]">
                    <span style={{ color: "#1a56e8" }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-[100px] px-[5%] bg-white" id="features">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-[#1a56e8] mb-3">{t.featLabel}</div>
            <h2 className="font-['Bricolage_Grotesque'] text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#0f172a] mb-4">{t.featTitle}</h2>
            <p className="text-[1.05rem] text-[#475569] leading-[1.7] mx-auto">{t.featSub}</p>
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
                className="bg-white rounded-[20px] p-7 border border-[#e2e8f0] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1a56e8] to-[#4f46e5] opacity-0 transition-opacity group-hover:opacity-100" />
                <div
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[1.4rem] mb-[18px]"
                  style={{ backgroundColor: feature.bg }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-['Bricolage_Grotesque'] text-[1.05rem] font-semibold mb-[10px]">{feature.title}</h3>
                <p className="text-[.9rem] text-[#475569] leading-[1.65]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-[100px] px-[5%] bg-[#f8f9fc]" id="benefits">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[80px] items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-[#1a56e8] mb-3">{t.benLabel}</div>
            <h2 className="font-['Bricolage_Grotesque'] text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#0f172a] mb-4">{t.benTitle}</h2>
            <p className="text-[1.05rem] text-[#475569] leading-[1.7] max-w-[560px]">{t.benSub}</p>
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
                  <div className="w-7 h-7 rounded-full bg-[#e8f0ff] text-[#1a56e8] flex items-center justify-center text-[.85rem] flex-shrink-0 mt-[2px]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-['Bricolage_Grotesque'] text-[.95rem] font-semibold mb-1">{item.title}</h4>
                    <p className="text-[.85rem] text-[#475569] leading-[1.65]">{item.desc}</p>
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
                className="bg-white rounded-[20px] p-7 border border-[#e2e8f0] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] text-center"
              >
                <div className="font-['Bricolage_Grotesque'] text-[2.2rem] font-bold bg-gradient-to-r from-[#1a56e8] to-[#4f46e5] bg-clip-text text-transparent">{item.num}</div>
                <div className="text-[.82rem] text-[#475569] mt-[6px]">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[100px] px-[5%] bg-white" id="testimonials">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-[600px] mx-auto mb-14"
          >
            <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-[#1a56e8] mb-3">{t.testiLabel}</div>
            <h2 className="font-['Bricolage_Grotesque'] text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#0f172a]">{t.testiTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {[
              { q: t.t1q, name: t.t1n, role: t.t1r, initials: "RA", bg: "#eff6ff", color: "#1a56e8" },
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
                className="bg-white rounded-[20px] p-7 border border-[#e2e8f0] shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-all hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] relative"
              >
                <div className="absolute top-5 right-6 text-[3rem] text-[#e8f0ff] font-serif leading-none">&ldquo;</div>
                <div className="text-[.9rem] text-[#f59e0b] mb-3 tracking-[2px]">★★★★★</div>
                <p className="text-[.9rem] text-[#475569] leading-[1.7] italic mb-5">{testi.q}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[.85rem] font-semibold flex-shrink-0"
                    style={{ backgroundColor: testi.bg, color: testi.color }}
                  >
                    {testi.initials}
                  </div>
                  <div>
                    <div className="font-['Bricolage_Grotesque'] text-[.92rem] font-semibold">{testi.name}</div>
                    <div className="text-[.78rem] text-[#94a3b8] mt-[2px]">{testi.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[100px] px-[5%] bg-gradient-to-br from-[#1a56e8] to-[#4f46e5] text-center" id="contact">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[700px] mx-auto"
        >
          <h2 className="font-['Bricolage_Grotesque'] text-[clamp(2rem,3.5vw,3rem)] font-bold text-white mb-4 tracking-[-0.025em]">{t.ctaTitle}</h2>
          <p className="text-[1.1rem] text-white/80 mb-9">{t.ctaSub}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-7 py-3 rounded-xl bg-white text-[#1a56e8] border-none cursor-pointer text-[1rem] font-semibold transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
            >
              {t.ctaBtn1}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)", borderColor: "#fff", y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
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
          <div className="font-['Bricolage_Grotesque'] text-[1.2rem] font-bold text-white">GenSchool</div>
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
              className="bg-white rounded-[28px] p-9 max-w-[640px] w-full shadow-[0_12px_40px_rgba(15,23,42,0.12)] relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f8f9fc] border border-[#e2e8f0] cursor-pointer flex items-center justify-center text-[#475569] transition-all hover:bg-[#eef1f8] hover:text-[#0f172a]"
              >
                ✕
              </button>
              <h3 className="font-['Bricolage_Grotesque'] text-[1.5rem] font-bold mb-2">{t.modalTitle}</h3>
              <p className="text-[.9rem] text-[#475569] mb-7">{t.modalSub}</p>
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
                      target.style.borderColor = "#1a56e8";
                      target.style.backgroundColor = "#e8f0ff";
                      setTimeout(() => {
                        target.style.borderColor = "transparent";
                        target.style.backgroundColor = "#f8f9fc";
                      }, 1200);
                    }}
                    className="bg-[#f8f9fc] rounded-[14px] p-5 text-center border-[1.5px] border-transparent cursor-pointer transition-all hover:bg-[#e8f0ff] hover:border-[#1a56e8] hover:shadow-[0_8px_24px_rgba(26,86,232,0.15)]"
                  >
                    <div className="text-[1.8rem] mb-[10px]">{role.icon}</div>
                    <div className="font-['Bricolage_Grotesque'] text-[.85rem] font-semibold text-[#0f172a]">{role.name}</div>
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
