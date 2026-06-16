# 贡献指南

感谢你关注《视频课程套壳》。这个项目仍处在 MVP 骨架与规格联动阶段，贡献重点是把“时间轴驱动的课程 HUD 渲染器”做稳、做清晰、做可复用。

English readers can start from [README.en.md](README.en.md).

## 贡献方向

优先欢迎以下方向：

1. 本地编辑器真实配置编辑、保存、导入和导出。
2. lesson schema、时间轴事件和 HUD 状态计算。
3. Remotion composition、素材 fallback、渲染质量和导出体验。
4. HUD 视觉组件的一致性和可读性。
5. 中英文文档、快速开始、示例配置和验收说明。

暂不优先：

1. 云端 SaaS。
2. 登录、支付、课程售卖。
3. 完整剪辑软件能力。
4. 自由拖拽设计器。
5. AI 自动章节识别。

## 本地开发

```bash
npm install
npm run dev
npm run validate:lessons
npm run typecheck
npm run build
```

如需验证 Remotion：

```bash
npm run studio
npm run render:sample
```

## 分支与提交

建议分支命名：

```text
feature/editor-save-flow
fix/timeline-state
docs/english-entry
chore/project-cleanup
```

提交信息建议简洁明确：

```text
Add lesson config validation
Fix stage status derivation
Update getting started docs
```

## 文档同步要求

如果你的改动影响以下内容，请同步更新文档：

1. 产品边界或 MVP 范围：更新 `README.md` 和 `AGENTS.MD`。
2. 数据模型或 schema：更新 `docs/DATA_MODEL_SPEC.md` 或相关规格文档。
3. 时间轴事件行为：更新 `docs/TIMELINE_DATA_MODEL_SPEC.md` 或 `docs/TIMELINE_EVENT_SPEC.md`。
4. 渲染流程：更新 `docs/RENDER_PIPELINE_SPEC.md`。
5. 公开入门体验：更新 `README.md`、`README.en.md` 或 `docs/en/*`。

本项目有长期协作规则：每完成一个阶段，需要在 `README.md` 和 `AGENTS.MD` 中记录阶段成果、关键产物、冻结决策和下一阶段建议。

## 素材与隐私

请不要提交：

1. 真实课程视频。
2. 客户素材。
3. 讲师真实视频或头像，除非明确可公开。
4. `.env`、token、API key 或私有配置。
5. 本地 Obsidian 工作区配置。

## Pull Request 建议

PR 描述建议包含：

1. 改了什么。
2. 为什么改。
3. 如何验证。
4. 是否影响数据模型、渲染输出或公开文档。

合并前建议至少通过：

```bash
npm run validate:lessons
npm run typecheck
npm run build
```
