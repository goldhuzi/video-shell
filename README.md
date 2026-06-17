# 视频课程套壳

> 一个时间轴驱动的课程 HUD 渲染器。  
> Turn a plain course video into a cinematic, game-like learning interface.

[English](README.en.md) · [快速开始](docs/GETTING_STARTED.md) · [项目概览](docs/PROJECT_SPEC.md) · [素材规范](docs/MEDIA_ASSET_SPEC.md)

## ✨ 项目定位

《视频课程套壳》是一款面向 OPC、一人公司、个人课程主理人、自媒体课程创作者和小型后期制作人员的本地视频课程 HUD 渲染工具。

它不是剪辑软件、课程平台或播放器，而是一个把“课程结构、学习任务、重点提示、阶段导航”叠加到课程视频上的时间轴驱动渲染器。用户提供主课程视频、讲师小窗视频或头像，通过本地可视化编辑器配置课程信息和时间轴事件，最终导出一条带 AI 战术 HUD 风格界面的 16:9 MP4。

## 🚀 核心亮点

| 能力 | 说明 |
| --- | --- |
| 时间轴驱动 | HUD 状态由主视频时间统一驱动，阶段、任务、地图和提示同步变化。 |
| 游戏化课程界面 | 以轻量科幻、RTS 指挥界面、深色科技和蓝紫能量光构建课程 HUD。 |
| 固定布局优先 | 第一版不做自由拖拽，优先保证成片稳定、清晰、可复用。 |
| 本地渲染 | 使用 React + Remotion 在本地生成无播放器控件的 16:9 MP4。 |
| 配置驱动 | lesson JSON、Zod schema、时间轴状态计算和 Remotion composition 共享同一套数据模型。 |

## 🎬 适用人群

1. 个人课程主理人：把录屏课包装成更有结构感的课程成片。
2. 自媒体知识创作者：为长视频增加学习进度、任务和重点提示。
3. 一人公司和 OPC：用可复用模板降低课程交付成本。
4. 小型后期团队：为客户快速制作统一风格的课程 HUD 包装。

## 🧭 当前状态

项目已完成第 8 阶段：用户真实授权素材验收与发布前视觉 QA。当前默认模板命名为 `default-ai-tactical`，视觉定位为 `AI Tactical HUD` / “AI 战术课程指挥界面”。第 8 阶段使用独立配置 `lesson-01.sample` 跑通真实主课程视频的 preflight、smoke、still、clip 和 full render，输出 `out/lesson-01-sample.mp4`。本阶段不做批量渲染、云端、登录、数据库、AI 自动识别、自动字幕、BGM、降噪、ducking 或复杂剪辑。

已经具备：

1. React + TypeScript + Vite 本地编辑器骨架。
2. Remotion Studio 与 `CourseShellComposition` 渲染入口。
3. `lesson-01.json` 示例配置。
4. Zod schema 校验和编辑器错误列表。
5. 共享 HUD 时间轴状态推导。
6. 可编辑课程信息、讲师信息、素材路径、任务、地图节点和阶段的配置编辑器 MVP。
7. 浏览器下载 `lesson-01.edited.json` 的配置导出能力。
8. 阶段新增、编辑、删除、跳转和“使用当前时间”写入。
9. 时间轴事件新增、编辑、删除、启用/禁用、payload 表单和 active event 高亮。
10. 编辑器画框外 HTML video 控制器，可读取主视频 `currentTime` 和 `duration`。
11. 渲染前检查脚本，主视频缺失作为正式渲染阻断错误。
12. 正式 `render:lesson` 与 8 秒 `render:smoke` 单节课渲染脚本。
13. `deriveHudState` 关键时间点可复跑测试脚本。
14. `render:still` 与 `render:clip` 关键帧/片段验收脚本。
15. `lesson-render-fixture.json` 安全小样配置，以及本地忽略的合成测试素材。
16. `npm test` 聚合 lesson schema、HUD 状态和 preflight 回归测试。
17. `default-ai-tactical` 默认视觉模板 token、Remotion 展示层样式和第 7 阶段模板规格文档。
18. `lesson-01.sample.json` 真实授权素材样片配置。
19. 第 8 阶段真实样片生产说明、QA 报告和问题 backlog。

仍在建设：

1. lesson JSON 导入和可选的本地写回体验探索。
2. 更多真实课程样片的批量前手动验收流程。
3. 编辑器 HUD 与 Remotion HUD 的进一步收敛。
4. 更完整的视觉 QA 截图对照和自动 contact sheet。

## 🛠 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端编辑器 | React, TypeScript, Vite |
| 视频渲染 | Remotion |
| 数据校验 | Zod |
| 配置来源 | 本地 JSON |
| 自动化脚本 | Node.js, tsx |

## 🎨 默认模板

当前默认模板为 `default-ai-tactical`，视觉名为 `AI Tactical HUD`，中文名为“AI 战术课程指挥界面”。

它采用深色科技底板、蓝青/紫色能量状态、金属细边框、斜切角和克制 HUD 发光。模板的核心原则是主视频优先：右侧栏、底部 HUD 和讲师小窗都被压缩为辅助信息层，不遮挡主课程视频核心内容。

视觉变量主要位于 `src/styles/tokens.css`，HUD 状态和 Remotion 展示样式位于 `src/styles/hud.css`。调整颜色、状态、发光或布局尺寸时，优先修改这些 token，不要在组件里散落硬编码颜色。

最终视频合规检查建议：

1. 静态扫描 `src/remotion`，确认没有播放器控件、表单控件或编辑器组件引用。
2. 使用 `render:still` / `render:clip` 输出关键时间点画面，人工确认无播放、暂停、倍速、音量、全屏、拖动滑块或编辑器按钮。
3. 检查主视频是否被右侧栏、底部 HUD 或讲师小窗遮挡。
4. `CourseStageBar` 只能表达课程阶段结构，不得出现播放头、时间码、拖动手柄或连续进度填充。

## ⚡ 快速开始

安装依赖：

```bash
npm install
```

启动本地编辑器：

```bash
npm run dev
```

默认地址：`http://127.0.0.1:5173`

编辑配置：

