import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  lessonProjectSchema,
  type LessonProjectConfig,
} from "../src/schemas/lesson.schema";
import {
  isPathInside,
  lessonPathForId,
  resolvePublicAssetPath,
  rootDir,
} from "./media-paths";
import {
  type AudioMode,
  type RenderCodec,
  getOutputLocation,
  parseLessonCliArgs,
} from "./render-utils";

export type PreflightSeverity = "error" | "warning";

export type PreflightIssue = {
  severity: PreflightSeverity;
  code: string;
  message: string;
  field?: string;
  file?: string;
  suggestion?: string;
};

export type PreflightOptions = {
  lessonId: string;
  outputNameOverride?: string;
  outputDirOverride?: string;
  durationOverrideSeconds?: number;
  allowShortRender?: boolean;
};

export type PreflightResult = {
  ok: boolean;
  lessonId: string;
  lessonPath: string;
  lesson?: LessonProjectConfig;
  issues: PreflightIssue[];
  outputLocation?: string;
  durationSeconds?: number;
  width?: 1920;
  height?: 1080;
  fps?: number;
  codec?: RenderCodec;
  audioMode?: AudioMode;
};

type MediaMetadata = {
  durationInSeconds?: number;
  width?: number;
  height?: number;
  fps?: number;
  audioChannels?: number;
};

const displayEventTypes = new Set([
  "tip_show",
  "warning_show",
  "hint_show",
  "summary_show",
  "stage_summary",
  "homework_show",
  "homework_reminder",
]);

const addIssue = (
  issues: PreflightIssue[],
  issue: PreflightIssue,
): void => {
  issues.push(issue);
};

const hasErrors = (issues: PreflightIssue[]): boolean =>
  issues.some((issue) => issue.severity === "error");

const formatZodPath = (pathParts?: PropertyKey[]): string =>
  pathParts?.length ? pathParts.map(String).join(".") : "root";

const resolveCodec = (lesson: LessonProjectConfig): RenderCodec =>
  (lesson.render.codec ?? lesson.render.videoCodec ?? "h264") as RenderCodec;

const resolveAudioMode = (lesson: LessonProjectConfig): AudioMode => {
  if (lesson.audio?.mode) {
    return lesson.audio.mode;
  }

  if (lesson.render.audioEnabled === false) {
    return "mute-all";
  }

  return "main-only";
};

const getEventEndTime = (
  event: LessonProjectConfig["timelineEvents"][number],
): number => {
  if (typeof event.endTime === "number") {
    return event.endTime;
  }

  if (typeof event.duration === "number") {
    return event.startTime + event.duration;
  }

  return event.startTime;
};

const getContentDuration = (lesson: LessonProjectConfig): number => {
  const stageEnd = Math.max(
    ...lesson.stages.map((stage) => stage.endTime ?? stage.startTime),
    0,
  );
  const eventEnd = Math.max(...lesson.timelineEvents.map(getEventEndTime), 0);
  return Math.max(stageEnd, eventEnd, 1);
};

const tryReadMediaMetadata = async (
  absolutePath: string,
  issues: PreflightIssue[],
): Promise<MediaMetadata> => {
  try {
    const metadata = await parseMedia({
      src: absolutePath,
      reader: nodeReader,
      fields: {
        dimensions: true,
        durationInSeconds: true,
        fps: true,
        numberOfAudioChannels: true,
      },
      acknowledgeRemotionLicense: true,
    });

    return {
      durationInSeconds: metadata.durationInSeconds ?? undefined,
      width: metadata.dimensions?.width,
      height: metadata.dimensions?.height,
      fps: metadata.fps ?? undefined,
      audioChannels: metadata.numberOfAudioChannels ?? undefined,
    };
  } catch (error) {
    addIssue(issues, {
      severity: "warning",
      code: "MEDIA_METADATA_READ_FAILED",
      message: "主视频文件存在，但脚本无法读取媒体元信息，将退回使用 lesson 中配置的 duration/width/height。",
      file: absolutePath,
      suggestion: `如果后续渲染失败，请重新转码主视频，或在 media.mainVideo 中补齐 duration、width、height。原始错误：${
        error instanceof Error ? error.message : String(error)
      }`,
    });
    return {};
  }
};

