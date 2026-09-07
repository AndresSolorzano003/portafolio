import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

// Big, blurred color fields — parallax with the mouse. Colors are CSS
// variables, so they automatically switch with light/dark mode.
const BLOBS = [
  { top: "2%", left: "6%", size: 42, color: "var(--color-accent-indigo)" },
  { top: "22%", left: "78%", size: 34, color: "var(--color-accent-amber)" },
  { top: "46%", left: "12%", size: 38, color: "var(--color-accent-teal)" },
  { top: "63%", left: "70%", size: 44, color: "var(--color-accent-rose)" },
  { top: "82%", left: "20%", size: 36, color: "var(--color-accent-indigo)" },
  { top: "96%", left: "82%", size: 32, color: "var(--color-accent-teal)" },
];

// Small crisp shapes — purely decorative, gently floating via CSS.
const DOTS = [
  { top: "8%", left: "88%", size: 14, shape: "circle", color: "var(--color-accent-teal)" },
  { top: "14%", left: "40%", size: 8, shape: "square", color: "var(--color-ink-soft)" },
  { top: "29%", left: "20%", size: 10, shape: "circle", color: "var(--color-accent-rose)" },
  { top: "38%", left: "60%", size: 16, shape: "square", color: "var(--color-accent-amber)" },
  { top: "52%", left: "90%", size: 10, shape: "circle", color: "var(--color-ink-soft)" },
  { top: "58%", left: "8%", size: 12, shape: "square", color: "var(--color-accent-indigo)" },
  { top: "70%", left: "45%", size: 9, shape: "circle", color: "var(--color-accent-teal)" },
  { top: "77%", left: "85%", size: 14, shape: "square", color: "var(--color-accent-rose)" },
  { top: "88%", left: "35%", size: 11, shape: "circle", color: "var(--color-accent-amber)" },
  { top: "94%", left: "60%", size: 8, shape: "square", color: "var(--color-ink-soft)" },
];

export default function ParticlesBackground() {
  const containerRef = useRef(null);
  const blobRefs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const onMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        blobRefs.current.forEach((blob, i) => {
          if (!blob) return;
          const strength = 16 + (i % 3) * 6;
          gsap.to(blob, {
            x: x * strength,
            y: y * strength * 0.6,
            duration: 1.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {BLOBS.map((b, i) => (
        <div
          key={`blob-${i}`}
          ref={(el) => (blobRefs.current[i] = el)}
          className="absolute rounded-full opacity-[0.16] blur-[100px] dark:opacity-[0.22]"
          style={{ top: b.top, left: b.left, width: `${b.size}vw`, height: `${b.size}vw`, background: b.color }}
        />
      ))}

      {DOTS.map((d, i) => (
        <div
          key={`dot-${i}`}
          className="particle-float absolute opacity-40 dark:opacity-50"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            background: d.color,
            borderRadius: d.shape === "circle" ? "9999px" : "6px",
            animationDuration: `${6 + (i % 4)}s`,
            animationDelay: `${(i % 5) * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}
