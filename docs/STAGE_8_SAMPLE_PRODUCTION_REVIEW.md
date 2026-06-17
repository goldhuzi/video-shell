# 第 8 阶段真实单课样片生产审查报告

生成日期：2026-06-17

审查角色：Course HUD Director Agent / 第 8 阶段真实样片生产审查总指挥。

## 审查结论

结论：有条件通过。

第 8 阶段已经完成真实授权素材接入、独立 `lesson-01.sample` 配置、preflight、smoke、still、clip、full render 记录和 QA 文档。当前本地真实样片 `out/lesson-01-sample.mp4` 可以作为第一条真实单课 HUD 样片进行内部评审和向用户回看。

当前没有 P0 阻断项。主要条件是：第 8 阶段只证明了“一条真实单课样片可出片”，尚未证明批量生产、长讲师视频小窗、批量 QA、自动字幕、AI 自动识别、云端渲染或复杂剪辑能力。

第 9 阶段放行意见：

1. 如果第 9 阶段范围是 lesson JSON 导入、HUD 状态测试泛化、contact sheet 和 QA 自动化，可以进入。
2. 如果第 9 阶段范围是“批量生产与项目管理”，不建议直接进入正式批量生产，应先关闭本报告 P1。

## 审查依据

已审查材料：

1. 第 0-8 阶段核心规格、实现说明、审查报告和长期项目记忆。
2. `src/data/lessons/lesson-01.sample.json`
3. `docs/STAGE_8_SAMPLE_PRODUCTION_NOTES.md`
4. `docs/STAGE_8_SAMPLE_QA_REPORT.md`
5. `docs/STAGE_8_ISSUE_BACKLOG.md`
6. `docs/STAGE_8_ASSET_MISSING_REPORT.md`
7. `docs/sample-lessons/lesson-01-outline.md`
8. 第 8 阶段输出 still、clip 和完整 MP4。

岗位复查视角：

1. 事实边界审稿人：检查是否扩大到批量、云端、自动字幕或剪辑软件。
2. 素材与隐私审查员：检查真实素材路径、ignored 状态和输出不提交边界。
3. Data Model Agent：检查 `lesson-01.sample` 的 media、stages、timelineEvents、render 字段。
4. Render Engineering Agent：检查 preflight、smoke、输出 MP4、音频和静态控件扫描。
5. UI Visual Agent：检查主视频优先、HUD 遮挡、CourseStageBar 和视觉可读性。
6. QA 证据验收员：检查 QA 报告、问题 backlog、命令记录和第 9 阶段交接。

## 评分

| 项目 | 分数 | 审查意见 |
| --- | ---: | --- |
| 真实素材接入完整度 | 4.0 / 5 | 主视频真实接入并通过 preflight；讲师视频只有 9.7 秒，当前走头像 fallback。 |
| 素材安全与 Git 边界 | 4.5 / 5 | 真实素材和 `out/` 均处于 ignored 状态；素材缺失报告顶部历史结论仍需弱化。 |
| lesson 样片配置完整度 | 4.5 / 5 | `lesson-01.sample` 包含 media、audio、speaker、layout、stages、timelineEvents 和 render。 |
| stages 真实匹配度 | 4.0 / 5 | 5 个阶段覆盖完整课程，但来自画面观察，不是课程主理人确认稿。 |
| timelineEvents 真实匹配度 | 4.0 / 5 | 关键 warning、ability、summary、homework 均有 still/clip 证据；文案需课程主理人复核。 |
| 渲染命令完成度 | 4.5 / 5 | preflight、smoke、still、clip、full render 记录完整；本次审查未重跑 full render。 |
| 输出视频完整度 | 5.0 / 5 | 完整 MP4 为 H.264、1920 x 1080、30 fps、约 504 秒，含 AAC 双声道音频。 |
| 画面结构质量 | 4.5 / 5 | 主视频居首，右侧栏和底部 HUD 未遮挡核心文字。 |
| 主视频可读性 | 4.0 / 5 | 源为 720p，上采样到 1080p，清晰度上限由源文件决定。 |
| 时间轴同步质量 | 4.0 / 5 | 关键帧和片段显示 HUD 状态变化；缺按 lesson id 的自动 HUD 测试。 |
| 音频质量 | 4.5 / 5 | `main-only` 避免回声和短讲师音频断档；未验证长讲师视频音频路径。 |
| 视觉质量 | 4.3 / 5 | 默认 `default-ai-tactical` 模板成立，HUD 克制；后续可补 contact sheet。 |
| CourseStageBar 合规度 | 5.0 / 5 | 表达学习阶段，不是播放器进度条，无播放头、拖动手柄或连续进度填充。 |
| 最终无播放器控件合规度 | 5.0 / 5 | `src/remotion` 静态扫描无控件、无 editor-only 引用，still 目检未见控件。 |
| QA 报告完整度 | 4.0 / 5 | QA 证据充分，但可补更明确的“是否建议作为第一条样片交付”小结。 |
| 问题 Backlog 完整度 | 3.0 / 5 | 有 P1/P2/P3，但缺 issue 编号、模块、建议阶段、状态等字段。 |
| 第 9 阶段准备度 | 3.5 / 5 | 可以进入导入和测试泛化；不建议直接进入正式批量生产。 |

