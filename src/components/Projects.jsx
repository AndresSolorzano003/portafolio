import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SectionKicker from "./SectionKicker";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function Projects({ projects }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section id="proyectos" className="relative px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionKicker>Proyectos</SectionKicker>
            <h2 className="font-display mt-5 max-w-xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
              Datos con <span className="italic text-accent-rose">contexto</span>, no solo
              números
            </h2>
          </div>
          <p className="max-w-xs text-sm text-ink-soft">
            Selección de trabajos donde el objetivo fue el mismo: hacer que la información sea
            fácil de entender y usar.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} onOpenDetail={setActiveIndex} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <ProjectModal
            key="project-modal"
            project={projects[activeIndex]}
            onClose={() => setActiveIndex(null)}
            onPrev={() => setActiveIndex((i) => (i > 0 ? i - 1 : i))}
            onNext={() => setActiveIndex((i) => (i < projects.length - 1 ? i + 1 : i))}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < projects.length - 1}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
