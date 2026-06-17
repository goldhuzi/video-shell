import { useMemo, useState } from "react";
import { EditorShell } from "./EditorShell";
import { lesson01 } from "../utils/loadLesson";
import { deriveHudState } from "../utils/timeline";
import type { HudComponentKey, LessonProjectConfig } from "../schemas/lesson.schema";
import { createEditorLessonState } from "./state/editorState";
import { downloadLessonJson, prepareLessonForExport } from "./utils/exportLesson";
import { validateEditorLesson } from "./utils/validateEditorLesson";

export type { HudRuntimeState } from "../utils/timeline";
export type {
  CourseStage,
  HudComponentKey,
  LessonProjectConfig,
  TimelineEvent,
} from "../schemas/lesson.schema";

export type TimelineView = "stages" | "events" | "validation";

export function App() {
  const [currentTime, setCurrentTime] = useState(152);
  const [selectedComponent, setSelectedComponent] = useState<HudComponentKey>("warning_panel");
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>("stage-filter");
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>("event-warning-filter");
  const [activeTimelineView, setActiveTimelineView] = useState<TimelineView>("stages");
  const [editorState, setEditorState] = useState(() => createEditorLessonState(lesson01));

  const hudState = useMemo(
    () => deriveHudState(editorState.lesson, currentTime),
    [currentTime, editorState.lesson],
  );

  const updateLesson = (updater: (draft: LessonProjectConfig) => void) => {
    setEditorState((current) => {
      const draft = structuredClone(current.lesson);
      updater(draft);

      return {
        ...current,
        lesson: draft,
        validation: {
          status: "idle",
          issues: [],
        },
        message: {
          tone: "idle",
          text: "配置已修改，等待校验或导出",
        },
      };
    });
  };

  const handleValidate = () => {
    const validation = validateEditorLesson(editorState.lesson);
    setEditorState((current) => ({
      ...current,
      validation,
      message:
        validation.status === "valid"
          ? { tone: "success", text: "配置校验通过" }
          : { tone: "error", text: `配置校验失败：${validation.issues.length} 项需要修正` },
    }));
  };

  const handleExport = () => {
    const exportLesson = prepareLessonForExport(editorState.lesson);
    const validation = validateEditorLesson(exportLesson);

    if (validation.status === "invalid") {
      setEditorState((current) => ({
        ...current,
        validation,
        message: {
          tone: "error",
          text: "导出已阻止：请先修正校验错误",
        },
      }));
      setActiveTimelineView("validation");
      return;
    }

    downloadLessonJson(exportLesson);
    setEditorState((current) => ({
      ...current,
      lesson: exportLesson,
      validation,
      lastExportedAt: new Date().toISOString(),
      message: {
        tone: "success",
        text: "已导出 lesson-01.edited.json",
      },
    }));
  };

  const handleSave = () => {
    setEditorState((current) => ({
      ...current,
      message: {
        tone: "warning",
        text: "当前版本不直接写回文件，请使用“导出配置”后手动替换 lesson JSON",
      },
    }));
  };

  const handleRender = () => {
    setEditorState((current) => ({
      ...current,
      message: {
        tone: "warning",
        text: "请先导出并替换 lesson JSON，再在终端运行 npm run preflight:render -- lesson-01；主视频补齐后运行 npm run render:lesson -- lesson-01",
      },
    }));
  };

  const handleRefresh = () => {
    setEditorState((current) => ({
      ...current,
      message: {
        tone: "success",
        text: "预览已根据当前配置刷新",
      },
    }));
  };

  const handleDurationChange = (duration: number) => {
    updateLesson((draft) => {
      draft.media.mainVideo.duration = duration;
    });
  };

  return (
    <EditorShell
      activeTimelineView={activeTimelineView}
      currentTime={currentTime}
      editorState={editorState}
      hudState={hudState}
      lesson={editorState.lesson}
      selectedComponent={selectedComponent}
      selectedEventId={selectedEventId}
      selectedStageId={selectedStageId}
      onCurrentTimeChange={setCurrentTime}
      onDurationChange={handleDurationChange}
      onExportLesson={handleExport}
      onRefreshPreview={handleRefresh}
      onRenderRequest={handleRender}
      onSaveLesson={handleSave}
      onSelectedComponentChange={setSelectedComponent}
      onSelectedEventIdChange={setSelectedEventId}
      onSelectedStageIdChange={setSelectedStageId}
      onTimelineViewChange={setActiveTimelineView}
      onUpdateLesson={updateLesson}
      onValidateLesson={handleValidate}
    />
  );
}
