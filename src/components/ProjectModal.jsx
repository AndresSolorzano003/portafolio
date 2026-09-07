import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ArrowUpRight, ChevronLeft, ChevronRight, Database, X } from "lucide-react";
import { resolveVideo } from "../lib/videoEmbed";

const BURST_COLORS = [
  "var(--color-accent-indigo)",
  "var(--color-accent-teal)",
  "var(--color-accent-amber)",
  "var(--color-accent-rose)",
];

function BurstEffect({ triggerKey }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const particles = gsap.utils.toArray(el.children);

    const ctx = gsap.context(() => {
      particles.forEach((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 90 + Math.random() * 70;
        gsap.set(p, { x: 0, y: 0, opacity: 1, scale: 1 });
        gsap.to(p, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0.2,
          duration: 0.9 + Math.random() * 0.4,
          ease: "power2.out",
        });
      });
    }, el);

    return () => ctx.revert();
    // re-run every time the visible project changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible"
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{ background: BURST_COLORS[i % BURST_COLORS.length] }}
        />
      ))}
    </div>
  );
}

function TiltImage({ project }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 18 });
  const glowX = useTransform(springY, [-8, 8], [0, 100]);
  const glowY = useTransform(springX, [8, -8], [0, 100]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 60%)`
  );

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(-py * 10);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${project.gradient}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: glowBackground }}
      />
      {project.image ? (
        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
      ) : (
        <Database className="text-white/90" size={56} strokeWidth={1.5} />
      )}
    </motion.div>
  );
}

const contentVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function ProjectContent({ project, direction }) {
  const video = project.videoUrl ? resolveVideo(project.videoUrl) : null;

  return (
    <motion.div
      key={project.title}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0, transition: { type: "spring", stiffness: 320, damping: 30 } }}
      exit={{ opacity: 0, x: -direction * 60, transition: { duration: 0.18, ease: "easeIn" } }}
    >
      <div className="relative">
        <TiltImage project={project} />
        <BurstEffect triggerKey={project.title} />
      </div>

      <motion.div variants={contentVariants} initial="hidden" animate="show">
        <motion.h2
          variants={itemVariants}
          className="font-display mt-7 text-3xl font-semibold tracking-tight md:text-4xl"
        >
          {project.title}
        </motion.h2>

        <motion.div variants={itemVariants} className="mt-3 flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="font-mono-label rounded-full border border-line px-3 py-1 text-[10px] uppercase text-ink-soft"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-6 space-y-3 text-base leading-relaxed text-ink-soft"
        >
          {(project.longDescription || project.description)
            .split("\n")
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </motion.div>

        {video && (
          <motion.div variants={itemVariants} className="mt-8">
            <p className="font-mono-label mb-3 text-xs uppercase text-ink-soft">
              Video de funcionamiento
            </p>
            <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-paper">
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
          </motion.div>
        )}

        {project.link && project.link !== "#" && (
          <motion.a
            variants={itemVariants}
            href={project.link}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.03]"
          >
            Ver proyecto en vivo
            <ArrowUpRight size={15} />
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ProjectModal({ project, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) {
        setDirection(1);
        onNext();
      }
      if (e.key === "ArrowLeft" && hasPrev) {
        setDirection(-1);
        onPrev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md md:p-8"
      onClick={onClose}
    >
      <motion.div
        layout
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-line bg-card shadow-2xl"
      >
        <button
          onClick={onClose}
          data-cursor="hover"
          aria-label="Cerrar"
          className="absolute top-5 right-5 z-30 grid h-9 w-9 place-items-center rounded-full border border-line bg-card text-ink-soft hover:text-ink"
        >
          <X size={16} />
        </button>

        {hasPrev && (
          <button
            onClick={() => {
              setDirection(-1);
              onPrev();
            }}
            data-cursor="hover"
            aria-label="Proyecto anterior"
            className="absolute top-1/2 left-3 z-30 hidden -translate-y-1/2 place-items-center rounded-full border border-line bg-card p-2 text-ink-soft shadow-md hover:text-ink md:grid"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={() => {
              setDirection(1);
              onNext();
            }}
            data-cursor="hover"
            aria-label="Siguiente proyecto"
            className="absolute top-1/2 right-3 z-30 hidden -translate-y-1/2 place-items-center rounded-full border border-line bg-card p-2 text-ink-soft shadow-md hover:text-ink md:grid"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div className="max-h-[88vh] overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="popLayout" initial={false}>
            <ProjectContent key={project.title} project={project} direction={direction} />
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
