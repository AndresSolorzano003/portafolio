const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
export const MAX_FILE_SIZE_MB = 8;

// Downscales/compresses an image file in the browser before it's committed
// to the repo, so the site stays fast and the repo doesn't bloat with
// full-resolution phone photos.
export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo debe ser una imagen."));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      reject(new Error(`La imagen no debe superar ${MAX_FILE_SIZE_MB}MB.`));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      resolve(dataUrl.split(",")[1]); // base64 payload only
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    img.src = url;
  });
}

export function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}
