import { lessonProjectSchema, type LessonProjectConfig } from "../../schemas/lesson.schema";
import type { EditorValidationIssue, EditorValidationState } from "../state/editorState";

function issuePath(path: Array<PropertyKey>): string {
  return path.length > 0 ? path.join(".") : "root";
}

export function validateEditorLesson(input: unknown): EditorValidationState {
  const result = lessonProjectSchema.safeParse(input);
  const checkedAt = new Date().toISOString();

  if (result.success) {
    return {
      status: "valid",
      issues: [],
      checkedAt,
    };
  }

  const issues: EditorValidationIssue[] = result.error.issues.map((issue) => ({
    path: issuePath(issue.path),
    message: issue.message,
  }));

  return {
    status: "invalid",
    issues,
    checkedAt,
  };
}

export function parseEditorLesson(input: unknown): LessonProjectConfig {
  return lessonProjectSchema.parse(input);
}
