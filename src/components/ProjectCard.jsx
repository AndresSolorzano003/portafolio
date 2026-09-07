import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Database } from "lucide-react";
import { slugify } from "../lib/slugify";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const visualRef = useRef(null);
  const metaRef = useRef(null);
  const tagsRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(visualRef.current, { x: -70, opacity: 0, rotate: -6 });
      gsap.set(metaRef.current, { x: 70, opacity: 0 });
      gsap.set(tagsRef.current?.children ?? [], { y: -16, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.to(visualRef.current, { x: 0, opacity: 1, rotate: 0, duration: 0.7, ease: "power3.out" })
        .to(metaRef.current, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "<0.05")
        .to(
          tagsRef.current?.children ?? [],
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" },
          "<0.15"
        );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      data-cursor="hover"
      className="group grid gap-6 rounded-3xl border border-line bg-card p-6 shadow-sm transition-shadow hover:shadow-lg md:grid-cols-[1fr_1.3fr] md:p-8"
    >
      <div
        ref={visualRef}
        className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient} md:aspect-auto`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <span className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/20 blur-xl" />
            <span className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-black/10 blur-2xl" />
            <Database className="relative text-white/90" size={40} strokeWidth={1.5} />
          </>
        )}
        <span className="absolute top-4 left-4 font-mono-label text-xs text-white/80 drop-shadow">
          0{index + 1}
        </span>
      </div>

      <div ref={metaRef} className="flex flex-col justify-center">
        <h3 className="font-display text-2xl font-semibold">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.description}</p>

        <div ref={tagsRef} className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono-label rounded-full border border-line px-3 py-1 text-[10px] uppercase text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={`#/proyecto/${slugify(project.title)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink"
        >
          Ver detalle
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </a>
      </div>
    </div>
  );
}
