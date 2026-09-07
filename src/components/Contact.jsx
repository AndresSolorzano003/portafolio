import { useRef } from "react";
import { Mail } from "lucide-react";
import { profile } from "../data/portfolio";
import SectionKicker from "./SectionKicker";
import { useAssembleIn } from "../hooks/useAssembleIn";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./icons/SocialIcons";

const SOCIALS = [
  { label: "LinkedIn", href: profile.social.linkedin, icon: LinkedinIcon },
  { label: "GitHub", href: profile.social.github, icon: GithubIcon },
  { label: "Instagram", href: profile.social.instagram, icon: InstagramIcon },
];

export default function Contact() {
  const containerRef = useRef(null);
  useAssembleIn(containerRef, ".social-pill", { stagger: 0.1 });

  return (
    <section id="contacto" className="relative px-6 py-28 md:px-10 md:py-40">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <SectionKicker>Contacto</SectionKicker>
        <h2 className="font-display mt-5 text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
          Hablemos de tu <span className="italic text-accent-teal">próximo tablero</span>
        </h2>
        <p className="mt-5 max-w-md text-ink-soft">
          ¿Tienes datos dispersos y necesitas un tablero claro? Escríbeme y lo conversamos.
        </p>

        <a
          href={`mailto:${profile.email}`}
          data-cursor="hover"
          className="group relative mt-10 flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-4 text-sm font-medium text-paper transition-transform hover:scale-[1.03]"
        >
          <Mail size={16} />
          Escríbeme · {profile.email}
        </a>

        <div ref={containerRef} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="social-pill flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <Icon size={15} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
