import path from "node:path";
import {
  printPreflightReport,
  runRenderPreflight,
} from "./preflight-render";
import {
  getOutputLocation,
  parseLessonCliArgs,
  runRemotionStill,
  type RenderPlan,
} from "./render-utils";

const defaultStillTimes = [36, 118, 150, 248, 270, 316, 340, 355];

const getArgValue = (name: string): string | undefined => {
  const inline = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) {
    return inline.split("=").slice(1).join("=");
  }

  const index = process.argv.findIndex((arg) => arg === name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const parseTimes = (): number[] => {
  const raw = getArgValue("--times") ?? getArgValue("--time");
  if (!raw) {
    return defaultStillTimes;
  }

  const times = raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value >= 0);

  if (times.length === 0) {
    throw new Error("参数错误：--times 需要填写非负秒数，例如 --times 36,118,150。");
  }

  return times;
};

const formatTimeForFile = (seconds: number): string =>
  Number.isInteger(seconds)
    ? `${seconds}s`
    : `${seconds.toFixed(2).replace(".", "p")}s`;

const main = async () => {
  const lessonId = parseLessonCliArgs();
  const times = parseTimes();
  const preflight = await runRenderPreflight({ lessonId });
  printPreflightReport(preflight);

  if (!preflight.ok || !preflight.lesson || !preflight.outputLocation || !preflight.durationSeconds || !preflight.fps || !preflight.codec || !preflight.audioMode) {
    process.exitCode = 1;
    return;
  }

  const durationSeconds = preflight.durationSeconds;
  const fps = preflight.fps;
  const durationInFrames = Math.ceil(durationSeconds * fps);
  const invalidTime = times.find((time) => time > durationSeconds);
  if (invalidTime !== undefined) {
    console.error(
      `关键帧时间 ${invalidTime}s 超出渲染时长 ${durationSeconds.toFixed(2)}s。`,
    );
    process.exitCode = 1;
    return;
  }

  const plan: RenderPlan = {
    lessonId,
    lesson: preflight.lesson,
    outputLocation: preflight.outputLocation,
    durationSeconds,
    width: 1920,
    height: 1080,
    fps,
    codec: preflight.codec,
    audioMode: preflight.audioMode,
  };
  const outputDir = getArgValue("--outputDir") ?? path.join("out", "stills", lessonId);
  const stills = times.map((time) => ({
    frame: Math.min(Math.round(time * fps), durationInFrames - 1),
    outputLocation: getOutputLocation(
      outputDir,
      `${lessonId}-${formatTimeForFile(time)}.png`,
    ),
  }));

  await runRemotionStill(plan, stills);
  console.log(`关键帧渲染完成：${stills.length} 张`);
};

void main().catch((error) => {
  console.error(
    `关键帧渲染失败：${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
