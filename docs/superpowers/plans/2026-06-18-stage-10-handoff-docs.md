# 第 10 阶段团队交付文档执行计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将《视频课程套壳》整理成小团队可独立使用的本地课程视频 HUD 生产文档体系。

**Architecture:** 本阶段只新增和更新 Markdown 文档，不开发新产品功能。所有命令、路径、字段和输出说明必须来自当前仓库真实代码、`package.json`、schema、lesson JSON、manifest 和既有阶段文档。

**Tech Stack:** Markdown 文档、React + TypeScript + Vite + Remotion 现有项目、Node/tsx scripts、Zod schema、本地 JSON lesson 与 manifest。

---

### Task 1: 事实冻结

**Files:**
- Read: `package.json`
- Read: `src/schemas/lesson.schema.ts`
- Read: `src/schemas/course-manifest.schema.ts`
- Read: `src/data/course.manifest.json`
- Read: `scripts/*.ts`
- Read: `docs/STAGE_9_BATCH_PRODUCTION_NOTES.md`

- [ ] 核对真实 npm scripts，禁止在文档中写不存在的可用命令。
- [ ] 核对 lesson 字段、manifest 字段、时间轴事件类型和素材路径规则。
- [ ] 核对输出路径：单节、smoke、still、clip、批量 render、批量 report。
- [ ] 记录代码与旧阶段文档不一致处，写入 `docs/STAGE_10_HANDOFF_NOTES.md`。

### Task 2: 核心用户文档

**Files:**
- Create: `docs/START_HERE.md`
- Create: `docs/USER_GUIDE.md`
- Create: `docs/TEAM_PRODUCTION_SOP.md`
- Create: `docs/ROLE_GUIDE.md`

- [ ] 写新人入口，明确工具是什么、不是什么、最快跑通路径和禁忌。
- [ ] 写完整用户手册，覆盖素材、配置、时间轴、校验、单节渲染、批量渲染和 QA。
- [ ] 写团队生产 SOP，逐步说明输入、操作、命令、输出、检查标准和常见错误。
- [ ] 写角色指南，说明每个角色负责、不负责和交付物。

### Task 3: 操作参考文档

**Files:**
- Create: `docs/COMMAND_REFERENCE.md`
- Create: `docs/ASSET_NAMING_AND_FOLDER_SPEC.md`
- Create: `docs/LESSON_CONFIG_GUIDE.md`
- Create: `docs/TIMELINE_EVENT_GUIDE.md`
- Create: `docs/BATCH_PRODUCTION_GUIDE.md`

- [ ] 按 `package.json` 写命令参考和参数示例。
- [ ] 写素材命名、目录、Git 禁止项和缺失处理。
- [ ] 写 lesson 核心模块指南，匹配 schema 字段。
- [ ] 写 timeline event 指南，覆盖 9 类当前事件和最终视频边界。
- [ ] 写批量生产指南，覆盖 manifest、filter、dry-run、smoke、report 和 failed retry。

### Task 4: QA、排错、维护与索引

**Files:**
- Create: `docs/QA_CHECKLIST.md`
- Create: `docs/TROUBLESHOOTING.md`
- Create: `docs/RELEASE_CHECKLIST.md`
- Create: `docs/MAINTENANCE_GUIDE.md`
- Create: `docs/DOCS_INDEX.md`
- Create: `docs/STAGE_10_HANDOFF_NOTES.md`

- [ ] 写可勾选 QA 清单和交付清单。
- [ ] 写常见故障排查，按现象、可能原因、解决步骤、相关文件或命令组织。
- [ ] 写技术维护说明，覆盖代码位置、字段扩展、event 扩展、模板维护和验证命令。
- [ ] 写文档索引，按读者分组并列出 0-10 阶段文档。
- [ ] 写阶段交接说明，记录新增文档、未做事项、已知限制和后续建议。

### Task 5: 入口更新与验证

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.MD`
- Create: `docs/STAGE_10_HANDOFF_REVIEW.md`

- [ ] 将 README 压缩为项目入口，详细内容导向 docs。
- [ ] 更新 README 文档地图、推荐阅读和第 10 阶段成果记忆。
- [ ] 更新 AGENTS.MD 长期记忆和第 10 阶段成果记忆。
- [ ] 运行可行验证命令：`npm run typecheck`、`npm run validate:lessons`、`npm run list:lessons`、`npm run validate:all`、`npm run preflight:all`、`npm test`。
- [ ] 运行文档命令真实性扫描，确保可用命令均在 `package.json` 中。
- [ ] 生成第 10 阶段审查报告。
