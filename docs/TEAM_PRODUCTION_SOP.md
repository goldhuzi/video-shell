# 团队生产 SOP

这份 SOP 用于小团队按固定流程生产课程 HUD 套壳视频。每一步都说明目标、输入、操作、命令、输出、检查标准和常见错误。

## SOP-01：创建新 lesson

目标：从已有配置复制出一节新课。

输入：

1. 源 lesson id，例如 `lesson-01.sample`。
2. 新 lesson id，例如 `lesson-02`。

操作步骤：

1. 查看当前清单。
2. 确认目标 lesson id 不存在。
3. 复制 lesson。
4. 打开新 JSON，准备替换课程信息和素材路径。

命令：

```bash
npm run list:lessons
npm run create:lesson -- --from lesson-01.sample --to lesson-02
```

输出：

```text
src/data/lessons/lesson-02.json
src/data/course.manifest.json
```

检查标准：

1. `list:lessons` 能看到新 lesson。
2. 新 lesson 默认不是直接进入正式批量渲染状态。
3. 配置中素材路径还需要人工替换。

常见错误：

1. 目标 lesson 已存在：如确实要覆盖，使用 `--force`，但必须先确认不会覆盖别人正在编辑的配置。
2. 源 lesson 不存在：先运行 `npm run list:lessons` 查 id。

## SOP-02：准备素材

目标：把主视频、讲师视频和头像放到正确目录。

输入：

1. 主课程视频。
2. 可选讲师视频。
3. 可选讲师头像。

操作步骤：

1. 将主视频放入 `public/input/videos/`。
2. 将讲师视频放入 `public/input/speakers/`，如果真实素材已在 `public/input/videos/` 也可以按实际路径引用。
3. 将头像放入 `public/input/images/`。
4. 记录素材文件名、时长、分辨率和授权来源。

命令：

```bash
npm run preflight:render -- lesson-02
```

输出：

1. 素材位于 `public/input/`。
2. lesson JSON 中使用 `/input/...` 路径。

检查标准：

1. 主视频存在且可播放。
2. 主视频音频正常。
3. 文件名不使用本机绝对路径。
4. 真实素材不被 Git 跟踪。

常见错误：

1. `MAIN_VIDEO_MISSING`：主视频路径写错或文件没放进去。
2. 使用 `C:\...` 绝对路径：改成 `/input/videos/...`。

## SOP-03：填写课程基础信息

目标：让顶部栏、讲师卡和输出文件名正确。

输入：

1. 课程标题。
2. 本节标题。
3. 课程编号。
4. 讲师姓名和身份。
5. 输出文件名。

操作步骤：

1. 修改 `meta.courseTitle`、`meta.lessonTitle`、`meta.courseCode`、`meta.mainMission`。
2. 修改 `speaker.name`、`speaker.title`、`speaker.role`。
3. 修改 `render.outputDir` 和 `render.outputName`。
4. 默认建议 `audio.mode = "main-only"`。

命令：

```bash
npm run validate:lessons
```

输出：

1. 校验通过的 lesson JSON。
2. 正确的顶部栏和输出命名。

检查标准：

1. `render.outputName` 以 `.mp4` 结尾。
2. 标题不过长。
3. 课程编号和 lesson 顺序正确。

常见错误：

1. `render.outputName` 包含目录：目录写到 `render.outputDir`，文件名只写 `xxx.mp4`。
2. `totalLessons < lessonIndex`：修正总课数或当前课序号。

## SOP-04：配置时间轴

目标：让阶段、地图、任务、提示、总结和作业随视频时间变化。

输入：

1. 主视频时长。
2. 阶段切点。
3. 任务列表。
4. 地图节点。
5. 关键提示和作业文案。

操作步骤：

1. 配置 `stages`。
2. 配置 `tasks`。
3. 配置 `chapterMap.nodes`。
4. 配置 `warning.items`。
5. 配置 `timelineEvents`。
6. 对提示、警告、总结、作业事件填写 `endTime` 或 `duration`。

