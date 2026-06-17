import type { LessonProjectConfig } from "../../schemas/lesson.schema";

const fitModeForLayout = (
  fitMode: LessonProjectConfig["media"]["mainVideoFitMode"],
): LessonProjectConfig["layout"]["mainVideoFitMode"] => {
  if (fitMode === "fit-width") {
    return "fit_width";
  }

  if (fitMode === "fit-height") {
    return "fit_height";
  }

  return fitMode;
};

export function prepareLessonForExport(
  lesson: LessonProjectConfig,
): LessonProjectConfig {
  return {
    ...lesson,
    meta: {
      ...lesson.meta,
      updatedAt: new Date().toISOString(),
    },
    media: {
      ...lesson.media,
      mainVideoFitMode: lesson.media.mainVideoFitMode,
    },
    layout: {
      ...lesson.layout,
      mainVideoFitMode: fitModeForLayout(lesson.media.mainVideoFitMode),
    },
  };
}

export function lessonToJson(lesson: LessonProjectConfig): string {
  return `${JSON.stringify(prepareLessonForExport(lesson), null, 2)}\n`;
}

export function downloadLessonJson(
  lesson: LessonProjectConfig,
  fileName = "lesson-01.edited.json",
) {
  const blob = new Blob([lessonToJson(lesson)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
