import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { runRenderPreflight } from "./preflight-render";
import { rootDir } from "./media-paths";

const tempLessonId = "preflight-render-test";
const tempLessonPath = path.join(
  rootDir,
  "src",
  "data",
  "lessons",
  `${tempLessonId}.json`,
);
const tempMainVideoPath = path.join(
  rootDir,
  "public",
  "input",
  "videos",
  "preflight-render-test-main.mp4",
);

const fixtureLesson = {
  schemaVersion: "1.0.0",
  meta: {
    projectId: "preflight-render-test",
    projectName: "Preflight Render Test",
    courseTitle: "预检测试课程",
    lessonTitle: "混音素材测试",
    lessonIndex: 1,
    totalLessons: 1,
    canvas: {
      width: 1920,
      height: 1080,
      fps: 30,
    },
  },
  media: {
    mainVideo: {
      id: "main",
      kind: "main_video",
      label: "Main",
      src: "/input/videos/preflight-render-test-main.mp4",
      duration: 1,
      required: true,
    },
    speakerVideo: {
      id: "speaker",
      kind: "lecturer_video",
      label: "Speaker",
      src: "/input/speakers/preflight-render-test-missing-speaker.mp4",
      required: false,
    },
    useSpeakerVideo: true,
    mainVideoFitMode: "contain",
    hudAssets: [],
  },
  audio: {
    mode: "mix",
  },
  speaker: {
    name: "Test Speaker",
    role: "Instructor",
    displayMode: "video",
    positionPreset: "bottom-left",
    assetPriority: ["video", "avatar", "identity_card"],
    missingAssetBehavior: "fallback_to_identity_card",
  },
  layout: {
    aspectRatio: "16:9",
    canvas: {
      width: 1920,
      height: 1080,
    },
    mainVideoFitMode: "contain",
    topHeader: {
      visible: true,
      showCurrentStage: true,
    },
    rightSidebar: {
      visible: true,
      displayMode: "full",
    },
    stageBar: {
      visible: true,
      displayMode: "standard",
    },
    lecturer: {
      visible: true,
      positionPreset: "bottom-left",
    },
    bottomStatusHud: {
      visible: true,
    },
  },
  warning: {
    defaultHintId: "hint",
    items: [
      {
        id: "hint",
        hintType: "key_point",
        title: "提示",
        body: "测试提示",
        stageId: "stage",
      },
    ],
  },
  tasks: [
    {
      id: "task",
      label: "任务",
      title: "任务",
      stageId: "stage",
      order: 1,
    },
  ],
  chapterMap: {
    displayMode: "vertical_route",
    nodes: [
      {
        id: "node",
        label: "节点",
        stageId: "stage",
        order: 1,
      },
    ],
  },
  stages: [
    {
      id: "stage",
      label: "阶段",
      name: "阶段",
      startTime: 0,
      endTime: 1,
      mapNodeId: "node",
      defaultTaskId: "task",
      defaultHintId: "hint",
      order: 1,
      enabled: true,
    },
  ],
  timelineEvents: [
    {
      id: "event",
      type: "tip_show",
      startTime: 0.1,
      endTime: 0.5,
      targetComponent: "warning_panel",
      payload: {
        title: "事件",
        text: "事件提示",
      },
      priority: 1,
      enabled: true,
    },
  ],
  render: {
    width: 1920,
    height: 1080,
    fps: 30,
    format: "mp4",
    outputName: "preflight-render-test.mp4",
    outputDir: "out",
    durationMode: "fixed",
    durationSeconds: 1,
    audioEnabled: true,
  },
};

const main = async () => {
  await mkdir(path.dirname(tempMainVideoPath), { recursive: true });
  await writeFile(tempMainVideoPath, "not a real mp4", "utf8");
  await writeFile(tempLessonPath, `${JSON.stringify(fixtureLesson, null, 2)}\n`, "utf8");

  try {
    const result = await runRenderPreflight({ lessonId: tempLessonId });
    const speakerIssue = result.issues.find(
      (issue) => issue.code === "SPEAKER_VIDEO_MISSING",
    );

    assert.equal(
      result.ok,
      false,
      "audio.mode=mix 缺讲师视频时 preflight 必须失败",
    );
    assert.equal(
      speakerIssue?.severity,
      "error",
      "audio.mode=mix 缺讲师视频必须是 error，不应只是 warning",
    );

    const fixedDurationLesson = structuredClone(fixtureLesson);
    fixedDurationLesson.audio.mode = "main-only";
    fixedDurationLesson.media.useSpeakerVideo = false;
    fixedDurationLesson.speaker.displayMode = "compact";
    fixedDurationLesson.render.durationSeconds = 3;
    await writeFile(
      tempLessonPath,
      `${JSON.stringify(fixedDurationLesson, null, 2)}\n`,
      "utf8",
    );

    const fixedResult = await runRenderPreflight({ lessonId: tempLessonId });
    assert.ok(
      fixedResult.issues.some(
        (issue) => issue.code === "FIXED_DURATION_EXCEEDS_MAIN_VIDEO",
      ),
      "durationMode=fixed 长于主视频配置时应给出 warning",
    );

    console.log("渲染预检测试通过：mix 缺讲师视频阻断与 fixed 时长提示均符合预期。");
  } finally {
    await rm(tempLessonPath, { force: true });
    await rm(tempMainVideoPath, { force: true });
  }
};

void main().catch((error) => {
  console.error(`渲染预检测试失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
