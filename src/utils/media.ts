import { staticFile } from "remotion";

const externalSrcPattern = /^(https?:|file:|data:|blob:)/i;
const windowsAbsolutePathPattern = /^[a-zA-Z]:\//;
const publicAssetPathPattern = /^(\/?(input|assets|fonts)\/|public\/)/;

export function normalizeMediaSrc(src?: string): string | null {
  if (!src || src.trim().length === 0) {
    return null;
  }

  return src.trim().replace(/\\/g, "/");
}

export function isExternalMediaSrc(src: string): boolean {
  return externalSrcPattern.test(src);
}

export function toPublicAssetPath(src?: string): string | null {
  const normalized = normalizeMediaSrc(src);
  if (!normalized || isExternalMediaSrc(normalized)) {
    return null;
  }

  const publicIndex = normalized.indexOf("/public/");
  if (publicIndex >= 0) {
    return normalized.slice(publicIndex + "/public/".length);
  }

  if (normalized.startsWith("public/")) {
    return normalized.slice("public/".length);
  }

  if (windowsAbsolutePathPattern.test(normalized)) {
    return null;
  }

  if (!publicAssetPathPattern.test(normalized)) {
    return null;
  }

  return normalized.replace(/^\/+/, "").replace(/^\.?\//, "");
}

export function resolveRemotionPublicAssetSrc(src?: string): string | null {
  const publicPath = toPublicAssetPath(src);
  if (!publicPath) {
    return null;
  }

  if (isExternalMediaSrc(publicPath)) {
    return publicPath;
  }

  return staticFile(publicPath);
}

export function resolveBrowserPublicAssetSrc(src?: string): string | null {
  const publicPath = toPublicAssetPath(src);
  if (!publicPath) {
    return null;
  }

  if (isExternalMediaSrc(publicPath)) {
    return publicPath;
  }

  return `/${publicPath}`;
}