1. 在右侧属性面板修改课程信息、讲师信息、素材路径、默认重点提示、任务名称、地图节点名称和阶段名称/时间。
2. 在底部“阶段”视图新增、编辑、删除阶段，点击阶段跳转到 `startTime`，或用“开始=当前 / 结束=当前”写入当前视频时间。
3. 在底部“事件”视图新增、编辑、删除 `timelineEvents`，配置事件类型、目标模块、开始/结束时间、优先级、enabled 和 payload。
4. 使用画框外的视频控制器播放、暂停或拖动主视频；主视频缺失时仍可手动输入 `previewTime` 继续配置 HUD。
5. 点击“校验配置”查看 schema 校验结果。
6. 点击“导出配置”下载 `lesson-01.edited.json`。当前“保存配置”按钮不直接写回文件，会提示使用导出配置。

将导出的配置用于渲染：

1. 用导出的 JSON 内容替换 `src/data/lessons/lesson-01.json`，或按后续脚本支持另存为新的 lesson 文件。
2. 运行 `npm run validate:lessons` 确认配置合法。
3. 运行 `npm run test:hud` 检查关键时间点 HUD 状态。
4. 运行 `npm run preflight:render -- lesson-01` 检查主视频、输出目录、时长和时间轴规则。
5. 主视频素材补齐后，运行 `npm run render:lesson -- lesson-01` 渲染正式 MP4。

启动 Remotion Studio：

```bash
npm run studio
```

校验 lesson 配置：

```bash
npm run validate:lessons
```

构建编辑器：

```bash
npm run build
```

渲染测试视频：

```bash
npm run render:sample
```

输出位置：`out/lesson-01-sample.mp4`

第 6 阶段单节课渲染命令：

```bash
npm run preflight:render -- lesson-01
npm run render:smoke -- lesson-01
npm run render:still -- lesson-01
npm run render:clip -- lesson-01 --from 145 --duration 20
npm run render:lesson -- lesson-01
```

`render:smoke` 输出 8 秒 MP4 到 `out/{lessonId}-smoke.mp4`。`render:still` 默认输出关键帧 PNG 到 `out/stills/{lessonId}/`，可用 `--times 36,118,150` 指定秒数。`render:clip` 默认输出 MP4 到 `out/clips/`，可用 `--from` 和 `--duration` 指定片段窗口。`render:lesson` 输出路径来自 lesson 的 `render.outputDir` 与 `render.outputName`，示例为 `out/lesson-01-final.mp4`。

本地安全小样成功路径：

```bash
npm run preflight:render -- lesson-render-fixture
npm run render:smoke -- lesson-render-fixture
npm run render:still -- lesson-render-fixture --times 2,7,10
npm run render:clip -- lesson-render-fixture --from 2 --duration 4
npm run render:lesson -- lesson-render-fixture
```

第 8 阶段真实样片成功路径：

```bash
npm run preflight:render -- lesson-01.sample
npm run render:smoke -- lesson-01.sample
npm run render:still -- lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500
npm run render:clip -- lesson-01.sample --from 236 --duration 20
npm run render:clip -- lesson-01.sample --from 284 --duration 16
npm run render:clip -- lesson-01.sample --from 428 --duration 20
npm run render:clip -- lesson-01.sample --from 480 --duration 22
npm run render:lesson -- lesson-01.sample
```

完整真实样片输出：`out/lesson-01-sample.mp4`。该文件和真实素材均受 `.gitignore` 保护，不提交到 Git。

更完整的启动说明见 [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) 和 [docs/en/GETTING_STARTED.md](docs/en/GETTING_STARTED.md)。

## 📁 目录结构

```text
video-shell/
├─ docs/                 # 中文规格、决策记录、阶段记忆
├─ docs/en/              # 英文门面文档
├─ public/
│  ├─ assets/hud/        # 应用默认 HUD 静态资源
│  └─ input/             # 本地输入素材目录，不提交真实视频
├─ scripts/              # 校验和渲染脚本
├─ src/
│  ├─ components/hud/    # HUD 组件
│  ├─ data/lessons/      # 示例 lesson 配置
│  ├─ editor/            # 本地编辑器
│  ├─ remotion/          # Remotion composition
│  ├─ schemas/           # Zod schema
│  ├─ styles/            # 视觉 token 和样式
│  └─ utils/             # 时间轴状态计算
└─ AGENTS.MD             # 长期项目记忆和 Agent 接手规则
```

## 🛡 素材与安全边界

公开仓库不会提交真实课程素材。以下内容默认被忽略：

1. `node_modules/`
2. `dist/`
3. `out/`
4. `.cache/`
5. `.remotion/`
6. `.obsidian/`
7. `.env` 和 `.env.*`
8. `public/input/videos/*.mp4`
9. `public/input/speakers/*.mp4`
10. `public/input/videos/*.mov`
11. `public/input/speakers/*.mov`
12. `public/input/videos/*.mkv`
13. `public/input/speakers/*.mkv`
14. `public/input/images/*`

素材建议放置位置：

| 类型 | 路径 |
| --- | --- |
| 主课程视频 | `public/input/videos/` |
| 讲师小窗视频 | `public/input/speakers/` |
| 讲师头像 | `public/input/images/` |
| 默认 HUD 资源 | `public/assets/hud/` |

## 🎛 产品边界

本产品是：

1. 时间轴驱动的课程界面渲染器。
2. 16:9 课程视频 HUD 包装工具。
3. 支持手动配置阶段和事件时间点的可视化编辑器。
4. 最终导出 MP4 的本地课程视频生成工具。

本产品不是：

1. 普通剪辑软件。
2. 课程平台。
3. 播放器。
4. 静态遮罩模板。
5. Figma 式自由设计工具。

关键约束：

1. 主视频内容永远是第一优先级。
2. 最终 MP4 中不能出现播放、暂停、倍速、音量、全屏、可拖动进度条等播放器控件。
3. 编辑器中可以出现播放器控件，因为用户需要配置时间点。
4. 底部课程阶段条是学习导航，不是播放器进度条。
5. 第一版采用固定布局和有限配置，不做完全自由拖拽。
6. 第一版必须支持时间轴联动。
7. 本项目默认不使用 Vercel，除非后续明确需要部署或线上验证。

## 🗺 文档地图

### GitHub 门面与入门

