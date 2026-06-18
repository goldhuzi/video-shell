# Lesson 配置指南

lesson JSON 是一节课程视频的配置文件，位于：

```text
src/data/lessons/{lessonId}.json
```

它决定最终视频显示什么、什么时候显示、从哪里读取素材、输出到哪里。

## 修改前原则

1. 不要随便删除字段。
2. 时间统一保存为秒数，例如 `92` 表示视频第 92 秒。
3. 中文文案不要过长。
4. 主视频默认建议完整显示，`mainVideoFitMode` 建议 `contain`。
5. 音频默认建议 `audio.mode = "main-only"`。
6. 修改后先运行 `npm run validate:lessons`。

## 顶层结构

当前 schema 的核心顶层字段：

```text
schemaVersion
meta
media
audio
speaker
layout
warning
tasks
chapterMap
stages
timelineEvents
render
```

容易写错：

1. 是 `chapterMap`，不是 `chapter_map`。
2. 是 `timelineEvents`，不是 `timeline`。
3. 是 `audio.mode`，不是 `audioMode`。
4. 是 `render.outputDir` / `render.outputName`，不是 `output.path`。

## `meta`

作用：课程基础信息，主要影响顶部栏和项目识别。

关键字段：

1. `projectId`
2. `projectName`
3. `courseTitle`
4. `lessonTitle`
5. `chapterTitle`
6. `lessonIndex`
7. `totalLessons`
8. `courseCode`
9. `statusLabel`
10. `mainMission`
11. `canvas.width`、`canvas.height`、`canvas.fps`

示例：

```json
"meta": {
  "projectId": "lesson-02",
  "projectName": "视频课程套壳",
  "courseTitle": "人类简史精读",
  "lessonTitle": "虚构故事如何组织人类合作",
  "lessonIndex": 2,
  "totalLessons": 12,
  "courseCode": "SAPIENS",
  "mainMission": "理解共同故事如何组织大规模协作",
  "canvas": {
    "width": 1920,
    "height": 1080,
    "fps": 30
  }
}
```

常见错误：

1. `totalLessons` 小于 `lessonIndex`。
2. 标题太长导致顶部栏拥挤。
3. `canvas` 不是 1920 x 1080。

编辑器对应位置：课程基础信息区域。

是否影响最终视频：会影响顶部栏和课程标签。

## `media`

作用：声明主视频、讲师视频、头像和素材策略。

关键字段：

1. `mainVideo.src`
2. `mainVideo.duration`
3. `speakerVideo.src`
4. `speakerImage.src`
5. `useSpeakerVideo`
6. `mainVideoFitMode`
7. `hudAssets`

示例：

```json
"media": {
  "mainVideo": {
    "id": "lesson-02-main",
    "kind": "main_video",
    "src": "/input/videos/lesson-02-main.mp4",
    "required": true
  },
  "speakerImage": {
    "id": "shaofan-avatar",
    "kind": "avatar",
    "src": "/input/images/shaofan-avatar.png",
    "required": false
  },
  "useSpeakerVideo": false,
  "mainVideoFitMode": "contain",
  "hudAssets": []
}
```

常见错误：

1. `media.mainVideo.src` 写成本机绝对路径。
2. 主视频文件不存在。
3. 用远程 URL、`file:`、`data:` 或 `blob:`。
4. `mainVideoFitMode` 与 `layout.mainVideoFitMode` 不一致。

编辑器对应位置：素材路径区域。

是否影响最终视频：直接影响主视频、讲师小窗和素材 fallback。

## `audio`

作用：决定最终 MP4 音频来源。

关键字段：

```json
"audio": {
  "mode": "main-only"
}
```

可选值：

1. `main-only`：默认建议，使用主视频音频。
2. `speaker-only`：只使用讲师视频音频，要求讲师视频存在。
3. `mix`：主视频和讲师视频混音，要求讲师视频存在，有回声风险。
4. `mute-all`：静音输出。

