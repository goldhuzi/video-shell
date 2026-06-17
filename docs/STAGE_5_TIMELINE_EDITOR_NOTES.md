# 第 5 阶段时间轴编辑与联动预览实现说明

## 本阶段完成了什么

1. 将第 4 阶段只读事件表升级为可创建、编辑、删除的简化时间轴事件编辑器。
2. 增加编辑器画框外的视频预览控制器，用 HTML video 读取 `currentTime` 和 `duration`，主视频缺失时仍可手动配置 `previewTime`。
3. 支持阶段新增、编辑、删除、点击跳转，以及“开始时间 = 当前时间”“结束时间 = 当前时间”。
4. 支持 `timelineEvents` 新增、编辑、删除、启用/禁用、跳转、优先级、目标模块和 payload 表单。
5. 扩展事件类型为第 5 阶段口径：`stage_change`、`map_node_active`、`task_active`、`task_done`、`tip_show`、`warning_show`、`ability_unlock`、`summary_show`、`homework_show`。
6. 保留旧规格事件名兼容读取，但新建和示例配置优先使用第 5 阶段事件名。
7. 重写共享 `deriveHudState`，编辑器和 Remotion 继续共用同一套时间轴推导。
8. 增强 schema 校验：阶段/事件唯一 ID、事件时间、显示型事件结束时间、事件类型与目标模块、payload 最低字段和引用 ID。
9. 升级示例 `lesson-01.json`，覆盖提示、警告、任务完成、能力解锁、总结和作业提醒事件。
10. 保持最终视频画框内无真实 `button/input/select/video[controls]` 控件，播放器控制只在编辑器工具区。

## 本阶段没有做什么

1. 没有做 AI 自动识别章节、任务、重点或时间点。
2. 没有做字幕、波形、多轨、剪切、合并或专业剪辑能力。
3. 没有引入数据库、登录、云协作、队列、批量渲染或 Vercel。
4. 没有做自由拖拽布局、主题市场或视觉高保真精修。
5. 没有完成素材路径检查脚本；浏览器端仍以路径提示和缺失占位为主。
6. 没有把 Remotion `HudLayer` 完全收敛到共享 HUD 组件。

## 如何使用时间轴编辑器

1. 运行 `npm run dev`，打开 `http://127.0.0.1:5173`。
2. 中央 16:9 画框展示最终视频 HUD 预览；画框外的“编辑器预览控制”用于播放、暂停、拖动和读取视频时间。
3. 如果主视频路径不存在，视频控制器会提示“主视频未找到，可手动配置”，此时仍可通过 `previewTime` 输入和阶段/事件跳转配置 HUD。
4. 底部时间轴区包含“阶段 / 事件 / 校验”三个视图。
5. 修改 `previewTime`、阶段或事件后，预览会即时重新计算阶段条、地图、任务、提示和底部状态。

## 如何新增阶段

1. 打开底部“阶段”视图。
2. 点击“新增阶段”，系统会以当前 `previewTime` 作为默认开始时间。
3. 编辑阶段名称、短名、开始时间和结束时间。
4. 点击“跳转”可把预览时间切到阶段开始时间。
5. 点击“开始=当前”或“结束=当前”可把当前视频时间写入对应字段。

## 如何新增事件

1. 打开底部“事件”视图。
2. 点击“新增事件”，默认创建 `tip_show`。
3. 修改事件类型、目标模块、开始时间、结束时间、优先级和 enabled。
4. 在 payload 编辑区填写对应字段，例如提示的 `title/text/level`、任务的 `taskId`、地图的 `nodeId`、能力的 `abilityId/label/description`。
5. 点击事件行“跳转”可把 `previewTime` 切到事件开始时间。
6. 点击“开始=当前”或“结束=当前”可写入当前视频时间。

## 每种事件类型的作用

1. `stage_change`：手动阶段切换，影响 CourseStageBar。
2. `map_node_active`：点亮课程地图节点。
3. `task_active`：将任务切换为当前任务。
4. `task_done`：将任务标记为完成。
5. `tip_show`：显示普通重点提示。
6. `warning_show`：显示警告或避坑提示。
7. `ability_unlock`：解锁能力点，并可同步底部状态或地图节点。
8. `summary_show`：显示阶段总结。
9. `homework_show`：显示作业或行动提醒。

## CourseStageBar 为什么不是播放器进度条

CourseStageBar 表达的是课程结构导航，不承担播放控制。它显示阶段的 `completed/current/not_started` 状态，在编辑器中可点击跳转到阶段开始时间，但最终 Remotion composition 中不可点击、不可拖动、无播放头、无时间滑块、无播放/暂停按钮。

## 编辑器播放控件和最终视频的区别

编辑器播放控件只用于创作者配置时间点，位于最终视频画框外。最终视频画框内只保留课程画面和 HUD 内容。Remotion composition 不引用 `src/editor` 的选择层、时间轴表格、属性面板或播放器控件。

## 时间轴事件如何导出到 lesson JSON

点击“导出配置”前会运行 schema 校验。存在错误时阻止下载；校验通过后导出格式化 JSON。导出的 `timelineEvents` 保留完整的 `id/type/startTime/endTime/targetComponent/payload/animation/priority/enabled` 字段，可继续被编辑器和 Remotion 消费。

## Remotion 如何消费时间轴配置

Remotion 每帧通过 `frame / fps` 计算 `currentTime`，调用共享 `deriveHudState(lesson, currentTime)`，再把运行态传给 HUD 层。第 5 阶段没有把编辑器控件带进 Remotion，最终 MP4 仍然只包含 HUD 视觉结果。

## 已知限制

1. `render:sample` 当前仍是样片脚本，不能完全覆盖所有后半段事件，需要后续补关键时间点 still 或片段验收。
2. 浏览器端不直接检查本地素材文件存在性；主视频占位路径会导致视频控制器加载失败，但不阻断手动配置。
3. payload 表单是 MVP 结构化表单，复杂 payload 暂未提供高级 JSON 编辑器。
4. `PropertyPanel.tsx` 仍偏大，后续应拆成更小的表单模块。
5. 尚未新增自动化单元测试脚本，当前通过 `tsx` 抽查关键时间点。

## 第 6 阶段建议

1. 增加素材路径检查脚本和渲染前检查清单，主视频缺失作为阻断错误。
2. 增加 lesson JSON 导入能力。
3. 为 `deriveHudState` 增加正式测试脚本，覆盖事件优先级、提示消失、任务切换、地图联动和能力解锁。
4. 增加 Remotion still/片段验收脚本，覆盖关键事件前、中、后时间点。
5. 逐步把 Remotion `HudLayer` 收敛到共享 HUD 展示组件，但继续隔离编辑器交互层。