const ensureWritableOutputDir = async (
  outputDir: string,
  issues: PreflightIssue[],
): Promise<void> => {
  if (!isPathInside(rootDir, outputDir) && outputDir !== rootDir) {
    addIssue(issues, {
      severity: "error",
      code: "OUTPUT_DIR_OUTSIDE_PROJECT",
      message: "第 6 阶段输出目录必须位于当前项目内。",
      field: "render.outputDir",
      file: outputDir,
      suggestion: "请把 render.outputDir 设置为 out 或 out/renders。",
    });
    return;
  }

  try {
    await mkdir(outputDir, { recursive: true });
    const probePath = path.join(
      outputDir,
      `.preflight-write-test-${process.pid}.tmp`,
    );
    await writeFile(probePath, "ok", "utf8");
    await rm(probePath, { force: true });
  } catch (error) {
    addIssue(issues, {
      severity: "error",
      code: "OUTPUT_DIR_NOT_WRITABLE",
      message: "输出目录无法创建或不可写。",
      field: "render.outputDir",
      file: outputDir,
      suggestion: `请检查目录权限，或改用 out。原始错误：${
        error instanceof Error ? error.message : String(error)
      }`,
    });
  }
};

const validateOutputName = (
  outputName: string,
  issues: PreflightIssue[],
): void => {
  if (!outputName.trim()) {
    addIssue(issues, {
      severity: "error",
      code: "OUTPUT_NAME_EMPTY",
      message: "render.outputName 不能为空。",
      field: "render.outputName",
      suggestion: "请填写类似 lesson-01-final.mp4 的文件名。",
    });
    return;
  }

  if (/[\\/]/.test(outputName)) {
    addIssue(issues, {
      severity: "error",
      code: "OUTPUT_NAME_CONTAINS_PATH",
      message: "render.outputName 只能是文件名，不能包含目录。",
      field: "render.outputName",
      suggestion: "请把目录写到 render.outputDir，把文件名写到 render.outputName。",
    });
  }

  if (!outputName.toLowerCase().endsWith(".mp4")) {
    addIssue(issues, {
      severity: "error",
      code: "OUTPUT_NAME_NOT_MP4",
      message: "第 6 阶段只输出 MP4，render.outputName 必须以 .mp4 结尾。",
      field: "render.outputName",
      suggestion: "请使用 lesson-01-final.mp4 这样的文件名。",
    });
  }
};

