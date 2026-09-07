import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-ink";

export default function AboutEditor({ value, onChange }) {
  const setField = (field, val) => onChange({ ...value, [field]: val });

  const updateParagraph = (i, text) => {
    const next = [...value.paragraphs];
    next[i] = text;
    setField("paragraphs", next);
  };
  const removeParagraph = (i) => {
    setField(
      "paragraphs",
      value.paragraphs.filter((_, idx) => idx !== i)
    );
  };
  const addParagraph = () => setField("paragraphs", [...value.paragraphs, ""]);

  const updateHighlight = (i, field, text) => {
    const next = value.highlights.map((h, idx) => (idx === i ? { ...h, [field]: text } : h));
    setField("highlights", next);
  };
  const removeHighlight = (i) => {
    setField(
      "highlights",
      value.highlights.filter((_, idx) => idx !== i)
    );
  };
  const addHighlight = () =>
    setField("highlights", [...value.highlights, { label: "", value: "" }]);

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">Título</label>
        <input
          className={inputClass}
          value={value.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="Título de la sección Sobre mí"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">Párrafos</label>
        <div className="space-y-3">
          {value.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                className={inputClass}
                rows={3}
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
              />
              <button
                onClick={() => removeParagraph(i)}
                className="text-ink-soft hover:text-accent-rose"
                aria-label="Eliminar párrafo"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addParagraph}
          className="mt-3 flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
        >
          <Plus size={14} /> Agregar párrafo
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-ink-soft">
          Datos destacados (las 4 tarjetas)
        </label>
        <div className="space-y-2">
          {value.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Etiqueta (ej. Enfoque)"
                value={h.label}
                onChange={(e) => updateHighlight(i, "label", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Valor (ej. Datos → decisiones)"
                value={h.value}
                onChange={(e) => updateHighlight(i, "value", e.target.value)}
              />
              <button
                onClick={() => removeHighlight(i)}
                className="text-ink-soft hover:text-accent-rose"
                aria-label="Eliminar dato"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addHighlight}
          className="mt-3 flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium hover:border-ink"
        >
          <Plus size={14} /> Agregar dato
        </button>
      </div>
    </div>
  );
}
