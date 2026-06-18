# QA 检查清单

本清单用于检查单节成片和批量输出。检查结果建议记录检查人、日期、lessonId、输出路径和放行结论。

## 单节视频 QA

### 基础文件

- [ ] lesson JSON 已通过 `npm run validate:lessons`。
- [ ] 单节已通过 `npm run preflight:render -- <lessonId>`。
- [ ] smoke 已输出并可播放。
- [ ] 必要关键帧 still 已输出。
- [ ] 必要关键片段 clip 已输出。
- [ ] 完整 MP4 已输出。
- [ ] 输出分辨率为 1920 x 1080。
- [ ] 输出文件名与 lesson 编号一致。

### 主视频优先

- [ ] 主视频清晰。
- [ ] 主视频是画面第一优先级。
- [ ] HUD 未遮挡主视频核心文字、按钮、PPT 标题或软件操作区。
- [ ] 主视频没有因 `cover` 被裁掉关键内容。
- [ ] 主视频四周安全区符合课程内容可读性要求。
- [ ] 如果源视频低于 1080p，QA 记录中已说明清晰度上限来自源文件。

### HUD 布局

- [ ] TopHeader 没有过厚。
- [ ] 顶部标题没有挤压或溢出。
- [ ] 右侧栏没有过宽。
- [ ] 底部 HUD 没有过厚。
- [ ] 讲师小窗或头像没有过大。
- [ ] WarningPanel 文案可读。
- [ ] TaskTracker 文案可读。
- [ ] ChapterMap 节点状态清楚。
- [ ] BottomStatusHud 没有堆叠长正文。

### 时间轴同步

- [ ] CourseStageBar 阶段切换准确。
- [ ] ChapterMap 按时间点亮。
- [ ] TaskTracker 按时间切换当前任务。
- [ ] `task_done` 后任务完成状态正确。
- [ ] `tip_show` 按时出现和消失。
- [ ] `warning_show` 按时出现和消失。
- [ ] `ability_unlock` 按时出现。
- [ ] `summary_show` 按时出现和消失。
- [ ] `homework_show` 按时出现和消失。
- [ ] 提示类事件阅读时间足够。
- [ ] 后半段事件已经检查，不只看开头 8 秒 smoke。

### 音频

- [ ] 主视频音频正常。
- [ ] 没有异常静音。
- [ ] 没有爆音。
- [ ] 没有明显音画不同步。
- [ ] 如果 `audio.mode=mix`，确认没有回声。
- [ ] 如果 `audio.mode=speaker-only`，确认讲师视频音轨存在且完整。
- [ ] 如果 `audio.mode=mute-all`，确认静音是有意设置。

### 最终视频合规

- [ ] 最终视频没有播放按钮。
- [ ] 最终视频没有暂停按钮。
- [ ] 最终视频没有倍速按钮。
- [ ] 最终视频没有音量按钮。
- [ ] 最终视频没有全屏按钮。
- [ ] 最终视频没有可拖动播放器进度条。
- [ ] 最终视频没有时间拖动手柄。
- [ ] 最终视频没有编辑器选中框。
- [ ] 最终视频没有表单控件、按钮、输入框或下拉框。
- [ ] 最终 MP4 不暗示可点击跳转。

### CourseStageBar 合规

- [ ] CourseStageBar 表达学习阶段。
- [ ] CourseStageBar 不是播放器进度条。
- [ ] CourseStageBar 没有播放头。
- [ ] CourseStageBar 没有连续播放器进度填充。
- [ ] CourseStageBar 没有时间码或总时长。
- [ ] CourseStageBar 没有拖动滑块。

### 放行结论

- [ ] 无 P0 问题。
- [ ] P1 问题已修复或已由课程主理人确认带问题放行。
- [ ] QA 记录已保存。
- [ ] 课程主理人已确认最终内容。

## 批量 QA

- [ ] 所有 lesson 已通过 `npm run validate:all`。
- [ ] 所有需要渲染的 lesson 已通过 `npm run preflight:all`。
- [ ] 所有主视频存在。
- [ ] 所有讲师素材存在，或 fallback 策略明确。
- [ ] 已运行 `npm run render:all -- --dry-run`。
- [ ] 已运行 `npm run render:all -- --smoke`。
- [ ] 批量 full render 报告已生成。
- [ ] 所有输出 MP4 已生成。
- [ ] 失败项已记录。
- [ ] `out/reports/batch-render-latest.md` 已检查。
- [ ] `render:failed` 重试后仍失败的 lesson 已进入问题清单。
- [ ] 批量报告不替代人工视觉 QA，这一点已向团队说明。
- [ ] 最终交付目录只包含 QA 放行文件。
- [ ] `out/` 不提交 Git。
