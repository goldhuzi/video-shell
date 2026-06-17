# 第 8 阶段真实单课样片 QA 报告

生成日期：2026-06-17

## QA 结论

第 8 阶段真实单课样片已完成素材识别、独立样片配置、preflight、smoke、still、clip、full render 和 ffprobe 核验。`lesson-01.sample` 真实素材链路可以本地输出 16:9 MP4 样片。

本阶段结论是“真实单课样片验收通过，带后续 P1/P2 backlog”。它不代表批量生产、云端渲染、自动字幕、长讲师视频小窗或 AI 自动识别能力已经完成。

## 验收范围

1. 真实主视频路径能通过正式 preflight。
2. 真实素材能进入 Remotion composition 并输出 smoke。
3. 关键时间点 still 能覆盖开场、阶段切换、提示、warning、ability、summary、homework 和结尾。
4. 关键事件 clip 能覆盖后半段素材，避免只验证开头。
5. 最终 MP4 必须为 16:9、1920 x 1080、30 fps、H.264，且包含主视频音频。
6. 最终画面不得出现播放器控件或编辑器控件。

## 命令结果

| 命令 | 状态 | 证据 |
| --- | --- | --- |
| `npm run validate:lessons` | 通过 | `lesson-01.sample.json` 已进入全量 lesson 校验。 |
| `npm run typecheck` | 通过 | TypeScript 编译检查通过。 |
| `npm run preflight:render -- lesson-01.sample` | 通过 | 主视频、输出目录、时长、音频策略和 timeline 基础规则通过。 |
| `npm run render:smoke -- lesson-01.sample` | 通过 | 输出 `out/lesson-01.sample-smoke.mp4`。 |
| `npm run render:still -- lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500` | 通过 | 输出 12 张关键帧。 |
| `npm run render:clip -- lesson-01.sample --from 236 --duration 20` | 通过 | 输出 warning 片段。 |
| `npm run render:clip -- lesson-01.sample --from 284 --duration 16` | 通过 | 输出 ability unlock 片段。 |
| `npm run render:clip -- lesson-01.sample --from 428 --duration 20` | 通过 | 输出 summary 片段。 |
| `npm run render:clip -- lesson-01.sample --from 480 --duration 22` | 通过 | 输出 homework 片段。 |
| `npm run render:lesson -- lesson-01.sample` | 通过 | 输出 `out/lesson-01-sample.mp4`。 |

完整渲染日志：

1. `渲染进度：100%`
2. `渲染成功：C:\Users\shaof\shaofan\video-shell\out\lesson-01-sample.mp4`

## 完整 MP4 核验

`ffprobe` 结果：

| 项目 | 结果 |
| --- | --- |
| 文件 | `out/lesson-01-sample.mp4` |
| 文件大小 | 66,722,016 bytes |
| 视频编码 | H.264 |
| 分辨率 | 1920 x 1080 |
| 帧率 | 30 fps |
| 视频时长 | 503.97 秒 |
| 封装时长 | 504.02 秒 |
| 视频帧数 | 15,119 |
| 音频编码 | AAC |
| 音频采样率 | 48,000 Hz |
| 音频声道 | 2 |
| 音频时长 | 504.02 秒 |

## 关键帧目检

已抽查：

1. `out/stills/lesson-01.sample/lesson-01.sample-0s.png`
2. `out/stills/lesson-01.sample/lesson-01.sample-240s.png`
3. `out/stills/lesson-01.sample/lesson-01.sample-432s.png`
4. `out/stills/lesson-01.sample/lesson-01.sample-485s.png`

目检记录：

1. 主课程视频位于画面第一优先级区域，右侧 HUD 和底部阶段条未覆盖主视频核心文字。
2. 右侧 Chapter Map、Task Tracker、Warning Panel 按阶段和事件变化。
3. 底部 CourseStageBar 表达学习阶段，不出现播放头、拖动手柄或连续播放器进度填充。
4. 讲师层使用头像 fallback，未使用 9.7 秒讲师短视频作为整节课小窗。
5. NotebookLM 标识在抽查帧中基本保留在主画面内，未被右侧栏直接盖住。
6. 未发现播放、暂停、倍速、音量、全屏、可拖动播放器进度条、表单控件或编辑器选中框。

## 事件窗口验收

| 时间窗口 | 事件 | 输出文件 | 结果 |
| --- | --- | --- | --- |
| 236-256 秒 | `warning_show` | `out/clips/lesson-01.sample-236s-20s.mp4` | 已出片。 |
| 284-300 秒 | `ability_unlock` | `out/clips/lesson-01.sample-284s-16s.mp4` | 已出片。 |
| 428-448 秒 | `summary_show` | `out/clips/lesson-01.sample-428s-20s.mp4` | 已出片。 |
| 480-502 秒 | `homework_show` | `out/clips/lesson-01.sample-480s-22s.mp4` | 已出片。 |

## 控件边界检查

最终视频层边界要求：

1. `src/remotion` 不得引用编辑器组件。
2. `src/remotion` 不得包含 `button`、`input`、`select`、`video controls`、`role="button"`、`tabIndex`、`onClick` 等交互控件或交互暗示。
3. Remotion Studio 自带控制条只属于开发工具 UI，不属于最终 MP4。

本阶段最终交付前需重新运行静态扫描并记录结果。

已运行静态扫描：

```bash
rg -n -e '<button' -e '<input' -e '<select' -e 'controls' -e 'PreviewCanvas' -e 'VideoPreviewController' -e 'EditorShell' -e 'PropertyPanel' -e 'TimelinePanel' -e 'role="button"' -e 'tabIndex' -e 'onClick' src/remotion
```

结果：无命中，退出码 1 表示未找到匹配项。

## 已知风险

1. 讲师视频只有约 9.7 秒，当前样片不代表长讲师视频小窗成功路径。
2. `lesson-01.sample.json` 的课程结构来自画面观察，建议后续由课程主理人复核文案和时间点。
3. `homework_show` 是 HUD 复盘挑战设计，不是源视频字幕原文。
4. 主视频源为 720p，最终 1080p 输出存在源清晰度上限。
5. `lesson-01.json` 仍保留占位示例语义，真实样片使用 `lesson-01.sample.json`。

## 收尾验证

第 8 阶段完成前已重新运行：

| 命令 | 状态 |
| --- | --- |
| `npm test` | 通过，包含 `validate:lessons`、`test:hud`、`test:preflight`。 |
| `npm run typecheck` | 通过。 |
| `npm run build` | 通过。 |
| `npm run preflight:render -- lesson-01.sample` | 通过。 |
| `src/remotion` 控件静态扫描 | 通过，无命中。 |

`npm test` 中的 `validate:lessons` 已确认 `lesson-01.json`、`lesson-01.sample.json` 和 `lesson-render-fixture.json` 三个 lesson 配置均校验成功。
