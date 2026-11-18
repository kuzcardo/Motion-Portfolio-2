import { motion } from "motion/react";
import { Instagram, Linkedin, Mail, Plane, ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { useLanguage } from "../context/LanguageContext";

const links = [
  { key: "instagram", label: "Instagram", handle: "@santiagolacuara", href: "https://www.instagram.com/santiagolacuara/", Icon: Instagram, external: true },
  { key: "linkedin", label: "LinkedIn", handle: "Santiago Lopez Lacuara", href: "https://www.linkedin.com/in/santiago-lopez-lacuara-500b721a0/", Icon: Linkedin, external: true },
  { key: "mail", label: "Mail", handle: "", href: "mailto:santilacuara@gmail.com", Icon: Mail, external: false },
];

/**
 * Get in touch — a dashed "boarding pass", continuing the timeline's flight motif.
 * Left: the headline. A perforated dashed divider. Right: three dashed "gates"
 * (Instagram / LinkedIn / Mail). A plane loops along a dashed route on top.
 */
export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="relative py-28 md:py-44 px-4 md:px-12 overflow-hidden border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-6xl mx-auto"
      >
        {/* Dashed flight route with a plane looping on it (desktop) */}
        <div className="hidden md:block absolute -top-24 left-0 right-0 h-28 pointer-events-none" aria-hidden>
          <svg className="contact-route absolute inset-0 w-full h-full" viewBox="0 0 1000 110" preserveAspectRatio="none">
            <path d="M 0 100 C 250 -20, 750 -20, 1000 100" />
          </svg>
          <div className="contact-plane">
            <Plane size={16} strokeWidth={1.8} />
          </div>
        </div>

        {/* The ticket */}
        <div className="contact-ticket relative rounded-[28px] grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
          <svg className="contact-ticket__stroke" aria-hidden>
            <rect x="0.75" y="0.75" rx="28" ry="28" />
          </svg>

          {/* Left: headline */}
          <div className="relative p-7 sm:p-10 md:p-12 flex flex-col justify-center items-center text-center gap-8 md:gap-10">
            <div className="flex items-center justify-center gap-4 text-[9px] font-grotesk uppercase tracking-[0.4em] text-white/50">
              <span style={{ color: "var(--accent-ink)" }}>{t("contact.inquiries")}</span>
              <span aria-hidden className="contact-mini-dash" />
              <span>BUE ✦</span>
            </div>

            <h2 className="text-[17vw] sm:text-[13vw] md:text-[6vw] xl:text-[88px] font-display font-bold uppercase leading-[0.9] tracking-tighter text-white">
              {t("contact.title")}
            </h2>

            <div className="grid grid-cols-2 gap-8 text-[9px] font-grotesk uppercase tracking-[0.35em] text-white/40">
              <div>
                <span className="block mb-1">{t("contact.from")}</span>
                <span className="text-white/90 text-[11px] tracking-[0.25em]">Buenos Aires</span>
              </div>
              <div>
                <span className="block mb-1">{t("contact.status")}</span>
                <span className="inline-flex items-center justify-center gap-2 text-white/90 text-[11px] tracking-[0.25em]">
                  <span className="contact-live" aria-hidden /> {t("contact.available")}
                </span>
              </div>
            </div>
          </div>

          {/* Perforation: dashed divider with notches */}
          <div className="contact-perf relative" aria-hidden>
            <span className="contact-perf__notch contact-perf__notch--a" />
            <span className="contact-perf__notch contact-perf__notch--b" />
          </div>

          {/* Right: the three gates */}
          <div className="relative p-5 sm:p-8 md:p-10 flex flex-col justify-center gap-3 md:gap-4">
            {links.map(({ key, label, handle, href, Icon, external }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Magnetic strength={0.12} className="!block w-full">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    aria-label={label}
                    className="contact-gate cursor-grow group relative flex items-center gap-4 md:gap-5 rounded-2xl p-3 md:p-4 overflow-hidden"
                  >
                    <svg className="contact-gate__stroke" aria-hidden>
                      <rect x="0.75" y="0.75" rx="16" ry="16" />
                    </svg>
                    <span className="contact-gate__sweep" aria-hidden />

                    <span className="contact-btn__orb relative flex shrink-0 items-center justify-center w-12 h-12 md:w-14 md:h-14">
                      <svg className="contact-btn__ring absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
                        <circle cx="50" cy="50" r="47" />
                      </svg>
                      <Icon className="contact-gate__icon relative z-10 w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </span>

                    <span className="relative z-10 flex flex-col min-w-0">
                      <span className="text-[9px] font-grotesk uppercase tracking-[0.4em] text-white/40 contact-gate__muted">
                        {String(i + 1).padStart(2, "0")} — {t("contact.gate")}
                      </span>
                      <span className="text-lg md:text-xl font-poppins font-bold uppercase tracking-tight leading-tight">{label}</span>
                      <span className="text-xs font-grotesk font-light text-white/60 truncate contact-gate__muted">
                        {handle || t("contact.write")}
                      </span>
                    </span>

                    <ArrowUpRight className="contact-gate__arrow relative z-10 ml-auto w-5 h-5 shrink-0" strokeWidth={1.5} />
                  </a>
                </Magnetic>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
