# 第 6 阶段渲染器说明与交接

## 1. 本阶段目标与实现口径

本文件用于冻结第 6 阶段的渲染器说明、渲染前检查口径和后续交接模板。它服务于主线程整合代码后的 README/AGENTS 更新，但本阶段文档 Agent 不修改 README、AGENTS、package.json、src 或 scripts。

第 6 阶段的目标是把第 5 阶段已经具备的“时间轴编辑与联动预览”推进到“可检查、可渲染、可交接”的本地单节课渲染链路：

1. 单节 lesson JSON 作为渲染输入。
2. 渲染前先做 schema、业务规则、素材路径和输出路径检查。
3. 主视频缺失时阻断正式渲染。
4. 讲师视频、头像和 HUD 非核心资源按配置降级或警告。
5. Remotion composition 按 `frame / fps` 推导 `currentTime`，复用 `deriveHudState` 渲染 HUD。
6. 最终输出仍是 1920 x 1080、16:9、无播放器控件的 MP4。

注意：本文件记录当前代码已接入的第 6 阶段渲染口径。真实课程成片仍依赖本地授权素材；当前示例 lesson 使用占位主视频路径，正式渲染会被预检阻断，直到补齐主课程视频。

## 2. 本阶段没有做什么

第 6 阶段不扩大产品边界：

1. 不做云端渲染、登录、数据库、团队协作或任务队列。
2. 不做批量生产或多节课自动排队渲染。
3. 不做多轨剪辑、复杂转场、素材拼接、波形编辑或专业音频混音。
4. 不做自动字幕、AI 自动章节识别、AI 自动提取重点或 AI 自动生成时间点。
5. 不做网页播放器、可点击章节、弹幕、倍速、音量、全屏等播放器功能。
6. 不把编辑器属性面板、时间轴表格、选择框或预览播放器控件带入最终 Remotion composition。

## 3. 如何渲染单节课

单节课渲染的标准流程：

1. 准备 lesson JSON，例如 `src/data/lessons/lesson-01.json`。
2. 确认 `media.mainVideo.src` 指向本地 `public` 下的主课程视频。
3. 执行渲染前检查，确认没有阻断错误。
4. 使用 `render:lesson` 渲染单节课。
5. 检查输出 MP4 的画面、音频、HUD 时间点和无播放器控件边界。

命令口径：

```bash
npm run render:lesson -- lesson-01
```

等价写法：

```bash
npm run render:lesson -- --lesson lesson-01
```

当前脚本按 lesson id 读取 `src/data/lessons/{lessonId}.json`。`render:sample` 仍保留为开发样片链路验证，不能替代正式单节课渲染验收。

## 4. 如何执行渲染前检查

渲染前检查应先于正式 MP4 输出执行。建议顺序：

```bash
npm run typecheck
npm test
npm run preflight:render -- lesson-01
npm run render:smoke -- lesson-01
```

检查范围：

1. JSON 可解析。
2. Zod schema 校验通过。
3. 课程标题、画布尺寸、fps、输出格式和输出目录有效。
4. 至少存在一个启用阶段。
5. 阶段时间递增，不倒置，不严重重叠。
6. 显示型事件有 `endTime` 或 `duration`。
7. 事件引用的 stage、task、map node、hint 等对象存在。
8. 同一时间同一 HUD 组件不存在无法解释的同优先级冲突。
9. 主视频已配置且本地文件存在。
10. 讲师视频、头像和 HUD 静态资源按策略阻断、降级或警告。
11. 输出目录存在或可创建。
12. Remotion composition 不引用编辑器控件或播放器控件；当前通过代码审查与静态扫描确认，`preflight:render` 本身不自动证明画面无控件。

## 5. lesson 配置如何影响渲染

核心字段和渲染影响：

| 配置字段 | 渲染影响 |
| --- | --- |
| `meta` | 顶部课程信息、课程序号、主任务、画布 fps 等基础信息。 |
| `media.mainVideo` | 主视频画面和默认音频来源，正式渲染的 P0 必需素材。 |
| `media.speakerVideo` / `media.lecturerVideo` | 讲师小窗视频候选素材。 |
| `media.speakerImage` / `media.lecturerAvatar` | 讲师头像 fallback 候选素材。 |
| `media.mainVideoFitMode` | 编辑器侧素材配置口径，导出时应同步到 layout。 |
| `speaker.displayMode` | 控制讲师卡使用视频、头像、紧凑身份牌或隐藏。 |
| `speaker.missingAssetBehavior` | 控制讲师素材缺失时阻断、头像降级、身份牌降级或隐藏。 |
| `layout` | 控制 HUD 模块显示、主视频 fit mode、右侧栏、阶段条和讲师卡位置。 |
| `warning.items` | WarningPanel 默认提示和事件引用来源。 |
| `tasks` | TaskTracker 的任务列表和默认归属阶段。 |
| `chapterMap.nodes` | ChapterMap 的路线节点和阶段绑定。 |
| `stages` | CourseStageBar、当前阶段、默认地图节点、默认任务和默认提示的基础来源。 |
| `timelineEvents` | 指定时间点的任务切换、提示显示、能力解锁、总结和作业提醒。 |
| `render` | 输出宽高、fps、格式、文件名、目录、编码和音频开关。 |

