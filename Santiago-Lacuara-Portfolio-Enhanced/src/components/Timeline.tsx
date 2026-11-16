import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

type Lang = "en" | "es";

interface Entry {
  role: Record<Lang, string>;
  company: string;
  period: Record<Lang, string>;
  current?: boolean;
  education?: boolean;
}

// Career data — from CV 2026. Newest first.
const entries: Entry[] = [
  {
    role: { en: "Multimedia Content Creator", es: "Creador de Contenido Multimedia" },
    company: "Addnice",
    period: { en: "Aug 2026 — Oct 2026", es: "Ago 2026 — Oct 2026" },
  },
  {
    role: { en: "Motion Graphics Designer & Video Editor", es: "Motion Graphics Designer y Editor de Video" },
    company: "Sea Island Creative",
    period: { en: "Mar 2026 — Present", es: "Mar 2026 — Actualidad" },
    current: true,
  },
  {
    role: { en: "Motion Graphics Designer", es: "Motion Graphics Designer" },
    company: "Vext Labs",
    period: { en: "2025 — Sep 2026", es: "2025 — Sep 2026" },
  },
  {
    role: { en: "Design Degree", es: "Carrera de Diseño" },
    company: "UCES — San Isidro",
    period: { en: "Mar 2023 — Present", es: "Mar 2023 — Actualidad" },
    current: true,
    education: true,
  },
  {
    role: { en: "Motion Graphics Designer", es: "Motion Graphics Designer" },
    company: "Freelance",
    period: { en: "Mar 2023 — Present", es: "Mar 2023 — Actualidad" },
    current: true,
  },
  {
    role: { en: "Graphic Designer", es: "Diseñador Gráfico" },
    company: "Spirit Kite Beach",
    period: { en: "2023 — 2025", es: "2023 — 2025" },
  },
  {
    role: { en: "Graphic Designer", es: "Diseñador Gráfico" },
    company: "Malloys Bar",
    period: { en: "2022 — 2024", es: "2022 — 2024" },
  },
];

export default function Timeline() {
  const { t, language } = useLanguage();
  const lang = language as Lang;
  const listRef = useRef<HTMLDivElement>(null);

  // The amber line "draws" itself as the timeline scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div className="relative z-10 max-w-screen-xl mx-auto mt-24 md:mt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 md:mb-20"
      >
        <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.6em] mb-4 block" style={{ color: "#E9B872" }}>
          {t("timeline.label")}
        </span>
        <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95]">
          {t("timeline.title")}
        </h3>
      </motion.div>

      <div ref={listRef} className="relative">
        {/* Track + animated fill */}
        <div className="timeline-line absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-px" aria-hidden />
        <motion.div
          style={{ scaleY }}
          className="timeline-line__fill absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-px origin-top"
          aria-hidden
        />

        <ol className="space-y-12 md:space-y-16">
          {entries.map((e, i) => {
            const right = i % 2 === 1; // desktop: alternate sides
            return (
              <motion.li
                key={`${e.company}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-16"
              >
                {/* Dot */}
                <span
                  className={`timeline-dot ${e.current ? "is-current" : ""} absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1.5 w-[15px] h-[15px] rounded-full ${e.education ? "!rounded-sm rotate-45" : ""}`}
                  aria-hidden
                />

                <div className={`${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
                  <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.35em] text-white/50 block mb-2">
                    {e.period[lang]}
                  </span>
                  <h4 className="text-xl md:text-2xl font-poppins font-bold uppercase tracking-tight leading-tight">
                    {e.role[lang]}
                  </h4>
                  <span className="mt-1 inline-flex items-center gap-2 text-sm md:text-base font-grotesk font-light text-white/70">
                    {e.company}
                    {e.education && (
                      <span className="text-[9px] uppercase tracking-[0.3em] px-2 py-0.5 rounded-full border border-white/20 text-white/60">
                        {t("timeline.education")}
                      </span>
                    )}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
