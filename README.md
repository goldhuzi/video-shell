# 视频课程套壳

> 一个时间轴驱动的课程 HUD 渲染器。

[English](README.en.md) · [从这里开始](docs/START_HERE.md) · [用户手册](docs/USER_GUIDE.md) · [文档索引](docs/DOCS_INDEX.md)

## 项目简介

《视频课程套壳》是一款面向 OPC、一人公司、个人课程主理人、自媒体课程创作者和小型后期制作人员的本地视频课程 HUD 渲染工具。

用户提供主课程视频、讲师小窗视频或头像，通过本地编辑器和 lesson JSON 配置课程信息、阶段、任务、地图节点和时间轴事件，最终渲染生成一条带游戏化课程 HUD 界面的 16:9 MP4。

它不是剪辑软件、课程平台或播放器。最终视频不能出现播放、暂停、倍速、音量、全屏或可拖动播放器进度条。

## 适用人群

1. 个人课程主理人。
2. 自媒体课程创作者。
3. 小型后期制作人员。
4. 内容助理和质检人员。
5. 维护本地课程生产流程的技术人员。

## 当前能力

当前项目已完成第 10 阶段：团队交付文档与操作手册。

已具备：

1. React + TypeScript + Vite 本地编辑器。
2. Remotion `CourseShellComposition` 最终视频渲染入口。
3. lesson JSON、Zod schema 和 HUD runtime 状态推导。
4. 时间轴阶段和事件联动预览。
5. 单节 preflight、smoke、still、clip 和完整 MP4 渲染。
6. `lesson-01.sample` 真实单课样片链路。
7. 本地 course manifest。
8. lesson 清单、复制、批量校验、批量预检、批量渲染、失败重试和报告。
9. 面向小团队的中文交付文档体系。

仍不支持：

1. 云端 SaaS、登录、数据库或多人协作。
2. AI 自动识别章节、自动字幕或自动生成时间点。
3. 复杂剪辑、多轨、BGM、降噪、ducking 或专业混音。
4. 自定义播放器或最终 MP4 可点击跳转。
5. still contact sheet、`out/batches/{batchId}/` 实时状态和 `--skip-existing`。

## 快速开始

安装依赖：

```bash
npm install
```

启动编辑器：

```bash
npm run dev
```

默认地址：

```text
http://127.0.0.1:5173
```

查看 lesson：

```bash
npm run list:lessons
```

校验配置：

```bash
npm run validate:lessons
```

单节预检：

```bash
npm run preflight:render -- lesson-01.sample
```

完整入门请读 [docs/START_HERE.md](docs/START_HERE.md)。

## 常用命令

本地编辑器：

```bash
npm run dev
```

Remotion Studio：

```bash
npm run studio
```

单节渲染链路：

```bash
npm run validate:lessons
npm run preflight:render -- lesson-01.sample
npm run render:smoke -- lesson-01.sample
npm run render:still -- lesson-01.sample --times 0,30,92
npm run render:clip -- lesson-01.sample --from 236 --duration 20
npm run render:lesson -- lesson-01.sample
```

批量生产链路：

```bash
npm run list:lessons
npm run create:lesson -- --from lesson-01.sample --to lesson-02
npm run validate:all
npm run preflight:all
npm run render:all -- --dry-run
npm run render:all -- --smoke
npm run render:all
npm run render:failed -- --dry-run
```

验证：

```bash
npm run typecheck
npm test
npm run build
```

完整命令说明见 [docs/COMMAND_REFERENCE.md](docs/COMMAND_REFERENCE.md)。

## 目录结构

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

## 素材放置位置

| 类型 | 推荐路径 |
| --- | --- |
| 主视频 | `public/input/videos/lesson-01-main.mp4` |
| 讲师视频 | `public/input/speakers/lesson-01-speaker.mp4` |
| 讲师头像 | `public/input/images/shaofan-avatar.png` |
| 单节完整输出 | 由 `render.outputDir` + `render.outputName` 决定 |
| 批量完整输出 | `out/renders/` |
| 批量报告 | `out/reports/` |

素材规范见 [docs/ASSET_NAMING_AND_FOLDER_SPEC.md](docs/ASSET_NAMING_AND_FOLDER_SPEC.md)。

## 单节渲染流程

1. 准备主视频，放入 `public/input/videos/`。
2. 创建或复制 lesson：`npm run create:lesson -- --from lesson-01.sample --to lesson-02`。
3. 修改 `src/data/lessons/lesson-02.json`。
4. 运行 `npm run validate:lessons`。
5. 运行 `npm run preflight:render -- lesson-02`。
6. 运行 `npm run render:smoke -- lesson-02`。
7. 运行 still/clip 检查关键时间点。
8. 运行 `npm run render:lesson -- lesson-02`。
9. 按 QA 和交付清单检查。

## 批量渲染流程

