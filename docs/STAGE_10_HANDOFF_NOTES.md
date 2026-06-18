# 第 10 阶段交接说明

生成日期：2026-06-18

## 本阶段完成了什么

第 10 阶段完成《视频课程套壳》的团队交付文档与操作手册整理。目标是让小团队成员不依赖开发者口头解释，也能准备素材、创建 lesson、配置时间轴、运行校验、单节渲染、批量渲染、检查成片、排查常见错误并完成最终交付。

本阶段只做文档、流程、检查清单、故障排查、角色分工和维护说明，没有开发新产品功能。

## 本阶段没有做什么

1. 没有新增云端系统。
2. 没有新增登录系统。
3. 没有新增数据库。
4. 没有新增复杂编辑器。
5. 没有新增 AI 自动识别。
6. 没有新增自动字幕。
7. 没有新增自定义播放器。
8. 没有新增剪辑、BGM、降噪、ducking 或专业混音。
9. 没有修改核心渲染逻辑。
10. 没有把播放器控件加入最终视频。

## 新增文档列表

1. `docs/START_HERE.md`：新人入口。
2. `docs/USER_GUIDE.md`：完整用户手册。
3. `docs/TEAM_PRODUCTION_SOP.md`：小团队生产 SOP。
4. `docs/ROLE_GUIDE.md`：团队角色分工。
5. `docs/COMMAND_REFERENCE.md`：真实 npm 命令参考。
6. `docs/ASSET_NAMING_AND_FOLDER_SPEC.md`：素材命名与目录规范。
7. `docs/LESSON_CONFIG_GUIDE.md`：lesson 配置说明。
8. `docs/TIMELINE_EVENT_GUIDE.md`：时间轴事件指南。
9. `docs/BATCH_PRODUCTION_GUIDE.md`：批量生产手册。
10. `docs/QA_CHECKLIST.md`：质量检查清单。
11. `docs/TROUBLESHOOTING.md`：故障排查手册。
12. `docs/RELEASE_CHECKLIST.md`：交付检查清单。
13. `docs/MAINTENANCE_GUIDE.md`：技术维护指南。
14. `docs/DOCS_INDEX.md`：文档索引。
15. `docs/STAGE_10_HANDOFF_NOTES.md`：本阶段交接说明。
16. `docs/STAGE_10_HANDOFF_REVIEW.md`：第 10 阶段审查报告。
17. `docs/superpowers/plans/2026-06-18-stage-10-handoff-docs.md`：本阶段执行计划。

## 更新文档列表

1. `README.md`：更新为项目入口、常用路径、文档入口和第 10 阶段成果记忆。
2. `AGENTS.MD`：更新长期项目记忆和第 10 阶段成果记忆。

## 当前项目可交付状态

当前项目具备：

1. 本地编辑器入口。
2. lesson JSON schema 校验。
3. 单节 preflight、smoke、still、clip 和完整 render。
4. 真实单课样片配置 `lesson-01.sample`。
5. 本地 manifest。
6. lesson 清单、复制、批量校验、批量预检、批量渲染、失败重试和批量报告。
7. 团队交付文档体系。

当前可以进入小团队试运行：让真实团队成员按照文档独立完成 1-3 节课的视频套壳生产。

## 已知限制

1. `lesson-01.sample` 只证明一条真实单课样片链路可出片，不代表正式多课批量稳定性。
2. 长讲师视频小窗链路仍未充分验收。
3. 真实样片阶段和 HUD 文案仍建议课程主理人复核。
4. 当前没有 lesson JSON 可视化导入能力。
5. 当前没有 still contact sheet。
6. 当前没有 `out/batches/{batchId}/` 批次归档和实时 state 文件。
7. 当前没有 `--skip-existing`。
8. 当前没有云端、登录、数据库、自动字幕、AI 自动识别或复杂剪辑能力。
9. 批量报告不替代人工视觉 QA。

## 文档与实际命令一致性检查结果

第 10 阶段文档命令以当前 `package.json` 为准。已写入的可运行命令包括：

