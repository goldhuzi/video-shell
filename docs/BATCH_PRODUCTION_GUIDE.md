# 批量生产手册

第 9 阶段已经提供本地批量生产 MVP。它基于 manifest 管理多个 lesson，支持清单、复制、批量校验、批量预检、批量渲染、失败重试和报告。

当前批量能力仍是本地小团队工具链，不是云端队列、数据库、登录系统或正式生产平台。

## 批量生产当前能做什么

1. 列出 lesson。
2. 复制 lesson。
3. 批量校验 JSON/schema。
4. 批量预检素材和时间轴。
5. 批量 dry-run。
6. 批量 8 秒 smoke。
7. 批量顺序完整渲染。
8. 从报告中重试失败项。
9. 输出 JSON/Markdown 报告。

## 当前不能承诺什么

1. 不自动复制素材。
2. 不自动识别章节。
3. 不自动生成字幕。
4. 不自动判断视觉遮挡。
5. 不支持云端并发渲染。
6. 不支持 `--skip-existing`。
7. 不生成 still contact sheet。
8. 不生成 `out/batches/{batchId}/` 实时状态文件。

## Manifest 在哪里

```text
src/data/course.manifest.json
```

核心字段：

1. `project.id`
2. `project.name`
3. `project.courseTitle`
4. `project.defaultOutputDir`
5. `project.reportDir`
6. `production.renderMode`
7. `production.stopOnError`
8. `production.requirePreflightBeforeRender`
9. `lessons[]`

当前默认输出目录：

```text
out/renders
```

当前默认报告目录：

```text
out/reports
```

## Lesson 清单字段

manifest 中每个 lesson 包含：

1. `lessonId`：对应 `src/data/lessons/{lessonId}.json`。
2. `order`：批量顺序。
3. `title`：显示标题。
4. `status`：`draft`、`needs-review`、`ready`、`blocked`、`rendered`、`archived`。
5. `enabled`：是否进入默认 preflight。
6. `batchRender`：是否进入默认 render。
7. `qaStatus`：`not-started`、`preflighted`、`rendered`、`reviewed`、`blocked`。
8. `outputName`：批量输出文件名覆盖。
9. `tags`、`notes`：辅助信息。

## 如何列出 lesson

```bash
npm run list:lessons
```

检查：

1. lesson 是否登记在 manifest。
2. schema 是否 valid。
3. enabled 和 batchRender 是否符合预期。
4. outputName 是否正确。

## 如何复制 lesson

```bash
npm run create:lesson -- --from lesson-01.sample --to lesson-02
```

如果目标已存在且确认要覆盖：

```bash
npm run create:lesson -- --from lesson-01.sample --to lesson-02 --force
```

注意：

1. 只复制 JSON。
2. 不复制视频素材。
3. 会写入 manifest。
4. 新 lesson 默认 `batchRender=false`。
5. 复制后必须人工替换课程信息、素材路径、阶段和事件。

## 如何创建 `lesson-02`

1. 运行复制命令。
2. 把主视频放到 `public/input/videos/`。
3. 在 `src/data/lessons/lesson-02.json` 中修改 `media.mainVideo.src`。
4. 修改 `meta.lessonIndex`、`meta.lessonTitle`、`render.outputName`。
5. 修改 `stages` 和 `timelineEvents`。
6. 运行：

```bash
npm run validate:lessons
npm run preflight:render -- lesson-02
```

7. 课程主理人和质检人员确认后，再把 manifest 中该 lesson 的 `batchRender` 改为 `true`。

## 如何批量校验

```bash
npm run validate:all
```

只校验 enabled lesson：

```bash
npm run validate:all -- --enabled-only
```

指定 lesson：

```bash
npm run validate:all -- --lesson lesson-01.sample
```

输出报告：

```text
out/reports/batch-validate-*.json
out/reports/batch-validate-*.md
out/reports/batch-validate-latest.json
out/reports/batch-validate-latest.md
```

