import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { X, Lock } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image?: string; // optional: cards without an image show a typographic cover
  videos?: string[]; // YouTube video IDs
  requestAccess?: boolean; // not clickable: visitors ask by email for access to a private Drive
}

// Description + tools shown on the right side of each card
const BASE = ["After Effects", "Premiere Pro"];
// extra scroll (in viewport heights) after the last card so it rests in focus
const STACK_TAIL = 0.35;
const details: Record<number, { en: string; es: string; tags: string[] }> = {
  1: { en: "Story-driven animation that turns an idea into a visual narrative. I write the beats, design every scene and animate it frame by frame, so brand stories, explainers and launches feel like a short film, not a slideshow — with illustration, AI imagery and sound carrying the message.",
       es: "Animación con narrativa que convierte una idea en una historia visual. Escribo los momentos clave, diseño cada escena y la animo cuadro a cuadro, para que historias de marca, explainers y lanzamientos se sientan como un cortometraje y no como una presentación, con ilustración, imágenes de IA y sonido contando el mensaje.",
       tags: [...BASE, "Illustrator", "AI Image Generation"] },
  2: { en: "Type that moves with rhythm and intention. Every word is timed to the voice and the music, with weight, speed and spacing that follow the emotion of the script, so the message lands even with the sound off. Ideal for quotes, podcasts, ads and launch teasers.",
       es: "Tipografía que se mueve con ritmo e intención. Cada palabra está sincronizada con la voz y la música, con peso, velocidad y espaciado que siguen la emoción del guion, para que el mensaje llegue incluso sin sonido. Ideal para frases, podcasts, anuncios y teasers de lanzamiento.",
       tags: [...BASE, "Illustrator"] },
  3: { en: "Clean, Dan Koe–style animation: few elements, precise timing and plenty of negative space. Simple shapes, a restrained palette and smooth easing keep all the attention on the idea, perfect for creators, educational content and brands that want to look calm and premium.",
       es: "Animación limpia al estilo Dan Koe: pocos elementos, timing preciso y mucho espacio negativo. Formas simples, una paleta contenida y curvas de animación suaves mantienen toda la atención en la idea; perfecta para creadores, contenido educativo y marcas que quieren verse calmas y premium.",
       tags: [...BASE] },
  4: { en: "Scroll-stopping vertical content and ads for brands like Cashea, Addnice and Mercado Libre. Fast hooks in the first second, captions, sound design and clean voice-overs, built natively for Reels, TikTok and Shorts and tested to keep people watching until the end.",
       es: "Contenido vertical y anuncios que frenan el scroll, para marcas como Cashea, Addnice y Mercado Libre. Ganchos rápidos en el primer segundo, subtítulos, diseño sonoro y voces limpias, pensados de forma nativa para Reels, TikTok y Shorts para que la gente mire hasta el final.",
       tags: [...BASE, "Photoshop", "ElevenLabs", "Adobe Podcast", "AI Gen"] },
  6: { en: "Logo reveals and brand intros that give an identity its first heartbeat. I study the shapes and the personality of the brand to build an animation that feels like it, with versions for intros, outros, socials and presentations, so the logo moves the same way everywhere.",
       es: "Revelados de logo e intros de marca que le dan a una identidad su primer latido. Estudio las formas y la personalidad de la marca para crear una animación que se sienta propia, con versiones para intros, cierres, redes y presentaciones, así el logo se mueve igual en todos lados.",
       tags: [...BASE] },
  7: { en: "Interface animation and product showcases for apps, websites and SaaS platforms. I take real screens and turn them into clear, smooth demos — onboarding flows, feature launches and dashboard walkthroughs — that show how the product feels, not just how it looks.",
       es: "Animación de interfaces y showcases de producto para apps, sitios web y plataformas SaaS. Tomo pantallas reales y las convierto en demos claras y fluidas —onboardings, lanzamientos de funciones y recorridos de dashboards— que muestran cómo se siente el producto, no solo cómo se ve.",
       tags: [...BASE] },
  8: { en: "Looping, generative backgrounds for screens, events, stages and live streams. Organic shapes, light and texture that move continuously without distracting, designed to loop seamlessly and to match the colours and the mood of each brand or show.",
       es: "Fondos generativos en loop para pantallas, eventos, escenarios y transmisiones en vivo. Formas orgánicas, luz y textura que se mueven todo el tiempo sin distraer, diseñadas para repetirse sin cortes y para acompañar los colores y el clima de cada marca o show.",
       tags: [...BASE] },
  9: { en: "Longer edits — YouTube videos, interviews, podcasts and event recaps. I shape the story in the edit, find the pace, clean up the audio and add motion graphics and sound design. These projects are client work protected by copyright and confidentiality agreements, so they aren't public: request access and I'll share the private Drive folder with you.",
       es: "Ediciones largas: videos de YouTube, entrevistas, podcasts y resúmenes de eventos. Armo la historia en la edición, encuentro el ritmo, limpio el audio y sumo motion graphics y diseño sonoro. Estos proyectos son trabajos para clientes protegidos por derechos de autor y acuerdos de confidencialidad, por eso no son públicos: pedí acceso y te comparto la carpeta privada de Drive.",
       tags: [...BASE, "ElevenLabs"] },
  10: { en: "Videos generated with AI models and finished with motion design. I combine image and video models with my own animation, editing and code-driven tools to create visuals that would be impossible or too expensive to shoot, keeping a consistent look across every shot.",
        es: "Videos generados con modelos de IA y terminados con motion design. Combino modelos de imagen y video con mi propia animación, edición y herramientas basadas en código para crear visuales imposibles o demasiado caros de filmar, manteniendo una estética coherente en cada plano.",
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
    title: "UX UI & SaaS",
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
    // Client work under copyright: no public videos, visitors request access to the Drive by email
    videos: [],
    requestAccess: true
  },
  {
    id: 10,
    title: "AI Gen",
    category: "AI Video",
    image: "/covers/ai-gen.webp",
    // Addnice ads + "¿Qué pasaría si...?" (shared with Social Media / Motion Narrative)
    videos: ["sZxtqu7NCSM", "ictQAlYS0MU", "6-GJIqHH7wg", "c8RDT3T0qNY", "rmQQdkXtuTE", "ZsfVYNSwr4A", "LfhWfHBPOMU", "A8VsAxeQFkI", "U6O9YYA4-3c"]
  }
];

