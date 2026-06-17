import { useEffect, useMemo, useRef, useState } from "react";
import { continueRender, delayRender, Video } from "remotion";
import type { MediaAssetLike } from "../CourseShellComposition";
import { resolveRemotionPublicAssetSrc } from "../../utils/media";
import { getMediaFitStyle } from "../../utils/mediaFit";

type MainVideoLayerProps = {
  mainVideo?: MediaAssetLike;
  fitMode?: string;
  muted?: boolean;
  volume?: number;
};

type AssetStatus = "checking" | "available" | "missing";

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
    <div className="render-main-video-placeholder">
      <div>
        <span>MAIN VIDEO SOURCE</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
};

export const MainVideoLayer = ({
  mainVideo,
  fitMode = "contain",
  muted = false,
  volume = 1,
}: MainVideoLayerProps) => {
  const [failed, setFailed] = useState(false);
  const src = useMemo(
    () => resolveRemotionPublicAssetSrc(mainVideo?.src),
    [mainVideo?.src],
  );
  const assetStatus = useAssetStatus(src);
  const videoStyle = getMediaFitStyle(fitMode);

  return (
    <div className="render-main-video-frame">
      {src && assetStatus === "available" && !failed ? (
        <div className="render-main-video-content">
          <Video
            src={src}
            muted={muted}
            volume={muted ? 0 : volume}
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
    </div>
  );
};

export const resolveRemotionAssetSrc = resolveRemotionPublicAssetSrc;
