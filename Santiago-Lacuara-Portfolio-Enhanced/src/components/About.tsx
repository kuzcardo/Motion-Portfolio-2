import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative py-60 px-12 bg-black overflow-hidden">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "circOut" }}
          className="z-10"
        >
          <span className="text-[10px] font-light uppercase tracking-[0.6em] text-white mb-8 block">{t('about.label')}</span>
          <h2 className="text-6xl md:text-8xl font-display font-light uppercase mb-12 leading-tight tracking-tighter">
            Santiago <br /> Lacuara
          </h2>
          <div className="space-y-6 text-lg text-white/60 leading-relaxed max-w-md">
            <p>
              {t('about.p1')}
            </p>
            <p>
              {t('about.p2')}
            </p>
          </div>
        </motion.div>

        {/* Mixed Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto"
        >
          {/* The "Mixed" Image */}
          <div className="absolute inset-0 z-0">
             <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" 
              alt="Santiago Lacuara"
              className="w-full h-full object-cover grayscale brightness-75 contrast-125 mix-blend-screen"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Decorative elements to help the "mix" */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10" />
          
          {/* Border frame */}
          <div className="absolute -inset-4 border border-white/10 z-0 pointer-events-none" />
        </motion.div>
      </div>
      
      {/* Background decorative text or elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-sans font-black opacity-[0.02] pointer-events-none select-none uppercase">
        {t('about.bg_text')}
      </div>
    </section>
  );
}

