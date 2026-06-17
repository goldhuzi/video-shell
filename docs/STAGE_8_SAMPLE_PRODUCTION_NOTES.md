# 第 8 阶段真实单课样片生产说明

生成日期：2026-06-17

## 阶段目标

第 8 阶段目标是使用用户授权真实课程素材，跑通一条真实单节课样片生产路径，并用 preflight、smoke、still、clip 和 full render 形成可复查证据。

本阶段仍遵守项目边界：

1. 本地单节课渲染。
2. 手动配置课程阶段和时间轴事件。
3. 不引入云端、登录、数据库、批量队列、AI 自动识别、自动字幕、BGM、降噪、ducking 或复杂剪辑。
4. 最终 MP4 不出现播放、暂停、倍速、音量、全屏、可拖动播放器进度条或编辑器控件。

## Course HUD Director Agent 分工

1. `事实边界审稿人`：确认第 8 阶段只做真实素材样片、QA 和 backlog，不扩大产品边界。
2. `隐私与授权官`：检查真实素材目录和 `.gitignore`，确认素材与输出不进入 Git。
3. `教学设计专家`：根据真实视频观察结果规划阶段、任务、提示和复盘事件。
4. `证据与截图验收员`：设计并执行 preflight、smoke、still、clip 和 full render 证据链。
5. `Course HUD Director Agent`：合并各岗位结果，决定素材 fallback、lesson 配置和阶段收尾文档。

## 真实素材清单

用户已放入以下真实素材：

| 类型 | 实际路径 | 说明 |
| --- | --- | --- |
| 主课程视频 | `public/input/videos/lesson-01-main.mp4.mp4` | 必需素材，真实课程主视频。 |
| 讲师视频 | `public/input/videos/lesson-01-speaker.mp4.mp4` | 可选素材，时长仅约 9.7 秒。 |
| 派生头像 | `public/input/images/lesson-01-speaker-avatar.png` | 从讲师视频首帧派生，用于整节课小窗展示。 |

素材说明：

1. 用户提供的文件名保留双后缀 `.mp4.mp4`，本阶段不移动或重命名用户原文件。
2. 讲师视频实际放在 `public/input/videos/`，样片配置按实际路径引用。
3. 讲师视频明显短于主课程视频，因此本阶段采用 `speaker.displayMode = "avatar"` 与 `media.useSpeakerVideo = false`。
4. 音频策略采用 `audio.mode = "main-only"`，避免讲师短视频音频在完整样片中断档或造成混音风险。

## 媒体探测结果

| 文件 | 编码与尺寸 | 帧率 | 时长 | 音频 |
| --- | --- | --- | --- | --- |
| `lesson-01-main.mp4.mp4` | H.264，1280 x 720 | 24 fps | 503.94 秒 | AAC，约 503.94 秒 |
| `lesson-01-speaker.mp4.mp4` | H.264，1080 x 1920 | 30 fps | 9.71 秒 | AAC，约 9.71 秒 |

最终样片输出仍为项目固定规格：1920 x 1080、30 fps、MP4/H.264。

## 样片配置

本阶段新增：

1. `src/data/lessons/lesson-01.sample.json`
2. `docs/sample-lessons/lesson-01-outline.md`

没有直接替换 `src/data/lessons/lesson-01.json`，原因是保留原始示例配置和占位素材预检保护语义，真实样片使用独立 lesson id `lesson-01.sample`。

课程基础信息：

1. 课程标题：`人类简史精读`
2. 本节标题：`虚构故事如何组织人类合作`
3. 课程编号：`SAPIENS`
4. 主线任务：理解智人如何用共同故事完成大规模协作。

阶段结构：

| 时间 | 阶段 | 学习任务 |
| --- | --- | --- |
| 0-92 秒 | 课程开场与核心问题 | 抓住课程问题 |
| 92-176 秒 | 多物种人类与智人优势 | 比较人类物种 |
| 176-300 秒 | 认知革命与虚构故事 | 识别虚构故事 |
| 300-450 秒 | 智人扩散与社会结构 | 梳理扩散路径 |
| 450-503.94 秒 | 石器时代大脑与现代世界 | 连接现代世界 |

## 已执行命令

```bash
npm run validate:lessons
npm run typecheck
npm run preflight:render -- lesson-01.sample
npm run render:smoke -- lesson-01.sample
npm run render:still -- lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500
npm run render:clip -- lesson-01.sample --from 236 --duration 20
npm run render:clip -- lesson-01.sample --from 284 --duration 16
npm run render:clip -- lesson-01.sample --from 428 --duration 20
npm run render:clip -- lesson-01.sample --from 480 --duration 22
npm run render:lesson -- lesson-01.sample
```

## 输出产物

| 产物 | 路径 | 用途 |
| --- | --- | --- |
| 8 秒 smoke | `out/lesson-01.sample-smoke.mp4` | 快速验证真实素材路径和 composition 起片。 |
| 关键帧 still | `out/stills/lesson-01.sample/*.png` | 验证关键时间点 HUD 状态与遮挡。 |
| warning 片段 | `out/clips/lesson-01.sample-236s-20s.mp4` | 验证 `warning_show`。 |
| ability 片段 | `out/clips/lesson-01.sample-284s-16s.mp4` | 验证 `ability_unlock`。 |
| summary 片段 | `out/clips/lesson-01.sample-428s-20s.mp4` | 验证 `summary_show`。 |
| homework 片段 | `out/clips/lesson-01.sample-480s-22s.mp4` | 验证 `homework_show`。 |
| 完整样片 | `out/lesson-01-sample.mp4` | 第 8 阶段真实单课样片。 |

`out/` 和 `public/input/...` 下的真实素材、派生头像、渲染产物都不提交到 Git。

完整样片核验结果：

1. 文件大小：66,722,016 bytes。
2. 视频：H.264，1920 x 1080，30 fps，503.97 秒。
3. 音频：AAC，48 kHz，双声道，504.02 秒。
4. 输出日志：`render:lesson` 到达 `渲染进度：100%` 并输出 `渲染成功`。

## 当前限制

1. `lesson-01.sample.json` 的阶段和事件来自视频画面观察，不是逐字稿或完整脚本标注。
2. 讲师素材时长不足整节课，当前使用头像 fallback，不验证长讲师视频小窗。
3. 主视频源为 1280 x 720，最终输出为 1920 x 1080，清晰度受源视频限制。
4. `npm run test:hud` 仍针对原 `lesson-01.json` 的固定关键点，不覆盖 `lesson-01.sample.json`；本阶段用真实 still/clip 做样片事件验收。
