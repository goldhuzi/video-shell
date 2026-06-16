import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const compositionId = "CourseShellComposition";
const rootDir = process.cwd();
const lessonPath = path.join(rootDir, "src", "data", "lessons", "lesson-01.json");
const entryPoint = path.join(rootDir, "src", "remotion", "Root.tsx");
const outputLocation = path.join(rootDir, "out", "lesson-01-sample.mp4");

const main = async () => {
  if (!existsSync(lessonPath)) {
    throw new Error(`未找到样例课程配置：${lessonPath}`);
  }

  const lesson = JSON.parse(await readFile(lessonPath, "utf8")) as Record<
    string,
    unknown
  >;
  const sampleLesson = {
    ...lesson,
    render: {
      ...((lesson.render as Record<string, unknown> | undefined) ?? {}),
      durationSeconds: 60,
    },
  };
  await mkdir(path.dirname(outputLocation), { recursive: true });

  console.log("开始打包 Remotion composition...");
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log("读取 CourseShellComposition 元信息...");
  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
    inputProps: { lesson: sampleLesson },
  });

  console.log(`开始渲染样片：${outputLocation}`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    inputProps: { lesson: sampleLesson },
    outputLocation,
  });

  console.log(`渲染成功：${outputLocation}`);
};

main().catch((error) => {
  console.error(
    `渲染失败：${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
});
