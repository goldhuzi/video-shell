# 第 9 阶段批量生产与本地项目管理说明

生成日期：2026-06-18

## 阶段定位

第 9 阶段实现的是“小团队本地批量生产工具链 MVP”。它让项目可以通过本地 manifest 管理多个 lesson 配置，并以命令行方式完成 lesson 清单、复制、批量校验、批量预检、批量渲染、失败重试和报告输出。

本阶段不代表正式云端批量生产系统已经完成，也不代表多条真实课程素材已完成充分验证。

## 本阶段完成了什么

1. 新增 `src/data/course.manifest.json`，作为本地课程项目 manifest。
2. 新增 `src/schemas/course-manifest.schema.ts`，校验 manifest 的课程项目、lesson 列表、批量策略和 QA 状态。
3. 新增 `list:lessons`，输出 manifest 中的 lesson id、状态、schema 状态、输出名和时长。
4. 新增 `create:lesson -- --from ... --to ...`，从已有 lesson JSON 复制新 lesson，并同步写入 manifest。
5. 新增 `validate:all`，按 manifest 批量校验 lesson JSON，并输出 JSON/Markdown 报告。
6. 新增 `preflight:all`，复用第 6 阶段 `runRenderPreflight()`，逐 lesson 批量检查素材、时长、音频和 timeline 风险。
7. 新增 `render:all`，顺序执行本地批量渲染；支持 `--dry-run` 和 `--smoke`。
8. 新增 `render:failed`，读取最近一次批量 render 报告，只重试失败 lesson；即使失败项当前是 disabled 或 `batchRender=false`，也会按报告明确重试。
9. 新增 `batch:*` npm 别名，方便用运营口径调用同一组命令。
10. `test:hud` 已支持 `--lesson` 和 `--times`，并新增 `test:hud:sample` 覆盖 `lesson-01.sample` 关键时间点。
11. `docs/STAGE_8_ISSUE_BACKLOG.md` 已改成结构化 issue 表。

## 命令

```bash
npm run list:lessons
npm run create:lesson -- --from lesson-01.sample --to lesson-02
npm run validate:all
npm run preflight:all
npm run render:all
npm run render:all -- --dry-run
npm run render:all -- --smoke
npm run render:failed
npm run render:failed -- --dry-run
npm run test:hud -- --lesson lesson-01.sample --times 0,30,92,146,176,240,288,300,432,450,485,500
```

兼容别名：

```bash
npm run batch:list
npm run batch:create -- --from lesson-01.sample --to lesson-02
npm run batch:validate
npm run batch:preflight
npm run batch:render -- --dry-run
npm run batch:render:failed -- --dry-run
```

## Manifest 规则

Manifest 路径：

```text
src/data/course.manifest.json
```

关键字段：

1. `project`：本地课程项目名称、课程标题、默认输出目录、报告目录。
2. `production`：批量策略。第 9 阶段固定为顺序渲染，`maxParallelRenders = 1`。
3. `lessons[]`：本地 lesson 清单。
   - `lessonId` 对应 `src/data/lessons/{lessonId}.json`。
   - `enabled` 控制是否进入默认批量 preflight。
   - `batchRender` 控制是否进入默认批量 render。
   - `status` 标记 draft、needs-review、ready、blocked、rendered、archived。
   - `qaStatus` 标记 not-started、preflighted、rendered、reviewed、blocked。

默认 manifest 中：

1. `lesson-01.sample` 启用，并允许批量 render，但状态仍为 `needs-review`。
2. `lesson-01` 是占位配置，默认不进入批量 preflight/render。
3. `lesson-render-fixture` 是安全小样 fixture，默认不进入真实课程批量。

## 输出目录与报告

批量视频输出遵守 manifest 中的 `project.defaultOutputDir`。当前默认值为：

```text
out/renders/
```

规则：

1. `preflight:all` 和 `render:all` 使用 `project.defaultOutputDir` 计算输出路径。
2. full render 默认输出到 `out/renders/{outputName}`。
3. `render:all -- --smoke` 输出到 `out/renders/smoke/{lessonId}-batch-smoke.mp4`。
4. lesson 条目中有 `outputName` 时，优先用该文件名。

批量报告输出到：

```text
out/reports/
```

每次运行会生成：

```text
batch-{kind}-{timestamp}.json
batch-{kind}-{timestamp}.md
batch-{kind}-latest.json
batch-{kind}-latest.md
```

其中 `kind` 为：

1. `validate`
2. `preflight`
3. `render`

报告包含：

1. run id。
2. manifest 路径。
3. 被选中的 lesson id。
4. 每个 lesson 的状态、错误数、警告数、输出路径、时长和 issue 列表。
5. Markdown 汇总表，方便小团队人工复盘。

## 失败重试

`render:failed` 默认读取：

```text
out/reports/batch-render-latest.json
```

它只重试状态为 `failed` 或 `preflight_failed` 的 lesson，并直接按报告里的 lesson id 从当前 manifest 查找，不再受默认 `enabled` / `batchRender` 过滤影响。可以用：

```bash
npm run render:failed -- --dry-run
```

先查看将会重试哪些 lesson。

## 已冻结决策

1. 第 9 阶段只做本地小团队批量工具链。
2. 不引入云端、数据库、登录、权限、多人协作、在线项目管理后台或远程渲染队列。
3. 不做 AI 自动识别章节、自动字幕、自动生成 lesson 配置或自动生成时间点。
4. 不做视频剪切、合并、转场、多轨剪辑、BGM、降噪、ducking 或专业混音。
5. 不重写第 6 阶段单节渲染器，只在外层编排现有 preflight/render 能力。
6. 不重做第 7 阶段视觉模板。
7. 不破坏第 8 阶段 `lesson-01.sample` 真实样片配置。
8. 批量 full render 采用串行策略，避免多个 Remotion 渲染进程抢占资源。
9. `create:lesson` 只复制 lesson JSON，不复制、移动或重命名用户视频素材。
10. 复制出来的新 lesson 默认 `batchRender=false`，必须人工替换素材、复核阶段和事件后再进入批量渲染。
11. lesson id 只能包含英文字母、数字、点、下划线和短横线，避免命令输入越过 `src/data/lessons/`。

## 后续接手注意

1. `render:all` 可能触发长时间完整渲染；日常验证优先使用 `render:all -- --dry-run` 或 `render:all -- --smoke`。
2. `lesson-01.sample` 仍需要课程主理人复核阶段切点和 HUD 文案，不能把它当成最终课程语义已确认。
3. 讲师长视频小窗链路仍未验收；当前真实样片使用头像 fallback。
4. 批量报告不会自动目检成片质量，仍需要 still/clip/contact sheet 或人工 QA。
5. 当前没有做 batch state 每课实时落盘，中断恢复依赖最近一次报告；后续若要长批次生产，应补 `out/batches/{batchId}/state/latest.json` 或等价的本地状态文件。

## 下一阶段建议

1. 增加 still contact sheet 脚本，把关键帧汇总成单张 QA 图。
2. 增加 `out/batches/{batchId}/` 批次归档和实时状态文件，增强长批次中断恢复。
3. 为批量报告增加 issue code 聚合和 next action 字段。
4. 在编辑器中增加导入 lesson JSON 能力，让 `create:lesson` 生成的新 lesson 能直接进入可视化编辑。
5. 至少再用一条不同真实课程素材跑通 preflight、smoke、still、clip、full render 和 QA 记录，再讨论正式批量生产稳定性。
