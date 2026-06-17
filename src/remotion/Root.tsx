import { Composition, registerRoot } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import type { LessonProjectConfig } from "../schemas/lesson.schema";
import {
  CourseShellComposition,
  type CourseShellCompositionProps,
  type CourseShellRenderSettings,
} from "./CourseShellComposition";

const WIDTH = 1920;
const HEIGHT = 1080;
const DEFAULT_FPS = 30;
const DEFAULT_DURATION_SECONDS = 60;

const defaultLesson = {
  schemaVersion: "1.0.0",
  meta: {
    projectId: "course-shell-default",
    projectName: "Course Shell Default",
    courseTitle: "视频课程套壳",
    lessonTitle: "时间轴课程 HUD 样片",
    lessonNumber: "Lesson 01",
    lessonIndex: 1,
    totalLessons: 1,
    statusLabel: "MISSION LIVE",
    mainMission: "跑通课程 HUD 渲染链路",
    canvas: {
      width: WIDTH,
      height: HEIGHT,
      fps: DEFAULT_FPS,
    },
  },
  speaker: {
    name: "Course Mentor",
    title: "Instructor",
    role: "Instructor",
    stats: [
      { label: "Mode", value: "Preview" },
    ],
    displayMode: "compact",
    positionPreset: "bottom-left",
  },
  media: {
    mainVideo: {
      id: "missing-main-video",
      kind: "main_video",
      src: "missing-main-video.mp4",
      required: false,
    },
    useSpeakerVideo: false,
    mainVideoFitMode: "contain",
    hudAssets: [],
  },
  layout: {
    aspectRatio: "16:9",
    canvas: { width: WIDTH, height: HEIGHT },
    mainVideoFitMode: "contain",
    topHeader: { visible: true, showCurrentStage: true },
    rightSidebar: { visible: true, displayMode: "full" },
    stageBar: { visible: true, displayMode: "standard" },
    lecturer: { visible: true, positionPreset: "bottom-left" },
    bottomStatusHud: { visible: true },
  },
  stages: [
    {
      id: "stage-brief",
      label: "任务导入",
      name: "任务导入",
      shortName: "导入",
      startTime: 0,
      endTime: 20,
      order: 1,
      enabled: true,
    },
    {
      id: "stage-build",
      label: "关键操作",
      name: "关键操作",
      shortName: "操作",
      startTime: 20,
      endTime: 45,
      order: 2,
      enabled: true,
    },
    {
      id: "stage-review",
      label: "复盘交付",
      name: "复盘交付",
      shortName: "复盘",
      startTime: 45,
      endTime: 60,
      order: 3,
      enabled: true,
    },
  ],
  tasks: [
    { id: "task-1", label: "确认课程目标", title: "确认课程目标", stageId: "stage-brief", order: 1 },
    { id: "task-2", label: "跟随主线完成配置", title: "跟随主线完成配置", stageId: "stage-build", order: 2 },
    { id: "task-3", label: "记录交付检查点", title: "记录交付检查点", stageId: "stage-review", order: 3 },
  ],
  chapterMap: {
    displayMode: "vertical_route",
    nodes: [
      { id: "node-1", label: "导入", stageId: "stage-brief", order: 1 },
      { id: "node-2", label: "操作", stageId: "stage-build", order: 2 },
      { id: "node-3", label: "复盘", stageId: "stage-review", order: 3 },
    ],
  },
  warning: {
    defaultHintId: "hint-default",
    items: [
      {
        id: "hint-default",
        hintType: "key_point",
        title: "渲染占位",
        body: "缺少素材时显示安全占位，不中断 HUD 预览。",
        stageId: "stage-brief",
      },
    ],
  },
  timelineEvents: [],
  render: {
    width: WIDTH,
    height: HEIGHT,
    fps: DEFAULT_FPS,
    format: "mp4",
    outputName: "course-shell-preview.mp4",
    outputDir: "out",
    audioEnabled: true,
    quality: "preview",
  },
} satisfies LessonProjectConfig;

const positiveNumber = (value: unknown): number | undefined => {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : undefined;
};

const fpsFromProps = ({
  lesson,
  render,
}: CourseShellCompositionProps): number => {
  return (
    positiveNumber(render?.fps) ??
    positiveNumber(lesson.render.fps) ??
    positiveNumber(lesson.meta.canvas.fps) ??
    DEFAULT_FPS
  );
};

const durationFromProps = ({
  lesson,
  render,
}: CourseShellCompositionProps): number => {
  const explicitDuration = positiveNumber(render?.durationSeconds);
  if (explicitDuration) {
    return explicitDuration;
  }

  const lessonRenderDuration = Number(
    (lesson.render as { durationSeconds?: unknown }).durationSeconds,
  );
  if (Number.isFinite(lessonRenderDuration) && lessonRenderDuration > 0) {
    return lessonRenderDuration;
  }

  const mainVideoDuration = positiveNumber(lesson.media.mainVideo.duration);
  if (mainVideoDuration) {
    return mainVideoDuration;
  }

  const lastStageTime = Math.max(
    0,
    ...lesson.stages.map((stage) => stage.endTime ?? stage.startTime),
  );
  return lastStageTime > 0 ? lastStageTime : DEFAULT_DURATION_SECONDS;
};

const defaultRender: CourseShellRenderSettings = {
  previewMode: true,
};

const calculateMetadata: CalculateMetadataFunction<CourseShellCompositionProps> = ({
  props,
}) => {
  const compositionProps = {
    lesson: props.lesson ?? defaultLesson,
    render: props.render ?? defaultRender,
    audioMode: props.audioMode,
  } satisfies CourseShellCompositionProps;
  const fps = fpsFromProps(compositionProps);

  return {
    fps,
    width: WIDTH,
    height: HEIGHT,
    durationInFrames: Math.max(
      1,
      Math.ceil(durationFromProps(compositionProps) * fps),
    ),
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="CourseShellComposition"
      component={CourseShellComposition}
      width={WIDTH}
      height={HEIGHT}
      fps={DEFAULT_FPS}
      durationInFrames={DEFAULT_DURATION_SECONDS * DEFAULT_FPS}
      defaultProps={
        { lesson: defaultLesson, render: defaultRender } satisfies CourseShellCompositionProps
      }
      calculateMetadata={calculateMetadata}
    />
  );
};

registerRoot(RemotionRoot);
