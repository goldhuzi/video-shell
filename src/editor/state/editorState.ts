import type { LessonProjectConfig } from "../../schemas/lesson.schema";

export type EditorStatusMessage = {
  tone: "idle" | "success" | "warning" | "error";
  text: string;
};

export type EditorValidationIssue = {
  path: string;
  message: string;
};

export type EditorValidationState = {
  status: "idle" | "valid" | "invalid";
  issues: EditorValidationIssue[];
  checkedAt?: string;
};

export type EditorLessonState = {
  lesson: LessonProjectConfig;
  validation: EditorValidationState;
  lastExportedAt?: string;
  message: EditorStatusMessage;
};

export function cloneLesson(lesson: LessonProjectConfig): LessonProjectConfig {
  return structuredClone(lesson);
}

export function createEditorLessonState(
  lesson: LessonProjectConfig,
): EditorLessonState {
  return {
    lesson: cloneLesson(lesson),
    validation: {
      status: "idle",
      issues: [],
    },
    message: {
      tone: "idle",
      text: "已加载 lesson-01 配置草稿",
    },
  };
}
