# 命令参考

本文件只记录当前 `package.json` 中真实存在的 npm scripts。不要把规划中的命令写成可运行命令。

所有命令默认在项目根目录运行。

## 基础命令

### `npm run dev`

用途：启动本地编辑器。

使用场景：编辑课程信息、预览 HUD、手动配置时间点。

示例：

```bash
npm run dev
```

输入要求：已运行 `npm install`。

输出结果：Vite dev server，默认地址为 `http://127.0.0.1:5173`。

常见失败原因：

1. 依赖未安装。
2. 端口被占用。
3. Node.js 版本不兼容。

### `npm run studio`

用途：启动 Remotion Studio。

使用场景：开发者检查 `CourseShellComposition`。

示例：

```bash
npm run studio
```

输入要求：项目依赖已安装。

输出结果：Remotion Studio 页面。Studio 自带控制条属于开发工具，不属于最终 MP4。

常见失败原因：

1. 端口被占用。
2. Remotion 打包失败。
3. lesson 配置或依赖异常。

### `npm run typecheck`

用途：运行 TypeScript 类型检查。

示例：

```bash
npm run typecheck
```

输出结果：类型检查通过或列出 TypeScript 错误。

常见失败原因：字段类型、导入路径或组件 props 不匹配。

### `npm run build`

用途：构建编辑器前端。

示例：

```bash
npm run build
```

输出结果：`dist/` 构建产物。`dist/` 不提交 Git。

常见失败原因：TypeScript、Vite 或依赖打包错误。

## Lesson 校验与单节渲染

### `npm run validate:lessons`

用途：校验 `src/data/lessons/` 下所有 lesson JSON。

示例：

```bash
npm run validate:lessons
```

输入要求：`src/data/lessons/*.json` 必须是合法 JSON，并符合 `src/schemas/lesson.schema.ts`。

输出结果：逐个打印 `校验成功` 或字段错误。

常见失败原因：

1. JSON 语法错误。
2. 阶段时间不递增。
3. 事件引用不存在。
4. `render.outputName` 缺失。

### `npm run preflight:render -- <lessonId>`

用途：正式渲染前检查单节 lesson。

示例：

```bash
npm run preflight:render -- lesson-01.sample
npm run preflight:render -- --lesson lesson-01.sample
npm run preflight:render -- --lesson=lesson-01.sample
```

输入要求：存在 `src/data/lessons/{lessonId}.json`，并且主视频路径可解析。

输出结果：打印输出路径、渲染时长、error 和 warning。主视频缺失会失败。

常见失败原因：

1. `media.mainVideo.src` 找不到文件。
2. 主视频路径写成本机绝对路径。
3. `audio.mode=mix` 或 `speaker-only` 但讲师视频缺失。
4. timeline 事件超出渲染时长。
5. 输出目录不可写。

### `npm run render:smoke -- <lessonId>`

用途：渲染单节课前 8 秒 smoke 视频。

示例：

```bash
npm run render:smoke -- lesson-01.sample
```

输入要求：单节 preflight 通过。

输出结果：

```text
out/{lessonId}-smoke.mp4
```

常见失败原因：

1. preflight 未通过。
2. 主视频缺失。
3. Remotion 打包失败。

注意：smoke 只覆盖前 8 秒，不代表整节课 QA 通过。

### `npm run render:still -- <lessonId>`

用途：输出关键时间点 PNG。

示例：

```bash
npm run render:still -- lesson-01.sample
npm run render:still -- lesson-01.sample --times 0,30,92,146
npm run render:still -- lesson-01.sample --time 240
npm run render:still -- lesson-01.sample --times 0,30 --outputDir out/stills/custom
```

输入要求：preflight 通过，时间点不超过渲染时长。

输出结果：默认输出到：

```text
out/stills/{lessonId}/
```

默认时间点：

```text
36,118,150,248,270,316,340,355
```

常见失败原因：

1. 时间点超过视频时长。
2. preflight 失败。
3. 输出目录不可写。

### `npm run render:clip -- <lessonId>`

用途：输出关键片段 MP4。

示例：

```bash
npm run render:clip -- lesson-01.sample --from 236 --duration 20
npm run render:clip -- lesson-01.sample --from 236 --duration 20 --outputDir out/clips/check
npm run render:clip -- lesson-01.sample --from 236 --duration 20 --output warning-window.mp4
```

输入要求：preflight 通过，`from + duration` 不超过渲染时长。

输出结果：默认输出到：

```text
out/clips/
```

常见失败原因：

1. 片段窗口超出视频时长。
2. preflight 失败。
3. Remotion 渲染失败。

### `npm run render:lesson -- <lessonId>`

用途：正式渲染单节完整 MP4。

示例：

```bash
npm run render:lesson -- lesson-01.sample
```

输入要求：preflight 通过，主视频存在，输出目录可写。

输出结果：来自 lesson 的：

```text
render.outputDir + render.outputName
```

示例：

```text
out/lesson-01-sample.mp4
```

常见失败原因：

1. 主视频缺失。
2. 编码失败。
3. 磁盘空间不足。
4. 输出文件被占用。

当前会覆盖同名输出文件，并在日志中提示。

### `npm run render:sample`

用途：早期开发样片脚本。

示例：

```bash
npm run render:sample
```

