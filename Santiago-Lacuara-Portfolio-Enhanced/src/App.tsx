/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import HeroAboutSection from "./components/HeroAboutSection";
import ProjectGrid from "./components/ProjectGrid";
import Marquee from "./components/Marquee";
import Loader from "./components/Loader";
import Magnetic from "./components/Magnetic";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Intro loader (shows once on load, then reveals the site)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tmr = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(tmr);
  }, []);
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [loading]);

  // Parallax: the global grid drifts slower than the page on scroll.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (gridRef.current) {
          gridRef.current.style.backgroundPositionY = `${-window.scrollY * 0.45}px`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="text-white relative">
      {/* Intro loader */}
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[150]"
        aria-hidden
      >
        <div className="w-full h-full" style={{ backgroundColor: "#E9B872" }} />
      </motion.div>

      {/* Global drifting orange blobs (whole page) */}
      <div className="bg-blobs" aria-hidden>
        <span className="gb gb1" /><span className="gb gb2" /><span className="gb gb3" /><span className="gb gb4" /><span className="gb gb5" />
      </div>
      {/* Global parallax grid (whole page) */}
      <div ref={gridRef} className="bg-grid-global" aria-hidden />
      {/* Global film grain texture */}
      <div className="grain-overlay" aria-hidden />

      <Navbar />
      <HeroAboutSection />
      <Marquee />
      <ProjectGrid />

      {/* Contact Section — bold redesign */}
      <section
        id="contact"
        className="relative py-32 md:py-56 px-4 md:px-12 overflow-hidden border-t border-white/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-screen-2xl mx-auto text-center"
        >
          <span
            className="text-[10px] font-grotesk font-medium uppercase tracking-[0.6em] block mb-8"
            style={{ color: "#E9B872" }}
          >
            {t("contact.inquiries")}
          </span>

          <h2 className="text-[14vw] md:text-[10vw] font-display font-bold uppercase leading-[0.9] mb-12 md:mb-16 tracking-tighter">
            <span className="gold-text">{t("contact.title")}</span>
          </h2>

          <Magnetic strength={0.4} className="inline-block">
            <a
              href="mailto:santiago.lopezlacuara@gmail.com"
              className="cursor-grow group inline-flex items-center gap-3 text-base md:text-2xl font-grotesk font-light border-b border-white/20 pb-2 hover:border-white transition-colors break-all"
            >
              <span>santiago.lopezlacuara@gmail.com</span>
              <span className="hidden md:inline transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>

          {/* Social row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[10px] font-grotesk uppercase tracking-[0.4em] text-white/50">
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="cursor-grow hover:text-white transition-colors">YouTube</a>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="cursor-grow hover:text-white transition-colors">Instagram</a>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="cursor-grow hover:text-white transition-colors">LinkedIn</a>
          </div>
        </motion.div>
      </section>

      <footer className="py-10 md:py-16 px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 text-[10px] font-grotesk uppercase tracking-[0.4em] text-white/30 text-center border-t border-white/5">
        <span>© 2026 Santiago Lacuara</span>
        <span className="hidden md:block" style={{ color: "#E9B872" }}>Motion Graphics</span>
        <span>{t("footer.rights")}</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
