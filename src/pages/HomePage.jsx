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

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} onSaved={applyLocal} />
    </>
  );
}