- [English README](README.en.md)
- [中文快速开始](docs/GETTING_STARTED.md)
- [English Getting Started](docs/en/GETTING_STARTED.md)
- [English Project Overview](docs/en/PROJECT_OVERVIEW.md)
- [GitHub 首次公开发布说明](docs/GITHUB_RELEASE_NOTES.md)

### 第 0 阶段：产品定义与需求冻结

- [项目产品定义](docs/PROJECT_SPEC.md)
- [MVP 范围冻结](docs/MVP_SCOPE.md)
- [用户工作流](docs/USER_WORKFLOW.md)
- [界面布局规格](docs/INTERFACE_LAYOUT_SPEC.md)
- [时间轴事件规格](docs/TIMELINE_EVENT_SPEC.md)
- [产品决策记录](docs/DECISION_LOG.md)
- [原始需求](docs/raw-requirements.md)

### 第 1 阶段：界面布局与视觉系统设计

- [最终视频布局规格](docs/FINAL_VIDEO_LAYOUT_SPEC.md)
- [编辑器布局规格](docs/EDITOR_LAYOUT_SPEC.md)
- [HUD 组件规格](docs/HUD_COMPONENT_SPEC.md)
- [视觉系统](docs/DESIGN_SYSTEM.md)
- [时间轴联动 UI 规格](docs/TIMELINE_UI_SPEC.md)

### 第 2 阶段：工程架构设计

- [工程架构简报](docs/STAGE_2_ARCHITECTURE_BRIEF.md)
- [技术栈决策](docs/TECH_STACK_DECISION.md)
- [项目目录结构规格](docs/REPO_STRUCTURE_SPEC.md)
- [课程配置数据模型规格](docs/DATA_MODEL_SPEC.md)
- [时间轴数据模型规格](docs/TIMELINE_DATA_MODEL_SPEC.md)
- [编辑器架构规格](docs/EDITOR_ARCHITECTURE_SPEC.md)
- [Remotion 渲染流程规格](docs/RENDER_PIPELINE_SPEC.md)
- [素材文件管理规范](docs/MEDIA_ASSET_SPEC.md)
- [第 2 阶段决策记录](docs/STAGE_2_DECISION_LOG.md)
- [第 2 阶段架构审查](docs/STAGE_2_ARCHITECTURE_REVIEW.md)

### 第 3 阶段：工程骨架搭建

- [第 3 阶段实现说明](docs/STAGE_3_IMPLEMENTATION_NOTES.md)

### 第 4 阶段：数据模型与配置编辑器 MVP

- [第 4 阶段编辑器 MVP 实现说明](docs/STAGE_4_EDITOR_MVP_NOTES.md)
- [第 4 阶段编辑器 MVP 审查报告](docs/STAGE_4_EDITOR_MVP_REVIEW.md)

### 第 5 阶段：时间轴编辑与联动预览

- [第 5 阶段时间轴编辑与联动预览实现说明](docs/STAGE_5_TIMELINE_EDITOR_NOTES.md)
- [第 5 阶段时间轴编辑与联动预览审查报告](docs/STAGE_5_TIMELINE_EDITOR_REVIEW.md)

### 第 6 阶段：本地单节课渲染链路

- [第 6 阶段渲染器说明与交接](docs/STAGE_6_RENDERER_NOTES.md)
- [第 6 阶段渲染器审查报告](docs/STAGE_6_RENDERER_REVIEW.md)

### 第 7 阶段：HUD 视觉精修与模板定稿

- [第 7 阶段 HUD 视觉精修说明](docs/STAGE_7_VISUAL_POLISH_NOTES.md)
- [默认模板规格：default-ai-tactical](docs/STAGE_7_VISUAL_TEMPLATE_SPEC.md)

### 第 8 阶段：真实单课样片生产与 QA

- [第 8 阶段素材缺失报告](docs/STAGE_8_ASSET_MISSING_REPORT.md)
- [第 8 阶段真实单课样片生产说明](docs/STAGE_8_SAMPLE_PRODUCTION_NOTES.md)
- [第 8 阶段真实单课样片 QA 报告](docs/STAGE_8_SAMPLE_QA_REPORT.md)
- [第 8 阶段问题 Backlog](docs/STAGE_8_ISSUE_BACKLOG.md)
- [第 8 阶段真实单课样片生产审查报告](docs/STAGE_8_SAMPLE_PRODUCTION_REVIEW.md)
- [lesson-01 课程脚本与时间节点草稿](docs/sample-lessons/lesson-01-outline.md)

### Agent 协作

- [项目总指挥 Agent 设计](docs/AGENT_ORCHESTRATOR_SPEC.md)
- [长期项目记忆](AGENTS.MD)

## 🤝 贡献

欢迎围绕本地编辑器、时间轴状态计算、Remotion 渲染、HUD 视觉和文档体验提交改进。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📜 License

MIT License. See [LICENSE](LICENSE).

## 🔭 下一阶段建议

1. 进入第 9 阶段：实现 lesson JSON 导入能力，支持导出的配置重新进入编辑器。
2. 增加按 lesson id 和时间点输入的 HUD 状态测试脚本，覆盖 `lesson-01.sample`。
3. 继续合并编辑器预览 HUD 与 Remotion HUD 的无交互展示组件，降低后续漂移风险。
4. 补充 still 自动 contact sheet 和发布前截图对照流程。
5. 准备更完整的讲师长视频素材，单独验收讲师小窗视频链路。

## 第 6 阶段成果记忆

阶段目标：
1. 将第 5 阶段的时间轴联动预览推进到本地单节课 MP4 渲染链路。
2. 建立正式渲染前检查、HUD 状态测试、音频路由和 smoke 渲染命令。
3. 保持最终 Remotion composition 无播放器控件、无编辑器控件。

已完成：
1. 新增 `preflight:render`，检查 lesson schema、画布、输出路径、素材路径、时长、音频策略和 timeline 规则。
2. 新增 `render:lesson`，按 lesson id 读取配置并输出 1920 x 1080 MP4。
3. 新增 `render:smoke`，输出 8 秒 MP4 用于快速检查 composition。
4. 新增 `test:hud`，覆盖 117/118/124/150/248/270/316/340/355 秒等关键 HUD 状态。
5. Remotion composition 已按 `frame / fps` 推导 `currentTime`，复用 `deriveHudState` 渲染主视频、讲师层和 HUD。
6. 第 6 阶段文档已记录渲染命令、素材规则、音频策略、时长规则和已知限制。
7. Course HUD Director Agent 已按渲染工程、数据预检、事实边界和证据验收岗位并行复查，补齐讲师音频、素材 fallback、HUD 显示开关、schema 引用检查和文档事实边界。

