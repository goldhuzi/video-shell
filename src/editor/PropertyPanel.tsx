import type { ChangeEvent } from "react";
import type { HudComponentKey, HudRuntimeState, LessonProjectConfig } from "./App";
import { getEventTypeLabel } from "../utils/eventRules";
import { formatTime } from "../utils/timeFormat";

type PropertyPanelProps = {
  lesson: LessonProjectConfig;
  hudState: HudRuntimeState;
  currentTime: number;
  selectedComponent: HudComponentKey;
  selectedStageId?: string;
  selectedEventId?: string;
  onSelectedComponentChange: (component: HudComponentKey) => void;
  onSelectedStageIdChange: (stageId?: string) => void;
  onSelectedEventIdChange: (eventId?: string) => void;
  onUpdateLesson: (updater: (draft: LessonProjectConfig) => void) => void;
};

const componentLabels: Record<HudComponentKey, string> = {
  top_header: "顶部课程信息",
  main_video_frame: "主视频画框",
  lecturer_mini_card: "讲师小窗",
  chapter_map: "课程地图",
  task_tracker: "任务追踪",
  warning_panel: "重点提示",
  course_stage_bar: "阶段导航",
  bottom_status_hud: "底部状态 HUD",
};

const fitModeOptions: Array<LessonProjectConfig["media"]["mainVideoFitMode"]> = [
  "contain",
  "cover",
  "fit-width",
  "fit-height",
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function defaultHintIndex(lesson: LessonProjectConfig) {
  const index = lesson.warning.items.findIndex(
    (hint) => hint.id === lesson.warning.defaultHintId,
  );
  return index >= 0 ? index : 0;
}

export function PropertyPanel({
  lesson,
  hudState,
  currentTime,
  selectedComponent,
  selectedStageId,
  selectedEventId,
  onSelectedComponentChange,
  onSelectedStageIdChange,
  onSelectedEventIdChange,
  onUpdateLesson,
}: PropertyPanelProps) {
  const hintIndex = defaultHintIndex(lesson);
  const defaultHint = lesson.warning.items[hintIndex];
  const selectedStage = lesson.stages.find((stage) => stage.id === selectedStageId);
  const selectedEvent = lesson.timelineEvents.find((event) => event.id === selectedEventId);

  const updateString =
    (apply: (draft: LessonProjectConfig, value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onUpdateLesson((draft) => apply(draft, event.target.value));
    };

  const updateNumber =
    (apply: (draft: LessonProjectConfig, value: number) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateLesson((draft) => apply(draft, toNumber(event.target.value)));
    };

  const updateBoolean =
    (apply: (draft: LessonProjectConfig, value: boolean) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateLesson((draft) => apply(draft, event.target.checked));
    };

  return (
    <aside className="property-panel" aria-label="右侧属性面板">
      <div className="panel-heading">
        <span>{componentLabels[selectedComponent]}</span>
        <small>属性编辑</small>
      </div>

      <label className="field-block">
        <span>切换模块</span>
        <select
          onChange={(event) => onSelectedComponentChange(event.target.value as HudComponentKey)}
          value={selectedComponent}
        >
          {Object.entries(componentLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {selectedStage ? (
        <section className="property-section is-focused">
          <h2>当前选中阶段</h2>
          <div className="field-grid">
            <label className="field-block">
              <span>stage.id</span>
              <input readOnly value={selectedStage.id} />
            </label>
            <label className="field-block">
              <span>stage.label</span>
              <input
                value={selectedStage.label}
                onChange={updateString((draft, value) => {
                  const stage = draft.stages.find((item) => item.id === selectedStage.id);
                  if (stage) {
                    stage.label = value;
                    stage.name = value;
                  }
                })}
              />
            </label>
            <div className="field-row">
              <label className="field-block">
                <span>startTime</span>
                <input
                  min={0}
                  step={0.5}
                  type="number"
                  value={selectedStage.startTime}
                  onChange={updateNumber((draft, value) => {
                    const stage = draft.stages.find((item) => item.id === selectedStage.id);
                    if (stage) {
                      stage.startTime = value;
                    }
                  })}
                />
              </label>
              <label className="field-block">
                <span>endTime</span>
                <input
                  min={0}
                  step={0.5}
                  type="number"
                  value={selectedStage.endTime ?? ""}
                  onChange={updateNumber((draft, value) => {
                    const stage = draft.stages.find((item) => item.id === selectedStage.id);
                    if (stage) {
                      stage.endTime = value;
                    }
                  })}
                />
              </label>
            </div>
            <div className="panel-action-row">
              <button
                type="button"
                onClick={() => onUpdateLesson((draft) => {
                  const stage = draft.stages.find((item) => item.id === selectedStage.id);
                  if (stage) {
                    stage.startTime = currentTime;
                  }
                })}
              >
                开始时间 = 当前时间
              </button>
              <button
                type="button"
                onClick={() => onUpdateLesson((draft) => {
                  const stage = draft.stages.find((item) => item.id === selectedStage.id);
                  if (stage) {
                    stage.endTime = currentTime;
                  }
                })}
              >
                结束时间 = 当前时间
              </button>
              <button type="button" onClick={() => onSelectedStageIdChange(undefined)}>
                取消选择
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {selectedEvent ? (
        <section className="property-section is-focused">
          <h2>当前选中事件</h2>
          <div className="field-grid">
            <label className="field-block">
              <span>event.id</span>
              <input readOnly value={selectedEvent.id} />
            </label>
            <label className="field-block">
              <span>event.type</span>
              <input readOnly value={getEventTypeLabel(selectedEvent.type)} />
            </label>
            <div className="field-row">
              <label className="field-block">
                <span>startTime</span>
                <input
                  min={0}
                  step={0.5}
                  type="number"
                  value={selectedEvent.startTime}
                  onChange={updateNumber((draft, value) => {
                    const event = draft.timelineEvents.find((item) => item.id === selectedEvent.id);
                    if (event) {
                      event.startTime = value;
                    }
                  })}
                />
              </label>
              <label className="field-block">
                <span>endTime</span>
                <input
                  min={0}
                  step={0.5}
                  type="number"
                  value={selectedEvent.endTime ?? ""}
                  onChange={updateNumber((draft, value) => {
                    const event = draft.timelineEvents.find((item) => item.id === selectedEvent.id);
                    if (event) {
                      event.endTime = value;
                    }
                  })}
                />
              </label>
            </div>
            <label className="field-block">
              <span>targetComponent</span>
              <input readOnly value={selectedEvent.targetComponent} />
            </label>
            <label className="field-block">
              <span>payload 预览</span>
              <textarea readOnly rows={4} value={JSON.stringify(selectedEvent.payload, null, 2)} />
            </label>
            <div className="panel-action-row">
              <button
                type="button"
                onClick={() => onUpdateLesson((draft) => {
                  const event = draft.timelineEvents.find((item) => item.id === selectedEvent.id);
                  if (event) {
                    event.startTime = currentTime;
                  }
                })}
              >
                开始时间 = 当前时间
              </button>
              <button
                type="button"
                onClick={() => onUpdateLesson((draft) => {
                  const event = draft.timelineEvents.find((item) => item.id === selectedEvent.id);
                  if (event) {
                    event.endTime = currentTime;
                  }
                })}
              >
                结束时间 = 当前时间
              </button>
              <button type="button" onClick={() => onSelectedEventIdChange(undefined)}>
                取消选择
              </button>
            </div>
            <small>当前预览时间：{formatTime(currentTime)}</small>
          </div>
        </section>
      ) : null}

      <section className="property-section">
        <h2>A. 课程信息</h2>
        <div className="field-grid">
          <label className="field-block">
            <span>courseTitle</span>
            <input
              value={lesson.meta.courseTitle}
              onChange={updateString((draft, value) => {
                draft.meta.courseTitle = value;
              })}
            />
          </label>
          <div className="field-row">
            <label className="field-block">
              <span>lessonIndex</span>
              <input
                min={1}
                type="number"
                value={lesson.meta.lessonIndex}
                onChange={updateNumber((draft, value) => {
                  draft.meta.lessonIndex = value;
                })}
              />
            </label>
            <label className="field-block">
              <span>totalLessons</span>
              <input
                min={1}
                type="number"
                value={lesson.meta.totalLessons}
                onChange={updateNumber((draft, value) => {
                  draft.meta.totalLessons = value;
                })}
              />
            </label>
          </div>
          <label className="field-block">
            <span>lessonTitle</span>
            <input
              value={lesson.meta.lessonTitle}
              onChange={updateString((draft, value) => {
                draft.meta.lessonTitle = value;
              })}
            />
          </label>
          <label className="field-block">
            <span>mission</span>
            <textarea
              rows={3}
              value={lesson.meta.mainMission ?? ""}
              onChange={updateString((draft, value) => {
                draft.meta.mainMission = value;
              })}
            />
          </label>
        </div>
      </section>

      <section className="property-section">
        <h2>B. 讲师信息</h2>
        <div className="field-grid">
          <label className="field-block">
            <span>speaker.name</span>
            <input
              value={lesson.speaker.name ?? ""}
              onChange={updateString((draft, value) => {
                draft.speaker.name = value;
              })}
            />
          </label>
          <label className="field-block">
            <span>speaker.role</span>
            <input
              value={lesson.speaker.role ?? lesson.speaker.title ?? ""}
              onChange={updateString((draft, value) => {
                draft.speaker.role = value;
                draft.speaker.title = value;
              })}
            />
          </label>
          {(lesson.speaker.stats ?? []).map((stat, index) => (
            <div className="field-row" key={`${stat.label}-${index}`}>
              <label className="field-block">
                <span>stats label</span>
                <input
                  value={stat.label}
                  onChange={updateString((draft, value) => {
                    if (!draft.speaker.stats) {
                      draft.speaker.stats = [];
                    }
                    draft.speaker.stats[index].label = value;
                  })}
                />
              </label>
              <label className="field-block">
                <span>stats value</span>
                <input
                  value={stat.value}
                  onChange={updateString((draft, value) => {
                    if (!draft.speaker.stats) {
                      draft.speaker.stats = [];
                    }
                    draft.speaker.stats[index].value = value;
                  })}
                />
              </label>
            </div>
          ))}
          <label className="toggle-row">
            <input
              checked={lesson.media.useSpeakerVideo}
              type="checkbox"
              onChange={updateBoolean((draft, value) => {
                draft.media.useSpeakerVideo = value;
                draft.speaker.displayMode = value ? "video" : "avatar";
              })}
            />
            <span>useSpeakerVideo</span>
          </label>
        </div>
      </section>

      <section className="property-section">
        <h2>C. 素材路径</h2>
        <div className="field-grid">
          <label className="field-block">
            <span>media.mainVideo</span>
            <input
              value={lesson.media.mainVideo.src}
              onChange={updateString((draft, value) => {
                draft.media.mainVideo.src = value;
              })}
            />
          </label>
          <label className="field-block">
            <span>media.speakerVideo</span>
            <input
              value={lesson.media.speakerVideo?.src ?? lesson.media.lecturerVideo?.src ?? ""}
              onChange={updateString((draft, value) => {
                const target = draft.media.speakerVideo ?? draft.media.lecturerVideo;
                if (target) {
                  target.src = value;
                }
              })}
            />
          </label>
          <label className="field-block">
            <span>media.speakerImage</span>
            <input
              value={lesson.media.speakerImage?.src ?? lesson.media.lecturerAvatar?.src ?? ""}
              onChange={updateString((draft, value) => {
                const target = draft.media.speakerImage ?? draft.media.lecturerAvatar;
                if (target) {
                  target.src = value;
                }
              })}
            />
          </label>
          <label className="field-block">
            <span>mainVideoFitMode</span>
            <select
              value={lesson.media.mainVideoFitMode}
              onChange={updateString((draft, value) => {
                const fitMode = value as LessonProjectConfig["media"]["mainVideoFitMode"];
                draft.media.mainVideoFitMode = fitMode;
                draft.layout.mainVideoFitMode =
                  fitMode === "fit-width" ? "fit_width" : fitMode === "fit-height" ? "fit_height" : fitMode;
              })}
            >
              {fitModeOptions.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="property-section">
        <h2>D. 重点提示</h2>
        <div className="field-grid">
          <label className="field-block">
            <span>warning.title</span>
            <input
              value={defaultHint?.title ?? ""}
              onChange={updateString((draft, value) => {
                if (draft.warning.items[hintIndex]) {
                  draft.warning.items[hintIndex].title = value;
                }
              })}
            />
          </label>
          <label className="field-block">
            <span>warning.text</span>
            <textarea
              rows={3}
              value={defaultHint?.body ?? ""}
              onChange={updateString((draft, value) => {
                if (draft.warning.items[hintIndex]) {
                  draft.warning.items[hintIndex].body = value;
                }
              })}
            />
          </label>
        </div>
      </section>

      <section className="property-section">
        <h2>E. 任务追踪</h2>
        <div className="field-grid compact-list">
          {lesson.tasks.map((task, index) => (
            <label className="field-block" key={task.id}>
              <span>{task.id}</span>
              <input
                value={task.label}
                onChange={updateString((draft, value) => {
                  draft.tasks[index].label = value;
                  draft.tasks[index].title = value;
                })}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="property-section">
        <h2>F. 课程地图</h2>
        <div className="field-grid compact-list">
          {lesson.chapterMap.nodes.map((node, index) => (
            <label className="field-block" key={node.id}>
              <span>{node.id}</span>
              <input
                value={node.label}
                onChange={updateString((draft, value) => {
                  draft.chapterMap.nodes[index].label = value;
                })}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="property-section">
        <h2>G. 底部课程阶段条</h2>
        <div className="field-grid compact-list">
          {lesson.stages.map((stage, index) => (
            <div className="stage-edit-card" key={stage.id}>
              <label className="field-block">
                <span>stage label</span>
                <input
                  value={stage.label}
                  onChange={updateString((draft, value) => {
                    draft.stages[index].label = value;
                    draft.stages[index].name = value;
                  })}
                />
              </label>
              <div className="field-row">
                <label className="field-block">
                  <span>startTime</span>
                  <input
                    min={0}
                    step={1}
                    type="number"
                    value={stage.startTime}
                    onChange={updateNumber((draft, value) => {
                      draft.stages[index].startTime = value;
                    })}
                  />
                </label>
                <label className="field-block">
                  <span>endTime</span>
                  <input
                    min={0}
                    step={1}
                    type="number"
                    value={stage.endTime ?? ""}
                    onChange={updateNumber((draft, value) => {
                      draft.stages[index].endTime = value;
                    })}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="property-section">
        <h2>H. 基础布局开关</h2>
        <div className="field-grid">
          <label className="toggle-row">
            <input
              checked={lesson.layout.showTopHeader ?? lesson.layout.topHeader.visible}
              type="checkbox"
              onChange={updateBoolean((draft, value) => {
                draft.layout.showTopHeader = value;
                draft.layout.topHeader.visible = value;
              })}
            />
            <span>showTopHeader</span>
          </label>
          <label className="toggle-row">
            <input
              checked={lesson.layout.showRightPanel ?? lesson.layout.rightSidebar.visible}
              type="checkbox"
              onChange={updateBoolean((draft, value) => {
                draft.layout.showRightPanel = value;
                draft.layout.rightSidebar.visible = value;
              })}
            />
            <span>showRightPanel</span>
          </label>
          <label className="toggle-row">
            <input
              checked={lesson.layout.showBottomHud ?? lesson.layout.bottomStatusHud.visible}
              type="checkbox"
              onChange={updateBoolean((draft, value) => {
                draft.layout.showBottomHud = value;
                draft.layout.bottomStatusHud.visible = value;
              })}
            />
            <span>showBottomHud</span>
          </label>
          <label className="toggle-row">
            <input
              checked={lesson.layout.showLecturerCard ?? lesson.layout.lecturer.visible}
              type="checkbox"
              onChange={updateBoolean((draft, value) => {
                draft.layout.showLecturerCard = value;
                draft.layout.lecturer.visible = value;
                draft.speaker.positionPreset = value ? "bottom-left" : "hidden";
              })}
            />
            <span>showLecturerCard</span>
          </label>
          <label className="toggle-row">
            <input
              checked={lesson.layout.showCourseStageBar ?? lesson.layout.stageBar.visible}
              type="checkbox"
              onChange={updateBoolean((draft, value) => {
                draft.layout.showCourseStageBar = value;
                draft.layout.stageBar.visible = value;
              })}
            />
            <span>showCourseStageBar</span>
          </label>
        </div>
      </section>

      <section className="property-section">
        <h2>运行态</h2>
        <dl className="runtime-list">
          <div>
            <dt>当前阶段</dt>
            <dd>{hudState.currentStage?.name ?? "未命中阶段"}</dd>
          </div>
          <div>
            <dt>重点提示</dt>
            <dd>{hudState.activeHint?.title ?? "暂无提示"}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
