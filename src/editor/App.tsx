import { useMemo, useState } from "react";
import { EditorShell } from "./EditorShell";
import { lesson01 } from "../utils/loadLesson";
import { deriveHudState } from "../utils/timeline";
import type { HudComponentKey } from "../schemas/lesson.schema";

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
  const [activeTimelineView, setActiveTimelineView] = useState<TimelineView>("stages");

  const hudState = useMemo(() => deriveHudState(lesson01, currentTime), [currentTime]);

  return (
    <EditorShell
      activeTimelineView={activeTimelineView}
      currentTime={currentTime}
      hudState={hudState}
      lesson={lesson01}
      selectedComponent={selectedComponent}
      onCurrentTimeChange={setCurrentTime}
      onSelectedComponentChange={setSelectedComponent}
      onTimelineViewChange={setActiveTimelineView}
    />
  );
}
