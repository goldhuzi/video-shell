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
5. 第 4 阶段：数据模型与配置编辑器 MVP。
6. 第 5 阶段：时间轴编辑与联动预览 MVP。
7. 第 5 阶段审查：时间轴编辑与联动预览审查，有条件通过。
8. 第 6 阶段：本地单节课渲染链路。
9. 第 6 阶段审查：本地单节课渲染链路审查，有条件通过。
10. Agent 协作设计：Course HUD Director Agent 总指挥工作流。

当前已创建 React + TypeScript + Vite + Remotion 工程骨架，完成可编辑 lesson 配置的编辑器 MVP，完成简化时间轴阶段/事件编辑与 HUD 联动预览，并接入第 6 阶段本地单节课渲染链路。第 6 阶段审查结论为有条件通过，当前无 P0 阻断项；审查整改已补齐安全小样成功出片、`mix` 预检收紧、still/clip 脚本和 `npm test` 聚合。

当前建议下一步由 Course HUD Director Agent 接管，准备用户授权真实素材，替换 `lesson-01` 占位路径，并用已验证的第 6 阶段命令跑通真实课程素材路径，再进入第 7 阶段：lesson JSON 导入、HUD 展示组件收敛、视觉定稿和发布前检查清单。`lesson-render-fixture` 只能证明本地安全小样链路可出片，不能替代用户真实课程素材验收。

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

## 第 4 阶段成果记忆

阶段目标：
1. 将第 3 阶段编辑器占位页升级为“数据模型与配置编辑器 MVP”。
2. 支持读取、编辑、校验和导出 `lesson-01.json` 的核心配置。
3. 保持编辑器预览和 Remotion 渲染读取同一份 lesson 数据结构。

已完成：
1. 新增 `src/editor/state/editorState.ts`，编辑器启动时从 `lesson-01.json` 初始化草稿状态。
2. 新增 `src/editor/utils/validateEditorLesson.ts`，用于编辑器 schema 校验和错误路径展示。
3. 新增 `src/editor/utils/exportLesson.ts`，用于格式化导出 `lesson-01.edited.json`，并规范化 fit mode 字段。
4. 升级 `src/editor/App.tsx`、`EditorShell.tsx`、`PropertyPanel.tsx`、`TimelinePanel.tsx`、`PreviewCanvas.tsx`。
5. 右侧属性面板可编辑课程信息、讲师信息、素材路径、默认重点提示、任务 label、地图节点 label、阶段 label/time 和基础布局开关。
6. 底部阶段区支持 `previewTime` 输入、点击阶段跳转预览，以及阶段名称、开始时间、结束时间编辑。
7. schema 已校验任务 label、阶段 label、阶段时间必须 start < end、阶段不重叠、`totalLessons >= lessonIndex`。
8. Remotion 默认 lesson、HUDLayer 和 SpeakerLayer 已兼容 `speaker.role`、`speaker.stats`、stage label 和 task label。
9. 新增 `docs/STAGE_4_EDITOR_MVP_NOTES.md`，并更新 README 文档地图与阶段记忆。

关键产物：
1. `src/editor/state/editorState.ts`：编辑器草稿状态、校验状态、导出状态和用户消息。
2. `src/editor/utils/validateEditorLesson.ts`：Zod 校验结果转 UI 错误列表。
3. `src/editor/utils/exportLesson.ts`：浏览器下载 JSON 与导出前字段规范化。
4. `src/editor/PropertyPanel.tsx`：第 4 阶段核心表单。
5. `src/editor/TimelinePanel.tsx`：简化阶段配置与校验视图。
6. `src/schemas/lesson.schema.ts`：第 4 阶段 schema 收紧。
7. `docs/STAGE_4_EDITOR_MVP_NOTES.md`：第 4 阶段实现说明。
8. `docs/STAGE_4_EDITOR_MVP_REVIEW.md`：第 4 阶段审查报告，结论为有条件通过。

