# HUD 组件规格

## 1. 组件总览

第一版 HUD 由 8 个核心组件组成：

| 组件 | 用途 | 优先级 | 是否随时间变化 |
| --- | --- | --- | --- |
| TopHeader | 建立课程上下文 | P0 | 部分 |
| MainVideoFrame | 承载主课程视频 | P0 | 视频内容变化 |
| LecturerMiniCard | 显示讲师存在感 | P1 | 视频内容变化 |
| WarningPanel | 显示重点、警告、总结和作业 | P0 | 是 |
| TaskTracker | 显示当前任务推进 | P0 | 是 |
| ChapterMap | 显示课程路线和节点状态 | P0 | 是 |
| CourseStageBar | 显示课程阶段导航 | P0 | 是 |
| BottomStatusHud | 显示能力解锁和短状态 | P1 | 是 |

## 2. 通用组件规则

### 2.1 状态命名

通用状态建议使用：

1. idle：默认静态。
2. active：当前生效。
3. completed：已完成。
4. locked：锁定。
5. upcoming：未开始。
6. hidden：隐藏。
7. warning：警告。
8. disabled：在编辑器中禁用。

### 2.2 数据来源类型

HUD 组件数据来自：

1. ProjectConfig：项目基础配置。
2. CourseMetadata：课程标题、章节、讲师信息。
3. CourseStage：阶段列表和阶段时间。
4. TimelineEvent：时间轴事件。
5. MediaAsset：主视频、讲师视频、头像。
6. ThemePreset：主题色、字体、面板样式。
7. RuntimeTime：渲染或预览时的主视频当前时间。

### 2.3 编辑器选中态

每个 HUD 组件在编辑器中都可被点选。选中态只存在于编辑器，不进入最终视频。

## 3. TopHeader

### 3.1 用途

显示课程身份信息，让学员知道当前观看的是哪门课、哪一章、哪一节。

### 3.2 显示内容

1. 课程标题。
2. 章节标题或副标题。
3. 课程序号。
4. 当前阶段短名，选配。
5. 品牌标识或课程代号，选配。
6. 轻量状态标签，例如 `MISSION LIVE`。

### 3.3 状态

1. default：正常显示。
2. compact：标题较长时压缩副标题。
3. hidden：隐藏。
4. stage_synced：阶段短名随当前阶段变化。

### 3.4 可编辑字段

1. courseTitle。
2. chapterTitle。
3. lessonNumber。
4. statusLabel。
5. showCurrentStage。
6. visible。

### 3.5 是否随时间变化

默认不随时间变化。若开启 showCurrentStage，则当前阶段短名根据 RuntimeTime 和 CourseStage 推算。

### 3.6 数据来源

1. CourseMetadata。
2. CourseStage。
3. ProjectConfig。

## 4. MainVideoFrame

### 4.1 用途

承载主课程视频，是最终画面的第一优先级内容。

### 4.2 显示内容

1. 主课程视频。
2. 轻量边框。
3. 可选安全区阴影或底板。

### 4.3 状态

1. ready：主视频已导入。
2. missing：主视频未导入，仅编辑器显示。
3. contain：完整显示。
4. cover：填充显示，可能裁切。
5. fit_width：适配宽度。
6. fit_height：适配高度。

### 4.4 可编辑字段

1. mainVideoAssetId。
2. fitMode。
3. backgroundFill。
4. showFrameBorder。
5. safeAreaGuide，编辑器专用。

### 4.5 是否随时间变化

视频内容随 RuntimeTime 播放。布局和适配方式默认不随时间变化。

### 4.6 数据来源

1. MediaAsset。
2. ProjectConfig。
3. RuntimeTime。

## 5. LecturerMiniCard

### 5.1 用途

保留讲师存在感，强化课程来源和人格化表达。

### 5.2 显示内容

1. 讲师小窗视频或头像。
2. 讲师姓名。
3. 讲师身份标签。
4. 可选语音或在线状态装饰，但不表达直播互动。

### 5.3 状态

1. video：显示讲师视频。
2. avatar：显示头像。
3. compact：只显示头像和姓名。
4. hidden：隐藏。
5. missing_asset：素材缺失，编辑器专用。

### 5.4 可编辑字段

1. lecturerVideoAssetId。
2. lecturerAvatarAssetId。
3. lecturerName。
4. lecturerTitle。
5. displayMode。
6. positionPreset。
7. visible。

### 5.5 是否随时间变化

讲师视频内容随时间播放。其他信息默认不随时间变化。

### 5.6 数据来源

1. MediaAsset。
2. CourseMetadata。
3. ProjectConfig。

## 6. WarningPanel

### 6.1 用途

显示当前课程片段最重要的信息，包括重点、避坑、阶段总结和作业提醒。

### 6.2 显示内容

1. 提示类型标签。
2. 提示标题。
3. 提示正文。
4. 优先级或警告等级，视觉化但不必显示数字。
5. 可选倒计时样式，但不得做成播放器倒计时。

