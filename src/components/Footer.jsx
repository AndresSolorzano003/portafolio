import { ArrowUp } from "lucide-react";
import { profile } from "../data/portfolio";

export default function Footer({ onAdminOpen }) {
  return (
    <footer className="relative border-t border-line px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-ink-soft md:flex-row">
        <p className="flex items-center gap-2">
          © {new Date().getFullYear()} {profile.name}. Hecho con React, Tailwind &amp; GSAP.
          {/* Acceso oculto al panel de administración — solo el dueño del sitio lo necesita. */}
          <button
            onClick={onAdminOpen}
            aria-hidden="true"
            tabIndex={-1}
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-soft/20 outline-none transition-colors hover:bg-ink-soft/60"
          />
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-cursor="hover"
          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-ink transition-colors hover:border-ink"
        >
          <ArrowUp size={13} />
          Volver arriba
        </button>
      </div>
    </footer>
  );
}
