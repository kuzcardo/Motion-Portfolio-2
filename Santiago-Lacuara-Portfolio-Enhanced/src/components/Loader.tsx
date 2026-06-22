import { motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Full-screen intro loader. Counts 0 → 100 with a progress line,
 * then the whole panel slides up to reveal the site.
 */
export default function Loader() {
  const [n, setN] = useState(0);

  useEffect(() => {
    let cur = 0;
    const id = setInterval(() => {
      // ease toward 100
      cur += Math.max(1, Math.round((100 - cur) * 0.09));
      if (cur >= 100) { cur = 100; clearInterval(id); }
      setN(cur);
    }, 26);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[300] bg-[#050505] flex flex-col items-center justify-center"
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[10px] font-grotesk uppercase tracking-[0.55em] text-white/50 mb-5"
      >
        Santiago Lacuara
      </motion.span>

      <div className="text-[22vw] md:text-[12vw] font-display font-bold leading-none gold-text tabular-nums">
        {n}
      </div>

      <div className="mt-8 w-[200px] md:w-[320px] h-[2px] bg-white/10 overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${n}%`, backgroundColor: "#E9B872", transition: "width .12s linear" }}
        />
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 text-[9px] font-grotesk uppercase tracking-[0.4em] text-white/30"
      >
        Motion Graphics Designer
      </motion.span>
    </motion.div>
  );
}
