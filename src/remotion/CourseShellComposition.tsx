import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { LessonProjectConfig } from "../schemas/lesson.schema";
import { deriveHudState } from "../utils/timeline";
import { HudLayer } from "./layers/HudLayer";
import { MainVideoLayer } from "./layers/MainVideoLayer";
import { SpeakerLayer } from "./layers/SpeakerLayer";
import "../styles/tokens.css";
import "../styles/hud.css";

export type CourseShellAudioMode =
  | "main-only"
  | "speaker-only"
  | "mix"
  | "mute-all";

export type CourseShellRenderSettings = {
  fps?: number;
  durationSeconds?: number;
  audioMode?: CourseShellAudioMode;
  mainVolume?: number;
  speakerVolume?: number;
  previewMode?: boolean;
};

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
    role?: string;
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
    role?: string;
    stats?: Array<{ label: string; value: string }>;
    useSpeakerVideo?: boolean;
    displayMode?: "video" | "avatar" | "compact" | "hidden" | string;
    positionPreset?:
      | "bottom-left"
      | "bottom-right"
      | "in-bottom-hud"
      | "hidden"
      | string;
    assetPriority?: Array<"video" | "avatar" | "identity_card" | "hidden" | string>;
    missingAssetBehavior?:
      | "block_render"
      | "fallback_to_avatar"
      | "fallback_to_identity_card"
      | "hide"
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
    showTopHeader?: boolean;
    showRightPanel?: boolean;
    showBottomHud?: boolean;
    showLecturerCard?: boolean;
    showCourseStageBar?: boolean;
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
    label?: string;
    name: string;
    shortName?: string;
    startTime?: number;
    endTime?: number;
    order?: number;
    enabled?: boolean;
  }>;
  tasks?: Array<{
    id: string;
    label?: string;
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
    audioEnabled?: boolean;
  };
};

export type CourseShellCompositionProps = {
  lesson: LessonProjectConfig;
  render?: CourseShellRenderSettings;
  audioMode?: CourseShellAudioMode;
};

const audioModes = new Set<CourseShellAudioMode>([
  "main-only",
  "speaker-only",
  "mix",
  "mute-all",
]);

const toAudioMode = (value: unknown): CourseShellAudioMode | undefined => {
  return typeof value === "string" && audioModes.has(value as CourseShellAudioMode)
    ? (value as CourseShellAudioMode)
    : undefined;
};

const getLessonAudioMode = (
  lesson: LessonProjectConfig,
): CourseShellAudioMode | undefined => {
  return toAudioMode((lesson as unknown as { audio?: { mode?: unknown } }).audio?.mode);
};

const resolveAudioMode = ({
  audioMode,
  lesson,
  render,
}: CourseShellCompositionProps): CourseShellAudioMode => {
  const explicitMode =
    toAudioMode(audioMode) ?? toAudioMode(render?.audioMode) ?? getLessonAudioMode(lesson);

  if (explicitMode) {
    return explicitMode;
  }

  return lesson.render.audioEnabled === false ? "mute-all" : "main-only";
};

const clampVolume = (value: unknown, fallback: number): number => {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
};

export const CourseShellComposition = ({
  audioMode,
  lesson,
  render,
}: CourseShellCompositionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;
  const hudState = deriveHudState(lesson, currentTime);
  const resolvedAudioMode = resolveAudioMode({ audioMode, lesson, render });
  const mainVideoMuted =
    resolvedAudioMode === "speaker-only" || resolvedAudioMode === "mute-all";
  const speakerMuted =
    resolvedAudioMode === "main-only" || resolvedAudioMode === "mute-all";
  const forceSpeakerVideo =
    resolvedAudioMode === "speaker-only" || resolvedAudioMode === "mix";
  const mainVideoFitMode =
    lesson.layout?.mainVideoFitMode ?? lesson.media?.mainVideoFitMode ?? "contain";

  return (
    <AbsoluteFill
      className="course-shell-render theme-default-ai-tactical is-render-mode"
    >
      <MainVideoLayer
        fitMode={mainVideoFitMode}
        mainVideo={lesson.media?.mainVideo}
        muted={mainVideoMuted}
        volume={clampVolume(render?.mainVolume, 1)}
      />
      <SpeakerLayer
        forceSpeakerVideo={forceSpeakerVideo}
        muted={speakerMuted}
        volume={clampVolume(render?.speakerVolume, 1)}
        media={lesson.media}
        positionPreset={lesson.layout?.lecturer?.positionPreset}
        speaker={lesson.speaker}
        visible={
          lesson.layout?.lecturer?.visible !== false &&
          lesson.layout?.showLecturerCard !== false
        }
      />
      <HudLayer lesson={lesson} hudState={hudState} currentTime={currentTime} />
    </AbsoluteFill>
  );
};
