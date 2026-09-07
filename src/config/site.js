// Dónde vive el contenido editable (proyectos y herramientas).
// El panel de administración escribe aquí vía la API de GitHub;
// el sitio público lo lee directamente de raw.githubusercontent.com.
export const GITHUB_OWNER = "AndresSolorzano003";
export const GITHUB_REPO = "portafolio";
export const CONTENT_BRANCH = "main";
export const CONTENT_PATH = "content.json";

export const CONTENT_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${CONTENT_BRANCH}/${CONTENT_PATH}`;
export const CONTENT_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`;
