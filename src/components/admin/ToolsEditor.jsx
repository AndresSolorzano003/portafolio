import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink";

const emptyDraft = { name: "", level: 75, category: "" };

export default function ToolsEditor({ value, onChange }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);

  const startAdd = () => {
    setEditingIndex(-1);
    setDraft(emptyDraft);
  };
  const startEdit = (i) => {
    setEditingIndex(i);
    setDraft(value[i]);
  };
  const cancel = () => {
    setEditingIndex(null);
    setDraft(emptyDraft);
  };

  const save = () => {
    if (!draft.name.trim()) return;
    const clean = {
      name: draft.name.trim(),
      level: Math.max(0, Math.min(100, Number(draft.level) || 0)),
      category: draft.category.trim() || "General",
    };
    if (editingIndex === -1) {
      onChange([...value, clean]);
    } else {
      onChange(value.map((s, i) => (i === editingIndex ? clean : s)));
    }
    cancel();
  };

  const remove = (i) => {
    if (!confirm(`¿Eliminar "${value[i].name}"?`)) return;
    onChange(value.filter((_, idx) => idx !== i));
    if (editingIndex === i) cancel();
  };

  return (
    <div className="space-y-3">
      {value.map((s, i) => (
        <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-line p-3">
          <div>
            <p className="text-sm font-medium">{s.name}</p>
            <p className="text-xs text-ink-soft">
              {s.category} · {s.level}%
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => startEdit(i)} className="text-ink-soft hover:text-ink">
              <Pencil size={15} />
            </button>
            <button onClick={() => remove(i)} className="text-ink-soft hover:text-accent-rose">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}

      {editingIndex === null ? (
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
        >
          <Plus size={14} /> Agregar herramienta
        </button>
      ) : (
        <div className="space-y-2 rounded-xl border border-dashed border-line p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-soft">
              {editingIndex === -1 ? "Nueva herramienta" : "Editando herramienta"}
            </p>
            <button onClick={cancel} className="text-ink-soft hover:text-ink">
              <X size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              placeholder="Nombre (ej. Tableau)"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <input
              className={inputClass}
              placeholder="Categoría"
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            />
          </div>
          <label className="block text-xs text-ink-soft">
            Nivel: {draft.level}%
            <input
              type="range"
              min={0}
              max={100}
              value={draft.level}
              onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
              className="mt-1 w-full"
            />
          </label>
          <button
            onClick={save}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
          >
            {editingIndex === -1 ? "Agregar" : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}
