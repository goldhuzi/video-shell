# 第 5 阶段时间轴编辑与联动预览审查报告

## 1. 总体结论

结论：有条件通过。

第 5 阶段已经完成“时间轴编辑与联动预览 MVP”的主链路：编辑器以统一 `currentTime/previewTime` 驱动 HUD 状态，支持 stages 和 timelineEvents 的新增、编辑、删除、跳转和导出；`deriveHudState` 作为共享状态推导被编辑器和 Remotion 同时消费；Remotion composition 可以打开和渲染样片，最终 composition 未发现播放器控件或编辑器控件。

本阶段未越界到剪辑软件、课程平台、播放器、自由设计工具、AI 自动识别、字幕/波形、多轨剪辑、数据库、登录、云协作或批量渲染。

允许进入第 6 阶段。进入第 6 阶段前建议优先处理 P1 问题，尤其是 `stage_change` 事件语义、schema 交叉引用校验、`targetComponent` runtime 归属、素材检查和关键时间点验收脚本。

## 2. 核心评分

| 审查项 | 评分 | 判断 |
| --- | ---: | --- |
| 视频 currentTime 接入能力 | 4/5 | `VideoPreviewController` 能读取 `video.currentTime` 和 `duration`，主视频缺失时有手动 fallback；外层 duration fallback 仍需统一。 |
| previewTime 状态管理 | 4/5 | `App.tsx` 中 `currentTime` 是共享状态，视频、手动输入、阶段跳转和事件跳转都能回写；输入体验还有打磨空间。 |
| stages 编辑能力 | 4/5 | 支持新增、删除、编辑、跳转和当前时间写入；右侧属性面板修改阶段时间时未统一排序和 order。 |
| timelineEvents 编辑能力 | 4/5 | 支持新增、删除、启用、类型、目标、时间、优先级和 payload；`stage_change` 事件当前未真正驱动阶段状态。 |
| HUD 联动预览能力 | 4/5 | 阶段、地图、任务、提示、底部状态能随时间变化；部分 payload 字段写入后未被 runtime 消费。 |
| deriveHudState 完整性 | 3/5 | 返回字段完整并支持主要事件；`targetComponent`、`stage_change`、持久事件 active 语义仍需收紧。 |
| CourseStageBar 合规度 | 4/5 | 阶段条表达学习导航，不像播放器进度条；编辑器模式可点击，渲染模式无交互。 |
| ChapterMap 联动能力 | 3/5 | 支持阶段默认联动和地图事件；能力解锁可能把当前节点从 current 覆盖为 unlocked。 |
| TaskTracker 联动能力 | 4/5 | 支持默认阶段任务、task_active 和 task_done；homework_show 尚未同步 TaskTracker。 |
| WarningPanel / NoticePanel 联动能力 | 4/5 | tip/warning/summary/homework 可显示并按 priority 选择；bullets/checklist 未明确展示。 |
| schema 校验完整性 | 3/5 | 事件基础、时间、payload、唯一 ID 和部分引用已校验；默认引用与归属引用校验不足。 |
| 配置导出完整性 | 4/5 | 导出入口会先校验并保留 stages/timelineEvents；底层导出函数依赖调用方校验。 |
| Remotion 兼容性 | 4/5 | Studio 和 render 可用，按 frame/fps 调用共享状态；仍缺关键时间点 still/片段验收。 |
| 最终视频无播放器控件合规度 | 5/5 | Remotion composition 未发现播放、暂停、倍速、音量、全屏、拖动进度条或表单控件。 |
| 第 6 阶段准备度 | 4/5 | 可以进入第 6 阶段，但素材检查、导入配置、自动化测试和 still 验收必须补。 |

## 3. 已通过项