## 6. 主视频路径规则

主视频是正式渲染的必需素材。

推荐路径：

```text
public/input/videos/{project-slug}_main_v001.mp4
```

配置引用建议使用相对 `public` 的路径：

```json
{
  "media": {
    "mainVideo": {
      "src": "/input/videos/lesson-01-main.mp4",
      "required": true
    }
  }
}
```

路径规则：

1. 第一版优先使用本地 `public/input/videos/`。
2. 不在配置中写死开发者机器的绝对路径。
3. 不把远程 URL 作为第一版正式主路径。
4. 替换主视频后必须复查 stages 和 timelineEvents 的时间点。
5. 主视频缺失、不可读或路径解析失败时，正式渲染应停止。

## 7. 讲师视频 / 头像 fallback 规则

讲师素材是 P1 可选素材，不应影响主视频作为核心内容的优先级。

推荐策略：

1. `speaker.displayMode = "hidden"` 或 `speaker.positionPreset = "hidden"`：不渲染讲师卡；如果 `audio.mode` 为 `speaker-only` 或 `mix` 且讲师视频存在，Remotion 会保留一个不可见视频层用于音频输出。
2. `speaker.displayMode = "video"` 或 `media.useSpeakerVideo = true`：优先使用 `speakerVideo` 或 `lecturerVideo`。
3. 讲师视频可用时，讲师小窗视频默认静音，避免和主视频音频混音。
4. 讲师视频缺失时，根据 `speaker.missingAssetBehavior` 处理：
   - `block_render`：渲染前检查阻断。
   - `fallback_to_avatar`：尝试使用头像。
   - `fallback_to_identity_card`：显示文字身份牌。
   - `hide`：隐藏讲师卡并给出警告。
5. 头像缺失时，可以降级为身份牌，但渲染前应给出警告。

## 8. mainVideoFitMode 规则

`mainVideoFitMode` 控制主视频在 MainVideoFrame 内的适配方式。默认使用 `contain`。

| 值 | 含义 | 使用建议 |
| --- | --- | --- |
| `contain` | 完整显示主视频，可能留黑边或背景边 | 默认值，优先保证录屏内容完整。 |
| `cover` | 填满容器，可能裁切画面 | 只适合不怕裁切的素材。 |
| `fit_width` / `fit-width` | 宽度撑满，高度自适应 | 适合横向信息优先的视频。 |
| `fit_height` / `fit-height` | 高度撑满，宽度自适应 | 适合竖向信息优先但仍需放入固定框的视频。 |

导出配置时应把 `media.mainVideoFitMode` 与 `layout.mainVideoFitMode` 同步。正式渲染优先读取 `layout.mainVideoFitMode`，缺失时回退到 `contain`。

## 9. 音频策略

第 6 阶段只做基础音频路由，不做专业混音处理：

1. 默认 `audio.mode = "main-only"`，最终 MP4 使用主视频音频，讲师小窗静音。
2. `audio.mode = "speaker-only"` 时只保留讲师视频音频；预检会要求讲师视频存在，渲染层会强制使用讲师视频作为音频来源，即使视觉讲师卡被隐藏。
3. `audio.mode = "mix"` 时同时保留主视频和讲师视频音频；预检会提示回声和音量叠加风险，并要求讲师视频存在。渲染层同样会强制使用讲师视频作为讲师音频来源。
4. `audio.mode = "mute-all"` 或 `render.audioEnabled = false` 时输出静音视频。
5. 不做自动降噪、响度标准化、BGM、配音混音、ducking 或波形编辑。
6. 主视频没有音轨时，可以继续渲染画面，但应在渲染前检查中提示。

## 10. 时长计算规则

Remotion composition 最终使用：

```ts
durationInFrames = Math.ceil(durationSeconds * fps)
```

