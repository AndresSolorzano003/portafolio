import { useState } from "react";
import * as Icons from "lucide-react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { SKILL_ICON_NAMES } from "../../data/skillIcons";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink";

const emptyDraft = { icon: SKILL_ICON_NAMES[0], title: "", desc: "" };

export default function SoftSkillsEditor({ value, onChange }) {
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
    if (!draft.title.trim()) return;
    if (editingIndex === -1) {
      onChange([...value, draft]);
    } else {
      onChange(value.map((s, i) => (i === editingIndex ? draft : s)));
    }
    cancel();
  };

  const remove = (i) => {
    if (!confirm(`¿Eliminar la habilidad "${value[i].title}"?`)) return;
    onChange(value.filter((_, idx) => idx !== i));
    if (editingIndex === i) cancel();
  };

  return (
    <div className="space-y-3">
      {value.map((s, i) => {
        const Icon = Icons[s.icon] ?? Icons.Sparkles;
        return (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-line p-3">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-paper-soft">
              <Icon size={15} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-ink-soft">{s.desc}</p>
            </div>
            <button onClick={() => startEdit(i)} className="text-ink-soft hover:text-ink">
              <Pencil size={15} />
            </button>
            <button onClick={() => remove(i)} className="text-ink-soft hover:text-accent-rose">
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}

      {editingIndex === null ? (
        <button
          onClick={startAdd}
          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
        >
          <Plus size={14} /> Agregar habilidad
        </button>
      ) : (
        <div className="space-y-2 rounded-xl border border-dashed border-line p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-soft">
              {editingIndex === -1 ? "Nueva habilidad" : "Editando habilidad"}
            </p>
            <button onClick={cancel} className="text-ink-soft hover:text-ink">
              <X size={15} />
            </button>
          </div>
          <select
            className={inputClass}
            value={draft.icon}
            onChange={(e) => setDraft((d) => ({ ...d, icon: e.target.value }))}
          >
            {SKILL_ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            placeholder="Título (ej. Pensamiento analítico)"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Descripción breve"
            value={draft.desc}
            onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
          />
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