## 已确认通过

1. 产品边界未被扩大。第 8 阶段没有引入批量渲染、云端、登录、数据库、自动字幕、AI 自动识别、BGM、降噪、ducking、多轨剪辑或自由拖拽。
2. 真实主视频已接入 `lesson-01.sample`，路径为 `/input/videos/lesson-01-main.mp4.mp4`，配置中标记为必需素材。
3. 讲师短视频已记录为可选素材，并采用头像 fallback 与 `audio.mode = "main-only"`，没有虚假声称长讲师视频链路已通过。
4. `lesson-01.sample` 具有 5 个课程阶段，覆盖 0 秒到 503.942676 秒。
5. `timelineEvents` 覆盖开场提示、阶段切换、任务激活、warning、ability、summary 和 homework。
6. 第 8 阶段 QA 报告记录了 preflight、smoke、still、clip、full render、ffprobe、关键帧目检和控件扫描。
7. 完整输出 `out/lesson-01-sample.mp4` 已存在，媒体参数符合 16:9 MP4 样片要求。
8. 本次审查重新运行的 `npm test`、`npm run typecheck`、`npm run build`、`npm run preflight:render -- lesson-01.sample`、`npm run render:smoke -- lesson-01.sample` 均通过。
9. 本次审查重新运行 `src/remotion` 控件静态扫描，结果为 `NO_MATCHES`。
10. 本次审查目检 0 秒、240 秒、432 秒、485 秒 still，未发现播放器控件、编辑器控件或严重遮挡。

## 主要问题

### P0

无。

### P1

1. `docs/STAGE_8_ISSUE_BACKLOG.md` 的问题清单不满足审查附件要求的结构化字段。
   - 证据：当前 backlog 只有 P1/P2/P3 分组和自然语言条目。
   - 影响：第 9 阶段难以按 issue 编号、模块、建议阶段、修复方案和状态追踪问题。
   - 建议：改为表格字段：`issueId`、`title`、`description`、`severity`、`module`、`suggestedPhase`、`fix`、`status`。

2. `npm run test:hud` 仍未覆盖 `lesson-01.sample`。
   - 证据：第 8 阶段 backlog 已记录该问题；本次 `npm test` 也显示 `test:hud` 仍输出 `lesson-01` 关键时间点通过。
   - 影响：真实样片依赖 still/clip 人工验收，缺少可复跑的状态语义回归测试。
   - 建议：新增 `scripts/test-hud-state.ts --lesson lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500` 或等价脚本。

3. `lesson-01.sample` 的课程阶段和事件来自视频画面观察，尚未获得课程主理人确认。
   - 证据：生产说明、QA 报告和 outline 均注明不是逐字稿或课程脚本。
   - 影响：样片画面可用，但课程教学语义、阶段切点和 `homework_show` 文案可能与课程意图不完全一致。
   - 建议：第 9 阶段前由课程主理人复核阶段切点、提示、总结和作业挑战。

4. 长讲师视频小窗链路未验收。
   - 证据：讲师视频仅约 9.7 秒，当前 `speaker.displayMode = "avatar"`、`media.useSpeakerVideo = false`、`audio.mode = "main-only"`。
   - 影响：第 8 阶段不能代表整节课讲师视频小窗、讲师音频或 mix 音频策略通过。
   - 建议：提供同长度讲师视频或明确循环策略后，单独跑 preflight、still、clip 和 full render。

5. 第 9 阶段范围存在命名不一致。
   - 证据：当前 README/AGENTS 建议第 9 阶段为 lesson JSON 导入和 HUD 测试泛化；审查附件称第 9 阶段为“批量生产与项目管理”。
   - 影响：如果直接按“批量生产”推进，会把单样片阶段的人工复核缺口放大。
   - 建议：先将第 9 阶段冻结为“批量前准备”，完成导入、测试泛化、contact sheet、结构化 backlog，再决定是否进入正式批量。

### P2

1. `docs/STAGE_8_ASSET_MISSING_REPORT.md` 顶部仍写“当前缺少必需的真实主课程视频”和“等待用户提供”。
   - 影响：虽然后续状态已更新，但新 Agent 快速阅读时可能误判素材仍缺失。
   - 建议：将顶部改成“历史阻断记录”，并把当前状态前置。

