import { existsSync } from "node:fs";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  inferLessonIndex,
  loadCourseManifest,
  parseBatchArgs,
  writeCourseManifest,
} from "./batch-utils";
import { lessonPathForId } from "./media-paths";
import { lessonProjectSchema } from "../src/schemas/lesson.schema";

const requireValue = (value: string | undefined, message: string): string => {
  if (!value?.trim()) {
    throw new Error(message);
  }
  return value.trim();
};

const main = async () => {
  const args = parseBatchArgs();
  const fromLessonId = requireValue(
    args.values.get("--from"),
    "缺少 --from，例如 npm run create:lesson -- --from lesson-01.sample --to lesson-02",
  );
  const toLessonId = requireValue(
    args.values.get("--to"),
    "缺少 --to，例如 npm run create:lesson -- --from lesson-01.sample --to lesson-02",
  );
  const force = args.flags.has("--force");

  const fromPath = lessonPathForId(fromLessonId);
  const toPath = lessonPathForId(toLessonId);

  if (!existsSync(fromPath)) {
    throw new Error(`源 lesson 不存在：${fromPath}`);
  }
  if (existsSync(toPath) && !force) {
    throw new Error(`目标 lesson 已存在：${toPath}。如需覆盖，请显式传入 --force。`);
  }

  const rawLesson = JSON.parse(await readFile(fromPath, "utf8")) as unknown;
  const sourceLesson = lessonProjectSchema.parse(rawLesson);
  const inferredIndex = inferLessonIndex(toLessonId);
  const now = new Date().toISOString();
  const nextLesson = lessonProjectSchema.parse({
    ...sourceLesson,
    meta: {
      ...sourceLesson.meta,
      projectId: toLessonId,
      projectName: `${sourceLesson.meta.projectName} Copy`,
      lessonIndex: inferredIndex ?? sourceLesson.meta.lessonIndex,
      totalLessons: Math.max(sourceLesson.meta.totalLessons, inferredIndex ?? sourceLesson.meta.lessonIndex),
      lessonNumber: inferredIndex ? `Lesson ${String(inferredIndex).padStart(2, "0")}` : sourceLesson.meta.lessonNumber,
      description: `复制自 ${fromLessonId}，请替换课程信息、素材路径、阶段和事件后再进入批量渲染。`,
      createdAt: now,
      updatedAt: now,
    },
    render: {
      ...sourceLesson.render,
      outputDir: "out/renders",
      outputName: `${toLessonId}.mp4`,
    },
  });

  if (force) {
    await writeFile(toPath, `${JSON.stringify(nextLesson, null, 2)}\n`, "utf8");
  } else {
    await copyFile(fromPath, toPath);
    await writeFile(toPath, `${JSON.stringify(nextLesson, null, 2)}\n`, "utf8");
  }

  const manifest = await loadCourseManifest();
  const existing = manifest.lessons.find((lesson) => lesson.lessonId === toLessonId);
  const nextOrder =
    inferredIndex ??
    Math.max(...manifest.lessons.map((lesson) => lesson.order), 0) + 1;

  if (existing) {
    existing.title = nextLesson.meta.lessonTitle;
    existing.status = "draft";
    existing.enabled = true;
    existing.batchRender = false;
    existing.qaStatus = "not-started";
    existing.sourceLessonId = fromLessonId;
    existing.outputName = nextLesson.render.outputName;
    existing.notes = "由 create:lesson 复制生成；进入批量渲染前需要人工复核素材、阶段和事件。";
  } else {
    manifest.lessons.push({
      lessonId: toLessonId,
      order: nextOrder,
      title: nextLesson.meta.lessonTitle,
      status: "draft",
      enabled: true,
      batchRender: false,
      qaStatus: "not-started",
      sourceLessonId: fromLessonId,
      outputName: nextLesson.render.outputName,
      tags: ["draft"],
      notes: "由 create:lesson 复制生成；进入批量渲染前需要人工复核素材、阶段和事件。",
    });
  }

  await writeCourseManifest(manifest);

  console.log(`已创建 lesson：${path.relative(process.cwd(), toPath)}`);
  console.log(`已更新 manifest：${toLessonId}`);
  console.log("注意：新 lesson 默认 batchRender=false，请替换素材和时间轴并完成 preflight 后再打开批量渲染。");
};

void main().catch((error) => {
  console.error(`创建 lesson 失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