已冻结决策：
1. 第 4 阶段不引入后端、数据库、登录、云协作或复杂本地写文件能力。
2. 保存按钮不写回文件，只提示使用“导出配置”。
3. 导出按钮必须先校验，校验失败不得下载 JSON。
4. 任务、地图节点和阶段保持固定数量，只编辑名称和阶段简单时间。
5. `timelineEvents` 本阶段只显示和点击跳转，不做编辑。
6. 编辑器预览画框内不出现播放器控件；最终 Remotion composition 不引用编辑器组件。
7. 渲染按钮仍为占位，第 6 阶段再完善完整渲染流程。

后续接手注意：
1. `lesson-01.edited.json` 目前由浏览器下载，若要用于现有脚本，需要手动替换 `src/data/lessons/lesson-01.json`。
2. 浏览器端不直接检查本地素材是否存在；素材缺失会显示占位，不阻断编辑。
3. `layout.show*` 开关会同步到嵌套 `layout.*.visible`，Remotion 当前主要读取嵌套字段。
4. `media.mainVideoFitMode` 会同步到 `layout.mainVideoFitMode`，导出时会把 `fit-width/fit-height` 转成 schema 兼容的 `fit_width/fit_height`。
5. Remotion `HudLayer` 仍未完全复用 `src/components/hud/*`，后续需要逐步收敛。
6. 第 4 阶段审查允许进入第 5 阶段，但建议先处理加载失败提示、字段级错误定位、`使用当前时间` 空按钮和表单拆分。

下一阶段建议：
1. 实现 lesson JSON 导入能力。
2. 增加素材路径检查脚本和编辑器素材缺失提示。
3. 实现第 5 阶段简化时间轴事件编辑，不做多轨拖拽时间线。
4. 为 `deriveHudState` 增加单元测试，覆盖阶段、任务、地图、提示和短时事件。
5. 准备真实小体积测试素材，验证主视频音频、讲师视频、头像 fallback 和最终 MP4。

## 第 4 阶段审查要点速记

审查结论：
1. 第 4 阶段“数据模型与配置编辑器 MVP”审查结果为有条件通过。
2. 允许进入第 5 阶段，但第 5 阶段开始前建议优先处理 P1 项。
3. 审查报告见 `docs/STAGE_4_EDITOR_MVP_REVIEW.md`。

已确认通过：
1. 编辑器能从 `lesson-01.json` 初始化 editor state。
2. 编辑器能编辑课程信息、讲师信息、素材路径、默认重点提示、任务 label、地图节点 label、阶段 label/startTime/endTime 和基础布局开关。
3. 预览由当前 editor state 驱动，浏览器实测修改 `courseTitle` 后 TopHeader 即时更新。
4. “校验配置”校验当前草稿状态，而不是只校验原始 JSON。
5. “导出配置”代码路径会先校验，再导出格式化 JSON。
6. `npm run typecheck`、`npm run validate:lessons`、`npm run render:sample` 均通过。
7. `npm run studio` 可自动启动到 `http://localhost:3000`；指定 3001 失败是端口占用，不是 Remotion 破坏。
8. Remotion composition 中未发现播放、暂停、倍速、音量、全屏、可拖动进度条或编辑器控件。

主要 P1：
1. 增加 lesson 加载失败 UI，避免配置损坏时白屏。
2. 校验错误需要从错误列表升级到字段级定位。
3. `EditorShell` 中“使用当前时间”按钮目前为空行为，第 5 阶段应绑定到阶段/事件时间字段。
4. `PropertyPanel.tsx` 已偏大，第 5 阶段加事件编辑前应拆成 `src/editor/forms/*`。
5. Remotion `HudLayer` 仍是内联实现，后续应逐步收敛到共享 HUD 展示组件，但不能把编辑器 `SelectableHud` 和选中框带入 Remotion。

第 5 阶段方向：
1. 只做简化事件表和手动时间点编辑，不做多轨、拖拽波形或复杂剪辑时间线。
2. 优先补 `timelineEvents` 编辑、素材路径检查、`deriveHudState` 测试和导入 JSON。
3. 主视频缺失应在正式渲染前阻断；讲师视频/头像缺失可降级警告。

## 第 5 阶段成果记忆

