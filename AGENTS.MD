# AGENTS.MD

## 项目记忆

项目名称：视频课程套壳。

一句话定义：简单方便的时间轴课程 HUD 渲染工具。

核心定位：这是一个面向 OPC、一人公司、个人课程主理人、自媒体课程创作者和小型后期制作人员的本地视频课程 HUD 渲染工具。用户提供主课程视频、讲师小窗视频或头像，通过可视化编辑器填写课程信息、配置时间节点和界面内容，系统最终渲染生成一条带游戏化课程 HUD 界面的 16:9 MP4 视频。

核心产品定义：

> 一个时间轴驱动的课程界面渲染器。

## 长期协作规则

每完成一个阶段的工作，必须执行以下收尾动作：

1. 更新 README.md，记录该阶段的完成状态、成果摘要、关键产物、文档地图变化和下一阶段建议。
2. 更新 AGENTS.MD，写入阶段总结、关键决策、交接注意事项和后续 Agent 必须继承的项目记忆。
3. 如果新增、删除或重命名 docs 下的核心文档，README.md 的文档地图和推荐阅读顺序必须同步更新。
4. 如果产品边界、MVP 范围、视觉方向、数据模型、技术栈或执行流程发生变化，AGENTS.MD 必须明确记录。
5. 阶段总结要可执行，避免空泛描述。优先说明“已确定什么、产出了什么、下一步接手看哪里”。

## 阶段收尾模板

每完成一个阶段，必须在 README.md 与 AGENTS.MD 中同步留下以下信息：

```markdown
## 第 N 阶段成果记忆

阶段目标：
1. ...

已完成：
1. ...

关键产物：
1. `path/to/file.md`：用途说明。

已冻结决策：
1. ...

后续接手注意：
1. ...

下一阶段建议：
1. ...
```

README.md 负责面向人和新 Agent 的项目入口；AGENTS.MD 负责长期记忆、阶段决策和后续 Agent 必须继承的上下文。

## 当前阶段总结

截至当前，项目已完成：

1. 第 0 阶段：产品定义与 MVP 范围冻结。
2. 第 1 阶段：界面布局与视觉系统设计规格。
3. 第 2 阶段：工程架构设计。
4. 第 3 阶段：工程骨架搭建。
5. Agent 协作设计：Course HUD Director Agent 总指挥工作流。

当前已创建 React + TypeScript + Vite + Remotion 工程骨架。

当前建议下一步由 Course HUD Director Agent 接管，进入第 4 阶段：编辑器与渲染链路功能打磨。

GitHub 公开发布决策：

1. 仓库名：`video-shell`。
2. 仓库可见性：公开仓库。
3. 开源协议：MIT。
4. 中文文档继续作为规格和项目记忆主源。
5. 英文文档采用独立门面文件：`README.en.md` 与 `docs/en/*`。
6. 不提交真实课程视频、讲师视频、客户素材、密钥、本地 Obsidian 配置、构建产物或渲染产物。

## 已冻结的核心边界

1. 本产品不是普通剪辑软件。
2. 本产品不是课程平台。
3. 本产品不是播放器。
4. 本产品不是静态遮罩模板。
5. 本产品不是 Figma 式自由设计工具。
6. 最终 MP4 中不能出现播放、暂停、倍速、音量、全屏、可拖动播放器进度条等播放器控件。
7. 编辑器中可以出现播放器控件，因为用户需要通过播放器配置时间点。
8. 底部课程阶段条是学习导航，不是播放器进度条。
9. 主视频内容永远是第一优先级，HUD 只能辅助学习。
10. 第一版采用固定布局，不做完全自由拖拽。
11. 第一版必须支持时间轴联动。
12. 本项目默认不使用 Vercel，除非后续明确要求部署或线上验证。

## 第 1 阶段成果记忆

第 1 阶段已产出界面布局与视觉系统设计规格：

1. `docs/FINAL_VIDEO_LAYOUT_SPEC.md`：最终导出视频的 16:9 HUD 布局规格。
2. `docs/EDITOR_LAYOUT_SPEC.md`：本地可视化编辑器页面结构。
3. `docs/HUD_COMPONENT_SPEC.md`：TopHeader、MainVideoFrame、LecturerMiniCard、WarningPanel、TaskTracker、ChapterMap、CourseStageBar、BottomStatusHud 组件规格。
4. `docs/DESIGN_SYSTEM.md`：课程 HUD 视觉系统。
5. `docs/TIMELINE_UI_SPEC.md`：时间轴联动 UI 配置与最终视频表现。

第 1 阶段已冻结的 UI 方向：