规则：

1. `fps` 默认 30，本阶段按 `render.fps` 读取。
2. `render:smoke` 会用 8 秒覆盖时长，用于快速检查 composition 打包、输出和基础画面可渲染，不覆盖后半段关键时间点。
3. `render.durationMode = "fixed"` 时读取 `render.durationSeconds`。
4. `render.durationMode = "content"` 时读取课程阶段和事件的最大结束时间；如果长于主视频，会给出警告。
5. `render.durationMode = "fixed"` 时读取 `render.durationSeconds`；如果长于主视频，会给出警告。
6. `render.durationMode = "auto"` 时优先读取主视频真实元信息，读取失败时回退到 `media.mainVideo.duration`。
7. `auto` 模式下真实元信息和配置时长差异超过 1 秒时给出警告，本次以真实媒体时长为准。
8. 主视频缺失仍然阻断正式渲染；主视频存在但元信息不可读时，可通过补齐 `media.mainVideo.duration` 或改用 fixed/content 继续验证。

## 11. CourseStageBar 为什么不是播放器进度条

CourseStageBar 是学习导航，不是播放控制。

它表达：

1. 当前处于哪个课程阶段。
2. 哪些阶段已经完成。
3. 哪些阶段尚未开始。
4. 课程结构和学习路径。

它不表达：

1. 可拖动播放头。
2. 连续播放进度填充。
3. 播放、暂停、倍速、音量或全屏控制。
4. 最终 MP4 中的任何交互。

编辑器中可以点击阶段跳转预览时间点，但这是编辑器生产工具能力，不能进入最终 Remotion composition。

## 12. 最终视频为什么不能出现播放器控件

最终输出是普通 MP4 成片，不是网页播放器。如果画面里出现播放、暂停、进度条、拖动滑块、倍速、音量或全屏图标，会造成两个问题：

1. 学员误以为视频内元素可交互。
2. CourseStageBar 的学习导航语义会被误解为播放器进度条。

因此 Remotion composition 只能渲染主视频、讲师卡和 HUD 展示层。禁止引入：

1. `PreviewCanvas`。
2. `VideoPreviewController`。
3. 编辑器属性面板。
4. 时间轴表格。
5. 选择框、控制按钮、表单控件和 HTML video controls。

## 13. 常见渲染错误和解决办法

| 错误 | 表现 | 处理 |
| --- | --- | --- |
| JSON 解析失败 | 命令直接报解析错误 | 检查逗号、引号、注释和文件编码。 |
| Schema 校验失败 | 列出字段路径和错误信息 | 按字段路径修复 lesson JSON，再重新校验。 |
| 主视频缺失 | 正式渲染阻断 | 把文件放到 `public/input/videos/`，并修正 `media.mainVideo.src`。 |
| 主视频路径 404 | 预览或渲染显示占位 | 检查路径是否相对 `public`，不要使用本机绝对路径。 |
| 阶段时间倒置 | 阶段无法正确命中 | 确保 `startTime < endTime`，并按开始时间递增。 |
| 事件超过视频时长 | 后段事件永远不会出现 | 复查主视频时长，调整事件时间或替换正确视频。 |
| 显示型事件无结束时间 | 提示无法确定显示窗口 | 给 `tip_show`、`warning_show`、`summary_show`、`homework_show` 补 `endTime` 或 `duration`。 |
| 事件引用不存在 | HUD 状态丢失或检查失败 | 确认 payload 中的 `stageId`、`taskId`、`nodeId`、`hintId` 存在。 |
| 同组件同优先级冲突 | 同时出现多个 competing 提示 | 调整 `priority` 或错开时间窗口。 |
| 讲师视频缺失 | 讲师卡显示头像、身份牌或被隐藏 | 根据 `missingAssetBehavior` 决定补素材、换头像或允许降级。 |
| `mix` 缺讲师视频 | 渲染前检查失败 | 补齐讲师视频，或把 `audio.mode` 改为 `main-only` / `mute-all`。 |
| 输出目录不可写 | Remotion 输出失败 | 创建 `out/renders`，确认权限和磁盘空间。 |
| 编码失败 | Remotion renderer 报错 | 查看日志，降低质量或检查素材编码。 |
| 最终画面出现控件 | MP4 中有播放按钮、滑块或表单 | 检查 Remotion 是否误引用编辑器组件，立即回退该引用。 |

## 14. `render:lesson` 使用方法

`render:lesson` 是正式单节课渲染命令口径。它应读取一个 lesson JSON，执行渲染前检查，然后输出 MP4。

