import type { ChangeEvent } from "react";
import type {
  HudComponentKey,
  HudRuntimeState,
  LessonProjectConfig,
  TimelineEvent,
  TimelineView,
} from "./App";
import type { EditorValidationState } from "./state/editorState";
import type { TimelineEventType } from "../schemas/lesson.schema";
import {
  createDefaultPayload,
  getEventTypeLabel,
  inferTargetComponent,
  stage5EventTypes,
} from "../utils/eventRules";
import { clampTime, formatTime, parseTime } from "../utils/timeFormat";

type TimelinePanelProps = {
  lesson: LessonProjectConfig;
  hudState: HudRuntimeState;
  currentTime: number;
  selectedComponent: HudComponentKey;
  selectedStageId?: string;
  selectedEventId?: string;
  activeTimelineView: TimelineView;
  onCurrentTimeChange: (time: number) => void;
  onSelectedStageIdChange: (stageId?: string) => void;
  onSelectedEventIdChange: (eventId?: string) => void;
  onTimelineViewChange: (view: TimelineView) => void;
  onUpdateLesson: (updater: (draft: LessonProjectConfig) => void) => void;
  validation: EditorValidationState;
};

function getStageEndTime(lesson: LessonProjectConfig, stageIndex: number) {
  return (
    lesson.stages[stageIndex]?.endTime ??
    lesson.stages[stageIndex + 1]?.startTime ??
    lesson.media.mainVideo.duration ??
    lesson.stages[stageIndex]?.startTime ??
    0
  );
}

function getEventTitle(event: TimelineEvent) {
  const payload = event.payload as Record<string, unknown>;
  return typeof payload.title === "string"
    ? payload.title
    : typeof payload.label === "string"
      ? payload.label
      : event.label ?? event.id;
}

function roundedTime(time: number) {
  return Math.round(time * 10) / 10;
}

function makeId(prefix: string, existingIds: Set<string>) {
  let index = existingIds.size + 1;
  let id = `${prefix}-${index.toString().padStart(2, "0")}`;
  while (existingIds.has(id)) {
    index += 1;
    id = `${prefix}-${index.toString().padStart(2, "0")}`;
  }
  return id;
}

