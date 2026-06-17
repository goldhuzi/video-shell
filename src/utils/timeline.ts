import type {
  CourseStage,
  LessonProjectConfig,
  TaskItem,
  TimelineEvent,
  WarningItem,
} from "../schemas/lesson.schema";
import {
  getPayloadText,
  isPersistentEvent,
  normalizeEventType,
} from "./eventRules";

export type StageStatus = "not_started" | "current" | "completed";
export type MapNodeStatus = "locked" | "not_started" | "current" | "completed" | "unlocked";
export type TaskStatus = "not_started" | "current" | "completed";

export type ResolvedNotice = WarningItem & {
  level?: "info" | "warning" | "danger" | "success";
  sourceEventId?: string;
};

export type ResolvedBottomStatus = {
  title: string;
  body?: string;
  sourceEventId?: string;
};

export type UnlockedAbility = {
  id: string;
  label: string;
  description?: string;
  sourceEventId: string;
};

export type HudRuntimeState = {
  currentTime: number;
  currentStage?: CourseStage;
  currentStageId?: string;
  stageStates: Record<string, StageStatus>;
  stageStatuses: Record<string, StageStatus>;
  mapNodeStates: Record<string, MapNodeStatus>;
  chapterMapStatuses: Record<string, MapNodeStatus>;
  taskStates: Record<string, TaskStatus>;
  taskStatuses: Record<string, TaskStatus>;
  activeHint?: ResolvedNotice;
  activeWarning?: ResolvedNotice;
  activeBottomStatus?: ResolvedBottomStatus;
  activeSummary?: ResolvedNotice;
  activeHomework?: ResolvedNotice;
  activeEvents: TimelineEvent[];
  activeWindowEvents: TimelineEvent[];
  persistentStateEvents: TimelineEvent[];
  activeSkillIds: string[];
  unlockedAbilities: UnlockedAbility[];
  validationWarnings?: string[];
};

type StageResolution = {
  naturalCurrentStage?: CourseStage;
  currentStage?: CourseStage;
  stageStates: Record<string, StageStatus>;
  stageChangeEvent?: TimelineEvent;
  mapStage?: CourseStage;
  taskStage?: CourseStage;
  hintStage?: CourseStage;
};

const TIME_EPSILON = 0.001;

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

function getEventEndTime(event: TimelineEvent) {
  return event.endTime ?? (event.duration !== undefined ? event.startTime + event.duration : undefined);
}

function isSameTime(a: number, b: number) {
  return Math.abs(a - b) <= TIME_EPSILON;
}

function compareEventPriority(a: TimelineEvent, b: TimelineEvent) {
  return (
    b.priority - a.priority ||
    b.startTime - a.startTime ||
    a.id.localeCompare(b.id)
  );
}

function compareEventApplicationOrder(a: TimelineEvent, b: TimelineEvent) {
  return (
    a.startTime - b.startTime ||
    a.priority - b.priority ||
    a.id.localeCompare(b.id)
  );
}

function getPayload(event: TimelineEvent): Record<string, unknown> {
  return event.payload as Record<string, unknown>;
}

function getPayloadStageId(payload: Record<string, unknown>) {
  return typeof payload.stageId === "string" ? payload.stageId : undefined;
}

function getNodeId(payload: Record<string, unknown>) {
  return typeof payload.nodeId === "string"
    ? payload.nodeId
    : typeof payload.mapNodeId === "string"
      ? payload.mapNodeId
      : undefined;
}

function getBoolean(payload: Record<string, unknown>, key: string) {
  return payload[key] === true;
}

function targetsComponent(event: TimelineEvent, targetComponent: TimelineEvent["targetComponent"]) {
  return event.targetComponent === targetComponent;
}