1. `src/editor/App.tsx` 使用单一 `currentTime` 计算 `deriveHudState(editorState.lesson, currentTime)`，预览状态来源清楚。
2. `src/editor/timeline/VideoPreviewController.tsx` 画框外承载播放、暂停、拖动、`currentTime` 和 `duration` 读取能力。
3. `src/editor/TimelinePanel.tsx` 支持 stages 新增、删除、编辑、跳转，以及 `timelineEvents` 新增、删除、启用、类型、目标、时间、优先级和 payload 编辑。
4. `src/utils/timeline.ts` 输出 `currentTime`、`currentStage`、`stageStatuses`、`activeEvents`、`activeWarning`、`taskStatuses`、`chapterMapStatuses`、`unlockedAbilities`、`activeSummary`、`activeHomework` 等核心运行态。
5. `src/data/lessons/lesson-01.json` 覆盖 `stage_change`、`map_node_active`、`task_active`、`task_done`、`tip_show`、`warning_show`、`ability_unlock`、`summary_show`、`homework_show`。
6. `src/remotion/CourseShellComposition.tsx` 通过 `frame / fps` 计算 `currentTime`，并调用共享 `deriveHudState`。
7. `src/remotion/CourseShellComposition.tsx` 只挂载 `MainVideoLayer`、`SpeakerLayer`、`HudLayer`，未引用 `src/editor`。
8. `src/remotion/layers/MainVideoLayer.tsx` 和 `src/remotion/layers/SpeakerLayer.tsx` 使用 Remotion `<Video>`，没有传入 `controls`。
9. 静态扫描 `src/remotion` 未发现 `<button`、`<input`、`<select`、`controls`。
10. 第 5 阶段没有引入数据库、登录、云协作、队列、Vercel、AI 自动识别、字幕、波形、多轨剪辑或自由拖拽设计器。

## 4. 主要问题

1. `src/utils/timeline.ts`：`stage_change` 被 schema、事件表和示例配置支持，但不会覆盖 `currentStage` 或 `stageStatuses`。当前示例中 `stage_change.startTime` 刚好等于阶段起点，所以问题被掩盖。应明确它只是兼容/标记事件，或真正让它按 priority 覆盖阶段运行态。
2. `src/schemas/lesson.schema.ts`：schema 缺少多处交叉引用校验，包括 `stage.mapNodeId`、`stage.defaultTaskId`、`stage.defaultHintId`、`task.stageId`、`chapterMap.nodes[].stageId`、`warning.defaultHintId`、`warning.items[].stageId`。这会导致导入配置“schema 通过但联动丢失”。
3. `src/utils/timeline.ts`：`deriveActiveWarning` 和 `deriveBottomStatus` 主要按事件类型消费，不严格尊重 `targetComponent` 或 `syncBottomStatus`。例如 schema 允许 summary/homework 指向 `bottom_status_hud`，runtime 仍可能替换 WarningPanel。
4. `src/editor/EditorShell.tsx` 与 `src/editor/timeline/VideoPreviewController.tsx`：主视频 duration 缺失时，视频控制器有 360s fallback，但外层 range 和“前进 10s”使用 `mainVideoDuration = 0`，素材缺失时控制体验不一致。
5. `src/editor/PropertyPanel.tsx` 与 `src/editor/TimelinePanel.tsx`：底部阶段表修改时间会排序并更新 `order`，右侧属性面板修改阶段时间不会排序，可能导致 runtime 按时间命中而阶段条按旧数组顺序显示。
6. `src/editor/TimelinePanel.tsx`：payload 表单是结构化的，但仍暴露 `stageId`、`nodeId`、`taskId`、`abilityId` 等工程字段，summary/homework 的 `bullets/checklist` 也不可编辑，对非程序员不够友好。
7. `src/utils/timeline.ts`：非显示型事件在 startTime 后长期出现在 `activeEvents`，会让“当前命中事件数”和事件列表高亮混入历史持久事件。
8. `src/utils/timeline.ts`：`ability_unlock.syncMapNode` 可能把当前阶段节点从 `current` 覆盖为 `unlocked`，削弱地图“当前位置”表达。
9. `src/utils/timeFormat.ts`：`parseTime("")` 返回 0，编辑器清空可选 `endTime` 会变成 0 而不是 `undefined`。
10. `src/remotion`：样片渲染通过，但占位素材 404 仍然存在；这证明 fallback 可用，但不能验证真实主视频、讲师视频、头像和音频链路。

## 5. P0 必须修复项

无。

未发现附件中要求直接判定“不通过”的问题：编辑器可启动，previewTime 可控制，stages 和 timelineEvents 可编辑，previewTime 变化后 HUD 会变化，CourseStageBar 未做成播放器进度条，Remotion composition 可打开和渲染，最终 composition 未出现播放器控件，也未引入数据库、登录、云端 SaaS 等越界架构。

## 6. P1 建议修复项

