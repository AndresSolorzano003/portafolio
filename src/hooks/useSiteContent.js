import { useEffect, useState } from "react";
import { projects as defaultProjects, techSkills as defaultTechSkills } from "../data/portfolio";
import { CONTENT_RAW_URL } from "../config/site";

// Reads the live projects/tech-skills from the repo's content.json (edited
// through the hidden admin panel) and falls back to the bundled defaults
// while it loads, or if the fetch fails (offline, repo not deployed yet).
export function useSiteContent() {
  const [content, setContent] = useState({
    projects: defaultProjects,
    techSkills: defaultTechSkills,
  });
  const [source, setSource] = useState("default");

  const load = () => {
    fetch(`${CONTENT_RAW_URL}?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("not ok"))))
      .then((data) => {
        if (Array.isArray(data.projects) && Array.isArray(data.techSkills)) {
          setContent({ projects: data.projects, techSkills: data.techSkills });
          setSource("remote");
        }
      })
      .catch(() => setSource("default"));
  };

  useEffect(() => {
    load();
  }, []);

  // Optimistic local override — used right after the admin panel commits,
  // so the change reflects instantly instead of waiting on the raw.
  // githubusercontent.com CDN cache to catch up with the new commit.
  const applyLocal = (next) => {
    setContent(next);
    setSource("local");
  };

  return { ...content, source, refresh: load, applyLocal };
}