阶段目标：
1. 将编辑器升级为“时间轴编辑与联动预览 MVP”。
2. 支持主视频 currentTime / previewTime 驱动 CourseStageBar、ChapterMap、TaskTracker、WarningPanel 和 BottomStatusHud。
3. 支持课程阶段和时间轴事件的新增、编辑、删除、跳转、校验和导出。

已完成：
1. 新增 `src/editor/timeline/VideoPreviewController.tsx`，播放器控制位于最终视频画框外，可读取主视频时间；主视频缺失时允许手动配置。
2. 底部“阶段”视图支持新增、编辑、删除、点击跳转、active stage 高亮和“开始=当前 / 结束=当前”。
3. 底部“事件”视图支持新增、编辑、删除、启用/禁用、type、targetComponent、startTime、endTime、priority 和结构化 payload 表单。
4. 右侧属性面板支持当前选中阶段/事件的时间编辑和当前时间写入。
5. `src/utils/timeline.ts` 已扩展为共享 HUD runtime state 推导，覆盖阶段、地图、任务、提示、能力解锁、阶段总结和作业提醒。
6. `src/schemas/lesson.schema.ts` 已增强事件类型、targetComponent、payload、时间、唯一 ID 和引用校验。
7. `src/data/lessons/lesson-01.json` 已升级为第 5 阶段事件口径，包含 `tip_show`、`warning_show`、`task_done`、`ability_unlock`、`summary_show`、`homework_show`。
8. 新增 `docs/STAGE_5_TIMELINE_EDITOR_NOTES.md`，README 文档地图和阶段记忆已同步。

关键产物：
1. `src/editor/timeline/VideoPreviewController.tsx`：编辑器外层视频 currentTime 同步控制器。
2. `src/editor/TimelinePanel.tsx`：阶段和事件编辑主面板。
3. `src/utils/eventRules.ts`：第 5 阶段事件类型、目标模块和默认 payload 规则。
4. `src/utils/timeFormat.ts`：秒数、mm:ss/hh:mm:ss 输入输出工具。
5. `src/utils/timeline.ts`：编辑器和 Remotion 共用的 HUD 状态推导。
6. `docs/STAGE_5_TIMELINE_EDITOR_NOTES.md`：第 5 阶段实现说明。

已冻结决策：
1. 第 5 阶段新建和示例配置采用附件事件名：`stage_change`、`map_node_active`、`task_active`、`task_done`、`tip_show`、`warning_show`、`ability_unlock`、`summary_show`、`homework_show`。
2. 为避免破坏旧文档和既有配置，schema 与 timeline 推导兼容读取旧事件名：`map_node_activate`、`task_update`、`hint_show`、`skill_unlock`、`stage_summary`、`homework_reminder`。
3. 显示型事件必须有 `endTime` 或 `duration`；能力解锁状态可持续，但底部短提示遵守自身结束时间。
4. 阶段默认联动在进入新阶段时会覆盖旧的持久任务/地图事件；当前阶段内的新手动事件仍优先。
5. 编辑器画框内不保留真实 `button/input/select/video[controls]` 控件；播放器控制只在画框外。
6. Remotion composition 继续只消费 lesson 配置和 `deriveHudState`，不得引用编辑器交互层。

后续接手注意：
1. 浏览器端仍不直接检查素材文件是否真实存在；素材检查应在第 6 阶段以脚本和渲染前检查实现。
2. `render:sample` 仍不足以覆盖所有后半段事件；后续必须补关键时间点 still 或片段验收。
3. `PropertyPanel.tsx` 仍偏大，后续建议拆成课程、讲师、素材、阶段、事件等小表单。
4. 当前未新增正式 `npm test`；本阶段曾用临时 `tsx` 抽查关键时间点，但未沉淀为可复跑脚本，后续应补正式测试脚本。
5. 如果继续收敛 Remotion HUD 与编辑器预览 HUD，只能抽无交互展示组件，不能把 `PreviewCanvas`、选择层或编辑器控件带入 Remotion。