关键产物：
1. `scripts/preflight-render.ts`：渲染前检查入口。
2. `scripts/render-lesson.ts`：正式单节课渲染入口。
3. `scripts/render-smoke.ts`：8 秒 smoke 渲染入口。
4. `scripts/test-hud-state.ts`：HUD 状态关键时间点测试。
5. `src/remotion/CourseShellComposition.tsx` 与 `src/remotion/layers/*`：第 6 阶段最终视频 composition。
6. `docs/STAGE_6_RENDERER_NOTES.md`：第 6 阶段渲染器说明与交接。

已冻结决策：
1. 主视频是正式渲染 P0 素材，缺失时 `preflight:render`、`render:smoke` 和 `render:lesson` 均退出非 0。
2. 讲师视频和头像按 `speaker.missingAssetBehavior` 降级；`speaker-only` 音频要求讲师视频存在，并会强制使用讲师视频作为讲师音频来源。
3. 默认音频为 `main-only`；`mix` 会强制使用讲师视频并给出回声风险提示，缺讲师视频时 preflight 会报 error。
4. `mainVideoFitMode` 正式渲染优先读取 `layout.mainVideoFitMode`，默认 `contain`。
5. CourseStageBar 仍是学习导航，不是播放器进度条。
6. 最终画面无控件边界通过代码审查和静态扫描确认，当前 `preflight:render` 不自动证明画面无控件。

后续接手注意：
1. 当前示例 `lesson-01` 主视频仍是占位路径，预检失败是预期行为，不代表渲染链路坏了。
2. `render:sample` 仍可用作开发样片，但不能代表真实素材链路验收。
3. `render:smoke` 只输出 8 秒基础样片，不覆盖后半段关键时间点；关键片段 still 验收留到下一阶段。
4. 当前脚本按 lesson id 读取 `src/data/lessons/{lessonId}.json`，暂不支持 CLI 指定任意 JSON 路径或输出路径。
5. 第 6 阶段未做云端渲染、批量队列、自动字幕、AI 自动识别、多轨剪辑或专业混音。
6. 本次验证通过 `typecheck`、`validate:lessons`、`test:hud`、`build`、`render:sample`、Vite dev 入口、Remotion Studio 入口和 Remotion 控件静态扫描。
7. 第 6 阶段审查整改已补齐安全小样成功路径、`mix` 缺讲师视频 error、still/clip 脚本、编辑器渲染按钮提示、输出覆盖提示和 `npm test` 聚合脚本。

下一阶段建议：
1. 准备用户授权真实主视频、讲师视频和头像，替换 `lesson-01` 并跑通真实课程成功路径。
2. 增加 lesson JSON 导入能力。
3. 收敛编辑器预览 HUD 与 Remotion HUD 的无交互展示组件。
4. 扩展 still/clip 验收说明和发布前检查清单。

## 第 6 阶段审查成果记忆

阶段目标：
1. 根据附件要求审查第 6 阶段本地单节课渲染链路。
2. 按 Course HUD Director Agent 工作流分配渲染工程、事实边界和证据验收岗位。
3. 判断是否允许进入第 7 阶段，并明确必须继承的风险。

已完成：
1. 已审查 `package.json` 渲染脚本、preflight/render/smoke 工具、Remotion composition、媒体层、音频路由、HUD runtime 和编辑器导出衔接。
2. 已运行 `typecheck`、`validate:lessons`、`test:hud`、`build`、`render:sample`、Vite dev、Remotion Studio、正式 preflight/smoke/render 阻断验证和 `src/remotion` 控件静态扫描。
3. 已确认 `render:lesson`、`render:smoke` 会先跑 preflight，当前因占位主视频缺失按预期退出非 0。
4. 已新增正式审查报告，结论为有条件通过，无 P0 阻断项。

关键产物：
1. `docs/STAGE_6_RENDERER_REVIEW.md`：第 6 阶段渲染器审查报告，包含 P0/P1/P2、评分、命令结果、风险清单和第 7 阶段交接建议。

已冻结决策：
1. 第 6 阶段审查结论为有条件通过，允许进入第 7 阶段前置验收与视觉精修准备。
2. 在真实授权素材跑通 `preflight:render`、`render:smoke` 和 `render:lesson` 成功路径前，不能宣称真实素材稳定出片或生产就绪。
3. 当前无最终视频控件边界 P0；`src/remotion` 静态扫描未发现播放器控件、表单控件或编辑器组件。
4. 审查时发现 `audio.mode=mix` 缺讲师视频只 warning 的语义偏弱；整改后已收紧为 error。

后续接手注意：
1. 示例 `lesson-01` 仍使用占位主视频，正式渲染失败是预检保护，不是 Remotion composition 崩溃。
2. `render:sample` 成功只代表开发 fallback 样片，不代表真实素材链路验收。
3. 第 7 阶段需补 still/clip 视觉验收，`test:hud` 只证明状态语义。
4. 编辑器“渲染”按钮仍是旧占位提示，需改为第 6 阶段 CLI 渲染与预检指引。

下一阶段建议：
1. 先补授权安全真实素材，并跑通完整成功路径。
2. 再补 `mix` 预检语义、still/clip 验收和 lesson JSON 导入。
3. 最后做 HUD 展示组件收敛和视觉定稿。

## 第 6 阶段审查整改成果记忆

阶段目标：
1. 解决第 6 阶段审查报告中的 P1/P2 可落地问题。
2. 用本地安全合成素材跑通正式成功出片路径。
3. 保持项目边界：不提交真实课程素材，不引入云端、批量队列或播放器功能。

