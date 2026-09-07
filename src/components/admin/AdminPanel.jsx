import { useEffect, useState } from "react";
import { X, LogOut, Loader2, ShieldAlert } from "lucide-react";
import { commitContent, fetchRemoteContent, verifyToken } from "../../lib/githubContent";
import AboutEditor from "./AboutEditor";
import SoftSkillsEditor from "./SoftSkillsEditor";
import ToolsEditor from "./ToolsEditor";
import ProjectsEditor from "./ProjectsEditor";

const TOKEN_KEY = "portfolio_admin_token";

const TABS = [
  { id: "about", label: "Sobre mí" },
  { id: "soft", label: "Habilidades blandas" },
  { id: "tools", label: "Herramientas" },
  { id: "projects", label: "Proyectos" },
];

export default function AdminPanel({ open, onClose, onSaved }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [tab, setTab] = useState("projects");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sha, setSha] = useState(null);
  const [content, setContent] = useState(null);
  const [originalContent, setOriginalContent] = useState(null);

  useEffect(() => {
    if (!open || !token) return;
    setLoading(true);
    setError("");
    setSuccess("");
    fetchRemoteContent(token)
      .then(({ content: remote, sha: fileSha }) => {
        setContent(remote);
        setOriginalContent(remote);
        setSha(fileSha);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, token]);

  const dirty = content && originalContent && JSON.stringify(content) !== JSON.stringify(originalContent);

  const handleClose = () => {
    if (dirty && !confirm("Tienes cambios sin guardar. ¿Cerrar de todas formas?")) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dirty]);

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
    if (dirty && !confirm("Tienes cambios sin guardar. ¿Cerrar sesión de todas formas?")) return;
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setContent(null);
    setOriginalContent(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const newSha = await commitContent(
        token,
        content,
        sha,
        "Actualizar contenido del portafolio desde el panel de administración"
      );
      setSha(newSha);
      setOriginalContent(content);
      setSuccess("Guardado. El sitio público se actualiza en unos segundos.");
      onSaved?.(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-semibold">Panel de administración</h2>
          <button onClick={handleClose} aria-label="Cerrar" className="text-ink-soft hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {!token ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4 overflow-y-auto p-6">
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
              <strong>Contents: Read and write</strong> sobre este repositorio).
            </p>
            <div className="flex items-start gap-2 rounded-xl border border-line bg-paper-soft p-3 text-xs text-ink-soft">
              <ShieldAlert size={28} className="shrink-0 text-accent-amber" />
              <div className="space-y-1">
                <p>
                  Este token se guarda <strong>solo en este navegador</strong> (localStorage) y
                  nunca se envía a nadie más que a la API de GitHub.
                </p>
                <p>
                  Por seguridad: limítalo a este único repositorio, dale solo permiso de
                  Contents, ponle una fecha de expiración corta, y revócalo desde GitHub si dejas
                  de usarlo o usas un computador compartido.
                </p>
              </div>
            </div>
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
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-6 py-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    tab === t.id ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {t.label}
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
              {loading || !content ? (
                <p className="flex items-center gap-2 text-sm text-ink-soft">
                  <Loader2 size={14} className="animate-spin" /> Cargando contenido actual...
                </p>
              ) : (
                <>
                  {tab === "about" && (
                    <AboutEditor
                      value={content.about}
                      onChange={(about) => setContent((c) => ({ ...c, about }))}
                    />
                  )}
                  {tab === "soft" && (
                    <SoftSkillsEditor
                      value={content.softSkills}
                      onChange={(softSkills) => setContent((c) => ({ ...c, softSkills }))}
                    />
                  )}
                  {tab === "tools" && (
                    <ToolsEditor
                      value={content.techSkills}
                      onChange={(techSkills) => setContent((c) => ({ ...c, techSkills }))}
                    />
                  )}
                  {tab === "projects" && (
                    <ProjectsEditor
                      value={content.projects}
                      onChange={(projects) => setContent((c) => ({ ...c, projects }))}
                      token={token}
                    />
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-line px-6 py-4">
              <button
                onClick={handleSave}
                disabled={saving || loading || !dirty}
                className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Guardar cambios
              </button>
              {dirty && !saving && (
                <span className="text-xs text-accent-amber">Tienes cambios sin guardar</span>
              )}
              {error && <p className="text-sm text-accent-rose">{error}</p>}
              {success && <p className="text-sm text-accent-teal">{success}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