下一阶段建议：
1. 增加素材路径检查脚本和渲染前检查清单，主视频缺失为阻断错误。
2. 增加 lesson JSON 导入能力。
3. 为 `deriveHudState` 增加正式单元测试。
4. 增加 Remotion still/片段验收脚本，覆盖事件前、中、后时间点。
5. 逐步统一编辑器和 Remotion 的无交互 HUD 展示组件。

## 第 5 阶段审查成果记忆

阶段目标：
1. 审查第 5 阶段“时间轴编辑与联动预览 MVP”的代码、数据结构、编辑器体验和 Remotion 兼容性。
2. 按 Course HUD Director Agent 工作流分配事实边界、前端编辑器、数据模型、教学 HUD、证据验收等岗位并行审查。
3. 判断是否允许进入第 6 阶段。

已完成：
1. 已阅读附件审查要求和第 0-5 阶段核心文档。
2. 已由多个岗位 Agent 并行审查产品边界、编辑器 currentTime/previewTime、stages、timelineEvents、payload、schema、`deriveHudState`、HUD 联动、Remotion 和最终视频控件边界。
3. 已运行 `npm run typecheck`、`npm run validate:lessons`、`npm run render:sample`、`npm run dev -- --port 5179`、`npm run studio -- --port 3011` 和 `npm run build`。
4. 已创建 `docs/STAGE_5_TIMELINE_EDITOR_REVIEW.md`，审查结论为有条件通过。
5. 已同步 README 文档地图和阶段记忆。

关键产物：
1. `docs/STAGE_5_TIMELINE_EDITOR_REVIEW.md`：第 5 阶段正式审查报告，包含评分、通过项、P0/P1/P2、命令结果、风险清单和第 6 阶段建议。

已冻结决策：
1. 第 5 阶段审查结论为有条件通过，允许进入第 6 阶段。
2. 当前无 P0 阻断项。
3. Remotion composition 未发现播放器控件或编辑器控件；最终视频无播放器控件边界继续冻结。
4. 第 6 阶段优先补素材检查、渲染前检查、lesson JSON 导入、`deriveHudState` 自动化测试和关键时间点 Remotion 验收。
5. `stage_change`、`targetComponent` 和 payload 同步字段语义需要在第 6 阶段优先冻结，避免配置写了但 runtime 不消费。

后续接手注意：
1. P1：`stage_change` 被 schema、事件表和示例配置支持，但当前不覆盖 `currentStage/stageStatuses`。
2. P1：schema 未校验 `stage.mapNodeId`、`stage.defaultTaskId`、`stage.defaultHintId`、`task.stageId`、`chapterMap.nodes[].stageId`、`warning.defaultHintId`、`warning.items[].stageId` 等交叉引用。
3. P1：`deriveActiveWarning` 和 `deriveBottomStatus` 对 `targetComponent` 与 `syncBottomStatus` 的语义不够严格。
4. P1：主视频 duration 缺失时，外层 preview 控制和 `VideoPreviewController` fallback 不统一。
5. P1：右侧属性面板修改 stage 时间不排序、不更新 `order`，底部时间轴面板会排序，存在显示顺序漂移风险。
6. P1：payload 表单仍偏工程字段，不够非程序员友好，summary/homework 的 bullets/checklist 不可编辑。
7. `render:sample` 成功但占位素材 404 仍存在，不能代表真实素材链路完成。
8. 当前没有 `lint` / `test` 脚本；第 6 阶段不要只靠人工观察，应补可复跑验证。

下一阶段建议：
1. 先补 `deriveHudState` 单元测试，覆盖 117/118/124/150/248/270/316/340/355 秒等关键点。
2. 增加素材检查脚本，主视频缺失阻断，讲师视频/头像按策略降级或警告。
3. 增加渲染前检查清单，覆盖事件引用、阶段冲突、提示持续时间、同组件同优先级冲突和最终视频无播放器控件。
4. 增加 lesson JSON 导入能力。
5. 增加 Remotion still/片段验收脚本，覆盖事件前、中、后状态。

## 第 5 阶段审查要点速记