2. QA 报告可读性还可加强。
   - 影响：现有 QA 证据足够，但附件要求的“视觉质量、CourseStageBar 合规、是否建议作为第一条样片交付”可以拆成显式小节。
   - 建议：在 `docs/STAGE_8_SAMPLE_QA_REPORT.md` 补充样片交付建议和截图索引。

3. 素材命名和目录不够规范。
   - 证据：主视频和讲师视频为 `.mp4.mp4` 双后缀，讲师视频位于 `public/input/videos/` 而不是建议的 `public/input/speakers/`。
   - 影响：不阻断渲染，但会增加后续素材导入和批量管理混淆。
   - 建议：后续导入 UX 给出非阻断 warning。

4. 主视频源为 720p。
   - 影响：最终 1080p 输出的清晰度上限受源文件限制。
   - 建议：QA 报告保留源分辨率提示，正式宣传样片优先使用 1080p 或更高源。

5. `homework_show` 文案不是源视频字幕原文。
   - 影响：教学设计上合理，但正式交付前需要课程主理人确认。
   - 建议：在课程脚本或 lesson review 表中标记为“HUD 增补文案”。

## 命令结果

本次审查重新运行：

| 命令 | 结果 | 备注 |
| --- | --- | --- |
| `npm test` | 通过 | `validate:lessons`、`test:hud`、`test:preflight` 均通过。 |
| `npm run typecheck` | 通过 | TypeScript 无错误。 |
| `npm run build` | 通过 | Vite 生产构建成功。 |
| `npm run preflight:render -- lesson-01.sample` | 通过 | 输出目标为 `out/lesson-01-sample.mp4`，渲染时长 503.94 秒。 |
| `npm run render:smoke -- lesson-01.sample` | 通过 | 重新覆盖输出 `out/lesson-01.sample-smoke.mp4`。 |
| `ffprobe out/lesson-01-sample.mp4` | 通过 | H.264、1920 x 1080、30 fps、AAC 48 kHz 双声道。 |
| `src/remotion` 控件静态扫描 | 通过 | 结果 `NO_MATCHES`。 |
| `git status --short --ignored public/input out ...` | 通过 | 真实素材和 `out/` 输出均为 ignored。 |

第 8 阶段执行记录中已完成但本次审查未重跑的重型命令：

| 命令 | 阶段记录结果 | 本次审查处理 |
| --- | --- | --- |
| `npm run render:still -- lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500` | 通过 | 本次目检现有 still：0、240、432、485 秒。 |
| `npm run render:clip -- lesson-01.sample --from 236 --duration 20` | 通过 | 采信 QA 记录。 |
| `npm run render:clip -- lesson-01.sample --from 284 --duration 16` | 通过 | 采信 QA 记录。 |
| `npm run render:clip -- lesson-01.sample --from 428 --duration 20` | 通过 | 采信 QA 记录。 |
| `npm run render:clip -- lesson-01.sample --from 480 --duration 22` | 通过 | 采信 QA 记录。 |
| `npm run render:lesson -- lesson-01.sample` | 通过 | 本次用 ffprobe 核验已有完整 MP4。 |

## 输出视频核验

完整样片：

1. 路径：`out/lesson-01-sample.mp4`
2. 文件大小：66,722,016 bytes
3. 视频编码：H.264
4. 分辨率：1920 x 1080
5. 帧率：30 fps
6. 视频时长：503.966667 秒
7. 音频编码：AAC
8. 音频采样率：48,000 Hz
9. 音频声道：2
10. 音频时长：504.021333 秒

素材核验：

1. 主视频：`public/input/videos/lesson-01-main.mp4.mp4`，时长 503.942676 秒。
2. 讲师视频：`public/input/videos/lesson-01-speaker.mp4.mp4`，时长 9.706009 秒。
3. 讲师头像：`public/input/images/lesson-01-speaker-avatar.png`，由讲师视频首帧派生。

## 视频画面审查

已目检 still：

1. `out/stills/lesson-01.sample/lesson-01.sample-0s.png`
2. `out/stills/lesson-01.sample/lesson-01.sample-240s.png`
3. `out/stills/lesson-01.sample/lesson-01.sample-432s.png`
4. `out/stills/lesson-01.sample/lesson-01.sample-485s.png`

观察结论：

1. 主视频画面是第一视觉优先级。
2. 右侧 Chapter Map、Task Tracker、Warning/Summary/Homework 面板随时间变化。
3. 底部 CourseStageBar 是阶段导航，不是播放器进度条。
4. 讲师层采用头像 fallback，没有短讲师视频断档问题。
5. 未发现播放、暂停、倍速、音量、全屏、拖动进度条、表单控件或编辑器选中框。
6. 0 秒、240 秒、432 秒、485 秒的主视频核心大字和画面主体均可读。
7. NotebookLM 标识未被右侧栏直接覆盖，但它属于主视频源内容，后续仍应作为安全区观察点。