export function TimelinePanel({
  lesson,
  hudState,
  currentTime,
  selectedComponent,
  selectedStageId,
  selectedEventId,
  activeTimelineView,
  onCurrentTimeChange,
  onSelectedStageIdChange,
  onSelectedEventIdChange,
  onTimelineViewChange,
  onUpdateLesson,
  validation,
}: TimelinePanelProps) {
  const durationFallback = lesson.media.mainVideo.duration ?? Math.max(...lesson.stages.map((stage) => stage.endTime ?? stage.startTime), 360);
  const selectedEvent = lesson.timelineEvents.find((event) => event.id === selectedEventId);

  const updateStage =
    (stageId: string, field: "label" | "startTime" | "endTime" | "shortName") =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = field === "label" || field === "shortName" ? event.target.value : parseTime(event.target.value);
      onUpdateLesson((draft) => {
        const stage = draft.stages.find((item) => item.id === stageId);
        if (!stage) {
          return;
        }

        if (field === "label") {
          stage.label = String(value);
          stage.name = String(value);
          return;
        }

        if (field === "shortName") {
          stage.shortName = String(value);
          return;
        }

        stage[field] = Number(value);
        draft.stages.sort((a, b) => a.startTime - b.startTime);
        draft.stages.forEach((item, index) => {
          item.order = index;
        });
      });
    };

  const updateEvent = (
    eventId: string,
    apply: (event: TimelineEvent) => void,
  ) => {
    onUpdateLesson((draft) => {
      const timelineEvent = draft.timelineEvents.find((item) => item.id === eventId);
      if (!timelineEvent) {
        return;
      }

      apply(timelineEvent);
      draft.timelineEvents.sort((a, b) => a.startTime - b.startTime || b.priority - a.priority);
    });
  };

  const updateEventPayload = (eventId: string, key: string, value: unknown) => {
    updateEvent(eventId, (event) => {
      event.payload = {
        ...(event.payload as Record<string, unknown>),
        [key]: value,
      };
    });
  };

  const addStage = () => {
    const startTime = roundedTime(currentTime);
    const endTime = clampTime(startTime + 30, startTime + 1, durationFallback);
    onUpdateLesson((draft) => {
      const id = makeId("stage-custom", new Set(draft.stages.map((stage) => stage.id)));
      draft.stages.push({
        id,
        label: "New Course Stage",
        name: "New Course Stage",
        shortName: "New",
        startTime,
        endTime,
        order: draft.stages.length,
        enabled: true,
      });
      draft.stages.sort((a, b) => a.startTime - b.startTime);
      draft.stages.forEach((stage, index) => {
        stage.order = index;
      });
      onSelectedStageIdChange(id);
    });
  };

  const deleteStage = (stageId: string) => {
    onUpdateLesson((draft) => {
      if (draft.stages.length <= 1) {
        return;
      }
      draft.stages = draft.stages.filter((stage) => stage.id !== stageId);
      draft.stages.forEach((stage, index) => {
        stage.order = index;
      });
    });
    onSelectedStageIdChange(undefined);
  };

  const addEvent = () => {
    const type: TimelineEventType = "tip_show";
    const startTime = roundedTime(currentTime);
    onUpdateLesson((draft) => {
      const id = makeId("event-custom", new Set(draft.timelineEvents.map((event) => event.id)));
      draft.timelineEvents.push({
        id,
        type,
        startTime,
        endTime: clampTime(startTime + 8, startTime + 1, durationFallback),
        targetComponent: inferTargetComponent(type),
        payload: createDefaultPayload(type),
        animation: {
          enter: "fade_up",
          exit: "fade",
          durationMs: 220,
        },
        priority: 80,
        enabled: true,
        label: "New timeline event",
      });
      onSelectedEventIdChange(id);
    });
  };

  const deleteEvent = (eventId: string) => {
    onUpdateLesson((draft) => {
      draft.timelineEvents = draft.timelineEvents.filter((event) => event.id !== eventId);
    });
    onSelectedEventIdChange(undefined);
  };

  const setStageTime = (stageId: string, field: "startTime" | "endTime") => {
    onUpdateLesson((draft) => {
      const stage = draft.stages.find((item) => item.id === stageId);
      if (stage) {
        stage[field] = roundedTime(currentTime);
      }
    });
  };

  const setEventTime = (eventId: string, field: "startTime" | "endTime") => {
    updateEvent(eventId, (event) => {
      event[field] = roundedTime(currentTime);
    });
  };

  return (
    <footer className="timeline-panel" aria-label="底部时间轴配置区">
      <div className="timeline-header">
        <div>
          <strong>时间轴配置</strong>
          <span>
            previewTime {formatTime(currentTime)} · 选中目标 {selectedComponent}
          </span>
        </div>
        <label className="preview-time-input">
          <span>previewTime</span>
          <input
            aria-label="手动输入预览时间"
            max={durationFallback}
            min={0}
            onChange={(event) => onCurrentTimeChange(clampTime(parseTime(event.target.value), 0, durationFallback))}
            step={1}
            type="text"
            value={formatTime(currentTime)}
          />
        </label>
        <div className="timeline-tabs" role="tablist">
          <button aria-selected={activeTimelineView === "stages"} onClick={() => onTimelineViewChange("stages")} role="tab" type="button">
            阶段
          </button>
          <button aria-selected={activeTimelineView === "events"} onClick={() => onTimelineViewChange("events")} role="tab" type="button">
            事件
          </button>
          <button aria-selected={activeTimelineView === "validation"} onClick={() => onTimelineViewChange("validation")} role="tab" type="button">
            校验
          </button>
        </div>
      </div>

      {activeTimelineView === "stages" ? (
        <div className="timeline-section">
          <div className="timeline-section-actions">
            <span>阶段轨道 · 当前阶段 {hudState.currentStage?.label ?? "未命中"}</span>
            <button type="button" onClick={addStage}>新增阶段</button>
          </div>
          <div className="timeline-table" role="table" aria-label="课程阶段">
            <div className="timeline-row timeline-row-head" role="row">
              <span>阶段</span>
              <span>短名</span>
              <span>开始</span>
              <span>结束</span>
              <span>状态 / 操作</span>
            </div>
            {lesson.stages.map((stage, index) => (
              <div className={`timeline-row is-${hudState.stageStates[stage.id]} ${selectedStageId === stage.id ? "is-selected" : ""}`} key={stage.id} role="row">
                <input aria-label={`${stage.id} 阶段名称`} value={stage.label} onChange={updateStage(stage.id, "label")} />
                <input aria-label={`${stage.id} 短名`} value={stage.shortName ?? ""} onChange={updateStage(stage.id, "shortName")} />
                <input aria-label={`${stage.id} 开始时间`} min={0} step={1} type="number" value={stage.startTime} onChange={updateStage(stage.id, "startTime")} />
                <input aria-label={`${stage.id} 结束时间`} min={0} step={1} type="number" value={getStageEndTime(lesson, index)} onChange={updateStage(stage.id, "endTime")} />
                <div className="row-actions">
                  <span>{hudState.stageStates[stage.id]}</span>
                  <button type="button" onClick={() => { onSelectedStageIdChange(stage.id); onCurrentTimeChange(stage.startTime); }}>跳转</button>
                  <button type="button" onClick={() => setStageTime(stage.id, "startTime")}>开始=当前</button>
                  <button type="button" onClick={() => setStageTime(stage.id, "endTime")}>结束=当前</button>
                  <button type="button" onClick={() => deleteStage(stage.id)}>删除</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {activeTimelineView === "events" ? (
        <div className="timeline-section">
          <div className="timeline-section-actions">
            <span>事件轨道 · 当前命中 {hudState.activeEvents.length} 个事件</span>
            <button type="button" onClick={addEvent}>新增事件</button>
          </div>
          <div className="timeline-table timeline-events" role="table" aria-label="时间轴事件">
            <div className="timeline-row timeline-row-head" role="row">
              <span>事件</span>
              <span>类型 / 目标</span>
              <span>开始</span>
              <span>结束</span>
              <span>优先级 / 操作</span>
            </div>
            {lesson.timelineEvents.length === 0 ? (
              <div className="timeline-empty">暂无时间轴事件，点击新增事件开始配置</div>
            ) : lesson.timelineEvents.map((event) => {
              const isActive = hudState.activeEvents.some((activeEvent) => activeEvent.id === event.id);
              return (
                <div className={`timeline-row event-edit-row ${isActive ? "is-current-event" : ""} ${selectedEventId === event.id ? "is-selected" : ""}`} key={event.id} role="row">
                  <div className="event-title-cell">
                    <label>
                      <span>label</span>
                      <input value={event.label ?? getEventTitle(event)} onChange={(changeEvent) => updateEvent(event.id, (draftEvent) => { draftEvent.label = changeEvent.target.value; })} />
                    </label>
                    <label className="toggle-inline">
                      <input checked={event.enabled} type="checkbox" onChange={(changeEvent) => updateEvent(event.id, (draftEvent) => { draftEvent.enabled = changeEvent.target.checked; })} />
                      enabled
                    </label>
                  </div>
                  <div className="event-type-cell">
                    <select
                      aria-label={`${event.id} 事件类型`}
                      value={event.type}
                      onChange={(changeEvent) => {
                        const nextType = changeEvent.target.value as TimelineEventType;
                        updateEvent(event.id, (draftEvent) => {
                          draftEvent.type = nextType;
                          draftEvent.targetComponent = inferTargetComponent(nextType);
                          draftEvent.payload = createDefaultPayload(nextType);
                          if (!draftEvent.endTime && ["tip_show", "warning_show", "summary_show", "homework_show"].includes(nextType)) {
                            draftEvent.endTime = draftEvent.startTime + 8;
                          }
                        });
                      }}
                    >
                      {stage5EventTypes.map((type) => (
                        <option key={type} value={type}>{getEventTypeLabel(type)}</option>
                      ))}
                    </select>
                    <select
                      aria-label={`${event.id} 目标模块`}
                      value={event.targetComponent}
                      onChange={(changeEvent) => updateEvent(event.id, (draftEvent) => { draftEvent.targetComponent = changeEvent.target.value as HudComponentKey; })}
                    >
                      {["course_stage_bar", "chapter_map", "task_tracker", "warning_panel", "bottom_status_hud"].map((target) => (
                        <option key={target} value={target}>{target}</option>
                      ))}
                    </select>
                  </div>
                  <input aria-label={`${event.id} 开始时间`} min={0} step={0.5} type="number" value={event.startTime} onChange={(changeEvent) => updateEvent(event.id, (draftEvent) => { draftEvent.startTime = parseTime(changeEvent.target.value); })} />
                  <input aria-label={`${event.id} 结束时间`} min={0} step={0.5} type="number" value={event.endTime ?? ""} onChange={(changeEvent) => updateEvent(event.id, (draftEvent) => { draftEvent.endTime = parseTime(changeEvent.target.value); })} />
                  <div className="row-actions">
                    <input aria-label={`${event.id} 优先级`} step={1} type="number" value={event.priority} onChange={(changeEvent) => updateEvent(event.id, (draftEvent) => { draftEvent.priority = Number(changeEvent.target.value); })} />
                    <button type="button" onClick={() => { onSelectedEventIdChange(event.id); onCurrentTimeChange(event.startTime); }}>跳转</button>
                    <button type="button" onClick={() => setEventTime(event.id, "startTime")}>开始=当前</button>
                    <button type="button" onClick={() => setEventTime(event.id, "endTime")}>结束=当前</button>
                    <button type="button" onClick={() => deleteEvent(event.id)}>删除</button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedEvent ? (
            <div className="event-payload-editor" aria-label="事件 payload 编辑">
              <strong>{getEventTypeLabel(selectedEvent.type)} payload</strong>
              <EventPayloadFields
                event={selectedEvent}
                lesson={lesson}
                onPayloadChange={(key, value) => updateEventPayload(selectedEvent.id, key, value)}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {activeTimelineView === "validation" ? (
        <div className="validation-grid">
          {validation.status === "idle" ? (
            <div className="validation-card">
              <strong>配置待校验</strong>
              <span>点击顶部“校验配置”后显示 schema 结果</span>
            </div>
          ) : null}
          {validation.status === "valid" ? (
            <div className="validation-card is-ok">
              <strong>配置校验通过</strong>
              <span>当前 lesson 可以导出，并可供 Remotion 读取</span>
            </div>
          ) : null}
          {validation.status === "invalid"
            ? validation.issues.map((issue) => (
                <div className="validation-card is-warn" key={`${issue.path}-${issue.message}`}>
                  <strong>{issue.path}</strong>
                  <span>{issue.message}</span>
                </div>
              ))
            : null}
          <div className="validation-card">
            <strong>素材缺失提示</strong>
            <span>{lesson.media.mainVideo.src.includes("placeholder") ? "未找到主视频，可手动输入预览时间继续配置" : lesson.media.mainVideo.src}</span>
          </div>
        </div>
      ) : null}
    </footer>
  );
}

function EventPayloadFields({
  event,
  lesson,
  onPayloadChange,
}: {
  event: TimelineEvent;
  lesson: LessonProjectConfig;
  onPayloadChange: (key: string, value: unknown) => void;
}) {
  const payload = event.payload as Record<string, unknown>;

  if (event.type === "stage_change") {
    return (
      <div className="payload-grid">
        <label>
          <span>stageId</span>
          <select value={String(payload.stageId ?? "")} onChange={(event) => onPayloadChange("stageId", event.target.value)}>
            <option value="">选择阶段</option>
            {lesson.stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.label}</option>)}
          </select>
        </label>
      </div>
    );
  }

  if (event.type === "map_node_active") {
    return (
      <div className="payload-grid">
        <label>
          <span>nodeId</span>
          <select value={String(payload.nodeId ?? payload.mapNodeId ?? "")} onChange={(event) => onPayloadChange("nodeId", event.target.value)}>
            <option value="">选择地图节点</option>
            {lesson.chapterMap.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
          </select>
        </label>
        <label>
          <span>label</span>
          <input value={String(payload.label ?? "")} onChange={(event) => onPayloadChange("label", event.target.value)} />
        </label>
      </div>
    );
  }

  if (event.type === "task_active" || event.type === "task_done") {
    return (
      <div className="payload-grid">
        <label>
          <span>taskId</span>
          <select value={String(payload.taskId ?? "")} onChange={(event) => onPayloadChange("taskId", event.target.value)}>
            <option value="">选择任务</option>
            {lesson.tasks.map((task) => <option key={task.id} value={task.id}>{task.label}</option>)}
          </select>
        </label>
        <label>
          <span>label</span>
          <input value={String(payload.label ?? "")} onChange={(event) => onPayloadChange("label", event.target.value)} />
        </label>
      </div>
    );
  }

  if (event.type === "ability_unlock") {
    return (
      <div className="payload-grid">
        <label>
          <span>abilityId</span>
          <input value={String(payload.abilityId ?? "")} onChange={(event) => onPayloadChange("abilityId", event.target.value)} />
        </label>
        <label>
          <span>label</span>
          <input value={String(payload.label ?? payload.title ?? "")} onChange={(event) => onPayloadChange("label", event.target.value)} />
        </label>
        <label>
          <span>description</span>
          <input value={String(payload.description ?? payload.body ?? "")} onChange={(event) => onPayloadChange("description", event.target.value)} />
        </label>
      </div>
    );
  }

  return (
    <div className="payload-grid">
      <label>
        <span>title</span>
        <input value={String(payload.title ?? "")} onChange={(event) => onPayloadChange("title", event.target.value)} />
      </label>
      <label>
        <span>text</span>
        <textarea rows={2} value={String(payload.text ?? payload.body ?? "")} onChange={(event) => onPayloadChange("text", event.target.value)} />
      </label>
      <label>
        <span>level</span>
        <select value={String(payload.level ?? "info")} onChange={(event) => onPayloadChange("level", event.target.value)}>
          <option value="info">info</option>
          <option value="warning">warning</option>
          <option value="danger">danger</option>
          <option value="success">success</option>
        </select>
      </label>
    </div>
  );
}
