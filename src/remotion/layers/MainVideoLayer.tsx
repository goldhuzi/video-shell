import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  staticFile,
  Video,
} from "remotion";
import type { MediaAssetLike } from "../CourseShellComposition";

type MainVideoLayerProps = {
  mainVideo?: MediaAssetLike;
  fitMode?: string;
};

type AssetStatus = "checking" | "available" | "missing";

const resolveAssetSrc = (src?: string): string | null => {
  if (!src || src.trim().length === 0) {
    return null;
  }

  const normalized = src.trim().replace(/\\/g, "/");

  if (/^(https?:|file:|data:|blob:)/i.test(normalized)) {
    return normalized;
  }

  const publicIndex = normalized.indexOf("/public/");
  if (publicIndex >= 0) {
    return staticFile(normalized.slice(publicIndex + "/public/".length));
  }

  if (normalized.startsWith("public/")) {
    return staticFile(normalized.slice("public/".length));
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  return staticFile(normalized.replace(/^\.?\//, ""));
};

const fitStyleFor = (fitMode?: string): CSSProperties => {
  const normalized = (fitMode ?? "contain").replace("_", "-");

  if (normalized === "cover") {
    return { width: "100%", height: "100%", objectFit: "cover" };
  }

  if (normalized === "fit-width") {
    return { width: "100%", height: "auto", objectFit: "contain" };
  }

  if (normalized === "fit-height") {
    return { width: "auto", height: "100%", objectFit: "contain" };
  }

  return { width: "100%", height: "100%", objectFit: "contain" };
};

export const useAssetStatus = (src: string | null): AssetStatus => {
  const [status, setStatus] = useState<AssetStatus>(
    src ? "checking" : "missing",
  );
  const renderHandle = useMemo(
    () =>
      src
        ? delayRender(`Checking media asset ${src}`, {
            timeoutInMilliseconds: 5000,
          })
        : null,
    [src],
  );
  const continued = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const finish = (nextStatus: AssetStatus) => {
      if (!cancelled) {
        setStatus(nextStatus);
      }

      if (renderHandle !== null && !continued.current) {
        continued.current = true;
        continueRender(renderHandle);
      }
    };

    if (!src) {
      finish("missing");
      return;
    }

    if (/^(data:|blob:|file:)/i.test(src)) {
      finish("available");
      return;
    }

    fetch(src, { method: "HEAD" })
      .then((response) => {
        finish(response.ok ? "available" : "missing");
      })
      .catch(() => {
        finish(/^https?:/i.test(src) ? "available" : "missing");
      });

    return () => {
      cancelled = true;
      if (renderHandle !== null && !continued.current) {
        continued.current = true;
        continueRender(renderHandle);
      }
    };
  }, [renderHandle, src]);

  return status;
};

const Placeholder = ({ label }: { label: string }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, rgba(21, 36, 55, 0.95), rgba(6, 10, 18, 0.96))",
        color: "rgba(227, 244, 255, 0.82)",
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: 0,
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 18, color: "rgba(125, 219, 255, 0.82)" }}>
          MAIN VIDEO SOURCE
        </div>
        <div style={{ marginTop: 12 }}>{label}</div>
      </div>
    </div>
  );
};

export const MainVideoLayer = ({
  mainVideo,
  fitMode = "contain",
}: MainVideoLayerProps) => {
  const [failed, setFailed] = useState(false);
  const src = useMemo(() => resolveAssetSrc(mainVideo?.src), [mainVideo?.src]);
  const assetStatus = useAssetStatus(src);
  const videoStyle = fitStyleFor(fitMode);

  return (
    <AbsoluteFill
      style={{
        left: 24,
        top: 92,
        width: 1392,
        height: 780,
        border: "1px solid rgba(116, 205, 255, 0.36)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.05) inset, 0 18px 60px rgba(0,0,0,0.38)",
        overflow: "hidden",
        background: "#050910",
      }}
    >
      {src && assetStatus === "available" && !failed ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#02050a",
          }}
        >
          <Video
            src={src}
            onError={() => setFailed(true)}
            style={videoStyle}
          />
        </div>
      ) : (
        <Placeholder
          label={
            failed
              ? "素材加载失败，已切换为占位画面"
              : assetStatus === "checking"
                ? "正在检查主课程视频路径"
              : "未配置主课程视频，显示占位画面"
          }
        />
      )}
    </AbsoluteFill>
  );
};

export const resolveRemotionAssetSrc = resolveAssetSrc;
