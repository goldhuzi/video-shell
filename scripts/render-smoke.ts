import {
  printPreflightReport,
  runRenderPreflight,
} from "./preflight-render";
import {
  parseLessonCliArgs,
  runRemotionRender,
} from "./render-utils";

const smokeDurationSeconds = 8;

const main = async () => {
  const lessonId = parseLessonCliArgs();
  const preflight = await runRenderPreflight({
    lessonId,
    outputDirOverride: "out",
    outputNameOverride: `${lessonId}-smoke.mp4`,
    durationOverrideSeconds: smokeDurationSeconds,
    allowShortRender: true,
  });
  printPreflightReport(preflight);

  if (!preflight.ok || !preflight.lesson || !preflight.outputLocation || !preflight.durationSeconds || !preflight.fps || !preflight.codec || !preflight.audioMode) {
    process.exitCode = 1;
    return;
  }

  await runRemotionRender({
    lessonId,
    lesson: preflight.lesson,
    outputLocation: preflight.outputLocation,
    durationSeconds: preflight.durationSeconds,
    width: 1920,
    height: 1080,
    fps: preflight.fps,
    codec: preflight.codec,
    audioMode: preflight.audioMode,
  });
};

void main().catch((error) => {
  console.error(
    `冒烟渲染失败：${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});

