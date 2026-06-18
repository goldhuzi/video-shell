# 维护指南

本文件面向技术维护人员。第 10 阶段不做功能开发，但后续维护需要清楚哪些文件可以改、改完要跑什么。

## 项目目录结构

```text
src/editor/                    本地编辑器
src/remotion/                  Remotion 最终视频 composition
src/remotion/layers/           主视频层、讲师层、HUD 层
src/components/hud/            HUD 展示组件
src/styles/                    全局样式、编辑器样式、HUD token
src/schemas/                   Zod schema
src/utils/                     时间轴、媒体路径、加载工具
src/data/lessons/              lesson JSON
src/data/course.manifest.json  本地课程 manifest
scripts/                       校验、预检、渲染、批量脚本
public/input/                  本地素材输入
out/                           本地输出，不提交 Git
docs/                          文档
```

## 编辑器代码在哪里

主要文件：

1. `src/editor/App.tsx`
2. `src/editor/EditorShell.tsx`
3. `src/editor/PropertyPanel.tsx`
4. `src/editor/TimelinePanel.tsx`
5. `src/editor/PreviewCanvas.tsx`
6. `src/editor/timeline/VideoPreviewController.tsx`

维护注意：

1. 编辑器可以有播放器控件。
2. 编辑器控件不能进入 `src/remotion/`。
3. 画框内预览应尽量接近最终视频，但交互层是 editor-only。

## Remotion 渲染器在哪里

主要文件：

1. `src/remotion/Root.tsx`
2. `src/remotion/CourseShellComposition.tsx`
3. `src/remotion/layers/MainVideoLayer.tsx`
4. `src/remotion/layers/SpeakerLayer.tsx`
5. `src/remotion/layers/HudLayer.tsx`

维护注意：

1. 不要引入 `PreviewCanvas`、`VideoPreviewController`、`EditorShell`、`PropertyPanel`、`TimelinePanel`。
2. 不要在最终 composition 加 `<button>`、`<input>`、`<select>`、`controls`、`onClick`、`tabIndex`、`role="button"`。
3. CourseStageBar 不能播放器化。

## HUD 组件在哪里

主要目录：

```text
src/components/hud/
src/styles/hud.css
src/styles/tokens.css
```

当前 Remotion `HudLayer` 已使用 class 驱动展示层。后续如收敛编辑器和 Remotion 展示组件，只能共享无交互展示组件，不能共享编辑器选择层。

## Schema 在哪里

lesson schema：

```text
src/schemas/lesson.schema.ts
```

manifest schema：

```text
src/schemas/course-manifest.schema.ts
```

修改 schema 后必须同步：

1. 示例 lesson。
2. 编辑器表单。
3. preflight。
4. 命令文档。
5. `docs/LESSON_CONFIG_GUIDE.md`。

## Lesson 数据在哪里

```text
src/data/lessons/
```

当前重要 lesson：

1. `lesson-01.json`：工程占位示例。
2. `lesson-01.sample.json`：第 8 阶段真实样片配置。
3. `lesson-render-fixture.json`：安全小样回归配置。

不要删除 fixture，除非同步调整测试和文档。

## Scripts 在哪里

```text
scripts/
```

主要脚本：

1. `validate-lessons.ts`
2. `preflight-render.ts`
3. `render-lesson.ts`
4. `render-smoke.ts`
5. `render-still.ts`
6. `render-clip.ts`
7. `render-sample.ts`
8. `list-lessons.ts`
9. `create-lesson.ts`
10. `validate-all.ts`
11. `preflight-all.ts`
12. `render-all.ts`
13. `render-failed.ts`
14. `batch-utils.ts`
15. `media-paths.ts`
16. `test-hud-state.ts`
17. `test-preflight-render.ts`

## 如何增加字段

建议流程：

1. 在 `src/schemas/lesson.schema.ts` 增加字段。
2. 更新相关类型使用。
3. 更新默认 lesson JSON。
4. 更新编辑器表单。
5. 更新 Remotion 展示层或 timeline 推导。
6. 更新 preflight 规则。
7. 更新文档。
8. 运行验证命令。