## 样片质量结论

该样片可以作为第一条真实单课 HUD 样片进行内部演示和用户回看。它已经证明：

1. 真实主课程视频能进入当前 Remotion composition。
2. `default-ai-tactical` 模板能承载真实 720p 课件源并输出 1080p MP4。
3. 时间轴阶段、提示、任务、地图、summary 和 homework 能随视频时间联动。
4. 最终 MP4 不包含播放器控件或编辑器控件。
5. 主视频音频可以稳定保留到完整输出。

它还没有证明：

1. 多条课程批量生产稳定。
2. 长讲师视频小窗和讲师音频稳定。
3. 自动识别章节、自动字幕或自动生成 timelineEvents。
4. 批量 QA、批量 issue 流转和项目管理流程。

## 风险清单

| 风险 | 等级 | 说明 | 建议 |
| --- | --- | --- | --- |
| 批量生产放大人工误差 | 高 | 当前只有单条真实样片，且阶段和事件来自人工观察。 | 第 9 阶段先做导入、测试泛化、contact sheet 和结构化 backlog。 |
| 长讲师视频路径未验收 | 中高 | 当前讲师视频仅 9.7 秒。 | 补同长度讲师视频或循环策略，再单独验收。 |
| HUD 状态自动测试未覆盖真实样片 | 中高 | `test:hud` 仍覆盖旧 `lesson-01`。 | 增加按 lesson id 和时间点输入的测试。 |
| 课程语义未经主理人确认 | 中 | 阶段和文案来自画面观察。 | 课程主理人复核 `lesson-01-outline` 和 JSON。 |
| Backlog 难以项目化流转 | 中 | 缺 issue 编号、模块、状态。 | 改为结构化表格。 |
| 源视频清晰度上限 | 中 | 720p 源输出 1080p。 | 正式宣传样片优先用 1080p 源。 |
| 素材路径命名混乱 | 低中 | `.mp4.mp4` 与讲师视频目录不规范。 | 导入阶段给 warning，不强制改用户文件。 |
| CourseStageBar 被误改成进度条 | 低 | 当前合规，但后续批量模板调整可能误改。 | 保留静态扫描和截图 QA 禁止项。 |
| 最终视频误引入控件 | 低 | 当前扫描无命中。 | 每次改 `src/remotion` 后继续扫描。 |

## 第 9 阶段建议

允许进入的第 9 阶段范围：

1. lesson JSON 导入能力。
2. 按 lesson id 和时间点输入的 HUD 状态测试脚本。
3. `lesson-01.sample` 的自动化关键点断言。
4. still contact sheet 自动生成。
5. QA 报告结构补强。
6. 问题 backlog 结构化。
7. 编辑器预览 HUD 与 Remotion HUD 的无交互展示组件收敛。

暂不建议进入的第 9 阶段范围：

1. 多课程批量生产。
2. 客户项目管理系统。
3. 云端渲染队列。
4. 自动字幕。
5. AI 自动章节识别。
6. 长讲师视频批量混音。
7. 付费交付级批量样片输出。

## 给第 9 阶段 Agent 的交接建议

1. 先读 `docs/STAGE_8_SAMPLE_PRODUCTION_REVIEW.md`、`docs/STAGE_8_SAMPLE_QA_REPORT.md`、`docs/STAGE_8_ISSUE_BACKLOG.md` 和 `src/data/lessons/lesson-01.sample.json`。
2. 先把 `docs/STAGE_8_ISSUE_BACKLOG.md` 改成结构化 issue 表。
3. 再实现 `test:hud` 的 lesson id 参数化，优先覆盖 `lesson-01.sample` 的 0、30、92、146、176、240、288、300、432、450、485、500 秒。
4. 将 `docs/STAGE_8_ASSET_MISSING_REPORT.md` 顶部改成历史阻断记录，避免误导。
5. 补 QA contact sheet，减少人工逐张打开 still 的成本。
6. 进入任何批量生产前，至少再用一条不同真实课程素材跑通相同链路，并确认结构化 backlog 可闭环。

## 最终判断

第 8 阶段“真实单课样片生产”有条件通过。

可以向用户提供样片地址：`out/lesson-01-sample.mp4`。

可以进入“第 9 阶段：导入、测试泛化、QA 自动化和批量前准备”。不建议直接进入“正式批量生产与项目管理”，除非先关闭本报告 P1 并补充至少一条额外真实样片的重复验证。