已完成：
1. `audio.mode=mix` 缺讲师视频已从 warning 收紧为 error，并新增 `test:preflight` 回归测试。
2. 新增 `render:still` 和 `render:clip`，均复用正式 preflight，不绕过主视频阻断。
3. 新增 `lesson-render-fixture.json`，并用本地 FFmpeg 生成 ignored 合成主视频、讲师视频和头像。
4. 已跑通 `preflight:render`、`render:smoke`、`render:still`、`render:clip` 和 `render:lesson` 的 fixture 成功路径。
5. 已用 `ffprobe` 确认 `out/lesson-render-fixture-final.mp4` 为 1920 x 1080、30fps、12 秒。
6. 已更新编辑器“渲染”按钮提示，不再指向旧的第 6 阶段占位文案。
7. 已增加输出覆盖日志和 `npm test` 聚合脚本。
8. Remotion/browser 端素材解析已收紧，不再放行远程 URL、本机绝对路径或 `file:` / `data:` / `blob:`。

关键产物：
1. `scripts/test-preflight-render.ts`：渲染预检回归测试。
2. `scripts/render-still.ts`：关键帧 still 渲染脚本。
3. `scripts/render-clip.ts`：片段 clip 渲染脚本。
4. `src/data/lessons/lesson-render-fixture.json`：第 6 阶段安全小样 lesson 配置。
5. `out/lesson-render-fixture-final.mp4`：本地验证输出，受 `.gitignore` 排除。

已冻结决策：
1. `mix` 必须有讲师视频才能通过正式 preflight。
2. `render:still` / `render:clip` 必须先跑 preflight。
3. 安全小样素材可本地生成用于验收，但不提交到 Git。
4. `lesson-01` 继续保留占位素材语义，等待用户真实授权素材替换。

后续接手注意：
1. `lesson-render-fixture` 证明脚本链路可出片，不代表用户真实课程素材已验收。
2. 生成的 `public/input/videos/stage6-review-main.mp4`、`public/input/speakers/stage6-review-speaker.mp4`、`public/input/images/stage6-review-avatar.png` 均为 ignored 本地素材。
3. 输出 `out/*` 仍不提交。

下一阶段建议：
1. 用用户真实授权素材替换 `lesson-01` 并跑同一组命令。
2. 增加 lesson JSON 导入。
3. 做 HUD 展示组件收敛和视觉定稿。

## 第 3 阶段成果记忆

阶段目标：
1. 搭建可以运行的 React + TypeScript + Vite + Remotion 工程骨架。
2. 跑通 lesson 配置读取、Zod 校验、编辑器预览、Remotion Studio 和测试 MP4 渲染。

已完成：
1. 创建本地编辑器占位页和 AI 战术课程 HUD 视觉骨架。
2. 创建 `CourseShellComposition`、主视频层、讲师层和 HUD 层。
3. 创建 `lesson-01.json` 示例配置、schema 校验和时间轴状态计算。
4. 创建 `validate:lessons`、`typecheck`、`render:sample` 等脚本。
5. 完成命令与页面验收：`typecheck`、`validate:lessons`、`build`、`render:sample`、编辑器页面和 Remotion Studio 均已验证。

关键产物：
1. `package.json`：工程脚本与依赖入口。
2. `src/data/lessons/lesson-01.json`：示例 lesson 配置。
3. `src/schemas/lesson.schema.ts`：Zod schema 和类型定义。
4. `src/utils/timeline.ts`：最小 HUD 时间轴状态计算。
5. `src/editor/`：本地编辑器占位页面。
6. `src/remotion/`：Remotion composition 和视频层。
7. `scripts/validate-lessons.ts`：lesson 校验脚本。
8. `scripts/render-sample.ts`：测试 MP4 渲染脚本。
9. `docs/STAGE_3_IMPLEMENTATION_NOTES.md`：第 3 阶段实现说明。

已冻结决策：
1. 第 3 阶段采用 React + TypeScript + Vite + Remotion + Zod + 本地 JSON + Node scripts。
2. Remotion 相关包固定到 `4.0.477`，避免版本不一致警告。
3. 示例 lesson 同时保留工程字段和附件要求的兼容字段。
4. 样例素材缺失时显示占位，不让编辑器或 composition 直接崩溃。

后续接手注意：
1. `render:sample` 日志中的素材 404 是预期占位 fallback，不代表渲染失败。
2. `npm audit` 当前仍报告 8 个 high severity 依赖项，后续应单独评估，不建议盲目 force fix。
3. Remotion Studio 自带播放器控件，但最终 composition 和导出的 MP4 不包含播放器控件。
4. 当前编辑器按钮和属性面板仍是占位，不具备真实保存和编辑能力。

下一阶段建议：
1. 实现真实配置编辑、保存、素材检查和渲染前检查。
2. 为时间轴状态计算增加测试。
3. 用真实短素材验证主视频、讲师视频、头像 fallback 和导出音频。

## GitHub 公开发布阶段成果记忆

阶段目标：
1. 将项目整理为可公开展示的 GitHub 仓库。
2. 建立中英文门面文档和开源协作说明。

已完成：
1. 将 README 升级为中文公开展示入口。
2. 新增英文 README 与英文入门文档。
3. 新增 MIT License、贡献说明、安全说明和首次公开发布说明。
4. 明确公开仓库上传安全边界。

关键产物：
1. `README.md`：中文 GitHub 项目入口。
2. `README.en.md`：英文 GitHub 项目入口。
3. `docs/en/GETTING_STARTED.md`：英文快速开始。
4. `docs/en/PROJECT_OVERVIEW.md`：英文项目概览。
5. `docs/GITHUB_RELEASE_NOTES.md`：首次公开发布说明。
6. `CONTRIBUTING.md`：贡献说明。
7. `SECURITY.md`：安全与素材隐私说明。
8. `LICENSE`：MIT License。

已冻结决策：
1. GitHub 仓库公开发布。
2. 开源协议采用 MIT。
3. 中文文档继续作为规格和项目记忆主源。
4. 英文版采用独立门面文件，不全量翻译现有中文规格文档。
5. 真实课程视频、讲师视频、客户素材、密钥和本地 Obsidian 配置不得提交。

后续接手注意：
1. 如果后续新增核心中文规格文档，README 文档地图需要同步更新。
2. 如果英文门面承诺发生变化，需要同步检查中文 README、`README.en.md` 和 `docs/en/*`。
3. 上传前必须再次运行密钥扫描和 ignore 检查。