1. `src/utils/timeline.ts`：冻结并实现 `stage_change` 语义。修正建议：二选一，要么在 UI 中隐藏/降级为兼容事件，阶段切换只由 `stages` 时间段控制；要么按 priority 消费 `stage_change.payload.stageId/status`，覆盖 `currentStage/stageStatuses` 并同步 map/task/hint。
2. `src/schemas/lesson.schema.ts`：补齐交叉引用校验。修正建议：在 `superRefine` 中建立 `stageIds`、`taskIds`、`mapNodeIds`、`hintIds`，校验 stages、tasks、chapterMap、warning 默认引用和归属引用。
3. `src/utils/timeline.ts`：让 runtime 尊重 `targetComponent` 和同步开关。修正建议：`deriveActiveWarning` 只消费 `warning_panel` 事件或显式 `syncWarningPanel`；`deriveBottomStatus` 只消费 `bottom_status_hud` 事件或显式 `syncBottomStatus`。
4. `src/editor/EditorShell.tsx`：统一 preview duration fallback。修正建议：集中计算 `previewDuration = media.duration || max(stage.endTime) || 360`，所有 range、前进/后退、手动输入和 `VideoPreviewController` 共用。
5. `src/editor/PropertyPanel.tsx` / `src/editor/TimelinePanel.tsx`：统一阶段编辑归一化。修正建议：抽 `normalizeStagesOrder` 或 `updateStagesAndNormalizeOrder`，所有阶段新增、修改、当前时间写入都排序并更新 `order`。
6. `src/editor/TimelinePanel.tsx`：提升 payload 表单可用性。修正建议：把工程字段名改为中文业务标签，ID 通过下拉隐藏；summary/homework 增加可增删 bullets/checklist 行。
7. `scripts/`：新增关键时间点测试或 still 验收脚本。修正建议：至少覆盖 117/118/124/150/248/270/316/340/355 秒，验证事件前、中、后状态。
8. `scripts/`：新增素材检查脚本。修正建议：主视频缺失为阻断错误，讲师视频/头像缺失为降级警告。

## 7. P2 后续优化项

1. `src/utils/timeline.ts`：拆分 `activeWindowEvents` 和 `persistentStateEvents`，事件列表高亮用时间窗，HUD 状态推导用持久状态。
2. `src/utils/timeFormat.ts`：新增 `parseOptionalTime`，让可选 `endTime` 清空后成为 `undefined`。
3. `src/components/hud/WarningPanel.tsx` / `src/remotion/layers/HudLayer.tsx`：为 `summary_show.bullets` 和 `homework_show.checklist` 增加最多 2-3 条短展示。
4. `src/utils/timeline.ts`：定义地图状态优先级，通常 `current` 应高于 `unlocked`。
5. `src/editor/TimelinePanel.tsx`：手动 previewTime 输入建议使用本地 draft 字符串，在 blur 或 Enter 时 parse，避免输入中被立即格式化。
6. `src/editor/EditorShell.tsx`：顶部“使用当前时间”当前只写 startTime，建议改名为“开始=当前”或按焦点字段写入。
7. `src/remotion/layers/HudLayer.tsx`：逐步收敛到共享无交互 HUD 展示组件，避免编辑器预览和最终渲染漂移。
8. `package.json`：补充 `test` 和可选 `lint` 脚本，沉淀时间轴状态和 schema 回归测试。

## 8. 命令运行结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `npm run typecheck` | 通过 | `tsc --noEmit` 无报错。 |
| `npm run validate:lessons` | 通过 | `lesson-01.json` 校验成功，共 1 个 lesson。 |
| `npm run render:sample` | 通过 | 输出 `out/lesson-01-sample.mp4`；占位主视频、讲师视频、头像 404 为当前样例素材缺失导致的 fallback。 |
| `npm run dev -- --port 5179` | 通过 | `http://127.0.0.1:5179/` 返回 200，检查后已停止进程。 |
| `npm run studio -- --port 3011` | 通过 | `http://localhost:3011/` 返回 200，检查后已停止进程。 |
| `npm run build` | 通过 | Vite build 成功，输出 `dist/`。 |
| `npm run lint` | 未运行 | `package.json` 无 `lint` 脚本。 |
| `npm test` | 未运行 | `package.json` 无 `test` 脚本。 |

补充静态扫描：

1. `src/remotion` 未发现 `<button`、`<input`、`<select`、`controls`。
2. `src/editor/PreviewCanvas.tsx` 和 `src/components/hud/CourseStageBar.tsx` 存在 editor-only `role="button"` / `onClick`，用于编辑器点选和阶段跳转。当前 Remotion composition 不引用 `PreviewCanvas`，且 `CourseStageBar` 的交互只在 `mode="editor"` 分支。

## 9. 风险清单

