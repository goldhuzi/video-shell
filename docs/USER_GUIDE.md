# 用户手册

这份文档面向课程制作团队，说明如何从素材准备到最终 MP4 交付。当前版本是本地工具，所有命令都在项目根目录运行。

## 工具简介

《视频课程套壳》用 React + Remotion 把课程视频渲染成带 HUD 的 16:9 MP4。用户通过 lesson JSON 和本地编辑器配置课程信息、讲师信息、阶段、任务、地图和时间轴事件。

最终视频是成片，不是播放器。最终 MP4 不能点击、不能拖动、不能暂停，也不能包含播放器控件。

## 适合谁用

1. 个人课程主理人。
2. 自媒体课程创作者。
3. 小型后期制作人员。
4. 内容助理和质检人员。

如果你需要复杂剪辑、自动字幕、在线课程平台、云端协作或 AI 自动章节识别，当前版本暂不支持。

## 输入是什么

必需输入：

1. 主课程视频。
2. 课程标题、本节标题、课程编号和主线任务。
3. 课程阶段 `stages`。
4. 时间轴事件 `timelineEvents`。

可选输入：

1. 讲师视频。
2. 讲师头像。
3. 讲师身份信息。
4. 课程地图节点。
5. 任务和提示文案。

## 输出是什么

单节渲染输出来自 lesson 的 `render.outputDir` 和 `render.outputName`。例如：

```text
out/lesson-01-sample.mp4
```

批量渲染默认输出到 manifest 的 `project.defaultOutputDir`，当前为：

```text
out/renders/
```

批量报告默认输出到：

```text
out/reports/
```

`out/` 是渲染产物目录，不提交 Git。

## 项目目录说明

```text
src/data/lessons/              lesson JSON 配置
src/data/course.manifest.json  本地课程 manifest
src/schemas/                   Zod schema
src/editor/                    本地编辑器
src/remotion/                  最终视频渲染入口
src/components/hud/            HUD 展示组件
scripts/                       校验、预检、渲染和批量脚本
public/input/videos/           主课程视频
public/input/speakers/         讲师视频
public/input/images/           讲师头像或派生图片
out/                           本地输出，忽略提交
docs/                          项目文档
```

## 安装依赖

```bash
npm install
```

## 启动编辑器

```bash
npm run dev
```

默认地址：

```text
http://127.0.0.1:5173
```

编辑器中的播放器控件只用于配置时间点，不会进入最终 MP4。

## 打开 Remotion Studio

```bash
npm run studio
```

Remotion Studio 自带的播放控制条是开发工具界面，不属于最终视频内容。

## 创建 lesson

先查看当前 lesson：

```bash
npm run list:lessons
```

从已有 lesson 复制：

```bash
npm run create:lesson -- --from lesson-01.sample --to lesson-02
```

这条命令会创建：

```text
src/data/lessons/lesson-02.json
```

并更新：

```text
src/data/course.manifest.json
```

注意：`create:lesson` 不复制素材。新 lesson 默认 `batchRender=false`，需要人工替换素材和时间轴后再进入批量渲染。

## 修改课程信息

在 lesson JSON 的 `meta` 中修改：

1. `courseTitle`：课程标题。
2. `lessonTitle`：本节标题。
3. `chapterTitle`：章节标题。
4. `lessonIndex` 和 `totalLessons`：课程序号。
5. `courseCode`：课程代号。
6. `mainMission`：主线任务。

这些字段会影响顶部栏和课程说明。

## 添加主视频

把主视频放到：

```text
public/input/videos/
```

在 lesson JSON 中使用以 `/input/videos/` 开头的路径：

```json
"media": {
  "mainVideo": {
    "src": "/input/videos/lesson-02-main.mp4",
    "required": true
  }
}
```

不要写本机绝对路径，例如 `C:\...`。当前正式预检不支持远程 URL、`file:`、`data:` 或 `blob:`。

主视频缺失会阻断 `preflight:render`、`render:smoke` 和 `render:lesson`。

## 添加讲师视频或头像

讲师视频建议放到：

```text
public/input/speakers/
```

讲师头像建议放到：

```text
public/input/images/
```

如果讲师视频短于整节课，不要强行作为整节课小窗。可改用头像、身份牌或隐藏讲师卡。

常用字段：

