import lesson01Json from "../data/lessons/lesson-01.json";
import { lessonProjectSchema, type LessonProjectConfig } from "../schemas/lesson.schema";

export function parseLesson(input: unknown): LessonProjectConfig {
  return lessonProjectSchema.parse(input);
}

export function loadLesson(input: unknown = lesson01Json): LessonProjectConfig {
  return parseLesson(input);
}

export const lesson01 = loadLesson();

