import type { LessonProjectConfigLike } from "../CourseShellComposition";

type HudRuntimeStateLike = {
  currentTime?: number;
  currentStageId?: string;
  stageStates?: Record<string, string>;
  mapNodeStates?: Record<string, string>;
  taskStates?: Record<string, string>;
  activeHint?: {
    id?: string;
    hintType?: string;
    title?: string;
    body?: string;
    sourceEventId?: string;
  };
  activeWarning?: {
    id?: string;
    hintType?: string;
    title?: string;
    body?: string;
    sourceEventId?: string;
  };
  activeBottomStatus?: {
    title?: string;
    label?: string;
    message?: string;
    body?: string;
    kind?: string;
    sourceEventId?: string;
  };
  activeSummary?: {
    id?: string;
    hintType?: string;
    title?: string;
    body?: string;
    sourceEventId?: string;
  };
  activeHomework?: {
    id?: string;
    hintType?: string;
    title?: string;
    body?: string;
    sourceEventId?: string;
  };
  activeEvents?: Array<{
    id: string;
    type?: string;
    payload?: Record<string, unknown>;
  }>;
  activeSkillIds?: string[];
  unlockedAbilities?: Array<{
    id: string;
    label: string;
    description?: string;
    sourceEventId: string;
  }>;
};

type HudLayerProps = {
  lesson: LessonProjectConfigLike;
  hudState: HudRuntimeStateLike;
  currentTime: number;
};

const getCurrentStage = (
  lesson: LessonProjectConfigLike,
  hudState: HudRuntimeStateLike,
) => {
  return lesson.stages?.find((stage) => stage.id === hudState.currentStageId);
};

const getCourseMeta = (lesson: LessonProjectConfigLike) => {
  return lesson.meta ?? lesson.course;
};

const stateClass = (state?: string): string => {
  if (state === "current") {
    return "render-is-current";
  }

  if (state === "completed") {
    return "render-is-completed";
  }

  if (state === "unlocked") {
    return "render-is-unlocked";
  }

  if (state === "locked") {
    return "render-is-locked";
  }

  return "render-is-not_started";
};

const stateLabel = (state?: string): string => {
  if (state === "current") {
    return "ACTIVE";
  }

  if (state === "completed") {
    return "DONE";
  }

  if (state === "unlocked") {
    return "OPEN";
  }

  if (state === "locked") {
    return "LOCK";
  }

  return "NEXT";
};

const stageStateLabel = (state?: string): string => {
  if (state === "current") {
    return "当前模块";
  }

  if (state === "completed") {
    return "已完成";
  }

  return "待启动";
};

const getPositionClass = (positionPreset?: string) => {
  if (positionPreset === "bottom-right") {
    return "is-bottom-right";
  }

  if (positionPreset === "in-bottom-hud") {
    return "is-in-bottom-hud";
  }

  return "is-bottom-left";
};

const asStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
};

const findSourceEvent = (
  hudState: HudRuntimeStateLike,
  sourceEventId?: string,
) => {
  return sourceEventId
    ? hudState.activeEvents?.find((event) => event.id === sourceEventId)
    : undefined;
};

const getNoticeLines = (
  hudState: HudRuntimeStateLike,
  sourceEventId?: string,
): string[] => {
  const payload = findSourceEvent(hudState, sourceEventId)?.payload;
  return [
    ...asStringList(payload?.bullets),
    ...asStringList(payload?.checklist),
  ].slice(0, 3);
};

const getNoticeLabel = (hintType?: string) => {
  if (hintType === "summary") {
    return "SUMMARY";
  }

  if (hintType === "homework") {
    return "HOMEWORK";
  }

  if (hintType === "warning") {
    return "WARNING";
  }

  if (hintType === "beginner_tip") {
    return "BEGINNER TIP";
  }

  return "NOTICE";
};

const getBottomStatusLabel = (
  hudState: HudRuntimeStateLike,
  sourceEventId?: string,
) => {
  const eventType = findSourceEvent(hudState, sourceEventId)?.type;

  if (eventType === "ability_unlock" || eventType === "skill_unlock") {
    return "ABILITY UNLOCKED";
  }

  if (eventType === "summary_show" || eventType === "stage_summary") {
    return "STAGE SUMMARY";
  }

  if (eventType === "homework_show" || eventType === "homework_reminder") {
    return "HOMEWORK READY";
  }

  return "BOTTOM STATUS HUD";
};

