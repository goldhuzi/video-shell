import { Composition, registerRoot } from "remotion";
import type { LessonProjectConfig } from "../schemas/lesson.schema";
import { CourseShellComposition } from "./CourseShellComposition";

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
      name: "任务导入",
      shortName: "导入",
      startTime: 0,
      endTime: 20,
      order: 1,
      enabled: true,
    },
    {
      id: "stage-build",
      name: "关键操作",
      shortName: "操作",
      startTime: 20,
      endTime: 45,
      order: 2,
      enabled: true,
    },
    {
      id: "stage-review",
      name: "复盘交付",
      shortName: "复盘",
      startTime: 45,
      endTime: 60,
      order: 3,
      enabled: true,
    },
  ],
  tasks: [
    { id: "task-1", title: "确认课程目标", stageId: "stage-brief", order: 1 },
    { id: "task-2", title: "跟随主线完成配置", stageId: "stage-build", order: 2 },
    { id: "task-3", title: "记录交付检查点", stageId: "stage-review", order: 3 },
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
    outputName: "lesson-01-sample.mp4",
    outputDir: "out",
    audioEnabled: true,
    quality: "preview",
  },
} satisfies LessonProjectConfig;

const durationFromLesson = (lesson: LessonProjectConfig): number => {
  const renderDuration = Number(
    (lesson.render as { durationSeconds?: unknown }).durationSeconds,
  );
  if (Number.isFinite(renderDuration) && renderDuration > 0) {
    return renderDuration;
  }

  return DEFAULT_DURATION_SECONDS;
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
      defaultProps={{ lesson: defaultLesson }}
      calculateMetadata={({ props }) => {
        const lesson = (props.lesson ?? defaultLesson) as LessonProjectConfig;
        const fps =
          lesson.render.fps === 60 || lesson.render.fps === 30
            ? lesson.render.fps
            : DEFAULT_FPS;

        return {
          fps,
          width: WIDTH,
          height: HEIGHT,
          durationInFrames: Math.max(
            1,
            Math.ceil(durationFromLesson(lesson) * fps),
          ),
        };
      }}
    />
  );
};

registerRoot(RemotionRoot);
