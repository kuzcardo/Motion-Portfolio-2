import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { X } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image?: string; // optional: cards without an image show a typographic cover
  videos?: string[]; // YouTube video IDs
}

// Description + tools shown on the right side of each card
const BASE = ["After Effects", "Premiere Pro"];
// extra scroll (in viewport heights) after the last card so it rests in focus
const STACK_TAIL = 0.5;
const details: Record<number, { en: string; es: string; tags: string[] }> = {
  1: { en: "Story-driven animations that turn ideas into visual narratives — from brand stories to explainers, built frame by frame.",
       es: "Animaciones con narrativa que convierten ideas en historias visuales: desde historias de marca hasta explainers, construidas cuadro a cuadro.",
       tags: [...BASE, "Illustrator", "AI Image Generation"] },
  2: { en: "Type that moves with rhythm and intention — words timed to voice and music so every message lands.",
       es: "Tipografía que se mueve con ritmo e intención: palabras sincronizadas con la voz y la música para que cada mensaje impacte.",
       tags: [...BASE, "Illustrator"] },
  3: { en: "Clean, Dan Koe–style animation: few elements, precise timing and plenty of negative space.",
       es: "Animación limpia al estilo Dan Koe: pocos elementos, timing preciso y mucho espacio negativo.",
       tags: [...BASE] },
  4: { en: "Scroll-stopping vertical content and ads for brands like Cashea, Addnice and Mercado Libre.",
       es: "Contenido vertical y anuncios que frenan el scroll, para marcas como Cashea, Addnice y Mercado Libre.",
       tags: [...BASE, "Photoshop", "ElevenLabs", "Adobe Podcast", "AI Gen"] },
  6: { en: "Logo reveals and brand intros that give an identity its first heartbeat.",
       es: "Revelados de logo e intros de marca que le dan a una identidad su primer latido.",
       tags: [...BASE] },
  7: { en: "Interface animations and product showcases — showing how an app feels, not just how it looks.",
       es: "Animaciones de interfaz y showcases de producto: muestran cómo se siente una app, no solo cómo se ve.",
       tags: [...BASE] },
  8: { en: "Looping, generative backgrounds for screens, events and stages.",
       es: "Fondos generativos en loop para pantallas, eventos y escenarios.",
       tags: [...BASE] },
  9: { en: "Longer edits — YouTube videos, interviews and event recaps, with pacing, sound design and motion graphics.",
       es: "Ediciones largas: videos de YouTube, entrevistas y resúmenes de eventos, con ritmo, diseño sonoro y motion graphics.",
       tags: [...BASE, "ElevenLabs"] },
  10: { en: "Videos generated with AI models and finished with motion design.",
        es: "Videos generados con modelos de IA y terminados con motion design.",
        tags: [...BASE, "Higgsfield", "Runway", "Seedream", "Remotion", "Magnific", "Claude Code", "Antigravity", "Codex"] },
};