审查结论：
1. 第 5 阶段“时间轴编辑与联动预览 MVP”有条件通过。
2. 当前无 P0 阻断项，可以进入第 6 阶段。
3. 最终 Remotion composition 未发现播放器控件、编辑器控件、表单控件或可拖动播放器进度条。

已经确认通过：
1. `currentTime/previewTime` 是编辑器共享核心状态，视频控制、手动输入、阶段跳转和事件跳转都能驱动同一套 HUD runtime。
2. stages 支持新增、编辑、删除、跳转和“开始=当前 / 结束=当前”。
3. timelineEvents 支持新增、编辑、删除、启用/禁用、类型、目标模块、时间、优先级和 payload 表单。
4. `deriveHudState` 同时被编辑器和 Remotion 使用，不是两套独立状态推导。
5. `npm run typecheck`、`npm run validate:lessons`、`npm run render:sample`、`npm run build`、编辑器启动和 Remotion Studio 启动均通过。

必须继承的 P1：
1. `stage_change` 当前只是可配置事件，不会真正覆盖 `currentStage/stageStatuses`；第 6 阶段必须冻结语义。
2. schema 交叉引用校验不足，尤其是 stage/task/map/hint 的默认绑定和归属绑定。
3. `targetComponent` 与 `syncBottomStatus` 等 payload 同步字段在 runtime 中不够严格。
4. 素材检查尚未实现；`render:sample` 通过但占位素材 404 仍存在。
5. 缺少正式 `npm test` 和关键时间点 still/片段验收脚本。

第 6 阶段优先级：
1. 先补 `deriveHudState` 单元测试，再改事件语义。
2. 再补素材检查和渲染前检查。
3. 再做 lesson JSON 导入。
4. 最后做 Remotion still/片段验收和 HUD 展示组件收敛。

## 第 6 阶段成果记忆

阶段目标：
1. 将第 5 阶段时间轴联动预览推进到本地单节课 MP4 渲染链路。
2. 按 Course HUD Director Agent 工作流分配渲染预检、Remotion 媒体层、HUD 状态测试和文档交接岗位。
3. 保持第 0-5 阶段边界：本地、单节课、手动配置、最终 MP4 无播放器控件。

已完成：
1. 已新增 `preflight:render`，覆盖 schema、画布、fps、输出目录、主视频路径、讲师素材、音频模式、时长和 timeline 基础规则。
2. 已新增 `render:lesson`，按 lesson id 读取 `src/data/lessons/{lessonId}.json` 并输出 1920 x 1080 MP4。
3. 已新增 `render:smoke`，输出 8 秒 MP4 到 `out/{lessonId}-smoke.mp4`，用于快速检查 composition。
4. 已新增 `test:hud`，沉淀第 5 阶段审查要求的关键时间点 HUD 状态测试。
5. Remotion composition 已支持主视频 fit mode、讲师视频/头像/身份牌 fallback、`main-only` / `speaker-only` / `mix` / `mute-all` 音频路由。
6. 已补齐 `speaker-only` / `mix` 对讲师视频音频来源的强制使用、`speaker.missingAssetBehavior = "hide"` 的渲染层行为、HUD 显示开关和右侧栏/阶段条隐藏模式。
7. Course HUD Director Agent 已按渲染工程、数据预检、事实边界和证据验收岗位并行复查，补齐讲师音频、素材 fallback、HUD 显示开关、schema 引用检查和文档事实边界。
8. 已新增 `docs/STAGE_6_RENDERER_NOTES.md`，并同步 README 文档地图与阶段记忆。

关键产物：
1. `scripts/preflight-render.ts`：渲染前检查入口，主视频缺失时阻断正式渲染。
2. `scripts/render-lesson.ts`：正式单节课渲染脚本。
3. `scripts/render-smoke.ts`：8 秒 smoke 渲染脚本。
4. `scripts/render-utils.ts` 与 `scripts/media-paths.ts`：Remotion render plan、lesson id 参数解析和 public 素材路径解析。
5. `scripts/test-hud-state.ts`：HUD 状态测试。
6. `src/remotion/CourseShellComposition.tsx` 与 `src/remotion/layers/*`：第 6 阶段最终视频渲染层。
7. `src/utils/timeline.ts`：已冻结 `stage_change`、`targetComponent`、短时事件和持久能力解锁的 runtime 语义。
8. `docs/STAGE_6_RENDERER_NOTES.md`：第 6 阶段渲染器说明与交接。

