# 时间轴事件数据模型规格

## 1. 模型目标

时间轴事件是《视频课程套壳》的核心模型。它描述主课程视频播放到某个时间点时，HUD 中哪些模块发生变化。

第一版时间轴事件必须覆盖：

1. 课程阶段切换。
2. 地图节点点亮。
3. 任务状态切换。
4. 重点提示显示。
5. 能力点解锁。
6. 阶段总结。
7. 作业提醒。

所有事件都以主课程视频时间为唯一基准。

## 2. TimelineEvent 顶层结构

```ts
type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  startTime: number;
  endTime?: number;
  duration?: number;
  targetComponent: HudComponentKey;
  payload: TimelineEventPayload;
  animation?: TimelineAnimationConfig;
  priority: number;
  enabled: boolean;
  label?: string;
  notes?: string;
};
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 事件唯一 ID |
| `type` | 是 | 事件类型 |
| `startTime` | 是 | 触发时间，单位秒 |
| `endTime` | 否 | 结束时间，单位秒 |
| `duration` | 否 | 持续秒数，可由 `endTime - startTime` 推算 |
| `targetComponent` | 是 | 目标 HUD 组件 |
| `payload` | 是 | 事件类型对应数据 |
| `animation` | 否 | 入场、退场或状态动效配置 |
| `priority` | 是 | 冲突处理优先级，数字越大优先级越高 |
| `enabled` | 是 | 是否启用 |
| `label` | 否 | 编辑器事件列表显示名 |
| `notes` | 否 | 编辑器备注，不进入最终视频 |

字段必填策略：

1. 所有事件必须包含 `id`、`type`、`startTime`、`targetComponent`、`payload`、`priority`、`enabled`。
2. `hint_show`、`stage_summary`、`homework_reminder` 必须包含 `endTime` 或 `duration`。
3. `stage_change`、`map_node_activate`、`task_update`、`skill_unlock` 可以是瞬时事件，可不提供 `endTime`。
4. `animation` 可以省略，但每类事件必须有默认动画策略；省略时由渲染器使用默认值。
5. 若同时提供 `endTime` 和 `duration`，业务校验应确认两者一致，或以 `endTime` 为准并给出提示。

## 3. 枚举定义

### 3.1 TimelineEventType

```ts
type TimelineEventType =
  | "stage_change"
  | "map_node_activate"
  | "task_update"
  | "hint_show"
  | "skill_unlock"
  | "stage_summary"
  | "homework_reminder";
```

第一版可保留 `layout_toggle` 的扩展空间，但不作为 P0 必需事件。

### 3.1.1 事件命名映射

第一版工程实现以 `TimelineEventType` 中的名称作为 canonical type。产品讨论、审查文档或早期草稿中可能出现以下别名，后续实现不要重复创建第二套事件类型。

| 产品口径或别名 | 工程 canonical type | 说明 |
| --- | --- | --- |
| `map_node_active` | `map_node_activate` | 地图节点点亮 |
| `task_active` | `task_update` | 将任务切换为当前 |
| `task_done` | `task_update` | 将任务切换为已完成 |
| `warning_show` | `hint_show` | 警告或避坑提示 |
| `tip_show` | `hint_show` | 重点或新手提示 |
| `ability_unlock` | `skill_unlock` | 能力点解锁 |
| `summary_show` | `stage_summary` | 阶段总结 |
| `homework_show` | `homework_reminder` | 作业或行动提醒 |

编辑器可以在界面文案中使用更容易理解的中文名称，但保存到配置文件时必须使用 canonical type。

### 3.2 HudComponentKey

```ts
type HudComponentKey =
  | "top_header"
  | "main_video_frame"
  | "lecturer_mini_card"
  | "chapter_map"
  | "task_tracker"
  | "warning_panel"
  | "course_stage_bar"
  | "bottom_status_hud";