### 6.3 状态

1. empty：当前无提示，可显示低亮占位标题。
2. key_point：重点内容。
3. beginner_tip：新手重点。
4. warning：警告或避坑。
5. summary：阶段总结。
6. homework：作业或行动提醒。
7. entering：入场动画。
8. leaving：退场动画。

### 6.4 可编辑字段

1. hintType。
2. title。
3. body。
4. startTime。
5. endTime。
6. duration。
7. priority。
8. targetModule。
9. enabled。

### 6.5 是否随时间变化

是。由 hint_show、stage_summary、homework_reminder 等 TimelineEvent 控制。

### 6.6 数据来源

1. TimelineEvent。
2. HintItem。
3. RuntimeTime。
4. ThemePreset。

## 7. TaskTracker

### 7.1 用途

把课程观看转化为任务推进，让学员知道当前应该理解或完成什么。

### 7.2 显示内容

1. 当前任务。
2. 已完成任务。
3. 下一任务。
4. 任务状态标记。
5. 当前阶段关联任务标签。

### 7.3 状态

1. not_started：未开始。
2. current：当前任务。
3. completed：已完成。
4. paused：暂停推进，少用。
5. empty：未配置任务，编辑器专用。

### 7.4 可编辑字段

1. taskTitle。
2. taskDescription。
3. stageId。
4. startTime。
5. status。
6. displayOrder。
7. autoCompletePrevious。

### 7.5 是否随时间变化

是。由 CourseStage.defaultTaskId 和 task_update 事件共同控制。手动 TimelineEvent 优先于阶段默认联动。

### 7.6 数据来源

1. TaskItem。
2. CourseStage。
3. TimelineEvent。
4. RuntimeTime。

## 8. ChapterMap

### 8.1 用途

显示课程路线图和节点完成状态，提供轻量游戏化推进感。

### 8.2 显示内容

1. 节点名称。
2. 节点连接线。
3. 当前节点标记。
4. 已完成节点标记。
5. 锁定或未开始节点。

### 8.3 状态

1. locked。
2. not_started。
3. current。
4. completed。
5. unlocked。

### 8.4 可编辑字段

1. nodeLabel。
2. stageId。
3. unlockTime。
4. status。
5. displayOrder。
6. visibleNodeCount。

### 8.5 是否随时间变化

是。由 CourseStage.mapNodeId、map_node_activate 和 skill_unlock 事件控制。

### 8.6 数据来源

1. MapNode。
2. CourseStage。
3. TimelineEvent。
4. RuntimeTime。

## 9. CourseStageBar

### 9.1 用途

显示课程阶段导航，帮助学员理解当前处于学习结构中的位置。

### 9.2 显示内容

1. 阶段短名。
2. 阶段状态。
3. 阶段连接关系。
4. 当前阶段高亮。
5. 已完成阶段标记。

### 9.3 状态

1. not_started：未开始。
2. current：当前。
3. completed：已完成。
4. compact：紧凑显示。
5. hidden：隐藏。

### 9.4 可编辑字段

1. stageName。
2. shortName。
3. startTime。
4. endTime。
5. mapNodeId。
6. defaultTaskId。
7. defaultHintId。
8. displayMode。

### 9.5 是否随时间变化

是。由 RuntimeTime 与 CourseStage 时间范围推算，也可由 stage_change 事件覆盖。

### 9.6 数据来源

1. CourseStage。
2. TimelineEvent。
3. RuntimeTime。

### 9.7 特殊约束

CourseStageBar 不是播放器进度条，不显示播放头、拖拽滑块、当前播放时间或总时长。

## 10. BottomStatusHud

### 10.1 用途

承接短时状态反馈，例如能力点解锁、阶段完成、作业提醒。

### 10.2 显示内容

1. 状态类型。
2. 状态标题。
3. 短正文。
4. 能力点名称。
5. 完成或解锁标记。

### 10.3 状态

1. idle：无事件。
2. skill_unlocked：能力点解锁。
3. stage_completed：阶段完成。
4. homework_ready：作业提醒。
5. warning_sync：与 WarningPanel 同步提示。

### 10.4 可编辑字段

1. title。
2. body。
3. statusType。
4. startTime。
5. endTime。
6. linkedEventId。
7. visible。

### 10.5 是否随时间变化

是。由 skill_unlock、stage_summary、homework_reminder 等事件控制。

### 10.6 数据来源

1. TimelineEvent。
2. RuntimeTime。
3. ThemePreset。

## 11. 组件冲突处理

当多个事件同时影响同一组件：

1. 按 priority 从高到低处理。
2. 同一组件同一时间只显示一个主状态。
3. WarningPanel 不堆叠多条提示。
4. BottomStatusHud 可显示与 WarningPanel 同步的短文案，但不得重复大段正文。
5. 手动事件优先于阶段默认联动。
