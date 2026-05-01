"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import translationsData from '../../data/translations.json';

const translations: Record<string, any> = translationsData;

const demoCards = [
  {
    id: "admin",
    title: "Admin Capabilities",
    desc1: "Manage your entire educational ecosystem with tranquility. Our administrative tools are designed for clarity and ease of use.",
    desc2: "Phasellus enim magna, varius et commodo ut, ultricies vitae velit. Pellentesque eu ornare diam, id fermentum tellus.",
    icon: "admin_panel_settings",
    role: "INSTITUTION",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnRo3UMZuL3KeHKjeKlBV9C9EUu4t1_DO-XbBPhvRCAFX9-TqJMYVViO6XGm-LctFHg462PgygtZdeG2nXUBZib7G9-SNZ_Q-RLM4w55f3Y807RlEp3OKSaDlgKJqXSDf3cYNuAH2tkYPo_gJVPBtxcLyXghkOsBi5WBkGfgjLriSh_HzD5LJGETk6PSC-QVsg4g_D4dPuUHa57PIoSn1OpKKrxEJ7-MjfTVm9hAzhdanxL9o8uV1dSOzPeCl1yHkHftzgGo0MruI",
    align: "right"
  },
  {
    id: "teacher",
    title: "Teacher Capabilities",
    desc1: "Inspire your students with tools that facilitate deep focus and meaningful engagement. Streamline your grading and lesson planning.",
    desc2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.",
    icon: "school",
    role: "EDUCATOR",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmYj2GjWTifhBYim719UmgEw8OX9VVuS5oTrTOzMcK4Bq_0YQEeo5PkHU7Z6wLwb9QepEuJng7jcmLRDgMOVDjpEeBcGglmSbniYC554dMF9XBQTdcPtyZ1lzC2V5SOJZzIbAeM_kYKPsP8GTG9xF5z5M44tpZk5JUqiN-_EyZMqAZTL73d7_BpiXVNxfiV2W0mUQZ40FxtrRLj1Sx3k_2xmZp4nx9vHDAzCXTHHfttWXSmPQiUq6vyxl-FFEs0jJ0rbcecp4pLr8",
    align: "left"
  },
  {
    id: "student",
    title: "Student Capabilities",
    desc1: "Discover a sanctuary for learning. Track your progress, access curated resources, and connect with mentors in a serene environment.",
    desc2: "Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.",
    icon: "menu_book",
    role: "LEARNER",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAAZ8MjyD-5icfS2P7Ce7-fd-XTOnUC7TQ0eA6W48sJsw9jK0wnZnwRaiDGsYzpm2jZkqYaMthBVqEE1EdXOHCS7VbdYM_ppdU2L2UvMzlV_NrXiIY7qR8NEEdzKUy2CVGTWu5e1JdmPGtHb_TD_0hYFWAXNisbr4mWbhK2CSsLavUWlHBtABXkrAcSB5qD-I-cgJchVtkRPVK5L0ek0Cd62rPSJ4-sa5xLE06n3Eo8M2tU1JIKM4jfn_ZoLJUmEGUvJY4sPCmnDE",
    align: "left"
  },
  {
    id: "parent",
    title: "Parent Capabilities",
    desc1: "Stay connected with your child's educational path. View insights, manage schedules, and engage with the learning community.",
    desc2: "Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Phasellus enim magna, varius et commodo ut.",
    icon: "family_restroom",
    role: "GUARDIAN",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrVojqh6F18dxhTKj64ijuAaqp5meXD2UtlVHLzZtTTbt7q0hsshaWZsB5rANbm5WGWrL48MF0Jpy2sSSo8hwFxbvPwbWWksqxeBao3Hr4rKn408o2Z2cByuyXS9ZGC3UUckqOLhznBKjVWjzmoCXwU5ug6E6_o6haRROJAmBUWHAq1q9aX8NZ2JUpJGF8QfOTOzal6g7YS05FvxpMaMdk7ps5dba6HZ8oXeE645STyld0_O4EQege4qavMJ-sxuORvh-0BUljYAg",
    align: "left"
  }
];

