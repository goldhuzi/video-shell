import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

type ValidationIssue = {
  path?: Array<string | number>;
  message: string;
};

type ZodLikeSchema = {
  safeParse: (value: unknown) =>
    | { success: true; data: unknown }
    | { success: false; error: { issues?: ValidationIssue[]; message?: string } };
};

const rootDir = process.cwd();
const lessonsDir = path.join(rootDir, "src", "data", "lessons");

const loadLessonSchema = async (): Promise<ZodLikeSchema> => {
  const candidates = [
    path.join(rootDir, "src", "schemas", "lessonConfig.schema.ts"),
    path.join(rootDir, "src", "schemas", "lesson.schema.ts"),
    path.join(rootDir, "src", "schemas", "lessonProjectConfig.schema.ts"),
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue;
    }

    const moduleExports = (await import(pathToFileURL(candidate).href)) as Record<
      string,
      unknown
    >;
    const schema =
      moduleExports.lessonProjectConfigSchema ??
      moduleExports.lessonProjectSchema ??
      moduleExports.LessonProjectConfigSchema ??
      moduleExports.lessonConfigSchema ??
      moduleExports.default;

    if (
      schema &&
      typeof schema === "object" &&
      "safeParse" in schema &&
      typeof (schema as ZodLikeSchema).safeParse === "function"
    ) {
      return schema as ZodLikeSchema;
    }
  }

  throw new Error(
    "未找到 lesson 配置 Zod schema。请确认 Data Model Agent 已导出 lessonProjectConfigSchema。",
  );
};

const formatIssue = (issue: ValidationIssue): string => {
  const fieldPath = issue.path?.length ? issue.path.join(".") : "root";
  return `${fieldPath}: ${issue.message}`;
};

const main = async () => {
  if (!existsSync(lessonsDir)) {
    console.error(`校验失败：未找到课程配置目录 ${lessonsDir}`);
    process.exitCode = 1;
    return;
  }

  const files = (await readdir(lessonsDir))
    .filter((file) => file.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error("校验失败：src/data/lessons 下没有 lesson JSON 文件。");
    process.exitCode = 1;
    return;
  }

  let schema: ZodLikeSchema;
  try {
    schema = await loadLessonSchema();
  } catch (error) {
    console.error(
      `校验失败：${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
    return;
  }

  let hasFailure = false;

  for (const file of files) {
    const filePath = path.join(lessonsDir, file);

    try {
      const json = JSON.parse(await readFile(filePath, "utf8")) as unknown;
      const result = schema.safeParse(json);

      if (result.success) {
        console.log(`校验成功：${file}`);
        continue;
      }

      hasFailure = true;
      console.error(`校验失败：${file}`);
      for (const issue of result.error.issues ?? []) {
        console.error(`  - ${formatIssue(issue)}`);
      }
      if (!result.error.issues?.length && result.error.message) {
        console.error(`  - ${result.error.message}`);
      }
    } catch (error) {
      hasFailure = true;
      console.error(
        `校验失败：${file}：${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  if (hasFailure) {
    process.exitCode = 1;
    return;
  }

  console.log(`全部课程配置校验成功，共 ${files.length} 个文件。`);
};

void main();
