# 第 7 阶段 HUD 视觉精修说明

## 1. 本阶段完成了什么

第 7 阶段将第一套默认 HUD 模板收敛为 `default-ai-tactical`，中文定位为“AI 战术课程指挥界面”。本阶段聚焦最终 1920 x 1080 视频画面质量，完成了以下视觉精修：

1. 补齐 `src/styles/tokens.css` 中的第 7 阶段颜色、状态、发光、字体和布局变量。
2. 在 `src/styles/hud.css` 中沉淀 render 模式 HUD panel、右侧栏、阶段条、讲师卡、状态标签和提示类型样式。
3. 将编辑器 16:9 预览画框的 HUD 槽位调整为更接近最终模板：更大的主视频、更窄右侧栏、更轻底部 HUD。
4. 将 Remotion 根层标记为 `course-shell-render theme-default-ai-tactical is-render-mode`。
5. 将 `src/remotion/layers/HudLayer.tsx` 从大量内联样式改为 class 驱动的纯展示层。
6. 将 `MainVideoLayer`、`SpeakerLayer` 的视觉外壳收敛到第 7 阶段样式，但不改变媒体、音频和 preflight 流程。

## 2. 本阶段没有做什么

1. 没有做真实课程样片制作。
2. 没有做批量渲染、云端、登录、数据库或队列。
3. 没有做 AI 自动识别章节、自动字幕或自动剪辑。
4. 没有做多主题市场或自由拖拽布局设计器。
5. 没有重写第 6 阶段渲染主流程。
6. 没有把编辑器控件、播放器控件或属性面板引入 Remotion composition。

## 3. 被视觉精修的组件

1. `TopHeader`：高度收敛到 58px，标题、课次、状态标签更薄、更稳。
2. `MainVideoLayer`：主视频区域扩大到 `1548 x 854`，边框降噪，缺失素材占位更像专业素材仓位。
3. `LecturerMiniCard`：保持底部小尺寸，增加指挥官头像式边框、状态线和讲师铭牌。
4. `WarningPanel`：补齐 `info / warning / danger / success / summary / homework` 的视觉口径，正文限制 2-3 行。
5. `TaskTracker`：使用左侧能量条、状态标签和截断策略表达 `done / active / upcoming`。
6. `ChapterMap`：保留纵向路径，节点状态使用点、线、文字共同表达。
7. `CourseStageBar`：改为“阶段段块 + 节点 + 状态铭牌”，避免播放器进度条感。
8. `BottomStatusHud`：收敛为短状态提示和能力解锁标签，不做技能栏。

## 4. 主视频优先如何落实

1. Remotion 主视频区域由旧的约 `1392 x 780` 扩大到 `1548 x 854`。
2. 右侧辅助栏收窄为 `312px`，仅承载地图、任务和提示。
3. 底部 HUD 高度控制在 `104px`，讲师卡为 `248 x 104`。
4. 主视频边框只保留细线和轻微 matte，不使用强发光。
5. 重点提示仍固定在右侧栏，不默认覆盖主视频。

## 5. CourseStageBar 如何避免播放器进度条化

1. 不显示播放、暂停、倍速、音量、全屏、时间码或总时长。
2. 不显示播放头、拖动滑块、可拖动手柄或连续进度填充。
3. 使用阶段段块、节点和状态文案表达课程结构。
4. render 模式中没有 `onClick`、`role="button"` 或 `tabIndex`。
5. 编辑器中阶段点击跳转仍属于画框外/编辑器生产能力，不进入最终 Remotion composition。

## 6. 最终视频无播放器控件如何保证

1. `CourseShellComposition` 仍只组合 `MainVideoLayer`、`SpeakerLayer` 和 `HudLayer`。
2. `src/remotion` 不引用 `PreviewCanvas`、`VideoPreviewController`、`EditorShell`、`PropertyPanel` 或 `TimelinePanel`。
3. Remotion `<Video>` 未传入 `controls`。
4. render root 使用 `.is-render-mode`，视觉层不提供 hover/click 暗示。
5. 完成后需要继续用静态扫描和 still/clip 人工验收双重确认。

## 7. 视觉 token 如何使用

核心 token 位于 `src/styles/tokens.css`：

1. 背景：`--bg-deep`、`--bg-panel`、`--bg-panel-strong`。
2. 边框：`--border-subtle`、`--border-strong`、`--border-gold`。
3. 文本：`--text-main`、`--text-muted`、`--text-dim`。
4. 能量色：`--blue-core`、`--cyan-core`、`--purple-core`、`--gold-core`。
5. 状态色：`--status-done`、`--status-active`、`--status-upcoming`、`--status-locked`、`--status-warning`、`--status-danger`、`--status-success`、`--status-info`。
6. 布局：`--hud-top-height`、`--hud-right-width`、`--hud-bottom-height`、`--hud-main-width`、`--hud-main-height`。

## 8. editor 模式与 render 模式视觉边界

1. 编辑器预览仍使用 `SelectableHud` 外壳实现点选，这只存在于 `src/editor/PreviewCanvas.tsx`。
2. Remotion `HudLayer` 是纯展示层，不使用编辑器外壳。
3. 共享 CSS 中的 `.is-render-mode` 只用于最终展示语义，不提供交互。
4. 编辑器控件和播放控制仍在 16:9 画框外。

## 9. 关键状态样式说明

1. `completed / done`：青绿完成色和实心节点。
2. `current / active`：蓝色边框、轻微能量光和状态标签。
3. `upcoming / not_started`：低亮但可读。
4. `locked`：低透明度和 `LOCK` 标签。
5. `warning / homework / summary`：金色边条与克制发光。
6. `danger`：小面积红橙，不做全屏警报。
7. `success`：青绿色确认感。
8. `ability_unlock`：底部状态 HUD 使用紫色能量边框。

## 10. 已知限制

1. `lesson-01` 仍是占位主视频配置，正式 preflight/render 失败是预期保护。
2. `lesson-render-fixture` 只证明本地安全小样链路可出图，不代表真实课程素材验收。
3. Remotion HUD 和编辑器共享 HUD 组件仍未完全合并，本阶段先统一视觉 token 和布局口径。
4. 当前没有 ESLint `lint` 脚本。
5. 没有自动像素级视觉回归测试，still/clip 仍需人工检查。

## 11. 第 8 阶段建议

1. 准备用户授权真实主视频、讲师视频和头像，但不要提交素材。
2. 替换 `lesson-01` 后跑通 preflight、smoke、still、clip 和 full render。
3. 建立真实单课样片验收记录，重点检查主视频遮挡、音频、关键时间点和最终无控件。
4. 继续收敛 Remotion 与编辑器 HUD 展示组件，但必须隔离编辑器交互外壳。
5. 补充发布前视觉 QA 清单和截图对照流程。
