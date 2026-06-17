import path from "node:path";
import {
  printPreflightReport,
  runRenderPreflight,
} from "./preflight-render";
import {
  getOutputLocation,
  parseLessonCliArgs,
  runRemotionRender,
  type RenderPlan,
} from "./render-utils";

const getArgValue = (name: string): string | undefined => {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) {
    return inline.split("=").slice(1).join("=");
  }

  const index = process.argv.findIndex((arg) => arg === name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const parseNonNegativeNumber = (name: string, fallback: number): number => {
  const raw = getArgValue(name);
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`参数错误：${name} 需要填写非负秒数。`);
  }

  return value;
};

const parsePositiveNumber = (name: string, fallback: number): number => {
  const raw = getArgValue(name);
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`参数错误：${name} 需要填写大于 0 的秒数。`);
  }

  return value;
};

const formatTimeForFile = (seconds: number): string =>
  Number.isInteger(seconds)
    ? `${seconds}s`
    : `${seconds.toFixed(2).replace(".", "p")}s`;

const main = async () => {
  const lessonId = parseLessonCliArgs();
  const fromSeconds = parseNonNegativeNumber("--from", 0);
  const durationSeconds = parsePositiveNumber("--duration", 8);
  const preflight = await runRenderPreflight({ lessonId });
  printPreflightReport(preflight);

  if (!preflight.ok || !preflight.lesson || !preflight.outputLocation || !preflight.durationSeconds || !preflight.fps || !preflight.codec || !preflight.audioMode) {
    process.exitCode = 1;
    return;
  }

  if (fromSeconds + durationSeconds > preflight.durationSeconds + 0.25) {
    console.error(
      `片段窗口 ${fromSeconds}s + ${durationSeconds}s 超出渲染时长 ${preflight.durationSeconds.toFixed(2)}s。`,
    );
    process.exitCode = 1;
    return;
  }

  const startFrame = Math.round(fromSeconds * preflight.fps);
  const endFrame = Math.min(
    startFrame + Math.ceil(durationSeconds * preflight.fps) - 1,
    Math.ceil(preflight.durationSeconds * preflight.fps) - 1,
  );
  const outputDir = getArgValue("--outputDir") ?? path.join("out", "clips");
  const outputName =
    getArgValue("--output") ??
    `${lessonId}-${formatTimeForFile(fromSeconds)}-${formatTimeForFile(durationSeconds)}.mp4`;
  const outputLocation = getOutputLocation(outputDir, outputName);

  const plan: RenderPlan = {
    lessonId,
    lesson: preflight.lesson,
    outputLocation,
    durationSeconds: preflight.durationSeconds,
    width: 1920,
    height: 1080,
    fps: preflight.fps,
    codec: preflight.codec,
    audioMode: preflight.audioMode,
  };

  await runRemotionRender(plan, { frameRange: [startFrame, endFrame] });
};

void main().catch((error) => {
  console.error(
    `片段渲染失败：${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
