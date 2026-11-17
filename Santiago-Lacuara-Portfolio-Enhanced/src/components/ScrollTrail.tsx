import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

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
 * Page scroll progress as a "trim path": a dashed route winds across the
 * background and a solid line draws along it as you scroll.
 */
export default function ScrollTrail() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 });
  // mobile: follow the scroll directly (no extra spring frames after you stop)
  const [isMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches);
  const progress = isMobile ? scrollYProgress : smooth;

  const [d, setD] = useState("");
  useEffect(() => {
    const build = () => setD(toPixels(window.innerWidth, window.innerHeight));
    build();
    window.addEventListener("resize", build);
    return () => window.removeEventListener("resize", build);
  }, []);

  return (
    <div className="trail-layer" aria-hidden>
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <path d={d} className="trail-route" />
        {d && <motion.path d={d} className="trail-line" style={{ pathLength: progress }} />}
      </svg>
    </div>
  );
}
