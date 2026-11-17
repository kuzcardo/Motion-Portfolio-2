import { motion, useScroll, useSpring, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Sailboat } from "lucide-react";

// The route, in % of the viewport (x, y pairs). A river that winds across the
// background from the top-left to the bottom of the screen.
const ROUTE: [string, number[]][] = [
  ["M", [3, 12]],
  ["C", [30, 3, 62, 5, 90, 15]],
  ["S", [90, 37, 58, 40]],
  ["S", [6, 45, 9, 60]],
  ["S", [50, 74, 82, 70]],
  ["S", [99, 86, 76, 92]],
  ["S", [30, 91, 5, 95]],
];

const toPixels = (w: number, h: number) =>
  ROUTE.map(([cmd, nums]) => `${cmd} ${nums.map((n, i) => (i % 2 ? (n * h) / 100 : (n * w) / 100).toFixed(1)).join(" ")}`).join(" ");

/**
 * Page scroll progress as a little boat sailing a dashed route across the
 * background (same motif as the timeline plane). It leaves a solid wake behind
 * it, turns around when the route heads left and tilts with the current.
 */
export default function BoatProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });

  const [d, setD] = useState("");
  const pathRef = useRef<SVGPathElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const tilt = useMotionValue(0);
  const [left, setLeft] = useState(false);

  const place = (v: number) => {
    const path = pathRef.current;
    if (!path) return;
    const L = path.getTotalLength();
    if (!L) return;
    const l = Math.min(Math.max(v, 0), 1) * L;
    const a = path.getPointAtLength(Math.max(0, l - 2));
    const b = path.getPointAtLength(Math.min(L, l + 2));
    const p = path.getPointAtLength(l);
    x.set(p.x);
    y.set(p.y);
    const dx = b.x - a.x, dy = b.y - a.y;
    const goingLeft = dx < 0;
    setLeft((prev) => (prev === goingLeft ? prev : goingLeft));
    const ang = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
    tilt.set(Math.max(-16, Math.min(16, ang)) * (goingLeft ? -1 : 1));
  };

  useEffect(() => {
    const build = () => setD(toPixels(window.innerWidth, window.innerHeight));
    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, []);
  useEffect(() => { place(progress.get()); }, [d]);
  useMotionValueEvent(progress, "change", place);

  return (
    <div className="boat-layer" aria-hidden>
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <path ref={pathRef} d={d} className="boat-route" />
        {d && <motion.path d={d} className="boat-wake" style={{ pathLength: progress }} />}
      </svg>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div style={{ rotate: tilt }} className="boat">
          <span className="boat__bob" style={{ transform: left ? "scaleX(-1)" : undefined }}>
            <Sailboat size={18} strokeWidth={1.8} />
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