命令：

```bash
npm run validate:lessons
npm run test:hud -- --lesson lesson-02 --times 0,30,90,180
```

输出：

1. 可通过 schema 的时间轴配置。
2. 关键时间点 HUD 状态测试结果。

检查标准：

1. 阶段开始时间递增。
2. 阶段不重叠。
3. 事件不超过渲染时长。
4. 事件引用的 `stageId`、`taskId`、`nodeId`、`hintId` 存在。

常见错误：

1. 提示事件没有持续时间。
2. `targetComponent` 与事件类型不匹配。
3. 文案太长，后续 QA 发现遮挡或不可读。

## SOP-05：单节预检

目标：正式渲染前发现阻断问题。

输入：

1. 已配置的 lesson JSON。
2. 已放入的素材。

操作步骤：

1. 先跑全量校验。
2. 再跑单节预检。
3. 按错误字段修复。
4. 预检通过前不要渲染。

命令：

```bash
npm run validate:lessons
npm run preflight:render -- lesson-02
```

输出：

1. 预检日志。
2. 输出路径、时长、错误和警告。

检查标准：

1. 无 error。
2. warning 已被理解和记录。
3. 主视频存在。
4. 输出目录可写。

常见错误：

1. 主视频缺失。
2. `audio.mode=mix` 但讲师视频缺失。
3. 输出目录超出项目目录。

## SOP-06：单节 smoke

目标：快速确认 composition 能起片。

输入：

1. 预检通过的 lesson。

操作步骤：

1. 渲染 8 秒 smoke。
2. 打开 smoke 文件。
3. 检查开头画面、音频、主视频和 HUD 基础布局。

命令：

```bash
npm run render:smoke -- lesson-02
```

输出：

```text
out/lesson-02-smoke.mp4
```

检查标准：

1. MP4 可播放。
2. 前 8 秒有主视频和 HUD。
3. 没有播放器控件。

常见错误：

1. 误以为 smoke 通过等于整节课通过。smoke 只覆盖前 8 秒，仍需 still/clip。

## SOP-07：单节完整渲染

目标：输出完整 MP4。

输入：

1. 预检通过的 lesson。
2. smoke 已通过。
3. 关键时间点已检查或准备检查。

操作步骤：

1. 必要时先输出 still/clip。
2. 完整渲染。
3. 记录输出路径。
4. 交给质检人员。

命令：

```bash
npm run render:still -- lesson-02 --times 0,30,90,180
npm run render:clip -- lesson-02 --from 120 --duration 20
npm run render:lesson -- lesson-02
```

输出：

1. `out/stills/lesson-02/`
2. `out/clips/`
3. lesson 指定的完整 MP4。

检查标准：

1. 渲染日志到达 100%。
2. 输出文件存在。
3. 文件可播放。

常见错误：

1. 输出文件被覆盖：当前渲染遇到同名文件会覆盖，并打印提示。
2. 渲染时间长：完整视频渲染可能耗时，先用 still/clip 定位问题。

## SOP-08：样片 QA

目标：决定单节成片是否可交付。

输入：

1. smoke、still、clip 和完整 MP4。
2. `docs/QA_CHECKLIST.md`。

操作步骤：

1. 检查主视频可读性。
2. 检查 HUD 遮挡。
3. 检查阶段、地图、任务、提示。
4. 检查音频。
5. 检查最终视频无播放器控件。
6. 记录通过、带问题通过或不通过。

命令：

```bash
npm run render:still -- lesson-02 --times 0,30,90,180
```

输出：

1. QA 记录。
2. 问题清单。
3. 放行结论。

检查标准：

1. QA 清单无 P0。
2. 主视频优先原则成立。
3. CourseStageBar 未播放器化。

常见错误：

1. 只看开头，不看后半段事件。
2. 忽略 `audio.mode=mix` 的回声风险。

## SOP-09：批量校验

