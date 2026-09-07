// ─────────────────────────────────────────────────────────────
//  Contenido editable del portafolio.
//  Cambia los textos, links y proyectos aquí sin tocar los
//  componentes visuales.
// ─────────────────────────────────────────────────────────────
import profilePhoto from "../assets/profile.jpg";

export const profile = {
  name: "Andrés Solórzano Suárez",
  roleTag: "Datos",
  location: "Medellín, Colombia",
  email: "cfandres47@gmail.com",
  photo: profilePhoto,
  heroTags: ["Análisis de Datos", "BI", "Excel", "Python", "IA"],
  heroDescription:
    "Un portafolio impulsado por mi fascinación por los datos: tableros en Power BI, reportes en Excel y automatizaciones diseñadas para optimizar el rendimiento comercial y operativo.",
  social: {
    linkedin: "https://www.linkedin.com/in/andress18/",
    github: "https://github.com/AndresSolorzano003",
    instagram: "https://www.instagram.com/andres__s18/",
  },
};

export const stats = [
  { value: 7, suffix: "+", label: "Proyectos" },
  { value: 8, suffix: "", label: "Herramientas" },
];

export const about = {
  kicker: "Sobre mí",
  title: "La curiosidad es mi herramienta favorita",
  paragraphs: [
    "Soy Andrés, analista de datos con base en Medellín. Disfruto tomar información dispersa — hojas de cálculo, bases de datos, formularios — y convertirla en tableros claros que una persona pueda leer en diez segundos y usar para decidir.",
    "Me formé combinando Excel avanzado, Power BI y Python, y hoy exploro cómo la inteligencia artificial puede acelerar ese proceso: desde limpiar datos hasta generar hallazgos automáticamente.",
    "Fuera de las pantallas, me mueve la misma curiosidad: preguntar 'por qué' una vez más de lo normal, hasta encontrar el patrón que nadie había visto.",
  ],
  highlights: [
    { label: "Enfoque", value: "Datos → decisiones" },
    { label: "Ubicación", value: "Medellín, Colombia" },
    { label: "Disponibilidad", value: "Proyectos freelance" },
    { label: "Idiomas", value: "Español, Inglés" },
  ],
};

export const softSkills = [
  {
    icon: "Brain",
    title: "Pensamiento analítico",
    desc: "Descompongo problemas complejos en preguntas simples que los datos pueden responder.",
  },
  {
    icon: "Users",
    title: "Trabajo en equipo",
    desc: "Traduzco entre áreas técnicas y de negocio para que todos entiendan el mismo tablero.",
  },
  {
    icon: "MessageCircle",
    title: "Comunicación clara",
    desc: "Un buen dato mal explicado no sirve: cuento la historia detrás de cada gráfico.",
  },
  {
    icon: "Puzzle",
    title: "Resolución de problemas",
    desc: "Disfruto encontrar el camino más simple entre datos sucios y un reporte confiable.",
  },
  {
    icon: "Eye",
    title: "Atención al detalle",
    desc: "Reviso cada cifra dos veces: la confianza en un tablero se rompe con un solo error.",
  },
  {
    icon: "Sparkles",
    title: "Curiosidad constante",
    desc: "Siempre estoy probando una herramienta, un modelo o una visualización nueva.",
  },
];

// `techSkills` y `projects` son el contenido por defecto: se usan mientras
// carga el contenido remoto y como respaldo si la carga falla. El panel de
// administración (ver Footer) sobrescribe estas listas editando
// `content.json` directamente en GitHub — ver src/hooks/useSiteContent.js.
export const techSkills = [
  { name: "Power BI", level: 90, category: "BI" },
  { name: "Excel Avanzado", level: 95, category: "Ofimática" },
  { name: "Python", level: 75, category: "Programación" },
  { name: "SQL", level: 80, category: "Datos" },
  { name: "DAX", level: 70, category: "BI" },
  { name: "IA Generativa", level: 85, category: "Automatización" },
  { name: "Looker Studio", level: 65, category: "BI" },
  { name: "Google Sheets / Apps Script", level: 72, category: "Automatización" },
  { name: "Seguridad de Datos", level: 68, category: "Seguridad" },
];

// Cada proyecto usa un degradado como portada mientras no tenga imagen
// propia (o `image` con una URL subida desde el panel de administración).
export const projects = [
  {
    title: "Automatización de Reportes",
    description:
      "Macro en Excel + Apps Script que genera y envía reportes semanales sin intervención manual.",
    longDescription: "",
    tags: ["Excel", "Apps Script", "Automatización"],
    gradient: "from-teal-400 via-emerald-400 to-cyan-500",
    image: "",
    videoUrl: "",
    link: "#",
  },
  {
    title: "Predicción de Demanda",
    description:
      "Modelo simple en Python para anticipar quiebres de inventario a partir de históricos de venta.",
    longDescription: "",
    tags: ["Python", "Pandas", "IA"],
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    image: "",
    videoUrl: "",
    link: "#",
  },
  {
    title: "Panel de Indicadores Comerciales",
    description:
      "KPIs comerciales en tiempo real conectados a la base de datos operativa vía consultas SQL.",
    longDescription: "",
    tags: ["SQL", "Power BI", "KPIs"],
    gradient: "from-sky-400 via-blue-400 to-indigo-500",
    image: "",
    videoUrl: "",
    link: "#",
  },
  {
    title: "Encuestas + Análisis de Satisfacción",
    description:
      "Formulario de recolección de datos con limpieza automática y visualización de resultados.",
    longDescription: "",
    tags: ["Google Forms", "Python", "Visualización"],
    gradient: "from-rose-400 via-pink-400 to-fuchsia-500",
    image: "",
    videoUrl: "",
    link: "#",
  },
  {
    title: "Asistente de Datos con IA",
    description:
      "Prototipo que usa IA generativa para responder preguntas de negocio directamente sobre un dataset.",
    longDescription: "",
    tags: ["IA", "Python", "Prompting"],
    gradient: "from-violet-400 via-indigo-400 to-blue-500",
    image: "",
    videoUrl: "",
    link: "#",
  },
  {
    title: "Optimización de Inventario",
    description:
      "Análisis exploratorio que identificó productos de bajo rendimiento y ahorró costos de bodegaje.",
    longDescription: "",
    tags: ["Excel", "SQL", "Análisis"],
    gradient: "from-emerald-400 via-teal-400 to-sky-500",
    image: "",
    videoUrl: "",
    link: "#",
  },
];

export const nav = [
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Habilidades", href: "#habilidades" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Contacto", href: "#contacto" },
];
