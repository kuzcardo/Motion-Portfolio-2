// Design style names (matches the project styles in the grid)
const ITEMS = [
  "Motion Narrative",
  "Kinetic Typography",
  "Minimalist",
  "Social Media",
  "Logo Animation",
  "UX / UI",
  "Dynamic Backgrounds",
];

export default function Marquee() {
  // Repeat the list twice inside each track so the loop is seamless.
  const row = [...ITEMS, ...ITEMS];

  return (
    <section
      aria-hidden
      className="relative py-10 md:py-14 overflow-hidden"
    >
      <div className="marquee">
        <div className="marquee__track">
          {row.map((item, i) => (
            <span key={`a-${i}`} className="flex items-center gap-8">
              <span className="text-3xl md:text-5xl font-display font-light uppercase tracking-tight stroke-text">
                {item}
              </span>
              <span className="text-accent text-xl md:text-2xl" style={{ color: "#E9B872" }}>
                ✦
              </span>
            </span>
          ))}
        </div>
        <div className="marquee__track" aria-hidden>
          {row.map((item, i) => (
            <span key={`b-${i}`} className="flex items-center gap-8">
              <span className="text-3xl md:text-5xl font-display font-light uppercase tracking-tight stroke-text">
                {item}
              </span>
              <span className="text-xl md:text-2xl" style={{ color: "#E9B872" }}>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