| 风险 | 等级 | 建议处理 |
| --- | --- | --- |
| previewTime 状态不同步风险 | 中 | 统一 `previewDuration` 和所有时间控制入口，补播放/暂停/手动输入/跳转测试。 |
| video.currentTime 与 editor state 脱节风险 | 中 | 保持 `VideoPreviewController` 只回写 App 级 `currentTime`，避免子组件私有时间。 |
| stages 重叠或倒序风险 | 中 | schema 已校验基本顺序和重叠；补右侧属性面板排序归一化。 |
| timelineEvents payload 不规范风险 | 中 | schema 已有最低字段校验；补 bullets/checklist 非空、同步字段和中文表单。 |
| deriveHudState 逻辑硬编码风险 | 低 | 当前未写死 lesson-01；第 6 阶段用单元测试防止回归。 |
| 编辑器和 Remotion 使用两套状态推导风险 | 中 | 当前共享 `deriveHudState`；仍需收敛 `HudLayer` 与编辑器 HUD 展示组件。 |
| CourseStageBar 被误做成播放器进度条风险 | 低 | 当前合规；后续仍禁止播放头、拖动滑块和时间进度填充。 |
| 最终视频误加播放器控件风险 | 低 | 当前 Remotion 合规；后续禁止引用 `PreviewCanvas`、`VideoPreviewController` 和编辑器选择层。 |
| 事件优先级冲突风险 | 中 | 当前按 priority 排序；需增加同组件同优先级冲突 warning。 |
| schema 校验不足风险 | 高 | 补齐默认引用、归属引用、order 唯一性和 optional time 校验。 |
| 导出 JSON 丢失时间轴字段风险 | 低 | 当前 spread 保留 stages/timelineEvents；增加导出回读测试。 |
| 第 6 阶段渲染器无法消费时间轴配置风险 | 中 | Remotion 已消费共享状态；仍需 still/片段验收覆盖后半段事件。 |
| 时间轴 UI 过于复杂导致使用门槛升高风险 | 中 | 保持阶段表 + 事件表，payload 表单用中文业务标签，不做多轨剪辑。 |
| 过早引入复杂依赖风险 | 低 | 当前依赖仍受控；第 6 阶段继续避免数据库、登录、云协作、AI 自动识别。 |
| 素材缺失误判为可交付风险 | 高 | 第 6 阶段必须把主视频缺失设为正式渲染阻断错误。 |

## 10. 是否允许进入第 6 阶段

允许进入第 6 阶段。

进入条件：

1. 不扩大产品边界，不引入剪辑、字幕、波形、多轨、数据库、登录或云协作。
2. 第 6 阶段优先补素材检查、渲染前检查、lesson JSON 导入、`deriveHudState` 单元测试和 Remotion still/片段验收。
3. 在继续扩展渲染器前，先冻结 `stage_change`、`targetComponent` 和 payload 同步字段语义。

## 11. 给第 6 阶段开发 Agent 的建议

1. 先做测试再改渲染器：为 `deriveHudState` 增加关键时间点测试，覆盖阶段边界、提示消失、任务切换、地图联动、能力解锁、总结和作业提醒。
2. 增加素材检查脚本：主视频缺失阻断；讲师视频/头像按 `missingAssetBehavior` 降级或警告；输出目录检查可写。
3. 增加渲染前检查清单：阶段重叠、提示持续时间、事件引用、同组件同优先级冲突、最终视频无播放器控件。
4. 增加 lesson JSON 导入能力，让 `lesson-01.edited.json` 可以重新进入编辑器。
5. 增加 Remotion still/片段验收脚本，覆盖 `36s` 提示、`150s` 警告、`270s` 能力解锁、`316s` 总结、`340s` 作业提醒。
6. 继续隔离编辑器和最终视频：不要把 `PreviewCanvas`、`SelectableHud`、`VideoPreviewController`、属性面板或时间轴表格引入 Remotion。
7. 收敛文档表述：把“临时 tsx 抽查”改为“尚未沉淀正式测试脚本”，直到测试命令真正加入仓库。

## 12. 最终结论

第 5 阶段符合“时间轴编辑与联动预览 MVP”的核心验收标准，判定为有条件通过。

当前没有 P0 阻断项，可以进入第 6 阶段。第 6 阶段必须把验证能力补上：素材检查、导入配置、渲染前检查、`deriveHudState` 自动化测试和关键时间点 Remotion 验收，是让这个工具从“能编辑联动预览”走向“能稳定渲染交付”的下一步。
