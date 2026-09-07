import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return undefined;

    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const quickDot = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const quickDotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const quickRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const quickRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e) => {
      quickDot(e.clientX);
      quickDotY(e.clientY);
      quickRing(e.clientX);
      quickRingY(e.clientY);
    };

    const onOver = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        gsap.to(ring, { scale: 1.8, opacity: 0.5, duration: 0.25 });
        gsap.to(dot, { scale: 0, duration: 0.25 });
      }
    };
    const onOut = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25 });
        gsap.to(dot, { scale: 1, duration: 0.25 });
      }
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] hidden md:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/40"
      />
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
      />
    </div>
  );
}
