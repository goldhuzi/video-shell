import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  courseManifestSchema,
  type CourseManifest,
  type CourseManifestLesson,
} from "../src/schemas/course-manifest.schema";
import {
  lessonProjectSchema,
  type LessonProjectConfig,
} from "../src/schemas/lesson.schema";
import { lessonPathForId, lessonsDir, rootDir } from "./media-paths";

export type { CourseManifestLesson };

export const courseManifestPath = path.join(rootDir, "src", "data", "course.manifest.json");

export type BatchArgs = {
  flags: Set<string>;
  values: Map<string, string>;
  positionals: string[];
};

export type BatchItemStatus =
  | "passed"
  | "failed"
  | "skipped"
  | "preflight_failed"
  | "rendered"
  | "dry_run";

export type BatchItemResult = {
  lessonId: string;
  title?: string;
  status: BatchItemStatus;
  startedAt: string;
  finishedAt: string;
  message?: string;
  outputLocation?: string;
  durationSeconds?: number;
  errors: number;
  warnings: number;
  issues?: Array<{
    severity: "error" | "warning";
    code: string;
    message: string;
    field?: string;
    file?: string;
    suggestion?: string;
  }>;
};

export type BatchReport = {
  kind: "validate" | "preflight" | "render";
  runId: string;
  generatedAt: string;
  finishedAt: string;
  manifestPath: string;
  selectedLessonIds: string[];
  totals: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    warnings: number;
  };
  items: BatchItemResult[];
  notes?: string[];
};

export const parseBatchArgs = (args = process.argv.slice(2)): BatchArgs => {
  const flags = new Set<string>();
  const values = new Map<string, string>();
  const positionals: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const inlineValueIndex = arg.indexOf("=");
    if (inlineValueIndex > 0) {
      values.set(arg.slice(0, inlineValueIndex), arg.slice(inlineValueIndex + 1));
      continue;
    }

    const next = args[index + 1];
    if (next && !next.startsWith("--")) {
      values.set(arg, next);
      index += 1;
    } else {
      flags.add(arg);
    }
  }

  return { flags, values, positionals };
};

export const parseCsvValue = (value?: string): string[] =>
  value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export const loadCourseManifest = async (): Promise<CourseManifest> => {
  if (!existsSync(courseManifestPath)) {
    throw new Error(`未找到课程 manifest：${courseManifestPath}`);
  }

  const raw = JSON.parse(await readFile(courseManifestPath, "utf8")) as unknown;
  return courseManifestSchema.parse(raw);
};

export const writeCourseManifest = async (manifest: CourseManifest): Promise<void> => {
  const parsed = courseManifestSchema.parse({
    ...manifest,
    updatedAt: new Date().toISOString(),
  });
  await writeFile(courseManifestPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
};

export const listLessonJsonIds = async (): Promise<string[]> => {
  if (!existsSync(lessonsDir)) {
    return [];
  }

  const files = await readdir(lessonsDir);
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort((a, b) => a.localeCompare(b));
};

export const loadLessonById = async (lessonId: string): Promise<LessonProjectConfig> => {
  const lessonPath = lessonPathForId(lessonId);
  const raw = JSON.parse(await readFile(lessonPath, "utf8")) as unknown;
  return lessonProjectSchema.parse(raw);
};

export const selectManifestLessons = (
  manifest: CourseManifest,
  args: BatchArgs,
  options: { renderOnly?: boolean } = {},
): CourseManifestLesson[] => {
  const lessonFilter = new Set(parseCsvValue(args.values.get("--lesson")));
  const statusFilter = new Set(parseCsvValue(args.values.get("--status")));
  const includeDisabled = args.flags.has("--include-disabled") || args.flags.has("--all");
  const includeNonRenderable = args.flags.has("--include-non-renderable") || args.flags.has("--all");

  return manifest.lessons
    .filter((lesson) => lessonFilter.size === 0 || lessonFilter.has(lesson.lessonId))
    .filter((lesson) => statusFilter.size === 0 || statusFilter.has(lesson.status))
    .filter((lesson) => includeDisabled || lesson.enabled)
    .filter((lesson) => !options.renderOnly || includeNonRenderable || lesson.batchRender)
    .sort((a, b) => a.order - b.order || a.lessonId.localeCompare(b.lessonId));
};

export const createRunId = (kind: BatchReport["kind"]): string => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  return `batch-${kind}-${timestamp}`;
};

export const buildBatchReport = (
  report: Omit<BatchReport, "totals">,
): BatchReport => {
  const totals = report.items.reduce(
    (summary, item) => {
      summary.total += 1;
      summary.warnings += item.warnings;
      if (item.status === "passed" || item.status === "rendered" || item.status === "dry_run") {
        summary.passed += 1;
      } else if (item.status === "skipped") {
        summary.skipped += 1;
      } else {
        summary.failed += 1;
      }
      return summary;
    },
    { total: 0, passed: 0, failed: 0, skipped: 0, warnings: 0 },
  );

  return { ...report, totals };
};

const toMarkdownReport = (report: BatchReport): string => {
  const lines = [
    `# ${report.runId}`,
    "",
    `- 类型：${report.kind}`,
    `- 开始：${report.generatedAt}`,
    `- 结束：${report.finishedAt}`,
    `- Manifest：${report.manifestPath}`,
    `- 总数：${report.totals.total}`,
    `- 通过：${report.totals.passed}`,
    `- 失败：${report.totals.failed}`,
    `- 跳过：${report.totals.skipped}`,
    `- 警告：${report.totals.warnings}`,
    "",
  ];

  if (report.notes?.length) {
    lines.push("## 说明", "");
    for (const note of report.notes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
  }

  lines.push("## Lessons", "");
  lines.push("| Lesson | 状态 | 错误 | 警告 | 输出 | 说明 |");
  lines.push("| --- | --- | ---: | ---: | --- | --- |");
  for (const item of report.items) {
    lines.push(
      `| ${item.lessonId} | ${item.status} | ${item.errors} | ${item.warnings} | ${item.outputLocation ?? ""} | ${(item.message ?? "").replace(/\|/g, "/")} |`,
    );
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
};

export const writeBatchReport = async (report: BatchReport): Promise<{ jsonPath: string; markdownPath: string }> => {
  const manifest = await loadCourseManifest();
  const reportDir = path.resolve(rootDir, manifest.project.reportDir);
  await mkdir(reportDir, { recursive: true });

  const jsonPath = path.join(reportDir, `${report.runId}.json`);
  const markdownPath = path.join(reportDir, `${report.runId}.md`);
  const latestJsonPath = path.join(reportDir, `batch-${report.kind}-latest.json`);
  const latestMarkdownPath = path.join(reportDir, `batch-${report.kind}-latest.md`);

  await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, toMarkdownReport(report), "utf8");
  await copyFile(jsonPath, latestJsonPath);
  await copyFile(markdownPath, latestMarkdownPath);

  return { jsonPath, markdownPath };
};

export const readBatchReport = async (reportPath: string): Promise<BatchReport> => {
  const raw = JSON.parse(await readFile(reportPath, "utf8")) as BatchReport;
  return raw;
};

export const resolveLatestReportPath = async (
  kind: BatchReport["kind"],
): Promise<string> => {
  const manifest = await loadCourseManifest();
  return path.resolve(rootDir, manifest.project.reportDir, `batch-${kind}-latest.json`);
};

export const inferLessonIndex = (lessonId: string): number | undefined => {
  const match = lessonId.match(/(?:lesson-|^)(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : undefined;
};

export const formatIssueCount = (errors: number, warnings: number): string =>
  `${errors} error(s), ${warnings} warning(s)`;
