// Fixed gradient presets for project covers. Tailwind compiles utility CSS
// at build time, so admin-added projects must pick from this list rather
// than free-typed class names — anything else simply wouldn't have CSS.
export const GRADIENT_PRESETS = [
  { id: "indigo", label: "Índigo", classes: "from-indigo-400 via-violet-400 to-purple-500" },
  { id: "teal", label: "Verde azulado", classes: "from-teal-400 via-emerald-400 to-cyan-500" },
  { id: "amber", label: "Ámbar", classes: "from-amber-400 via-orange-400 to-rose-400" },
  { id: "sky", label: "Cielo", classes: "from-sky-400 via-blue-400 to-indigo-500" },
  { id: "rose", label: "Rosa", classes: "from-rose-400 via-pink-400 to-fuchsia-500" },
  { id: "violet", label: "Violeta", classes: "from-violet-400 via-indigo-400 to-blue-500" },
  { id: "emerald", label: "Esmeralda", classes: "from-emerald-400 via-teal-400 to-sky-500" },
  { id: "slate", label: "Grafito", classes: "from-slate-500 via-slate-600 to-slate-800" },
];

export function gradientClasses(id) {
  return GRADIENT_PRESETS.find((g) => g.id === id)?.classes ?? GRADIENT_PRESETS[0].classes;
}
