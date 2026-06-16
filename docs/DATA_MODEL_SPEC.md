# 课程配置数据模型规格

## 1. 数据模型目标

课程配置数据模型用于描述一节课如何从素材、课程信息、HUD 内容和时间轴事件，生成最终 16:9 MP4。

第一版数据模型必须满足：

1. 编辑器可读写。
2. Remotion 渲染器可直接读取。
3. Zod 可校验。
4. 支持固定布局和有限配置。
5. 支持时间轴驱动 HUD 状态变化。
6. 支持本地 JSON 保存和复用。

顶层模型建议命名为 `LessonProjectConfig`。

## 2. 顶层结构

```ts
type LessonProjectConfig = {
  schemaVersion: string;
  project: ProjectInfo;
  course: CourseMetadata;
  lecturer: LecturerProfile;
  media: MediaConfig;
  layout: LayoutConfig;
  theme: ThemeConfig;
  stages: CourseStage[];
  tasks: TaskItem[];
  map: CourseMapConfig;
  hints: HintItem[];
  skills: SkillItem[];
  timelineEvents: TimelineEvent[];
  render: RenderConfig;
};
```

说明：

1. `schemaVersion` 用于后续配置迁移。
2. `course` 和 `lecturer` 存放基础信息。
3. `media` 存放素材引用。
4. `layout` 存放固定布局的有限开关。
5. `stages`、`tasks`、`map`、`hints`、`skills` 存放 HUD 基础对象。
6. `timelineEvents` 存放时间轴事件。
7. `render` 存放输出参数。

## 3. ProjectInfo

```ts
type ProjectInfo = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
};
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 项目唯一 ID |
| `name` | 是 | 编辑器顶部显示的项目名 |
| `createdAt` | 否 | ISO 时间字符串 |
| `updatedAt` | 否 | ISO 时间字符串 |
| `author` | 否 | 配置作者，不等于登录用户 |

第一版没有登录系统，因此 `author` 只是配置元信息。

## 4. CourseMetadata

```ts
type CourseMetadata = {
  courseTitle: string;
  lessonTitle?: string;
  chapterTitle?: string;
  lessonNumber?: string;
  lessonIndex?: number;
  totalLessons?: number;
  courseCode?: string;
  statusLabel?: string;
  mainMission?: string;
  description?: string;
};
```

字段说明：

| 字段 | 必填 | 用途 |
| --- | --- | --- |
| `courseTitle` | 是 | TopHeader 主标题 |
| `lessonTitle` | 否 | 本节课标题，优先用于 TopHeader 副标题 |
| `chapterTitle` | 否 | 章节标题或模块标题，可作为 `lessonTitle` 的上级分组 |
| `lessonNumber` | 否 | 课程序号显示文本，如 `Lesson 03` |
| `lessonIndex` | 否 | 第几课，数字形式，便于校验和批量命名 |
| `totalLessons` | 否 | 总课数，用于显示 `3/12` 等课程上下文 |
| `courseCode` | 否 | 课程代号或品牌短标识 |
| `statusLabel` | 否 | 轻量状态标签，如 `MISSION LIVE` |
| `mainMission` | 否 | 本节课主线任务，可用于 TopHeader、TaskTracker 或项目概览 |
| `description` | 否 | 编辑器项目概览，不一定进入成片 |

约束：

1. `courseTitle` 不能为空。
2. `lessonTitle` 与 `chapterTitle` 可同时存在；TopHeader 默认优先显示 `lessonTitle`，再显示 `chapterTitle`。
3. `lessonIndex` 和 `totalLessons` 同时存在时，`lessonIndex` 不应大于 `totalLessons`。
4. `mainMission` 应短句化，避免把长段课程目标塞入 HUD。
5. 标题过长时编辑器应提示缩短。
6. 不存放播放状态、倍速或播放器进度。

## 5. LecturerProfile

```ts
type LecturerProfile = {
  name?: string;
  title?: string;
  bio?: string;
  displayMode: "video" | "avatar" | "compact" | "hidden";
  positionPreset: "bottom-left" | "bottom-right" | "in-bottom-hud" | "hidden";
  assetPriority?: Array<"video" | "avatar" | "identity_card" | "hidden">;
  missingAssetBehavior?: "block_render" | "fallback_to_avatar" | "fallback_to_identity_card" | "hide";
};
```

字段说明：

| 字段 | 必填 | 用途 |
| --- | --- | --- |
| `name` | 否 | 讲师姓名 |
| `title` | 否 | 讲师身份标签 |
| `bio` | 否 | 编辑器内备注，默认不进入成片 |
| `displayMode` | 是 | 讲师模块显示模式 |
| `positionPreset` | 是 | 讲师小窗位置预设 |
| `assetPriority` | 否 | 讲师素材优先级，例如视频、头像、身份牌、隐藏 |
| `missingAssetBehavior` | 否 | 讲师素材缺失时的处理策略 |

约束：

1. 讲师模块为 P1，可隐藏。
2. `displayMode = video` 时应存在讲师视频素材。
3. `displayMode = avatar` 或 `compact` 时应存在头像，缺失时显示编辑器警告。
4. 默认素材优先级建议为 `["video", "avatar", "identity_card", "hidden"]`。
5. 若用户明确选择 `block_render`，讲师素材缺失应阻断渲染；否则可按优先级降级。

## 6. MediaConfig

```ts
type MediaConfig = {
  mainVideo: MediaAsset;
  lecturerVideo?: MediaAsset;
  lecturerAvatar?: MediaAsset;
  hudAssets?: MediaAsset[];
};
```

```ts
type MediaAsset = {
  id: string;
  kind: "main_video" | "lecturer_video" | "avatar" | "hud_static" | "font" | "logo";
  label?: string;
  src: string;
  duration?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  required: boolean;
};
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 素材唯一 ID |
| `kind` | 是 | 素材类型 |
| `src` | 是 | 相对 `public` 或项目根的路径 |
| `duration` | 否 | 秒数，由编辑器或脚本读取 |
| `width` / `height` | 否 | 素材尺寸 |
| `required` | 是 | 是否阻断渲染 |

