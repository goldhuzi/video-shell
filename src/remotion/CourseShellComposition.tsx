import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { LessonProjectConfig } from "../schemas/lesson.schema";
import { deriveHudState } from "../utils/timeline";
import { HudLayer } from "./layers/HudLayer";
import { MainVideoLayer } from "./layers/MainVideoLayer";
import { SpeakerLayer } from "./layers/SpeakerLayer";

export type MediaAssetLike = {
  id?: string;
  kind?: string;
  label?: string;
  src?: string;
  duration?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  required?: boolean;
};

export type LessonProjectConfigLike = {
  schemaVersion?: string;
  project?: {
    id?: string;
    name?: string;
  };
  meta?: {
    projectId?: string;
    projectName?: string;
    courseTitle?: string;
    lessonTitle?: string;
    chapterTitle?: string;
    lessonNumber?: string;
    lessonIndex?: number;
    totalLessons?: number;
    courseCode?: string;
    statusLabel?: string;
    mainMission?: string;
  };
  course?: {
    courseTitle?: string;
    lessonTitle?: string;
    chapterTitle?: string;
    lessonNumber?: string;
    lessonIndex?: number;
    totalLessons?: number;
    courseCode?: string;
    statusLabel?: string;
    mainMission?: string;
  };
  lecturer?: {
    name?: string;
    title?: string;
    displayMode?: "video" | "avatar" | "compact" | "hidden" | string;
    positionPreset?:
      | "bottom-left"
      | "bottom-right"
      | "in-bottom-hud"
      | "hidden"
      | string;
  };
  speaker?: {
    name?: string;
    title?: string;
    useSpeakerVideo?: boolean;
    displayMode?: "video" | "avatar" | "compact" | "hidden" | string;
    positionPreset?:
      | "bottom-left"
      | "bottom-right"
      | "in-bottom-hud"
      | "hidden"
      | string;
  };
  media?: {
    mainVideo?: MediaAssetLike;
    lecturerVideo?: MediaAssetLike;
    lecturerAvatar?: MediaAssetLike;
    speakerVideo?: MediaAssetLike;
    speakerImage?: MediaAssetLike;
    useSpeakerVideo?: boolean;
  };
  layout?: {
    mainVideoFitMode?:
      | "contain"
      | "cover"
      | "fit-width"
      | "fit-height"
      | "fit_width"
      | "fit_height"
      | string;
    topHeader?: { visible?: boolean; showCurrentStage?: boolean };
    rightSidebar?: { visible?: boolean; displayMode?: string };
    stageBar?: { visible?: boolean; displayMode?: string };
    lecturer?: { visible?: boolean; positionPreset?: string };
    bottomStatusHud?: { visible?: boolean };
  };
  theme?: {
    preset?: string;
    accentColor?: "blue" | "cyan" | "purple" | string;
    brandText?: string;
    reducedMotion?: boolean;
  };
  stages?: Array<{
    id: string;
    name: string;
    shortName?: string;
    startTime?: number;
    endTime?: number;
    order?: number;
    enabled?: boolean;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    description?: string;
    stageId?: string;
    order?: number;
    defaultStatus?: string;
  }>;
  map?: {
    displayMode?: string;
    nodes?: Array<{
      id: string;
      label: string;
      stageId?: string;
      skillId?: string;
      order?: number;
      defaultStatus?: string;
    }>;
  };
  chapterMap?: {
    displayMode?: string;
    nodes?: Array<{
      id: string;
      label: string;
      stageId?: string;
      skillId?: string;
      order?: number;
      defaultStatus?: string;
    }>;
  };
  hints?: Array<{
    id: string;
    hintType?: string;
    title: string;
    body: string;
    stageId?: string;
  }>;
  warning?: {
    defaultHintId?: string;
    items?: Array<{
      id: string;
      hintType?: string;
      title: string;
      body: string;
      stageId?: string;
    }>;
  };
  skills?: Array<{
    id: string;
    title: string;
    description?: string;
    stageId?: string;
    mapNodeId?: string;
  }>;
  timelineEvents?: Array<Record<string, unknown>>;
  render?: {
    width?: number;
    height?: number;
    fps?: number;
    outputFileName?: string;
    outputDir?: string;
    durationSeconds?: number;
  };
};

export type CourseShellCompositionProps = {
  lesson: LessonProjectConfig;
};

export const CourseShellComposition = ({
  lesson,
}: CourseShellCompositionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;
  const hudState = deriveHudState(lesson, currentTime);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 32% 18%, rgba(45, 113, 255, 0.18), transparent 28%), linear-gradient(135deg, #07101b 0%, #101521 52%, #07090f 100%)",
        color: "#edf7ff",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        overflow: "hidden",
      }}
    >
      <MainVideoLayer
        fitMode={lesson.layout?.mainVideoFitMode ?? "contain"}
        mainVideo={lesson.media?.mainVideo}
      />
      <SpeakerLayer
        media={lesson.media}
        speaker={lesson.speaker}
      />
      <HudLayer lesson={lesson} hudState={hudState} currentTime={currentTime} />
    </AbsoluteFill>
  );
};
