import { useRef } from "react";
import { about, profile } from "../data/portfolio";
import SectionKicker from "./SectionKicker";
import { useAssembleIn } from "../hooks/useAssembleIn";

export default function About() {
  const containerRef = useRef(null);
  useAssembleIn(containerRef, ".assemble-highlight", { stagger: 0.1 });

  return (
    <section id="sobre-mi" className="relative px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1fr]">
        <div>
          <SectionKicker>{about.kicker}</SectionKicker>
          <h2 className="font-display mt-5 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
            La curiosidad es mi <span className="italic text-accent-teal">herramienta</span>{" "}
            favorita
          </h2>

          <div className="mt-8 space-y-5">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="max-w-lg leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div ref={containerRef} className="grid grid-cols-2 gap-4 self-start md:mt-14">
          {about.highlights.map((h) => (
            <div
              key={h.label}
              className="assemble-highlight rounded-2xl border border-line bg-card p-6 shadow-sm"
            >
              <p className="font-mono-label text-[11px] uppercase text-ink-soft">{h.label}</p>
              <p className="font-display mt-2 text-lg font-medium">{h.value}</p>
            </div>
          ))}
          <div className="assemble-highlight col-span-2 rounded-2xl border border-dashed border-line p-6">
            <p className="text-sm text-ink-soft">
              📍 Con base en <span className="font-medium text-ink">{profile.location}</span>,
              abierto a colaborar de forma remota.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