下一阶段建议：
1. 完成 GitHub 远端发布后，在仓库 About 中补充 description、topics 和 website。
2. 后续如准备吸引外部贡献者，可再补 issue template、PR template 和示例截图。

## 第 4 阶段成果记忆

阶段目标：
1. 将编辑器从占位页推进到可编辑 lesson 配置的 MVP。
2. 支持核心课程信息、素材路径、讲师信息、任务、地图节点、阶段名称和阶段时间的表单编辑。
3. 打通 schema 校验、错误提示、配置导出和预览即时更新。

已完成：
1. 新增 editor state，编辑器启动时从 `lesson-01.json` 初始化草稿状态。
2. 右侧属性面板支持编辑课程、讲师、素材、默认重点提示、任务、地图、阶段和布局开关。
3. 底部阶段配置区支持编辑阶段名称、`startTime`、`endTime`，并通过 `previewTime` 驱动 active stage。
4. 顶部工具栏支持校验、导出、保存占位、预览刷新和渲染占位。
5. 导出配置会先校验，校验通过后下载格式化的 `lesson-01.edited.json`。
6. schema 已收紧任务 label、阶段 label、阶段时间顺序、阶段重叠和课程序号校验。
7. Remotion 继续读取同一份 lesson 结构，最终 composition 未引入播放器控件或编辑器控件。

关键产物：
1. `src/editor/state/editorState.ts`：编辑器草稿、校验、导出状态。
2. `src/editor/utils/validateEditorLesson.ts`：编辑器 schema 校验和错误路径映射。
3. `src/editor/utils/exportLesson.ts`：lesson 导出和 fit mode 字段规范化。
4. `src/editor/PropertyPanel.tsx`：第 4 阶段核心配置表单。
5. `src/editor/TimelinePanel.tsx`：简化阶段配置和校验视图。
6. `docs/STAGE_4_EDITOR_MVP_NOTES.md`：第 4 阶段实现说明、限制和后续建议。
7. `docs/STAGE_4_EDITOR_MVP_REVIEW.md`：第 4 阶段审查报告，结论为有条件通过。

已冻结决策：
1. 第 4 阶段优先支持“导出配置”，不直接写回本地文件。
2. 保存按钮只提示使用导出配置，不引入后端、数据库或复杂本地写文件链路。
3. 渲染按钮保持占位提示，第 6 阶段再完善完整渲染流程。
4. 任务、地图节点、阶段第一版固定数量，只编辑名称和简单时间。
5. 编辑器预览画框内继续只放最终视频内容和 HUD，不放播放器控件。

后续接手注意：
1. 当前浏览器端不检查素材文件是否真实存在；素材缺失仍由预览和 Remotion fallback 占位承接。
2. `lesson-01.edited.json` 需要手动替换 `src/data/lessons/lesson-01.json` 后再用于现有渲染脚本。
3. `timelineEvents` 暂未进入可编辑表单，第 5 阶段应优先补简化事件编辑。
4. Remotion `HudLayer` 仍是内联 HUD 实现，和编辑器共享组件尚未完全合并。
5. 第 4 阶段审查结论为“有条件通过”，进入第 5 阶段前建议先处理加载失败提示、字段级错误定位和表单拆分。

下一阶段建议：
1. 增加导入配置能力。
2. 增加素材路径检查脚本和编辑器素材状态校验。
3. 实现第 5 阶段简化时间轴事件编辑。
4. 为 `deriveHudState` 增加单元测试。
5. 逐步统一编辑器预览 HUD 与 Remotion HUD 组件。

## 第 5 阶段成果记忆

阶段目标：
1. 将第 4 阶段配置编辑器升级为“时间轴编辑与联动预览 MVP”。
2. 支持主视频 currentTime / previewTime 驱动 HUD 状态变化。
3. 支持课程阶段和时间轴事件的新增、编辑、删除、跳转和导出。

已完成：
1. 新增编辑器画框外 `VideoPreviewController`，支持播放、暂停、拖动、读取视频时长和主视频缺失提示。
2. 阶段视图支持新增、编辑、删除、点击跳转、active stage 高亮，以及“开始=当前 / 结束=当前”。
3. 事件视图支持新增、编辑、删除、启用/禁用、type、targetComponent、startTime、endTime、priority 和 payload 表单。
4. `src/utils/timeline.ts` 重写为共享 HUD 状态推导，覆盖阶段、地图、任务、提示、能力解锁、总结和作业提醒。
5. `src/schemas/lesson.schema.ts` 增强第 5 阶段事件类型、payload、时间、引用和唯一性校验。
6. `lesson-01.json` 示例事件升级到第 5 阶段事件口径，并覆盖 `tip_show`、`warning_show`、`task_done`、`ability_unlock`、`summary_show`、`homework_show`。
7. 中央 16:9 最终视频画框内不保留真实 `button/input/select/video[controls]` 控件，播放器控制仍在画框外。
8. 新增 `docs/STAGE_5_TIMELINE_EDITOR_NOTES.md`。

关键产物：
1. `src/editor/timeline/VideoPreviewController.tsx`：编辑器外层视频 currentTime 同步控制器。
2. `src/editor/TimelinePanel.tsx`：阶段与事件编辑主面板。
3. `src/utils/eventRules.ts`：事件类型、目标模块和 payload 默认值规则。
4. `src/utils/timeFormat.ts`：时间格式化、解析和 clamp 工具。
5. `src/utils/timeline.ts`：编辑器和 Remotion 共享的 HUD runtime state 推导。
6. `src/schemas/lesson.schema.ts`：第 5 阶段 schema 校验。
7. `docs/STAGE_5_TIMELINE_EDITOR_NOTES.md`：第 5 阶段实现说明和交接文档。

已冻结决策：
1. 第 5 阶段采用附件事件名作为新建和示例配置口径，同时兼容读取旧规格事件名。
2. 显示型事件 `tip_show`、`warning_show`、`summary_show`、`homework_show` 必须有 `endTime` 或 `duration`。
3. `ability_unlock` 的能力解锁状态在 `startTime` 后持续生效，但底部短提示遵守自身 `endTime`。
4. 旧的持久任务/地图事件不会压过后来阶段的默认联动；如果当前阶段内存在同类手动事件，则手动事件优先。
5. 编辑器交互层不得进入 Remotion composition；最终视频仍不包含播放器控件。

