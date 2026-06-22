import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Timing: Hero subtitle ends around 4.5s. Navbar starts shortly after.
  const NAV_START_DELAY = 4.8;

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), NAV_START_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsHidden(customEvent.detail);
    };
    window.addEventListener('toggleNavbar', handleToggle);
    return () => window.removeEventListener('toggleNavbar', handleToggle);
  }, []);

  // Hide on scroll down, reappear (with a pop) on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 140) setScrollHidden(true);
      else if (y < lastY) setScrollHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  // Timing: Hero subtitle ends around 4.5s. Navbar starts shortly after.

  const brandVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: NAV_START_DELAY,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const linkVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: NAV_START_DELAY + 0.5 + i * 0.08, 
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      },
    }),
  };

  const toggleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: NAV_START_DELAY + 1.0,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const brandText = t('nav.brand');

  return (
    <>
      <motion.nav
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: (isHidden || scrollHidden) ? -120 : 0, opacity: (isHidden || scrollHidden) ? 0 : 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
          delay: hasLoaded ? 0 : NAV_START_DELAY - 0.3
        }}
        className="fixed top-4 md:top-8 left-0 right-0 z-[100] px-4 md:px-8 mx-auto max-w-screen-xl pointer-events-none"
      >
        {/* Desktop Navbar (lg and up) */}
        <div className="hidden lg:flex relative overflow-hidden rounded-full px-14 py-6 liquid-glass items-center justify-between pointer-events-auto">
          {/* Liquid Glow Effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                x: [0, 100, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 blur-[80px] rounded-full"
            />
          </div>

          {/* Brand Text with Stagger */}
          <a href="#" className="relative z-10 flex-1">
            <motion.div 
              variants={brandVariants}
              initial="hidden"
              animate="visible"
              className="text-[13px] font-light tracking-[0.3em] uppercase flex flex-wrap"
            >
              {brandText.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
          </a>
          
          {/* Nav Links with Position Animation */}
          <div className="flex items-center justify-center gap-12 text-[11px] font-light uppercase tracking-[0.4em] overflow-hidden py-1 relative z-10 flex-none">
            {['about', 'portfolio', 'contact'].map((key, i) => (
              <motion.a
                key={key}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                href={`#${key === 'portfolio' ? 'work' : key}`}
                className="cursor-grow hover:text-white/50 transition-colors"
              >
                {t(`nav.${key}`)}
              </motion.a>
            ))}
          </div>

          {/* Language & Theme Toggle with Bounce */}
          <div className="flex items-center justify-end gap-6 relative z-10 flex-1">
            <motion.div 
              variants={toggleVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-4"
            >
              {/* Language Toggle */}
              <div className="flex items-center gap-2">
                <span className={`text-[9px] tracking-[0.2em] transition-opacity duration-300 ${language === 'en' ? 'opacity-100' : 'opacity-30'}`}>EN</span>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                  className="relative w-9 h-5 bg-white/10 rounded-full p-0.5 transition-colors duration-300 hover:bg-white/20"
                  aria-label="Toggle Language"
                >
                  <motion.div
                    animate={{ x: language === 'en' ? 0 : 16 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
                <span className={`text-[9px] tracking-[0.2em] transition-opacity duration-300 ${language === 'es' ? 'opacity-100' : 'opacity-30'}`}>ES</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile/Tablet Hamburger Button (< lg) */}
        <motion.div 
          variants={toggleVariants}
          initial="hidden"
          animate="visible"
          className="flex lg:hidden justify-end pointer-events-auto"
        >
          <button
            onClick={() => setIsMenuOpen(true)}
            className="liquid-glass p-4 rounded-full border border-white/10 shadow-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>
        </motion.div>
      </motion.nav>

      {/* Floating Window Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 left-4 right-4 z-[110] liquid-glass rounded-3xl p-8 flex flex-col items-center gap-8 border border-white/10 shadow-2xl"
          >
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-[10px] font-light tracking-[0.4em] uppercase text-white/40 mb-2 mt-2">
              {brandText}
            </div>
            
            <div className="flex flex-col gap-6 text-center w-full">
              {['about', 'portfolio', 'contact'].map((key) => (
                <a
                  key={key}
                  href={`#${key === 'portfolio' ? 'work' : key}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-display uppercase tracking-widest hover:text-white/50 transition-colors py-2 border-b border-white/5 last:border-0"
                >
                  {t(`nav.${key}`)}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] tracking-[0.2em] transition-opacity duration-300 ${language === 'en' ? 'opacity-100' : 'opacity-30'}`}>EN</span>
                <button 
                  onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                  className="relative w-10 h-5 bg-white/10 rounded-full p-1 transition-colors duration-300 hover:bg-white/20"
                >
                  <motion.div 
                    animate={{ x: language === 'en' ? 0 : 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-3 h-3 bg-white rounded-full shadow-sm"
                  />
                </button>
                <span className={`text-[10px] tracking-[0.2em] transition-opacity duration-300 ${language === 'es' ? 'opacity-100' : 'opacity-30'}`}>ES</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
