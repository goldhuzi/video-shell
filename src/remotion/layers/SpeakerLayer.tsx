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
    <div className="render-speaker-identity">
      <div className="render-speaker-avatar">{initials}</div>
      <div className="render-speaker-copy">
        <strong>{name ?? "讲师席位"}</strong>
        <span>{title ?? "身份牌占位"}</span>
      </div>
    </div>
  );
};

const mediaSrc = (asset?: MediaAssetLike): string | null =>
  resolveRemotionAssetSrc(asset?.src);

const positionClassFor = (positionPreset?: string) => {
  if (positionPreset === "bottom-right") {
    return "is-bottom-right";
  }

  if (positionPreset === "in-bottom-hud") {
    return "is-in-bottom-hud";
  }

  return "is-bottom-left";
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

  const positionClass = positionClassFor(effectivePosition);

  return (
    <div className={`render-speaker-card ${positionClass}`}>
      {safeVideoSrc ? (
        <Video
          src={safeVideoSrc}
          muted={muted}
          volume={muted ? 0 : volume}
          onError={() => setVideoFailed(true)}
          className="render-speaker-media"
        />
      ) : safeImageSrc ? (
        <Img
          src={safeImageSrc}
          onError={() => setImageFailed(true)}
          className="render-speaker-media"
        />
      ) : (
        <IdentityPlaceholder name={name} title={title} />
      )}
    </div>
  );
};
