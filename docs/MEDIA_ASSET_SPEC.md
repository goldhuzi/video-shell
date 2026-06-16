# 素材文件管理规范

## 1. 目标

素材文件管理规范用于保证编辑器和 Remotion 渲染器能稳定读取本地素材，并避免大文件、临时输出和用户私有素材被误提交。

第一版素材管理采用本地文件路径和 JSON 引用，不做云端素材库。

## 2. 素材分类

第一版素材分为：

1. 主课程视频。
2. 讲师小窗视频。
3. 讲师头像。
4. HUD 静态资源。
5. 字体资源。
6. 可选品牌 logo。

## 3. 推荐目录

```text
public/
├── assets/
│   ├── icons/
│   ├── textures/
│   └── default-hud/
├── input/
│   ├── videos/
│   │   └── main-course-video.mp4
│   ├── lecturer/
│   │   └── lecturer-camera.mp4
│   ├── avatars/
│   │   └── lecturer-avatar.png
│   ├── hud/
│   │   ├── logo.png
│   │   └── icons/
│   └── lesson.config.json
└── fonts/
    ├── NotoSansSC-Regular.woff2
    └── JetBrainsMono-Regular.woff2
```

输出目录：

```text
out/
├── renders/
│   └── lesson-output.mp4
└── logs/
    └── render-log.txt
```

## 4. 主课程视频

### 4.1 存放位置

```text
public/input/videos/
```

### 4.2 命名建议

```text
{project-slug}_main_v001.mp4
```

示例：

```text
ai-coach-lesson-03_main_v001.mp4
```

### 4.3 要求

1. 主视频是必需素材。
2. 推荐横屏 16:9。
3. 允许非 16:9，但最终输出仍固定 1920 x 1080，默认 contain 显示。
4. 主视频音频默认进入最终 MP4。
5. 替换主视频后必须复查时间轴事件。

### 4.4 配置引用

```json
{
  "id": "asset-main-video",
  "kind": "main_video",
  "src": "/input/videos/ai-coach-lesson-03_main_v001.mp4",
  "required": true
}
```

## 5. 讲师小窗视频

### 5.1 存放位置

```text
public/input/lecturer/
```

### 5.2 命名建议

```text
{project-slug}_lecturer_v001.mp4
```

示例：

```text
ai-coach-lesson-03_lecturer_v001.mp4
```

### 5.3 要求

1. 讲师视频是可选素材。
2. 当 `lecturer.displayMode = video` 时应配置。
3. 默认从 0 秒与主视频同步播放。
4. 第一版不做复杂音画同步编辑。
5. 讲师视频短于主视频时的冻结、隐藏或循环策略需在开发阶段明确，默认建议冻结最后一帧或降级为头像。

## 6. 讲师头像

### 6.1 存放位置

```text
public/input/avatars/
```

### 6.2 命名建议

```text
{lecturer-name-or-slug}_avatar.png
```

示例：

```text
shaofan_avatar.png
```

### 6.3 支持格式

建议：

1. PNG。
2. JPG。
3. WebP。

头像建议为正方形，最小 512 x 512。

## 7. HUD 静态资源

### 7.1 用户项目 HUD 资源存放位置

```text
public/input/hud/
```

### 7.2 包含内容

可包含：

1. 品牌 logo。
2. 自定义图标。
3. 背景纹理。
4. 状态徽章。

第一版不建议依赖大量静态 HUD 图片。优先用 CSS、文字、线性图标和组件样式实现 AI 战术课程 HUD。

### 7.2 应用默认 HUD 资源存放位置

```text
public/assets/
```

推荐：

```text
public/assets/icons/
public/assets/textures/
public/assets/default-hud/
```

职责区分：

1. `public/assets` 放应用默认资源，可以随代码提交。
2. `public/input/hud` 放用户项目资源，例如课程 logo、客户品牌图标、自定义状态徽章。
3. 用户项目资源可能涉及商业授权，默认不应随仓库提交。

### 7.3 命名建议

```text
{project-slug}_logo.png
hud_icon_{name}.svg
```

示例：

```text
ai-coach_logo.png
hud_icon_lock.svg
```

## 8. 字体资源

### 8.1 存放位置

```text
public/fonts/
```

### 8.2 推荐字体

1. 中文正文：Noto Sans SC 或系统中文字体。
2. 数字和时间码：JetBrains Mono。
3. 科技标题：Orbitron、Rajdhani 或同类字体。

### 8.3 要求

1. 字体授权必须允许本地渲染和视频输出。
2. 不确定授权的字体不要随项目提交。
3. Remotion 渲染前应确保字体可加载。

## 9. 哪些文件不应该提交 Git

以下文件不应提交：

1. 大体积主视频。
2. 讲师视频。
3. 用户真实头像。
4. 用户商业课程素材。
5. 渲染输出 MP4。
6. 临时预览视频。
7. 渲染日志。
8. 本地私有配置。

建议 `.gitignore` 包含：

```text
public/input/videos/*
public/input/lecturer/*
public/input/avatars/*
public/input/hud/*
out/*
*.mp4
*.mov
*.avi
*.mkv
```

允许提交：

1. 目录占位 `.gitkeep`。
2. 小体积示例配置。
3. 无版权风险的示例图片。
4. 文档。
5. 源代码。

## 10. 缺失素材处理

### 10.1 主视频缺失

处理：

1. 编辑器显示阻断错误。
2. 渲染脚本停止。
3. 不允许输出最终 MP4。

原因：

主视频是最终成片第一优先级内容。

### 10.2 讲师视频缺失

处理：

1. 若 `displayMode = video`，编辑器提示缺失。
2. 可允许用户切换为头像或隐藏。
3. 渲染脚本可根据配置策略阻断或降级。

推荐：

第一版开发时优先采用明确阻断，避免用户以为已渲染讲师视频。

### 10.3 讲师头像缺失

处理：

1. 若显示模式需要头像，编辑器提示缺失。
2. 可降级为文字身份牌。
3. 渲染前给出警告。

### 10.4 HUD 静态资源缺失

处理：

1. 非必需资源缺失时使用默认 CSS 样式或文字替代。
2. 必需 logo 若缺失，隐藏 logo 并警告。
3. 不因非核心 HUD 图片缺失阻断主视频渲染。

## 11. 路径规范

配置中建议使用相对 `public` 的路径：

```text
/input/videos/demo_main_v001.mp4
/input/lecturer/demo_lecturer_v001.mp4
/input/avatars/demo_avatar.png
```

要求：

1. 编辑器预览可直接访问。
2. 渲染脚本可解析到本地文件系统。
3. 不在配置中写死开发者绝对路径。
4. 不使用远程 URL 作为第一版主路径。

## 12. 素材元信息

编辑器导入素材后可写入：

1. 时长。
2. 宽度。
3. 高度。
4. MIME 类型。
5. 文件大小。

这些字段用于展示和校验，但素材本身仍以 `src` 为准。

## 13. 素材验收标准

后续实现应满足：

1. 主视频放在 `public/input/videos` 并能被编辑器和渲染器读取。
2. 讲师视频放在 `public/input/lecturer`。
3. 头像放在 `public/input/avatars`。
4. 用户项目 HUD 资源放在 `public/input/hud`。
5. 应用默认 HUD 资源放在 `public/assets`。
6. 输出 MP4 放在 `out/renders`。
7. 大视频和输出文件不提交 Git。
8. 主视频缺失时阻断渲染。
9. 非必需 HUD 资源缺失时可降级。
