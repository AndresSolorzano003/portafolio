import { useEffect, useState } from "react";
import { X, Trash2, Plus, LogOut, Loader2 } from "lucide-react";
import { GRADIENT_PRESETS } from "../../data/gradients";
import { commitContent, fetchRemoteContent, verifyToken } from "../../lib/githubContent";

const TOKEN_KEY = "portfolio_admin_token";

const emptyProject = {
  title: "",
  description: "",
  tags: "",
  gradient: GRADIENT_PRESETS[0].id,
  link: "#",
};
const emptySkill = { name: "", level: 75, category: "" };

export default function AdminPanel({ open, onClose, onSaved }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [tab, setTab] = useState("proyectos");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sha, setSha] = useState(null);
  const [projects, setProjects] = useState(null);
  const [techSkills, setTechSkills] = useState(null);

  const [newProject, setNewProject] = useState(emptyProject);
  const [newSkill, setNewSkill] = useState(emptySkill);

  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    setError("");
    fetchRemoteContent(token)
      .then(({ content, sha: fileSha }) => {
        setProjects(content.projects ?? []);
        setTechSkills(content.techSkills ?? []);
        setSha(fileSha);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, token]);

  if (!open) return null;

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setAuthError("");
    try {
      await verifyToken(tokenInput.trim());
      localStorage.setItem(TOKEN_KEY, tokenInput.trim());
      setToken(tokenInput.trim());
      setTokenInput("");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setProjects(null);
    setTechSkills(null);
  };

  const addProject = () => {
    if (!newProject.title.trim()) return;
    setProjects((prev) => [
      ...prev,
      {
        title: newProject.title.trim(),
        description: newProject.description.trim(),
        tags: newProject.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        gradient: GRADIENT_PRESETS.find((g) => g.id === newProject.gradient).classes,
        link: newProject.link.trim() || "#",
      },
    ]);
    setNewProject(emptyProject);
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    setTechSkills((prev) => [
      ...prev,
      {
        name: newSkill.name.trim(),
        level: Math.max(0, Math.min(100, Number(newSkill.level) || 0)),
        category: newSkill.category.trim() || "General",
      },
    ]);
    setNewSkill(emptySkill);
  };

  const removeProject = (i) => setProjects((prev) => prev.filter((_, idx) => idx !== i));
  const removeSkill = (i) => setTechSkills((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const newSha = await commitContent(
        token,
        { projects, techSkills },
        sha,
        "Actualizar contenido del portafolio desde el panel de administración"
      );
      setSha(newSha);
      setSuccess("Guardado. El sitio público se actualizará en unos segundos.");
      onSaved?.({ projects, techSkills });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Panel de administración</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink-soft hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {!token ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4 p-6">
            <p className="text-sm text-ink-soft">
              Ingresa un{" "}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Personal Access Token
              </a>{" "}
              de GitHub (fine-grained, con permiso de solo{" "}
              <strong>Contents: Read and write</strong> sobre este repositorio). Se guarda solo en
              este navegador.
            </p>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="github_pat_..."
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink"
              autoFocus
            />
            {authError && <p className="text-sm text-accent-rose">{authError}</p>}
            <button
              type="submit"
              disabled={verifying || !tokenInput.trim()}
              className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-50"
            >
              {verifying && <Loader2 size={14} className="animate-spin" />}
              Guardar token
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-line px-6 py-3">
              {["proyectos", "herramientas"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    tab === t ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="ml-auto flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink"
              >
                <LogOut size={13} />
                Cerrar sesión
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <p className="flex items-center gap-2 text-sm text-ink-soft">
                  <Loader2 size={14} className="animate-spin" /> Cargando contenido actual...
                </p>
              ) : (
                <>
                  {tab === "proyectos" && (
                    <div className="space-y-3">
                      {projects?.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-start justify-between gap-3 rounded-xl border border-line p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{p.title}</p>
                            <p className="text-xs text-ink-soft">{p.tags?.join(", ")}</p>
                          </div>
                          <button onClick={() => removeProject(i)} className="text-ink-soft hover:text-accent-rose">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}

                      <div className="mt-4 space-y-2 rounded-xl border border-dashed border-line p-4">
                        <input
                          placeholder="Título del proyecto"
                          value={newProject.title}
                          onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                        />
                        <textarea
                          placeholder="Descripción"
                          value={newProject.description}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, description: e.target.value }))
                          }
                          rows={2}
                          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            placeholder="Tags (separados por coma)"
                            value={newProject.tags}
                            onChange={(e) => setNewProject((p) => ({ ...p, tags: e.target.value }))}
                            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                          />
                          <input
                            placeholder="Link (opcional)"
                            value={newProject.link}
                            onChange={(e) => setNewProject((p) => ({ ...p, link: e.target.value }))}
                            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                          />
                        </div>
                        <select
                          value={newProject.gradient}
                          onChange={(e) =>
                            setNewProject((p) => ({ ...p, gradient: e.target.value }))
                          }
                          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                        >
                          {GRADIENT_PRESETS.map((g) => (
                            <option key={g.id} value={g.id}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={addProject}
                          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
                        >
                          <Plus size={14} /> Agregar proyecto
                        </button>
                      </div>
                    </div>
                  )}

                  {tab === "herramientas" && (
                    <div className="space-y-3">
                      {techSkills?.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-3 rounded-xl border border-line p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{s.name}</p>
                            <p className="text-xs text-ink-soft">
                              {s.category} · {s.level}%
                            </p>
                          </div>
                          <button onClick={() => removeSkill(i)} className="text-ink-soft hover:text-accent-rose">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}

                      <div className="mt-4 space-y-2 rounded-xl border border-dashed border-line p-4">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            placeholder="Nombre (ej. Tableau)"
                            value={newSkill.name}
                            onChange={(e) => setNewSkill((s) => ({ ...s, name: e.target.value }))}
                            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                          />
                          <input
                            placeholder="Categoría"
                            value={newSkill.category}
                            onChange={(e) =>
                              setNewSkill((s) => ({ ...s, category: e.target.value }))
                            }
                            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink"
                          />
                        </div>
                        <label className="block text-xs text-ink-soft">
                          Nivel: {newSkill.level}%
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={newSkill.level}
                            onChange={(e) =>
                              setNewSkill((s) => ({ ...s, level: e.target.value }))
                            }
                            className="mt-1 w-full"
                          />
                        </label>
                        <button
                          onClick={addSkill}
                          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
                        >
                          <Plus size={14} /> Agregar herramienta
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-line px-6 py-4">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Guardar cambios
              </button>
              {error && <p className="text-sm text-accent-rose">{error}</p>}
              {success && <p className="text-sm text-accent-teal">{success}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
