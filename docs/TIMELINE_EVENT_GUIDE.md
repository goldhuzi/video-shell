# 时间轴事件指南

时间轴是本项目的核心。最终 MP4 中的 HUD 状态由主视频时间驱动，而不是用户点击驱动。

## `stages` 是什么

`stages` 是课程阶段列表。它决定：

1. 当前阶段。
2. CourseStageBar 的完成、当前和未开始状态。
3. 默认地图节点。
4. 默认任务。
5. 默认提示。

阶段时间使用秒数保存。

示例：

```json
{
  "id": "stage-opening",
  "name": "课程开场",
  "startTime": 0,
  "endTime": 92,
  "enabled": true
}
```

## `timelineEvents` 是什么

`timelineEvents` 是在特定视频时间触发的 HUD 事件。它可以点亮地图、切换任务、展示提示、触发警告、展示能力解锁、总结或作业。

事件不会让最终 MP4 具备交互能力。最终视频里的地图、任务、阶段条不可点击。

## `previewTime` 和 `currentTime`

`previewTime` 是编辑器中用户手动输入或跳转的预览时间。

`currentTime` 是视频播放时的当前时间。

两者都用于驱动同一套 HUD 状态推导。编辑器中点击阶段或事件可以跳转预览时间，但最终 MP4 不可点击。

## CourseStageBar 如何变化

CourseStageBar 根据当前阶段显示：

1. 已完成阶段。
2. 当前阶段。
3. 未开始阶段。

它是学习导航，不是播放器进度条。最终视频不能出现播放头、拖动手柄、时间码、连续进度填充或任何播放器控制。

## ChapterMap 如何点亮

ChapterMap 可以由两种方式变化：

1. 当前阶段的 `mapNodeId` 默认联动。
2. `map_node_active` 事件手动点亮。

## TaskTracker 如何切换

TaskTracker 可以由两种方式变化：

1. 当前阶段的 `defaultTaskId` 默认联动。
2. `task_active`、`task_done` 事件手动切换。

## WarningPanel / NoticePanel 如何出现

当前实现主要使用右侧 WarningPanel 展示提示、警告、总结和作业。

显示型事件必须设置 `endTime` 或 `duration`，否则系统无法知道它应该显示多久。

## BottomStatusHud 如何显示

BottomStatusHud 用于短状态、能力解锁、summary/homework 的短提示。不要把它做成按钮区、播放器区或技能栏。

## 事件公共字段

每个事件通常包含：

```json
{
  "id": "event-id",
  "type": "warning_show",
  "startTime": 120,
  "endTime": 130,
  "targetComponent": "warning_panel",
  "payload": {},
  "priority": 10,
  "enabled": true
}
```

字段说明：

1. `id`：事件唯一 id。
2. `type`：事件类型。
3. `startTime`：开始时间，单位秒。
4. `endTime`：结束时间，单位秒。
5. `duration`：持续秒数，可替代 `endTime`。
6. `targetComponent`：目标 HUD 模块。
7. `payload`：事件内容。
8. `priority`：优先级，同组件同时间冲突时使用。
9. `enabled`：是否启用。

`targetComponent` 可选值：

```text
top_header
main_video_frame
lecturer_mini_card
chapter_map
task_tracker
warning_panel
course_stage_bar
bottom_status_hud
```

## `stage_change`

作用：手动指定当前阶段。

何时使用：需要在某个时间点强制切换课程阶段时。

字段示例：

```json
{
  "id": "event-stage-opening",
  "type": "stage_change",
  "startTime": 92,
  "targetComponent": "course_stage_bar",
  "payload": {
    "stageId": "stage-knowledge"
  },
  "priority": 10,
  "enabled": true
}
```

常见错误：

1. `payload.stageId` 不存在。
2. `targetComponent` 不是 `course_stage_bar`。

对应 HUD 表现：CourseStageBar 和当前阶段状态切换。

## `map_node_active`

作用：点亮课程地图节点。

何时使用：阶段默认地图节点之外，需要手动点亮某个节点时。

字段示例：

```json
{
  "id": "event-map-node",
  "type": "map_node_active",
  "startTime": 120,
  "targetComponent": "chapter_map",
  "payload": {
    "nodeId": "node-knowledge"
  },
  "priority": 10,
  "enabled": true
}
```

常见错误：

1. 写成新配置时不建议使用旧名 `map_node_activate`。
2. `nodeId` 或 `mapNodeId` 不存在。

对应 HUD 表现：ChapterMap 节点变为当前或已点亮状态。

## `task_active`

作用：切换当前任务。

何时使用：当前阶段内有多个任务，或任务切换不完全跟随阶段。

字段示例：

```json
{
  "id": "event-task-active",
  "type": "task_active",
  "startTime": 150,
  "targetComponent": "task_tracker",
  "payload": {
    "taskId": "task-practice"
  },
  "priority": 10,
  "enabled": true
}
```

常见错误：