function getTaskState(event: TimelineEvent, payload: Record<string, unknown>): TaskStatus {
  const normalized = normalizeEventType(event.type);
  if (normalized === "task_done") {
    return "completed";
  }

  return typeof payload.state === "string" ? (payload.state as TaskStatus) : "current";
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

export function getStageStatuses(
  stages: CourseStage[],
  currentTime: number,
): Record<string, StageStatus> {
  return Object.fromEntries(
    stages.map((stage) => [stage.id, getStageStatus(stage, currentTime, stages)]),
  ) as Record<string, StageStatus>;
}

function findStage(stages: CourseStage[], stageId: string | undefined) {
  return stageId ? stages.find((stage) => stage.id === stageId && stage.enabled) : undefined;
}

function getStageOrderIndex(stages: CourseStage[], stageId: string) {
  return getEnabledStages(stages).findIndex((stage) => stage.id === stageId);
}

function getManualStageChangeEvent(
  stages: CourseStage[],
  timelineEvents: TimelineEvent[],
  currentTime: number,
) {
  const candidates = getPersistentStateEvents(timelineEvents, currentTime).filter((event) => {
    if (normalizeEventType(event.type) !== "stage_change" || !targetsComponent(event, "course_stage_bar")) {
      return false;
    }

    const payload = getPayload(event);
    const stage = findStage(stages, getPayloadStageId(payload));
    if (!stage) {
      return false;
    }

    const endTime = getEffectiveStageEnd(stage, stages);
    return endTime === undefined || currentTime < endTime;
  });

  return candidates.at(-1);
}

function applyCurrentStageOverride(
  stages: CourseStage[],
  targetStage: CourseStage,
): Record<string, StageStatus> {
  const targetIndex = getStageOrderIndex(stages, targetStage.id);

  return Object.fromEntries(
    stages.map((stage) => {
      if (!stage.enabled) {
        return [stage.id, "not_started"];
      }

      const stageIndex = getStageOrderIndex(stages, stage.id);
      if (stage.id === targetStage.id) {
        return [stage.id, "current"];
      }

      return [stage.id, stageIndex >= 0 && stageIndex < targetIndex ? "completed" : "not_started"];
    }),
  ) as Record<string, StageStatus>;
}

function deriveStageResolution(
  stages: CourseStage[],
  timelineEvents: TimelineEvent[],
  currentTime: number,
): StageResolution {
  const naturalCurrentStage = getCurrentStage(stages, currentTime);
  let currentStage = naturalCurrentStage;
  let stageStates = getStageStatuses(stages, currentTime);
  const stageChangeEvent = getManualStageChangeEvent(stages, timelineEvents, currentTime);

  if (stageChangeEvent) {
    const payload = getPayload(stageChangeEvent);
    const targetStage = findStage(stages, getPayloadStageId(payload));
    const status = typeof payload.status === "string" ? payload.status : "current";

    if (targetStage && status === "completed") {
      stageStates = { ...stageStates, [targetStage.id]: "completed" };
    } else if (targetStage) {
      currentStage = targetStage;
      stageStates = applyCurrentStageOverride(stages, targetStage);
    }
  }

  const stageChangePayload = stageChangeEvent ? getPayload(stageChangeEvent) : undefined;
  const shouldSyncMap = !stageChangeEvent || stageChangePayload?.syncMapNode === true;
  const shouldSyncTask = !stageChangeEvent || stageChangePayload?.syncDefaultTask === true;
  const shouldSyncHint = !stageChangeEvent || stageChangePayload?.syncDefaultHint === true;

  return {
    naturalCurrentStage,
    currentStage,
    stageStates,
    stageChangeEvent,
    mapStage: shouldSyncMap ? currentStage : naturalCurrentStage,
    taskStage: shouldSyncTask ? currentStage : naturalCurrentStage,
    hintStage: shouldSyncHint ? currentStage : naturalCurrentStage,
  };
}

export function isTimelineEventActive(event: TimelineEvent, currentTime: number) {
  if (!event.enabled || currentTime < event.startTime) {
    return false;
  }

  const endTime = getEventEndTime(event);
  return endTime === undefined ? isSameTime(currentTime, event.startTime) : currentTime <= endTime;
}

export function getActiveEvents(
  timelineEvents: TimelineEvent[],
  currentTime: number,
): TimelineEvent[] {
  return timelineEvents
    .filter((event) => isTimelineEventActive(event, currentTime))
    .sort(compareEventPriority);
}

export function isPersistentStateEventActive(event: TimelineEvent, currentTime: number) {
  return event.enabled && isPersistentEvent(event.type) && currentTime >= event.startTime;
}

export function getPersistentStateEvents(
  timelineEvents: TimelineEvent[],
  currentTime: number,
): TimelineEvent[] {
  return timelineEvents
    .filter((event) => isPersistentStateEventActive(event, currentTime))
    .sort(compareEventApplicationOrder);
}

export function getEventsByTarget(
  timelineEvents: TimelineEvent[],
  currentTime: number,
) {
  return getActiveEvents(timelineEvents, currentTime).reduce<Record<string, TimelineEvent[]>>(
    (groups, event) => {
      groups[event.targetComponent] = groups[event.targetComponent] ?? [];
      groups[event.targetComponent].push(event);
      return groups;
    },
    {},
  );
}

function noticeFromEvent(event: TimelineEvent): ResolvedNotice {
  const payload = getPayload(event);
  const normalized = normalizeEventType(event.type);
  const title = typeof payload.title === "string" ? payload.title : event.label ?? event.id;
  const body = getPayloadText(payload);
  const level =
    typeof payload.level === "string"
      ? payload.level
      : normalized === "warning_show"
        ? "warning"
        : normalized === "homework_show"
          ? "success"
          : "info";
  const hintType =
    typeof payload.hintType === "string"
      ? payload.hintType
      : normalized === "summary_show"
        ? "summary"
        : normalized === "homework_show"
          ? "homework"
          : normalized === "warning_show"
            ? "warning"
            : "key_point";

  return {
    id: typeof payload.hintId === "string" ? payload.hintId : event.id,
    hintType: hintType as WarningItem["hintType"],
    title,
    body,
    level: level as ResolvedNotice["level"],
    stageId: typeof payload.stageId === "string" ? payload.stageId : undefined,
    sourceEventId: event.id,
  };
}

export function deriveTaskStatuses(
  tasks: TaskItem[],
  stages: CourseStage[],
  stageStatuses: Record<string, StageStatus>,
  timelineEvents: TimelineEvent[],
  currentTime: number,
  currentStage?: CourseStage,
): Record<string, TaskStatus> {
  const taskStates = Object.fromEntries(
    tasks.map((task) => [task.id, task.defaultStatus ?? "not_started"]),
  ) as Record<string, TaskStatus>;

  for (const task of tasks) {
    if (task.stageId && stageStatuses[task.stageId] === "completed") {
      taskStates[task.id] = "completed";
    }
  }

  if (currentStage?.defaultTaskId) {
    taskStates[currentStage.defaultTaskId] = "current";
  }

  const taskEvents = getPersistentStateEvents(timelineEvents, currentTime)
    .filter((event) => {
      const normalized = normalizeEventType(event.type);
      return targetsComponent(event, "task_tracker") && (normalized === "task_active" || normalized === "task_done");
    });

  for (const event of taskEvents) {
    const payload = getPayload(event);
    const taskId = typeof payload.taskId === "string" ? payload.taskId : undefined;
    if (!taskId) {
      continue;
    }

    if (payload.autoCompletePrevious === true || normalizeEventType(event.type) === "task_active") {
      for (const [candidateTaskId, state] of Object.entries(taskStates)) {
        if (state === "current" && candidateTaskId !== taskId) {
          taskStates[candidateTaskId] = "completed";
        }
      }
    }

    taskStates[taskId] = getTaskState(event, payload);
  }

  const hasTaskEventInCurrentStage = currentStage
    ? taskEvents.some((event) => {
      const stageEndTime = getEffectiveStageEnd(currentStage, stages);
      return event.startTime >= currentStage.startTime && (stageEndTime === undefined || event.startTime < stageEndTime);
    })
    : false;
  if (currentStage?.defaultTaskId && !hasTaskEventInCurrentStage) {
    for (const [taskId, state] of Object.entries(taskStates)) {
      if (state === "current" && taskId !== currentStage.defaultTaskId) {
        taskStates[taskId] = "completed";
      }
    }
    taskStates[currentStage.defaultTaskId] = "current";
  }

  const taskSyncEvent = getActiveEvents(timelineEvents, currentTime).find((event) => {
    const normalized = normalizeEventType(event.type);
    if (normalized !== "homework_show") {
      return false;
    }

    const payload = getPayload(event);
    return targetsComponent(event, "task_tracker") || getBoolean(payload, "syncTaskTracker");
  });

  if (taskSyncEvent) {
    const payload = getPayload(taskSyncEvent);
    const taskId = typeof payload.taskId === "string" ? payload.taskId : undefined;
    if (taskId) {
      for (const [candidateTaskId, state] of Object.entries(taskStates)) {
        if (state === "current" && candidateTaskId !== taskId) {
          taskStates[candidateTaskId] = "completed";
        }
      }
      taskStates[taskId] = "current";
    }
  }

  return taskStates;
}

function getMapNodeStatusWeight(status: MapNodeStatus | undefined) {
  const weights: Record<MapNodeStatus, number> = {
    locked: 0,
    not_started: 1,
    unlocked: 2,
    completed: 3,
    current: 4,
  };

  return status ? weights[status] : 0;
}

function mergeMapNodeStatus(current: MapNodeStatus | undefined, next: MapNodeStatus) {
  return getMapNodeStatusWeight(next) >= getMapNodeStatusWeight(current) ? next : current ?? next;
}

export function deriveChapterMapStatuses(
  chapterMap: LessonProjectConfig["chapterMap"],
  stages: CourseStage[],
  stageStatuses: Record<string, StageStatus>,
  timelineEvents: TimelineEvent[],
  currentTime: number,
  currentStage?: CourseStage,
): Record<string, MapNodeStatus> {
  const mapNodeStates = Object.fromEntries(
    chapterMap.nodes.map((node) => [node.id, node.defaultStatus ?? "not_started"]),
  ) as Record<string, MapNodeStatus>;

  for (const node of chapterMap.nodes) {
    if (node.stageId && stageStatuses[node.stageId] === "completed") {
      mapNodeStates[node.id] = "completed";
    }
  }

  if (currentStage?.mapNodeId) {
    mapNodeStates[currentStage.mapNodeId] = "current";
  }

  const mapEvents = getPersistentStateEvents(timelineEvents, currentTime)
    .filter((event) => normalizeEventType(event.type) === "map_node_active")
    .filter((event) => targetsComponent(event, "chapter_map"));

  for (const event of mapEvents) {
    const payload = getPayload(event);
    const nodeId = getNodeId(payload);
    if (!nodeId) {
      continue;
    }

    if (payload.completePrevious === true) {
      const currentNodeOrder = chapterMap.nodes.find((node) => node.id === nodeId)?.order ?? 0;
      for (const node of chapterMap.nodes) {
        if (node.order < currentNodeOrder) {
          mapNodeStates[node.id] = "completed";
        }
      }
    }

    mapNodeStates[nodeId] = mergeMapNodeStatus(
      mapNodeStates[nodeId],
      (payload.state as MapNodeStatus) ?? "current",
    );
  }

  const hasMapEventInCurrentStage = currentStage
    ? mapEvents.some((event) => {
      const stageEndTime = getEffectiveStageEnd(currentStage, stages);
      return event.startTime >= currentStage.startTime && (stageEndTime === undefined || event.startTime < stageEndTime);
    })
    : false;
  if (currentStage?.mapNodeId && !hasMapEventInCurrentStage) {
    for (const node of chapterMap.nodes) {
      if (node.stageId && stageStatuses[node.stageId] === "completed") {
        mapNodeStates[node.id] = "completed";
      }
    }
    mapNodeStates[currentStage.mapNodeId] = "current";
  }

  for (const ability of deriveUnlockedAbilities(timelineEvents, currentTime)) {
    const event = timelineEvents.find((candidate) => candidate.id === ability.sourceEventId);
    const payload = event ? getPayload(event) : undefined;
    const nodeId = payload ? getNodeId(payload) : undefined;
    if (nodeId && payload?.syncMapNode === true) {
      mapNodeStates[nodeId] = mergeMapNodeStatus(mapNodeStates[nodeId], "unlocked");
    }
  }

  return mapNodeStates;
}

export function deriveActiveWarning(
  defaultWarning: WarningItem | undefined,
  timelineEvents: TimelineEvent[],
  currentTime: number,
): ResolvedNotice | WarningItem | undefined {
  const event = getActiveEvents(timelineEvents, currentTime).find((candidate) => {
    const normalized = normalizeEventType(candidate.type);
    const payload = getPayload(candidate);
    const isWarningPanelNotice =
      normalized === "tip_show" ||
      normalized === "warning_show" ||
      normalized === "summary_show" ||
      normalized === "homework_show" ||
      normalized === "ability_unlock";
    return (
      (targetsComponent(candidate, "warning_panel") && isWarningPanelNotice) ||
      getBoolean(payload, "syncWarningPanel")
    );
  });

  return event ? noticeFromEvent(event) : defaultWarning;
}

export function deriveUnlockedAbilities(
  timelineEvents: TimelineEvent[],
  currentTime: number,
): UnlockedAbility[] {
  return timelineEvents
    .filter((event) => event.enabled && currentTime >= event.startTime && normalizeEventType(event.type) === "ability_unlock")
    .sort((a, b) => a.startTime - b.startTime || a.priority - b.priority)
    .map((event) => {
      const payload = getPayload(event);
      return {
        id:
          typeof payload.abilityId === "string"
            ? payload.abilityId
            : typeof payload.skillId === "string"
              ? payload.skillId
              : event.id,
        label:
          typeof payload.label === "string"
            ? payload.label
            : typeof payload.title === "string"
              ? payload.title
              : event.label ?? event.id,
        description:
          typeof payload.description === "string"
            ? payload.description
            : typeof payload.body === "string"
              ? payload.body
              : undefined,
        sourceEventId: event.id,
      };
    });
}

function getDefaultWarning(lesson: LessonProjectConfig, currentStage?: CourseStage) {
  return currentStage?.defaultHintId
    ? lesson.warning.items.find((hint) => hint.id === currentStage.defaultHintId)
    : lesson.warning.items.find((hint) => hint.id === lesson.warning.defaultHintId);
}

function deriveBottomStatus(
  timelineEvents: TimelineEvent[],
  currentTime: number,
): ResolvedBottomStatus | undefined {
  const event = getActiveEvents(timelineEvents, currentTime).find((candidate) => {
    const normalized = normalizeEventType(candidate.type);
    const payload = getPayload(candidate);

    return (
      (
        normalized === "ability_unlock" &&
        targetsComponent(candidate, "bottom_status_hud")
      ) ||
      (
        (
          normalized === "tip_show" ||
          normalized === "warning_show" ||
          normalized === "summary_show" ||
          normalized === "homework_show"
        ) &&
        (targetsComponent(candidate, "bottom_status_hud") || getBoolean(payload, "syncBottomStatus"))
      )
    );
  });

  if (!event) {
    return undefined;
  }

  const payload = getPayload(event);
  return {
    title:
      typeof payload.label === "string"
        ? payload.label
        : typeof payload.title === "string"
          ? payload.title
          : event.label ?? event.id,
    body:
      typeof payload.description === "string"
        ? payload.description
        : typeof payload.actionLabel === "string"
          ? payload.actionLabel
          : getPayloadText(payload),
    sourceEventId: event.id,
  };
}

function findNoticeByType(
  timelineEvents: TimelineEvent[],
  currentTime: number,
  type: "summary_show" | "homework_show",
) {
  const event = getActiveEvents(timelineEvents, currentTime).find(
    (candidate) => normalizeEventType(candidate.type) === type,
  );
  return event ? noticeFromEvent(event) : undefined;
}

export function deriveHudState(
  lesson: LessonProjectConfig,
  currentTime: number,
): HudRuntimeState {
  const stageResolution = deriveStageResolution(lesson.stages, lesson.timelineEvents, currentTime);
  const currentStage = stageResolution.currentStage;
  const activeWindowEvents = getActiveEvents(lesson.timelineEvents, currentTime);
  const persistentStateEvents = getPersistentStateEvents(lesson.timelineEvents, currentTime);
  const stageStates = stageResolution.stageStates;
  const taskStates = deriveTaskStatuses(
    lesson.tasks,
    lesson.stages,
    stageStates,
    lesson.timelineEvents,
    currentTime,
    stageResolution.taskStage,
  );
  const mapNodeStates = deriveChapterMapStatuses(
    lesson.chapterMap,
    lesson.stages,
    stageStates,
    lesson.timelineEvents,
    currentTime,
    stageResolution.mapStage,
  );
  const activeWarning = deriveActiveWarning(
    getDefaultWarning(lesson, stageResolution.hintStage),
    lesson.timelineEvents,
    currentTime,
  );
  const unlockedAbilities = deriveUnlockedAbilities(lesson.timelineEvents, currentTime);
  const activeBottomStatus = deriveBottomStatus(lesson.timelineEvents, currentTime);
  const activeSummary = findNoticeByType(lesson.timelineEvents, currentTime, "summary_show");
  const activeHomework = findNoticeByType(lesson.timelineEvents, currentTime, "homework_show");

  return {
    currentTime,
    currentStage,
    currentStageId: currentStage?.id,
    stageStates,
    stageStatuses: stageStates,
    mapNodeStates,
    chapterMapStatuses: mapNodeStates,
    taskStates,
    taskStatuses: taskStates,
    activeHint: activeWarning,
    activeWarning,
    activeBottomStatus,
    activeSummary,
    activeHomework,
    activeEvents: activeWindowEvents,
    activeWindowEvents,
    persistentStateEvents,
    activeSkillIds: unlockedAbilities.map((ability) => ability.id),
    unlockedAbilities,
  };
}
