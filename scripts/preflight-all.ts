import {
  buildBatchReport,
  createRunId,
  loadCourseManifest,
  parseBatchArgs,
  selectManifestLessons,
  writeBatchReport,
  type BatchItemResult,
} from "./batch-utils";
import { runRenderPreflight } from "./preflight-render";

const main = async () => {
  const args = parseBatchArgs();
  const manifest = await loadCourseManifest();
  const startedAt = new Date().toISOString();
  const entries = selectManifestLessons(manifest, args);
  const items: BatchItemResult[] = [];

  for (const entry of entries) {
    const itemStartedAt = new Date().toISOString();
    const result = await runRenderPreflight({
      lessonId: entry.lessonId,
      outputDirOverride: manifest.project.defaultOutputDir,
      outputNameOverride: entry.outputName,
    });
    const errors = result.issues.filter((issue) => issue.severity === "error").length;
    const warnings = result.issues.filter((issue) => issue.severity === "warning").length;

    items.push({
      lessonId: entry.lessonId,
      title: entry.title,
      status: result.ok ? "passed" : "failed",
      startedAt: itemStartedAt,
      finishedAt: new Date().toISOString(),
      message: result.ok ? "preflight 通过" : "preflight 失败",
      outputLocation: result.outputLocation,
      durationSeconds: result.durationSeconds,
      errors,
      warnings,
      issues: result.issues,
    });

    console.log(`${result.ok ? "预检通过" : "预检失败"}：${entry.lessonId} (${errors} error, ${warnings} warning)`);
  }

  const report = buildBatchReport({
    kind: "preflight",
    runId: createRunId("preflight"),
    generatedAt: startedAt,
    finishedAt: new Date().toISOString(),
    manifestPath: "src/data/course.manifest.json",
    selectedLessonIds: entries.map((entry) => entry.lessonId),
    items,
    notes: [
      "preflight:all 默认只检查 manifest 中 enabled=true 的 lesson。",
      "占位 lesson 可用 --include-disabled 或 --all 显式纳入，以便验证失败路径。",
    ],
  });
  const paths = await writeBatchReport(report);
  console.log(`批量预检报告：${paths.markdownPath}`);

  if (report.totals.failed > 0) {
    process.exitCode = 1;
  }
};

void main().catch((error) => {
  console.error(`批量预检异常：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
