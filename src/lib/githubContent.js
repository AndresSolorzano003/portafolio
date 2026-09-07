import { CONTENT_API_URL, GITHUB_OWNER, GITHUB_REPO, CONTENT_BRANCH } from "../config/site";

function toBase64Utf8(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64Utf8(b64) {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
}

async function githubRequest(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error de GitHub (${res.status})`);
  }
  return res.json();
}

export async function verifyToken(token) {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error("Token inválido o sin permisos.");
  return res.json();
}

export async function fetchRemoteContent(token) {
  const data = await githubRequest(CONTENT_API_URL, token);
  const content = JSON.parse(fromBase64Utf8(data.content));
  return { content, sha: data.sha };
}

export async function commitContent(token, content, sha, message) {
  const data = await githubRequest(CONTENT_API_URL, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: toBase64Utf8(JSON.stringify(content, null, 2)),
      sha,
    }),
  });
  return data.content.sha;
}

// Uploads an already-base64-encoded image as a brand-new file under
// public/uploads/ and returns the raw.githubusercontent.com URL to store
// on the project. Each upload uses a unique filename, so no sha lookup is
// needed (it's always a create, never an overwrite).
export async function uploadImage(token, filename, base64Content) {
  const path = `public/uploads/${filename}`;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  await githubRequest(url, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Subir imagen ${filename}`,
      content: base64Content,
    }),
  });
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${CONTENT_BRANCH}/${path}`;
}