注意：批量校验不检查素材文件。

## 如何批量 preflight

```bash
npm run preflight:all
```

包含 disabled lesson：

```bash
npm run preflight:all -- --include-disabled
```

包含全部：

```bash
npm run preflight:all -- --all
```

指定 lesson：

```bash
npm run preflight:all -- --lesson lesson-01.sample
```

输出报告：

```text
out/reports/batch-preflight-*.json
out/reports/batch-preflight-*.md
```

默认只处理 `enabled=true` 的 lesson。

## 如何批量 smoke

当前没有独立 `render:smoke:all` 命令。批量 smoke 使用：

```bash
npm run render:all -- --smoke
```

输出到：

```text
out/renders/smoke/{lessonId}-batch-smoke.mp4
```

批量 smoke 只渲染每节课前 8 秒，不替代完整 QA。

## 如何批量 still

当前没有批量 still 命令，也没有 still contact sheet。需要逐节运行：

```bash
npm run render:still -- lesson-01.sample --times 0,30,92
```

批量 still/contact sheet 是后续版本建议，不是当前能力。

## 如何 dry-run

```bash
npm run render:all -- --dry-run
```

用途：

1. 查看会渲染哪些 lesson。
2. 查看输出路径。
3. 避免误触发长时间完整渲染。

dry-run 不写视频，但会写批量报告。

## 如何完整批量渲染

```bash
npm run render:all
```

默认只处理：

```text
enabled=true
batchRender=true
```

输出：

```text
out/renders/{outputName}
out/reports/batch-render-*.md
```

完整批量渲染是串行执行，可能耗时较长。

## 如何筛选批量 lesson

按 lesson id：

```bash
npm run render:all -- --lesson lesson-01.sample
npm run render:all -- --lesson lesson-01.sample,lesson-02
```

按 status：

```bash
npm run render:all -- --status ready
```

包含 disabled：

```bash
npm run render:all -- --include-disabled
```

包含非 batchRender：

```bash
npm run render:all -- --include-non-renderable
```

包含所有：

```bash
npm run render:all -- --all
```

## 如何查看 batch report

报告目录：

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

`kind` 可能是：

1. `validate`
2. `preflight`
3. `render`

给非技术成员看时，优先打开 `.md` 报告。

## 如何处理 failed lessons

1. 打开 `out/reports/batch-render-latest.md`。
2. 找到 status 为 `failed` 或 `preflight_failed` 的 lesson。
3. 根据 issue 修复 JSON、素材或音频策略。
4. 先 dry-run 重试：

```bash
npm run render:failed -- --dry-run
```

5. 再正式重试：

```bash
npm run render:failed
```

指定旧报告：

```bash
npm run render:failed -- --report out/reports/batch-render-latest.json
```

## 如何跳过已生成视频

当前版本没有 `--skip-existing`。

如果输出文件已存在，渲染层会提示并覆盖。正式批量前请先备份需要保留的旧输出，或修改 `outputName`。

## 如何最终交付 `out/final`

当前脚本不会自动整理 `out/final/`。如果团队需要交付目录，可以人工创建：

```text
out/final/
```

并将已 QA 放行的 MP4 复制进去。

注意：`out/final/` 仍位于 `out/` 下，不提交 Git。

## 批量生产前检查清单

- [ ] 每个 lesson 已通过 `validate:lessons`。
- [ ] 每个 lesson 已通过 `preflight:render`。
- [ ] 主视频存在。
- [ ] 讲师素材存在，或 fallback 策略明确。
- [ ] `audio.mode` 已确认。
- [ ] `batchRender=true` 只打开给已复核 lesson。
- [ ] 已运行 `render:all -- --dry-run`。
- [ ] 已运行 `render:all -- --smoke`。
- [ ] 批量报告路径已记录。
- [ ] QA 人员知道 still/clip 仍需人工检查。
- [ ] 最终 MP4 不允许播放器控件。
