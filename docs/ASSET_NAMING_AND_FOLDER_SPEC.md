# 素材命名与目录规范

本规范以当前代码和 `.gitignore` 为准。旧文档中出现的早期目录名如果与这里不同，以本文件为准。

## 目录总览

```text
public/input/videos/     主课程视频
public/input/speakers/   讲师视频
public/input/images/     讲师头像、派生头像、静态图片
public/assets/hud/       默认 HUD 静态资源，如果后续新增
out/                     渲染输出、still、clip、批量报告
src/data/lessons/        lesson JSON，可提交
src/data/course.manifest.json  本地课程 manifest，可提交
```

## 主视频放哪里

推荐目录：

```text
public/input/videos/
```

推荐命名：

```text
{course-slug}-{lesson-id}-main-v001.mp4
```

示例：

```text
public/input/videos/video-shell-lesson-02-main-v001.mp4
public/input/videos/lesson-01-main.mp4
```

lesson JSON 中引用：

```json
"media": {
  "mainVideo": {
    "src": "/input/videos/lesson-01-main.mp4",
    "required": true
  }
}
```

主视频是正式渲染 P0 必需素材。缺失时 preflight 和 render 会失败。

## 讲师视频放哪里

推荐目录：

```text
public/input/speakers/
```

推荐命名：

```text
{course-slug}-{lesson-id}-speaker-v001.mp4
```

示例：

```text
public/input/speakers/video-shell-lesson-02-speaker-v001.mp4
```

lesson JSON 中引用：

```json
"media": {
  "speakerVideo": {
    "src": "/input/speakers/video-shell-lesson-02-speaker-v001.mp4",
    "required": false
  },
  "useSpeakerVideo": true
}
```

历史样片 `lesson-01.sample` 的讲师视频实际位于 `public/input/videos/`，文档和新项目建议仍使用 `public/input/speakers/`。

## 讲师头像放哪里

推荐目录：

```text
public/input/images/
```

推荐命名：

```text
{course-slug}-{speaker-slug}-avatar.png
```

示例：

```text
public/input/images/shaofan-avatar.png
public/input/images/video-shell-shaofan-avatar.png
```

lesson JSON 中引用：

```json
"media": {
  "speakerImage": {
    "src": "/input/images/shaofan-avatar.png",
    "required": false
  }
}
```

## HUD 静态资源放哪里

如果后续新增默认 HUD 静态图片，建议放到：

```text
public/assets/hud/
```

当前核心 HUD 主要由 CSS 和 React/Remotion 展示层渲染，不要求用户准备 HUD 静态资源。

## 输出视频在哪里

单节完整渲染的输出由 lesson 控制：

```json
"render": {
  "outputDir": "out",
  "outputName": "lesson-01-sample.mp4"
}
```

批量 full render 默认输出到 manifest 的：

```text
out/renders/
```

批量 smoke 输出到：

```text
out/renders/smoke/
```

单节 smoke 输出到：

```text
out/{lessonId}-smoke.mp4
```

still 输出到：

```text
out/stills/{lessonId}/
```

clip 输出到：

```text
out/clips/
```

报告输出到：

```text
out/reports/
```

## 哪些文件不能提交 Git

不要提交：

1. `public/input/videos/` 下真实主视频。
2. `public/input/speakers/` 下讲师视频。
3. `public/input/images/` 下真实头像或客户图片。
4. `out/` 下所有渲染输出、still、clip 和报告。
5. `.env`、`.env.*`、密钥和本地账号配置。
6. 未授权字体、商业素材或客户资料。
7. `.obsidian/` 本地笔记配置。

当前 `.gitignore` 已忽略：

```text
out/
public/input/videos/*
public/input/speakers/*
public/input/images/*
```

并保留 `.gitkeep`。

## 哪些文件可以提交 Git

可以提交：

1. `src/data/lessons/*.json`
2. `src/data/course.manifest.json`
3. `docs/*.md`
4. `scripts/*.ts`
5. `src/**/*.ts`、`src/**/*.tsx`、`src/**/*.css`
6. `package.json`、`package-lock.json`

提交前仍要检查 lesson JSON 中是否写入了本机绝对路径或敏感信息。

## 大视频如何交接

推荐做法：

1. 用网盘、硬盘、NAS 或团队约定的素材目录交接。
2. 保持文件名与 lesson id 对应。
3. 在交接表中记录素材来源、授权状态、时长、分辨率和音频情况。
4. 不通过 Git 交接真实视频。

## 素材缺失时怎么处理

主视频缺失：

1. 阻断正式渲染。
2. 补齐 `public/input/videos/...` 文件。
3. 修正 `media.mainVideo.src`。
4. 重新运行 `preflight:render`。

讲师视频缺失：

1. 如果 `audio.mode=speaker-only` 或 `mix`，会阻断。
2. 如果只是视觉讲师卡，可按 `speaker.missingAssetBehavior` 降级为头像、身份牌或隐藏。

头像缺失：

1. 通常是 warning。
2. 可补图片，或允许降级为身份牌。

## 常见命名错误

1. 文件路径写成本机绝对路径：改成 `/input/videos/...`。
2. 文件名有空格、中文和特殊符号：不一定失败，但不利于团队协作；建议使用英文字母、数字、短横线。
3. 输出文件名不以 `.mp4` 结尾：preflight 会报错。
4. `render.outputName` 写成带目录的路径：目录写到 `render.outputDir`。
