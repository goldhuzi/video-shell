# 第 4 阶段编辑器 MVP 实现说明

## 本阶段完成了什么

1. 将编辑器从静态占位页升级为可编辑 lesson 配置的 MVP。
2. 新增 editor state，让表单、预览、校验和导出都围绕同一份 lesson 草稿工作。
3. 右侧属性面板支持编辑课程信息、讲师信息、素材路径、默认重点提示、任务名称、地图节点名称、阶段名称与阶段时间。
4. 顶部工具栏支持校验配置、导出配置、保存占位、预览刷新和渲染占位。
5. 底部阶段配置区支持手动编辑 `previewTime`，点击阶段跳转到阶段 `startTime`，并编辑阶段 `label/startTime/endTime`。
6. 中央 16:9 预览画面会随编辑内容即时更新，并继续把播放器控制留在画框外。
7. schema 增加了第 4 阶段所需的配置保护：任务 label、阶段 label、阶段时间、阶段重叠和课程序号校验。
8. Remotion 侧继续读取同一份 lesson 结构，不引入编辑器控件或播放器控件。

## 本阶段没有做什么

1. 没有实现复杂时间轴、多轨、拖拽、波形或完整事件编辑器。
2. 没有实现任务、地图节点、阶段的新增、删除或排序。
3. 没有实现浏览器直接写回 `src/data/lessons/lesson-01.json`。
4. 没有引入数据库、登录、云协作、队列、批量渲染或完整渲染器优化。
5. 没有做自由拖拽布局、主题市场、复杂动效或 AI 自动生成。

## 可编辑字段

1. 课程信息：`meta.courseTitle`、`meta.lessonIndex`、`meta.totalLessons`、`meta.lessonTitle`、`meta.mainMission`。
2. 讲师信息：`speaker.name`、`speaker.role`、`speaker.title`、`speaker.stats[].label`、`speaker.stats[].value`、`media.useSpeakerVideo`。
3. 素材路径：`media.mainVideo.src`、`media.speakerVideo.src`、`media.speakerImage.src`、`media.mainVideoFitMode`。
4. 重点提示：当前默认 hint 的 `title` 和 `body`。
5. 任务追踪：`tasks[].label`，并同步到 `tasks[].title`。
6. 课程地图：`chapterMap.nodes[].label`。
7. 阶段条：`stages[].label`、`stages[].name`、`stages[].startTime`、`stages[].endTime`。
8. 布局开关：`showTopHeader`、`showRightPanel`、`showBottomHud`、`showLecturerCard`、`showCourseStageBar`，并同步对应嵌套 `visible` 字段。

## 暂时只能显示的字段

1. `timelineEvents` 仍只在底部事件表中显示和点击跳转，不做编辑。
2. 任务、地图节点和阶段的数量、顺序、ID 与绑定关系暂不编辑。
3. 素材路径只做字符串编辑，浏览器端不直接检查本地文件是否真实存在。
4. 渲染配置仍由现有脚本使用，编辑器中的渲染按钮为占位提示。

## 如何校验配置

1. 点击顶部工具栏的“校验配置”。
2. 编辑器调用 `lessonProjectSchema.safeParse()` 校验当前草稿。
3. 校验通过时显示“配置校验通过”。
4. 校验失败时，底部“校验”视图显示字段路径和错误消息。
5. 导出配置前会再次校验；失败时不会下载 JSON。

## 如何导出配置

1. 点击顶部工具栏的“导出配置”。
2. 系统先规范化 lesson：写入 `updatedAt`，并同步 `media.mainVideoFitMode` 与 `layout.mainVideoFitMode`。
3. 校验通过后，浏览器下载 `lesson-01.edited.json`。
4. JSON 使用 2 空格格式化，方便人工检查和后续复用。

## 导出的配置如何给 Remotion 使用

1. 将导出的 JSON 内容替换或另存到 `src/data/lessons/lesson-01.json`。
2. 运行 `npm run validate:lessons` 确认配置合法。
3. 运行 `npm run studio` 在 Remotion Studio 中查看 `CourseShellComposition`。
4. 运行 `npm run render:sample` 生成 `out/lesson-01-sample.mp4` 样片。

## 已知限制

1. 保存按钮不会写回本地文件，只提示使用导出配置。
2. 素材缺失不会阻断编辑器，Remotion 样片会显示占位画面。
3. `render:sample` 仍固定渲染 60 秒样片，不覆盖完整 360 秒 lesson。
4. Remotion HUD 仍是渲染层内联实现，尚未完全复用 `src/components/hud/*`。
5. 编辑器表单是 MVP 级分组表单，尚未做字段级高亮定位和高级可用性打磨。

## 第 5 阶段建议

1. 增加导入配置能力，支持把导出的 JSON 重新载入编辑器。
2. 增加素材路径检查脚本和编辑器提示，区分主视频阻断错误与讲师素材降级警告。
3. 实现简化事件编辑，覆盖 hint、task、map、skill、summary、homework 事件。
4. 增加 `deriveHudState` 单元测试，覆盖提示消失、阶段重叠、任务切换和地图联动。
5. 将 Remotion `HudLayer` 逐步收敛到共享 HUD 展示组件，降低编辑器预览和最终渲染漂移。
