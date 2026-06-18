import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import {
  buildBatchReport,
  createRunId,
  listLessonJsonIds,
  loadCourseManifest,
  parseBatchArgs,
  selectManifestLessons,
  writeBatchReport,
  type BatchItemResult,
} from "./batch-utils";
import { lessonPathForId } from "./media-paths";
import { lessonProjectSchema } from "../src/schemas/lesson.schema";

const main = async () => {
  const args = parseBatchArgs();
  const manifest = await loadCourseManifest();
  const startedAt = new Date().toISOString();
  const validateArgs = args.flags.has("--enabled-only")
    ? args
    : { ...args, flags: new Set([...args.flags, "--include-disabled"]) };
  const entries = selectManifestLessons(manifest, validateArgs);
  const manifestIds = new Set(manifest.lessons.map((lesson) => lesson.lessonId));
  const allLessonIds = await listLessonJsonIds();
  const unlistedIds = allLessonIds.filter((lessonId) => !manifestIds.has(lessonId));
  const items: BatchItemResult[] = [];

  for (const entry of entries) {
    const itemStartedAt = new Date().toISOString();
    const filePath = lessonPathForId(entry.lessonId);
    if (!existsSync(filePath)) {
      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "failed",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: "lesson JSON 文件不存在",
        errors: 1,
        warnings: 0,
        issues: [
          {
            severity: "error",
            code: "LESSON_FILE_MISSING",
            message: "manifest 中声明的 lesson JSON 文件不存在。",
            file: filePath,
          },
        ],
      });
      continue;
    }

    try {
      const raw = JSON.parse(await readFile(filePath, "utf8")) as unknown;
      const parsed = lessonProjectSchema.safeParse(raw);
      if (!parsed.success) {
        items.push({
          lessonId: entry.lessonId,
          title: entry.title,
          status: "failed",
          startedAt: itemStartedAt,
          finishedAt: new Date().toISOString(),
          message: "schema 校验失败",
          errors: parsed.error.issues.length,
          warnings: 0,
          issues: parsed.error.issues.map((issue) => ({
            severity: "error",
            code: "LESSON_SCHEMA_INVALID",
            message: issue.message,
            field: issue.path.map(String).join(".") || "root",
          })),
        });
        continue;
      }

      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "passed",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: "schema 校验通过",
        outputLocation: parsed.data.render.outputName,
        errors: 0,
        warnings: 0,
      });
    } catch (error) {
      items.push({
        lessonId: entry.lessonId,
        title: entry.title,
        status: "failed",
        startedAt: itemStartedAt,
        finishedAt: new Date().toISOString(),
        message: error instanceof Error ? error.message : String(error),
        errors: 1,
        warnings: 0,
      });
    }
  }

  for (const lessonId of unlistedIds) {
    items.push({
      lessonId,
      status: "skipped",
      startedAt,
      finishedAt: new Date().toISOString(),
      message: "lesson JSON 存在但未写入 course.manifest.json",
      errors: 0,
      warnings: 1,
      issues: [
        {
          severity: "warning",
          code: "LESSON_NOT_IN_MANIFEST",
          message: "该 lesson JSON 未纳入本地课程 manifest。",
          file: lessonPathForId(lessonId),
        },
      ],
    });
  }

  const report = buildBatchReport({
    kind: "validate",
    runId: createRunId("validate"),
    generatedAt: startedAt,
    finishedAt: new Date().toISOString(),
    manifestPath: "src/data/course.manifest.json",
    selectedLessonIds: entries.map((entry) => entry.lessonId),
    items,
    notes: ["validate:all 只校验 JSON/schema，不检查真实素材是否存在。素材检查请运行 preflight:all。"],
  });
  const paths = await writeBatchReport(report);

  for (const item of items) {
    console.log(`${item.status === "passed" ? "校验成功" : item.status === "skipped" ? "跳过" : "校验失败"}：${item.lessonId} (${item.message ?? ""})`);
  }
  console.log(`批量校验报告：${paths.markdownPath}`);

  if (report.totals.failed > 0) {
    process.exitCode = 1;
  }
};

void main().catch((error) => {
  console.error(`批量校验异常：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