```

### 3.3 TimelineAnimationConfig

```ts
type TimelineAnimationConfig = {
  enter?: "none" | "fade" | "fade_up" | "pulse" | "node_glow";
  exit?: "none" | "fade" | "fade_down";
  durationMs?: number;
  reducedMotionFallback?: "none" | "fade";
};
```

约束：

1. 动效必须短且克制。
2. 不使用持续闪烁。
3. 提示类默认 `fade_up`。
4. 地图节点点亮默认 `node_glow`。
5. 能力点解锁默认 `pulse`。

## 4. 事件类型一：课程阶段切换

### 4.1 type

```ts
"stage_change"
```

### 4.2 targetComponent

```ts
"course_stage_bar"
```

### 4.3 payload

```ts
type StageChangePayload = {
  stageId: string;
  status?: "current" | "completed";
  syncMapNode?: boolean;
  syncDefaultTask?: boolean;
  syncDefaultHint?: boolean;
};
```

### 4.4 规则

1. 通常由 `CourseStage.startTime` 自动推算，无需每个阶段都手动创建。
2. 用户手动创建的 `stage_change` 优先于默认推算。
3. 进入新阶段时，之前阶段默认变为 `completed`。
4. 阶段条不能渲染为播放器进度条。

### 4.5 示例

```json
{
  "id": "event-stage-002",
  "type": "stage_change",
  "startTime": 300,
  "targetComponent": "course_stage_bar",
  "payload": {
    "stageId": "stage-source-import",
    "status": "current",
    "syncMapNode": true,
    "syncDefaultTask": true
  },
  "priority": 80,
  "enabled": true
}
```

## 5. 事件类型二：地图节点点亮

### 5.1 type

```ts
"map_node_activate"
```

### 5.2 targetComponent

```ts
"chapter_map"
```

### 5.3 payload

```ts
type MapNodeActivatePayload = {
  mapNodeId: string;
  state: "current" | "completed" | "unlocked";
  completePrevious?: boolean;
};
```

### 5.4 规则

1. 用于点亮 ChapterMap 节点。
2. 若节点绑定阶段，可由阶段默认联动触发。
3. 手动事件可覆盖默认联动。
4. 节点点亮可有一次性光圈扩散，不持续闪烁。

## 6. 事件类型三：任务状态切换

### 6.1 type

```ts
"task_update"
```

### 6.2 targetComponent

```ts
"task_tracker"
```

### 6.3 payload

```ts
type TaskUpdatePayload = {
  taskId: string;
  state: "not_started" | "current" | "completed";
  autoCompletePrevious?: boolean;
  showNextTask?: boolean;
};
```

### 6.4 规则

1. 同一时间只能有一个主要当前任务。
2. `autoCompletePrevious` 默认建议为 `true`。
3. 手动 `task_update` 优先于 `CourseStage.defaultTaskId`。
4. 当前任务标题应短，适合扫读。

## 7. 事件类型四：重点提示显示

### 7.1 type

```ts
"hint_show"
```

### 7.2 targetComponent

```ts
"warning_panel"
```

### 7.3 payload

```ts
type HintShowPayload = {
  hintId?: string;
  hintType: "key_point" | "beginner_tip" | "warning";
  title: string;
  body: string;
  syncBottomStatus?: boolean;
};
```

### 7.4 规则

1. `title` 和 `body` 必填。
2. `endTime` 或 `duration` 建议必填。
3. 同一时间 WarningPanel 只显示优先级最高的一条提示。
4. 提示正文过长时编辑器应提示缩短。
5. 默认显示在右侧 WarningPanel，不默认覆盖主视频。

### 7.5 阅读时间建议

| 文案长度 | 最短持续时间 |
| --- | --- |
| 12 字以内 | 4 秒 |
| 13-24 字 | 6 秒 |
| 25-40 字 | 8 秒 |
| 超过 40 字 | 提示缩短 |

## 8. 事件类型五：能力点解锁

### 8.1 type

```ts
"skill_unlock"
```

### 8.2 targetComponent

```ts
"bottom_status_hud"
```

### 8.3 payload

```ts
type SkillUnlockPayload = {
  skillId?: string;
  title: string;
  body?: string;
  mapNodeId?: string;
  syncMapNode?: boolean;
};
```

### 8.4 规则

1. 默认显示 3 到 5 秒。
2. 可同步地图节点为 `unlocked` 或 `completed`。
3. 使用紫色短脉冲动效。
4. 不遮挡主视频。

## 9. 事件类型六：阶段总结

### 9.1 type

```ts
"stage_summary"
```

### 9.2 targetComponent

默认：

```ts
"warning_panel"
```

可同步：

```ts
"bottom_status_hud"
```

### 9.3 payload

```ts
type StageSummaryPayload = {
  stageId: string;
  title: string;
  body: string;
  markStageCompleted?: boolean;
  syncBottomStatus?: boolean;
};
```

### 9.4 规则

1. 通常发生在阶段结束前或结束时。
2. 持续时间建议 5 到 8 秒。
3. 不应与下一阶段开场提示冲突。
4. BottomStatusHud 只同步短文案，不重复长正文。

## 10. 事件类型七：作业提醒

### 10.1 type

```ts
"homework_reminder"
```

### 10.2 targetComponent

默认：

```ts
"warning_panel"
```

可同步：

```ts
"bottom_status_hud"
```

### 10.3 payload

```ts
type HomeworkReminderPayload = {
  title: string;
  body: string;
  actionLabel?: string;
  taskId?: string;
  syncTaskTracker?: boolean;
  syncBottomStatus?: boolean;
};
```

### 10.4 规则

1. 通常出现在课程末尾或阶段末尾。
2. 持续时间建议 6 到 10 秒。
3. 可以同步 TaskTracker 到课后行动任务。
4. 最终视频中不显示提交按钮、打卡入口或平台交互能力。

## 11. Payload 联合类型

```ts
type TimelineEventPayload =
  | StageChangePayload
  | MapNodeActivatePayload
  | TaskUpdatePayload
  | HintShowPayload
  | SkillUnlockPayload
  | StageSummaryPayload
  | HomeworkReminderPayload;
