# 快速开始

本指南帮助你在本地启动《视频课程套壳》的编辑器、校验 lesson 配置，并打开 Remotion 渲染入口。

## 1. 环境要求

1. Node.js 18 或更高版本。
2. npm。
3. Windows、macOS 或 Linux 均可，本仓库当前主要在 Windows 环境验证。

## 2. 安装依赖

```bash
npm install
```

## 3. 启动本地编辑器

```bash
npm run dev
```

默认地址：

```text
http://127.0.0.1:5173
```

编辑器当前是工程骨架，用于展示 16:9 最终视频预览、HUD 占位组件、课程信息和时间轴配置区。按钮和属性面板仍在后续阶段接入真实保存逻辑。

## 4. 校验 lesson 配置

```bash
npm run validate:lessons
```

当前示例配置位于：

```text
src/data/lessons/lesson-01.json
```

校验逻辑由 Zod schema 驱动，核心入口位于：

```text
src/schemas/lesson.schema.ts
```

## 5. 启动 Remotion Studio

```bash
npm run studio
```

Remotion composition 入口：

```text
src/remotion/Root.tsx
```

composition 名称：

```text
CourseShellComposition
```

注意：Remotion Studio 自带播放器控件只属于开发工具界面，不属于最终 MP4。最终导出视频不得出现播放、暂停、倍速、音量、全屏或可拖动播放器进度条。

## 6. 渲染测试视频

```bash
npm run render:sample
```

输出位置：

```text
out/lesson-01-sample.mp4
```

`out/` 已被 `.gitignore` 排除，不会提交到 GitHub。

如果示例素材缺失，渲染可能出现素材 404 日志；只要脚本成功结束并输出 MP4，这属于当前阶段的占位 fallback 行为。

## 7. 素材目录

| 素材类型 | 推荐路径 | 是否提交 |
| --- | --- | --- |
| 主课程视频 | `public/input/videos/` | 不提交真实视频 |
| 讲师视频 | `public/input/speakers/` | 不提交真实视频 |
| 讲师头像 | `public/input/images/` | 示例或占位图可以提交，真实头像谨慎提交 |
| 默认 HUD 资源 | `public/assets/hud/` | 可提交应用默认资源 |

## 8. 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地编辑器 |
| `npm run studio` | 启动 Remotion Studio |
| `npm run validate:lessons` | 校验 lesson JSON |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run build` | 构建本地编辑器 |
| `npm run render:sample` | 渲染示例 MP4 |

## 9. 下一步阅读

1. `README.md`：项目入口。
2. `docs/PROJECT_SPEC.md`：产品定义。
3. `docs/MVP_SCOPE.md`：MVP 范围。
4. `docs/DATA_MODEL_SPEC.md`：课程配置模型。
5. `docs/RENDER_PIPELINE_SPEC.md`：渲染链路。
6. `AGENTS.MD`：长期项目记忆和接手规则。