1. 最终视频以 16:9、1920 x 1080 为设计基准。
2. 视觉方向为“AI 战术课程 HUD”：轻量科幻、RTS 指挥界面感、深色科技、蓝紫能量光、金属细边框、克制高级。
3. 右侧辅助栏默认承载课程地图、任务追踪和重点提示。
4. 底部课程阶段条使用阶段段块、节点、连接线和状态标记表达学习导航，不使用播放器式进度填充。
5. 重点提示默认固定在右侧 WarningPanel，避免遮挡主视频。
6. 编辑器预览画框内尽量只显示最终视频内容，播放器控件放在画框外。
7. 时间轴 UI 使用阶段表和事件表，不做专业剪辑软件式多轨时间线。
8. HUD 动效只用于表达状态变化，不做持续装饰动画。

## 后续 Agent 接手建议

新 Agent 接手时优先阅读：

1. `README.md`。
2. `docs/PROJECT_SPEC.md`。
3. `docs/MVP_SCOPE.md`。
4. `docs/AGENT_ORCHESTRATOR_SPEC.md`。
5. 与任务相关的第 1 阶段设计规格文档。

后续建议启动 Course HUD Director Agent，进入产品与数据模型冻结、编辑器原型、前端实现和 Remotion 渲染链路设计。

## Course HUD Director Agent 记忆

总指挥 Agent 使用规则：

1. `Course HUD Director Agent` 是项目总指挥，负责拆分任务、派发执行 Agent、合并结果、做取舍和推进验证。
2. 总指挥默认使用 `Superpowers` 做计划、并行调度、执行和完成前验证。
3. 产品与 UX 使用 `Product Design`。
4. UI 视觉使用 `Figma 工具`，展示材料可辅助使用 `Canva 工具`。
5. 前端实现使用 `Build Web Apps`。
6. MP4 渲染使用 `Remotion 工具`。
7. 本地页面、交互和截图验收使用 `Browser`。
8. 不使用 `Vercel`，除非用户后续明确要求。

本地可复用 Agent：

1. `教学设计专家`：课程结构、学习任务、用户成功路径。
2. `事实边界审稿人`：需求边界、功能承诺、MVP 收敛。
3. `短视频剪辑教练`：视频导出质量、成片观感、平台规格。
4. `证据与截图验收员`：截图、交互、验收证据。
5. `资料包文档生成师`：文档、检查表、交接资料。
6. `录制运营管家`：执行台、进度、SOP。

本地暂无完全对应的岗位可用 `worker` 临时扮演：

1. Data Model Agent。
2. Frontend Agent。
3. Render Engineering Agent。
4. UI Visual Agent。

## 第 3 阶段成果记忆

阶段目标：
1. 初始化 React + TypeScript + Vite + Remotion 工程骨架。
2. 建立 lesson 示例配置、Zod schema、时间轴状态计算、编辑器占位页和 Remotion composition。
3. 跑通本地编辑器、Remotion Studio、lesson 校验和测试 MP4 渲染。

已完成：
1. 创建 `package.json`、`tsconfig.json`、`vite.config.ts`、`remotion.config.ts` 和 `.gitignore`。
2. 创建 `src/data/lessons/lesson-01.json`，包含附件要求的 `meta.canvas`、`media.speakerVideo`、`media.speakerImage`、`useSpeakerVideo`、`mainVideoFitMode` 和布局兼容字段。
3. 创建 `src/schemas/lesson.schema.ts`，校验 1920 x 1080、fps、lessonIndex、totalLessons、阶段递增、事件时间和事件类型。
4. 创建 `src/utils/timeline.ts`，提供 `getCurrentStage`、`getStageStatus`、`getActiveEvents`、`deriveHudState`。
5. 创建 `src/editor/` 本地编辑器占位页面，预览控制放在 16:9 最终视频画框外。
6. 创建 `src/components/hud/` 共享 HUD 占位组件。
7. 创建 `src/remotion/` 渲染入口和 `CourseShellComposition`。
8. 创建 `scripts/validate-lessons.ts` 和 `scripts/render-sample.ts`。
9. 创建 `docs/STAGE_3_IMPLEMENTATION_NOTES.md`。

关键产物：
1. `src/data/lessons/lesson-01.json`：第 3 阶段示例 lesson 配置。
2. `src/schemas/lesson.schema.ts`：当前唯一 schema 与核心类型定义。
3. `src/utils/timeline.ts`：编辑器和 Remotion 共享的 HUD 状态计算入口。
4. `src/editor/App.tsx`：本地编辑器入口。
5. `src/remotion/Root.tsx`：Remotion Studio 入口。
6. `src/remotion/CourseShellComposition.tsx`：最终视频 composition。
7. `out/lesson-01-sample.mp4`：本地测试渲染产物，受 `.gitignore` 排除。
8. `docs/STAGE_3_IMPLEMENTATION_NOTES.md`：实现说明、限制和下一阶段建议。

