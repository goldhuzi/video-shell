# GitHub 首次公开发布说明

## 发布目标

将《视频课程套壳》整理为可公开展示的 GitHub 仓库 `video-shell`，用于展示项目定位、工程骨架、课程 HUD 渲染方向和后续协作入口。

## 仓库可见性

公开仓库。

## 本次上传内容

1. React + TypeScript + Vite 本地编辑器骨架。
2. Remotion composition 和测试渲染脚本。
3. 示例 lesson JSON。
4. Zod schema 与时间轴状态计算。
5. HUD 组件占位实现。
6. 中文规格文档和阶段记忆。
7. 英文门面文档。
8. MIT License、贡献指南和安全说明。

## 不上传内容

1. 真实课程视频。
2. 讲师真实视频。
3. 客户素材。
4. 密钥、token、API key 或 `.env`。
5. 本地 Obsidian 工作区配置。
6. 构建产物和渲染产物。

## 安全检查建议

发布前执行：

```bash
git check-ignore node_modules/ dist/ out/ .obsidian/ .env
rg --hidden -g '!node_modules' -g '!dist' -g '!out' -i "(api[_-]?key|secret|token|password|PRIVATE KEY|DATABASE_URL)" .
npm run validate:lessons
npm run typecheck
npm run build
```

## 后续建议

1. 在 GitHub About 中设置 description：`Timeline-driven course HUD renderer for cinematic learning videos.`
2. 添加 topics：`remotion`, `react`, `typescript`, `video-rendering`, `course-creation`, `hud`, `vite`。
3. 后续补充项目截图、PR template、issue template 和真实短素材验证报告。