const projects: Project[] = [
  {
    id: 1,
    title: "Motion Narrative",
    category: "Animation",
    image: "/covers/motion-narrative.webp",
    videos: ["Sq8HyEhXAYM", "ZFhZstN-gV0", "rYUx7LVM_iw","6-GJIqHH7wg", "zYzLro-d5jo"]
  },
  {
    id: 2,
    title: "Kinetic Typography",
    category: "Typography",
    image: "/covers/kinetic.webp",
    videos: ["Rc0yG9p9-ns", "PpMRNkPnA6o", "LuYrlKh2_Lo"]
  },
  {
    id: 3,
    title: "Minimalist",
    category: "Style",
    image: "/covers/minimalist.webp",
    videos: ["PTHEPM34wlk", "PgOQ2mEBIFw", "20b8lFZ3I9c", "NTON1b1vmeI"]
  },
  {
    id: 4,
    title: "Social Media",
    category: "Content",
    image: "/covers/social-media.webp",
    videos: ["3BxmxXZetrQ", "LoIoU1KINDY", "WhpoBDGP3Nc", "20b8lFZ3I9c", "_vw2Ws0V5k8", "ScWMtJoviDk", "sgKGJz_Nrbw", "YrATij0ilZY", "F40p_FA9BnU", "x4VkU7qg_LQ", "bBcI5DwbNrw", "s0AvuRQP16M","c8RDT3T0qNY","rmQQdkXtuTE","ZsfVYNSwr4A","LfhWfHBPOMU","A8VsAxeQFkI","U6O9YYA4-3c"]
  },
  {
    id: 6,
    title: "Logo animation",
    category: "Branding",
    image: "/covers/logo-animation.webp",
    videos: ["YOyoXkFTp50", "gKfQuRYIzS0", "36Zd44weTmA", "4YD__Ie-ghY", "Ua3sqZmoKrQ", "eOTPjy-Fow8", "rZVFAHm61UM", "DOMCyp-lHq0"]
  },
  {
    id: 7,
    title: "UX UI",
    category: "Interface",
    image: "/covers/ux-ui.webp",
    videos: ["09rOZHMihbc", "ajPRSX3PAgk", "vxdvbLCZn5U", "8N2LEo9ysXc", "F40p_FA9BnU", "x4VkU7qg_LQ", "zYzLro-d5jo"]
  },
  {
    id: 8,
    title: "Dynamic Backgrounds",
    category: "Generative",
    image: "/covers/dynamic.webp",
    videos: ["2_jLrn3C_rk", "PFzDJlHQ35o", "YIgjFZhLYd0", "OJUA6cSnMI8", "-iWsnjFEJu0", "k2wqBYzhlfs", "3AkLAKfi98I"]
  },
  {
    id: 9,
    title: "Long Form",
    category: "Video Editing",
    image: "/covers/long-form.webp",
    // TODO: add YouTube IDs. Long videos are 16:9 by default.
    videos: []
  },
  {
    id: 10,
    title: "AI Gen",
    category: "AI Video",
    image: "/covers/ai-gen.webp",
    // TODO: add YouTube IDs. Add horizontal ones to the horizontalIds list.
    videos: []
  }
];

// Horizontal (16:9) videos — everything else is a vertical Short (verified against YouTube)
const horizontalIds = new Set(['gKfQuRYIzS0', '2_jLrn3C_rk', 'Ua3sqZmoKrQ', 'vxdvbLCZn5U', '8N2LEo9ysXc', 'eOTPjy-Fow8', 'PpMRNkPnA6o', 'F40p_FA9BnU', 'NTON1b1vmeI', 'zYzLro-d5jo', 'k2wqBYzhlfs', 'ZsfVYNSwr4A', 'LfhWfHBPOMU', 'A8VsAxeQFkI']);

// Projects whose videos are all horizontal (16:9) unless listed otherwise
const horizontalByDefault = new Set<number>([9]);