1. 确认 `src/data/course.manifest.json`。
2. 运行 `npm run list:lessons`。
3. 运行 `npm run validate:all`。
4. 运行 `npm run preflight:all`。
5. 先运行 `npm run render:all -- --dry-run`。
6. 再运行 `npm run render:all -- --smoke`。
7. 最后运行 `npm run render:all`。
8. 失败项用 `npm run render:failed -- --dry-run` 和 `npm run render:failed` 重试。

批量手册见 [docs/BATCH_PRODUCTION_GUIDE.md](docs/BATCH_PRODUCTION_GUIDE.md)。

## 重要禁忌

1. 不提交真实课程视频、讲师视频、客户素材或派生头像。
2. 不提交 `out/` 渲染输出。
3. 不提交 `.env`、密钥或本地账号配置。
4. 不在最终视频加入播放器控件。
5. 不把 CourseStageBar 做成播放器进度条。
6. 不让 HUD 遮挡主视频核心内容。
7. 不把未来功能写成当前能力。

## 文档入口

新人入口：

1. [从这里开始](docs/START_HERE.md)
2. [用户手册](docs/USER_GUIDE.md)
3. [团队生产 SOP](docs/TEAM_PRODUCTION_SOP.md)

操作指南：

1. [命令参考](docs/COMMAND_REFERENCE.md)
2. [素材命名与目录规范](docs/ASSET_NAMING_AND_FOLDER_SPEC.md)
3. [Lesson 配置指南](docs/LESSON_CONFIG_GUIDE.md)
4. [时间轴事件指南](docs/TIMELINE_EVENT_GUIDE.md)
5. [批量生产手册](docs/BATCH_PRODUCTION_GUIDE.md)

交付与维护：

1. [QA 检查清单](docs/QA_CHECKLIST.md)
2. [故障排查手册](docs/TROUBLESHOOTING.md)
3. [交付检查清单](docs/RELEASE_CHECKLIST.md)
4. [维护指南](docs/MAINTENANCE_GUIDE.md)
5. [文档索引](docs/DOCS_INDEX.md)
6. [第 10 阶段交接说明](docs/STAGE_10_HANDOFF_NOTES.md)
7. [第 10 阶段审查报告](docs/STAGE_10_HANDOFF_REVIEW.md)

## 故障排查入口

先看 [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)。如果是命令参数问题，再看 [docs/COMMAND_REFERENCE.md](docs/COMMAND_REFERENCE.md)。

## 维护说明入口

技术维护人员先读 [docs/MAINTENANCE_GUIDE.md](docs/MAINTENANCE_GUIDE.md)，再根据任务查看 schema、scripts、Remotion 和阶段文档。

## 第 10 阶段成果记忆

阶段目标：
1. 将项目整理成小团队可持续使用的本地课程视频 HUD 生产系统。
2. 建立新人入口、用户手册、生产 SOP、角色分工、命令参考、素材规范、配置指南、时间轴指南、批量手册、QA、故障排查、交付清单、维护指南和文档索引。

已完成：
1. 新增第 10 阶段团队交付文档套件。
2. README 已收敛为项目入口。
3. 文档命令以当前 `package.json` 为准。
4. 文档路径以当前代码、manifest 和 `.gitignore` 为准。
5. 明确最终 MP4 无播放器控件、CourseStageBar 非播放器进度条、主视频优先和大文件不进 Git。

关键产物：
1. `docs/START_HERE.md`：新人入口。
2. `docs/USER_GUIDE.md`：完整用户手册。
3. `docs/TEAM_PRODUCTION_SOP.md`：团队生产 SOP。
4. `docs/COMMAND_REFERENCE.md`：命令参考。
5. `docs/DOCS_INDEX.md`：文档索引。
6. `docs/STAGE_10_HANDOFF_NOTES.md`：阶段交接说明。
7. `docs/STAGE_10_HANDOFF_REVIEW.md`：第 10 阶段审查报告。

已冻结决策：
1. 第 10 阶段只做文档交付，不开发新功能。
2. 当前正式单节链路使用 `preflight:render`、`render:smoke`、`render:still`、`render:clip` 和 `render:lesson`。
3. `render:sample` 只作为早期开发样片脚本，不作为正式验收命令。
4. 批量 smoke 使用 `render:all -- --smoke`，当前没有 `render:smoke:all`。

后续接手注意：
1. 当前没有 lesson JSON 导入、still contact sheet、`out/batches/{batchId}/` 实时状态和 `--skip-existing`。
2. `docs/MEDIA_ASSET_SPEC.md` 含早期目录口径，实际操作以 `docs/ASSET_NAMING_AND_FOLDER_SPEC.md` 为准。
3. 批量报告不替代人工视觉 QA。

下一阶段建议：
1. 进入小团队试运行，让真实团队成员独立完成 1-3 节课生产。
2. 根据试运行反馈补 lesson JSON 导入、contact sheet、批次归档和报告 next action。

## License

MIT. See [LICENSE](LICENSE).
