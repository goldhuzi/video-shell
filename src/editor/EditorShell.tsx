import type { HudComponentKey, HudRuntimeState, LessonProjectConfig, TimelineView } from "./App";
import { PreviewCanvas } from "./PreviewCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { TimelinePanel } from "./TimelinePanel";
import type { EditorLessonState } from "./state/editorState";
import { VideoPreviewController } from "./timeline/VideoPreviewController";
import { formatTime } from "../utils/timeFormat";

type EditorShellProps = {
  lesson: LessonProjectConfig;
  editorState: EditorLessonState;
  hudState: HudRuntimeState;
  currentTime: number;
  selectedComponent: HudComponentKey;
  selectedStageId?: string;
  selectedEventId?: string;
  activeTimelineView: TimelineView;
  onCurrentTimeChange: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onExportLesson: () => void;
  onRefreshPreview: () => void;
  onRenderRequest: () => void;
  onSaveLesson: () => void;
  onSelectedComponentChange: (component: HudComponentKey) => void;
  onSelectedStageIdChange: (stageId?: string) => void;
  onSelectedEventIdChange: (eventId?: string) => void;
  onTimelineViewChange: (view: TimelineView) => void;
  onUpdateLesson: (updater: (draft: LessonProjectConfig) => void) => void;
  onValidateLesson: () => void;
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

export function EditorShell({
  editorState,
  lesson,
  hudState,
  currentTime,
  selectedComponent,
  selectedStageId,
  selectedEventId,
  activeTimelineView,
  onCurrentTimeChange,
  onDurationChange,
  onExportLesson,
  onRefreshPreview,
  onRenderRequest,
  onSaveLesson,
  onSelectedComponentChange,
  onSelectedStageIdChange,
  onSelectedEventIdChange,
  onTimelineViewChange,
  onUpdateLesson,
  onValidateLesson,
}: EditorShellProps) {
  const duration = lesson.media.mainVideo.duration;
  const mainVideoDuration = duration ?? 0;
  const validationCount = editorState.validation.issues.length;
  const validationLabel =
    editorState.validation.status === "valid"
      ? "配置校验通过"
      : editorState.validation.status === "invalid"
        ? `${validationCount} 项配置错误`
        : "配置待校验";
  const lastExportText = editorState.lastExportedAt
    ? new Date(editorState.lastExportedAt).toLocaleTimeString()
    : "尚未导出";
  const handleUseCurrentTime = () => {
    onUpdateLesson((draft) => {
      if (activeTimelineView === "events" && selectedEventId) {
        const event = draft.timelineEvents.find((item) => item.id === selectedEventId);
        if (event) {
          event.startTime = Math.round(currentTime * 10) / 10;
        }
        return;
      }

      const stage = draft.stages.find((item) => item.id === selectedStageId);
      if (stage) {
        stage.startTime = Math.round(currentTime * 10) / 10;
      }
    });
  };

  return (
    <div className="editor-shell">
      <header className="editor-toolbar" aria-label="编辑器工具栏">
        <div className="toolbar-project">
          <span className="toolbar-kicker">{lesson.meta.courseCode ?? "HUD"}</span>
          <strong>视频课程套壳</strong>
          <span className="save-state">{lesson.meta.projectName}</span>
          <span className="save-state">配置草稿</span>
        </div>
        <div className="toolbar-status" aria-label="项目状态">
          <span className="status-chip status-chip-ok">lesson-01</span>
          <span
            className={`status-chip ${
              editorState.validation.status === "invalid" ? "status-chip-warn" : "status-chip-ok"
            }`}
          >
            {validationLabel}
          </span>
          <span className="status-chip">阶段 {lesson.stages.length}</span>
          <span className="status-chip">事件 {lesson.timelineEvents.length}</span>
        </div>
        <div className="toolbar-actions">
          <button type="button" onClick={onValidateLesson}>校验配置</button>
          <button type="button" onClick={onExportLesson}>导出配置</button>
          <button type="button" onClick={onSaveLesson}>保存配置</button>
          <button type="button" onClick={onRefreshPreview}>预览刷新</button>
          <button className="primary-action" type="button" onClick={onRenderRequest}>
            渲染
          </button>
        </div>
      </header>

      <div className={`editor-message is-${editorState.message.tone}`} role="status">
        {editorState.message.text}
      </div>

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
            <code>{lesson.media.mainVideo.src}</code>
          </div>
          <div className="asset-card">
            <span className="asset-kind">讲师视频</span>
            <strong>{lesson.media.speakerVideo?.label ?? lesson.media.lecturerVideo?.label ?? "未配置讲师视频"}</strong>
            <small>可选素材 · {lesson.media.useSpeakerVideo ? "当前优先使用视频" : "当前优先使用头像"}</small>
            <code>{lesson.media.speakerVideo?.src ?? lesson.media.lecturerVideo?.src ?? "未配置路径"}</code>
          </div>
          <div className="asset-card asset-card-ready">
            <span className="asset-kind">讲师头像</span>
            <strong>{lesson.media.speakerImage?.label ?? lesson.media.lecturerAvatar?.label ?? "未配置头像"}</strong>
            <small>已就绪 · 用于 LecturerMiniCard</small>
            <code>{lesson.media.speakerImage?.src ?? lesson.media.lecturerAvatar?.src ?? "未配置路径"}</code>
          </div>
          <div className="asset-card">
            <span className="asset-kind">配置状态</span>
            <strong>{validationLabel}</strong>
            <small>最近导出：{lastExportText}</small>
          </div>
          <div className="asset-note">
            浏览器端暂不直接判断本地文件是否存在。若素材路径缺失或仍为占位路径，预览和 Remotion 会显示占位画面。
          </div>
        </aside>

        <section className="preview-column" aria-label="最终视频预览区">
          <PreviewCanvas
            hudState={hudState}
            lesson={lesson}
            selectedComponent={selectedComponent}
            onStageClick={(stageId, startTime) => {
              onSelectedStageIdChange(stageId);
              onTimelineViewChange("stages");
              if (startTime !== undefined) {
                onCurrentTimeChange(startTime);
              }
            }}
            onSelectedComponentChange={onSelectedComponentChange}
          />

          <div className="preview-controls" aria-label="编辑器预览控制">
            <div>
              <strong>编辑器预览控制</strong>
              <span>仅用于编辑器预览，不进入最终 MP4</span>
            </div>
            <VideoPreviewController
              currentTime={currentTime}
              fallbackDuration={mainVideoDuration}
              src={lesson.media.mainVideo.src}
              onCurrentTimeChange={onCurrentTimeChange}
              onDurationChange={onDurationChange}
            />
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
            <button type="button" onClick={handleUseCurrentTime}>使用当前时间</button>
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
          currentTime={currentTime}
          hudState={hudState}
          lesson={lesson}
          selectedComponent={selectedComponent}
          selectedEventId={selectedEventId}
          selectedStageId={selectedStageId}
          onSelectedComponentChange={onSelectedComponentChange}
          onSelectedEventIdChange={onSelectedEventIdChange}
          onSelectedStageIdChange={onSelectedStageIdChange}
          onUpdateLesson={onUpdateLesson}
        />
      </main>

      <TimelinePanel
        activeTimelineView={activeTimelineView}
        currentTime={currentTime}
        hudState={hudState}
        lesson={lesson}
        selectedComponent={selectedComponent}
        selectedEventId={selectedEventId}
        selectedStageId={selectedStageId}
        onCurrentTimeChange={onCurrentTimeChange}
        onSelectedEventIdChange={onSelectedEventIdChange}
        onSelectedStageIdChange={onSelectedStageIdChange}
        onTimelineViewChange={onTimelineViewChange}
        onUpdateLesson={onUpdateLesson}
        validation={editorState.validation}
      />
    </div>
  );
}
