# 故障排查手册

遇到问题时，先看现象，再按步骤排查。不要绕过 preflight，也不要为了出片把主视频缺失错误改成 warning。

## npm install 失败

现象：依赖安装失败。

可能原因：

1. 网络问题。
2. Node.js 版本不兼容。
3. npm 缓存异常。

解决步骤：

1. 确认 Node.js 已安装。
2. 重新运行 `npm install`。
3. 如果仍失败，交给技术维护人员查看 npm 错误日志。

相关命令：

```bash
npm install
```

## npm run dev 失败

现象：编辑器启动失败或浏览器打不开。

可能原因：

1. 依赖未安装。
2. 端口被占用。
3. Vite 启动异常。

解决步骤：

1. 运行 `npm install`。
2. 重新运行 `npm run dev`。
3. 如果端口冲突，使用 Vite 参数指定端口：

```bash
npm run dev -- --port 5179
```

相关文件：`vite.config.ts`、`src/editor/`。

## Remotion Studio 打不开

现象：`npm run studio` 失败或页面无法访问。

可能原因：

1. 端口被占用。
2. Remotion 打包失败。
3. lesson 配置异常。

解决步骤：

1. 运行 `npm run typecheck`。
2. 运行 `npm run validate:lessons`。
3. 重新运行 `npm run studio`。

相关文件：`src/remotion/Root.tsx`、`src/remotion/CourseShellComposition.tsx`。

## validate 失败

现象：`validate:lessons` 或 `validate:all` 报字段错误。

可能原因：

1. JSON 字段缺失。
2. 阶段时间不合法。
3. 事件引用不存在。
4. 事件类型和 targetComponent 不匹配。

解决步骤：

1. 看报错字段路径。
2. 打开对应 `src/data/lessons/{lessonId}.json`。
3. 按 `docs/LESSON_CONFIG_GUIDE.md` 修正。
4. 重新运行校验。

相关命令：

```bash
npm run validate:lessons
npm run validate:all
```

## JSON 格式错误

现象：提示 JSON parse failed、Unexpected token。

可能原因：

1. 多了逗号。
2. 少了引号。
3. 使用了注释。
4. 括号不配对。

解决步骤：

1. 打开报错的 lesson JSON。
2. 检查报错行附近逗号和引号。
3. 修正后运行 `npm run validate:lessons`。

相关文件：`src/data/lessons/*.json`。

## lesson 配置缺字段

现象：schema 报 required 字段缺失或类型错误。

可能原因：

1. 手动删除了必需字段。
2. 从旧版本配置复制后没有补齐。

解决步骤：

1. 对照 `src/data/lessons/lesson-01.sample.json`。
2. 对照 `docs/LESSON_CONFIG_GUIDE.md`。
3. 补齐字段。

相关文件：`src/schemas/lesson.schema.ts`。

## mainVideo 找不到

现象：preflight 报 `MAIN_VIDEO_MISSING` 或主视频路径无效。

可能原因：

1. 文件没有放到 `public/input/videos/`。
2. `media.mainVideo.src` 写错。
3. 写成了本机绝对路径。
4. 文件名双后缀或大小写不一致。

解决步骤：

1. 确认文件存在于 `public/input/videos/`。
2. lesson JSON 中使用 `/input/videos/...`。
3. 重新运行：

```bash
npm run preflight:render -- <lessonId>
```

相关字段：`media.mainVideo.src`。

## speakerVideo 找不到

现象：preflight 报 `SPEAKER_VIDEO_MISSING`。

可能原因：

1. `media.useSpeakerVideo=true` 但视频不存在。
2. `audio.mode=speaker-only` 或 `mix` 但讲师视频不存在。
3. 讲师视频放错目录。

解决步骤：

1. 补齐 `public/input/speakers/...`。
2. 或改为 `speaker.displayMode=avatar` / `hidden`。
3. 如果不需要讲师音频，把 `audio.mode` 改为 `main-only` 或 `mute-all`。

相关字段：`media.speakerVideo.src`、`speaker.displayMode`、`audio.mode`。

## 头像不显示

现象：讲师头像消失，显示身份牌或隐藏。

可能原因：

1. `media.speakerImage.src` 不存在。
2. `speaker.displayMode` 不是 `avatar`。
3. `speaker.missingAssetBehavior` 允许降级。

解决步骤：

1. 把头像放到 `public/input/images/`。
2. 修正 `/input/images/...` 路径。
3. 重新运行 still 或 smoke。

## render:lesson 失败

现象：完整渲染失败。

可能原因：

1. preflight 失败。
2. Remotion 打包失败。
3. 素材编码异常。
4. 磁盘空间不足。

解决步骤：

1. 先运行 `preflight:render`。
2. 再运行 `render:smoke`。
3. 再运行 `render:clip` 缩小问题范围。
4. 最后重试 `render:lesson`。

相关命令：

```bash
npm run preflight:render -- <lessonId>
npm run render:smoke -- <lessonId>
npm run render:lesson -- <lessonId>
```

## render:all 某节失败

现象：批量报告中某节状态为 `failed` 或 `preflight_failed`。

可能原因：

1. 该 lesson 主视频缺失。
2. 该 lesson JSON 有字段问题。
3. 该 lesson 音频或讲师视频配置不一致。

解决步骤：

1. 打开 `out/reports/batch-render-latest.md`。
2. 修复对应 lesson。
3. 先 dry-run 重试：

```bash
npm run render:failed -- --dry-run
```

4. 再正式重试：

```bash
npm run render:failed
```

## 输出文件找不到

现象：命令显示成功，但不知道文件在哪里。

可能原因：

