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

const projects: Project[] = [
  {
    id: 1,
    title: "Motion Narrative",
    category: "Animation",
    image: "/motion-narrative.png",
    videos: ["Sq8HyEhXAYM", "ZFhZstN-gV0", "rYUx7LVM_iw","6-GJIqHH7wg", "zYzLro-d5jo"]
  },
  {
    id: 2,
    title: "Kinetic Typography",
    category: "Typography",
    image: "https://i.ibb.co/S7KZzZ3K/ee.jpg",
    videos: ["Rc0yG9p9-ns", "PpMRNkPnA6o", "LuYrlKh2_Lo"]
  },
  {
    id: 3,
    title: "Minimalist",
    category: "Style",
    image: "https://i.ibb.co/hxks1nmf/fddd.jpg",
    videos: ["PTHEPM34wlk", "PgOQ2mEBIFw", "20b8lFZ3I9c", "NTON1b1vmeI"]
  },
  {
    id: 4,
    title: "Social Media",
    category: "Content",
    image: "/social-media.png",
    videos: ["3BxmxXZetrQ", "LoIoU1KINDY", "WhpoBDGP3Nc", "20b8lFZ3I9c", "_vw2Ws0V5k8", "ScWMtJoviDk", "sgKGJz_Nrbw", "YrATij0ilZY", "F40p_FA9BnU", "x4VkU7qg_LQ", "bBcI5DwbNrw", "s0AvuRQP16M","c8RDT3T0qNY","rmQQdkXtuTE","ZsfVYNSwr4A","LfhWfHBPOMU","A8VsAxeQFkI","U6O9YYA4-3c"]
  },
  {
    id: 6,
    title: "Logo animation",
    category: "Branding",
    image: "/logo-animation.png",
    videos: ["YOyoXkFTp50", "gKfQuRYIzS0", "36Zd44weTmA", "4YD__Ie-ghY", "Ua3sqZmoKrQ", "eOTPjy-Fow8", "rZVFAHm61UM", "DOMCyp-lHq0"]
  },
  {
    id: 7,
    title: "UX UI",
    category: "Interface",
    image: "/ux-ui.png",
    videos: ["09rOZHMihbc", "ajPRSX3PAgk", "vxdvbLCZn5U", "8N2LEo9ysXc", "F40p_FA9BnU", "x4VkU7qg_LQ", "zYzLro-d5jo"]
  },
  {
    id: 8,
    title: "Dynamic Backgrounds",
    category: "Generative",
    image: "https://i.ibb.co/G4WtH9Vz/image.jpg",
    videos: ["2_jLrn3C_rk", "PFzDJlHQ35o", "YIgjFZhLYd0", "OJUA6cSnMI8", "-iWsnjFEJu0", "k2wqBYzhlfs", "3AkLAKfi98I"]
  },
  {
    id: 9,
    title: "Long Form",
    category: "Video Editing",
    // TODO: add a cover image + YouTube IDs. Long videos are 16:9 by default.
    videos: []
  },
  {
    id: 10,
    title: "AI Gen",
    category: "AI Video",
    // TODO: add a cover image + YouTube IDs. Add horizontal ones to the isHorizontal list.
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
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(projects.length - 1, Math.max(0, Math.floor(v * projects.length)));
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
              isTop={index === current}
              title={projTitle(project.title)}
              category={projCat(project.category)}
              viewLabel={t('projects.view')}
              onOpen={() => handleProjectClick(project)}
            />
          ))}
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
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                          title={`${selectedProject.title} video ${idx + 1}`}
                          loading="lazy"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
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
  project, index, total, progress, isTop, title, category, viewLabel, onOpen,
}: {
  project: Project; index: number; total: number; progress: MotionValue<number>; isTop: boolean;
  title: string; category: string; viewLabel: string; onOpen: () => void; key?: string | number;
}) {
  const isLast = index === total - 1;
  // once the next card starts covering this one, shrink it a little and dim it
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, isLast ? 1 : 1 - (total - 1 - index) * 0.025]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, isLast ? 0 : 0.6]);

  return (
    <div className="sticky top-0 h-[78vh] md:h-[88vh] flex items-start justify-center">
      <motion.div
        style={{ scale, top: `calc(13vh + ${index * 14}px)` }}
        onClick={onOpen}
        data-card-id={project.id}
        className="stack-card cursor-grow group relative origin-top w-full max-w-6xl h-[56vh] md:h-[66vh] rounded-3xl overflow-hidden cursor-pointer bg-zinc-900 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)]"
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out
              ${isTop ? "grayscale-0 opacity-90 scale-100" : "grayscale opacity-60 scale-105"} group-hover:scale-[1.03]`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className={`absolute inset-0 card-cover ${isTop ? "is-active" : ""}`}>
            <span className="card-cover__word font-display font-bold uppercase tracking-tighter">
              {project.title === "AI Gen" ? "AI" : "16:9"}
            </span>
          </div>
        )}

        {/* readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

        {/* dashed amber stroke, marching on the card that's on top */}
        <svg className={`stack-card__stroke ${isTop ? "is-top" : ""}`} aria-hidden>
          <rect x="0.75" y="0.75" rx="24" ry="24" />
        </svg>

        {/* top row */}
        <div className="absolute top-5 left-5 right-5 md:top-7 md:left-8 md:right-8 flex items-center justify-between z-10 text-[10px] font-grotesk tracking-[0.35em] uppercase">
          <span className="text-white/70 text-shadow-strong">
            <span style={{ color: "#E9B872" }}>{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
          </span>
          <span className="text-shadow-strong" style={{ color: "#E9B872" }}>{category}</span>
        </div>

        {/* bottom row */}
        <div className="absolute left-5 right-5 bottom-5 md:left-8 md:right-8 md:bottom-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 z-10">
          <h3 className="text-4xl sm:text-5xl md:text-7xl font-poppins font-bold uppercase tracking-tighter leading-[0.9] text-shadow-strong">
            {title}
          </h3>
          <span className="stack-card__cta self-start md:self-auto inline-flex items-center gap-3 rounded-full px-5 py-3 text-[10px] font-grotesk uppercase tracking-[0.35em] whitespace-nowrap">
            {viewLabel} <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </span>
        </div>

        {/* dims as the next card slides over */}
        <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black pointer-events-none z-20" />
      </motion.div>
    </div>
  );
}