约束：

1. 主视频 `mainVideo` 必填。
2. 讲师视频和头像可选。
3. 大视频不应提交 Git。
4. 素材路径应可被编辑器和渲染脚本共同解析。

## 7. LayoutConfig

```ts
type LayoutConfig = {
  aspectRatio: "16:9";
  canvas: {
    width: 1920;
    height: 1080;
  };
  mainVideoFitMode: "contain" | "cover" | "fit_width" | "fit_height";
  mainVideoSafeArea?: {
    showGuideInEditor: boolean;
    protectedRegions?: Array<"top" | "right" | "bottom" | "left" | "center">;
    notes?: string;
  };
  topHeader: {
    visible: boolean;
    showCurrentStage: boolean;
  };
  rightSidebar: {
    visible: boolean;
    displayMode: "full" | "map_only" | "tasks_only" | "hints_only" | "hidden";
  };
  stageBar: {
    visible: boolean;
    displayMode: "standard" | "compact" | "hidden";
  };
  lecturer: {
    visible: boolean;
    positionPreset: "bottom-left" | "bottom-right" | "in-bottom-hud" | "hidden";
  };
  bottomStatusHud: {
    visible: boolean;
  };
};
```

约束：

1. 第一版固定 `16:9` 和 `1920 x 1080`。
2. 不支持任意拖拽、缩放、图层排序。
3. `CourseStageBar` 是学习导航，不是播放器进度条。
4. `mainVideoFitMode` 默认 `contain`。
5. `mainVideoSafeArea` 只用于编辑器参考线和渲染前遮挡检查，不得渲染进最终 MP4。
6. `protectedRegions` 用于记录用户认为主视频中需要避让的区域，不代表自动识别能力。

## 8. ThemeConfig

```ts
type ThemeConfig = {
  preset: "ai_tactical_hud";
  accentColor?: "blue" | "cyan" | "purple";
  brandText?: string;
  reducedMotion?: boolean;
};
```

第一版默认只支持 `ai_tactical_hud`。

允许：

1. 选择轻量强调色。
2. 设置文字型品牌标识。
3. 降低动效。

不允许：

1. 完整自定义字体系统。
2. 任意修改所有颜色。
3. 自定义播放器皮肤。

## 9. CourseStage