const validateMediaPaths = async (
  lesson: LessonProjectConfig,
  issues: PreflightIssue[],
  audioMode: AudioMode,
): Promise<MediaMetadata> => {
  const mainVideo = resolvePublicAssetPath(lesson.media.mainVideo.src);
  if (mainVideo.error) {
    addIssue(issues, {
      severity: "error",
      code: "MAIN_VIDEO_PATH_INVALID",
      message: mainVideo.error,
      field: "media.mainVideo.src",
      file: lesson.media.mainVideo.src,
      suggestion: mainVideo.suggestion,
    });
    return {};
  }

  if (!mainVideo.exists || !mainVideo.absolutePath) {
    addIssue(issues, {
      severity: "error",
      code: "MAIN_VIDEO_MISSING",
      message: "主视频是正式渲染必需素材，但当前路径找不到文件。",
      field: "media.mainVideo.src",
      file: mainVideo.absolutePath ?? lesson.media.mainVideo.src,
      suggestion: "请把真实主课程视频放到 public/input/videos/，并确认 lesson 中使用 /input/videos/... 路径。",
    });
    return {};
  }

  const metadata = await tryReadMediaMetadata(mainVideo.absolutePath, issues);

  const speakerMode = lesson.speaker.displayMode;
  const shouldUseSpeakerVideo =
    lesson.media.useSpeakerVideo ||
    speakerMode === "video" ||
    audioMode === "speaker-only" ||
    audioMode === "mix";
  const speakerVideo = lesson.media.speakerVideo ?? lesson.media.lecturerVideo;
  const speakerImage = lesson.media.speakerImage ?? lesson.media.lecturerAvatar;
  const missingBehavior =
    lesson.speaker.missingAssetBehavior ?? "fallback_to_identity_card";

  if (shouldUseSpeakerVideo) {
    const resolvedSpeakerVideo = resolvePublicAssetPath(speakerVideo?.src);
    if (!speakerVideo?.src || resolvedSpeakerVideo.error || !resolvedSpeakerVideo.exists) {
      const speakerAudioRequiresVideo =
        audioMode === "speaker-only" || audioMode === "mix";
      addIssue(issues, {
        severity:
          speakerAudioRequiresVideo || missingBehavior === "block_render"
            ? "error"
            : "warning",
        code: "SPEAKER_VIDEO_MISSING",
        message:
          audioMode === "speaker-only"
            ? "audio.mode=speaker-only 需要讲师视频音轨，但讲师视频文件缺失。"
            : audioMode === "mix"
            ? "audio.mode=mix 需要讲师视频音轨参与混音，但讲师视频文件缺失。"
            : "讲师小窗或混音策略需要讲师视频，但讲师视频文件缺失。",
        field: speakerVideo?.src ? "media.speakerVideo.src" : "media.speakerVideo",
        file: resolvedSpeakerVideo.absolutePath ?? speakerVideo?.src,
        suggestion: speakerAudioRequiresVideo
          ? "请补齐讲师视频，或把 audio.mode 改为 main-only / mute-all。"
          : missingBehavior === "block_render"
          ? "请补齐讲师视频，或把 speaker.missingAssetBehavior 改为 fallback_to_avatar / fallback_to_identity_card / hide。"
          : "当前会按配置降级为头像、身份牌或隐藏；如需讲师视频，请补齐 public/input/speakers/... 文件。",
      });
    }
  }

  if (speakerMode === "avatar" || speakerMode === "compact" || missingBehavior === "fallback_to_avatar") {
    const resolvedSpeakerImage = resolvePublicAssetPath(speakerImage?.src);
    if (!speakerImage?.src || resolvedSpeakerImage.error || !resolvedSpeakerImage.exists) {
      addIssue(issues, {
        severity: "warning",
        code: "SPEAKER_IMAGE_MISSING",
        message: "讲师头像缺失，渲染时会降级为文字身份牌或隐藏。",
        field: speakerImage?.src ? "media.speakerImage.src" : "media.speakerImage",
        file: resolvedSpeakerImage.absolutePath ?? speakerImage?.src,
        suggestion: "如果需要头像展示，请把图片放到 public/input/images/，并使用 /input/images/... 路径。",
      });
    }
  }

  return metadata;
};

