import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import type { RenderMediaOptions } from "@remotion/renderer";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { LessonProjectConfig } from "../src/schemas/lesson.schema";
import { rootDir } from "./media-paths";

export const compositionId = "CourseShellComposition";
export const entryPoint = path.join(rootDir, "src", "remotion", "Root.tsx");

export type RenderCodec = "h264" | "h265";
export type AudioMode = "main-only" | "speaker-only" | "mix" | "mute-all";

export type RenderPlan = {
  lessonId: string;
  lesson: LessonProjectConfig;
  outputLocation: string;
  durationSeconds: number;
  width: 1920;
  height: 1080;
  fps: number;
  codec: RenderCodec;
  audioMode: AudioMode;
};

type PreparedRender = {
  composition: Awaited<ReturnType<typeof selectComposition>>;
  inputProps: { lesson: LessonProjectConfig };
  serveUrl: string;
};

export const parseLessonCliArgs = (args = process.argv.slice(2)): string => {
  const lessonFlagIndex = args.findIndex((arg) => arg === "--lesson");
  if (lessonFlagIndex >= 0) {
    const value = args[lessonFlagIndex + 1];
    if (!value) {
      throw new Error("参数错误：--lesson 后面需要跟 lesson id，例如 --lesson lesson-01。");
    }
    return value;
  }

  const flagsWithValues = new Set([
    "--duration",
    "--from",
    "--output",
    "--outputDir",
    "--time",
    "--times",
  ]);
  const positionalArgs: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith("--lesson=")) {
      continue;
    }

    if (flagsWithValues.has(arg)) {
      index += 1;
      continue;
    }

    if (Array.from(flagsWithValues).some((flag) => arg.startsWith(`${flag}=`))) {
      continue;
    }

    if (!arg.startsWith("-")) {
      positionalArgs.push(arg);
    }
  }

  const inlineLesson = args.find((arg) => arg.startsWith("--lesson="));
  if (inlineLesson) {
    const value = inlineLesson.split("=").slice(1).join("=");
    if (!value) {
      throw new Error("参数错误：--lesson= 后面需要填写 lesson id，例如 --lesson=lesson-01。");
    }
    return value;
  }

  const positional = positionalArgs[0];
  return positional ?? "lesson-01";
};

export const getOutputLocation = (outputDir: string, outputName: string): string =>
  path.resolve(rootDir, outputDir, outputName);

export const withResolvedRenderSettings = (plan: RenderPlan): LessonProjectConfig => {
  return {
    ...plan.lesson,
    render: {
      ...plan.lesson.render,
      width: plan.width,
      height: plan.height,
      fps: plan.fps,
      durationSeconds: plan.durationSeconds,
      codec: plan.codec,
      outputDir: path.relative(rootDir, path.dirname(plan.outputLocation)) || ".",
      outputName: path.basename(plan.outputLocation),
    },
    audio: {
      ...(plan.lesson.audio ?? {}),
      mode: plan.audioMode,
    },
  };
};

const prepareRemotionRender = async (plan: RenderPlan): Promise<PreparedRender> => {
  const lessonForRender = withResolvedRenderSettings(plan);
  const inputProps = { lesson: lessonForRender };

  console.log("开始打包 Remotion composition...");
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log("读取 CourseShellComposition 元信息...");
  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps,
  });

  return { composition, inputProps, serveUrl };
};

export const runRemotionRender = async (
  plan: RenderPlan,
  options: { frameRange?: RenderMediaOptions["frameRange"] } = {},
): Promise<void> => {
  let lastLoggedPercent = -1;

  await mkdir(path.dirname(plan.outputLocation), { recursive: true });
  if (existsSync(plan.outputLocation)) {
    console.log(`输出文件已存在，将覆盖：${plan.outputLocation}`);
  }

  const { composition, inputProps, serveUrl } = await prepareRemotionRender(plan);

  console.log(`开始渲染：${plan.outputLocation}`);
  await renderMedia({
    composition,
    serveUrl,
    codec: plan.codec,
    inputProps,
    frameRange: options.frameRange ?? null,
    outputLocation: plan.outputLocation,
    overwrite: true,
    muted: plan.audioMode === "mute-all",
    onProgress: ({ progress }) => {
      const percent = Math.floor(progress * 100);
      if (percent >= lastLoggedPercent + 10 || percent === 100) {
        lastLoggedPercent = percent;
        console.log(`渲染进度：${percent}%`);
      }
    },
  });

  console.log(`渲染成功：${plan.outputLocation}`);
};

export const runRemotionStill = async (
  plan: RenderPlan,
  stills: Array<{ frame: number; outputLocation: string }>,
): Promise<void> => {
  const { composition, inputProps, serveUrl } = await prepareRemotionRender(plan);

  for (const still of stills) {
    await mkdir(path.dirname(still.outputLocation), { recursive: true });
    if (existsSync(still.outputLocation)) {
      console.log(`关键帧文件已存在，将覆盖：${still.outputLocation}`);
    }

    console.log(`渲染关键帧：frame=${still.frame} -> ${still.outputLocation}`);
    await renderStill({
      composition,
      frame: still.frame,
      imageFormat: "png",
      inputProps,
      output: still.outputLocation,
      overwrite: true,
      serveUrl,
    });
  }
};
