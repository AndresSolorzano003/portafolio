import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SkillBar({ name, level, category }) {
  const fillRef = useRef(null);
  const rowRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(fillRef.current, { width: "0%" });
      gsap.to(fillRef.current, {
        width: `${level}%`,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });
    }, rowRef);
    return () => ctx.revert();
  }, [level]);

  return (
    <div ref={rowRef}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{name}</span>
        <span className="font-mono-label text-[10px] uppercase text-ink-soft">{category}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-soft">
        <div
          ref={fillRef}
          className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-teal"
        />
      </div>
    </div>
  );
}
