# 项目目录结构规格

## 1. 目录设计目标

项目目录需要服务两个独立但共享模型的运行面：

1. `src/editor`：本地可视化编辑器。
2. `src/remotion`：最终视频渲染器。

两者共享：

1. `src/components` 中的 HUD 展示组件。
2. `src/schemas` 中的数据模型和校验。
3. `src/utils` 中的时间轴计算和格式化工具。
4. `src/styles` 中的视觉 token 和公共样式。

## 2. 推荐目录结构

```text
video-shell/
├── docs/
│   ├── PROJECT_SPEC.md
│   ├── MVP_SCOPE.md
│   ├── USER_WORKFLOW.md
│   ├── INTERFACE_LAYOUT_SPEC.md
│   ├── TIMELINE_EVENT_SPEC.md
│   ├── DECISION_LOG.md
│   ├── STAGE_1_DESIGN_BRIEF.md
│   ├── FINAL_VIDEO_LAYOUT_SPEC.md
│   ├── EDITOR_LAYOUT_SPEC.md
│   ├── HUD_COMPONENT_SPEC.md
│   ├── DESIGN_SYSTEM.md
│   ├── TIMELINE_UI_SPEC.md
│   ├── UI_DECISION_LOG.md
│   ├── STAGE_2_ARCHITECTURE_BRIEF.md
│   ├── TECH_STACK_DECISION.md
│   ├── REPO_STRUCTURE_SPEC.md
│   ├── DATA_MODEL_SPEC.md
│   ├── TIMELINE_DATA_MODEL_SPEC.md
│   ├── EDITOR_ARCHITECTURE_SPEC.md
│   ├── RENDER_PIPELINE_SPEC.md
│   ├── MEDIA_ASSET_SPEC.md
│   └── STAGE_2_DECISION_LOG.md
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   ├── textures/
│   │   └── default-hud/
│   ├── input/
│   │   ├── videos/
│   │   ├── lecturer/
│   │   ├── avatars/
│   │   ├── hud/
│   │   └── lesson.config.json
│   └── fonts/
├── src/
│   ├── editor/
│   │   ├── App.tsx
│   │   ├── layout/
│   │   ├── panels/
│   │   ├── preview/
│   │   ├── timeline/
│   │   ├── assets/
│   │   ├── state/
│   │   └── editorTypes.ts
│   ├── remotion/
│   │   ├── Root.tsx
│   │   ├── compositions/
│   │   ├── scenes/
│   │   ├── renderConfig.ts
│   │   └── registerRoot.ts
│   ├── components/
│   │   ├── hud/
│   │   ├── video/
│   │   └── shared/
│   ├── schemas/
│   │   ├── lessonConfig.schema.ts
│   │   ├── timeline.schema.ts
│   │   ├── media.schema.ts
│   │   ├── render.schema.ts
│   │   └── types.ts
│   ├── data/
│   │   ├── lesson.sample.json
│   │   └── theme.default.json
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── editor.css
│   │   ├── hud.css
│   │   └── remotion.css
│   └── utils/
│       ├── timecode.ts
│       ├── resolveHudState.ts
│       ├── validateLessonConfig.ts
│       ├── assetPaths.ts
│       └── ids.ts
├── scripts/
│   ├── validate-config.ts
│   ├── check-assets.ts
│   └── render-lesson.ts
├── out/
│   ├── renders/
│   └── logs/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── remotion.config.ts
└── README.md
```

## 3. `docs`

`docs` 存放产品、设计和工程规格文档。

要求：

1. 第 0、1、2 阶段文档都保留。
2. 后续实现 Agent 必须优先阅读相关文档再开发。
3. 文档只描述产品和工程约束，不混入临时代码草稿。

## 4. `public/input`

`public/input` 存放本地输入素材和项目配置。

推荐子目录：

| 目录 | 用途 |
| --- | --- |
| `public/input/videos` | 主课程视频 |
| `public/input/lecturer` | 讲师小窗视频 |
| `public/input/avatars` | 讲师头像 |
| `public/input/hud` | HUD 静态资源、可选 logo、图标 |
| `public/input/lesson.config.json` | 当前项目配置 |

注意：

1. 大视频素材不应提交 Git。
2. 可提交 `.gitkeep` 或 README 保留目录。
3. 示例素材应使用小体积占位文件或外部说明。

## 4.1 `public/assets`

`public/assets` 存放应用内默认静态资源，不存放用户课程私有素材。

推荐子目录：

| 目录 | 用途 |
| --- | --- |
| `public/assets/icons` | 默认线性图标、状态图标 |
| `public/assets/textures` | 默认 HUD 纹理或轻量背景资源 |
| `public/assets/default-hud` | 默认主题需要的静态资源 |

与 `public/input/hud` 的区别：

1. `public/assets` 是应用随项目提供的默认资源。
2. `public/input/hud` 是某个课程项目的用户输入资源，例如课程 logo、自定义图标。
3. 默认资源可以提交 Git；用户项目资源需按授权和隐私情况判断，商业素材默认不提交。

## 5. `src/editor`

