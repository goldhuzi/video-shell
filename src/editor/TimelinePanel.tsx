import type { HudComponentKey, HudRuntimeState, LessonProjectConfig, TimelineEvent, TimelineView } from "./App";

type TimelinePanelProps = {
  lesson: LessonProjectConfig;
  hudState: HudRuntimeState;
  currentTime: number;
  selectedComponent: HudComponentKey;
  activeTimelineView: TimelineView;
  onCurrentTimeChange: (time: number) => void;
  onTimelineViewChange: (view: TimelineView) => void;
};

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

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
  return typeof payload.title === "string" ? payload.title : event.label ?? event.id;
}

export function TimelinePanel({
  lesson,
  hudState,
  currentTime,
  selectedComponent,
  activeTimelineView,
  onCurrentTimeChange,
  onTimelineViewChange,
}: TimelinePanelProps) {
  return (
    <footer className="timeline-panel" aria-label="底部时间轴配置区">
      <div className="timeline-header">
        <div>
          <strong>时间轴配置</strong>
          <span>
            当前时间 {formatTime(currentTime)} · 选中目标 {selectedComponent}
          </span>
        </div>
        <div className="timeline-tabs" role="tablist">
          <button
            aria-selected={activeTimelineView === "stages"}
            onClick={() => onTimelineViewChange("stages")}
            role="tab"
            type="button"
          >
            阶段
          </button>
          <button
            aria-selected={activeTimelineView === "events"}
            onClick={() => onTimelineViewChange("events")}
            role="tab"
            type="button"
          >
            事件
          </button>
          <button
            aria-selected={activeTimelineView === "validation"}
            onClick={() => onTimelineViewChange("validation")}
            role="tab"
            type="button"
          >
            校验
          </button>
        </div>
      </div>

      {activeTimelineView === "stages" ? (
        <div className="timeline-table" role="table" aria-label="课程阶段">
          <div className="timeline-row timeline-row-head" role="row">
            <span>阶段</span>
            <span>短名</span>
            <span>开始</span>
            <span>结束</span>
            <span>状态</span>
          </div>
          {lesson.stages.map((stage, index) => (
            <button
              className={`timeline-row is-${hudState.stageStates[stage.id]}`}
              key={stage.id}
              onClick={() => onCurrentTimeChange(stage.startTime)}
              role="row"
              type="button"
            >
              <span>{stage.name}</span>
              <span>{stage.shortName ?? stage.name}</span>
              <span>{formatTime(stage.startTime)}</span>
              <span>{formatTime(getStageEndTime(lesson, index))}</span>
              <span>{hudState.stageStates[stage.id]}</span>
            </button>
          ))}
        </div>
      ) : null}

      {activeTimelineView === "events" ? (
        <div className="timeline-table timeline-events" role="table" aria-label="时间轴事件">
          <div className="timeline-row timeline-row-head" role="row">
            <span>事件</span>
            <span>目标模块</span>
            <span>开始</span>
            <span>结束/持续</span>
            <span>优先级</span>
          </div>
          {lesson.timelineEvents.map((event) => (
            <button
              className="timeline-row"
              key={event.id}
              onClick={() => onCurrentTimeChange(event.startTime)}
              role="row"
              type="button"
            >
              <span>{getEventTitle(event)}</span>
              <span>{event.targetComponent}</span>
              <span>{formatTime(event.startTime)}</span>
              <span>{event.endTime ? formatTime(event.endTime) : `${event.duration ?? 0}s`}</span>
              <span>{event.priority}</span>
            </button>
          ))}
        </div>
      ) : null}

      {activeTimelineView === "validation" ? (
        <div className="validation-grid">
          <div className="validation-card is-ok">
            <strong>主视频已导入</strong>
              <span>{lesson.media.mainVideo.label ?? lesson.media.mainVideo.id}</span>
          </div>
          <div className="validation-card is-ok">
            <strong>阶段顺序有效</strong>
            <span>{lesson.stages.length} 个阶段按开始时间递增</span>
          </div>
          <div className="validation-card is-warn">
            <strong>遮挡风险待检查</strong>
            <span>底部阶段条可能覆盖主视频字幕区</span>
          </div>
          <div className="validation-card is-warn">
            <strong>提示文案待压缩</strong>
            <span>WarningPanel 正文建议保持 2 到 3 行</span>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
