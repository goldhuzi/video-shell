# 从这里开始

这份文档给第一次接触《视频课程套壳》的团队成员阅读。先读完它，再按角色进入后续文档。

## 这个工具是什么

《视频课程套壳》是一个本地课程视频 HUD 渲染工具。

它做的事情很具体：把一条主课程视频、可选讲师视频或头像、课程标题、阶段、任务、地图节点和提示文案，按照用户手动配置的时间轴，渲染成一条带课程 HUD 界面的 16:9 MP4。

一句话定义：

```text
一个时间轴驱动的课程界面渲染器。
```

当前默认视觉模板是 `default-ai-tactical`，中文定位为“AI 战术课程指挥界面”。

## 这个工具不是什么

它不是普通剪辑软件，不做多轨剪辑、复杂转场、字幕精修、BGM、降噪或专业混音。

它不是课程平台，不做登录、支付、学员管理、学习记录、作业批改或多人协作。

它不是播放器，最终输出是普通 MP4，不支持点击跳转、暂停、倍速、音量、全屏或拖动进度条。

它不是 AI 自动识别工具，当前版本不会自动识别章节、自动生成字幕、自动提取重点或自动生成时间点。

## 谁会用它

1. 课程主理人：确认课程结构、阶段切点、重点提示和最终样片质量。
2. 后期制作人员：整理素材、填写配置、预检、渲染和检查输出。
3. 内容助理：整理标题、任务、地图节点、提示、总结和作业文案。
4. 质检人员：检查画面、音频、时间轴和最终视频合规。
5. 技术维护人员：维护 schema、脚本、模板和批量报告。

## 本地准备要求

1. 安装 Node.js。
2. 在项目根目录运行依赖安装：

```bash
npm install
```

3. 把真实课程素材放到 `public/input/` 下。真实视频和渲染输出不要提交到 Git。

## 三个最常用命令

启动本地编辑器：

```bash
npm run dev
```

检查所有 lesson JSON：

```bash
npm run validate:lessons
```

渲染单节课前预检：

```bash
npm run preflight:render -- lesson-01.sample
```

## 最快跑通路径

1. 安装依赖：`npm install`。
2. 启动编辑器：`npm run dev`，浏览器打开 `http://127.0.0.1:5173`。
3. 查看 lesson 清单：`npm run list:lessons`。
4. 复制一个新 lesson：

```bash
npm run create:lesson -- --from lesson-01.sample --to lesson-02
```

5. 在 `src/data/lessons/lesson-02.json` 中替换课程信息、素材路径、阶段和事件。
6. 运行校验：`npm run validate:lessons`。
7. 运行预检：`npm run preflight:render -- lesson-02`。
8. 先渲染 8 秒 smoke：`npm run render:smoke -- lesson-02`。
9. 再用 still 或 clip 检查关键时间点。
10. 完整渲染：`npm run render:lesson -- lesson-02`。

当前版本没有可视化 lesson JSON 导入能力。`create:lesson` 只复制 JSON 并更新 manifest，不复制视频素材。

## 一节课的最短生产流程

1. 准备主课程视频。
2. 准备可选讲师视频或头像。
3. 创建或复制 lesson JSON。
4. 填写课程标题、讲师信息、任务、地图和提示。
5. 配置 stages 和 timelineEvents。
6. 运行 `validate:lessons` 和 `preflight:render`。
7. 先出 smoke，再出 still/clip。
8. 人工 QA。
9. 完整渲染 MP4。
10. 按交付清单放行。

## 重要禁忌

1. 不要把真实课程视频、讲师视频、客户素材或渲染输出提交 Git。
2. 最终 MP4 中不能出现播放、暂停、倍速、音量、全屏或可拖动播放器进度条。
3. CourseStageBar 是课程阶段导航，不是播放器进度条。
4. 编辑器中可以有播放器控件，因为它用于配置时间点；这些控件不能进入最终 MP4。
5. 主视频永远是第一优先级。HUD 只能辅助学习，不能遮挡课程核心内容。
6. 不要把云端、登录、数据库、自动字幕或 AI 自动识别写成当前版本已支持能力。

## 下一步阅读

1. 完整使用流程：`docs/USER_GUIDE.md`
2. 团队生产步骤：`docs/TEAM_PRODUCTION_SOP.md`
3. 命令速查：`docs/COMMAND_REFERENCE.md`
4. 素材放置：`docs/ASSET_NAMING_AND_FOLDER_SPEC.md`
5. 时间轴事件：`docs/TIMELINE_EVENT_GUIDE.md`
6. QA 和交付：`docs/QA_CHECKLIST.md`、`docs/RELEASE_CHECKLIST.md`
7. 所有文档入口：`docs/DOCS_INDEX.md`