必跑：

```bash
npm run typecheck
npm run validate:lessons
npm test
```

## 如何修改模板视觉

主要修改：

1. `src/styles/tokens.css`
2. `src/styles/hud.css`
3. `src/remotion/layers/HudLayer.tsx`
4. `src/remotion/layers/MainVideoLayer.tsx`
5. `src/remotion/layers/SpeakerLayer.tsx`

修改原则：

1. 主视频优先。
2. 右侧栏和底部 HUD 不能遮挡核心内容。
3. CourseStageBar 不能像播放器。
4. 禁止加入播放器控件。
5. 禁止大面积高频闪烁或遮挡动画。

验证：

```bash
npm run render:still -- lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500
```

## 如何增加新的 timeline event 类型

建议流程：

1. 在 `timelineEventTypes` 中增加事件名。
2. 在 schema 中增加 type-target 校验。
3. 在 payload 校验中补字段要求。
4. 在 `src/utils/timeline.ts` 中实现 runtime 推导。
5. 在 `src/utils/eventRules.ts` 中增加编辑器默认规则。
6. 更新编辑器事件表单。
7. 更新 `docs/TIMELINE_EVENT_GUIDE.md`。
8. 增加 `test:hud` 覆盖。

禁止：

1. 新事件不能引入最终视频点击交互。
2. 新事件不能把 CourseStageBar 变成播放器。
3. 新事件不能绕过主视频优先原则。

## 如何修复渲染命令

先定位层级：

1. JSON/schema：看 `validate:lessons`。
2. 素材和时长：看 `preflight:render`。
3. Remotion 打包：看 `render:smoke`。
4. 关键画面：看 `render:still`。
5. 长片段：看 `render:clip`。
6. 完整输出：看 `render:lesson`。

不要直接从完整渲染开始排查。

## 如何更新批量报告

相关文件：

1. `scripts/batch-utils.ts`
2. `scripts/validate-all.ts`
3. `scripts/preflight-all.ts`
4. `scripts/render-all.ts`
5. `scripts/render-failed.ts`

当前报告输出：

```text
out/reports/batch-{kind}-{timestamp}.json
out/reports/batch-{kind}-{timestamp}.md
out/reports/batch-{kind}-latest.json
out/reports/batch-{kind}-latest.md
```

如需新增字段，需同步 JSON 和 Markdown 报告。

## 哪些文件不能乱改

1. `.gitignore`：关系到真实素材和 `out/` 是否误提交。
2. `src/schemas/lesson.schema.ts`：影响所有 lesson。
3. `scripts/media-paths.ts`：关系到路径安全。
4. `scripts/preflight-render.ts`：关系到正式渲染阻断规则。
5. `src/remotion/`：关系到最终视频合规。
6. `src/data/course.manifest.json`：关系到批量生产清单。

## 修改后必须运行哪些命令

文档修改：

```bash
npm run validate:lessons
```

lesson/schema/timeline 修改：

```bash
npm run typecheck
npm run validate:lessons
npm test
```

渲染相关修改：

```bash
npm run typecheck
npm test
npm run preflight:render -- lesson-01.sample
npm run render:smoke -- lesson-01.sample
npm run render:still -- lesson-01.sample --times 0,30,92
```

批量脚本修改：

```bash
npm run list:lessons
npm run validate:all
npm run preflight:all
npm run render:all -- --dry-run
```

## 版本升级建议

1. Remotion 相关包当前固定为 `4.0.477`，升级要单独验证。
2. Vite、React、TypeScript 升级后必须跑 `typecheck`、`build` 和渲染 smoke。
3. 新增 lint 前先不要把它写入用户文档为必跑命令，直到 `package.json` 真有脚本。
4. 新增云端、自动字幕、AI 自动识别或播放器能力前，必须重新冻结产品边界。
