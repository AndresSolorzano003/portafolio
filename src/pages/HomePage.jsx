import { useState } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import AdminPanel from "../components/admin/AdminPanel";
import ErrorBoundary from "../components/ErrorBoundary";
import { useSiteContent } from "../hooks/useSiteContent";

export default function HomePage() {
  const { about, softSkills, projects, techSkills, applyLocal } = useSiteContent();
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="relative">
        <ParticlesBackground />
        <main className="relative z-10">
          <Hero />
          <About about={about} />
          <Skills techSkills={techSkills} softSkills={softSkills} />
          <Projects projects={projects} />
          <Contact />
        </main>
        <Footer onAdminOpen={() => setAdminOpen(true)} />
      </div>

      {adminOpen && (
        <ErrorBoundary
          fallback={
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="max-w-sm space-y-4 rounded-2xl border border-line bg-card p-6 text-center shadow-2xl">
                <p className="text-sm text-ink-soft">
                  El panel encontró un error inesperado con estos datos. Tus cambios ya guardados
                  no se perdieron.
                </p>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
                >
                  Cerrar panel
                </button>
              </div>
            </div>
          }
        >
          <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} onSaved={applyLocal} />
        </ErrorBoundary>
      )}
    </>
  );
}