export default function DemoPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-[#f8f9fc] text-[#0f172a] min-h-screen flex flex-col antialiased selection:bg-[#1a56e8]/20 selection:text-[#1a56e8]">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -68 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-[5%] border-b transition-shadow duration-300 ${isScrolled ? "bg-white/88 backdrop-blur-xl shadow-[0_4px_16px_rgba(15,23,42,0.08)]" : "bg-white/88 backdrop-blur-xl border-[#e2e8f0]"
          }`}
      >
        <Link href="/" className="flex items-center gap-[10px] text-[1.5rem] font-bold text-[#0f172a] no-underline font-['Bricolage_Grotesque']">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1a56e8] to-[#4f46e5] flex items-center justify-center text-white font-extrabold">
            G
          </div>
          <span>GenSchool</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="px-4 py-[7px] rounded-lg border border-[#e2e8f0] bg-transparent cursor-pointer text-[.85rem] font-medium text-[#475569] transition-all hover:border-[#1a56e8] hover:text-[#1a56e8] hover:bg-[#e8f0ff]"
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-5 py-2 rounded-[10px] border border-[#1a56e8] text-[#1a56e8] cursor-pointer text-[.9rem] font-medium transition-all hover:bg-[#1a56e8] hover:text-white"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/demo")}
            className="px-5 py-2 rounded-[10px] bg-[#1a56e8] text-white border-none cursor-pointer text-[.9rem] font-medium transition-all hover:bg-[#0f3ab5] hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(26,86,232,0.35)] shadow-[0_2px_8px_rgba(26,86,232,0.25)]"
          >
            {t.demoBtn}
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center pt-[120px] pb-[80px] px-[5%] max-w-[1400px] mx-auto w-full relative">
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[#1a56e8]/5 rounded-full blur-[100px]" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-[#4f46e5]/5 rounded-full blur-[120px]" 
          />
        </div>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10 lg:mb-14 max-w-2xl"
        >
          <div className="text-[.78rem] font-semibold tracking-[.1em] uppercase text-[#1a56e8] mb-3">Interactive Demo</div>
          <h1 className="font-['Bricolage_Grotesque'] text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#0f172a] mb-4">
            Select Your <span className="bg-gradient-to-r from-[#1a56e8] to-[#4f46e5] bg-clip-text text-transparent">Experience</span>
          </h1>
          <p className="text-[1.05rem] lg:text-[1.1rem] text-[#475569] leading-[1.7]">
            Explore GenSchool tailored to your role. Choose a path below to see how our platform facilitates a focused and collaborative educational journey.
          </p>
        </motion.div>

        {/* Cards Container */}
        <div className="flex flex-col lg:flex-row gap-4 justify-center items-stretch w-full h-auto lg:h-[550px]">
          {demoCards.map((card, idx) => {
            const isHovered = hoveredId === card.id;
            
            return (
              <motion.div
                key={card.id}
                onHoverStart={() => isDesktop && setHoveredId(card.id)}
                onHoverEnd={() => isDesktop && setHoveredId(null)}
                onClick={() => {
                  if (!isDesktop) setSelectedCard(card.id);
                }}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  width: isDesktop ? (isHovered ? 450 : 160) : "100%",
                }}
                transition={{ 
                  opacity: { duration: 0.5, delay: idx * 0.1 },
                  y: { duration: 0.5, delay: idx * 0.1 },
                  layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                  width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                }}
                className={`group bg-white rounded-[24px] shadow-[0_4px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)] border border-[#e2e8f0] relative overflow-hidden flex flex-col lg:flex-row ${card.align === 'left' ? 'lg:flex-row-reverse' : ''} transition-shadow duration-500 h-[140px] lg:h-full cursor-pointer lg:cursor-default`}
                style={{
                  flexShrink: 0,
                }}
              >
                {/* Image Container */}
                <motion.div 
                  layout
                  className="relative overflow-hidden flex-shrink-0 w-full lg:w-[160px] h-full z-10 bg-[#f8f9fc]"
                >
                  <motion.img
                    src={card.image}
                    alt={card.title}
                    className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent"></div>
                  <div className="absolute bottom-5 left-6 flex items-center gap-2 text-white">
                    <span className="material-symbols-outlined text-[28px]">{card.icon}</span>
                    <motion.span 
                      className="text-[.85rem] font-semibold tracking-wider font-['Bricolage_Grotesque']"
                      animate={{ opacity: (isHovered && isDesktop) ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.role}
                    </motion.span>
                  </div>
                  
                  {/* Tap indication for mobile */}
                  {!isDesktop && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                    </div>
                  )}
                </motion.div>

                {/* Description Content */}
                <motion.div 
                  className={`p-8 flex-col justify-center w-full lg:w-[290px] flex-shrink-0 bg-white z-0 hidden lg:flex`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isDesktop ? (isHovered ? 1 : 0) : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <h3 className="font-['Bricolage_Grotesque'] text-[1.5rem] font-bold text-[#0f172a] mb-4 border-b border-[#e2e8f0] pb-4">{card.title}</h3>
                  <p className="text-[.95rem] text-[#475569] mb-4 leading-[1.6]">{card.desc1}</p>
                  <p className="text-[.95rem] text-[#475569] leading-[1.6]">{card.desc2}</p>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (card.id === 'teacher') {
                        router.push('/demo/teacher');
                      } else {
                        alert('This demo is not yet available.');
                      }
                    }}
                    className="mt-8 self-start bg-[#1a56e8] text-white px-6 py-[10px] rounded-xl text-[.9rem] font-medium transition-all hover:bg-[#0f3ab5] shadow-[0_4px_16px_rgba(26,86,232,0.3)] hover:shadow-[0_8px_24px_rgba(26,86,232,0.4)] flex items-center gap-2 group/btn"
                  >
                    Launch Demo
                    <span className="material-symbols-outlined text-[18px] transform group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Mobile Popup Modal */}
      <AnimatePresence>
        {selectedCard && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md"
              >
                ✕
              </button>
              
              {/* Image Header */}
              <div className="w-full h-[220px] relative flex-shrink-0">
                <img 
                  src={demoCards.find(c => c.id === selectedCard)?.image} 
                  alt="topic"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent flex items-end p-6">
                  <h3 className="font-['Bricolage_Grotesque'] text-[1.8rem] font-bold text-white">
                    {demoCards.find(c => c.id === selectedCard)?.title}
                  </h3>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto">
                <p className="text-[#475569] text-[.95rem] leading-[1.65] mb-4 font-medium">
                  {demoCards.find(c => c.id === selectedCard)?.desc1}
                </p>
                <div className="h-[1px] w-full bg-[#e2e8f0] mb-4"></div>
                <p className="text-[#475569] text-[.95rem] leading-[1.65] mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-[#475569] text-[.95rem] leading-[1.65] mb-6">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
                </p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedCard === 'teacher') {
                      router.push('/demo/teacher');
                    } else {
                      alert('This demo is not yet available.');
                    }
                  }}
                  className="w-full bg-[#1a56e8] text-white py-[14px] rounded-xl text-[1rem] font-medium transition-all hover:bg-[#0f3ab5] shadow-[0_4px_16px_rgba(26,86,232,0.3)] flex items-center justify-center gap-2 active:scale-95"
                >
                  Launch Demo
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white/70 py-12 px-[5%] mt-auto z-10">
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
    </div>
  );
}
