import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import * as Icons from "lucide-react";

export default function SkillCard({ icon, title, desc }) {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const Icon = Icons[icon] ?? Icons.Sparkles;

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className="skill-card group rounded-2xl border border-line bg-card p-6 shadow-sm"
    >
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-paper-soft text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
        <Icon size={19} />
      </div>
      <h3 className="font-display text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
    </motion.div>
  );
}