输入要求：硬编码读取 `src/data/lessons/lesson-01.json`。

输出结果：硬编码输出：

```text
out/lesson-01-sample.mp4
```

注意：这是开发验证脚本，会把样片时长改成 60 秒。正式单节课链路应使用 `preflight:render`、`render:smoke`、`render:still`、`render:clip` 和 `render:lesson`。

## 批量生产命令

### `npm run list:lessons`

用途：列出 manifest 中的 lesson。

示例：

```bash
npm run list:lessons
```

输入要求：存在 `src/data/course.manifest.json`。

输出结果：lesson id、title、status、enabled、batchRender、schema 状态、输出名和 duration。

常见失败原因：manifest 缺失或格式错误。

### `npm run create:lesson -- --from <source> --to <target>`

用途：复制 lesson JSON，并更新 manifest。

示例：

```bash
npm run create:lesson -- --from lesson-01.sample --to lesson-02
npm run create:lesson -- --from lesson-01.sample --to lesson-02 --force
```

输入要求：源 lesson 存在；目标 lesson 不存在，除非显式使用 `--force`。

输出结果：

```text
src/data/lessons/{target}.json
src/data/course.manifest.json
```

常见失败原因：

1. 缺少 `--from` 或 `--to`。
2. 源 lesson 不存在。
3. 目标 lesson 已存在但没有 `--force`。

注意：该命令只复制 JSON，不复制素材文件。新 lesson 默认 `batchRender=false`。

### `npm run validate:all`

用途：按 manifest 批量校验 lesson JSON，并生成报告。

示例：

```bash
npm run validate:all
npm run validate:all -- --enabled-only
npm run validate:all -- --lesson lesson-01.sample
```

输入要求：manifest 和 lesson JSON 存在。

输出结果：

```text
out/reports/batch-validate-*.json
out/reports/batch-validate-*.md
out/reports/batch-validate-latest.json
out/reports/batch-validate-latest.md
```

常见失败原因：JSON/schema 错误。

注意：`validate:all` 不检查真实素材是否存在。

### `npm run preflight:all`

用途：批量运行渲染前检查。

示例：

```bash
npm run preflight:all
npm run preflight:all -- --all
npm run preflight:all -- --include-disabled
npm run preflight:all -- --lesson lesson-01.sample
```

输入要求：manifest 中有 lesson，素材路径符合规则。

输出结果：

```text
out/reports/batch-preflight-*.json
out/reports/batch-preflight-*.md
```

默认行为：只处理 `enabled=true` 的 lesson。

常见失败原因：主视频缺失、输出目录不可写、timeline 风险。

### `npm run render:all`

用途：批量顺序渲染。

示例：

```bash
npm run render:all -- --dry-run
npm run render:all -- --smoke
npm run render:all
npm run render:all -- --lesson lesson-01.sample
npm run render:all -- --status ready
```

输入要求：默认处理 `enabled=true` 且 `batchRender=true` 的 lesson。

输出结果：

```text
out/renders/
out/reports/batch-render-*.json
out/reports/batch-render-*.md
```

`--dry-run`：只生成计划和报告，不写视频。

`--smoke`：批量渲染 8 秒 smoke，输出到：

```text
out/renders/smoke/{lessonId}-batch-smoke.mp4
```

常见失败原因：

1. preflight 失败。
2. 主视频缺失。
3. 渲染时间长或机器资源不足。

当前不支持 `--skip-existing`。如果输出已存在，渲染层会提示并覆盖。

### `npm run render:failed`

用途：从批量 render 报告中重试失败项。

示例：

```bash
npm run render:failed -- --dry-run
npm run render:failed
npm run render:failed -- --report out/reports/batch-render-latest.json
```

输入要求：存在 render 报告，默认读取：

```text
out/reports/batch-render-latest.json
```

输出结果：新的批量 render 报告和重试输出。

常见失败原因：

1. 报告不存在。
2. 失败 lesson 已不在 manifest 中。
3. 修复不完整，重试仍 preflight 失败。

## 批量别名

这些命令是对应批量命令的别名：

```bash
npm run batch:list
npm run batch:create -- --from lesson-01.sample --to lesson-02
npm run batch:validate
npm run batch:preflight
npm run batch:render -- --dry-run
npm run batch:render:failed -- --dry-run
```

## 测试命令

### `npm test`

用途：聚合当前核心检查。

实际执行：

```text
validate:lessons + test:hud + test:hud:sample + test:preflight
```

示例：

```bash
npm test
```

### `npm run test:hud`

用途：检查 HUD 状态推导。

示例：

```bash
npm run test:hud
npm run test:hud -- --lesson lesson-01.sample --times 0,30,92
```

### `npm run test:hud:sample`

用途：检查 `lesson-01.sample` 的关键时间点 HUD 状态。

示例：

```bash
npm run test:hud:sample
```

### `npm run test:preflight`

用途：检查渲染前预检规则。

示例：

```bash
npm run test:preflight
```

## 当前不存在的命令

以下能力当前版本暂不支持，不要写成可运行命令：

1. `render:smoke:all`
2. `render:still:all`
3. `contact-sheet`
4. `import:lesson`
5. `lint`
6. `--skip-existing`
7. 云端队列、登录、数据库、AI 自动识别、自动字幕相关命令。