// Horizontal (16:9) videos — everything else is a vertical Short (verified against YouTube)
const horizontalIds = new Set(['gKfQuRYIzS0', '2_jLrn3C_rk', 'Ua3sqZmoKrQ', 'vxdvbLCZn5U', '8N2LEo9ysXc', 'eOTPjy-Fow8', 'PpMRNkPnA6o', 'F40p_FA9BnU', 'NTON1b1vmeI', 'zYzLro-d5jo', 'k2wqBYzhlfs', 'ZsfVYNSwr4A', 'LfhWfHBPOMU', 'A8VsAxeQFkI']);

// Projects whose videos are all horizontal (16:9) unless listed otherwise
const horizontalByDefault = new Set<number>([9]);

// Long Form: the button opens the visitor's mail app with a ready-to-send access request
const ACCESS_EMAIL = "santilacuara@gmail.com";
function accessMailto(lang: string) {
  const es = lang === "es";
  const subject = es ? "Solicitud de acceso — Long Form" : "Access request — Long Form";
  const body = es
    ? "Hola Santiago,\n\nVi tu portfolio y me gustaría ver tus trabajos de Long Form. ¿Me podrías dar acceso a la carpeta de Drive?\n\nNombre:\nEmpresa:\n\n¡Gracias!"
    : "Hi Santiago,\n\nI saw your portfolio and would like to see your Long Form work. Could you give me access to the Drive folder?\n\nName:\nCompany:\n\nThanks!";
  return `mailto:${ACCESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ProjectGrid() {
  const { t, language } = useLanguage();
  // Bilingual project titles (only the ones that differ per language)
  const titleES: Record<string, string> = {
    "Motion Narrative": "Narrativa Animada",
    "Kinetic Typography": "Tipografía Cinética",
    Minimalist: "Minimalista",
    "Social Media": "Redes Sociales",
    "Logo animation": "Animación de Logos",
    "UX UI & SaaS": "UX UI y SaaS",
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

  // Stacking cards. Everything is measured in real pixels from the DOM (never from
  // `vh`): on iPhone the Safari / in-app browser bars change the visible height, so
  // vh-based maths drifted and cards stayed dimmed while on top.
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();
  const [metrics, setMetrics] = useState({ top: 0, slot: 1 });
  useEffect(() => {
    const measure = () => {
      const el = stackRef.current;
      const slot = el?.children[0] as HTMLElement | undefined;
      if (!el || !slot) return;
      const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
      const h = slot.offsetHeight || 1;
      setMetrics((m) => (m.top === top && m.slot === h ? m : { top, slot: h }));
    };
    measure();
    // layout above the stack can change (photo, fonts, timeline) → re-measure
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  // which card is on top: the next one takes over once it's half-way in
  const [current, setCurrent] = useState(0);
  const [inStack, setInStack] = useState(false);
  const update = (y: number) => {
    const rel = (y - metrics.top) / metrics.slot;
    const i = Math.min(projects.length - 1, Math.max(0, Math.floor(rel + 0.5)));
    setCurrent((prev) => (prev === i ? prev : i));
    const vh = window.innerHeight;
    const stackH = stackRef.current?.offsetHeight ?? 0;
    const on = y + vh * 0.5 > metrics.top && y + vh * 0.6 < metrics.top + stackH;
    setInStack((p) => (p === on ? p : on));
  };
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => { update(window.scrollY); }, [metrics]);

  const jumpTo = (i: number) => {
    window.scrollTo({ top: metrics.top + i * metrics.slot + 2, behavior: "smooth" });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <section id="work" className="relative pt-24 pb-6 md:py-40 px-4 md:px-12 overflow-x-clip">
      <div className="max-w-screen-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
        >
          <div>
            <span className="text-[10px] font-grotesk font-medium uppercase tracking-[0.5em] block mb-4" style={{ color: "var(--accent-ink)" }}>
              {t('projects.label')}
            </span>
            <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-[0.9]">{t('projects.title')}</h2>
          </div>
          <span className="text-[10px] font-grotesk font-light uppercase tracking-[0.4em] text-white/60">
            <span style={{ color: "var(--accent-ink)" }}>{String(current + 1).padStart(2, "0")}</span> — {String(projects.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Stacking cards — each one sticks to the top and the next slides over it */}
        <div ref={stackRef} className="relative lg:pr-[230px] xl:pr-[250px]">
          {projects.map((project, index) => (
            <StackCard
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              scrollY={scrollY}
              metrics={metrics}
              lite={isMobile}
              isTop={index === current}
              isPast={index < current}
              title={projTitle(project.title)}
              category={language === "es" ? "Estilo" : "Style"}
              viewLabel={t('projects.view')}
              accessLabel={language === "es" ? "Solicitar acceso" : "Request access"}
              accessHref={accessMailto(language)}
              desc={details[project.id]?.[language] ?? ""}
              tags={details[project.id]?.tags ?? []}
              onOpen={() => handleProjectClick(project)}
            />
          ))}
          {/* tail: lets the last cards rest in focus before the stack scrolls away */}
          <div aria-hidden style={{ height: `${STACK_TAIL * 100}vh` }} />
        </div>
      </div>

      <StyleIndex
        titles={projects.map((p) => projTitle(p.title))}
        current={current}
        visible={inStack && !selectedProject && !isMobile}
        label={t('projects.title')}
        onJump={jumpTo}
      />

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
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto overscroll-contain liquid-glass reel-modal rounded-3xl px-4 pb-6 sm:px-8 sm:pb-8 md:px-12 md:pb-12 border border-white/10 shadow-2xl"
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
                  {language === "es" ? "Estilo" : "Style"}
                </span>
                <h3 className="text-3xl md:text-5xl font-poppins font-bold uppercase tracking-tighter text-shadow-strong">
                  {projTitle(selectedProject.title)}
                </h3>
                {details[selectedProject.id] && (
                  <p className="mt-4 max-w-3xl text-sm md:text-base font-light leading-relaxed text-white/70">
                    {details[selectedProject.id][language]}
                  </p>
                )}
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
                        className={`${isHorizontal ? `aspect-video col-span-2 md:col-span-3 ${lone ? 'lg:col-span-4' : 'lg:col-span-2'}` : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-[#111] border border-white/5 relative group`}
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

// true on phones (≤767px). Read once and on resize — never per scroll frame.
function useIsMobile() {
  const q = "(max-width: 767px)";
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

function StackCard({
  project, index, total, scrollY, metrics, lite, isTop, isPast, title, category, viewLabel, accessLabel, accessHref, desc, tags, onOpen,
}: {
  project: Project; index: number; total: number; scrollY: MotionValue<number>; metrics: { top: number; slot: number };
  lite: boolean; isTop: boolean; isPast: boolean;
  title: string; category: string; viewLabel: string; accessLabel: string; accessHref: string; desc: string; tags: string[]; onOpen: () => void; key?: string | number;
}) {
  const isLast = index === total - 1;
  const locked = !!project.requestAccess;
  // Desktop: from the moment this card lands until the next one covers it, shrink a
  // little and dim — driven by scroll. Mobile ("lite"): nothing runs per frame; the
  // sticky stacking is native (compositor) and the dim is a CSS transition.
  const start = metrics.top + index * metrics.slot;
  const next = start + metrics.slot;
  const end = metrics.top + (total - 1) * metrics.slot;
  const scale = useTransform(scrollY, [start, Math.max(start + 1, end)], [1, isLast ? 1 : 1 - (total - 1 - index) * 0.025]);
  const dim = useTransform(scrollY, [start + metrics.slot * 0.5, next], [0, isLast ? 0 : 0.6]);

  return (
    <div className="sticky top-0 h-[86svh] md:h-[88vh] flex items-start justify-center">
      <motion.div
        style={lite ? { top: `calc(10svh + ${index * 10}px)` } : { scale, top: `calc(12vh + ${index * 14}px)` }}
        onClick={locked ? undefined : onOpen}
        data-card-id={project.id}
        className={`stack-card ${locked ? "" : "cursor-grow cursor-pointer"} group relative origin-top w-full max-w-6xl h-[72svh] md:h-[66vh] rounded-3xl overflow-hidden bg-zinc-900 grid ${locked ? "grid-rows-[18%_1fr]" : "grid-rows-[36%_1fr]"} md:grid-rows-1 md:grid-cols-[1.1fr_1fr] md:shadow-[0_-20px_60px_-20px_var(--card-shadow)]`}
      >
        {/* Left: image */}
        <div className="relative overflow-hidden">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="eager"
              decoding="async"
              fetchPriority={index < 2 ? "high" : "low"}
              // mobile: always fully visible — no filter, zoom or fade tied to scroll (iOS runs JS late during momentum scroll)
              className={`stack-card__img absolute inset-0 w-full h-full object-cover transition-[opacity,transform,filter] duration-700 ease-out
                ${isTop ? "md:opacity-100 md:grayscale-0 md:scale-100" : "md:opacity-60 md:grayscale md:scale-105"} md:group-hover:scale-[1.04]`}
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
        <div className="stack-card__panel relative flex flex-col p-6 md:p-8 xl:p-10 min-h-0">
          <div className="flex items-center gap-3">
            <span className="stack-card__pill px-3 py-1 rounded-full text-[9px] md:text-[10px] font-grotesk font-medium uppercase tracking-[0.25em]">
              {category}
            </span>
            <span className="text-[10px] font-grotesk tracking-[0.3em] text-white/40">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          <h3 className="mt-4 md:mt-5 text-3xl md:text-4xl xl:text-5xl font-poppins font-bold tracking-tight leading-[1.02]">
            {title}
          </h3>
          <p className={`mt-3 md:mt-5 text-[13px] md:text-[15px] font-light leading-relaxed text-white/65 ${locked ? "md:line-clamp-[8]" : "line-clamp-4 md:line-clamp-7"}`}>
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
            <div className="stack-card__divider my-4 md:my-5" />
            {locked ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={accessHref}
                  className="cursor-grow inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full text-sm md:text-base font-grotesk font-semibold text-[#1A1612] transition-transform duration-300 hover:scale-[1.03]"
                  style={{ background: "#E9B872" }}
                >
                  <Lock aria-hidden size={16} strokeWidth={2.4} /> {accessLabel}
                </a>
                <span className="text-[11px] md:text-xs font-grotesk text-white/45 select-all">{ACCESS_EMAIL}</span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-grotesk text-white/90">
                {viewLabel}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "var(--accent-ink)" }}>↗</span>
              </span>
            )}
          </div>
        </div>

        {/* dashed amber stroke, marching on the card that's on top */}
        <svg className={`stack-card__stroke ${isTop ? "is-top" : ""}`} aria-hidden>
          <rect x="0.75" y="0.75" rx="24" ry="24" />
        </svg>

        {/* dims as the next card slides over */}
        {lite ? (
          <div className={`absolute inset-0 bg-black pointer-events-none z-20 transition-opacity duration-500 ${isPast ? "opacity-60" : "opacity-0"}`} />
        ) : (
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black pointer-events-none z-20" />
        )}
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
      <span className="absolute inset-0 bg-[rgba(0,0,0,0.2)] group-hover/yt:bg-transparent transition-colors" />
    </button>
  );
}

/**
 * Index of the styles (desktop only). A column of amber pills on the right —
 * always readable; the active style is solid amber, the rest tinted. Click to jump.
 */
function StyleIndex({ titles, current, visible, label, onJump }: {
  titles: string[]; current: number; visible: boolean; label: string; onJump: (i: number) => void;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          key="rail"
          aria-label={label}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="style-rail hidden lg:flex fixed right-5 xl:right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2"
        >
          {titles.map((title, i) => {
            const on = i === current;
            return (
              <button key={title} onClick={() => onJump(i)} aria-current={on ? "true" : undefined}
                className={`style-rail__pill cursor-grow flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-grotesk font-semibold uppercase tracking-[0.16em] ${on ? "is-on" : ""}`}>
                <span className="tabular-nums opacity-70">{pad(i + 1)}</span>
                {title}
              </button>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
