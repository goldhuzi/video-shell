import { existsSync } from "node:fs";
import {
  courseManifestPath,
  listLessonJsonIds,
  loadCourseManifest,
  loadLessonById,
} from "./batch-utils";
import { lessonPathForId } from "./media-paths";

const main = async () => {
  const manifest = await loadCourseManifest();
  const lessonJsonIds = await listLessonJsonIds();
  const listedIds = new Set(manifest.lessons.map((lesson) => lesson.lessonId));

  console.log(`课程 manifest：${courseManifestPath}`);
  console.log(`项目：${manifest.project.name}`);
  console.log("");
  console.log("Lesson 清单：");

  for (const entry of [...manifest.lessons].sort((a, b) => a.order - b.order)) {
    const filePath = lessonPathForId(entry.lessonId);
    let schemaStatus = existsSync(filePath) ? "unchecked" : "missing";
    let outputName = entry.outputName ?? "";
    let duration = "";

    if (existsSync(filePath)) {
      try {
        const lesson = await loadLessonById(entry.lessonId);
        schemaStatus = "valid";
        outputName = entry.outputName ?? lesson.render.outputName;
        duration =
          lesson.media.mainVideo.duration !== undefined
            ? `${lesson.media.mainVideo.duration.toFixed(2)}s`
            : "";
      } catch (error) {
        schemaStatus = "invalid";
      }
    }

    console.log(
      [
        `${String(entry.order).padStart(2, "0")}. ${entry.lessonId}`,
        `title=${entry.title}`,
        `status=${entry.status}`,
        `enabled=${entry.enabled}`,
        `batchRender=${entry.batchRender}`,
        `schema=${schemaStatus}`,
        outputName ? `output=${outputName}` : "",
        duration ? `duration=${duration}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    );
  }

  const unlisted = lessonJsonIds.filter((lessonId) => !listedIds.has(lessonId));
  if (unlisted.length) {
    console.log("");
    console.log(`未写入 manifest 的 lesson JSON：${unlisted.join(", ")}`);
  }
};

void main().catch((error) => {
  console.error(`列出 lesson 失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