const TopHeader = ({
  lesson,
  currentStageName,
}: {
  lesson: LessonProjectConfigLike;
  currentStageName?: string;
}) => {
  const course = getCourseMeta(lesson);
  const lessonCounter =
    course?.lessonIndex && course?.totalLessons
      ? `${course.lessonIndex}/${course.totalLessons}`
      : course?.lessonNumber;

  if (lesson.layout?.topHeader?.visible === false || lesson.layout?.showTopHeader === false) {
    return null;
  }

  return (
    <div className="render-hud-panel render-top-header">
      <div className="render-top-brand">
        <span>{course?.courseCode ?? "COURSE HUD"}</span>
        <strong>{lessonCounter ?? "LESSON"}</strong>
      </div>
      <div className="render-top-title">
        <strong>
          {course?.courseTitle ??
            lesson.meta?.projectName ??
            lesson.project?.name ??
            "Course HUD"}
        </strong>
        <span>{course?.lessonTitle ?? course?.chapterTitle ?? course?.mainMission}</span>
      </div>
      <div className="render-top-status">
        <span>{lesson.layout?.topHeader?.showCurrentStage === false
          ? course?.mainMission
          : currentStageName ?? course?.mainMission}</span>
        <strong className="render-status-pill">{course?.statusLabel ?? "MISSION LIVE"}</strong>
      </div>
    </div>
  );
};

const LecturerMiniCard = ({ lesson }: { lesson: LessonProjectConfigLike }) => {
  if (
    lesson.layout?.lecturer?.visible === false ||
    lesson.layout?.showLecturerCard === false ||
    lesson.speaker?.displayMode === "hidden" ||
    lesson.lecturer?.displayMode === "hidden" ||
    lesson.speaker?.positionPreset === "hidden" ||
    lesson.lecturer?.positionPreset === "hidden"
  ) {
    return null;
  }

  const positionClass = getPositionClass(
    lesson.layout?.lecturer?.positionPreset ??
      lesson.speaker?.positionPreset ??
      lesson.lecturer?.positionPreset,
  );
  const name = lesson.lecturer?.name ?? lesson.speaker?.name ?? "LECTURER";
  const role =
    lesson.lecturer?.role ??
    lesson.lecturer?.title ??
    lesson.speaker?.role ??
    lesson.speaker?.title ??
    "ON AIR";

  return (
    <div className={`render-lecturer-overlay ${positionClass}`}>
      <strong>{name}</strong>
      <span>{role}</span>
    </div>
  );
};

