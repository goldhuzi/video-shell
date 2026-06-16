import type { HudComponentKey, HudRuntimeState, LessonProjectConfig } from "./App";

type PropertyPanelProps = {
  lesson: LessonProjectConfig;
  hudState: HudRuntimeState;
  selectedComponent: HudComponentKey;
  onSelectedComponentChange: (component: HudComponentKey) => void;
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

export function PropertyPanel({
  lesson,
  hudState,
  selectedComponent,
  onSelectedComponentChange,
}: PropertyPanelProps) {
  return (
    <aside className="property-panel" aria-label="右侧属性面板">
      <div className="panel-heading">
        <span>{componentLabels[selectedComponent]}</span>
        <small>当前选中模块</small>
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

      <section className="property-section">
        <h2>基础字段</h2>
        <div className="field-grid">
          <label className="field-block">
            <span>课程标题</span>
            <input readOnly value={lesson.meta.courseTitle} />
          </label>
          <label className="field-block">
            <span>章节标题</span>
            <input readOnly value={lesson.meta.lessonTitle} />
          </label>
          <label className="field-block">
            <span>状态标签</span>
            <input readOnly value={lesson.meta.statusLabel ?? "MISSION READY"} />
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
          <div>
            <dt>底部状态</dt>
            <dd>{hudState.activeBottomStatus?.title ?? "待机"}</dd>
          </div>
        </dl>
      </section>

      <section className="property-section">
        <h2>时间与绑定</h2>
        <div className="inspector-note">
          此处为占位属性面板，后续接入表单时建议只写入选中模块的局部字段，并由
          App/PreviewCanvas 层重新派生 HUD 运行态。
        </div>
        <div className="check-row">
          <span className="check-dot check-dot-ok" />
          <span>最终视频组件不包含编辑器选中框</span>
        </div>
        <div className="check-row">
          <span className="check-dot check-dot-warn" />
          <span>主视频底部字幕区需人工检查阶段条遮挡</span>
        </div>
      </section>
    </aside>
  );
}