已冻结决策：
1. 主视频是 P0 必需素材；缺失时 `preflight:render`、`render:smoke` 和 `render:lesson` 必须退出非 0。
2. `audio.mode` 默认 `main-only`；`speaker-only` 需要讲师视频，`mix` 给出回声风险警告，`mute-all` 输出静音。
3. `speaker-only` 和 `mix` 都要求讲师视频存在才能通过正式 preflight；`mix` 会给出回声和音量叠加风险提示。
4. `mainVideoFitMode` 正式渲染优先读取 `layout.mainVideoFitMode`，默认 `contain`，以保证录屏内容完整。
5. `render:lesson` 和 `render:smoke` 当前按 lesson id 工作，不支持任意 JSON 路径和 CLI 输出路径覆盖。
6. CourseStageBar 继续是学习导航，不是播放器进度条；Remotion composition 不得引用编辑器控件或播放器控件。
7. 最终画面无控件边界通过代码审查和静态扫描确认，当前 `preflight:render` 不自动证明画面无控件。

后续接手注意：
1. 当前示例 `lesson-01` 主视频路径仍是占位文件，预检失败是预期结果。
2. `render:sample` 成功只说明开发样片链路可用，不能代表真实素材链路通过。
3. `render:smoke` 只输出 8 秒基础样片，不覆盖 117/118/124/150/248/270/316/340/355 秒等后半段关键点；仍需第 7 阶段 still/片段验收。
4. 第 6 阶段审查整改后已新增通用 `npm test`，聚合 `validate:lessons`、`test:hud` 和 `test:preflight`。
5. 第 6 阶段未做批量渲染、云端队列、自动字幕、AI 自动识别、多轨剪辑、BGM、降噪或 ducking。
6. 第 6 阶段审查整改已补齐安全小样成功路径、`mix` 缺讲师视频 error、still/clip 脚本、编辑器渲染按钮提示、输出覆盖提示和 `npm test` 聚合脚本。

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
3. 审查时指出 still/clip 视觉验收缺口；整改后已新增 `render:still` 和 `render:clip`，但用户真实课程素材仍需用这两个命令单独验收。
4. 审查时指出编辑器“渲染”按钮提示过期；整改后已改为正式 CLI 预检与渲染指引。

下一阶段建议：
1. 用用户授权真实素材替换 `lesson-01` 并跑通完整成功路径。
2. 增加 lesson JSON 导入。
3. 做 HUD 展示组件收敛和视觉定稿。

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

## 第 6 阶段整改要点速记

核心结论：
1. 第 6 阶段审查发现的可落地问题已整改：`mix` 缺讲师视频阻断、still/clip 验收脚本、编辑器渲染提示、输出覆盖提示、Remotion/browser 素材解析口径和 `npm test` 聚合。
2. `lesson-render-fixture` 是当前唯一已跑通完整成功路径的安全小样；它使用本地合成素材，证明脚本链路可出片，但不代表用户真实课程素材已验收。
3. `lesson-01` 仍是主项目示例配置，主视频路径保持占位；它的 preflight 失败是预期保护，等待用户授权真实素材替换。

必须继承的命令口径：
1. 通用验证：`npm test`、`npm run typecheck`、`npm run build`。
2. 示例占位保护：`npm run preflight:render -- lesson-01` 当前应因主视频缺失退出非 0。
3. 安全小样成功路径：`npm run preflight:render -- lesson-render-fixture`、`npm run render:smoke -- lesson-render-fixture`、`npm run render:still -- lesson-render-fixture --times 2,7,10`、`npm run render:clip -- lesson-render-fixture --from 2 --duration 4`、`npm run render:lesson -- lesson-render-fixture`。
4. 用户真实素材验收：替换 `lesson-01` 后，必须对 `lesson-01` 跑同一组 preflight / smoke / still / clip / render 命令。

