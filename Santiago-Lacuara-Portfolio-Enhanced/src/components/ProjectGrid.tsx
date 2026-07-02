import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { X } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  videos?: string[]; // YouTube video IDs
}

const projects: Project[] = [
  {
    id: 1,
    title: "Motion Narrative",
    category: "Animation",
    image: "/motion-narrative.png",
    videos: ["Sq8HyEhXAYM", "ZFhZstN-gV0", "rYUx7LVM_iw","OWBxX_Mj8Xk"]
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
    videos: ["3BxmxXZetrQ", "LoIoU1KINDY", "WhpoBDGP3Nc", "20b8lFZ3I9c", "_vw2Ws0V5k8", "ScWMtJoviDk", "sgKGJz_Nrbw", "YrATij0ilZY", "F40p_FA9BnU", "x4VkU7qg_LQ", "bBcI5DwbNrw", "s0AvuRQP16M"]
  },
  {
    id: 6,
    title: "Logo animation",
    category: "Branding",
    image: "/logo-animation.png",
    videos: ["YOyoXkFTp50", "gKfQuRYIzS0", "36Zd44weTmA", "4YD__Ie-ghY", "Ua3sqZmoKrQ", "eOTPjy-Fow8"]
  },
  {
    id: 7,
    title: "UX UI",
    category: "Interface",
    image: "/ux-ui.png",
    videos: ["09rOZHMihbc", "ajPRSX3PAgk", "vxdvbLCZn5U", "8N2LEo9ysXc", "F40p_FA9BnU", "x4VkU7qg_LQ"]
  },
  {
    id: 8,
    title: "Dynamic Backgrounds",
    category: "Generative",
    image: "https://i.ibb.co/G4WtH9Vz/image.jpg",
    videos: ["2_jLrn3C_rk", "PFzDJlHQ35o", "YIgjFZhLYd0", "OJUA6cSnMI8", "-iWsnjFEJu0"]
  }
];

export default function ProjectGrid() {
  const { t, language } = useLanguage();
  // Bilingual project titles (only the ones that differ per language)
  const projTitle = (title: string) =>
    language === "es" && title === "Minimalist" ? "Minimalista" : title;
  // Bilingual category labels
  const catES: Record<string, string> = {
    Animation: "Animación",
    Typography: "Tipografía",
    Style: "Estilo",
    Content: "Contenido",
    Branding: "Marca",
    Interface: "Interfaz",
    Generative: "Generativo",
  };
  const projCat = (cat: string) => (language === "es" ? catES[cat] || cat : cat);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Notify Navbar to hide/show
    const event = new CustomEvent('toggleNavbar', { detail: selectedProject !== null });
    window.dispatchEvent(event);

    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

  // On mobile (no hover), illuminate the card closest to the viewport center
  // as the user scrolls — the cards "light up" on their own while swiping.
  useEffect(() => {
    if (!isMobile) { setActiveProjectId(null); return; }
    let raf = 0;
    const update = () => {
      const cards = document.querySelectorAll<HTMLElement>('[data-card-id]');
      const center = window.innerHeight / 2;
      let bestId: number | null = null;
      let bestDist = Infinity;
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        const cy = r.top + r.height / 2;
        const d = Math.abs(cy - center);
        if (d < bestDist) { bestDist = d; bestId = Number(c.getAttribute('data-card-id')); }
      });
      // only light it up when a card is genuinely near the middle of the screen
      setActiveProjectId(bestDist < window.innerHeight * 0.45 ? bestId : null);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [isMobile]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <section id="work" className="relative py-24 md:py-40 px-4 md:px-12 overflow-hidden">
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
            <span style={{ color: "#E9B872" }}>01</span> — {projects.length < 10 ? `0${projects.length}` : projects.length}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              onClick={() => handleProjectClick(project)}
              data-card-id={project.id}
              className="cursor-grow group relative aspect-[3/4] overflow-hidden bg-zinc-900 cursor-pointer rounded-2xl border border-white/5"
            >
              <img
                src={project.image}
                alt={project.title}
                className={`w-full h-full object-cover grayscale transition-all duration-1000 ease-out scale-105
                  ${isMobile
                    ? (activeProjectId === project.id ? 'grayscale-0 opacity-100 scale-100' : 'opacity-50')
                    : 'opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-100'}`}
                referrerPolicy="no-referrer"
              />

              {/* Index number always visible */}
              <span className="absolute top-5 left-5 z-20 text-[10px] font-grotesk font-medium tracking-[0.3em] text-white/70 text-shadow-strong">
                0{index + 1}
              </span>

              <div className={`absolute inset-0 p-7 md:p-9 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500
                ${isMobile
                  ? (activeProjectId === project.id ? 'opacity-100' : 'opacity-0')
                  : 'opacity-0 group-hover:opacity-100'}`}>
                <span className="text-[10px] font-grotesk font-semibold uppercase tracking-[0.3em] mb-2 text-shadow-strong" style={{ color: "#E9B872" }}>{projCat(project.category)}</span>
                <h3 className="text-2xl md:text-3xl font-poppins font-bold uppercase tracking-tighter text-shadow-strong">{projTitle(project.title)}</h3>
                <span className="mt-3 text-[9px] font-grotesk uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
                  {t('projects.view')} <span aria-hidden>→</span>
                </span>
              </div>
            </motion.div>
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
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto liquid-glass rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full z-10"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="mb-8 md:mb-10">
                <span className="text-[10px] font-poppins font-bold uppercase tracking-[0.3em] text-white/50 mb-2 block text-shadow-strong">
                  {projCat(selectedProject.category)}
                </span>
                <h3 className="text-3xl md:text-5xl font-poppins font-bold uppercase tracking-tighter text-shadow-strong">
                  {projTitle(selectedProject.title)}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedProject.videos?.map((videoId, idx) => {
                  const isHorizontal = ['gKfQuRYIzS0', '2_jLrn3C_rk', 'Ua3sqZmoKrQ', 'vxdvbLCZn5U', '8N2LEo9ysXc', 'eOTPjy-Fow8', 'PpMRNkPnA6o', 'F40p_FA9BnU', "NTON1b1vmeI"].includes(videoId);
                  return (
                    <div 
                      key={idx} 
                      className={`${isHorizontal ? 'aspect-video sm:col-span-2 md:col-span-2 lg:col-span-2' : 'aspect-[9/16]'} rounded-xl overflow-hidden bg-black/50 border border-white/5 relative group`}
                    >
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title={`${selectedProject.title} video ${idx + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
