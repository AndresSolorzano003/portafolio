import { useRef, useState } from "react";
import { ImagePlus, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { GRADIENT_PRESETS } from "../../data/gradients";
import { compressImage, sanitizeFilename } from "../../lib/imageUpload";
import { uploadImage } from "../../lib/githubContent";
import { validateVideoUrl } from "../../lib/videoEmbed";
import { slugify } from "../../lib/slugify";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink";

function gradientIdFromClasses(classes) {
  return GRADIENT_PRESETS.find((g) => g.classes === classes)?.id ?? GRADIENT_PRESETS[0].id;
}

function toDraft(project) {
  return {
    title: project.title || "",
    description: project.description || "",
    longDescription: project.longDescription || "",
    tags: (project.tags || []).join(", "),
    gradient: gradientIdFromClasses(project.gradient),
    image: project.image || "",
    videoUrl: project.videoUrl || "",
    link: project.link || "#",
  };
}

const emptyDraft = toDraft({});

export default function ProjectsEditor({ value, onChange, token }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [videoError, setVideoError] = useState("");
  const fileInputRef = useRef(null);

  const startAdd = () => {
    setEditingIndex(-1);
    setDraft(emptyDraft);
    setImageError("");
    setVideoError("");
  };
  const startEdit = (i) => {
    setEditingIndex(i);
    setDraft(toDraft(value[i]));
    setImageError("");
    setVideoError("");
  };
  const cancel = () => {
    setEditingIndex(null);
    setDraft(emptyDraft);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!token) {
      setImageError("Necesitas un token guardado para subir imágenes.");
      return;
    }
    setUploading(true);
    setImageError("");
    try {
      const base64 = await compressImage(file);
      const filename = `${Date.now()}-${sanitizeFilename(file.name.replace(/\.[^.]+$/, ""))}.jpg`;
      const url = await uploadImage(token, filename, base64);
      setDraft((d) => ({ ...d, image: url }));
    } catch (err) {
      setImageError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    if (!draft.title.trim()) return;
    if (draft.videoUrl && !validateVideoUrl(draft.videoUrl)) {
      setVideoError("Usa un link de YouTube, Vimeo, Google Drive, o un archivo .mp4/.webm directo.");
      return;
    }
    const clean = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      longDescription: draft.longDescription.trim(),
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      gradient: GRADIENT_PRESETS.find((g) => g.id === draft.gradient).classes,
      image: draft.image,
      videoUrl: draft.videoUrl.trim(),
      link: draft.link.trim() || "#",
    };
    if (editingIndex === -1) {
      onChange([...value, clean]);
    } else {
      onChange(value.map((p, i) => (i === editingIndex ? clean : p)));
    }
    cancel();
  };

  const remove = (i) => {
    if (!confirm(`¿Eliminar el proyecto "${value[i].title}"?`)) return;
    onChange(value.filter((_, idx) => idx !== i));
    if (editingIndex === i) cancel();
  };

  return (
    <div className="space-y-3">
      {value.map((p, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl border border-line p-3">
          <div
            className={`h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${p.gradient}`}
          >
            {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{p.title}</p>
            <p className="text-xs text-ink-soft">{p.tags?.join(", ")}</p>
          </div>
          <button onClick={() => startEdit(i)} className="text-ink-soft hover:text-ink">
            <Pencil size={15} />
          </button>
          <button onClick={() => remove(i)} className="text-ink-soft hover:text-accent-rose">
            <Trash2 size={15} />
          </button>
        </div>
      ))}

      {editingIndex === null ? (
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
        >
          <Plus size={14} /> Agregar proyecto
        </button>
      ) : (
        <div className="space-y-3 rounded-xl border border-dashed border-line p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-soft">
              {editingIndex === -1 ? "Nuevo proyecto" : "Editando proyecto"}
            </p>
            <button onClick={cancel} className="text-ink-soft hover:text-ink">
              <X size={15} />
            </button>
          </div>

          <input
            className={inputClass}
            placeholder="Título del proyecto"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />

          <div>
            <label className="mb-1 block text-xs text-ink-soft">
              Descripción corta (aparece en la tarjeta)
            </label>
            <textarea
              className={inputClass}
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-ink-soft">
              Descripción detallada (página de detalle — opcional, si la dejas vacía se usa la
              corta)
            </label>
            <textarea
              className={inputClass}
              rows={4}
              value={draft.longDescription}
              onChange={(e) => setDraft((d) => ({ ...d, longDescription: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              placeholder="Tags (separados por coma)"
              value={draft.tags}
              onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Link del proyecto en vivo (opcional)"
              value={draft.link}
              onChange={(e) => setDraft((d) => ({ ...d, link: e.target.value }))}
            />
          </div>

          <select
            className={inputClass}
            value={draft.gradient}
            onChange={(e) => setDraft((d) => ({ ...d, gradient: e.target.value }))}
          >
            {GRADIENT_PRESETS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>

          <div>
            <label className="mb-1 block text-xs text-ink-soft">Imagen de portada</label>
            <div className="flex items-center gap-3">
              <div
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${
                  GRADIENT_PRESETS.find((g) => g.id === draft.gradient).classes
                }`}
              >
                {draft.image && (
                  <img src={draft.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink disabled:opacity-50"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                {draft.image ? "Cambiar imagen" : "Subir imagen"}
              </button>
              {draft.image && (
                <button
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, image: "" }))}
                  className="text-xs text-ink-soft hover:text-accent-rose"
                >
                  Quitar
                </button>
              )}
            </div>
            {imageError && <p className="mt-1 text-xs text-accent-rose">{imageError}</p>}
          </div>

          <div>
            <label className="mb-1 block text-xs text-ink-soft">
              Video de funcionamiento — link de YouTube, Vimeo, Google Drive, o un .mp4 directo
              (opcional)
            </label>
            <p className="mb-1.5 text-[11px] text-ink-soft">
              Para Google Drive: sube el video, clic derecho → Compartir → "Cualquier persona con
              el enlace" y pega ese link aquí.
            </p>
            <input
              className={inputClass}
              placeholder="https://drive.google.com/file/d/... o https://youtube.com/watch?v=..."
              value={draft.videoUrl}
              onChange={(e) => {
                setDraft((d) => ({ ...d, videoUrl: e.target.value }));
                setVideoError("");
              }}
            />
            {videoError && <p className="mt-1 text-xs text-accent-rose">{videoError}</p>}
          </div>

          {draft.title.trim() && (
            <p className="text-xs text-ink-soft">
              Página de detalle: /#/proyecto/{slugify(draft.title)}
            </p>
          )}

          <button
            onClick={save}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            {editingIndex === -1 ? "Agregar proyecto" : "Guardar proyecto"}
          </button>
        </div>
      )}
    </div>
  );
}
