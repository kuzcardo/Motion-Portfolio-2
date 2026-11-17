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
import ContactSection from "./components/ContactSection";
import BoatProgress from "./components/BoatProgress";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { t } = useLanguage();
  const gridRef = useRef<HTMLDivElement>(null);

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


      {/* Global drifting orange blobs (whole page) */}
      <div className="bg-blobs" aria-hidden>
        <span className="gb gb1" /><span className="gb gb2" /><span className="gb gb3" /><span className="gb gb4" /><span className="gb gb5" />
      </div>
      {/* Global parallax grid (whole page) */}
      <div ref={gridRef} className="bg-grid-global" aria-hidden />
      {/* Scroll progress: a boat sailing across the background */}
      <BoatProgress />
      {/* Global film grain texture */}
      <div className="grain-overlay" aria-hidden />

      <Navbar />
      <HeroAboutSection />
      <Marquee />
      <ProjectGrid />

      {/* Contact — dashed boarding pass */}
      <ContactSection />

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
