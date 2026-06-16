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

项目已进入第 3 阶段：工程骨架搭建。

已经具备：

1. React + TypeScript + Vite 本地编辑器骨架。
2. Remotion Studio 与 `CourseShellComposition` 渲染入口。
3. `lesson-01.json` 示例配置。
4. Zod schema 校验。
5. 最小时间轴状态计算。
6. HUD 组件占位实现。
7. 测试 MP4 渲染脚本。

仍在建设：

1. 真实配置编辑、保存、导入和导出。
2. 素材路径检查和渲染前检查。
3. 完整时间轴状态测试。
4. 真实课程素材下的成片验收。
5. 编辑器 HUD 与 Remotion HUD 的进一步收敛。

## 🛠 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端编辑器 | React, TypeScript, Vite |
| 视频渲染 | Remotion |
| 数据校验 | Zod |
| 配置来源 | 本地 JSON |
| 自动化脚本 | Node.js, tsx |

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

### Agent 协作

- [项目总指挥 Agent 设计](docs/AGENT_ORCHESTRATOR_SPEC.md)
- [长期项目记忆](AGENTS.MD)

## 🤝 贡献

欢迎围绕本地编辑器、时间轴状态计算、Remotion 渲染、HUD 视觉和文档体验提交改进。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📜 License

MIT License. See [LICENSE](LICENSE).

## 🔭 下一阶段建议

1. 实现 lesson 配置的真实编辑、保存和导入导出。
2. 增加素材路径检查脚本，区分主视频阻断错误和讲师/头像降级警告。
3. 给 `deriveHudState` 增加测试，覆盖阶段、任务、地图、提示和短时事件消失。
4. 准备一组真实小体积测试素材，验证主视频音频、讲师视频和头像 fallback。
5. 合并编辑器预览 HUD 与 Remotion HUD 的重复实现，降低后续漂移风险。

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