export default function ProjectGrid() {
  const { t, language } = useLanguage();
  // Bilingual project titles (only the ones that differ per language)
  const titleES: Record<string, string> = {
    "Motion Narrative": "Narrativa Animada",
    "Kinetic Typography": "Tipografía Cinética",
    Minimalist: "Minimalista",
    "Social Media": "Redes Sociales",
    "Logo animation": "Animación de Logos",
    "UX UI": "UX UI",
    "Dynamic Backgrounds": "Fondos Dinámicos",
    "Long Form": "Formato Largo",
    "AI Gen": "Generado con IA",
  };
  const projTitle = (title: string) =>
    language === "es" ? titleES[title] || title : title;
  // Bilingual category labels
  const catES: Record<string, string> = {
    Animation: "Animación",
    Typography: "Tipografía",
    Style: "Estilo",
    Content: "Contenido",
    Branding: "Marca",
    Interface: "Interfaz",
    Generative: "Generativo",
    "Video Editing": "Edición de Video",
    "AI Video": "Video con IA",
  };
  const projCat = (cat: string) => (language === "es" ? catES[cat] || cat : cat);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  useEffect(() => {
    // Notify Navbar to hide/show
    const event = new CustomEvent('toggleNavbar', { detail: selectedProject !== null });
    window.dispatchEvent(event);

    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProject(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedProject]);

  // Stacking cards: progress through the whole stack drives scaling + the live counter
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  // Where each card lands (0..1 of the stack's scroll). Each sticky slot is H tall
  // (86vh / 88vh on md) and the stack ends with a spacer, so card i settles at
  // i*H / (n*H + spacer - 1vh). Measured from the viewport so every card —
  // including the last ones — gets the same time in focus.
  const [settle, setSettle] = useState<number[]>(() => projects.map((_, i) => i / projects.length));
  useEffect(() => {
    const calc = () => {
      const n = projects.length;
      const h = window.innerWidth >= 768 ? 0.88 : 0.86;
      const range = n * h + STACK_TAIL - 1;
      setSettle(projects.map((_, i) => (i * h) / range));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // a card becomes "the top one" once the next one is more than half-way in
    let i = 0;
    for (let k = 1; k < settle.length; k++) {
      if (v >= settle[k] - (settle[k] - settle[k - 1]) * 0.5) i = k;
    }
    setCurrent((prev) => (prev === i ? prev : i));
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <section id="work" className="relative py-24 md:py-40 px-4 md:px-12 overflow-x-clip">
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
        >
          <div>
            <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.5em] block mb-4" style={{ color: "#E9B872" }}>
              {t('projects.label')}
            </span>
            <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-[0.9]">{t('projects.title')}</h2>
          </div>
          <span className="text-[10px] font-grotesk font-light uppercase tracking-[0.4em] text-white/60">
            <span style={{ color: "#E9B872" }}>{String(current + 1).padStart(2, "0")}</span> — {String(projects.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Stacking cards — each one sticks to the top and the next slides over it */}
        <div ref={stackRef} className="relative">
          {projects.map((project, index) => (
            <StackCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              progress={scrollYProgress}
              settle={settle}
              isTop={index === current}
              title={projTitle(project.title)}
              category={language === "es" ? "Estilo" : "Style"}
              viewLabel={t('projects.view')}
              desc={details[project.id]?.[language] ?? ""}
              tags={details[project.id]?.tags ?? []}
              onOpen={() => handleProjectClick(project)}
            />
          ))}
          {/* tail: lets the last cards rest in focus before the stack scrolls away */}
          <div aria-hidden style={{ height: `${STACK_TAIL * 100}vh` }} />
        </div>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto overscroll-contain liquid-glass rounded-3xl px-4 pb-6 sm:px-8 sm:pb-8 md:px-12 md:pb-12 border border-white/10 shadow-2xl"
            >
              {/* Sticky so it stays reachable while scrolling long reels */}
              <div className="sticky top-0 z-20 flex justify-end pt-4 md:pt-6 -mb-12 pointer-events-none">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="pointer-events-auto text-white/70 hover:text-white transition-colors bg-black/60 hover:bg-black/80 backdrop-blur p-2 rounded-full"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6 md:mb-10 pt-6 md:pt-10 pr-14">
                <span className="text-[10px] font-poppins font-bold uppercase tracking-[0.3em] text-white/50 mb-2 block text-shadow-strong">
                  {projCat(selectedProject.category)}
                </span>
                <h3 className="text-3xl md:text-5xl font-poppins font-bold uppercase tracking-tighter text-shadow-strong">
                  {projTitle(selectedProject.title)}
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row-dense gap-3 md:gap-6">
                {!selectedProject.videos?.length && (
                  <div className="col-span-full py-16 text-center text-[10px] font-grotesk uppercase tracking-[0.4em] text-white/50">
                    {t('projects.soon')}
                  </div>
                )}
                {(() => {
                  const vids = selectedProject.videos ?? [];
                  const isH = (id: string) => horizontalByDefault.has(selectedProject.id) || horizontalIds.has(id);
                  const horiz = vids.filter(isH);
                  const vert = vids.filter((v) => !isH(v));
                  // horizontals first so rows stay clean; verticals after
                  return [...horiz, ...vert].map((videoId, idx) => {
                    const isHorizontal = isH(videoId);
                    const lone = isHorizontal && horiz.length % 2 === 1 && idx === horiz.length - 1;
                    return (
                      <div
                        key={videoId + idx}
                        className={`${isHorizontal ? `aspect-video col-span-2 md:col-span-3 ${lone ? 'lg:col-span-4' : 'lg:col-span-2'}` : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/50 border border-white/5 relative group`}
                      >
                        <LiteYouTube id={videoId} title={`${selectedProject.title} video ${idx + 1}`} />
                      </div>
                    );
                  });
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function StackCard({
  project, index, total, progress, settle, isTop, title, category, viewLabel, desc, tags, onOpen,
}: {
  project: Project; index: number; total: number; progress: MotionValue<number>; settle: number[]; isTop: boolean;
  title: string; category: string; viewLabel: string; desc: string; tags: string[]; onOpen: () => void; key?: string | number;
}) {
  const isLast = index === total - 1;
  // from the moment this card lands until the next one fully covers it: shrink a little and dim
  const start = settle[index];
  const next = isLast ? 1 : settle[index + 1];
  const end = Math.min(1, settle[total - 1] ?? 1);
  const scale = useTransform(progress, [start, Math.max(start + 0.001, end)], [1, isLast ? 1 : 1 - (total - 1 - index) * 0.025]);
  const dim = useTransform(progress, [start + (next - start) * 0.5, Math.max(start + 0.002, next)], [0, isLast ? 0 : 0.6]);

  return (
    <div className="sticky top-0 h-[86vh] md:h-[88vh] flex items-start justify-center">
      <motion.div
        style={{ scale, top: `calc(12vh + ${index * 14}px)` }}
        onClick={onOpen}
        data-card-id={project.id}
        className="stack-card cursor-grow group relative origin-top w-full max-w-6xl h-[70vh] md:h-[62vh] rounded-3xl overflow-hidden cursor-pointer bg-zinc-900 grid grid-rows-[42%_1fr] md:grid-rows-1 md:grid-cols-[1.35fr_1fr] shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Left: image */}
        <div className="relative overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
              {...(index === 0 ? { fetchPriority: "high" as const } : {})}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out
                ${isTop ? "grayscale-0 opacity-100 scale-100" : "grayscale opacity-60 scale-105"} group-hover:scale-[1.04]`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`absolute inset-0 card-cover ${isTop ? "is-active" : ""}`}>
              <span className="card-cover__word font-display font-bold uppercase tracking-tighter">
                {project.title === "AI Gen" ? "AI" : "16:9"}
              </span>
            </div>
          )}
        </div>

        {/* Right: info panel */}
        <div className="stack-card__panel relative flex flex-col p-6 md:p-10 min-h-0">
          <div className="flex items-center gap-3">
            <span className="stack-card__pill px-3 py-1 rounded-full text-[9px] md:text-[10px] font-grotesk font-medium uppercase tracking-[0.25em]">
              {category}
            </span>
            <span className="text-[10px] font-grotesk tracking-[0.3em] text-white/40">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-4 md:mt-6 text-3xl md:text-5xl font-poppins font-bold tracking-tight leading-[1.02]">
            {title}
          </h3>
          <p className="mt-3 md:mt-5 text-sm md:text-base font-light leading-relaxed text-white/60 line-clamp-3 md:line-clamp-4">
            {desc}
          </p>

          <div className="mt-auto pt-5">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="stack-card__tag px-3 py-1 rounded-full text-[10px] md:text-[11px] font-grotesk text-white/50">
                  {tag}
                </span>
              ))}
            </div>
            <div className="stack-card__divider my-4 md:my-6" />
            <span className="inline-flex items-center gap-2 text-sm md:text-base font-grotesk text-white/90">
              {viewLabel}
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "#E9B872" }}>↗</span>
            </span>
          </div>
        </div>

        {/* dashed amber stroke, marching on the card that's on top */}
        <svg className={`stack-card__stroke ${isTop ? "is-top" : ""}`} aria-hidden>
          <rect x="0.75" y="0.75" rx="24" ry="24" />
        </svg>

        {/* dims as the next card slides over */}
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black pointer-events-none z-20" />
      </motion.div>
    </div>
  );
}

// Lightweight YouTube embed: shows the thumbnail + play button and only loads the
// real player when clicked. Opening a style with 18 videos no longer loads 18 players.
function LiteYouTube({ id, title }: { id: string; title: string; key?: string | number }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1&playsinline=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={`Play ${title}`}
      className="cursor-grow group/yt absolute inset-0 w-full h-full"
    >
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/yt:opacity-100 group-hover/yt:scale-105 transition-all duration-500"
      />
      <span className="absolute inset-0 bg-black/20 group-hover/yt:bg-black/0 transition-colors" />
    </button>
  );
}