目标：检查 manifest 中 lesson JSON 是否有效。

输入：

1. `src/data/course.manifest.json`
2. `src/data/lessons/*.json`

操作步骤：

1. 查看 lesson 清单。
2. 运行批量校验。
3. 打开报告。

命令：

```bash
npm run list:lessons
npm run validate:all
```

输出：

```text
out/reports/batch-validate-*.json
out/reports/batch-validate-*.md
out/reports/batch-validate-latest.json
out/reports/batch-validate-latest.md
```

检查标准：

1. 无 failed。
2. 未登记 lesson 已被识别并处理。

常见错误：

1. 以为 `validate:all` 会检查视频文件。它只检查 JSON/schema。

## SOP-10：批量 preflight

目标：批量检查真实素材、时长、音频和 timeline 风险。

输入：

1. manifest 中启用的 lesson。
2. 已放入的素材。

操作步骤：

1. 默认检查 `enabled=true` 的 lesson。
2. 如需包含 disabled lesson，使用 `--include-disabled` 或 `--all`。
3. 打开报告处理错误。

命令：

```bash
npm run preflight:all
npm run preflight:all -- --all
```

输出：

```text
out/reports/batch-preflight-*.json
out/reports/batch-preflight-*.md
```

检查标准：

1. 正式批量前无 error。
2. warning 已记录。

常见错误：

1. 占位 lesson 被纳入检查后失败，这是预期保护，不代表渲染器坏了。

## SOP-11：批量渲染

目标：顺序渲染 manifest 中可批量渲染的 lesson。

输入：

1. `enabled=true`
2. `batchRender=true`
3. preflight 通过。

操作步骤：

1. 先 dry-run。
2. 再批量 smoke。
3. 确认无阻断后完整批量渲染。
4. 查看报告。

命令：

```bash
npm run render:all -- --dry-run
npm run render:all -- --smoke
npm run render:all
```

输出：

```text
out/renders/
out/renders/smoke/
out/reports/batch-render-*.md
```

检查标准：

1. dry-run 输出路径正确。
2. smoke 文件可播放。
3. full render 报告没有 failed。

常见错误：

1. 直接运行完整批量导致耗时很长。日常先用 `--dry-run` 或 `--smoke`。

## SOP-12：失败重试

目标：只重试最近批量渲染失败的 lesson。

输入：

1. 最近一次 render report，默认 `out/reports/batch-render-latest.json`。

操作步骤：

1. 打开报告，确认失败原因。
2. 修复素材或配置。
3. 先 dry-run。
4. 再正式重试。

命令：

```bash
npm run render:failed -- --dry-run
npm run render:failed
npm run render:failed -- --report out/reports/batch-render-latest.json
```

输出：

1. 新的批量渲染报告。
2. 失败项对应输出。

检查标准：

1. 重试清单与失败报告一致。
2. 修复后无 failed。

常见错误：

1. 失败 lesson 已从 manifest 删除，重试会报告无法找到。

## SOP-13：最终交付

目标：把通过 QA 的 MP4 交付给课程团队或客户。

输入：

1. 完整 MP4。
2. QA 记录。
3. 批量报告。
4. `docs/RELEASE_CHECKLIST.md`。

操作步骤：

1. 课程主理人确认内容。
2. 质检人员确认画面、音频、时间轴和无控件。
3. 后期制作人员整理输出。
4. 技术维护人员确认 Git 不包含真实素材或 `out/`。

命令：

```bash
git status --short
```

输出：

1. 最终 MP4。
2. QA/Release 记录。
3. 问题和例外说明。

检查标准：

1. 没有真实视频、讲师视频、客户素材、密钥或 `out/` 文件进入 Git。
2. 最终 MP4 无播放器控件。
3. CourseStageBar 是阶段导航。
4. 主视频可读。

常见错误：

1. 把 `public/input/videos/` 或 `out/` 下文件加入 Git。发现后立即停止提交，交给技术维护人员处理。
