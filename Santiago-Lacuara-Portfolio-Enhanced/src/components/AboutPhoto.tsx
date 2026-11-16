import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useInView } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const SRC = "https://i.ibb.co/1YXbWWRj/retratardo.png";

/**
 * About photo with an After-Effects-style interaction:
 * a circular "shape layer" follows the cursor and grows on hover, revealing the
 * full-colour photo inside it, while the whole container expands (frame + corners
 * push outward). Clicking/holding blows the shape up to fill the frame.
 * On touch devices the shape grows by itself when the photo scrolls into view.
 */
export default function AboutPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const inView = useInView(ref, { amount: 0.6 });

  // cursor position (%) and shape radius (px), all spring-smoothed
  const x = useSpring(useMotionValue(50), { stiffness: 260, damping: 28 });
  const y = useSpring(useMotionValue(50), { stiffness: 260, damping: 28 });
  const r = useSpring(0, { stiffness: 140, damping: 18 });
  const clip = useMotionTemplate`circle(${r}px at ${x}% ${y}%)`;
  const ringLeft = useTransform(x, (v) => `${v}%`);
  const ringTop = useTransform(y, (v) => `${v}%`);
  const ringSize = useTransform(r, (v) => v * 2);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  // Touch: auto-reveal from the centre when in view
  useEffect(() => {
    if (!isTouch) return;
    x.set(50); y.set(45);
    r.set(inView ? 420 : 0);
  }, [isTouch, inView]);

  const move = (e: MouseEvent) => {
    const b = ref.current!.getBoundingClientRect();
    x.set(((e.clientX - b.left) / b.width) * 100);
    y.set(((e.clientY - b.top) / b.height) * 100);
  };

  const expanded = hover || (isTouch && inView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[300px] md:max-w-md aspect-[4/5] relative mx-auto md:mx-0"
    >
      <motion.div
        ref={ref}
        onMouseEnter={(e) => { if (isTouch) return; move(e); setHover(true); r.set(110); }}
        onMouseMove={(e) => { if (!isTouch) move(e); }}
        onMouseLeave={() => { if (isTouch) return; setHover(false); r.set(0); }}
        onMouseDown={() => { if (!isTouch) r.set(700); }}
        onMouseUp={() => { if (!isTouch) r.set(110); }}
        animate={{ scale: expanded ? 1.05 : 1, borderRadius: expanded ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="cursor-grow relative w-full h-full overflow-hidden z-10"
      >
        {/* base: grayscale */}
        <img src={SRC} alt="Santiago Lacuara" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />

        {/* shape layer: full-colour photo revealed inside the circle */}
        <motion.img
          src={SRC}
          alt=""
          aria-hidden
          style={{ clipPath: clip }}
          animate={{ scale: expanded ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* outline of the shape layer */}
        <motion.span
          aria-hidden
          style={{ left: ringLeft, top: ringTop, width: ringSize, height: ringSize, x: "-50%", y: "-50%", border: "1.5px dashed rgba(233,184,114,0.85)" }}
          className="absolute z-20 rounded-full pointer-events-none"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10 pointer-events-none" />
      </motion.div>

      {/* frame + corners push outward as the container grows */}
      <motion.div
        aria-hidden
        animate={{ inset: expanded ? -28 : -16, borderColor: expanded ? "rgba(233,184,114,0.6)" : "rgba(233,184,114,0.25)" }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="absolute border border-dashed z-0 pointer-events-none"
      />
      <motion.div
        aria-hidden
        animate={{ x: expanded ? -14 : 0, y: expanded ? -14 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 z-0 pointer-events-none"
        style={{ borderColor: "#E9B872" }}
      />
      <motion.div
        aria-hidden
        animate={{ x: expanded ? 14 : 0, y: expanded ? 14 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 z-0 pointer-events-none"
        style={{ borderColor: "#E9B872" }}
      />
    </motion.div>
  );
}
