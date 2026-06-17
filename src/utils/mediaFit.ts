import type { CSSProperties } from "react";

export type MediaFitMode = "contain" | "cover" | "fit-width" | "fit-height";

export function normalizeMediaFitMode(fitMode?: string): MediaFitMode {
  const normalized = (fitMode ?? "contain").replace("_", "-");

  if (
    normalized === "cover" ||
    normalized === "fit-width" ||
    normalized === "fit-height"
  ) {
    return normalized;
  }

  return "contain";
}

export function getMediaFitStyle(fitMode?: string): CSSProperties {
  const normalized = normalizeMediaFitMode(fitMode);
  const base: CSSProperties = {
    display: "block",
    flex: "0 0 auto",
    maxWidth: "100%",
    maxHeight: "100%",
  };

  if (normalized === "cover") {
    return {
      ...base,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    };
  }

  if (normalized === "fit-width") {
    return {
      ...base,
      width: "100%",
      height: "auto",
      objectFit: "contain",
    };
  }

  if (normalized === "fit-height") {
    return {
      ...base,
      width: "auto",
      height: "100%",
      objectFit: "contain",
    };
  }

  return {
    ...base,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };
}
