import type {
  CourseStage,
  LessonProjectConfig,
  TimelineEvent,
  WarningItem,
} from "../schemas/lesson.schema";

export type StageStatus = "not_started" | "current" | "completed";
export type MapNodeStatus = "locked" | "not_started" | "current" | "completed" | "unlocked";
export type TaskStatus = "not_started" | "current" | "completed";

export type ResolvedBottomStatus = {
  title: string;
  body?: string;
  sourceEventId?: string;
};

export type HudRuntimeState = {
  currentTime: number;
  currentStage?: CourseStage;
  currentStageId?: string;
  stageStates: Record<string, StageStatus>;
  mapNodeStates: Record<string, MapNodeStatus>;
  taskStates: Record<string, TaskStatus>;
  activeHint?: WarningItem | (WarningItem & { sourceEventId: string });
  activeBottomStatus?: ResolvedBottomStatus;
  activeEvents: TimelineEvent[];
  activeSkillIds: string[];
};

const SHORT_LIVED_EVENT_TYPES = new Set([
  "hint_show",
  "stage_summary",
  "homework_reminder",
  "skill_unlock",
]);

function getEnabledStages(stages: CourseStage[]): CourseStage[] {
  return stages.filter((stage) => stage.enabled).sort((a, b) => a.startTime - b.startTime);
}

function getEffectiveStageEnd(stage: CourseStage, stages: CourseStage[]): number | undefined {
  if (stage.endTime !== undefined) {
    return stage.endTime;
  }

  const enabledStages = getEnabledStages(stages);
  const index = enabledStages.findIndex((candidate) => candidate.id === stage.id);
  return enabledStages[index + 1]?.startTime;
}

export function getCurrentStage(
  stages: CourseStage[],
  currentTime: number,
): CourseStage | undefined {
  return getEnabledStages(stages).find((stage) => {
    const endTime = getEffectiveStageEnd(stage, stages);
    return currentTime >= stage.startTime && (endTime === undefined || currentTime < endTime);
  });
}

export function getStageStatus(
  stage: CourseStage,
  currentTime: number,
  stages: CourseStage[] = [stage],
): StageStatus {
  if (!stage.enabled || currentTime < stage.startTime) {
    return "not_started";
  }

  const currentStage = getCurrentStage(stages, currentTime);
  if (currentStage?.id === stage.id) {
    return "current";
  }

  const endTime = getEffectiveStageEnd(stage, stages);
  return endTime !== undefined && currentTime >= endTime ? "completed" : "not_started";
}

export function getActiveEvents(
  timelineEvents: TimelineEvent[],
  currentTime: number,
): TimelineEvent[] {
  return timelineEvents
    .filter((event) => {
      if (!event.enabled || currentTime < event.startTime) {
        return false;
      }

      const isShortLived = SHORT_LIVED_EVENT_TYPES.has(event.type);
      const endTime =
        event.endTime ?? (event.duration !== undefined ? event.startTime + event.duration : undefined);

      if (isShortLived) {
        return endTime === undefined ? currentTime === event.startTime : currentTime <= endTime;
      }

      return endTime === undefined || currentTime <= endTime || currentTime >= event.startTime;
    })
    .sort((a, b) => b.priority - a.priority || a.startTime - b.startTime);
}

function warningFromEvent(event: TimelineEvent): HudRuntimeState["activeHint"] {
  const payload = event.payload as Record<string, unknown>;
  const title = typeof payload.title === "string" ? payload.title : event.label ?? event.id;
  const body = typeof payload.body === "string" ? payload.body : "";
  const hintType =
    typeof payload.hintType === "string"
      ? payload.hintType
      : event.type === "stage_summary"
        ? "summary"
        : event.type === "homework_reminder"
          ? "homework"
          : "key_point";
  const hintId = typeof payload.hintId === "string" ? payload.hintId : event.id;
  const stageId = typeof payload.stageId === "string" ? payload.stageId : undefined;

  return {
    id: hintId,
    hintType: hintType as WarningItem["hintType"],
    title,
    body,
    stageId,
    sourceEventId: event.id,
  };
}

