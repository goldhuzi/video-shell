import { existsSync } from "node:fs";
import path from "node:path";

export const rootDir = process.cwd();
export const publicDir = path.join(rootDir, "public");
export const lessonsDir = path.join(rootDir, "src", "data", "lessons");

export type ResolvedPublicAssetPath = {
  originalSrc: string;
  normalizedSrc: string;
  relativeToPublic?: string;
  absolutePath?: string;
  exists: boolean;
  isRemote: boolean;
  isPublicPath: boolean;
  error?: string;
  suggestion?: string;
};

const normalizeSlashes = (value: string): string => value.replace(/\\/g, "/");

export const isRemoteAssetSrc = (src: string): boolean =>
  /^(https?:|data:|blob:|file:)/i.test(src.trim());

export const isPathInside = (parentDir: string, childPath: string): boolean => {
  const relative = path.relative(parentDir, childPath);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const resolveRelativeToPublic = (normalizedSrc: string): string | null => {
  if (normalizedSrc.startsWith("/input/")) {
    return normalizedSrc.slice(1);
  }

  if (normalizedSrc.startsWith("/assets/")) {
    return normalizedSrc.slice(1);
  }

  if (normalizedSrc.startsWith("/fonts/")) {
    return normalizedSrc.slice(1);
  }

  if (normalizedSrc.startsWith("public/")) {
    return normalizedSrc.slice("public/".length);
  }

  if (normalizedSrc.startsWith("input/") || normalizedSrc.startsWith("assets/") || normalizedSrc.startsWith("fonts/")) {
    return normalizedSrc;
  }

  const publicIndex = normalizedSrc.indexOf("/public/");
  if (publicIndex >= 0) {
    return normalizedSrc.slice(publicIndex + "/public/".length);
  }

  return null;
};

export const resolvePublicAssetPath = (src?: string): ResolvedPublicAssetPath => {
  const originalSrc = src ?? "";
  const normalizedSrc = normalizeSlashes(originalSrc.trim());

  if (!normalizedSrc) {
    return {
      originalSrc,
      normalizedSrc,
      exists: false,
      isRemote: false,
      isPublicPath: false,
      error: "素材路径为空。",
      suggestion: "请在 lesson 配置中填写以 /input/... 开头的素材路径。",
    };
  }

  if (isRemoteAssetSrc(normalizedSrc)) {
    return {
      originalSrc,
      normalizedSrc,
      exists: false,
      isRemote: true,
      isPublicPath: false,
      error: "第 6 阶段只支持本地 public/input 素材，不支持远程 URL、file:、data: 或 blob:。",
      suggestion: "请把素材放入 public/input 下，并在配置中使用 /input/... 路径。",
    };
  }

  if (/^[a-zA-Z]:\//.test(normalizedSrc)) {
    return {
      originalSrc,
      normalizedSrc,
      exists: false,
      isRemote: false,
      isPublicPath: false,
      error: "素材路径不应写成本机绝对路径。",
      suggestion: "请把素材放入 public/input 下，并改成类似 /input/videos/lesson-01-main.mp4 的路径。",
    };
  }

  const relativeToPublic = resolveRelativeToPublic(normalizedSrc);
  if (!relativeToPublic) {
    return {
      originalSrc,
      normalizedSrc,
      exists: false,
      isRemote: false,
      isPublicPath: false,
      error: "素材路径不符合 public 路径规范。",
      suggestion: "推荐使用 /input/videos/...、/input/speakers/... 或 /input/images/...。",
    };
  }

  const absolutePath = path.resolve(publicDir, relativeToPublic);
  if (!isPathInside(publicDir, absolutePath) && absolutePath !== publicDir) {
    return {
      originalSrc,
      normalizedSrc,
      relativeToPublic,
      absolutePath,
      exists: false,
      isRemote: false,
      isPublicPath: false,
      error: "素材路径解析后越过了 public 目录。",
      suggestion: "请移除 .. 等路径跳转，只引用 public/input 内的文件。",
    };
  }

  return {
    originalSrc,
    normalizedSrc,
    relativeToPublic,
    absolutePath,
    exists: existsSync(absolutePath),
    isRemote: false,
    isPublicPath: true,
  };
};

export const lessonPathForId = (lessonId: string): string =>
  path.join(lessonsDir, `${lessonId}.json`);

