import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function HeroAboutSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Typewriter state for the hero title
  const [typed1, setTyped1] = useState("");
  const [typed2, setTyped2] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Typewriter sequence: types "Santiago" then "Lacuara" (slower, no caret)
  useEffect(() => {
    const w1 = "Santiago", w2 = "Lacuara", speed = 125;
    let i = 0, j = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const step2 = () => {
      if (j <= w2.length) { setTyped2(w2.slice(0, j)); j++; timers.push(setTimeout(step2, speed)); }
    };
    const step1 = () => {
      if (i <= w1.length) { setTyped1(w1.slice(0, i)); i++; timers.push(setTimeout(step1, speed)); }
      else { timers.push(setTimeout(step2, 160)); }
    };
    timers.push(setTimeout(step1, 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Interactive halo: the radial glow hotspot follows the mouse in real time.
  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const halos = document.querySelectorAll<HTMLElement>('.halo-follow');
        halos.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (!r.width) return;
          const mx = ((e.clientX - r.left) / r.width) * 100;
          const my = ((e.clientY - r.top) / r.height) * 100;
          el.style.setProperty('--mx', `${mx}%`);
          el.style.setProperty('--my', `${my}%`);
        });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero Elements Transforms (Desktop only)
  const haloScale = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  
  const titleXDesktop = useTransform(scrollYProgress, [0, 0.15, 0.3], ["0%", "-30%", "-30%"]);
  const titleYDesktop = useTransform(scrollYProgress, [0, 0.15, 0.3], ["0%", "0%", "-15%"]);
  const titleScaleDesktop = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.5], [1, 0.7, 0.7, 0.6]);
  
  const heroSubtitleOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroSubtitleY = useTransform(scrollYProgress, [0, 0.05], [0, 50]);

  // About Elements Transforms (Desktop only)
  const aboutContentOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1]);
  const aboutContentX = useTransform(scrollYProgress, [0.2, 0.35], [-30, 0]);
  
  const photoXDesktop = useTransform(scrollYProgress, [0.15, 0.45], ["100%", "0%"]);
  const photoOpacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const photoScale = useTransform(scrollYProgress, [0.15, 0.45], [0.8, 1]);

  const bgTextOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 0.02]);

  const subtitleText = t('hero.subtitle');
  const words = subtitleText.split(" ");

  const letterVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
  };

  return (
    <>
      {/* --- MOBILE LAYOUT (Separate Sections) --- */}
      <div className="block md:hidden w-full">
        {/* Mobile Hero */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              bounce: 0.6, 
              duration: 1.5,
              delay: 0.2
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border-[1.5px] border-white halo-glow z-0"
          >
            <div className="halo-follow" />
          </motion.div>

          <div className="relative z-30 flex flex-col items-center pointer-events-none">
            <h1 className="text-[15vw] font-display font-bold uppercase text-white leading-[1.0] text-center tracking-tight">
              <span className="flex justify-center items-end min-h-[1em]">{typed1}</span>
              <span className="flex justify-center items-end min-h-[1em] gold-text">{typed2}</span>
            </h1>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
            className="absolute bottom-12 flex flex-col items-center gap-4 z-20"
          >
            <div className="flex gap-2 flex-wrap justify-center px-4">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 3.5 + (i * 0.08), duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                  className="text-[9px] font-light uppercase tracking-[0.4em] text-white inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.div 
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 4.2, duration: 1 }}
              className="w-[1px] h-12 bg-white" 
            />
          </motion.div>
        </section>

        {/* Mobile About */}
        <section id={isMobile ? "about" : "about-mobile-disabled"} className="relative py-24 px-6 flex flex-col items-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full max-w-[260px] aspect-[4/5] relative mb-12 z-10"
          >
            <div className="relative w-full h-full overflow-hidden rounded-sm">
              <img 
                src="https://i.ibb.co/1YXbWWRj/retratardo.png" 
                alt="Santiago Lacuara"
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute -inset-4 border z-0 pointer-events-none" style={{ borderColor: "rgba(233,184,114,0.25)" }} />
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l z-0 pointer-events-none" style={{ borderColor: "#E9B872" }} />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r z-0 pointer-events-none" style={{ borderColor: "#E9B872" }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full text-left pl-5 border-l border-white/20 z-20"
          >
            <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.6em] mb-6 block" style={{ color: "#E9B872" }}>{t('about.label')}</span>
            <div className="space-y-6 text-base font-bold text-white/90 leading-relaxed">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
            </div>
          </motion.div>
          
          {/* Background decorative text */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[30vw] font-sans font-black pointer-events-none select-none uppercase z-0 opacity-[0.02] whitespace-nowrap">
            {t('about.bg_text')}
          </div>
        </section>
      </div>

      {/* --- DESKTOP/TABLET LAYOUT (Combined Scroll Animation) --- */}
      <div ref={containerRef} className="hidden md:block relative h-[350vh]">
        {/* Scroll target for About section */}
        <div id={!isMobile ? "about" : "about-desktop-disabled"} className="absolute top-[100vh] w-full" />
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

          {/* Hero: Halo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              bounce: 0.6, 
              duration: 1.5,
              delay: 0.2
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          >
            <motion.div
              style={{ scale: haloScale, opacity: haloOpacity }}
              className="w-[450px] h-[450px] rounded-full border-[1.5px] border-white halo-glow"
            >
              <div className="halo-follow" />
            </motion.div>
          </motion.div>

          {/* Shared: Title (Santiago Lacuara) - Centered Initially with Halo */}
          <motion.div 
            style={{ x: titleXDesktop, y: titleYDesktop, scale: titleScaleDesktop }}
            className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
          >
            <div className="relative flex flex-col items-center">
              <h1 className="text-[10vw] font-display font-bold uppercase text-white leading-[1.0] text-center tracking-tight">
                <span className="flex justify-center items-end min-h-[1em]">{typed1}</span>
                <span className="flex justify-center items-end min-h-[1em] gold-text">{typed2}</span>
              </h1>

              {/* About: Description (Absolutely positioned to not affect title centering) */}
              <motion.div 
                style={{ opacity: aboutContentOpacity, x: aboutContentX }}
                className="absolute top-full mt-8 left-0 w-[140%] text-left pl-6 border-l border-white/20"
              >
                <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.6em] mb-4 block" style={{ color: "#E9B872" }}>{t('about.label')}</span>
                <div className="space-y-6 text-xl font-bold text-white/90 leading-relaxed pr-8">
                  <p>{t('about.p1')}</p>
                  <p>{t('about.p2')}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Hero: Subtitle (Bottom) */}
          <motion.div 
            style={{ opacity: heroSubtitleOpacity, y: heroSubtitleY }}
            className="absolute bottom-8 flex flex-col items-center gap-4 overflow-hidden z-20"
          >
            <div className="flex gap-3 overflow-hidden py-1">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: 3.5 + (i * 0.08), 
                    duration: 1, 
                    ease: [0.215, 0.61, 0.355, 1] 
                  }}
                  className="text-[10px] font-light uppercase tracking-[0.6em] text-white inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <motion.div 
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 4.2, duration: 1.2, ease: "circOut" }}
              className="w-[1px] h-16 bg-white" 
            />
          </motion.div>

          {/* About: Photo (Enters from right) */}
          <motion.div 
            style={{ 
              x: photoXDesktop, 
              opacity: photoOpacity,
              scale: photoScale,
            }}
            className="absolute top-1/2 -translate-y-1/2 w-full max-w-md aspect-[4/5] z-10 right-[5%]"
          >
            <div className="relative w-full h-full overflow-hidden rounded-sm">
              <img 
                src="https://i.ibb.co/1YXbWWRj/retratardo.png" 
                alt="Santiago Lacuara"
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
              <div className="absolute -inset-4 border z-0 pointer-events-none" style={{ borderColor: "rgba(233,184,114,0.25)" }} />
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l z-0 pointer-events-none" style={{ borderColor: "#E9B872" }} />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r z-0 pointer-events-none" style={{ borderColor: "#E9B872" }} />
            </div>
          </motion.div>

          {/* Background decorative text */}
          <motion.div 
            style={{ opacity: bgTextOpacity }}
            className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-sans font-black pointer-events-none select-none uppercase z-0"
          >
            {t('about.bg_text')}
          </motion.div>
        </div>
      </div>
    </>
  );
}
