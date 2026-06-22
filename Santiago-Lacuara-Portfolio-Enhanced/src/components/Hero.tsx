import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const subtitleText = t('hero.subtitle');
  const words = subtitleText.split(" ");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Vertical Grid Lines */}
      <div className="absolute inset-0 grid-lines opacity-20 z-0" />

      {/* Central Composition */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Neon Halo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "circOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-[1.5px] border-white halo-glow z-0"
        />
      </div>

      {/* Main Title - Centered relative to the entire section */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <motion.h1 
          className="text-[12vw] md:text-[10vw] font-display font-light uppercase text-white leading-[1.0] text-center px-6 flex flex-col items-center tracking-tighter"
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="flex" 
            variants={{ 
              visible: { transition: { staggerChildren: 0.05, delayChildren: 2.5 } } 
            }}
          >
            {"Santiago".split("").map((char, index) => (
              <motion.span
                key={`s-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          <motion.div 
            className="flex" 
            variants={{ 
              visible: { transition: { staggerChildren: 0.05, delayChildren: 3.2 } } 
            }}
          >
            {"Lacuara".split("").map((char, index) => (
              <motion.span
                key={`l-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </motion.h1>
      </div>

      {/* Bottom Text - Subtitle with Word-by-Word Cadence */}
      <div className="absolute bottom-8 flex flex-col items-center gap-4 overflow-hidden">
        <div className="flex gap-3 overflow-hidden py-1">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 4.8 + (i * 0.15), 
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
          transition={{ delay: 5.5, duration: 1.2, ease: "circOut" }}
          className="w-[1px] h-16 bg-white" 
        />
      </div>
    </section>
  );
}

