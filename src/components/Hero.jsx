import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import { profile, stats } from "../data/portfolio";
import StatCounter from "./StatCounter";

gsap.registerPlugin(ScrollTrigger);

const FRAGMENTS = [
  { size: 46, top: "-6%", left: "-8%", rot: -18, color: "bg-accent-indigo/70" },
  { size: 30, top: "8%", left: "102%", rot: 12, color: "bg-accent-amber/70" },
  { size: 22, top: "78%", left: "-10%", rot: 25, color: "bg-accent-teal/70" },
  { size: 60, top: "88%", left: "88%", rot: -10, color: "bg-accent-rose/50" },
  { size: 16, top: "40%", left: "-14%", rot: 40, color: "bg-ink/40" },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const driftRefs = useRef([]);
  const fragmentsRef = useRef([]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 18 });
  const glowX = useTransform(springY, [-10, 10], [0, 100]);
  const glowY = useTransform(springX, [10, -10], [0, 100]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 60%)`
  );

  const handlePointerMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 14);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(".hero-kicker, .hero-line, .hero-desc, .hero-stat, .hero-cta", {
        y: 26,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      tl.from(
        cardRef.current,
        { y: 40, opacity: 0, scale: 0.94, duration: 1, ease: "power3.out" },
        "-=0.7"
      );

      fragmentsRef.current.forEach((frag, i) => {
        if (!frag) return;
        gsap.set(frag, {
          x: (i % 2 === 0 ? -1 : 1) * (140 + i * 30),
          y: (i % 2 === 0 ? -1 : 1) * -80,
          opacity: 0,
          rotate: FRAGMENTS[i].rot * 4,
          scale: 0.4,
        });
        tl.to(
          frag,
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: FRAGMENTS[i].rot,
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
          },
          `-=${0.9 - i * 0.05}`
        );
      });

      // parallax drift apart while scrolling through the hero. This runs on
      // a separate wrapper element so it never fights the entrance tween
      // above (which owns the fragment's own x/y/rotate/scale/opacity).
      driftRefs.current.forEach((wrapper, i) => {
        if (!wrapper) return;
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.to(wrapper, {
          y: dir * 120,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-2">
        <div>
          <p className="hero-kicker font-mono-label flex flex-wrap items-center gap-2 text-xs uppercase text-ink-soft">
            {profile.heroTags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-2">
                {i !== 0 && <span className="text-line">·</span>}
                {tag}
              </span>
            ))}
          </p>

          <h1 className="hero-line font-display mt-6 text-5xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
            Tableros que
            <br />
            <span className="italic text-accent-indigo">convierten datos</span> en
            <br />
            decisiones
          </h1>

          <p className="hero-desc mt-6 max-w-md text-base leading-relaxed text-ink-soft">
            {profile.heroDescription}
          </p>

          <div className="mt-10 flex gap-10">
            {stats.map((s) => (
              <div className="hero-stat" key={s.label}>
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>

          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <button
              data-cursor="hover"
              onClick={() =>
                document.querySelector("#proyectos")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.03]"
            >
              Ver proyectos
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              data-cursor="hover"
              onClick={() =>
                document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-full border border-line px-6 py-3 text-sm font-medium transition-colors hover:border-ink"
            >
              Contactar
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm" style={{ perspective: 1000 }}>
          {FRAGMENTS.map((f, i) => (
            <div
              key={i}
              ref={(el) => (driftRefs.current[i] = el)}
              className="absolute -z-10"
              style={{ top: f.top, left: f.left }}
            >
              <div
                ref={(el) => (fragmentsRef.current[i] = el)}
                className={`rounded-2xl ${f.color} blur-[1px]`}
                style={{ width: f.size, height: f.size }}
              />
            </div>
          ))}

          <motion.div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-line bg-card shadow-[0_30px_60px_-20px_rgba(20,22,28,0.25)]"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: glowBackground }}
            />
            <img
              src={profile.photo}
              alt={profile.name}
              className="h-full w-full object-cover"
              style={{ transform: "translateZ(0)" }}
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-paper/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-sm">
              <MapPin size={12} />
              {profile.location}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="font-mono-label text-[10px] uppercase text-ink-soft">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-ink-soft" />
        </motion.div>
      </motion.div>
    </section>
  );
}
