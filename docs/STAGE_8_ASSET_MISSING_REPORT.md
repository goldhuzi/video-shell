# 第 8 阶段素材缺失报告

生成日期：2026-06-17

## 当前结论

第 8 阶段真实单课样片生产已完成前置目录检查，但当前缺少必需的真实主课程视频，因此不能开始真实样片渲染，也不能声称 `lesson-01` 已完成真实素材验收。

当前仓库中存在第 6 阶段安全合成小样素材，例如 `stage6-review-main.mp4`、`stage6-review-speaker.mp4` 和 `stage6-review-avatar.png`。这些文件只能证明本地渲染链路可运行，不能替代用户授权真实课程素材。

## 后续状态更新

用户已在 2026-06-17 后续确认“已放好”素材。本报告保留为第 8 阶段前置阻断记录；真实素材到位后的生产说明和 QA 结果见：

1. `docs/STAGE_8_SAMPLE_PRODUCTION_NOTES.md`
2. `docs/STAGE_8_SAMPLE_QA_REPORT.md`
3. `docs/STAGE_8_ISSUE_BACKLOG.md`

实际收到的素材文件名为：

1. `public/input/videos/lesson-01-main.mp4.mp4`
2. `public/input/videos/lesson-01-speaker.mp4.mp4`

讲师视频长度不足整节课，因此后续样片采用从讲师视频首帧派生的头像 fallback：`public/input/images/lesson-01-speaker-avatar.png`。

## 已准备的素材目录

1. `public/input/videos/`：主课程视频目录。
2. `public/input/speakers/`：讲师小窗视频目录。
3. `public/input/images/`：讲师头像目录。
4. `public/assets/hud/`：默认 HUD 静态资源目录。
5. `docs/sample-lessons/`：课程脚本或时间节点草稿目录。

## 缺失的必需素材

1. `public/input/videos/lesson-01-main.mp4`

主课程视频是 P0 必需素材。缺失时 `preflight:render`、`render:smoke`、`render:still`、`render:clip` 和 `render:lesson` 都应阻断或无法完成真实样片生产。

## 建议提供的可选素材

至少提供以下两项中的一项：

1. `public/input/speakers/lesson-01-speaker.mp4`
2. `public/input/images/shaofan-avatar.png`

优先使用讲师视频。如果没有讲师视频，可以使用头像。如果两者都没有，样片可以降级为身份牌或占位，但 QA 报告必须明确记录。

## 建议提供的课程脚本或时间节点草稿

建议填写或替换：

1. `docs/sample-lessons/lesson-01-outline.md`

如果没有脚本，可以在真实主视频到位后由 Agent 观察视频内容，再手动配置阶段和时间轴事件。

## Git 安全边界

`.gitignore` 当前已保护：

1. `public/input/videos/*`，仅保留 `.gitkeep`。
2. `public/input/speakers/*`，仅保留 `.gitkeep`。
3. `public/input/images/*`，仅保留 `.gitkeep`。
4. `out/`
5. `.env` 与 `.env.*`

真实课程视频、讲师视频、头像、客户素材和渲染产物不得提交到 Git。

## 等待用户提供

请将真实授权素材放入上述目录，并确认以下至少一项已完成：

1. 已放入 `public/input/videos/lesson-01-main.mp4`。
2. 已放入 `public/input/speakers/lesson-01-speaker.mp4` 或 `public/input/images/shaofan-avatar.png`。
3. 已填写或提供 `docs/sample-lessons/lesson-01-outline.md`，如果有课程脚本或时间节点草稿。

用户确认后，第 8 阶段将继续创建真实 `lesson-01.sample.json`、配置真实 stages / timelineEvents，并运行 preflight、smoke、still、clip、full render 和 QA。