1. 单节输出来自 lesson 的 `render.outputDir/outputName`。
2. 批量输出来自 manifest 的 `project.defaultOutputDir`。
3. smoke、still、clip 各有默认目录。

解决步骤：

1. 单节完整渲染看 lesson JSON。
2. 批量完整渲染看 `out/renders/`。
3. 单节 smoke 看 `out/{lessonId}-smoke.mp4`。
4. still 看 `out/stills/{lessonId}/`。
5. clip 看 `out/clips/`。
6. 报告看 `out/reports/`。

## 视频黑屏

现象：输出 MP4 可播放但主视频区域黑屏或占位。

可能原因：

1. 主视频路径错误。
2. 素材编码无法读取。
3. fit mode 或层级配置异常。

解决步骤：

1. 运行 `preflight:render`。
2. 确认主视频本地可播放。
3. 用 `render:still` 输出 0 秒检查。
4. 如素材编码异常，重新转码主视频。

## 视频比例不对

现象：输出不是 16:9 或画面拉伸。

可能原因：

1. 源视频不是 16:9。
2. `mainVideoFitMode` 选择不合适。
3. 用户误以为源视频比例等于最终输出比例。

解决步骤：

1. 确认最终输出固定 1920 x 1080。
2. 默认使用 `contain`。
3. 如果录屏内容被裁切，不要使用 `cover`。

## 主视频被裁切

现象：PPT、软件按钮或浏览器内容被切掉。

可能原因：

1. `layout.mainVideoFitMode = "cover"`。
2. 主视频源比例和主视频框不一致。

解决步骤：

1. 改为 `contain`。
2. 重新输出 still。
3. 确认主视频关键区域可读。

相关字段：`layout.mainVideoFitMode`。

## HUD 遮挡主内容

现象：右侧栏、底部 HUD、讲师卡挡住主视频关键内容。

可能原因：

1. 主视频内容靠近边缘。
2. 文案太长。
3. 讲师卡位置不合适。

解决步骤：

1. 先缩短 HUD 文案。
2. 改讲师卡显示方式或隐藏。
3. 检查 still/clip。
4. 不要为了 HUD 牺牲主视频可读性。

## CourseStageBar 太像播放器

现象：阶段条像播放进度条。

可能原因：

1. 出现连续进度填充。
2. 出现播放头或拖动手柄。
3. 出现时间码。

解决步骤：

1. 保持阶段段块、节点和状态铭牌。
2. 删除任何播放控制视觉。
3. 重新 QA。

这是交付阻断问题。

## 最终视频出现播放器控件

现象：最终 MP4 中出现播放、暂停、倍速、音量、全屏、拖动条、表单或编辑器控件。

可能原因：

1. Remotion 误引用编辑器组件。
2. 把 `VideoPreviewController`、`PreviewCanvas` 或属性面板带入最终 composition。
3. UI 设计误把阶段条做成播放器。

解决步骤：

1. 立即停止交付。
2. 技术维护人员检查 `src/remotion/`。
3. 静态扫描禁用控件。
4. 重新输出 still/clip 和完整 MP4。

相关目录：`src/remotion/`。

## 音频无声

现象：最终 MP4 没声音。

可能原因：

1. `audio.mode=mute-all`。
2. `render.audioEnabled=false`。
3. 主视频没有音轨。
4. `speaker-only` 但讲师视频无音轨。

解决步骤：

1. 检查 `audio.mode`。
2. 检查主视频是否有音轨。
3. 运行 preflight。
4. 改为 `main-only` 后重试。

## 音频有回声

现象：声音重叠或回声。

可能原因：

1. `audio.mode=mix`。
2. 主视频和讲师视频包含同一段音频。

解决步骤：

1. 默认改为 `main-only`。
2. 如果确实要 mix，先单独验收讲师视频音轨。
3. 重新 QA。

## 中文字体不清楚

现象：标题或 HUD 文案模糊、拥挤。

可能原因：

1. 文案过长。
2. 源视频清晰度低。
3. 输出被平台二次压缩。

解决步骤：

1. 缩短文案。
2. 使用 1080p 或更高清源。
3. 检查 1920 x 1080 本地原始 MP4。

## 渲染太慢

现象：完整渲染耗时很久。

可能原因：

1. 视频时长长。
2. 机器资源不足。
3. 批量渲染是串行。

解决步骤：

1. 日常先用 `render:smoke`、`render:still`、`render:clip`。
2. 批量先用 `render:all -- --dry-run` 和 `--smoke`。
3. 完整渲染放到空闲时间执行。

## out 目录太大

现象：磁盘占用增长。

可能原因：

1. smoke、still、clip、完整 MP4 和报告累积。

解决步骤：

1. 手动清理不需要的 `out/` 文件。
2. 保留已交付 MP4 和必要 QA 证据。
3. 不要把 `out/` 提交 Git。

## 真实视频误进 Git

现象：`git status` 显示真实视频、头像或 `out/` 文件。

可能原因：

1. 文件放到了未忽略目录。
2. 手动 `git add -f`。
3. `.gitignore` 被改坏。

解决步骤：

1. 立即停止提交。
2. 从暂存区移除相关文件。
3. 检查 `.gitignore`。
4. 如已提交，交给技术维护人员处理历史。

相关命令：

```bash
git status --short
```

## 批量报告看不懂

现象：不知道报告里的状态代表什么。

可能原因：不了解 report 字段。

解决步骤：

1. 优先打开 `.md` 报告。
2. 看 totals：total、passed、failed、skipped、warnings。
3. 看 Lessons 表格中的状态。
4. 对 failed 或 preflight_failed 查 issues。
5. 参考 `docs/BATCH_PRODUCTION_GUIDE.md`。
