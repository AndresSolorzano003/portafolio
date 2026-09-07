import { CONTENT_API_URL } from "../config/site";

function toBase64Utf8(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64Utf8(b64) {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g, ""))));
}

async function githubRequest(token, options = {}) {
  const res = await fetch(CONTENT_API_URL, {
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
  const data = await githubRequest(token);
  const content = JSON.parse(fromBase64Utf8(data.content));
  return { content, sha: data.sha };
}

export async function commitContent(token, content, sha, message) {
  const data = await githubRequest(token, {
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
