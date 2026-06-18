import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildBatchReport,
  createRunId,
  loadCourseManifest,
  parseBatchArgs,
  readBatchReport,
  resolveLatestReportPath,
  selectManifestLessons,
  writeBatchReport,
  type BatchItemResult,
  type CourseManifestLesson,
} from "./batch-utils";
import { runRenderPreflight } from "./preflight-render";
import { runRemotionRender } from "./render-utils";

type RunBatchRenderOptions = {
  retryLessonIds?: string[];
  sourceReportPath?: string;
};

export const runBatchRender = async (
  options: RunBatchRenderOptions = {},
): Promise<number> => {
  const args = parseBatchArgs();
  const dryRun = args.flags.has("--dry-run");
  const smoke = args.flags.has("--smoke");
  const manifest = await loadCourseManifest();
  const startedAt = new Date().toISOString();
  const retrySet = options.retryLessonIds ? new Set(options.retryLessonIds) : undefined;
  const entries: CourseManifestLesson[] = retrySet
    ? manifest.lessons
        .filter((entry) => retrySet.has(entry.lessonId))
        .sort((a, b) => a.order - b.order || a.lessonId.localeCompare(b.lessonId))
    : selectManifestLessons(manifest, args, { renderOnly: true });
  const missingRetryLessonIds = retrySet
    ? [...retrySet].filter(
        (lessonId) => !manifest.lessons.some((entry) => entry.lessonId === lessonId),
      )
    : [];
  const items: BatchItemResult[] = [];

  for (const entry of entries) {
    const itemStartedAt = new Date().toISOString();
    const outputDirOverride = smoke
      ? path.join(manifest.project.defaultOutputDir, "smoke")
      : manifest.project.defaultOutputDir;
    const preflight = await runRenderPreflight(
      smoke
        ? {
            lessonId: entry.lessonId,
            outputDirOverride,
            outputNameOverride: `${entry.lessonId}-batch-smoke.mp4`,
            durationOverrideSeconds: 8,
            allowShortRender: true,
          }
        : {
            lessonId: entry.lessonId,
            outputDirOverride,
            outputNameOverride: entry.outputName,
          },
    );
    const errors = preflight.issues.filter((issue) => issue.severity === "error").length;
    const warnings = preflight.issues.filter((issue) => issue.severity === "warning").length;

    if (!preflight.ok || !preflight.lesson || !preflight.outputLocation || !preflight.durationSeconds || !preflight.fps || !preflight.codec || !preflight.audioMode) {
      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "preflight_failed",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: "渲染前检查未通过，已跳过渲染",
        outputLocation: preflight.outputLocation,
        durationSeconds: preflight.durationSeconds,
        errors,
        warnings,
        issues: preflight.issues,
      });
      console.log(`跳过渲染：${entry.lessonId} (${errors} error, ${warnings} warning)`);
      continue;
    }

    if (dryRun) {
      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "dry_run",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: smoke ? "dry-run：将执行 8 秒 smoke 渲染" : "dry-run：将执行完整渲染",
        outputLocation: preflight.outputLocation,
        durationSeconds: preflight.durationSeconds,
        errors: 0,
        warnings,
        issues: preflight.issues,
      });
      console.log(`dry-run：${entry.lessonId} -> ${preflight.outputLocation}`);
      continue;
    }

    try {
      await runRemotionRender({
        lessonId: entry.lessonId,
        lesson: preflight.lesson,
        outputLocation: preflight.outputLocation,
        durationSeconds: preflight.durationSeconds,
        width: 1920,
        height: 1080,
        fps: preflight.fps,
        codec: preflight.codec,
        audioMode: preflight.audioMode,
      });

      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "rendered",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: smoke ? "smoke 渲染完成" : "完整渲染完成",
        outputLocation: preflight.outputLocation,
        durationSeconds: preflight.durationSeconds,
        errors: 0,
        warnings,
        issues: preflight.issues,
      });
    } catch (error) {
      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "failed",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: error instanceof Error ? error.message : String(error),
        outputLocation: preflight.outputLocation,
        durationSeconds: preflight.durationSeconds,
        errors: 1,
        warnings,
        issues: preflight.issues,
      });
      console.error(`渲染失败：${entry.lessonId}`);
    }
  }

  for (const lessonId of missingRetryLessonIds) {
    items.push({
      lessonId,
      status: "failed",
      startedAt,
      finishedAt: new Date().toISOString(),
      message: "失败报告中的 lessonId 不存在于当前 manifest，无法重试",
      errors: 1,
      warnings: 0,
      issues: [
        {
          severity: "error",
          code: "RETRY_LESSON_NOT_IN_MANIFEST",
          message: "失败报告中的 lessonId 不存在于当前 manifest。",
          suggestion: "请恢复 manifest 中的 lesson 条目，或手动指定仍存在的 lesson 后再重试。",
        },
      ],
    });
  }

  const report = buildBatchReport({
    kind: "render",
    runId: createRunId("render"),
    generatedAt: startedAt,
    finishedAt: new Date().toISOString(),
    manifestPath: "src/data/course.manifest.json",
    selectedLessonIds: entries.map((entry) => entry.lessonId),
    items,
    notes: [
      dryRun ? "本次为 dry-run，没有写出视频。" : smoke ? "本次为批量 smoke 渲染，只覆盖每课前 8 秒。" : "本次为批量完整渲染。",
      options.sourceReportPath ? `本次重试来源报告：${path.relative(process.cwd(), options.sourceReportPath)}` : "",
    ].filter(Boolean),
  });

  const paths = await writeBatchReport(report);
  console.log(`批量渲染报告：${paths.markdownPath}`);
  return report.totals.failed > 0 ? 1 : 0;
};

export const getFailedLessonIdsFromLatestRenderReport = async (reportPath?: string): Promise<{ lessonIds: string[]; reportPath: string }> => {
  const resolvedReportPath = reportPath ?? (await resolveLatestReportPath("render"));
  const report = await readBatchReport(resolvedReportPath);
  const lessonIds = report.items
    .filter((item) => item.status === "failed" || item.status === "preflight_failed")
    .map((item) => item.lessonId);
  return { lessonIds: [...new Set(lessonIds)], reportPath: resolvedReportPath };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void runBatchRender().then((exitCode) => {
    process.exitCode = exitCode;
  }).catch((error) => {
    console.error(`批量渲染异常：${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
