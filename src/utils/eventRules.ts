import type { HudComponentKey, TimelineEventType } from "../schemas/lesson.schema";

export const stage5EventTypes = [
  "stage_change",
  "map_node_active",
  "task_active",
  "task_done",
  "tip_show",
  "warning_show",
  "ability_unlock",
  "summary_show",
  "homework_show",
] as const;

export const legacyEventTypes = [
  "map_node_activate",
  "task_update",
  "hint_show",
  "skill_unlock",
  "stage_summary",
  "homework_reminder",
] as const;

export type Stage5EventType = (typeof stage5EventTypes)[number];

export const displayEventTypes = [
  "tip_show",
  "warning_show",
  "summary_show",
  "homework_show",
  "hint_show",
  "stage_summary",
  "homework_reminder",
] as const;

export const persistentEventTypes = [
  "stage_change",
  "map_node_active",
  "map_node_activate",
  "task_active",
  "task_done",
  "task_update",
  "ability_unlock",
  "skill_unlock",
] as const;

export function normalizeEventType(type: string): TimelineEventType {
  const map: Record<string, TimelineEventType> = {
    map_node_activate: "map_node_active",
    task_update: "task_active",
    hint_show: "tip_show",
    skill_unlock: "ability_unlock",
    stage_summary: "summary_show",
    homework_reminder: "homework_show",
  };

  return (map[type] ?? type) as TimelineEventType;
}

export function isDisplayEvent(type: string) {
  return (displayEventTypes as readonly string[]).includes(type);
}

export function isPersistentEvent(type: string) {
  return (persistentEventTypes as readonly string[]).includes(type);
}

export function eventTypeRequiresEndTime(type: string) {
  return isDisplayEvent(type);
}

export function inferTargetComponent(type: string): HudComponentKey {
  const normalized = normalizeEventType(type);

  if (normalized === "stage_change") {
    return "course_stage_bar";
  }

  if (normalized === "map_node_active") {
    return "chapter_map";
  }

  if (normalized === "task_active" || normalized === "task_done") {
    return "task_tracker";
  }

  if (normalized === "ability_unlock") {
    return "bottom_status_hud";
  }

  return "warning_panel";
}

export function getEventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    stage_change: "阶段切换",
    map_node_active: "地图节点点亮",
    map_node_activate: "地图节点点亮",
    task_active: "任务开始",
    task_done: "任务完成",
    task_update: "任务更新",
    tip_show: "重点提示",
    warning_show: "警告提示",
    hint_show: "提示显示",
    ability_unlock: "能力解锁",
    skill_unlock: "能力解锁",
    summary_show: "阶段总结",
    stage_summary: "阶段总结",
    homework_show: "作业提醒",
    homework_reminder: "作业提醒",
  };

  return labels[type] ?? type;
}

export function createDefaultPayload(type: TimelineEventType) {
  const normalized = normalizeEventType(type);

  if (normalized === "stage_change") {
    return { stageId: "", status: "current", syncMapNode: true, syncDefaultTask: true, syncDefaultHint: true };
  }

  if (normalized === "map_node_active") {
    return { nodeId: "", label: "", state: "current", completePrevious: true };
  }

  if (normalized === "task_active") {
    return { taskId: "", label: "", state: "current", autoCompletePrevious: true };
  }

  if (normalized === "task_done") {
    return { taskId: "", label: "", state: "completed" };
  }

  if (normalized === "ability_unlock") {
    return { abilityId: "", label: "New ability", description: "" };
  }

  if (normalized === "summary_show") {
    return { title: "阶段总结", text: "本阶段的关键结论。", bullets: [] };
  }

  if (normalized === "homework_show") {
    return { title: "课后行动", text: "完成一个可复用的小任务。", checklist: [] };
  }

  return { title: "重点提示", text: "在这里写当前片段最重要的提醒。", level: "info" };
}

export function getPayloadText(payload: Record<string, unknown>) {
  if (typeof payload.text === "string") {
    return payload.text;
  }

  if (typeof payload.body === "string") {
    return payload.body;
  }

  if (Array.isArray(payload.bullets)) {
    return payload.bullets.filter((item) => typeof item === "string").join(" / ");
  }

  return "";
}