边界提醒：
1. `mix` 必须有讲师视频才能通过正式 preflight。
2. `render:still` 和 `render:clip` 都必须先跑 preflight，不允许绕过主视频素材检查。
3. `public/input/...` 下生成或放入的媒体素材、`out/...` 渲染产物均不提交。
4. 最终 Remotion composition 不得引入按钮、输入框、拖动条、播放器控件或编辑器组件。

## 当前任务状态速记

任务结论：
1. 第 5 阶段执行任务已完成。
2. 第 5 阶段审查任务已完成，结论为有条件通过。
3. 第 6 阶段本地单节课渲染链路已完成本轮 Course HUD Director Agent 高质量执行与岗位复查。
4. 第 6 阶段审查已完成，结论为有条件通过，无 P0 阻断项。
5. 第 6 阶段审查整改已完成可落地项，并用 `lesson-render-fixture` 跑通安全小样成功路径。
6. 当前可以进入第 7 阶段前置验收与视觉精修准备，但用户真实课程素材仍需替换 `lesson-01` 后单独验收。

已验证通过：
1. `npm test` 通过，已聚合 `validate:lessons`、`test:hud` 和 `test:preflight`。
2. `npm run typecheck` 通过。
3. `npm run build` 通过。
4. `npm run render:sample` 通过，但仍使用占位素材 fallback。
5. `npm run preflight:render -- lesson-01` 当前因占位主视频缺失退出非 0，这是第 6 阶段预检的预期保护。
6. 本地编辑器和 Remotion Studio 均可启动。
7. `src/remotion` 静态扫描未发现播放器控件、表单控件、编辑器预览组件或 editor-only 引用。
8. 最终 Remotion composition 未发现播放器控件或编辑器交互控件。
9. 第 6 阶段审查报告已新增到 `docs/STAGE_6_RENDERER_REVIEW.md`。
10. `lesson-render-fixture` 的 preflight、smoke、still、clip 和正式 render 已跑通；最终 MP4 为 1920 x 1080、30fps、12 秒。

当前分支与工作区：
1. 当前工作分支为 `codex/stage-5-timeline-editor`。
2. 工作区包含第 4、第 5、第 6 阶段未提交改动和新增文件，后续 Agent 不得误删或回滚。
3. 第 6 阶段核心新增文件包括 `docs/STAGE_6_RENDERER_NOTES.md`、`docs/STAGE_6_RENDERER_REVIEW.md`、`scripts/preflight-render.ts`、`scripts/render-lesson.ts`、`scripts/render-smoke.ts`、`scripts/render-still.ts`、`scripts/render-clip.ts`、`scripts/test-hud-state.ts`、`scripts/test-preflight-render.ts`、`scripts/media-paths.ts`、`scripts/render-utils.ts`、`src/data/lessons/lesson-render-fixture.json`、`src/utils/media.ts` 和 `src/utils/mediaFit.ts`。
4. 本轮补强涉及 `src/remotion/CourseShellComposition.tsx`、`src/remotion/layers/SpeakerLayer.tsx`、`src/remotion/layers/HudLayer.tsx`、`src/schemas/lesson.schema.ts`、`src/utils/timeline.ts`、`src/utils/eventRules.ts`、`scripts/preflight-render.ts`、`.gitignore`、`package.json` 和 `package-lock.json`。

下一位 Agent 开工顺序：
1. 先读 `README.md`、`AGENTS.MD`、`docs/STAGE_5_TIMELINE_EDITOR_REVIEW.md`、`docs/STAGE_6_RENDERER_NOTES.md` 和 `docs/STAGE_6_RENDERER_REVIEW.md`。
2. 先准备授权安全真实素材，替换 `lesson-01` 的主视频、讲师视频和头像路径。
3. 跑通 `npm run preflight:render -- lesson-01`、`npm run render:smoke -- lesson-01`、`npm run render:still -- lesson-01 --times ...`、`npm run render:clip -- lesson-01 --from ... --duration ...` 和 `npm run render:lesson -- lesson-01` 的真实课程成功路径。
4. 再实现 lesson JSON 导入和 HUD 展示组件收敛。
