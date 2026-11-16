import { motion, animate, useInView, useMotionValue, useMotionTemplate, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";

const SRC = "https://i.ibb.co/1YXbWWRj/retratardo.png";
const START = 0.2; // the box starts at 20% of its final size, pinned to the top-left corner

/**
 * About photo intro, Figma/After-Effects style:
 * a small selection box sits in the top-left corner, a cursor appears, grabs the
 * bottom-right handle and drags it out — the whole container grows with it —
 * and once it reaches full size the photo appears.
 * Plays once when the photo scrolls into view. Hover afterwards: frame opens up + colour.
 */
export default function AboutPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(false);

  const size = useMotionValue(START); // 0.2 → 1
  const cursorOpacity = useMotionValue(0);
  const cursorScale = useMotionValue(1);
  const photoOpacity = useMotionValue(0);
  const photoScale = useMotionValue(1.15);
  const uiOpacity = useMotionValue(1); // selection outline + handles

  const pct = useTransform(size, (v) => `${v * 100}%`);
  const inset = useTransform(size, (v) => `${(1 - v) * 100}%`);
  const clip = useMotionTemplate`inset(0 ${inset} ${inset} 0 round 14px)`;

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      size.set(1); photoOpacity.set(1); photoScale.set(1); uiOpacity.set(0); setDone(true);
      return;
    }
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 250));
      await animate(cursorOpacity, 1, { duration: 0.35 });
      await animate(cursorScale, 0.8, { duration: 0.15 }); // press
      await animate(size, 1, { duration: 1.25, ease: [0.65, 0, 0.35, 1] }); // drag
      if (cancelled) return;
      animate(cursorScale, 1, { duration: 0.15 }); // release
      animate(photoOpacity, 1, { duration: 0.6 });
      animate(photoScale, 1, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
      await animate(cursorOpacity, 0, { duration: 0.4, delay: 0.25 });
      await animate(uiOpacity, 0, { duration: 0.4 });
      setDone(true);
    })();
    return () => { cancelled = true; };
  }, [inView]);

  const expanded = done && hover;

  return (
    <div className="w-full max-w-[300px] md:max-w-md aspect-[4/5] relative mx-auto md:mx-0">
      <motion.div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        animate={{ scale: expanded ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="cursor-grow relative w-full h-full z-10"
      >
        {/* The container itself — clipped to the size being dragged */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden bg-zinc-900">
          <motion.img
            src={SRC}
            alt="Santiago Lacuara"
            style={{ opacity: photoOpacity, scale: photoScale }}
            className={`w-full h-full object-cover transition-[filter] duration-700 ${expanded ? "grayscale-0" : "grayscale"}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Selection outline + handles, following the box */}
        <motion.div
          aria-hidden
          style={{ width: pct, height: pct, opacity: uiOpacity, border: "1.5px solid #E9B872" }}
          className="absolute top-0 left-0 pointer-events-none rounded-[14px]"
        >
          {[
            "-top-[5px] -left-[5px]", "-top-[5px] -right-[5px]",
            "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]",
          ].map((pos) => (
            <span key={pos} className={`absolute ${pos} w-[9px] h-[9px] bg-white border`} style={{ borderColor: "#E9B872" }} />
          ))}
          {/* live size readout, like a design tool */}
          <motion.span
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[9px] font-grotesk tracking-[0.2em] px-2 py-0.5 rounded whitespace-nowrap"
            style={{ background: "#E9B872", color: "#050505" }}
          >
            <SizeLabel size={size} />
          </motion.span>
        </motion.div>

        {/* The cursor — sits on the bottom-right handle and drags it */}
        <motion.div
          aria-hidden
          style={{ left: pct, top: pct, opacity: cursorOpacity, scale: cursorScale }}
          className="absolute z-30 pointer-events-none -translate-x-[2px] -translate-y-[2px]"
        >
          <MousePointer2 size={26} fill="#ffffff" color="#050505" strokeWidth={1.5} className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" />
        </motion.div>
      </motion.div>

      {/* Frame + corners: open up on hover once the intro is done */}
      <motion.div
        aria-hidden
        style={{ opacity: useTransform(photoOpacity, [0, 1], [0, 1]) }}
        animate={{ inset: expanded ? -26 : -16, borderColor: expanded ? "rgba(233,184,114,0.6)" : "rgba(233,184,114,0.25)" }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="absolute border border-dashed z-0 pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={{ x: expanded ? -12 : 0, y: expanded ? -12 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 z-0 pointer-events-none"
        style={{ borderColor: "#E9B872" }}
      />
      <motion.div
        aria-hidden
        animate={{ x: expanded ? 12 : 0, y: expanded ? 12 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 z-0 pointer-events-none"
        style={{ borderColor: "#E9B872" }}
      />
    </div>
  );
}

// "W 1080 × H 1350" readout that counts up while dragging
function SizeLabel({ size }: { size: MotionValue<number> }) {
  const w = useTransform(size, (v) => Math.round(v * 1080));
  const h = useTransform(size, (v) => Math.round(v * 1350));
  return (
    <>
      W <motion.span>{w}</motion.span> × H <motion.span>{h}</motion.span>
    </>
  );
}
