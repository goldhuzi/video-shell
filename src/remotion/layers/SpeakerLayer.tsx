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

export const SpeakerLayer = ({
  lecturer,
  speaker,
  media,
}: SpeakerLayerProps) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const name = speaker?.name ?? lecturer?.name;
  const title = speaker?.title ?? lecturer?.title;
  const useSpeakerVideo =
    speaker?.useSpeakerVideo ??
    media?.useSpeakerVideo ??
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
      videoSrc &&
      videoStatus === "available" &&
      !videoFailed,
  );
  const shouldUseImage = Boolean(
    imageSrc && imageStatus === "available" && !imageFailed,
  );
  const safeVideoSrc = shouldUseVideo && videoSrc ? videoSrc : undefined;
  const safeImageSrc = shouldUseImage && imageSrc ? imageSrc : undefined;

  if (
    speaker?.displayMode === "hidden" ||
    lecturer?.displayMode === "hidden" ||
    speaker?.positionPreset === "hidden" ||
    lecturer?.positionPreset === "hidden"
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 940,
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
          muted
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