已冻结决策：
1. 第 3 阶段不做完整编辑器，只搭可运行骨架。
2. Remotion composition 名称固定为 `CourseShellComposition`。
3. 画布固定为 1920 x 1080，默认 30 FPS。
4. Remotion 相关包固定为 `4.0.477`，避免版本不一致。
5. 示例素材路径允许缺失，编辑器和 composition 必须显示占位状态。
6. 最终 composition 不渲染播放、暂停、倍速、音量、全屏、可拖动进度条或编辑器选中框。
7. Remotion Studio 自带控制条只属于开发工具 UI，不属于最终 MP4。

后续接手注意：
1. `npm run dev` 默认打开 `http://127.0.0.1:5173`。
2. `npm run studio` 默认由 Remotion 打开 Studio；本次验收使用端口 `3001`。
3. `npm run render:sample` 输出 `out/lesson-01-sample.mp4`。
4. 当前 `render:sample` 中素材 404 是占位素材缺失导致的预期 fallback，不是渲染失败。
5. `npm audit` 当前报告 8 个 high severity 依赖审计项，后续需要单独评估。
6. 当前编辑器按钮、属性面板和时间轴表格为占位状态，下一阶段再接真实编辑与保存。

下一阶段建议：
1. 实现 lesson 配置的真实编辑、保存和导入导出。
2. 增加素材路径检查脚本，区分主视频阻断错误和讲师/头像降级警告。
3. 给 `deriveHudState` 增加测试，覆盖阶段、任务、地图、提示和短时事件消失。
4. 准备一组真实小体积测试素材，验证主视频音频、讲师视频和头像 fallback。
5. 合并编辑器预览 HUD 与 Remotion HUD 的重复实现，降低后续漂移风险。

## GitHub 公开发布阶段成果记忆

阶段目标：
1. 将项目整理为可公开展示的 GitHub 仓库。
2. 建立中英文项目说明体系。
3. 明确公开上传前的素材、密钥和本地配置安全边界。

已完成：
1. `README.md` 已升级为中文 GitHub 项目门面。
2. 新增 `README.en.md`、`docs/en/GETTING_STARTED.md` 和 `docs/en/PROJECT_OVERVIEW.md` 作为英文门面文档。
3. 新增 `docs/GETTING_STARTED.md` 补齐中文快速开始。
4. 新增 `LICENSE`，采用 MIT License。
5. 新增 `CONTRIBUTING.md` 和 `SECURITY.md`。
6. 新增 `docs/GITHUB_RELEASE_NOTES.md` 记录首次公开发布说明。
7. `.gitignore` 已补充 `.obsidian/`、`.env`、`.env.*`。

关键产物：
1. `README.md`：中文公开项目入口。
2. `README.en.md`：英文公开项目入口。
3. `docs/GETTING_STARTED.md`：中文快速开始。
4. `docs/en/GETTING_STARTED.md`：英文快速开始。
5. `docs/en/PROJECT_OVERVIEW.md`：英文项目概览。
6. `docs/GITHUB_RELEASE_NOTES.md`：首次公开发布说明。
7. `CONTRIBUTING.md`：贡献说明。
8. `SECURITY.md`：安全和素材隐私说明。
9. `LICENSE`：MIT License。

已冻结决策：
1. GitHub 仓库以公开方式发布。
2. 仓库名采用 `video-shell`。
3. 开源协议采用 MIT。
4. 英文版范围为门面英文版，不全量翻译现有中文规格文档。
5. 文档结构采用独立英文文件，不在同一个文档中中英并排。
6. `package.json` 的 `"private": true` 保留，表示不发布到 npm，不影响 GitHub 公开仓库。

后续接手注意：
1. 公开仓库发布前必须运行密钥扫描和 ignore 检查。
2. `gh` 需要完成登录后才能创建远端仓库并 push。
3. 如果新增、删除或重命名 docs 下的核心文档，README 文档地图必须同步更新。
4. 如果英文门面承诺发生变化，需要同步检查中文 README 和 `docs/en/*`。
5. 真实课程素材和客户文件只能放在本地忽略目录，不得提交。

下一阶段建议：
1. 完成 GitHub 远端发布后，在 GitHub About 中设置 description 和 topics。
2. 补充项目截图或 GIF，用于公开仓库首页展示。
3. 后续准备 issue template、PR template 和更完整的英文规格摘要。
