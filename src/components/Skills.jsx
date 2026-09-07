import { useRef } from "react";
import { softSkills } from "../data/portfolio";
import SectionKicker from "./SectionKicker";
import SkillCard from "./SkillCard";
import SkillBar from "./SkillBar";
import { useAssembleIn } from "../hooks/useAssembleIn";

export default function Skills({ techSkills }) {
  const softRef = useRef(null);
  useAssembleIn(softRef, ".skill-card", { stagger: 0.08 });

  const mid = Math.ceil(techSkills.length / 2);
  const firstHalf = techSkills.slice(0, mid);
  const secondHalf = techSkills.slice(mid);

  return (
    <section id="habilidades" className="relative px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionKicker>Habilidades</SectionKicker>
        <h2 className="font-display mt-5 max-w-2xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
          Entre <span className="italic text-accent-amber">personas</span> y{" "}
          <span className="italic text-accent-indigo">herramientas</span>
        </h2>

        <div className="mt-16">
          <p className="font-mono-label text-xs uppercase text-ink-soft">Habilidades blandas</p>
          <div ref={softRef} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {softSkills.map((skill) => (
              <SkillCard key={skill.title} {...skill} />
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-x-20">
          <div>
            <p className="font-mono-label text-xs uppercase text-ink-soft">
              Lenguajes &amp; herramientas
            </p>
            <div className="mt-6 space-y-6">
              {firstHalf.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </div>
          <div className="md:mt-[3.25rem]">
            <div className="space-y-6">
              {secondHalf.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