`src/editor` 是本地可视化编辑器。

推荐职责拆分：

| 子目录 | 职责 |
| --- | --- |
| `layout` | 编辑器页面结构：顶部工具栏、三栏布局、底部区域 |
| `panels` | 右侧属性面板和各模块编辑表单 |
| `preview` | 中央 16:9 最终视频预览画框、点选逻辑 |
| `timeline` | 阶段表、事件表、校验视图 |
| `assets` | 素材选择区和素材状态展示 |
| `state` | 编辑器状态、选中对象、当前时间、保存状态 |

编辑器代码不得直接写 Remotion 渲染命令逻辑，应通过脚本入口或明确 API 触发。

## 6. `src/remotion`

`src/remotion` 是最终视频渲染入口。

推荐职责拆分：

| 子目录 | 职责 |
| --- | --- |
| `compositions` | Remotion Composition 定义 |
| `scenes` | 课程视频整体场景，如 `LessonHudComposition` |
| `renderConfig.ts` | 默认 FPS、宽高、编码相关配置 |
| `Root.tsx` | Composition 注册入口 |
| `registerRoot.ts` | Remotion registerRoot 入口 |

渲染器只应渲染最终视频画面，不依赖编辑器 UI 组件。

## 7. `src/components`

`src/components` 存放可共享展示组件。

推荐子目录：

| 子目录 | 组件 |
| --- | --- |
| `hud` | TopHeader、ChapterMap、TaskTracker、WarningPanel、CourseStageBar、BottomStatusHud、LecturerMiniCard |
| `video` | MainVideoFrame、LecturerVideoFrame、VideoMatte |
| `shared` | 状态标签、面板容器、图标包装、文本截断组件 |

组件要求：

1. 接收 props，不直接读取全局 JSON。
2. 不包含编辑器选中框，选中框属于 `src/editor/preview`。
3. 可被编辑器预览和 Remotion 复用。

## 8. `src/schemas`

`src/schemas` 存放 Zod schema 和 TypeScript 类型。

建议文件：

| 文件 | 职责 |
| --- | --- |
| `lessonConfig.schema.ts` | 顶层课程项目配置 |
| `timeline.schema.ts` | CourseStage、TimelineEvent、事件 payload |
| `media.schema.ts` | 媒体素材模型 |
| `render.schema.ts` | 输出参数和渲染配置 |
| `types.ts` | 从 schema 推导或统一导出的类型 |

要求：

1. 编辑器保存前必须使用 schema。
2. 渲染脚本启动前必须使用 schema。
3. 不允许多个目录重复定义核心模型。

## 9. `src/data`

`src/data` 存放示例配置和默认主题数据。

推荐：

1. `lesson.sample.json`：小型示例课程配置。
2. `theme.default.json`：AI 战术课程 HUD 默认主题 token。

`src/data` 不存放用户大视频素材。

## 10. `src/styles`

`src/styles` 存放公共样式。

建议：

1. `tokens.css` 定义 DESIGN_SYSTEM.md 中的颜色、字号、间距。
2. `hud.css` 定义最终视频 HUD 基础样式。
3. `editor.css` 定义编辑器工具界面样式。
4. `remotion.css` 定义 Remotion 渲染时需要的全局样式。

编辑器样式和最终视频样式必须分离，避免播放器控件样式污染最终 MP4。

## 11. `src/utils`

`src/utils` 存放跨编辑器和渲染器复用的纯函数。

推荐：

| 文件 | 职责 |
| --- | --- |
| `timecode.ts` | 秒数、帧数、时间码互转 |
| `resolveHudState.ts` | 根据配置和 currentTime 计算 HUD 状态 |
| `validateLessonConfig.ts` | 业务校验 |
| `assetPaths.ts` | 素材路径解析 |
| `ids.ts` | ID 生成和引用检查 |

要求：

1. 工具函数应尽量纯函数化。
2. 不依赖浏览器 DOM。
3. 不依赖编辑器状态库。

## 12. `scripts`

`scripts` 存放本地命令入口。

推荐：

1. `validate-config.ts`：读取并校验配置。
2. `check-assets.ts`：检查主视频、讲师素材、头像、HUD 资源是否存在。
3. `render-lesson.ts`：调用 Remotion 输出 MP4。

脚本只做工程编排，不重复实现 HUD 状态计算。

## 13. `out`

`out` 存放本地输出。

推荐：

| 目录 | 用途 |
| --- | --- |
| `out/renders` | 最终 MP4 |
| `out/logs` | 渲染日志、校验报告 |

`out` 目录不应提交 Git。

## 14. 第一版目录验收标准

后续工程初始化完成后，应满足：

1. 编辑器代码集中在 `src/editor`。
2. 渲染器代码集中在 `src/remotion`。
3. HUD 展示组件集中在 `src/components/hud`。
4. 配置模型集中在 `src/schemas`。
5. 时间轴状态计算集中在 `src/utils/resolveHudState.ts`。
6. 输入素材集中在 `public/input`。
7. 输出文件集中在 `out`。
8. 不把编辑器控件混入最终视频渲染目录。
