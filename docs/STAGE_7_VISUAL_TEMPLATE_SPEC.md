# 默认模板规格：default-ai-tactical

## 1. 模板名称

英文模板名：`default-ai-tactical`

视觉名：`AI Tactical HUD`

中文名：AI 战术课程指挥界面。

## 2. 模板定位

`default-ai-tactical` 是《视频课程套壳》第一套默认课程 HUD 模板。它将普通录屏课程包装为结构清晰、任务明确、带轻量游戏化学习导航的 16:9 MP4 成片。

模板不是播放器皮肤，不是游戏素材复刻，也不是后台管理系统。它只服务课程导航、任务推进、重点提示和学习状态表达。

## 3. 适用场景

1. 横屏录屏课程。
2. NotebookLM、PPT、浏览器操作、工具教学类视频。
3. OPC、一人公司、个人课程主理人和小型后期团队的单节课包装。
4. 需要阶段、任务、地图、提示和能力解锁感的知识课程。

## 4. 布局结构

设计基准：`1920 x 1080`。

核心区域：

1. TopHeader：`24,16,1872,58`，薄型课程信息栏。
2. MainVideoLayer：`24,86,1548,854`，主视频第一优先。
3. Right Sidebar：`1584,86,312,854`，包含 ChapterMap、TaskTracker、WarningPanel。
4. LecturerMiniCard：`24,952,248,104`，底部左侧讲师存在感。
5. CourseStageBar：`284,952,1288,104`，底部课程阶段导航。
6. BottomStatusHud：`1584,952,312,104`，短状态和能力解锁。

## 5. 色彩系统

基础背景：

1. `--bg-deep`：深色画布。
2. `--bg-panel`：半透明 HUD 面板。
3. `--bg-panel-strong`：强层级面板。
4. `--bg-video-matte`：主视频底板。

能量色：

1. `--blue-core`：当前状态。
2. `--cyan-core`：同步、路径、信息。
3. `--purple-core`：能力解锁。
4. `--gold-core`：warning、summary、homework。
5. `--danger-core`：高风险提示。
6. `--success-core`：完成和通过。

使用原则：蓝紫只作为能量边缘和状态光，不做大面积污染；普通面板不强发光。

## 6. 字体系统

默认使用系统中文字体：

```css
font-family: "PingFang SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif;
```

不依赖外部在线字体。数字和短标签可使用 `Consolas` / monospace fallback，但中文可读性优先。

字号基准：

1. 顶部标题：约 24px。
2. 顶部副标题和状态：约 13px。
3. 右侧面板标题：12px。
4. 右侧正文：12px - 21px。
5. 阶段条短名：15px。
6. 讲师铭牌：10px - 12px。

## 7. 组件规范

TopHeader：

1. 显示课程代号、课程序号、课程标题、本节标题、当前阶段和状态标签。
2. 长标题使用 ellipsis，不压缩到不可读。

MainVideoLayer：

1. 使用极细边框和深色 matte。
2. 默认 `contain`，保证录屏内容完整。
3. 缺失素材时显示专业占位，不输出浏览器错误页。

LecturerMiniCard：

1. 小尺寸，不抢主视频。
2. 视频或头像由 `SpeakerLayer` 承载，讲师名和身份由 HUD 铭牌显示。
3. 不显示直播互动、弹幕、点赞或连麦元素。

WarningPanel：

1. 默认在右侧栏，不遮挡主视频。
2. 标题最多 2 行，正文最多 3 行。
3. 支持 info、warning、danger、success、summary、homework 视觉状态。

TaskTracker：

1. 当前任务使用左侧能量条和 `ACTIVE` 标签。
2. 完成任务使用 `DONE` 和青绿色。
3. 未开始任务低亮但可读。

ChapterMap：

1. 使用纵向路径。
2. 节点以点、线、文字状态共同表达。
3. 当前节点轻微发光，完成节点实心。

CourseStageBar：

1. 使用阶段段块、节点和状态铭牌。
2. render 模式不可点击、不可拖动。
3. 不显示时间码、播放头、连续进度填充或手柄。

BottomStatusHud：

1. 显示当前状态、能力解锁、summary/homework 短提示。
2. 不堆叠长正文，不做技能栏按钮。

## 8. 状态规范

1. `completed / done`：青绿，实心节点，完成感明确。
2. `current / active`：蓝色，轻微能量光，当前模块明显。
3. `upcoming / not_started`：低亮，保持可读。
4. `locked`：低透明度，可显示 `LOCK`。
5. `warning`：金色边条和短发光。
6. `danger`：红橙边条，局部使用。
7. `success`：绿色确认。
8. `info`：蓝青信息态。

状态不能只靠颜色表达，必须结合点、线、标签或边框。

## 9. 动效规范

第 7 阶段仅允许克制状态动效：

1. active 状态轻微 glow。
2. WarningPanel 切换可使用轻微 fade/slide。
3. ability_unlock 可使用一次短 pulse。
4. 禁止高频闪烁、复杂粒子、屏幕震动、大面积扫光或遮挡主视频动画。

当前代码以静态可渲染状态为主，避免引入 Remotion 不稳定动画。

## 10. 禁止项

1. 播放、暂停、倍速、音量、全屏。
2. 可拖动进度条、播放头、时间拖动手柄。
3. `button/input/select/textarea` 等表单控件进入 Remotion。
4. `onClick`、`role="button"`、`tabIndex` 等交互暗示进入最终视频层。
5. 编辑器属性面板、时间轴表格、选中框进入最终视频。
6. 复制任何受版权保护的游戏 UI、图标、字体或素材。
7. 大面积霓虹、土豪金、页游式装饰或直播间特效。
8. 多主题市场、自由拖拽布局、云端 SaaS 或批量渲染。

## 11. 可配置项

可通过 lesson 配置修改：

1. 课程标题、章节标题、lessonIndex / totalLessons、状态标签、主线任务。
2. 讲师姓名、身份、视频/头像/隐藏策略。
3. 主视频路径和 `mainVideoFitMode`。
4. 右侧栏显示模式。
5. 课程阶段、任务、地图节点、提示和时间轴事件。
6. BottomStatusHud 是否显示。

## 12. 不建议用户随意改动的项

1. 主视频区域尺寸和安全区。
2. 右侧栏宽度。
3. 底部 HUD 高度。
4. CourseStageBar 的非播放器结构。
5. 字体系统、状态色和发光强度。
6. Remotion composition 的展示层边界。

这些属于默认模板的交付质量边界，应由模板维护者统一调整。

## 13. 后续多模板扩展建议

多模板扩展应后置到默认模板稳定之后。未来如需扩展，可考虑：

1. 保留 `default-ai-tactical` 为基线模板。
2. 新增模板时先复制 token 和文档规格，不直接修改默认模板。
3. 每套模板必须独立声明主视频安全区、组件尺寸、状态规范和禁用项。
4. 不允许任何模板把最终视频变成播放器或自由设计画布。
