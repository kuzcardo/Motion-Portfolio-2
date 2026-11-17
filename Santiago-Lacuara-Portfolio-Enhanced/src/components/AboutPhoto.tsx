import { motion, animate, useInView, useMotionValue, useMotionTemplate, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MousePointer2 } from "lucide-react";

const SRC = "https://i.ibb.co/1YXbWWRj/retratardo.png";
const START = 0.2; // the frame starts at 20% of its final size, pinned to the top-left corner
const PAD = 16;    // distance from the photo to the dashed frame / gold corners

/**
 * About photo intro, Figma/After-Effects style.
 * There is ONE container: the photo + its dashed frame + its two gold corners.
 * It starts small in the top-left; a cursor grabs the bottom-right gold corner
 * (the corner opposite the anchor) and drags it out — the whole container grows
 * with it — and when it reaches full size the photo appears.
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
  const labelOpacity = useMotionValue(0);
  // extra breathing room for the frame on hover (after the intro)
  const grow = useSpring(0, { stiffness: 180, damping: 16 });

  const pct = useTransform(size, (v) => v * 100);
  const inset = useTransform(size, (v) => `${(1 - v) * 100}%`);
  const clip = useMotionTemplate`inset(0 ${inset} ${inset} 0 round 14px)`;

  // Dashed frame: anchored top-left, its size follows the drag
  const frameOff = useTransform(grow, (g) => -PAD - g);
  const frameSize = useMotionTemplate`calc(${pct}% + ${useTransform(grow, (g) => 2 * (PAD + g))}px)`;
  // Bottom-right gold corner: rides on the dragged corner
  const brPos = useMotionTemplate`calc(${pct}% + ${useTransform(grow, (g) => PAD + g - 32)}px)`;
  // Cursor: its tip sits right on the tip of that corner
  const cursorPos = useMotionTemplate`calc(${pct}% + ${useTransform(grow, (g) => PAD + g - 4)}px)`;

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      size.set(1); photoOpacity.set(1); photoScale.set(1); setDone(true);
      return;
    }
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 250));
      animate(labelOpacity, 1, { duration: 0.3 });
      await animate(cursorOpacity, 1, { duration: 0.35 });
      await animate(cursorScale, 0.8, { duration: 0.15 }); // grab
      await animate(size, 1, { duration: 1.25, ease: [0.65, 0, 0.35, 1] }); // drag
      if (cancelled) return;
      animate(cursorScale, 1, { duration: 0.15 }); // release
      animate(photoOpacity, 1, { duration: 0.2 });
      animate(photoScale, 1, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
      animate(labelOpacity, 0, { duration: 0.4, delay: 0.3 });
      await animate(cursorOpacity, 0, { duration: 0.4, delay: 0.25 });
      setDone(true);
    })();
    return () => { cancelled = true; };
  }, [inView]);

  const expanded = done && hover;
  useEffect(() => { grow.set(expanded ? 10 : 0); }, [expanded]);

  return (
    <div className="w-full max-w-[300px] md:max-w-md aspect-[4/5] relative mx-auto md:mx-0">
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="cursor-grow relative w-full h-full"
      >
        {/* Dashed frame — part of the same container */}
        <motion.div
          aria-hidden
          style={{ top: frameOff, left: frameOff, width: frameSize, height: frameSize }}
          className={`absolute border border-dashed pointer-events-none transition-colors duration-500 ${expanded ? "photo-frame--hot" : "photo-frame"}`}
        />
        {/* Top-left gold corner — the anchor, never moves during the drag */}
        <motion.div
          aria-hidden
          style={{ top: frameOff, left: frameOff, borderColor: "#E9B872" }}
          className="absolute w-8 h-8 border-t-2 border-l-2 pointer-events-none"
        />
        {/* Bottom-right gold corner — the one the cursor grabs */}
        <motion.div
          aria-hidden
          style={{ top: brPos, left: brPos, borderColor: "#E9B872" }}
          className="absolute w-8 h-8 border-b-2 border-r-2 pointer-events-none z-20"
        />

        {/* The photo — invisible (no grey box) while dragging, appears once the frame is full size */}
        <motion.div style={{ clipPath: clip, opacity: photoOpacity }} className="absolute inset-0 overflow-hidden z-10">
          <motion.img
            src={SRC}
            alt="Santiago Lacuara"
            style={{ scale: photoScale }}
            className={`w-full h-full object-cover transition-[filter] duration-700 ${expanded ? "grayscale-0" : "grayscale"}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Live size readout next to the dragged corner */}
        <motion.span
          aria-hidden
          style={{ top: cursorPos, left: cursorPos, opacity: labelOpacity, background: "#E9B872", color: "#050505", x: 22, y: 26 }}
          className="absolute z-30 text-[9px] font-grotesk tracking-[0.2em] px-2 py-0.5 rounded whitespace-nowrap pointer-events-none"
        >
          <SizeLabel size={size} />
        </motion.span>

        {/* The cursor */}
        <motion.div
          aria-hidden
          style={{ top: cursorPos, left: cursorPos, opacity: cursorOpacity, scale: cursorScale }}
          className="absolute z-30 pointer-events-none origin-top-left"
        >
          <MousePointer2 size={26} fill="#ffffff" color="#050505" strokeWidth={1.5} className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]" />
        </motion.div>
      </div>
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
