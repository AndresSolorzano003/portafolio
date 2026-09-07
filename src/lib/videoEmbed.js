// Only YouTube, Vimeo, or direct video files are accepted for the project
// detail video — this keeps the admin from ever writing an arbitrary
// iframe src into the site (defense in depth, even though only the owner
// holds the token that can set it).
const YOUTUBE_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/;
const VIMEO_RE = /vimeo\.com\/(?:video\/)?(\d+)/;
const DIRECT_VIDEO_RE = /\.(mp4|webm|ogg)(\?.*)?$/i;

export function validateVideoUrl(url) {
  if (!url) return true;
  return YOUTUBE_RE.test(url) || VIMEO_RE.test(url) || DIRECT_VIDEO_RE.test(url);
}

// Returns { type: 'youtube' | 'vimeo' | 'direct', src } or null if invalid.
export function resolveVideo(url) {
  if (!url) return null;

  const yt = url.match(YOUTUBE_RE);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };

  const vimeo = url.match(VIMEO_RE);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };

  if (DIRECT_VIDEO_RE.test(url)) return { type: "direct", src: url };

  return null;
}
