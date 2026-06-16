# Remotion 渲染流程规格

## 1. 渲染器定位

Remotion 渲染器负责把课程配置、主视频素材、讲师素材和 HUD 组件合成为最终 16:9 MP4。

渲染器不是：

1. 编辑器。
2. 播放器。
3. 剪辑软件。
4. 云端任务队列。

渲染器只接收配置和素材，输出最终视频。

## 2. 输入与输出

### 2.1 输入

必需输入：

1. `LessonProjectConfig`。
2. 主课程视频文件。

可选输入：

1. 讲师小窗视频。
2. 讲师头像。
3. HUD 静态资源。
4. 字体资源。
5. 渲染输出参数。

### 2.2 输出

第一版输出：

1. 1920 x 1080。
2. 16:9。
3. MP4。
4. 默认包含主视频音频。
5. 不包含播放器控件。

## 3. 渲染流程总览

```text
读取 lesson 配置
        │
        ├── Zod schema 校验
        ├── 业务规则校验
        ├── 素材路径检查
        ├── 获取主视频元信息
        ├── 确定 composition 参数
        ├── 按帧计算 currentTime
        ├── resolveHudState(config, currentTime)
        ├── 渲染主视频和 HUD
        └── 输出 MP4 到 out/renders
```

## 4. 读取 lesson 配置

渲染脚本应接收配置路径，例如：

```text
public/input/lesson.config.json
```

读取后解析为 `LessonProjectConfig`。

要求：

1. 不从编辑器内存读取配置。
2. 不依赖编辑器 UI 状态。
3. 配置路径应可通过命令参数传入。
4. 默认配置路径可作为脚本默认值。

## 5. 校验配置

渲染前必须校验配置。

### 5.1 Schema 校验

使用 Zod 校验：

1. 必填字段。
2. 枚举值。
3. 时间字段类型。
4. 事件 payload 与 type 匹配。
5. 渲染参数格式。

### 5.2 业务校验

业务校验包括：

1. 主视频存在。
2. 课程标题存在。
3. 至少有一个课程阶段。
4. 阶段时间不倒置。
5. 阶段时间不存在严重重叠。
6. 提示类事件有 `endTime` 或 `duration`。
7. 事件引用的阶段、任务、地图节点、提示、能力点存在。
8. 输出目录可写。

校验失败时应停止渲染，并输出可读错误。

## 6. 读取主视频和讲师视频

### 6.1 主视频

主视频是 P0 必需素材。

渲染器需要：

1. 解析 `media.mainVideo.src`。
2. 检查文件存在。
3. 读取时长、宽高和音频信息。
4. 将主视频渲染到 MainVideoFrame。
5. 默认使用 `contain` 完整显示。

主视频音频默认进入最终 MP4。

### 6.2 讲师视频

讲师视频是 P1 可选素材。

处理规则：

1. `lecturer.displayMode = video` 时读取讲师视频。
2. 缺失时渲染前给出阻断或降级提示，具体取决于配置策略。
3. 默认从主视频 0 秒同步播放。
4. 时长不一致的处理第一版应简单明确：短于主视频时可冻结最后一帧或隐藏，具体实现需在开发阶段确认。

### 6.3 头像

头像是可选素材。

处理规则：

1. `lecturer.displayMode = avatar` 或 `compact` 时读取头像。
2. 缺失时可显示占位身份牌，但渲染前应警告。

## 7. Composition 参数

第一版推荐：

```ts
{
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: Math.ceil(mainVideoDuration * fps)
}
```

说明：

1. 输出尺寸固定 1920 x 1080。
2. FPS 默认 30，可允许配置 60。
3. 视频总时长默认等于主视频时长。
4. 不以讲师视频时长决定总时长。

## 8. 根据当前帧计算当前时间

Remotion 渲染时通过当前帧和 FPS 计算当前时间：

```ts
currentTime = frame / fps
```

规则：

1. `currentTime` 单位为秒。
2. 所有阶段和事件都与 `currentTime` 比较。
3. 不使用编辑器拖动条时间。
4. 不使用真实系统时间。

## 9. 根据时间轴事件计算 HUD 状态

渲染器应复用 `resolveHudState(config, currentTime)`。

计算顺序：

1. 初始化默认 HUD 状态。
2. 根据 `CourseStage` 计算当前阶段。
3. 更新 CourseStageBar 状态。
4. 根据阶段绑定更新 ChapterMap、TaskTracker、默认提示。
5. 筛选当前时间命中的 `TimelineEvent`。
6. 按 `priority` 应用事件。
7. 解决同组件冲突。
8. 输出 `HudRuntimeState`。