```

实现时建议用 Zod discriminated union 按 `type` 校验。

## 12. 时间字段规范

第一版内部统一使用秒数：

```ts
startTime: 203.5
endTime: 211.5
duration: 8
```

界面显示时再格式化：

1. `MM:SS`：一小时以内。
2. `HH:MM:SS`：一小时以上。
3. 毫秒精度可保留但默认不暴露给普通用户。

规则：

1. `startTime >= 0`。
2. `endTime` 必须大于 `startTime`。
3. `duration` 必须大于 0。
4. 若同时存在 `endTime` 和 `duration`，以 `endTime` 为准或校验两者一致。

## 13. 事件生命周期规则

事件分为短时显示事件和持久状态事件。

### 13.1 短时显示事件

短时显示事件包括：

1. `hint_show`。
2. `stage_summary`。
3. `homework_reminder`。
4. `skill_unlock` 中只用于 BottomStatusHud 的短提示部分。

规则：

1. 当前时间位于 `startTime` 到 `endTime` 或 `duration` 范围内时，事件生效。
2. 事件结束后，WarningPanel 回到当前阶段默认提示。
3. 如果当前阶段没有默认提示，WarningPanel 回到 empty 状态。
4. BottomStatusHud 的短时事件结束后回到 idle。
5. 短时事件不应长期覆盖主视频，也不应堆叠多条正文。

### 13.2 持久状态事件

持久状态事件包括：

1. `stage_change`。
2. `map_node_activate`。
3. `task_update`。
4. `skill_unlock` 中同步地图或能力点已解锁的状态部分。

规则：

1. 持久状态事件在 `startTime` 后持续生效，直到后续事件或阶段默认联动覆盖。
2. 地图节点被设置为 `completed` 或 `unlocked` 后默认保持该状态。
3. 任务被设置为 `completed` 后默认保持完成，除非后续事件重新设置。
4. 当前任务切换时，上一个当前任务可按 `autoCompletePrevious` 变为 completed。
5. 阶段状态优先由 `CourseStage` 时间范围推算，手动 `stage_change` 可覆盖显示状态。

### 13.3 默认状态恢复

当没有命中的手动事件时：

1. CourseStageBar 根据 `CourseStage` 推算 completed、current、not_started。
2. ChapterMap 根据当前阶段绑定和已发生的持久事件推算节点状态。
3. TaskTracker 根据当前阶段默认任务和已发生的持久事件推算任务状态。
4. WarningPanel 显示当前命中提示；若无提示，则显示当前阶段默认提示；若仍无内容，则 empty。
5. BottomStatusHud 无短时事件时为 idle。

## 14. 冲突处理规则

同一时间多个事件命中时：

1. 先过滤 `enabled = false` 的事件。
2. 判断 `startTime <= currentTime <= endTime` 或瞬时事件是否已生效。
3. 同一 `targetComponent` 内按 `priority` 从高到低排序。
4. 同一组件同一类型只应用最高优先级事件。
5. 不同组件事件可以同时生效。
6. WarningPanel 不堆叠多条提示。
7. 手动 TimelineEvent 优先于阶段默认联动。

## 15. 状态计算顺序

推荐 `resolveHudState(config, currentTime)` 使用以下顺序：

1. 初始化所有阶段、地图节点、任务、提示和状态 HUD。
2. 根据 `CourseStage` 推算当前阶段。
3. 应用阶段默认联动：阶段条、地图节点、默认任务、默认提示。
4. 找出当前时间命中的 `TimelineEvent`。
5. 按 `priority` 应用手动事件。
6. 生成 `HudRuntimeState`。
7. 返回给编辑器预览或 Remotion 组件。

## 16. 校验规则

Zod 和业务校验应覆盖：

1. `type` 与 `payload` 类型匹配。
2. `targetComponent` 与事件类型匹配。
3. 引用的 `stageId`、`taskId`、`mapNodeId`、`hintId`、`skillId` 存在。
4. 提示类事件有 `endTime` 或 `duration`。
5. 同一组件同一时间没有相同 priority 的冲突事件。
6. 任务状态不会在同一时间产生多个 current。
7. 阶段总结不与下一阶段提示严重重叠。
8. 短时显示事件必须存在有效结束时间或持续时间。
9. 持久状态事件如果提供 `endTime`，必须明确它只影响动画窗口，不影响状态持久性，或在 payload 中显式声明覆盖策略。

## 17. 示例事件列表

```json
[
  {
    "id": "event-hint-001",
    "type": "hint_show",
    "startTime": 200,
    "endTime": 208,
    "targetComponent": "warning_panel",
    "payload": {
      "hintType": "beginner_tip",
      "title": "新手重点",
      "body": "先确认信源质量，再生成课程内容"
    },
    "animation": {
      "enter": "fade_up",
      "exit": "fade",
      "durationMs": 220
    },
    "priority": 90,
    "enabled": true
  },
  {
    "id": "event-map-001",
    "type": "map_node_activate",
    "startTime": 300,
    "targetComponent": "chapter_map",
    "payload": {
      "mapNodeId": "node-source-import",
      "state": "current",
      "completePrevious": true
    },
    "animation": {
      "enter": "node_glow",
      "durationMs": 300
    },
    "priority": 70,
    "enabled": true
  },
  {
    "id": "event-task-001",
    "type": "task_update",
    "startTime": 305,
    "targetComponent": "task_tracker",
    "payload": {
      "taskId": "task-upload-source",
      "state": "current",
      "autoCompletePrevious": true
    },
    "priority": 75,
    "enabled": true
  }
]
```

## 18. 时间轴模型验收标准

后续实现应满足：

1. 支持 7 类必需事件。
2. 每个事件包含 `id`、`type`、`startTime`、`targetComponent`、`payload`、`priority`、`enabled`。
3. 提示类事件支持 `endTime` 或 `duration`。
4. 事件 payload 可被 Zod 按类型校验。
5. 编辑器和渲染器复用同一状态计算规则。
6. 最终 MP4 只包含事件产生的视觉结果，不包含交互数据。
