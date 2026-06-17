import {
  printPreflightReport,
  runRenderPreflight,
} from "./preflight-render";
import {
  parseLessonCliArgs,
  runRemotionRender,
} from "./render-utils";

const main = async () => {
  const lessonId = parseLessonCliArgs();
  const preflight = await runRenderPreflight({ lessonId });
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
    `正式渲染失败：${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});