const validateTimeline = (
  lesson: LessonProjectConfig,
  durationSeconds: number,
  allowShortRender: boolean,
  issues: PreflightIssue[],
): void => {
  const enabledStages = lesson.stages.filter((stage) => stage.enabled);
  const enabledEvents = lesson.timelineEvents.filter((event) => event.enabled);
  const contentDuration = getContentDuration(lesson);

  if (enabledStages.length === 0) {
    addIssue(issues, {
      severity: "error",
      code: "NO_ENABLED_STAGES",
      message: "至少需要 1 个启用的课程阶段。",
      field: "stages",
      suggestion: "请在 stages 中保留至少一个 enabled=true 的阶段。",
    });
  }

  if (enabledEvents.length === 0) {
    addIssue(issues, {
      severity: "error",
      code: "NO_ENABLED_TIMELINE_EVENTS",
      message: "至少需要 1 个启用的 timelineEvent，最终视频才有时间轴驱动的 HUD 变化。",
      field: "timelineEvents",
      suggestion: "请添加地图、任务、提示、总结或作业提醒事件。",
    });
  }

  for (const [index, event] of lesson.timelineEvents.entries()) {
    if (!event.enabled) {
      continue;
    }

    if (displayEventTypes.has(event.type) && event.endTime === undefined && event.duration === undefined) {
      addIssue(issues, {
        severity: "error",
        code: "DISPLAY_EVENT_WITHOUT_DURATION",
        message: "显示型事件必须设置 endTime 或 duration。",
        field: `timelineEvents.${index}`,
        suggestion: "请为提示、警告、总结或作业事件填写结束时间或持续时间。",
      });
    }

    if (!allowShortRender && getEventEndTime(event) > durationSeconds + 0.25) {
      addIssue(issues, {
        severity: "error",
        code: "EVENT_AFTER_RENDER_DURATION",
        message: "时间轴事件超出了本次渲染时长，会被截断。",
        field: `timelineEvents.${index}.startTime`,
        suggestion: "请延长 render.durationSeconds，或调整事件时间点。",
      });
    }
  }

  if (!allowShortRender && contentDuration > durationSeconds + 0.25) {
    addIssue(issues, {
      severity: "error",
      code: "CONTENT_AFTER_RENDER_DURATION",
      message: "课程阶段或时间轴内容超出了本次渲染时长。",
      field: "render.durationSeconds",
      suggestion: "正式渲染建议使用 durationMode=auto，或把 fixed 时长设置到覆盖最后一个阶段和事件。",
    });
  }

  const conflictWindows: Array<{
    id: string;
    targetComponent: string;
    priority: number;
    startTime: number;
    endTime: number;
  }> = [];
  const instantWindowSeconds = 0.001;
  for (const event of enabledEvents) {
    const startTime = event.startTime;
    const rawEndTime = getEventEndTime(event);
    const endTime = rawEndTime > startTime ? rawEndTime : startTime + instantWindowSeconds;
    const previous = conflictWindows.find((candidate) => {
      if (
        candidate.targetComponent !== event.targetComponent ||
        candidate.priority !== event.priority
      ) {
        return false;
      }

      return startTime < candidate.endTime && candidate.startTime < endTime;
    });

    if (previous) {
      addIssue(issues, {
        severity: "warning",
        code: "TIMELINE_EVENT_PRIORITY_CONFLICT",
        message: "同一 HUD 模块存在相同优先级且时间窗口重叠的事件，实际展示可能依赖数组顺序。",
        field: "timelineEvents",
        suggestion: `请调整 ${previous.id} 或 ${event.id} 的 priority，保证同组件同时间只有一个最高优先级事件。`,
      });
      continue;
    }

    conflictWindows.push({
      id: event.id,
      targetComponent: event.targetComponent,
      priority: event.priority,
      startTime,
      endTime,
    });
  }
};

const resolveDurationSeconds = (
  lesson: LessonProjectConfig,
  metadata: MediaMetadata,
  overrideSeconds: number | undefined,
  issues: PreflightIssue[],
): number => {
  if (overrideSeconds !== undefined) {
    return overrideSeconds;
  }

  const mode = lesson.render.durationMode ?? "auto";
  const configuredMainDuration = lesson.media.mainVideo.duration;
  const mediaDuration = metadata.durationInSeconds ?? configuredMainDuration;
  const contentDuration = getContentDuration(lesson);

  if (mode === "fixed") {
    const fixedDuration = lesson.render.durationSeconds ?? 0;
    if (mediaDuration !== undefined && fixedDuration > mediaDuration + 0.25) {
      addIssue(issues, {
        severity: "warning",
        code: "FIXED_DURATION_EXCEEDS_MAIN_VIDEO",
        message: "durationMode=fixed 会让成片长于主视频，主视频结尾后可能出现静止或占位表现。",
        field: "render.durationSeconds",
        suggestion: "正式课程成片通常建议使用 durationMode=auto，或确认 fixed 时长确实需要长于主视频。",
      });
    }

    return lesson.render.durationSeconds ?? 0;
  }

  if (mode === "content") {
    if (mediaDuration !== undefined && contentDuration > mediaDuration + 0.25) {
      addIssue(issues, {
        severity: "warning",
        code: "CONTENT_DURATION_EXCEEDS_MAIN_VIDEO",
        message: "durationMode=content 会让成片长于主视频，主视频结尾后可能出现静止或占位表现。",
        field: "render.durationMode",
        suggestion: "正式课程成片通常建议使用 durationMode=auto，与主视频时长一致。",
      });
    }
    return contentDuration;
  }

  if (mediaDuration === undefined) {
    addIssue(issues, {
      severity: "error",
      code: "MAIN_VIDEO_DURATION_MISSING",
      message: "durationMode=auto 需要主视频时长，但脚本无法读取媒体元信息，lesson 中也没有 media.mainVideo.duration。",
      field: "media.mainVideo.duration",
      suggestion: "请补齐 media.mainVideo.duration，或把 render.durationMode 改为 fixed 并填写 durationSeconds。",
    });
    return 0;
  }

  if (metadata.durationInSeconds !== undefined && configuredMainDuration !== undefined) {
    const delta = Math.abs(metadata.durationInSeconds - configuredMainDuration);
    if (delta > 1) {
      addIssue(issues, {
        severity: "warning",
        code: "MAIN_VIDEO_DURATION_MISMATCH",
        message: "lesson 中配置的主视频时长与真实媒体时长不一致，本次以真实媒体时长为准。",
        field: "media.mainVideo.duration",
        suggestion: `配置值为 ${configuredMainDuration}s，媒体读取值约为 ${metadata.durationInSeconds.toFixed(2)}s。请复查时间轴事件。`,
      });
    }
  }

  return mediaDuration;
};

