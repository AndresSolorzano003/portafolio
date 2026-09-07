import { useEffect, useState } from "react";
import {
  about as defaultAbout,
  softSkills as defaultSoftSkills,
  projects as defaultProjects,
  techSkills as defaultTechSkills,
} from "../data/portfolio";
import { CONTENT_RAW_URL } from "../config/site";

const DEFAULTS = {
  about: defaultAbout,
  softSkills: defaultSoftSkills,
  projects: defaultProjects,
  techSkills: defaultTechSkills,
};

// Reads the live, editable content (about, soft skills, projects,
// tech skills) from the repo's content.json — edited through the hidden
// admin panel — and falls back to the bundled defaults while it loads,
// or if the fetch fails (offline, repo not deployed yet).
export function useSiteContent() {
  const [content, setContent] = useState(DEFAULTS);
  const [source, setSource] = useState("default");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`${CONTENT_RAW_URL}?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("not ok"))))
      .then((data) => {
        setContent({
          about: data.about && data.about.paragraphs ? data.about : DEFAULTS.about,
          softSkills: Array.isArray(data.softSkills) ? data.softSkills : DEFAULTS.softSkills,
          projects: Array.isArray(data.projects) ? data.projects : DEFAULTS.projects,
          techSkills: Array.isArray(data.techSkills) ? data.techSkills : DEFAULTS.techSkills,
        });
        setSource("remote");
      })
      .catch(() => setSource("default"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  // Optimistic local override — used right after the admin panel commits,
  // so the change reflects instantly instead of waiting on the raw.
  // githubusercontent.com CDN cache to catch up with the new commit.
  const applyLocal = (next) => {
    setContent((prev) => ({ ...prev, ...next }));
    setSource("local");
  };

  return { ...content, source, loading, refresh: load, applyLocal };
}