const ChapterMap = ({
  lesson,
  hudState,
}: {
  lesson: LessonProjectConfigLike;
  hudState: HudRuntimeStateLike;
}) => {
  if (
    lesson.layout?.rightSidebar?.visible === false ||
    lesson.layout?.showRightPanel === false ||
    lesson.layout?.rightSidebar?.displayMode === "hidden" ||
    lesson.layout?.rightSidebar?.displayMode === "tasks_only" ||
    lesson.layout?.rightSidebar?.displayMode === "hints_only"
  ) {
    return null;
  }

  const nodes = [...(lesson.chapterMap?.nodes ?? lesson.map?.nodes ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div className="render-hud-panel render-right-panel">
      <div className="render-panel-label">CHAPTER MAP</div>
      <div className="render-map-list">
        {nodes.slice(0, 5).map((node) => {
          const state = hudState.mapNodeStates?.[node.id] ?? node.defaultStatus;
          return (
            <div
              className={`render-map-item ${stateClass(state)}`}
              key={node.id}
            >
              <span className="render-map-dot" />
              <strong className="render-map-name">{node.label}</strong>
              <small className="render-map-state">{stateLabel(state)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TaskTracker = ({
  lesson,
  hudState,
}: {
  lesson: LessonProjectConfigLike;
  hudState: HudRuntimeStateLike;
}) => {
  if (
    lesson.layout?.rightSidebar?.visible === false ||
    lesson.layout?.showRightPanel === false ||
    lesson.layout?.rightSidebar?.displayMode === "hidden" ||
    lesson.layout?.rightSidebar?.displayMode === "map_only" ||
    lesson.layout?.rightSidebar?.displayMode === "hints_only"
  ) {
    return null;
  }

  const tasks = [...(lesson.tasks ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div className="render-hud-panel render-right-panel">
      <div className="render-panel-label">TASK TRACKER</div>
      <div className="render-task-list">
        {tasks.slice(0, 5).map((task) => {
          const state = hudState.taskStates?.[task.id] ?? task.defaultStatus;
          return (
            <div
              className={`render-task-item ${stateClass(state)}`}
              key={task.id}
            >
              <span className="render-task-bar" />
              <strong className="render-task-name">{task.label ?? task.title}</strong>
              <small className="render-task-state">{stateLabel(state)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WarningPanel = ({
  lesson,
  hudState,
}: {
  lesson: LessonProjectConfigLike;
  hudState: HudRuntimeStateLike;
}) => {
  if (
    lesson.layout?.rightSidebar?.visible === false ||
    lesson.layout?.showRightPanel === false ||
    lesson.layout?.rightSidebar?.displayMode === "hidden" ||
    lesson.layout?.rightSidebar?.displayMode === "map_only" ||
    lesson.layout?.rightSidebar?.displayMode === "tasks_only"
  ) {
    return null;
  }

  const hint =
    hudState.activeHomework ??
    hudState.activeSummary ??
    hudState.activeWarning ??
    hudState.activeHint ??
    lesson.warning?.items?.[0] ??
    lesson.hints?.[0];
  const sourceEventId =
    hint && "sourceEventId" in hint ? hint.sourceEventId : undefined;
  const noticeLines = getNoticeLines(hudState, sourceEventId);

  return (
    <div className={`render-hud-panel render-right-panel render-warning-panel is-${hint?.hintType ?? "info"}`}>
      <div className="render-panel-label">{getNoticeLabel(hint?.hintType)}</div>
      <div className="render-notice-title">
        {hint?.title ?? "等待时间轴提示"}
      </div>
      <div className="render-notice-body">
        {hint?.body ?? "当前没有命中的重点提示事件。"}
      </div>
      {noticeLines.length > 0 ? (
        <div className="render-notice-lines">
          {noticeLines.map((line) => (
            <div className="render-notice-line" key={line}>
              <i />
              <span>{line}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CourseStageBar = ({
  lesson,
  hudState,
}: {
  lesson: LessonProjectConfigLike;
  hudState: HudRuntimeStateLike;
}) => {
  if (
    lesson.layout?.stageBar?.visible === false ||
    lesson.layout?.showCourseStageBar === false ||
    lesson.layout?.stageBar?.displayMode === "hidden"
  ) {
    return null;
  }

  const stages = [...(lesson.stages ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div
      className="render-hud-panel render-stage-bar"
      style={{ gridTemplateColumns: `repeat(${Math.max(stages.length, 1)}, minmax(0, 1fr))` }}
    >
      {stages.map((stage) => {
        const state = hudState.stageStates?.[stage.id];
        return (
          <div
            className={`render-stage-segment ${stateClass(state)}`}
            key={stage.id}
          >
            <span className="render-stage-node" />
            <div>
              <small>{stageStateLabel(state)}</small>
              <strong>{stage.shortName ?? stage.label ?? stage.name}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const BottomStatusHud = ({
  lesson,
  hudState,
  currentTime,
}: {
  lesson: LessonProjectConfigLike;
  hudState: HudRuntimeStateLike;
  currentTime: number;
}) => {
  if (lesson.layout?.bottomStatusHud?.visible === false || lesson.layout?.showBottomHud === false) {
    return null;
  }

  const status = hudState.activeBottomStatus;
  const latestAbility = hudState.unlockedAbilities?.at(-1);
  const statusLabel = getBottomStatusLabel(hudState, status?.sourceEventId);

  return (
    <div className={`render-hud-panel render-bottom-status is-${status?.kind ?? "idle"}`}>
      <div className="render-panel-label">{statusLabel}</div>
      <div className="render-bottom-title">
        {status?.title ??
          latestAbility?.label ??
          status?.label ??
          getCourseMeta(lesson)?.mainMission ??
          "课程任务待命"}
      </div>
      <div className="render-bottom-body">
        {status?.message ??
          status?.body ??
          latestAbility?.description ??
          (currentTime >= 0 ? "等待下一个课程状态事件" : "课程状态待命")}
      </div>
    </div>
  );
};

export const HudLayer = ({
  lesson,
  hudState,
  currentTime,
}: HudLayerProps) => {
  const currentStage = getCurrentStage(lesson, hudState);
  const showRightStack =
    lesson.layout?.rightSidebar?.visible !== false &&
    lesson.layout?.showRightPanel !== false &&
    lesson.layout?.rightSidebar?.displayMode !== "hidden";

  return (
    <>
      <TopHeader
        lesson={lesson}
        currentStageName={currentStage?.shortName ?? currentStage?.name}
      />
      <LecturerMiniCard lesson={lesson} />
      {showRightStack ? (
        <div className="render-right-stack">
          <ChapterMap lesson={lesson} hudState={hudState} />
          <TaskTracker lesson={lesson} hudState={hudState} />
          <WarningPanel lesson={lesson} hudState={hudState} />
        </div>
      ) : null}
      <CourseStageBar lesson={lesson} hudState={hudState} />
      <BottomStatusHud
        lesson={lesson}
        hudState={hudState}
        currentTime={currentTime}
      />
    </>
  );
};