常见错误：

1. `mix` 但讲师视频缺失。
2. `speaker-only` 但讲师视频没有音轨。
3. 误用 `mute-all` 导致没有声音。

编辑器对应位置：音频配置当前主要通过 JSON 修改。

是否影响最终视频：影响最终 MP4 音频。

## `speaker`

作用：控制讲师卡显示方式和素材缺失策略。

关键字段：

1. `name`
2. `title`
3. `role`
4. `stats`
5. `displayMode`
6. `positionPreset`
7. `assetPriority`
8. `missingAssetBehavior`

示例：

```json
"speaker": {
  "name": "Shaofan",
  "title": "课程主理人",
  "role": "Instructor",
  "displayMode": "avatar",
  "positionPreset": "bottom-left",
  "missingAssetBehavior": "fallback_to_identity_card"
}
```

常见错误：

1. 讲师视频很短却设置为整节课 `video`。
2. `missingAssetBehavior=block_render` 但素材缺失。
3. 讲师卡遮挡主视频。

编辑器对应位置：讲师信息和讲师素材区域。

是否影响最终视频：影响讲师卡、小窗、身份牌或隐藏状态。

## `layout`

作用：控制最终画面布局、显示开关和主视频适配。

关键字段：

1. `aspectRatio`
2. `canvas`
3. `mainVideoFitMode`
4. `topHeader.visible`
5. `rightSidebar.visible`
6. `stageBar.visible`
7. `lecturer.visible`
8. `bottomStatusHud.visible`

示例：

```json
"layout": {
  "aspectRatio": "16:9",
  "canvas": {
    "width": 1920,
    "height": 1080
  },
  "mainVideoFitMode": "contain",
  "topHeader": {
    "visible": true,
    "showCurrentStage": true
  },
  "rightSidebar": {
    "visible": true,
    "displayMode": "full"
  },
  "stageBar": {
    "visible": true,
    "displayMode": "standard"
  },
  "lecturer": {
    "visible": true,
    "positionPreset": "bottom-left"
  },
  "bottomStatusHud": {
    "visible": true
  }
}
```

常见错误：

1. 关闭了关键 HUD 后以为 timeline 失效。
2. 使用 `cover` 导致主视频被裁切。
3. 把 CourseStageBar 设计成播放器进度条。

编辑器对应位置：布局开关和预览。

是否影响最终视频：直接影响画面结构。

## `warning`

作用：提示库。WarningPanel、summary、homework 等可引用这里的提示。

关键字段：

1. `defaultHintId`
2. `items[].id`
3. `items[].hintType`
4. `items[].title`
5. `items[].body`
6. `items[].stageId`
7. `items[].defaultDuration`

示例：

```json
"warning": {
  "defaultHintId": "hint-opening",
  "items": [
    {
      "id": "hint-opening",
      "hintType": "key_point",
      "title": "先抓主线",
      "body": "先理解本节课的核心问题，再看细节。",
      "stageId": "stage-opening",
      "defaultDuration": 8
    }
  ]
}
```

常见错误：

1. `defaultHintId` 引用不存在。
2. `stageId` 引用不存在。
3. 文案太长。

编辑器对应位置：默认重点提示和提示内容区域。

是否影响最终视频：影响右侧提示面板。

## `tasks`

作用：任务追踪列表。

关键字段：

1. `id`
2. `label`
3. `title`
4. `description`
5. `stageId`
6. `order`
7. `defaultStatus`
8. `autoCompletePrevious`

示例：

```json
"tasks": [
  {
    "id": "task-opening",
    "label": "任务 1",
    "title": "抓住课程问题",
    "stageId": "stage-opening",
    "order": 0,
    "defaultStatus": "current",
    "autoCompletePrevious": true
  }
]
```

常见错误：

1. `stageId` 不存在。
2. `order` 重复导致顺序混乱。
3. 标题太长。

编辑器对应位置：任务追踪配置。

