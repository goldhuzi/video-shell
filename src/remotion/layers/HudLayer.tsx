import type { CSSProperties } from "react";
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

const panelStyle: CSSProperties = {
  border: "1px solid rgba(114, 207, 255, 0.28)",
  background: "rgba(5, 13, 24, 0.78)",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset",
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: "rgba(125, 229, 255, 0.78)",
  letterSpacing: 0,
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

const stateColor = (state?: string) => {
  if (state === "current" || state === "unlocked") {
    return "#7df0ff";
  }

  if (state === "completed") {
    return "#54e6a0";
  }

  if (state === "locked") {
    return "rgba(148, 162, 180, 0.34)";
  }

  return "rgba(190, 211, 229, 0.62)";
};

const getPositionStyle = (positionPreset?: string) => {
  if (positionPreset === "bottom-right") {
    return { left: 1152, top: 940 };
  }

  if (positionPreset === "in-bottom-hud") {
    return { left: 304, top: 940 };
  }

  return { left: 24, top: 940 };
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
    <div
      style={{
        ...panelStyle,
        position: "absolute",
        left: 24,
        top: 16,
        width: 1872,
        height: 64,
        display: "grid",
        gridTemplateColumns: "1fr auto 260px",
        alignItems: "center",
        padding: "0 22px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 25,
            fontWeight: 850,
            color: "#f2fbff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {course?.courseTitle ??
            lesson.meta?.projectName ??
            lesson.project?.name ??
            "Course HUD"}
        </div>
        <div
          style={{
            marginTop: 3,
            fontSize: 13,
            color: "rgba(194, 220, 238, 0.76)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {course?.lessonTitle ?? course?.chapterTitle ?? course?.mainMission}
        </div>
      </div>
      <div
        style={{
          marginRight: 34,
          fontSize: 15,
          fontWeight: 800,
          color: "#9decff",
        }}
      >
        {lesson.layout?.topHeader?.showCurrentStage === false
          ? course?.courseCode
          : currentStageName ?? course?.mainMission}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 12,
          alignItems: "center",
          fontSize: 13,
          fontWeight: 800,
          color: "#eef9ff",
        }}
      >
        <span style={{ color: "rgba(125, 229, 255, 0.82)" }}>
          {course?.statusLabel ?? "MISSION LIVE"}
        </span>
        <span>{lessonCounter}</span>
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

  const positionStyle = getPositionStyle(
    lesson.layout?.lecturer?.positionPreset ??
      lesson.speaker?.positionPreset ??
      lesson.lecturer?.positionPreset,
  );

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        width: 260,
        height: 112,
        pointerEvents: "none",
        border: "1px solid rgba(125, 229, 255, 0.56)",
        boxShadow: "0 0 22px rgba(64, 174, 255, 0.12) inset",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 10,
          maxWidth: 226,
          padding: "5px 8px",
          background: "rgba(4, 9, 16, 0.72)",
          color: "#eefaff",
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {lesson.lecturer?.name ?? lesson.speaker?.name ?? "LECTURER"}
        <span style={{ marginLeft: 8, color: "rgba(170, 217, 245, 0.78)" }}>
          {lesson.lecturer?.role ?? lesson.lecturer?.title ?? lesson.speaker?.role ?? lesson.speaker?.title ?? "ON AIR"}
        </span>
      </div>
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
    <div
      style={{
        ...panelStyle,
        position: "absolute",
        left: 1436,
        top: 92,
        width: 460,
        height: 258,
        padding: 18,
      }}
    >
      <div style={labelStyle}>CHAPTER MAP</div>
      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {nodes.slice(0, 5).map((node) => {
          const state = hudState.mapNodeStates?.[node.id] ?? node.defaultStatus;
          return (
            <div
              key={node.id}
              style={{
                display: "grid",
                gridTemplateColumns: "22px 1fr",
                gap: 12,
                alignItems: "center",
                color: stateColor(state),
                fontSize: 16,
                fontWeight: state === "current" ? 850 : 650,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  border: `2px solid ${stateColor(state)}`,
                  background:
                    state === "completed" ? stateColor(state) : "transparent",
                  boxShadow:
                    state === "current"
                      ? "0 0 18px rgba(125, 240, 255, 0.72)"
                      : "none",
                }}
              />
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {node.label}
              </div>
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
    <div
      style={{
        ...panelStyle,
        position: "absolute",
        left: 1436,
        top: 362,
        width: 460,
        height: 238,
        padding: 18,
      }}
    >
      <div style={labelStyle}>TASK TRACKER</div>
      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        {tasks.slice(0, 5).map((task) => {
          const state = hudState.taskStates?.[task.id] ?? task.defaultStatus;
          return (
            <div
              key={task.id}
              style={{
                display: "grid",
                gridTemplateColumns: "4px 1fr",
                gap: 10,
                minHeight: 28,
                alignItems: "center",
                color: stateColor(state),
                fontSize: 15,
                fontWeight: state === "current" ? 850 : 650,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 26,
                  background: stateColor(state),
                  opacity: state ? 1 : 0.42,
                }}
              />
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {task.label ?? task.title}
              </div>
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
    <div
      style={{
        ...panelStyle,
        position: "absolute",
        left: 1436,
        top: 612,
        width: 460,
        height: 260,
        padding: 18,
        borderColor:
          hint?.hintType === "warning"
            ? "rgba(255, 183, 77, 0.52)"
            : "rgba(114, 207, 255, 0.28)",
      }}
      >
      <div style={labelStyle}>{getNoticeLabel(hint?.hintType)}</div>
      <div
        style={{
          marginTop: 22,
          fontSize: 24,
          fontWeight: 850,
          color: "#f4fbff",
          lineHeight: 1.18,
        }}
      >
        {hint?.title ?? "等待时间轴提示"}
      </div>
      <div
        style={{
          marginTop: 14,
          fontSize: 17,
          lineHeight: 1.45,
          color: "rgba(217, 236, 248, 0.82)",
        }}
      >
        {hint?.body ?? "当前没有命中的重点提示事件。"}
      </div>
      {noticeLines.length > 0 ? (
        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 7,
          }}
        >
          {noticeLines.map((line) => (
            <div
              key={line}
              style={{
                display: "grid",
                gridTemplateColumns: "12px 1fr",
                gap: 8,
                alignItems: "center",
                color: "rgba(214, 240, 255, 0.82)",
                fontSize: 14,
                lineHeight: 1.25,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 6,
                  background: "rgba(125, 229, 255, 0.86)",
                }}
              />
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
      style={{
        ...panelStyle,
        position: "absolute",
        left: 304,
        top: 940,
        width: 1108,
        height: 112,
        padding: "18px 20px",
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(stages.length, 1)}, 1fr)`,
        gap: 10,
        alignItems: "center",
      }}
    >
      {stages.map((stage) => {
        const state = hudState.stageStates?.[stage.id];
        return (
          <div
            key={stage.id}
            style={{
              height: 70,
              border: `1px solid ${stateColor(state)}`,
              background:
                state === "current"
                  ? "rgba(56, 158, 255, 0.18)"
                  : "rgba(255,255,255,0.035)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 12px",
            }}
          >
            <div
              style={{
                color: stateColor(state),
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {state === "completed"
                ? "COMPLETE"
                : state === "current"
                  ? "ACTIVE"
                  : "STAGE"}
            </div>
            <div
              style={{
                marginTop: 6,
                color: "#eefaff",
                fontSize: 17,
                fontWeight: 800,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {stage.shortName ?? stage.label ?? stage.name}
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
    <div
      style={{
        ...panelStyle,
        position: "absolute",
        left: 1436,
        top: 940,
        width: 460,
        height: 112,
        padding: 18,
      }}
    >
      <div style={labelStyle}>{statusLabel}</div>
      <div
        style={{
          marginTop: 13,
          fontSize: 18,
          lineHeight: 1.25,
          color: "#eefaff",
          fontWeight: 800,
        }}
      >
        {status?.title ??
          latestAbility?.label ??
          status?.label ??
          getCourseMeta(lesson)?.mainMission ??
          "课程任务待命"}
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 13,
          color: "rgba(187, 219, 238, 0.74)",
        }}
      >
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

  return (
    <>
      <TopHeader
        lesson={lesson}
        currentStageName={currentStage?.shortName ?? currentStage?.name}
      />
      <LecturerMiniCard lesson={lesson} />
      <ChapterMap lesson={lesson} hudState={hudState} />
      <TaskTracker lesson={lesson} hudState={hudState} />
      <WarningPanel lesson={lesson} hudState={hudState} />
      <CourseStageBar lesson={lesson} hudState={hudState} />
      <BottomStatusHud
        lesson={lesson}
        hudState={hudState}
        currentTime={currentTime}
      />
    </>
  );
};