1. `media.useSpeakerVideo`
2. `media.speakerVideo.src`
3. `media.speakerImage.src`
4. `speaker.displayMode`
5. `speaker.missingAssetBehavior`

## 配置任务追踪

任务在 `tasks` 中配置。每个任务需要：

1. `id`
2. `label`
3. `title`
4. `order`
5. 可选 `stageId`

任务会影响 TaskTracker。任务状态可以由当前阶段默认推导，也可以由 `task_active` 和 `task_done` 事件控制。

## 配置课程地图

课程地图在 `chapterMap.nodes` 中配置。每个节点需要：

1. `id`
2. `label`
3. `order`
4. 可选 `stageId`

地图节点会影响 ChapterMap。节点可以由阶段默认联动，也可以由 `map_node_active` 事件点亮。

## 配置课程阶段条

阶段在 `stages` 中配置。每个阶段至少需要：

1. `id`
2. `label`
3. `name`
4. `startTime`
5. `order`
6. `enabled`

建议填写 `endTime`、`shortName`、`mapNodeId`、`defaultTaskId` 和 `defaultHintId`。

CourseStageBar 是学习导航，不是播放器进度条。最终 MP4 中不可点击，也没有播放头、拖动手柄或连续进度填充。

## 配置时间轴事件

事件在 `timelineEvents` 中配置。当前主要事件类型：

```text
stage_change
map_node_active
task_active
task_done
tip_show
warning_show
ability_unlock
summary_show
homework_show
```

每个事件通常需要：

1. `id`
2. `type`
3. `startTime`
4. `targetComponent`
5. `payload`
6. `priority`
7. `enabled`

提示、警告、总结、作业类事件必须有 `endTime` 或 `duration`。

## 校验配置

检查所有 lesson JSON：

```bash
npm run validate:lessons
```

批量 schema 校验并生成报告：

```bash
npm run validate:all
```

`validate:all` 只检查 JSON/schema，不检查真实素材是否存在。素材检查用 `preflight:render` 或 `preflight:all`。

## 单节渲染

先预检：

```bash
npm run preflight:render -- lesson-02
```

再出 8 秒 smoke：

```bash
npm run render:smoke -- lesson-02
```

再出关键帧：

```bash
npm run render:still -- lesson-02 --times 0,30,90,180
```

必要时出关键片段：

```bash
npm run render:clip -- lesson-02 --from 120 --duration 20
```

最后完整渲染：

```bash
npm run render:lesson -- lesson-02
```

`render:lesson` 的输出路径来自 lesson 的 `render.outputDir` 和 `render.outputName`。当前命令不支持在 CLI 中覆盖输出路径。

## 批量渲染

批量命令读取：

```text
src/data/course.manifest.json
```

查看清单：

```bash
npm run list:lessons
```

批量校验：

```bash
npm run validate:all
```

批量预检：

```bash
npm run preflight:all
```

先 dry-run：

```bash
npm run render:all -- --dry-run
```

批量 smoke：

```bash
npm run render:all -- --smoke
```

完整批量渲染：

```bash
npm run render:all
```

失败重试：

```bash
npm run render:failed -- --dry-run
npm run render:failed
```

完整批量渲染是串行执行，可能耗时较长。

## 查看输出

单节 smoke：

```text
out/{lessonId}-smoke.mp4
```

still：

```text
out/stills/{lessonId}/
```

clip：

```text
out/clips/
```

批量 full render：

```text
out/renders/
```

批量 smoke：

```text
out/renders/smoke/
```

批量报告：

```text
out/reports/
```

## 检查成片

至少检查：

1. 主视频是否清楚。
2. HUD 是否遮挡主视频核心内容。
3. 时间轴事件是否按时出现和消失。
4. 音频是否正常，有无回声。
5. 最终 MP4 是否无播放器控件。
6. CourseStageBar 是否仍是课程阶段导航。
7. 输出是否为 1920 x 1080。

详细检查见 `docs/QA_CHECKLIST.md`。

## 常见错误入口

遇到失败先看：

```text
docs/TROUBLESHOOTING.md
```

再看命令参考：

```text
docs/COMMAND_REFERENCE.md
```

## 团队交付建议

1. 课程主理人先确认课程结构和阶段。
2. 后期制作人员负责素材、时间点和渲染。
3. 内容助理负责文案短句化。
4. 质检人员按 QA 和 Release 清单放行。
5. 技术维护人员只在命令、schema、预检或渲染失败时介入。