是否影响最终视频：影响 TaskTracker。

## `chapterMap`

作用：课程地图节点。

关键字段：

1. `displayMode`
2. `nodes[].id`
3. `nodes[].label`
4. `nodes[].stageId`
5. `nodes[].skillId`
6. `nodes[].unlockTime`
7. `nodes[].order`
8. `nodes[].defaultStatus`

示例：

```json
"chapterMap": {
  "displayMode": "vertical_route",
  "nodes": [
    {
      "id": "node-opening",
      "label": "核心问题",
      "stageId": "stage-opening",
      "order": 0,
      "defaultStatus": "current"
    }
  ]
}
```

常见错误：

1. 写成 `chapter_map`。
2. `stageId` 不存在。
3. 节点顺序混乱。

编辑器对应位置：课程地图配置。

是否影响最终视频：影响 ChapterMap。

## `stages`

作用：课程阶段，是 CourseStageBar、当前阶段、默认任务、默认地图和默认提示的基础。

关键字段：

1. `id`
2. `label`
3. `name`
4. `shortName`
5. `startTime`
6. `endTime`
7. `mapNodeId`
8. `defaultTaskId`
9. `defaultHintId`
10. `order`
11. `enabled`

示例：

```json
"stages": [
  {
    "id": "stage-opening",
    "label": "阶段 1",
    "name": "课程开场与核心问题",
    "shortName": "开场",
    "startTime": 0,
    "endTime": 92,
    "mapNodeId": "node-opening",
    "defaultTaskId": "task-opening",
    "defaultHintId": "hint-opening",
    "order": 0,
    "enabled": true
  }
]
```

常见错误：

1. `startTime >= endTime`。
2. 阶段开始时间不递增。
3. 阶段重叠。
4. 默认引用不存在。

编辑器对应位置：底部阶段配置和右侧选中阶段表单。

是否影响最终视频：影响阶段条、当前阶段、默认 HUD 状态。

## `timelineEvents`

作用：指定某个视频时间点发生的 HUD 状态变化。

示例：

```json
"timelineEvents": [
  {
    "id": "event-warning",
    "type": "warning_show",
    "startTime": 236,
    "endTime": 256,
    "targetComponent": "warning_panel",
    "payload": {
      "title": "注意这个转折",
      "text": "这里是本节课理解难点。"
    },
    "priority": 20,
    "enabled": true
  }
]
```

常见错误：

1. `targetComponent` 与事件类型不匹配。
2. 显示型事件没有 `endTime` 或 `duration`。
3. payload 缺少必需字段。
4. 事件时间超过视频时长。

编辑器对应位置：事件表和事件表单。

是否影响最终视频：直接影响 HUD 随时间变化。

详见 `docs/TIMELINE_EVENT_GUIDE.md`。

## `render`

作用：控制输出视频规格、时长、编码和文件名。

关键字段：

1. `width`
2. `height`
3. `fps`
4. `format`
5. `outputDir`
6. `outputName`
7. `durationMode`
8. `durationSeconds`
9. `codec` 或 `videoCodec`
10. `audioEnabled`
11. `quality`

示例：

```json
"render": {
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "format": "mp4",
  "outputDir": "out",
  "outputName": "lesson-02-final.mp4",
  "durationMode": "auto",
  "codec": "h264",
  "audioEnabled": true,
  "quality": "standard"
}
```

常见错误：

1. `outputName` 不是 `.mp4`。
2. `outputName` 包含目录。
3. `durationMode=fixed` 但没有 `durationSeconds`。
4. `render.codec` 和 `render.videoCodec` 不一致。

编辑器对应位置：当前主要通过 JSON 修改。

是否影响最终视频：影响输出文件、时长、fps、编码和音频策略。

## 修改后必须运行

```bash
npm run validate:lessons
npm run preflight:render -- lesson-02
```

如果改了 HUD runtime、schema 或渲染代码，还要运行：

```bash
npm run typecheck
npm test
```
