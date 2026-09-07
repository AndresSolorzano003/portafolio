import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Database } from "lucide-react";
import ParticlesBackground from "../components/ParticlesBackground";
import ThemeToggle from "../components/ThemeToggle";
import { useSiteContent } from "../hooks/useSiteContent";
import { slugify } from "../lib/slugify";
import { resolveVideo } from "../lib/videoEmbed";
import { profile } from "../data/portfolio";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { projects, loading } = useSiteContent();

  const project = useMemo(
    () => projects.find((p) => slugify(p.title) === slug),
    [projects, slug]
  );

  const video = project?.videoUrl ? resolveVideo(project.videoUrl) : null;

  return (
    <div className="relative min-h-screen">
      <div className="relative">
        <ParticlesBackground />

        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-10">
          <Link to="/" className="font-display text-lg tracking-tight">
            {profile.name.split(" ")[0]} {profile.name.split(" ")[1]}
            <span className="font-display italic text-ink-soft"> · {profile.roleTag}</span>
          </Link>
          <ThemeToggle />
        </header>

        <main className="relative z-10 mx-auto max-w-3xl px-6 pb-28 md:px-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={15} /> Volver al portafolio
          </Link>

          {!project && !loading && (
            <div className="rounded-2xl border border-line bg-card p-10 text-center">
              <p className="font-display text-2xl">Proyecto no encontrado</p>
              <p className="mt-2 text-sm text-ink-soft">
                Puede que el enlace esté desactualizado o el proyecto haya sido eliminado.
              </p>
            </div>
          )}

          {project && (
            <article>
              <div
                className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${project.gradient}`}
              >
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Database className="text-white/90" size={56} strokeWidth={1.5} />
                )}
              </div>

              <h1 className="font-display mt-8 text-4xl font-semibold tracking-tight md:text-5xl">
                {project.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono-label rounded-full border border-line px-3 py-1 text-[10px] uppercase text-ink-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 space-y-4 text-base leading-relaxed text-ink-soft">
                {(project.longDescription || project.description)
                  .split("\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>

              {video && (
                <div className="mt-10">
                  <p className="font-mono-label mb-3 text-xs uppercase text-ink-soft">
                    Video de funcionamiento
                  </p>
                  <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-card">
                    {video.type === "iframe" ? (
                      <iframe
                        src={video.src}
                        title={`Video de ${project.title}`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={video.src} controls className="h-full w-full" />
                    )}
                  </div>
                </div>
              )}

              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.03]"
                >
                  Ver proyecto en vivo
                  <ArrowUpRight size={15} />
                </a>
              )}
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