基础用法：

```bash
npm run render:lesson -- lesson-01
```

等价写法：

```bash
npm run render:lesson -- --lesson lesson-01
```

当前支持的参数：

| 参数 | 说明 |
| --- | --- |
| 位置参数 | lesson id，例如 `lesson-01`。 |
| `--lesson` | lesson id，例如 `--lesson lesson-01` 或 `--lesson=lesson-01`。 |

输出路径来自 lesson 的 `render.outputDir` 与 `render.outputName`。当前脚本暂不支持命令行覆盖输出路径；需要修改 lesson JSON 后再渲染。

验收要求：

1. 主视频缺失时退出非 0。
2. schema 或业务检查失败时退出非 0。
3. 输出文件名合法。
4. 输出 MP4 为 1920 x 1080。
5. 最终画面无播放器控件。

## 15. `render:smoke` 使用方法

`render:smoke` 是轻量渲染验收命令口径，用于在正式渲染前快速检查 composition 打包、输出和基础画面可用性。

基础用法：

```bash
npm run render:smoke -- lesson-01
```

后续 still / 关键片段验收建议检查：

1. `36s`：短提示出现。
2. `118s`：阶段切换到第二阶段。
3. `150s`：警告提示出现。
4. `248s`：阶段切换到第三阶段。
5. `270s`：能力解锁出现。
6. `316s`：阶段总结出现。
7. `340s`：作业提醒出现。
8. `355s`：作业提醒结束后 HUD 回到稳定状态。

`render:smoke` 当前输出 8 秒 MP4 到 `out/{lessonId}-smoke.mp4`，仍会执行正式预检。它不覆盖上述后半段关键时间点，不等于真实交付渲染，也不应被描述为“真实样片已生成”。

## 16. `render:still` 和 `render:clip` 使用方法

`render:still` 用于输出关键时间点 PNG，默认时间点为第 5 阶段审查提出的后半段关键点：

```bash
npm run render:still -- lesson-01
npm run render:still -- lesson-01 --times 36,118,150
```

输出目录默认为 `out/stills/{lessonId}/`。

`render:clip` 用于输出关键片段 MP4：

```bash
npm run render:clip -- lesson-01 --from 145 --duration 20
```

输出目录默认为 `out/clips/`。两个命令都会先执行正式 preflight；主视频缺失、schema 错误或素材策略阻断时不会输出 still/clip。

第 6 阶段审查整改新增了 `lesson-render-fixture` 安全小样，可用于本地验证命令链路：

```bash
npm run preflight:render -- lesson-render-fixture
npm run render:smoke -- lesson-render-fixture
npm run render:still -- lesson-render-fixture --times 2,7,10
npm run render:clip -- lesson-render-fixture --from 2 --duration 4
npm run render:lesson -- lesson-render-fixture
```

## 17. 已知限制

1. 当前产品仍是本地单节课渲染工具，不是云端 SaaS。
2. 第一版不做批量渲染队列。
3. 第一版不做自动字幕、AI 自动识别和自动时间点生成。
4. 第一版不做复杂剪辑、音频混音和素材拼接。
5. `lesson-render-fixture` 已用本地合成素材验证成功路径，但用户真实课程素材仍需单独验收。
6. 当前示例 `lesson-01` 的主视频仍是占位路径；补齐真实素材前，`preflight:render`、`render:lesson` 和 `render:smoke` 会按预期阻断。
7. `render:sample` 的占位素材 404 不能证明真实素材链路可交付。
8. Remotion Studio 自带控制条属于开发工具界面，不属于最终 MP4。

## 18. 第 7 阶段建议

第 7 阶段建议围绕稳定交付和文档收口推进：

1. 主线程统一更新 README.md 和 AGENTS.MD，记录第 6 阶段真实完成状态和命令结果。
2. 固化 `render:lesson`、`render:smoke`、素材检查和渲染前检查的错误码与日志格式。
3. 为 `deriveHudState`、schema 交叉引用、素材检查和关键时间点验收继续增加可复跑测试。
4. 用用户真实授权素材替换 `lesson-01`，验证主视频音频、讲师视频、头像 fallback 和最终 MP4。
5. 收敛编辑器预览 HUD 与 Remotion HUD 的无交互展示组件，避免未来表现漂移。
6. 优化非程序员可理解的错误提示，把工程字段映射为课程、阶段、任务、地图节点和提示文案。
7. 建立发布前检查清单：配置检查、素材检查、关键时间点检查、音频检查、无播放器控件检查、输出文件检查。