export const runRenderPreflight = async (
  options: PreflightOptions,
): Promise<PreflightResult> => {
  const issues: PreflightIssue[] = [];
  const lessonPath = lessonPathForId(options.lessonId);

  if (!existsSync(lessonPath)) {
    addIssue(issues, {
      severity: "error",
      code: "LESSON_NOT_FOUND",
      message: "未找到 lesson 配置文件。",
      file: lessonPath,
      suggestion: "请确认 lesson id 是否正确，例如 lesson-01 对应 src/data/lessons/lesson-01.json。",
    });
    return { ok: false, lessonId: options.lessonId, lessonPath, issues };
  }

  let rawLesson: unknown;
  try {
    rawLesson = JSON.parse(await readFile(lessonPath, "utf8")) as unknown;
  } catch (error) {
    addIssue(issues, {
      severity: "error",
      code: "LESSON_JSON_PARSE_FAILED",
      message: "lesson JSON 解析失败。",
      file: lessonPath,
      suggestion: `请检查 JSON 语法。原始错误：${
        error instanceof Error ? error.message : String(error)
      }`,
    });
    return { ok: false, lessonId: options.lessonId, lessonPath, issues };
  }

  const parsed = lessonProjectSchema.safeParse(rawLesson);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      addIssue(issues, {
        severity: "error",
        code: "LESSON_SCHEMA_INVALID",
        message: issue.message,
        field: formatZodPath(issue.path),
        file: lessonPath,
        suggestion: "请根据字段路径修正 lesson 配置后重新运行 preflight。",
      });
    }

    return { ok: false, lessonId: options.lessonId, lessonPath, issues };
  }

  const lesson = parsed.data;
  const outputName = options.outputNameOverride ?? lesson.render.outputName;
  const outputDir = path.resolve(
    rootDir,
    options.outputDirOverride ?? lesson.render.outputDir,
  );
  const outputLocation = getOutputLocation(
    path.relative(rootDir, outputDir) || ".",
    outputName,
  );
  const codec = resolveCodec(lesson);
  const audioMode = resolveAudioMode(lesson);

  if (lesson.meta.canvas.width !== 1920 || lesson.meta.canvas.height !== 1080) {
    addIssue(issues, {
      severity: "error",
      code: "META_CANVAS_INVALID",
      message: "meta.canvas 必须固定为 1920x1080。",
      field: "meta.canvas",
      suggestion: "第 6 阶段只支持 16:9 1920x1080 最终视频。",
    });
  }

  if (lesson.layout.canvas.width !== 1920 || lesson.layout.canvas.height !== 1080) {
    addIssue(issues, {
      severity: "error",
      code: "LAYOUT_CANVAS_INVALID",
      message: "layout.canvas 必须固定为 1920x1080。",
      field: "layout.canvas",
      suggestion: "请保持最终视频画布尺寸为 1920x1080。",
    });
  }

  if (lesson.render.width !== 1920 || lesson.render.height !== 1080) {
    addIssue(issues, {
      severity: "error",
      code: "RENDER_CANVAS_INVALID",
      message: "render.width/render.height 必须固定为 1920x1080。",
      field: "render.width/render.height",
      suggestion: "请把 render.width 设置为 1920，render.height 设置为 1080。",
    });
  }

  if (lesson.render.fps <= 0 || lesson.meta.canvas.fps <= 0) {
    addIssue(issues, {
      severity: "error",
      code: "FPS_INVALID",
      message: "fps 必须为正数。",
      field: "render.fps",
      suggestion: "请使用 30 或 60。",
    });
  }

  if (lesson.render.fps !== lesson.meta.canvas.fps) {
    addIssue(issues, {
      severity: "warning",
      code: "FPS_MISMATCH",
      message: "render.fps 与 meta.canvas.fps 不一致，本次渲染以 render.fps 为准。",
      field: "render.fps",
      suggestion: "建议保持 meta.canvas.fps 与 render.fps 一致，避免时间轴理解混乱。",
    });
  }

  validateOutputName(outputName, issues);
  await ensureWritableOutputDir(outputDir, issues);

  if (audioMode === "mix") {
    addIssue(issues, {
      severity: "warning",
      code: "AUDIO_MIX_ECHO_RISK",
      message: "audio.mode=mix 会同时保留主视频和讲师视频音频，可能产生回声或音量叠加。",
      field: "audio.mode",
      suggestion: "正式课程默认建议使用 main-only；只有确认两路音频互补时再使用 mix。",
    });
  }

  const metadata = await validateMediaPaths(lesson, issues, audioMode);
  const durationSeconds = resolveDurationSeconds(
    lesson,
    metadata,
    options.durationOverrideSeconds,
    issues,
  );

  if (durationSeconds <= 0) {
    addIssue(issues, {
      severity: "error",
      code: "RENDER_DURATION_INVALID",
      message: "本次渲染时长必须大于 0 秒。",
      field: "render.durationSeconds",
      suggestion: "请检查 durationMode、durationSeconds 或 media.mainVideo.duration。",
    });
  }

  if (metadata.audioChannels === 0 && audioMode === "main-only") {
    addIssue(issues, {
      severity: "warning",
      code: "MAIN_VIDEO_HAS_NO_AUDIO",
      message: "主视频未检测到音轨，但 audio.mode=main-only。",
      field: "audio.mode",
      suggestion: "如果课程不需要声音，请改为 mute-all；如果需要声音，请检查主视频导出设置。",
    });
  }

  validateTimeline(
    lesson,
    durationSeconds,
    options.allowShortRender ?? false,
    issues,
  );

  return {
    ok: !hasErrors(issues),
    lessonId: options.lessonId,
    lessonPath,
    lesson,
    issues,
    outputLocation,
    durationSeconds,
    width: 1920,
    height: 1080,
    fps: lesson.render.fps,
    codec,
    audioMode,
  };
};