事件处理规则：

1. `stage_change` 更新阶段条。
2. `map_node_activate` 更新地图节点。
3. `task_update` 更新任务状态。
4. `hint_show` 更新 WarningPanel。
5. `skill_unlock` 更新 BottomStatusHud，可同步地图。
6. `stage_summary` 更新 WarningPanel，可同步 BottomStatusHud。
7. `homework_reminder` 更新 WarningPanel，可同步 BottomStatusHud 和 TaskTracker。

## 10. 渲染画面层级

最终视频画面建议分层：

1. 背景层：深色底板和主视频 matte。
2. 主内容层：MainVideoFrame。
3. HUD 信息层：TopHeader、ChapterMap、TaskTracker、WarningPanel、CourseStageBar、LecturerMiniCard。
4. 事件反馈层：BottomStatusHud、能力点解锁、短时状态。

禁止渲染：

1. 播放按钮。
2. 暂停按钮。
3. 进度拖动条。
4. 播放头滑块。
5. 音量按钮。
6. 倍速按钮。
7. 全屏按钮。
8. 编辑器选中框。
9. 属性面板。
10. 时间轴表格。

## 11. 组件输入约定

HUD 组件不应直接解析完整配置。

推荐：

1. 顶层 Composition 读取 `LessonProjectConfig`。
2. 顶层 Composition 调用 `resolveHudState`。
3. 顶层 Composition 将必要 props 传给组件。

示例职责：

| 组件 | 输入 |
| --- | --- |
| TopHeader | `course`、`currentStage`、`layout.topHeader` |
| MainVideoFrame | `media.mainVideo`、`layout.mainVideoFitMode` |
| ChapterMap | `map.nodes`、`hudState.mapNodeStates` |
| TaskTracker | `tasks`、`hudState.taskStates` |
| WarningPanel | `hudState.activeHint` |
| CourseStageBar | `stages`、`hudState.stageStates` |
| BottomStatusHud | `hudState.activeBottomStatus` |
| LecturerMiniCard | `lecturer`、`media.lecturerVideo`、`media.lecturerAvatar` |

## 12. 动效处理

动效由事件的 `animation` 和设计系统默认值共同决定。

第一版建议：

1. 提示入场：180 至 240 ms。
2. 提示退场：120 至 180 ms。
3. 地图节点点亮：240 至 320 ms。
4. 任务切换：180 至 240 ms。
5. 能力点解锁：300 至 400 ms。

渲染器应支持 `reducedMotion`：

1. 关闭脉冲和位移动效。
2. 保留必要的淡入淡出。
3. 不影响状态准确性。

## 13. 输出 MP4

输出路径由 `render.outputDir` 和 `render.outputFileName` 决定。

默认：

```text
out/renders/{project-name}.mp4
```

输出要求：

1. 生成 MP4。
2. 使用主视频音频。
3. 保持 1920 x 1080。
4. 文件名应避免非法字符。
5. 渲染日志写入 `out/logs`。

## 14. 渲染错误处理

常见错误和处理：

| 错误 | 处理 |
| --- | --- |
| 配置 JSON 解析失败 | 停止渲染，输出文件路径和解析错误 |
| Schema 校验失败 | 停止渲染，列出字段错误 |
| 主视频缺失 | 停止渲染 |
| 讲师素材缺失 | 根据 displayMode 决定停止或降级 |
| 事件引用不存在 | 停止渲染 |
| 输出目录不可写 | 停止渲染 |
| 视频编码失败 | 输出 Remotion 错误和日志路径 |

## 15. 渲染前检查清单

渲染脚本和编辑器都应覆盖：

1. 主视频已配置且存在。
2. 课程标题已填写。
3. 输出比例为 16:9。
4. 输出尺寸为 1920 x 1080。
5. 至少有一个阶段。
6. 阶段时间有效。
7. 至少有一个关键时间轴事件，建议但可配置为警告。
8. 提示类事件有持续时间。
9. 最终视频不包含播放器控件。
10. 输出目录存在或可创建。

## 16. 渲染流程验收标准

后续实现完成后应满足：

1. 能从 JSON 配置启动渲染。
2. 能校验配置和素材。
3. 能读取主视频并按主视频时长确定输出时长。
4. 能按当前帧计算当前时间。
5. 能按时间轴事件计算 HUD 状态。
6. 能输出 1920 x 1080 MP4。
7. 最终 MP4 中不出现任何编辑器或播放器控件。
