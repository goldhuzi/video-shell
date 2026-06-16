# 第 3 阶段实现说明

## 本阶段完成了什么

1. 初始化 React + TypeScript + Vite + Remotion + Zod 工程骨架。
2. 创建本地编辑器占位页面，可通过 `npm run dev` 打开。
3. 创建 Remotion Studio 入口和 `CourseShellComposition`。
4. 创建 `src/data/lessons/lesson-01.json` 示例 lesson 配置。
5. 创建 `src/schemas/lesson.schema.ts`，用 Zod 校验 lesson 配置。
6. 创建 `src/utils/timeline.ts`，实现最小 HUD 时间轴状态计算。
7. 创建共享 HUD 占位组件和基础 CSS token。
8. 创建 `validate:lessons` 与 `render:sample` 脚本。
9. 跑通 `out/lesson-01-sample.mp4` 测试渲染。

## 本阶段没有做什么

1. 没有实现完整编辑、保存、导入、导出能力。
2. 没有实现真实素材选择器和文件写入。
3. 没有实现复杂动画系统。
4. 没有做数据库、登录、云端、队列、Electron、OBS 或 Premiere 插件。
5. 没有实现自由拖拽或 Figma 式自由设计器。

## 当前可运行命令

```bash
npm install
npm run dev
npm run studio
npm run validate:lessons
npm run typecheck
npm run build
npm run render:sample
```

当前验证结果：

1. `npm run typecheck`：通过。
2. `npm run validate:lessons`：通过，校验 1 个 lesson。
3. `npm run build`：通过。
4. `npm run render:sample`：通过，输出 `out/lesson-01-sample.mp4`。
5. `npm run dev`：已在 `http://127.0.0.1:5173` 打开验证。
6. `npm run studio`：已在 `http://localhost:3001` 打开验证。

## 当前目录结构

```text
src/
  editor/
  remotion/
  components/hud/
  data/lessons/
  schemas/
  styles/
  utils/
scripts/
public/
  input/videos/
  input/speakers/
  input/images/
  assets/hud/
out/
```

## 示例 lesson 配置说明

`src/data/lessons/lesson-01.json` 包含：

1. `meta`：课程标题、课程序号、任务说明和 1920 x 1080 / 30fps canvas。
2. `media`：主视频、讲师视频、头像、讲师视频开关和主视频适配方式。
3. `speaker`：讲师身份和显示策略。
4. `layout`：固定 HUD 布局开关。
5. `warning`、`tasks`、`chapterMap`、`stages`、`timelineEvents`：时间轴驱动的 HUD 内容。
6. `render`：输出文件名、尺寸、帧率和格式。

示例素材路径是占位路径。当前编辑器和 Remotion composition 会显示占位状态，不会因为素材缺失直接崩溃。

## 已知限制

1. `npm audit` 当前报告 8 个 high severity 依赖审计项，主要来自当前前端/Remotion 依赖树；未使用 `npm audit fix --force`，避免破坏骨架版本。
2. `render:sample` 渲染时会输出占位素材 404 日志，这是当前样例没有真实视频/头像文件导致的预期 fallback。
3. 编辑器按钮仍是占位，不会真正保存配置或触发渲染队列。
4. 右侧属性面板和底部时间轴表格目前只展示样例数据。
5. Remotion Studio 自身会显示播放控制，这是 Studio 开发工具 UI，不属于最终 composition 输出。

## 下一阶段建议

1. 实现真实 lesson 配置编辑与保存。
2. 增加素材路径检查脚本，区分阻断错误和可降级警告。
3. 将编辑器预览和 Remotion 输出统一到同一套 HUD 组件，减少重复实现。
4. 为 `deriveHudState` 增加单元测试，覆盖阶段切换、提示消失、任务状态和地图节点联动。
5. 增加真实小样素材，验证主视频音频、讲师视频、头像 fallback 和最终 MP4 观感。
