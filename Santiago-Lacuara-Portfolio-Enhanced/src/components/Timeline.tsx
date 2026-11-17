import { motion, animate, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

type Lang = "en" | "es";

interface Entry {
  role: Record<Lang, string>;
  company: string;
  period: Record<Lang, string>;
  current?: boolean;
}

// Career data — from CV 2026. Oldest first, ending at the present.
const entries: Entry[] = [
  {
    role: { en: "Graphic Designer", es: "Diseñador Gráfico" },
    company: "Malloys Bar",
    period: { en: "2022 — 2024", es: "2022 — 2024" },
  },
  {
    role: { en: "Graphic Designer", es: "Diseñador Gráfico" },
    company: "Spirit Kite Beach",
    period: { en: "2023 — 2025", es: "2023 — 2025" },
  },
  {
    role: { en: "Freelance Motion Designer", es: "Motion Designer Freelance" },
    company: "Freelance",
    period: { en: "Mar 2023 — Present", es: "Mar 2023 — Actualidad" },
  },
  {
    role: { en: "Motion Graphics Designer", es: "Motion Graphics Designer" },
    company: "Vext Labs",
    period: { en: "2025 — Sep 2026", es: "2025 — Sep 2026" },
  },
  {
    role: { en: "Multimedia Content Creator", es: "Creador de Contenido Multimedia" },
    company: "Addnice",
    period: { en: "Aug 2026 — Oct 2026", es: "Ago 2026 — Oct 2026" },
  },
  {
    role: { en: "Motion Graphics Designer & Video Editor", es: "Motion Graphics Designer y Editor de Video" },
    company: "Sea Island Creative",
    period: { en: "Mar 2026 — Present", es: "Mar 2026 — Actualidad" },
    current: true
  },
];

export default function Timeline() {
  const { t, language } = useLanguage();
  const lang = language as Lang;
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll progress through the list drives the plane and the solid trail behind it
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  // the plane (and its trail) stop on the last dot — the present job
  const stops = useRef<number[]>([]);
  const endAt = () => stops.current[stops.current.length - 1] ?? 1;
  const clamped = useTransform(progress, (v) => Math.min(Math.max(v, 0), endAt()));
  const planeTop = useTransform(clamped, (v) => `${v * 100}%`);
  // a little wobble while flying
  const planeTilt = useTransform(progress, (v) => 135 + Math.sin(v * Math.PI * 6) * 8);

  // Where each dot sits along the track (0..1), measured from the DOM
  useEffect(() => {
    const measure = () => {
      const list = listRef.current;
      if (!list) return;
      const lr = list.getBoundingClientRect();
      const dots = list.querySelectorAll<HTMLElement>("[data-dot]");
      const next: number[] = [];
      dots.forEach((d) => {
        const r = d.getBoundingClientRect();
        next.push((r.top + r.height / 2 - lr.top) / lr.height);
      });
      stops.current = next;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, []);

  // How many dots the plane has passed; the last one passed is the "active" stop
  const [reached, setReached] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const n = stops.current.filter((s) => v >= s - 0.005).length;
    setReached((prev) => (prev === n ? prev : n));
  });
  const active = reached - 1;

  // Arrival: when the plane lands on the present job it does a bigger pulse
  // (the plane itself bumps and the last dot sends out larger rings).
  const planeRef = useRef<HTMLDivElement>(null);
  const planeScale = useMotionValue(1);
  const prevReached = useRef(0);
  const [arrivals, setArrivals] = useState(0); // re-keys the big rings so they replay

  useEffect(() => {
    const arrived = reached === entries.length && prevReached.current < entries.length;
    prevReached.current = reached;
    if (!arrived) return;
    setArrivals((n) => n + 1);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(planeScale, [1, 1.55, 0.92, 1.12, 1], { duration: 1.1, ease: "easeOut" });
  }, [reached]);

  return (
    <div className="relative z-10 max-w-screen-xl mx-auto mt-24 md:mt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 md:mb-20 flex items-end justify-between gap-6"
      >
        <div>
          <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.6em] mb-4 block" style={{ color: "#E9B872" }}>
            {t("timeline.label")}
          </span>
          <h3 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter leading-[0.95]">
            {t("timeline.title")}
          </h3>
        </div>
        {/* boarding-pass style tag */}
        <span className="hidden sm:inline-flex items-center gap-3 tl-ticket px-4 py-2 text-[9px] font-grotesk uppercase tracking-[0.35em] text-white/60">
          2022 <span className="tl-ticket__dash" aria-hidden /> 2026
        </span>
      </motion.div>

      <div ref={listRef} className="relative">
        {/* Dashed track, marching dashes, and the solid trail the plane leaves */}
        <div className="tl-track absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px]" aria-hidden />
        <motion.div
          style={{ scaleY: clamped }}
          className="tl-trail absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] origin-top"
          aria-hidden
        />

        {/* The plane */}
        <motion.div
          style={{ top: planeTop }}
          className="absolute left-[8px] md:left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden
        >
          <motion.div ref={planeRef} style={{ scale: planeScale }} className="tl-plane">
            <motion.div style={{ rotate: planeTilt }}>
              <Plane size={18} strokeWidth={1.8} />
            </motion.div>
          </motion.div>
        </motion.div>

        <ol className="space-y-10 md:space-y-14 py-6">
          {entries.map((e, i) => {
            const right = i % 2 === 1; // desktop: alternate sides
            return (
              <motion.li
                key={`${e.company}-${i}`}
                initial={{ opacity: 0, x: right ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-16"
              >
                {/* Dot — pulses when the plane lands on it */}
                <span
                  data-dot
                  className={`timeline-dot ${e.current ? "is-current" : ""} ${i < reached ? "is-reached" : ""} absolute left-0 md:left-1/2 md:-translate-x-1/2 top-7 w-[15px] h-[15px] rounded-full z-10`}
                  aria-hidden
                >
                  {i < reached && <span key={`hit-${i}`} className="tl-hit" />}
                  {/* final stop: bigger, double pulse */}
                  {i === entries.length - 1 && reached === entries.length && arrivals > 0 && (
                    <span key={`big-${arrivals}`} aria-hidden>
                      <span className="tl-hit tl-hit--big" />
                      <span className="tl-hit tl-hit--big tl-hit--late" />
                    </span>
                  )}
                </span>
                {/* Dashed connector from the dot to the card (desktop) */}
                <span
                  className={`tl-connector ${i === active ? "is-active" : ""} hidden md:block absolute top-[34px] w-16 ${right ? "left-1/2" : "right-1/2"}`}
                  aria-hidden
                />

                <div data-card={i} className={`tl-card ${i === active ? "is-active" : ""} relative p-5 md:p-6 rounded-2xl ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
                  {/* dashed stroke — marches and turns amber while the plane is here */}
                  <svg className="tl-card__stroke" aria-hidden>
                    <rect x="0.75" y="0.75" rx="16" ry="16" />
                  </svg>
                  <span className="absolute top-3 text-[9px] font-grotesk tracking-[0.3em] text-white/40 hidden md:block"
                    style={right ? { right: 16 } : { left: 16 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.35em] block mb-2" style={{ color: "#E9B872" }}>
                    {e.period[lang]}
                  </span>
                  <h4 className="text-xl md:text-2xl font-poppins font-bold uppercase tracking-tight leading-tight">
                    {e.role[lang]}
                  </h4>
                  <span className={`mt-2 flex items-center gap-2 text-sm md:text-base font-grotesk font-light text-white/70 ${right ? "" : "md:justify-end"}`}>
                    {e.company}
                    {e.current && (
                      <span className="text-[9px] uppercase tracking-[0.3em] px-2 py-0.5 rounded-full border border-dashed" style={{ borderColor: "#E9B872", color: "#E9B872" }}>
                        {t("timeline.now")}
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