后续接手注意：
1. 浏览器端仍不直接检查素材文件存在性，主视频占位路径会触发视频加载失败提示，但不阻断手动配置。
2. `render:sample` 仍不足以覆盖后半段事件，需要后续补 Remotion still 或关键片段验收。
3. `PropertyPanel.tsx` 仍偏大，第 6 阶段建议拆成更小的表单模块。
4. 当前没有正式 test 脚本；本阶段通过 `tsx` 抽查关键时间点，后续应沉淀为自动化测试。
5. Remotion `HudLayer` 仍是内联实现，后续收敛时只能复用无交互展示组件，不能引用编辑器选择层。

下一阶段建议：
1. 增加素材路径检查脚本和渲染前检查清单。
2. 增加 lesson JSON 导入能力。
3. 建立 `deriveHudState` 单元测试。
4. 增加 Remotion still/片段验收脚本。
5. 逐步收敛编辑器预览 HUD 与 Remotion HUD 展示组件。

## 第 5 阶段审查成果记忆

阶段目标：
1. 审查第 5 阶段“时间轴编辑与联动预览 MVP”是否符合第 0-4 阶段产品、设计、架构和编辑器要求。
2. 验证编辑器、schema、HUD runtime、Remotion composition 和最终视频无播放器控件边界。
3. 判断是否允许进入第 6 阶段。

已完成：
1. 启动 Course HUD Director Agent，以事实边界、前端编辑器、数据模型、教学 HUD、证据验收等岗位并行审查。
2. 阅读附件要求和第 0-5 阶段核心文档。
3. 审查 `src/editor`、`src/utils`、`src/schemas`、`src/remotion`、`src/components/hud` 和 `lesson-01.json`。
4. 运行 `npm run typecheck`、`npm run validate:lessons`、`npm run render:sample`、`npm run dev -- --port 5179`、`npm run studio -- --port 3011` 和 `npm run build`。
5. 新增第 5 阶段正式审查报告，结论为有条件通过。

关键产物：
1. `docs/STAGE_5_TIMELINE_EDITOR_REVIEW.md`：第 5 阶段正式审查报告，包含评分、P0/P1/P2、命令结果、风险清单和第 6 阶段建议。

已冻结决策：
1. 第 5 阶段允许进入第 6 阶段，当前无 P0 阻断项。
2. 最终 Remotion composition 未发现播放器控件，编辑器控件仍必须留在画框外或 editor-only 点选层内，不得进入 Remotion。
3. 第 6 阶段不得扩大产品边界，应优先补素材检查、渲染前检查、JSON 导入、`deriveHudState` 自动化测试和关键时间点 Remotion 验收。
4. `stage_change`、`targetComponent` 和 payload 同步字段语义需要在第 6 阶段优先冻结。

后续接手注意：
1. 重点 P1 包括 schema 交叉引用校验不足、`stage_change` 未驱动阶段状态、`targetComponent` runtime 归属不一致、preview duration fallback 不统一、右侧阶段时间编辑不排序。
2. `render:sample` 通过但仍有占位素材 404，不能代表真实素材链路完成。
3. 当前没有 `lint` / `test` 脚本，时间轴状态推导仍缺正式自动化测试。
4. 文档中涉及“tsx 抽查关键时间点”的说法应在后续改为可复跑脚本或降级为临时抽查说明。

下一阶段建议：
1. 先补 `deriveHudState` 单元测试，再修 `stage_change`、`targetComponent` 和 payload 消费规则。
2. 增加素材检查脚本和渲染前检查清单。
3. 增加 lesson JSON 导入能力。
4. 增加 Remotion still/片段验收脚本。
5. 收敛编辑器和 Remotion 的无交互 HUD 展示组件。

## 第 7 阶段成果记忆

阶段目标：
1. 按 Course HUD Director Agent 工作流推进 HUD 视觉精修与默认模板定稿。
2. 将最终视频视觉收敛为 `default-ai-tactical` / `AI Tactical HUD` / “AI 战术课程指挥界面”。
3. 保持第 0-6 阶段边界：本地、单节课、手动配置、最终 MP4 无播放器控件，且主视频内容永远优先。

已完成：
1. 启动 Course HUD Director Agent，并将事实边界、UI 视觉、渲染证据验收分配给对应岗位 Agent 并行审查。
2. 新增第 7 阶段视觉 token、状态色、发光、布局尺寸和 render 模式 HUD 样式。
3. 调整 Remotion 最终画面布局：扩大主视频区域、收窄右侧辅助栏、压低底部 HUD 存在感。
4. 将 Remotion `HudLayer`、`MainVideoLayer` 和 `SpeakerLayer` 收敛到 class 驱动展示样式，减少内联视觉散落。
5. 同步编辑器 16:9 预览槽位，使编辑器预览更接近默认模板安全区。
6. 新增第 7 阶段视觉精修说明和默认模板规格文档。
7. 使用 `lesson-render-fixture` 输出 still 画面抽查，确认默认模板在安全小样下无播放器控件、无编辑器控件、主视频优先。

关键产物：
1. `docs/STAGE_7_VISUAL_POLISH_NOTES.md`：第 7 阶段视觉精修说明、边界和后续建议。
2. `docs/STAGE_7_VISUAL_TEMPLATE_SPEC.md`：`default-ai-tactical` 默认模板规格。
3. `src/styles/tokens.css`：默认模板视觉 token、状态色和布局变量。
4. `src/styles/hud.css`：最终视频 HUD 展示样式和组件状态。
5. `src/styles/editor.css`：编辑器预览槽位与最终模板安全区同步。
6. `src/remotion/layers/HudLayer.tsx`：Remotion 纯展示 HUD 层。
7. `src/remotion/layers/MainVideoLayer.tsx`：主视频视觉外壳。
8. `src/remotion/layers/SpeakerLayer.tsx`：讲师小窗和身份卡视觉外壳。

