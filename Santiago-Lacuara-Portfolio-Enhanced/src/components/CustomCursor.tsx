import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Raw pointer position (drives the small dot)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Ring trails behind with a spring for a smooth follow effect
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  const lastEl = useRef<Element | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (hidden) setHidden(false);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el !== lastEl.current) {
        lastEl.current = el;
        const interactive = !!el?.closest(
          'a, button, [role="button"], input, .cursor-grow'
        );
        setHovering(interactive);
      }
    };

    const leave = () => setHidden(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [hidden, x, y]);

  return (
    <>
      {/* Dot — positioned at the raw pointer; inner element centers it */}
      <motion.div className="custom-cursor" style={{ x, y, opacity: hidden ? 0 : 1 }}>
        <div className="cursor-dot" style={{ marginLeft: -3, marginTop: -3 }} />
      </motion.div>

      {/* Ring — trails via spring; inner element animates size & centers */}
      <motion.div className="cursor-ring-wrap" style={{ x: ringX, y: ringY, opacity: hidden ? 0 : 1, position: "fixed", top: 0, left: 0, zIndex: 9998, pointerEvents: "none" }}>
        <motion.div
          className="cursor-ring"
          style={{ position: "absolute", top: 0, left: 0 }}
          animate={{
            width: hovering ? 64 : 38,
            height: hovering ? 64 : 38,
            x: hovering ? -32 : -19,
            y: hovering ? -32 : -19,
            borderColor: hovering ? "rgba(233, 184, 114, 0.9)" : "rgba(255, 255, 255, 0.5)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </motion.div>
    </>
  );
}
