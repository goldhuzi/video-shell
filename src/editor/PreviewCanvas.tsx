import type { HudComponentKey, HudRuntimeState, LessonProjectConfig } from "./App";
import { BottomStatusHud } from "../components/hud/BottomStatusHud";
import { ChapterMap } from "../components/hud/ChapterMap";
import { CourseStageBar } from "../components/hud/CourseStageBar";
import { LecturerMiniCard } from "../components/hud/LecturerMiniCard";
import { TaskTracker } from "../components/hud/TaskTracker";
import { TopHeader } from "../components/hud/TopHeader";
import { WarningPanel } from "../components/hud/WarningPanel";

type PreviewCanvasProps = {
  lesson: LessonProjectConfig;
  hudState: HudRuntimeState;
  selectedComponent: HudComponentKey;
  onSelectedComponentChange: (component: HudComponentKey) => void;
};

type SelectableHudProps = {
  componentKey: HudComponentKey;
  selectedComponent: HudComponentKey;
  onSelectedComponentChange: (component: HudComponentKey) => void;
  className?: string;
  children: React.ReactNode;
};

function SelectableHud({
  children,
  className,
  componentKey,
  selectedComponent,
  onSelectedComponentChange,
}: SelectableHudProps) {
  const isSelected = selectedComponent === componentKey;

  return (
    <button
      aria-label={`选择 ${componentKey}`}
      className={`hud-select-target ${className ?? ""} ${isSelected ? "is-selected" : ""}`}
      onClick={() => onSelectedComponentChange(componentKey)}
      type="button"
    >
      {children}
    </button>
  );
}

export function PreviewCanvas({
  lesson,
  hudState,
  selectedComponent,
  onSelectedComponentChange,
}: PreviewCanvasProps) {
  const bottomStatus = hudState.activeBottomStatus
    ? ({
        statusType: hudState.activeSkillIds.length > 0 ? "skill_unlocked" : "warning_sync",
        title: hudState.activeBottomStatus.title,
        body: hudState.activeBottomStatus.body ?? lesson.meta.mainMission ?? "时间轴状态已同步",
      } as const)
    : ({
        statusType: "idle",
        title: hudState.currentStage ? `当前阶段：${hudState.currentStage.name}` : "HUD 待机",
        body: lesson.meta.mainMission ?? "等待课程事件触发",
      } as const);

  return (
    <div className="preview-stage">
      <div className="video-canvas" aria-label="16:9 最终视频画框">
        <SelectableHud
          className="top-header-slot"
          componentKey="top_header"
          onSelectedComponentChange={onSelectedComponentChange}
          selectedComponent={selectedComponent}
        >
          <TopHeader
            chapterTitle={lesson.meta.chapterTitle ?? "Course Chapter"}
            courseCode={lesson.meta.courseCode ?? "HUD"}
            courseTitle={lesson.meta.courseTitle}
            currentStageName={hudState.currentStage?.shortName ?? hudState.currentStage?.name}
            lessonNumber={lesson.meta.lessonNumber ?? `Lesson ${lesson.meta.lessonIndex}`}
            lessonTitle={lesson.meta.lessonTitle}
            statusLabel={lesson.meta.statusLabel ?? "MISSION READY"}
          />
        </SelectableHud>

        <SelectableHud
          className="main-video-slot"
          componentKey="main_video_frame"
          onSelectedComponentChange={onSelectedComponentChange}
          selectedComponent={selectedComponent}
        >
          <div className="main-video-frame">
            <div className="main-video-placeholder">
              <span>MAIN COURSE VIDEO</span>
              <strong>{lesson.meta.lessonTitle}</strong>
              <small>最终 MP4 中此处承载主课程视频内容</small>
            </div>
          </div>
        </SelectableHud>

        <div className="right-hud-stack">
          <SelectableHud
            componentKey="chapter_map"
            onSelectedComponentChange={onSelectedComponentChange}
            selectedComponent={selectedComponent}
          >
            <ChapterMap nodes={lesson.chapterMap.nodes} nodeStates={hudState.mapNodeStates} />
          </SelectableHud>
          <SelectableHud
            componentKey="task_tracker"
            onSelectedComponentChange={onSelectedComponentChange}
            selectedComponent={selectedComponent}
          >
            <TaskTracker tasks={lesson.tasks} taskStates={hudState.taskStates} />
          </SelectableHud>
          <SelectableHud
            componentKey="warning_panel"
            onSelectedComponentChange={onSelectedComponentChange}
            selectedComponent={selectedComponent}
          >
            <WarningPanel hint={hudState.activeHint} />
          </SelectableHud>
        </div>

        <div className="bottom-hud-row">
          <SelectableHud
            componentKey="lecturer_mini_card"
            onSelectedComponentChange={onSelectedComponentChange}
            selectedComponent={selectedComponent}
          >
            <LecturerMiniCard
              displayMode={lesson.speaker.displayMode}
              lecturerName={lesson.speaker.name ?? "Course Operator"}
              lecturerTitle={lesson.speaker.title ?? "Course Coach"}
            />
          </SelectableHud>
          <SelectableHud
            className="stage-bar-slot"
            componentKey="course_stage_bar"
            onSelectedComponentChange={onSelectedComponentChange}
            selectedComponent={selectedComponent}
          >
            <CourseStageBar
              stages={lesson.stages.map((stage) => ({
                id: stage.id,
                name: stage.name,
                shortName: stage.shortName ?? stage.name,
              }))}
              stageStates={hudState.stageStates}
            />
          </SelectableHud>
          <SelectableHud
            className="bottom-status-slot"
            componentKey="bottom_status_hud"
            onSelectedComponentChange={onSelectedComponentChange}
            selectedComponent={selectedComponent}
          >
            <BottomStatusHud status={bottomStatus} />
          </SelectableHud>
        </div>
      </div>
    </div>
  );
}
