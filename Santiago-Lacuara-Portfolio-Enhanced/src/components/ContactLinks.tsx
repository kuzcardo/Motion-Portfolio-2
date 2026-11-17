import { motion } from "motion/react";
import { Instagram, Linkedin, Mail } from "lucide-react";
import Magnetic from "./Magnetic";

const links = [
  { label: "Instagram", href: "https://www.instagram.com/santiagolacuara/", Icon: Instagram, external: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/santiago-lopez-lacuara-500b721a0/", Icon: Linkedin, external: true },
  { label: "Mail", href: "mailto:santiago.lopezlacuara@gmail.com", Icon: Mail, external: false },
];

/**
 * Contact buttons in the same language as the timeline:
 * a dashed ring that slowly spins, turns amber and speeds up on hover,
 * with a magnetic pull and a fill that grows from the centre.
 */
export default function ContactLinks() {
  return (
    <div className="mt-16 md:mt-20 flex items-start justify-center gap-6 sm:gap-10 md:gap-14">
      {links.map(({ label, href, Icon, external }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.12, type: "spring", stiffness: 220, damping: 16 }}
        >
          <Magnetic strength={0.35} className="inline-block">
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              aria-label={label}
              className="contact-btn cursor-grow group flex flex-col items-center gap-4"
            >
              <span className="contact-btn__orb relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
                {/* spinning dashed ring */}
                <svg className="contact-btn__ring absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
                  <circle cx="50" cy="50" r="48" />
                </svg>
                {/* fill that grows from the centre on hover */}
                <span className="contact-btn__fill absolute inset-[6px] rounded-full" aria-hidden />
                <Icon className="contact-btn__icon relative z-10 w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
              </span>
              <span className="text-[10px] font-grotesk uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors">
                {label}
              </span>
            </a>
          </Magnetic>
        </motion.div>
      ))}
    </div>
  );
}