已冻结决策：
1. 第一套默认模板固定命名为 `default-ai-tactical`。
2. 第 7 阶段只做视觉精修和模板定稿，不做真实课程样片、批量渲染、云端、登录、数据库、AI 自动识别、自动字幕、多主题市场或自由拖拽设计器。
3. `lesson-render-fixture` 只能证明本地安全小样视觉链路，不代表用户真实课程素材验收。
4. `CourseStageBar` 继续是学习导航，不是播放器进度条；不得出现播放头、拖动手柄、时间码或连续进度填充。
5. Remotion composition 不得引用编辑器组件、播放器控件、表单控件或交互暗示。

后续接手注意：
1. `lesson-01` 仍使用占位主视频路径，正式 preflight/render 失败是预期保护。
2. 真实课程素材验收应放到下一阶段，替换 `lesson-01` 后再跑 preflight、smoke、still、clip 和 full render。
3. 第 7 阶段重点统一视觉 token 和最终展示层，编辑器 HUD 与 Remotion HUD 仍未完全组件合并。
4. 继续改视觉时优先改 `src/styles/tokens.css` 与 `src/styles/hud.css`，不要在 Remotion 组件里散落硬编码颜色。
5. 新增或修改最终视频组件时必须继续扫描 `src/remotion`，确认没有控件或 editor-only 引用。

下一阶段建议：
1. 进入第 8 阶段：用户真实授权素材验收与发布前视觉 QA。
2. 准备真实主视频、讲师视频和头像，但不要提交素材。
3. 替换 `lesson-01` 后跑通 `preflight:render`、`render:smoke`、`render:still`、`render:clip` 和 `render:lesson`。
4. 建立真实单课样片验收记录，重点检查主视频遮挡、音频、关键时间点和最终无控件。
5. 继续推进 lesson JSON 导入和 HUD 展示组件收敛。

## 第 8 阶段成果记忆

阶段目标：
1. 启动 Course HUD Director Agent，按岗位分工执行真实授权素材验收与发布前视觉 QA。
2. 使用用户提供的真实主课程视频，创建独立样片配置并跑通 preflight、smoke、still、clip 和 full render。
3. 保持项目边界：本地单节课、手动配置、最终 MP4 无播放器控件，不引入云端、批量、自动字幕或复杂剪辑。

已完成：
1. 建立并确认真实素材目录：`public/input/videos/`、`public/input/speakers/`、`public/input/images/`、`public/assets/hud/` 和 `docs/sample-lessons/`。
2. 用户提供真实素材后，识别实际文件：`lesson-01-main.mp4.mp4` 与 `lesson-01-speaker.mp4.mp4`。
3. 从 9.7 秒讲师视频首帧派生头像 `public/input/images/lesson-01-speaker-avatar.png`，样片采用头像小窗与 `main-only` 音频。
4. 新增 `src/data/lessons/lesson-01.sample.json`，配置《人类简史》真实单课样片、5 个阶段和关键时间轴事件。
5. 跑通 `validate:lessons`、`typecheck`、`preflight:render`、`render:smoke`、12 张 still、4 段 clip 和完整 `render:lesson`。
6. `ffprobe` 确认 `out/lesson-01-sample.mp4` 为 H.264、1920 x 1080、30 fps、约 504 秒，并包含 AAC 双声道音频。
7. 静态扫描 `src/remotion` 未发现播放器控件、表单控件或 editor-only 组件引用。
8. 新增第 8 阶段生产说明、QA 报告、问题 backlog，并更新素材缺失报告状态和 lesson outline。
9. 完成第 8 阶段真实单课样片生产审查，结论为有条件通过，无 P0 阻断项。

关键产物：
1. `src/data/lessons/lesson-01.sample.json`：第 8 阶段真实素材样片配置。
2. `docs/STAGE_8_SAMPLE_PRODUCTION_NOTES.md`：真实样片生产说明、素材策略、命令和输出记录。
3. `docs/STAGE_8_SAMPLE_QA_REPORT.md`：真实样片 QA 报告、ffprobe 结果和控件边界检查。
4. `docs/STAGE_8_ISSUE_BACKLOG.md`：第 8 阶段遗留问题与后续建议。
5. `docs/STAGE_8_SAMPLE_PRODUCTION_REVIEW.md`：第 8 阶段审查报告，包含评分、P0/P1/P2、命令结果、样片质量结论和第 9 阶段放行意见。
6. `docs/sample-lessons/lesson-01-outline.md`：基于真实视频观察整理的课程阶段与事件草稿。
7. `out/lesson-01-sample.mp4`：本地真实样片输出，受 `.gitignore` 排除。

已冻结决策：
1. 第 8 阶段真实样片使用独立 lesson id `lesson-01.sample`，不直接覆盖原 `lesson-01.json`。
2. 讲师视频短于主视频时，采用头像 fallback 和 `main-only` 音频，不能声称长讲师视频小窗链路已验收。
3. 用户真实素材和渲染产物继续不提交到 Git。
4. `homework_show` 属于 HUD 教学设计，不是源视频字幕原文，正式发布前应由课程主理人确认。
5. `lesson-01.sample` 真实样片验收通过，不代表批量生产、云端渲染、AI 自动识别、自动字幕、BGM、降噪或 ducking 已完成。
6. 第 8 阶段审查结论为有条件通过；第 9 阶段可以进入导入、测试泛化、QA 自动化和批量前准备，但不建议直接进入正式批量生产。

后续接手注意：
1. 用户素材文件名为 `.mp4.mp4` 双后缀，配置按实际路径引用，没有移动或重命名原文件。
2. 讲师视频实际放在 `public/input/videos/`，不是建议的 `public/input/speakers/`。
3. `lesson-01.sample.json` 的阶段和事件来自画面观察，不是完整逐字稿，后续需课程主理人复核。
4. `npm run test:hud` 仍主要覆盖原 `lesson-01.json` 关键点，`lesson-01.sample` 目前依赖 still/clip 验收。
5. 主视频源为 1280 x 720，最终输出为 1920 x 1080，清晰度上限受源文件影响。

下一阶段建议：
1. 进入第 9 阶段：实现 lesson JSON 导入能力。
2. 增加按 lesson id 输入的 HUD 状态测试脚本，覆盖真实样片关键时间点。
3. 自动生成 still contact sheet，减少人工逐张打开成本。
4. 准备更完整的讲师长视频素材，单独验收讲师小窗视频链路。
5. 继续收敛编辑器预览 HUD 与 Remotion HUD 的无交互展示组件。