```text
dev
studio
render:sample
preflight:render
render:lesson
render:smoke
render:still
render:clip
list:lessons
create:lesson
validate:all
preflight:all
render:all
render:failed
batch:list
batch:create
batch:validate
batch:preflight
batch:render
batch:render:failed
test
test:hud
test:hud:sample
test:preflight
validate:lessons
typecheck
build
```

文档明确标记当前不存在的命令和能力，例如 `render:smoke:all`、`render:still:all`、`contact-sheet`、`import:lesson`、`lint`、`--skip-existing`。

## 路径一致性说明

第 10 阶段操作文档以当前代码路径为准：

1. 主视频：`public/input/videos/`
2. 讲师视频：`public/input/speakers/`
3. 头像：`public/input/images/`
4. lesson：`src/data/lessons/{lessonId}.json`
5. manifest：`src/data/course.manifest.json`
6. 单节 smoke：`out/{lessonId}-smoke.mp4`
7. still：`out/stills/{lessonId}/`
8. clip：`out/clips/`
9. 批量 render：`out/renders/`
10. 批量 smoke：`out/renders/smoke/`
11. 批量 report：`out/reports/`

早期 `docs/MEDIA_ASSET_SPEC.md` 中出现的旧素材目录口径作为历史设计参考。实际操作以 `docs/ASSET_NAMING_AND_FOLDER_SPEC.md` 为准。

## 代码与旧文档差异记录

1. `render:sample` 是早期开发样片脚本，硬编码读取 `lesson-01.json` 并输出 60 秒样片，不等同正式真实素材验收链路。
2. 第 9 阶段批量 smoke 是 `npm run render:all -- --smoke`，当前不存在 `render:smoke:all`。
3. 当前批量渲染不支持 `--skip-existing`。
4. 当前 `create:lesson` 只复制 JSON，不复制素材。
5. 当前 `validate:all` 只做 JSON/schema 校验，不检查真实素材。
6. 当前 `preflight:all` 默认只处理 `enabled=true` lesson。
7. 当前 `render:all` 默认只处理 `enabled=true` 且 `batchRender=true` lesson。
8. `lesson-01.sample` 的讲师视频历史上实际放在 `public/input/videos/`，新项目建议放到 `public/input/speakers/`。

## 推荐团队试运行流程

1. 新成员先读 `docs/START_HERE.md` 和 `docs/USER_GUIDE.md`。
2. 后期制作人员复制 `lesson-01.sample` 为 `lesson-02`。
3. 准备一条授权主视频并放入 `public/input/videos/`。
4. 按 `docs/LESSON_CONFIG_GUIDE.md` 和 `docs/TIMELINE_EVENT_GUIDE.md` 修改配置。
5. 运行 `validate:lessons`、`preflight:render`、`render:smoke`、`render:still`。
6. 质检人员按 `docs/QA_CHECKLIST.md` 检查。
7. 完整渲染 `render:lesson`。
8. 课程主理人按 `docs/RELEASE_CHECKLIST.md` 放行。
9. 将多个 lesson 写入 manifest，跑 `validate:all`、`preflight:all`、`render:all -- --dry-run`、`render:all -- --smoke`。
10. 再决定是否完整批量渲染。

## 后续维护建议

1. 增加 lesson JSON 导入能力。
2. 增加 still contact sheet。
3. 增加 `out/batches/{batchId}/` 批次归档和实时 state 文件。
4. 为批量报告增加 issue code 聚合和 next action 字段。
5. 至少再用一条不同真实课程素材跑完整链路。
6. 验收长讲师视频小窗和讲师音频。
7. 如果需要 lint，先真实新增 `package.json` 脚本，再更新文档。

## 项目下一步建议

进入“小团队试运行”阶段。试运行目标：

```text
让真实团队成员不依赖开发者，独立完成至少 1-3 节课的视频套壳生产。
```

试运行后再根据反馈决定是否进入自动导入、contact sheet、批次归档或更正式的批量生产稳定性建设。
