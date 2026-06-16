import type { HudComponentKey, HudRuntimeState, LessonProjectConfig, TimelineView } from "./App";
import { PreviewCanvas } from "./PreviewCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { TimelinePanel } from "./TimelinePanel";

type EditorShellProps = {
  lesson: LessonProjectConfig;
  hudState: HudRuntimeState;
  currentTime: number;
  selectedComponent: HudComponentKey;
  activeTimelineView: TimelineView;
  onCurrentTimeChange: (time: number) => void;
  onSelectedComponentChange: (component: HudComponentKey) => void;
  onTimelineViewChange: (view: TimelineView) => void;
};

const componentOptions: Array<{ key: HudComponentKey; label: string }> = [
  { key: "top_header", label: "顶部课程信息" },
  { key: "main_video_frame", label: "主视频画框" },
  { key: "lecturer_mini_card", label: "讲师小窗" },
  { key: "chapter_map", label: "课程地图" },
  { key: "task_tracker", label: "任务追踪" },
  { key: "warning_panel", label: "重点提示" },
  { key: "course_stage_bar", label: "阶段导航" },
  { key: "bottom_status_hud", label: "底部状态" },
];

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function EditorShell({
  lesson,
  hudState,
  currentTime,
  selectedComponent,
  activeTimelineView,
  onCurrentTimeChange,
  onSelectedComponentChange,
  onTimelineViewChange,
}: EditorShellProps) {
  const duration = lesson.media.mainVideo.duration;
  const mainVideoDuration = duration ?? 0;
  const validationCount = 2;

  return (
    <div className="editor-shell">
      <header className="editor-toolbar" aria-label="编辑器工具栏">
        <div className="toolbar-project">
          <span className="toolbar-kicker">{lesson.meta.courseCode ?? "HUD"}</span>
          <strong>{lesson.meta.projectName}</strong>
          <span className="save-state">配置草稿</span>
        </div>
        <div className="toolbar-status" aria-label="项目状态">
          <span className="status-chip status-chip-ok">主视频已就绪</span>
          <span className="status-chip status-chip-warn">{validationCount} 项渲染前检查</span>
          <span className="status-chip">阶段 {lesson.stages.length}</span>
          <span className="status-chip">事件 {lesson.timelineEvents.length}</span>
        </div>
        <div className="toolbar-actions">
          <button type="button">保存配置</button>
          <button type="button">预览 HUD</button>
          <button className="primary-action" type="button">
            渲染检查
          </button>
        </div>
      </header>

      <main className="editor-workspace">
        <aside className="asset-panel" aria-label="素材状态">
          <div className="panel-heading">
            <span>素材状态</span>
            <small>本地引用</small>
          </div>
          <div className="asset-card asset-card-ready">
            <span className="asset-kind">主课程视频</span>
              <strong>{lesson.media.mainVideo.label ?? lesson.media.mainVideo.id}</strong>
            <small>
              {lesson.media.mainVideo.width} x {lesson.media.mainVideo.height} · {formatTime(mainVideoDuration)}
            </small>
          </div>
          <div className="asset-card">
            <span className="asset-kind">讲师视频</span>
            <strong>{lesson.media.lecturerVideo?.label ?? "未配置讲师视频"}</strong>
            <small>可选素材 · 当前使用头像模式</small>
          </div>
          <div className="asset-card asset-card-ready">
            <span className="asset-kind">讲师头像</span>
            <strong>{lesson.media.lecturerAvatar?.label ?? "未配置头像"}</strong>
            <small>已就绪 · 用于 LecturerMiniCard</small>
          </div>
          <div className="asset-note">
            主视频为必需素材；替换主视频后需复查阶段时间、提示持续时间和底部阶段条遮挡风险。
          </div>
        </aside>

        <section className="preview-column" aria-label="最终视频预览区">
          <PreviewCanvas
            hudState={hudState}
            lesson={lesson}
            selectedComponent={selectedComponent}
            onSelectedComponentChange={onSelectedComponentChange}
          />

          <div className="preview-controls" aria-label="编辑器预览控制">
            <div>
              <strong>编辑器预览控制</strong>
              <span>仅用于编辑器预览，不进入最终 MP4</span>
            </div>
            <button type="button" onClick={() => onCurrentTimeChange(Math.max(0, currentTime - 10))}>
              后退 10s
            </button>
            <input
              aria-label="编辑器预览时间"
              max={mainVideoDuration}
              min={0}
              onChange={(event) => onCurrentTimeChange(Number(event.target.value))}
              step={1}
              type="range"
              value={currentTime}
            />
            <button type="button" onClick={() => onCurrentTimeChange(Math.min(mainVideoDuration, currentTime + 10))}>
              前进 10s
            </button>
            <output>{formatTime(currentTime)}</output>
            <button type="button">使用当前时间</button>
            <select
              aria-label="选择预览模块"
              onChange={(event) => onSelectedComponentChange(event.target.value as HudComponentKey)}
              value={selectedComponent}
            >
              {componentOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <PropertyPanel
          hudState={hudState}
          lesson={lesson}
          selectedComponent={selectedComponent}
          onSelectedComponentChange={onSelectedComponentChange}
        />
      </main>

      <TimelinePanel
        activeTimelineView={activeTimelineView}
        currentTime={currentTime}
        hudState={hudState}
        lesson={lesson}
        selectedComponent={selectedComponent}
        onCurrentTimeChange={onCurrentTimeChange}
        onTimelineViewChange={onTimelineViewChange}
      />
    </div>
  );
}