export const printPreflightReport = (result: PreflightResult): void => {
  const errors = result.issues.filter((issue) => issue.severity === "error");
  const warnings = result.issues.filter((issue) => issue.severity === "warning");

  console.log(
    result.ok
      ? `渲染前检查通过：${result.lessonId}`
      : `渲染前检查失败：${result.lessonId}`,
  );

  if (result.outputLocation) {
    console.log(`输出文件：${result.outputLocation}`);
  }

  if (result.durationSeconds) {
    console.log(`渲染时长：${result.durationSeconds.toFixed(2)} 秒`);
  }

  for (const issue of [...errors, ...warnings]) {
    const prefix = issue.severity === "error" ? "错误" : "警告";
    console.log(`- [${prefix}] ${issue.message}`);
    if (issue.field) {
      console.log(`  字段：${issue.field}`);
    }
    if (issue.file) {
      console.log(`  文件：${issue.file}`);
    }
    if (issue.suggestion) {
      console.log(`  修复建议：${issue.suggestion}`);
    }
  }
};

const main = async () => {
  const lessonId = parseLessonCliArgs();
  const result = await runRenderPreflight({ lessonId });
  printPreflightReport(result);
  if (!result.ok) {
    process.exitCode = 1;
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error) => {
    console.error(
      `渲染前检查异常：${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  });
}