1. `taskId` 不存在。
2. 任务标题太长。

对应 HUD 表现：TaskTracker 当前任务切换为 active。

## `task_done`

作用：标记任务完成。

何时使用：讲解完成某个任务、进入下一步或阶段总结前。

字段示例：

```json
{
  "id": "event-task-done",
  "type": "task_done",
  "startTime": 210,
  "targetComponent": "task_tracker",
  "payload": {
    "taskId": "task-practice"
  },
  "priority": 10,
  "enabled": true
}
```

常见错误：

1. 提前完成导致画面状态与讲解不一致。
2. 忘记激活下一任务。

对应 HUD 表现：任务状态变为 done/completed。

## `tip_show`

作用：展示普通重点提示。

何时使用：需要提醒学员注意概念、操作步骤或学习方法。

字段示例：

```json
{
  "id": "event-tip",
  "type": "tip_show",
  "startTime": 60,
  "endTime": 72,
  "targetComponent": "warning_panel",
  "payload": {
    "title": "先看结构",
    "text": "先理解本段要解决的问题，再看细节。"
  },
  "priority": 20,
  "enabled": true
}
```

常见错误：

1. 没有 `endTime` 或 `duration`。
2. 文案过长。
3. 和其他 warning/summary 时间重叠。

对应 HUD 表现：右侧 WarningPanel 显示提示。

## `warning_show`

作用：展示警告或避坑提醒。

何时使用：讲解容易误解、操作容易出错或需要特别注意时。

字段示例：

```json
{
  "id": "event-warning",
  "type": "warning_show",
  "startTime": 236,
  "endTime": 256,
  "targetComponent": "warning_panel",
  "payload": {
    "title": "注意这个误区",
    "text": "不要把阶段条理解成可拖动进度条。"
  },
  "priority": 30,
  "enabled": true
}
```

常见错误：

1. warning 太频繁，干扰主视频。
2. warning 盖住主视频。默认应固定在右侧栏。

对应 HUD 表现：右侧 WarningPanel 使用警告视觉状态。

## `ability_unlock`

作用：展示能力解锁状态。

何时使用：完成关键学习动作后，给学员“能力推进”的反馈。

字段示例：

```json
{
  "id": "event-ability",
  "type": "ability_unlock",
  "startTime": 284,
  "targetComponent": "bottom_status_hud",
  "payload": {
    "abilityId": "ability-structure",
    "label": "结构化理解"
  },
  "priority": 20,
  "enabled": true
}
```

常见错误：

1. payload 没有 `abilityId`、`skillId`、`label` 或 `title`。
2. 写成新配置时不建议使用旧名 `skill_unlock`。

对应 HUD 表现：BottomStatusHud 出现能力解锁状态，可持续保留。

## `summary_show`

作用：展示阶段总结。

何时使用：一段内容结束时，总结关键结论。

字段示例：

```json
{
  "id": "event-summary",
  "type": "summary_show",
  "startTime": 428,
  "endTime": 448,
  "targetComponent": "warning_panel",
  "payload": {
    "title": "阶段总结",
    "bullets": ["理解核心问题", "完成关键概念连接"]
  },
  "priority": 25,
  "enabled": true
}
```

常见错误：

1. `bullets` 太多。
2. 没有结束时间。
3. 写成新配置时不建议使用旧名 `stage_summary`。

对应 HUD 表现：WarningPanel 或 BottomStatusHud 显示总结。

## `homework_show`

作用：展示课后作业或行动提醒。

何时使用：课程结尾、练习任务或复盘挑战。

字段示例：

```json
{
  "id": "event-homework",
  "type": "homework_show",
  "startTime": 480,
  "endTime": 502,
  "targetComponent": "warning_panel",
  "payload": {
    "title": "课后行动",
    "text": "用 3 句话复盘本节课的核心结构。"
  },
  "priority": 25,
  "enabled": true
}
```

常见错误：

1. 作业文案未经课程主理人确认。
2. 没有结束时间。
3. 写成新配置时不建议使用旧名 `homework_reminder`。

对应 HUD 表现：WarningPanel、BottomStatusHud 或 TaskTracker 显示作业提醒。

## 历史兼容事件名

schema 仍兼容以下旧事件名，但新 lesson 建议使用新事件名：

```text
map_node_activate
task_update
hint_show
skill_unlock
stage_summary
homework_reminder
```

## 冲突规则

如果同一时间、同一 HUD 模块、同一 priority 有多个事件重叠，preflight 会给 warning。处理方式：

1. 错开时间。
2. 调整 priority。
3. 删除重复事件。
4. 合并文案。

## 最终视频边界

1. 最终视频中的 CourseStageBar 不是播放器进度条。
2. 最终视频中的地图、任务、阶段条不可点击。
3. 编辑器中可以点击跳转，是为了配置时间点。
4. 最终 MP4 不承担播放控制，不出现播放、暂停、倍速、音量、全屏、拖动滑块。
