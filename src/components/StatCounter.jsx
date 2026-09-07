import { useRef } from "react";
import { useInView } from "framer-motion";
import { useCountUp } from "../hooks/useCountUp";

export default function StatCounter({ value, suffix = "", label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useCountUp(value, { start: inView });

  return (
    <div ref={ref}>
      <p className="font-display text-3xl font-semibold text-ink md:text-4xl">
        {count}
        {suffix}
      </p>
      <p className="font-mono-label mt-1 text-[11px] uppercase text-ink-soft">{label}</p>
    </div>
  );
}
