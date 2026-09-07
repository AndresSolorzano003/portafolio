import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates the matched children of `containerRef` from a scattered,
 * rotated, faded-out state into their natural layout as they scroll
 * into view — and reverses (disassembles) as they scroll back out,
 * in both directions.
 */
export function useAssembleIn(containerRef, selector, options = {}) {
  const {
    start = "top 85%",
    end = "bottom top",
    stagger = 0.09,
    duration = 0.9,
    ease = "power3.out",
    from,
  } = options;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(
        selector ? el.querySelectorAll(selector) : el.children
      );
      if (!items.length) return;

      items.forEach((item, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const defaultFrom = {
          x: dir * (55 + (i % 3) * 18),
          y: 36 + (i % 4) * 14,
          rotation: dir * (7 + (i % 3) * 3),
          opacity: 0,
          scale: 0.88,
        };
        const fromVars =
          typeof from === "function"
            ? { ...defaultFrom, ...from(i, item) }
            : { ...defaultFrom, ...from };

        gsap.set(item, fromVars);
      });

      // A single ScrollTrigger on the container drives every item's
      // reveal, staggered — more robust than one trigger per item, whose
      // individually-computed start/end points can drift apart when items
      // sit side by side or when scroll jumps straight past them.
      gsap.to(items, {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration,
        stagger,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          end,
          toggleActions: "play reverse play reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [containerRef, selector, start, end, stagger, duration, ease, from]);
}
