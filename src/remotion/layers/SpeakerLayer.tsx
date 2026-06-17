import { useMemo, useState } from "react";
import { Img, Video } from "remotion";
import type {
  LessonProjectConfigLike,
  MediaAssetLike,
} from "../CourseShellComposition";
import { resolveRemotionAssetSrc, useAssetStatus } from "./MainVideoLayer";

type SpeakerLayerProps = {
  lecturer?: LessonProjectConfigLike["lecturer"];
  speaker?: LessonProjectConfigLike["speaker"];
  media?: LessonProjectConfigLike["media"];
  forceSpeakerVideo?: boolean;
  visible?: boolean;
  positionPreset?: string;
  muted?: boolean;
  volume?: number;
};

const IdentityPlaceholder = ({
  name,
  title,
}: {
  name?: string;
  title?: string;
}) => {
  const initials = (name ?? "讲师")
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: 14,
        background:
          "linear-gradient(135deg, rgba(13, 29, 46, 0.98), rgba(17, 18, 30, 0.98))",
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(123, 223, 255, 0.44)",
          color: "#7de8ff",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#eefaff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 138,
          }}
        >
          {name ?? "讲师席位"}
        </div>
        <div
          style={{
            marginTop: 5,
            fontSize: 13,
            color: "rgba(171, 222, 255, 0.72)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 138,
          }}
        >
          {title ?? "身份牌占位"}
        </div>
      </div>
    </div>
  );
};

const mediaSrc = (asset?: MediaAssetLike): string | null =>
  resolveRemotionAssetSrc(asset?.src);

const positionStyleFor = (positionPreset?: string) => {
  if (positionPreset === "bottom-right") {
    return { left: 1152, top: 940 };
  }

  if (positionPreset === "in-bottom-hud") {
    return { left: 304, top: 940 };
  }

  return { left: 24, top: 940 };
};

export const SpeakerLayer = ({
  forceSpeakerVideo = false,
  lecturer,
  speaker,
  media,
  visible = true,
  positionPreset,
  muted = true,
  volume = 1,
}: SpeakerLayerProps) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const name = speaker?.name ?? lecturer?.name;
  const title = speaker?.role ?? speaker?.title ?? lecturer?.role ?? lecturer?.title;
  const assetPriority = speaker?.assetPriority ?? [
    "video",
    "avatar",
    "identity_card",
    "hidden",
  ];
  const missingAssetBehavior =
    speaker?.missingAssetBehavior ?? "fallback_to_identity_card";
  const effectivePosition =
    positionPreset ?? speaker?.positionPreset ?? lecturer?.positionPreset;
  const useSpeakerVideo =
    forceSpeakerVideo ||
    speaker?.useSpeakerVideo ||
    media?.useSpeakerVideo ||
    (speaker?.displayMode === "video" || lecturer?.displayMode === "video");

  const videoSrc = useMemo(
    () => mediaSrc(media?.speakerVideo ?? media?.lecturerVideo),
    [media?.lecturerVideo, media?.speakerVideo],
  );
  const imageSrc = useMemo(
    () => mediaSrc(media?.speakerImage ?? media?.lecturerAvatar),
    [media?.lecturerAvatar, media?.speakerImage],
  );
  const videoStatus = useAssetStatus(useSpeakerVideo ? videoSrc : null);
  const imageStatus = useAssetStatus(imageSrc);

  const shouldUseVideo = Boolean(
    useSpeakerVideo &&
      (forceSpeakerVideo || assetPriority.includes("video")) &&
      videoSrc &&
      videoStatus === "available" &&
      !videoFailed,
  );
  const shouldUseImage = Boolean(
    !forceSpeakerVideo &&
      assetPriority.includes("avatar") &&
      imageSrc &&
      imageStatus === "available" &&
      !imageFailed,
  );
  const safeVideoSrc = shouldUseVideo && videoSrc ? videoSrc : undefined;
  const safeImageSrc = shouldUseImage && imageSrc ? imageSrc : undefined;
  const shouldHideForMissingVideo =
    useSpeakerVideo && !safeVideoSrc && missingAssetBehavior === "hide";
  const shouldHideForMissingImage =
    !useSpeakerVideo &&
    !safeImageSrc &&
    (speaker?.displayMode === "avatar" || speaker?.displayMode === "compact") &&
    missingAssetBehavior === "hide";
  const canShowIdentityCard = assetPriority.includes("identity_card");

  const isVisuallyHidden =
    !visible ||
    speaker?.displayMode === "hidden" ||
    lecturer?.displayMode === "hidden" ||
    effectivePosition === "hidden";

  if (forceSpeakerVideo && safeVideoSrc && isVisuallyHidden) {
    return (
      <Video
        src={safeVideoSrc}
        muted={muted}
        volume={muted ? 0 : volume}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (
    isVisuallyHidden ||
    shouldHideForMissingVideo ||
    shouldHideForMissingImage ||
    (!safeVideoSrc && !safeImageSrc && !canShowIdentityCard)
  ) {
    return null;
  }

  const positionStyle = positionStyleFor(effectivePosition);

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        width: 260,
        height: 112,
        border: "1px solid rgba(125, 219, 255, 0.42)",
        background: "rgba(5, 10, 18, 0.9)",
        overflow: "hidden",
        boxShadow: "0 14px 32px rgba(0,0,0,0.35)",
      }}
    >
      {safeVideoSrc ? (
        <Video
          src={safeVideoSrc}
          muted={muted}
          volume={muted ? 0 : volume}
          onError={() => setVideoFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : safeImageSrc ? (
        <Img
          src={safeImageSrc}
          onError={() => setImageFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <IdentityPlaceholder name={name} title={title} />
      )}
    </div>
  );
};
