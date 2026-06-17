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
  onStageClick?: (stageId: string, startTime?: number) => void;
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
    <div
      aria-label={`选择 ${componentKey}`}
      className={`hud-select-target ${className ?? ""} ${isSelected ? "is-selected" : ""}`}
      onClick={() => onSelectedComponentChange(componentKey)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectedComponentChange(componentKey);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export function PreviewCanvas({
  lesson,
  hudState,
  selectedComponent,
  onSelectedComponentChange,
  onStageClick,
}: PreviewCanvasProps) {
  const showTopHeader = lesson.layout.showTopHeader ?? lesson.layout.topHeader.visible;
  const showRightPanel = lesson.layout.showRightPanel ?? lesson.layout.rightSidebar.visible;
  const showBottomHud = lesson.layout.showBottomHud ?? lesson.layout.bottomStatusHud.visible;
  const showLecturerCard = lesson.layout.showLecturerCard ?? lesson.layout.lecturer.visible;
  const showCourseStageBar = lesson.layout.showCourseStageBar ?? lesson.layout.stageBar.visible;
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
        {showTopHeader ? (
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
              lessonNumber={`${lesson.meta.lessonIndex}/${lesson.meta.totalLessons}`}
              lessonTitle={lesson.meta.lessonTitle}
              statusLabel={lesson.meta.statusLabel ?? "MISSION READY"}
            />
          </SelectableHud>
        ) : null}

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
              <small>{lesson.media.mainVideo.src} · {lesson.media.mainVideoFitMode}</small>
            </div>
          </div>
        </SelectableHud>

        {showRightPanel ? (
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
        ) : null}

        <div className="bottom-hud-row">
          {showLecturerCard ? (
            <SelectableHud
              componentKey="lecturer_mini_card"
              onSelectedComponentChange={onSelectedComponentChange}
              selectedComponent={selectedComponent}
            >
              <LecturerMiniCard
                displayMode={lesson.speaker.displayMode}
                lecturerName={lesson.speaker.name ?? "Course Operator"}
                lecturerTitle={lesson.speaker.role ?? lesson.speaker.title ?? "Course Coach"}
                stats={lesson.speaker.stats}
              />
            </SelectableHud>
          ) : <div />}
          {showCourseStageBar ? (
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
                  startTime: stage.startTime,
                  endTime: stage.endTime,
                }))}
                mode="editor"
                stageStates={hudState.stageStates}
                onStageClick={onStageClick}
              />
            </SelectableHud>
          ) : <div />}
          {showBottomHud ? (
            <SelectableHud
              className="bottom-status-slot"
              componentKey="bottom_status_hud"
              onSelectedComponentChange={onSelectedComponentChange}
              selectedComponent={selectedComponent}
            >
              <BottomStatusHud status={bottomStatus} />
            </SelectableHud>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