export function deriveHudState(
  lesson: LessonProjectConfig,
  currentTime: number,
): HudRuntimeState {
  const currentStage = getCurrentStage(lesson.stages, currentTime);
  const activeEvents = getActiveEvents(lesson.timelineEvents, currentTime);
  const stageStates = Object.fromEntries(
    lesson.stages.map((stage) => [stage.id, getStageStatus(stage, currentTime, lesson.stages)]),
  ) as Record<string, StageStatus>;

  const mapNodeStates = Object.fromEntries(
    lesson.chapterMap.nodes.map((node) => [
      node.id,
      node.defaultStatus ?? "not_started",
    ]),
  ) as Record<string, MapNodeStatus>;

  const taskStates = Object.fromEntries(
    lesson.tasks.map((task) => [task.id, task.defaultStatus ?? "not_started"]),
  ) as Record<string, TaskStatus>;

  let activeHint = currentStage?.defaultHintId
    ? lesson.warning.items.find((hint) => hint.id === currentStage.defaultHintId)
    : lesson.warning.items.find((hint) => hint.id === lesson.warning.defaultHintId);
  let activeBottomStatus: ResolvedBottomStatus | undefined;
  const activeSkillIds: string[] = [];

  if (currentStage?.mapNodeId) {
    for (const node of lesson.chapterMap.nodes) {
      if (node.stageId && stageStates[node.stageId] === "completed") {
        mapNodeStates[node.id] = "completed";
      }
    }

    mapNodeStates[currentStage.mapNodeId] = "current";
  }

  if (currentStage?.defaultTaskId) {
    for (const task of lesson.tasks) {
      if (task.stageId && stageStates[task.stageId] === "completed") {
        taskStates[task.id] = "completed";
      }
    }

    taskStates[currentStage.defaultTaskId] = "current";
  }

  for (const event of activeEvents.slice().reverse()) {
    const payload = event.payload as Record<string, unknown>;

    if (event.type === "map_node_activate" && typeof payload.mapNodeId === "string") {
      if (payload.completePrevious === true) {
        for (const node of lesson.chapterMap.nodes) {
          if (node.order < (lesson.chapterMap.nodes.find((item) => item.id === payload.mapNodeId)?.order ?? 0)) {
            mapNodeStates[node.id] = "completed";
          }
        }
      }

      mapNodeStates[payload.mapNodeId] = (payload.state as MapNodeStatus) ?? "current";
    }

    if (event.type === "task_update" && typeof payload.taskId === "string") {
      if (payload.autoCompletePrevious === true) {
        for (const [taskId, state] of Object.entries(taskStates)) {
          if (state === "current" && taskId !== payload.taskId) {
            taskStates[taskId] = "completed";
          }
        }
      }

      taskStates[payload.taskId] = (payload.state as TaskStatus) ?? "current";
    }

    if (
      event.type === "hint_show" ||
      event.type === "stage_summary" ||
      event.type === "homework_reminder"
    ) {
      activeHint = warningFromEvent(event);
    }

    if (event.type === "skill_unlock") {
      const skillId = typeof payload.skillId === "string" ? payload.skillId : event.id;
      activeSkillIds.push(skillId);

      if (typeof payload.title === "string") {
        activeBottomStatus = {
          title: payload.title,
          body: typeof payload.body === "string" ? payload.body : undefined,
          sourceEventId: event.id,
        };
      }

      if (payload.syncMapNode === true && typeof payload.mapNodeId === "string") {
        mapNodeStates[payload.mapNodeId] = "unlocked";
      }
    }

    if (
      (event.type === "stage_summary" || event.type === "homework_reminder") &&
      payload.syncBottomStatus === true &&
      typeof payload.title === "string"
    ) {
      activeBottomStatus = {
        title: payload.title,
        body: typeof payload.actionLabel === "string" ? payload.actionLabel : undefined,
        sourceEventId: event.id,
      };
    }
  }

  return {
    currentTime,
    currentStage,
    currentStageId: currentStage?.id,
    stageStates,
    mapNodeStates,
    taskStates,
    activeHint,
    activeBottomStatus,
    activeEvents,
    activeSkillIds,
  };
}
