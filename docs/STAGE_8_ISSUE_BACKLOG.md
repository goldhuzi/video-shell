# 第 8 阶段问题 Backlog

生成日期：2026-06-17

结构化更新：2026-06-18，第 9 阶段开始前将自然语言 backlog 转为可追踪 issue 表，便于本地批量生产流程复用。

## P1

| issueId | title | severity | module | suggestedPhase | status | evidence | fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S8-P1-001 | 讲师视频素材过短，长讲师小窗链路未验收 | P1 | media / speaker | 第 9 阶段前置复核或后续真实多课验收 | open | 讲师视频约 9.7 秒；`lesson-01.sample` 使用 `speaker.displayMode = "avatar"` 与 `audio.mode = "main-only"` | 提供与主课程同长度讲师视频，或先冻结循环/隐藏策略，再单独跑 preflight、still、clip 和 full render |
| S8-P1-002 | 样片课程结构来自画面观察，未由课程主理人确认 | P1 | lesson timeline / content QA | 第 9 阶段批量前准备 | open | `lesson-01.sample.json` 按 0、92、176、300、450 秒拆 5 个阶段；非逐字稿或课程脚本 | 课程主理人复核阶段切点、提示文案、summary 和 homework；复核后更新 lesson notes 或 QA 报告 |
| S8-P1-003 | HUD 状态测试原先只覆盖 `lesson-01` | P1 | scripts / QA | 第 9 阶段 | in_progress | 第 8 阶段审查指出 `npm run test:hud` 未覆盖 `lesson-01.sample` | 增加 `test:hud -- --lesson lesson-01.sample --times ...` 参数化测试，并把真实样片关键点纳入 `npm test` |

## P2

| issueId | title | severity | module | suggestedPhase | status | evidence | fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S8-P2-001 | 用户素材文件名存在 `.mp4.mp4` 双后缀 | P2 | media naming | 后续素材导入 UX | open | 主视频与讲师视频路径为 `/input/videos/lesson-01-*.mp4.mp4` | 不重命名用户素材；后续导入 UX 给出非阻断 warning |
| S8-P2-002 | 讲师视频放在 videos 目录而非 speakers 目录 | P2 | media organization | 第 9 阶段批量报告 | open | 讲师视频实际路径为 `public/input/videos/lesson-01-speaker.mp4.mp4` | 在素材检查或批量报告中增加目录建议 warning，不阻断渲染 |
| S8-P2-003 | 主视频源为 720p，1080p 输出存在源清晰度上限 | P2 | QA / render output | 后续正式样片 | open | 主视频源为 1280 x 720，最终输出 1920 x 1080 | QA 报告保留源分辨率提示；正式宣传样片优先使用 1080p 或更高源 |
| S8-P2-004 | `homework_show` 文案是 HUD 教学设计增补，不是源视频原文 | P2 | content QA | 第 9 阶段批量前准备 | open | `event-homework-modern` 为复盘挑战文案 | 课程主理人确认该 HUD 增补文案是否进入正式样片 |

## P3

| issueId | title | severity | module | suggestedPhase | status | evidence | fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S8-P3-001 | 缺少真实样片缩略图或截图索引页 | P3 | QA evidence | 后续 QA 自动化 | open | still 文件需要人工逐张打开 | 为 `lesson-01.sample` 增加截图索引或 contact sheet |
| S8-P3-002 | still contact sheet 尚未自动生成 | P3 | QA evidence | 后续 QA 自动化 | open | 当前已有 still，但未汇总成单图 | 增加 contact sheet 脚本，减少人工检查成本 |
| S8-P3-003 | README 中真实样片命名规则仍可补强 | P3 | docs | 第 9 阶段 | open | 样片、fixture、占位 lesson 容易混淆 | 在 README 中补充真实样片与 fixture 的推荐命名规则 |

## 当前处理口径

1. P1 问题不阻断第 9 阶段“本地小团队批量工具链”建设，但阻断“正式批量生产稳定性”承诺。
2. `lesson-01.sample` 可作为第一条真实样片继续回看和内测，不能外推为多课批量生产已充分验证。
3. 第 9 阶段批量命令默认排除占位 `lesson-01`，避免把占位素材缺失误判成真实样片失败。