```ts
type CourseStage = {
  id: string;
  name: string;
  shortName?: string;
  startTime: number;
  endTime?: number;
  mapNodeId?: string;
  defaultTaskId?: string;
  defaultHintId?: string;
  order: number;
  enabled: boolean;
};
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 阶段唯一 ID |
| `name` | 是 | 完整阶段名称 |
| `shortName` | 否 | 阶段条显示短名 |
| `startTime` | 是 | 秒数，以主视频为基准 |
| `endTime` | 否 | 秒数，可由下一阶段推算 |
| `mapNodeId` | 否 | 默认联动地图节点 |
| `defaultTaskId` | 否 | 默认联动任务 |
| `defaultHintId` | 否 | 默认联动提示 |
| `order` | 是 | 排序 |
| `enabled` | 是 | 是否启用 |

约束：

1. 阶段按 `startTime` 递增。
2. 阶段不应重叠。
3. 标准阶段条建议 3 到 8 个阶段。

## 10. TaskItem

```ts
type TaskItem = {
  id: string;
  title: string;
  description?: string;
  stageId?: string;
  order: number;
  defaultStatus?: "not_started" | "current" | "completed";
  autoCompletePrevious?: boolean;
};
```

约束：

1. 当前任务由时间轴计算得出，不应长期手写固定。
2. 同一时间只能有一个主要 `current` 任务。
3. 任务标题应短，便于最终视频扫读。

## 11. CourseMapConfig 和 MapNode

```ts
type CourseMapConfig = {
  displayMode: "vertical_route";
  nodes: MapNode[];
};
```

```ts
type MapNode = {
  id: string;
  label: string;
  stageId?: string;
  skillId?: string;
  unlockTime?: number;
  order: number;
  defaultStatus?: "locked" | "not_started" | "current" | "completed" | "unlocked";
};
```

约束：

1. 第一版地图为纵向节点路线图。
2. 节点可绑定阶段或能力点。
3. 节点状态由阶段联动和事件共同决定。

## 12. HintItem

```ts
type HintItem = {
  id: string;
  hintType: "key_point" | "beginner_tip" | "warning" | "summary" | "homework";
  title: string;
  body: string;
  stageId?: string;
  defaultDuration?: number;
};
```

约束：

1. HintItem 是可复用内容对象。
2. 具体显示时间由 TimelineEvent 或阶段默认联动决定。
3. 正文建议不超过 40 个中文字符，超出时编辑器提示缩短。

## 13. SkillItem

```ts
type SkillItem = {
  id: string;
  title: string;
  description?: string;
  stageId?: string;
  mapNodeId?: string;
  iconKey?: string;
};
```

用途：

1. 支持 `skill_unlock` 事件。
2. 支持 BottomStatusHud 显示能力点解锁。
3. 可选联动 ChapterMap。

## 14. RenderConfig

```ts
type RenderConfig = {
  width: 1920;
  height: 1080;
  fps: 30 | 60;
  format: "mp4";
  outputFileName: string;
  outputDir: string;
  videoCodec?: "h264" | "h265";
  audioEnabled: boolean;
  quality?: "preview" | "standard" | "high";
};
```

默认建议：

1. `width = 1920`。
2. `height = 1080`。
3. `fps = 30`。
4. `format = mp4`。
5. `audioEnabled = true`，沿用主视频音频。

## 15. HudRuntimeState

`HudRuntimeState` 不是用户保存的配置，而是由配置和当前时间计算出的运行态。

```ts
type HudRuntimeState = {
  currentTime: number;
  currentStageId?: string;
  stageStates: Record<string, "not_started" | "current" | "completed">;
  mapNodeStates: Record<string, "locked" | "not_started" | "current" | "completed" | "unlocked">;
  taskStates: Record<string, "not_started" | "current" | "completed">;
  activeHint?: ResolvedHint;
  activeBottomStatus?: ResolvedBottomStatus;
  activeSkillIds: string[];
};
```

用途：

1. 编辑器预览根据它显示当前时间状态。
2. Remotion 每一帧根据它渲染最终画面。
3. HUD 组件只读运行态，不自行解析全部事件。

## 16. EditorSessionState

`EditorSessionState` 是编辑器会话状态，不属于可渲染课程配置。它可以保存在编辑器本地状态中，也可以作为编辑器草稿元信息单独保存，但不应作为 Remotion 渲染器的必需输入。

```ts
type EditorSessionState = {
  currentTime: number;
  isPlaying: boolean;
  selectedTarget?: {
    kind: "component" | "stage" | "event" | "asset";
    id: string;
  };
  activeTimelineView: "stages" | "events" | "validation";
  saveStatus: "saved" | "dirty" | "saving" | "error";
  previewZoom: number;
};
```

用途：

1. 记录当前预览时间。
2. 记录当前选中模块、阶段、事件或素材。
3. 记录保存状态和时间轴面板状态。
4. 支持编辑器交互恢复。

约束：

1. 不进入最终 MP4。
2. 不作为 Remotion Composition 的输入。
3. 不影响 `resolveHudState(config, currentTime)` 的纯计算结果。

## 17. 配置示例片段

```json
{
  "schemaVersion": "1.0.0",
  "project": {
    "id": "project-demo-001",
    "name": "AI 私教课程第 3 节"
  },
  "course": {
    "courseTitle": "AI 私教系统搭建课",
    "lessonTitle": "信源导入与任务推进",
    "chapterTitle": "信源导入与任务推进",
    "lessonNumber": "Lesson 03",
    "lessonIndex": 3,
    "totalLessons": 12,
    "statusLabel": "MISSION LIVE",
    "mainMission": "完成可信信源导入"
  },
  "layout": {
    "aspectRatio": "16:9",
    "canvas": { "width": 1920, "height": 1080 },
    "mainVideoFitMode": "contain",
    "mainVideoSafeArea": {
      "showGuideInEditor": false,
      "protectedRegions": ["center", "bottom"],
      "notes": "主视频底部已有字幕时需检查阶段条遮挡"
    },
    "topHeader": { "visible": true, "showCurrentStage": true },
    "rightSidebar": { "visible": true, "displayMode": "full" },
    "stageBar": { "visible": true, "displayMode": "standard" },
    "lecturer": { "visible": true, "positionPreset": "bottom-left" },
    "bottomStatusHud": { "visible": true }
  }
}
```

## 18. 数据模型验收标准

后续实现应满足：

1. 编辑器保存的 JSON 可被渲染器直接读取。
2. Zod schema 能校验所有必填字段。
3. 阶段、任务、地图、提示、能力点之间通过 ID 引用。
4. 时间字段统一使用秒数，界面层再格式化为 `MM:SS` 或 `HH:MM:SS`。
5. 最终视频不读取任何编辑器 UI 状态。
