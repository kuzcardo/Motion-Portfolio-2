import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function HeroAboutSection() {
  const { t } = useLanguage();

  // Typewriter state for the hero title
  const [typed1, setTyped1] = useState("");
  const [typed2, setTyped2] = useState("");

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
    timers.push(setTimeout(step1, 1700));
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

  const subtitleText = t('hero.subtitle');
  const words = subtitleText.split(" ");

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Halo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.6, duration: 1.5, delay: 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[450px] md:h-[450px] rounded-full border-[1.5px] border-white halo-glow z-0"
        >
          <div className="halo-follow" />
        </motion.div>

        {/* Title */}
        <div className="relative z-30 flex flex-col items-center pointer-events-none px-4">
          <h1 className="text-[15vw] md:text-[11vw] font-display font-bold uppercase text-white leading-[1.0] text-center tracking-tight">
            <span className="flex justify-center items-end min-h-[1em]">{typed1}</span>
            <span className="flex justify-center items-end min-h-[1em] gold-text">{typed2}</span>
          </h1>
        </div>

        {/* Subtitle (bottom) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.9 }}
          className="absolute bottom-10 md:bottom-12 flex flex-col items-center gap-4 z-20"
        >
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center px-4">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3.9 + (i * 0.08), duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                className="text-[9px] md:text-[10px] font-grotesk font-light uppercase tracking-[0.4em] md:tracking-[0.6em] text-white inline-block"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 4.5, duration: 1 }}
            className="w-[1px] h-12 md:h-16 bg-white"
          />
        </motion.div>
      </section>

      {/* ===================== ABOUT ===================== */}
      <section id="about" className="relative py-24 md:py-40 px-6 md:px-12 overflow-hidden">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[300px] md:max-w-md aspect-[4/5] relative mx-auto md:mx-0"
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
            </div>
            <div className="absolute -inset-4 border z-0 pointer-events-none" style={{ borderColor: "rgba(233,184,114,0.25)" }} />
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l z-0 pointer-events-none" style={{ borderColor: "#E9B872" }} />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r z-0 pointer-events-none" style={{ borderColor: "#E9B872" }} />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-left pl-5 md:pl-8 border-l border-white/20"
          >
            <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.6em] mb-6 block" style={{ color: "#E9B872" }}>{t('about.label')}</span>
            <div className="space-y-6 text-base md:text-lg text-white/80 leading-relaxed font-light">
              <p>{t('about.p1')}</p>
              <p>{t('about.p2')}</p>
            </div>
          </motion.div>
        </div>

        {/* Background decorative text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[26vw] md:text-[20vw] font-sans font-black pointer-events-none select-none uppercase z-0 opacity-[0.02] whitespace-nowrap">
          {t('about.bg_text')}
        </div>
      </section>
    </>
  );
}
