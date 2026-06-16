# 第 2 阶段工程决策记录

## 1. 本阶段已确定决策

### A001：第一版采用编辑器与渲染器分离架构

决策：

本地可视化编辑器和 Remotion 渲染器分离。编辑器负责创建和修改配置，渲染器负责读取配置并输出 MP4。

理由：

1. 编辑器 UI 不应污染最终视频。
2. 最终视频不得包含播放器控件、属性面板、选中框或时间轴表格。
3. 分离后渲染流程更稳定，也更方便后续批量渲染。

影响：

1. 配置文件成为编辑器和渲染器之间的核心接口。
2. HUD 展示组件可以共享，但编辑器控件不能进入 Remotion Composition。
3. 后续开发必须保持 `src/editor` 和 `src/remotion` 的边界。

### A002：第一版采用配置驱动

决策：

课程信息、素材、布局、阶段、任务、地图、提示、能力点、时间轴事件和渲染参数都写入 `LessonProjectConfig`。

理由：

1. 产品核心是可复用的课程包装配置。
2. 本地 JSON 便于保存、导入、导出和调试。
3. Remotion 渲染器需要稳定、可校验的输入。

影响：

1. 不在组件里写死课程文案和事件。
2. 编辑器保存前和渲染前都必须校验配置。
3. 后续支持批量渲染时可复用同一配置模型。

### A003：第一版采用时间轴驱动

决策：

所有 HUD 状态变化以主课程视频时间为唯一基准，通过 `CourseStage` 和 `TimelineEvent` 计算。

理由：

1. 产品定位就是时间轴驱动的课程界面渲染器。
2. 编辑器预览和 Remotion 渲染必须结果一致。
3. 手动配置时间点是 MVP 核心能力。

影响：

1. 需要共享 `resolveHudState(config, currentTime)`。
2. 编辑器当前时间变化时要重算 HUD 状态。
3. Remotion 每帧通过 `frame / fps` 计算当前时间。

### A004：第一版技术栈采用 React + TypeScript + Vite + Remotion + Zod + 本地 JSON + Node scripts

决策：

第一版使用该组合完成本地编辑器、配置校验和视频渲染。

理由：

1. React 与 Remotion 可以共享组件语义。
2. TypeScript 和 Zod 能稳定约束复杂配置。
3. Vite 适合快速搭建本地 Web 编辑器。
4. 本地 JSON 与 MVP 本地工具定位一致。
5. Node scripts 足以承担校验和渲染入口。

影响：

1. 后续开发先搭本地 Web 项目，不做 Electron。
2. 数据持久化优先 JSON，不做数据库。
3. 渲染入口通过 Node script 编排 Remotion。

### A005：第一版不做数据库、登录和云端 SaaS

决策：

第一版不引入数据库、账号体系或云端渲染 SaaS。

理由：

1. MVP 目标是验证本地时间轴 HUD 渲染。
2. 云端会引入大视频上传、存储、队列和成本问题。
3. 登录和数据库不影响核心路径验证。

影响：

1. 项目配置保存为本地 JSON。
2. 用户素材保留在本地目录。
3. 后续云端化需另起架构设计阶段。

### A006：第一版不做 Electron 和 OBS 插件

决策：

第一版使用本地 Web 编辑器，不做 Electron 桌面壳，也不做 OBS 插件。

理由：

1. Electron 会增加分发和跨平台文件权限成本。
2. OBS 插件面向实时叠加，不符合离线 MP4 渲染目标。
3. Vite 本地编辑器已能支持核心验证。

影响：

1. 后续若需要桌面应用，可在 Web 版本稳定后再包壳。
2. 不处理 OBS 场景源和实时同步问题。

### A007：课程配置顶层模型命名为 LessonProjectConfig

决策：

使用 `LessonProjectConfig` 作为编辑器保存和渲染器读取的顶层模型。

理由：

1. 名称明确表示单节课项目配置。
2. 能包含项目、课程、素材、布局、事件和渲染参数。
3. 便于后续 schema、类型和示例配置统一命名。

影响：

1. `src/schemas/lessonConfig.schema.ts` 应围绕该模型实现。
2. 示例配置和渲染脚本都应使用该模型。

### A008：时间字段内部统一使用秒数

决策：

配置内部的 `startTime`、`endTime`、`duration` 使用 number 秒数。

理由：

1. 便于计算和比较。
2. Remotion 可通过 `frame / fps` 直接得到秒数。
3. 界面显示可以单独格式化为 `MM:SS` 或 `HH:MM:SS`。

影响：

1. 编辑器输入时间码时需要转换。
2. Zod 校验时间字段为非负数。
3. 不在核心模型中混用字符串时间码和秒数。

### A009：HUD 运行态不保存，只计算

决策：

`HudRuntimeState` 由 `LessonProjectConfig` 和 `currentTime` 计算得到，不写入项目配置。

理由：

1. 保存运行态容易与事件配置不一致。
2. 编辑器和渲染器都可以按需重算。
3. 保持配置文件干净可复用。

影响：

1. HUD 组件接收运行态作为 props。
2. `resolveHudState` 是共享核心函数。

### A010：素材采用本地路径引用，大文件不提交 Git

决策：

主视频、讲师视频、头像和输出 MP4 存放在本地目录，通过配置引用，不提交 Git。

理由：

1. 视频文件体积大。
2. 用户素材可能包含私有或商业内容。
3. Git 更适合保存文档、代码和小型示例配置。

影响：

1. `public/input/videos`、`public/input/lecturer`、`public/input/avatars` 和 `out` 应加入忽略规则。
2. 示例配置可保留，但不能依赖本地私有绝对路径。

### A011：第 3 阶段前补齐课程字段、安全区和事件生命周期

决策：

根据第 2 阶段架构审查，在进入第 3 阶段工程骨架搭建前，先补齐数据模型和时间轴模型中的关键合同字段。

本次补齐：

1. 课程基础信息增加 `lessonTitle`、`lessonIndex`、`totalLessons`、`mainMission`。
2. 讲师信息增加 `assetPriority` 和 `missingAssetBehavior`。
3. 布局配置增加 `mainVideoSafeArea`。
4. 明确 `EditorSessionState` 是编辑器会话状态，不是 Remotion 必需输入。
5. 时间轴模型增加事件命名映射、字段必填策略、生命周期和默认恢复规则。

理由：

这些字段和规则会直接影响 Zod schema、示例配置、编辑器属性面板和 `resolveHudState`。如果留到实现阶段再补，容易造成 UI、schema、渲染器字段漂移。

影响：

1. 第 3 阶段 Schema Agent 应以修正后的 `DATA_MODEL_SPEC.md` 和 `TIMELINE_DATA_MODEL_SPEC.md` 为准。
2. `resolveHudState` 必须实现短时事件恢复和持久状态保留规则。
3. 编辑器安全区参考线只属于编辑器，不进入最终 MP4。

### A012：区分应用默认资源和用户输入 HUD 资源

决策：

新增 `public/assets` 作为应用默认静态资源目录，保留 `public/input/hud` 作为用户项目 HUD 资源目录。

理由：

默认图标、纹理、主题资源与用户课程 logo、客户品牌素材、商业图标的授权和提交规则不同，应在目录层面分开。

影响：

1. `public/assets` 可提交默认资源。
2. `public/input/hud` 默认视为用户输入资源，商业素材不应提交 Git。
3. 后续素材路径解析需要支持两类 public 路径。

### A013：第一版不做 Premiere 插件

决策：

第一版不做 Premiere 插件。

理由：

1. 第一版定位是独立本地 Web 编辑器和 Remotion 离线渲染。
2. Premiere 插件会引入宿主软件依赖、插件分发和时间线 API 复杂度。
3. 产品核心不是剪辑软件扩展，而是配置驱动的课程 HUD 渲染器。

影响：

1. 第 3 阶段不需要考虑 Adobe 插件架构。
2. 后续如需专业剪辑软件集成，应在核心渲染模型稳定后单独立项。

## 2. 本阶段交付文件

第 2 阶段新增：

1. `STAGE_2_ARCHITECTURE_BRIEF.md`
2. `TECH_STACK_DECISION.md`
3. `REPO_STRUCTURE_SPEC.md`
4. `DATA_MODEL_SPEC.md`
5. `TIMELINE_DATA_MODEL_SPEC.md`
6. `EDITOR_ARCHITECTURE_SPEC.md`
7. `RENDER_PIPELINE_SPEC.md`
8. `MEDIA_ASSET_SPEC.md`
9. `STAGE_2_DECISION_LOG.md`

## 3. 仍需确认的问题

### AQ001：讲师视频短于主视频时如何处理

当前建议：

优先降级为冻结最后一帧或切换头像，不做循环。

待确认：

1. 是否冻结最后一帧。
2. 是否自动隐藏讲师小窗。
3. 是否允许用户配置讲师视频偏移。

### AQ002：标准阶段条是否设置硬上限

当前建议：

标准模式建议 3 到 8 个阶段。超过 8 个阶段提示切换紧凑模式。

待确认：

1. 是否硬性限制标准模式最多 8 个阶段。
2. 超过上限时是否自动切换。

### AQ003：配置文件保存位置

当前建议：

开发期默认使用 `public/input/lesson.config.json`，示例配置使用 `src/data/lesson.sample.json`。

待确认：

1. 用户项目配置是否允许另存为任意路径。
2. 是否需要项目文件夹结构。

### AQ004：渲染质量预设

当前建议：

第一版支持 `preview`、`standard`、`high` 三个枚举，但实现可先固定 standard。

待确认：

1. 是否需要低清预览渲染。
2. 是否允许用户选择 FPS。
3. 是否允许用户选择码率。

### AQ005：字体资源授权

当前建议：

优先使用系统字体和明确授权的开源字体。

待确认：

1. 是否随项目提交字体文件。
2. 是否需要科技标题字体作为必需资源。

### AQ006：HUD 静态资源依赖程度

当前建议：

第一版尽量用 CSS 和组件实现 HUD，不依赖大量图片素材。

待确认：

1. 是否需要课程 logo 图片。
2. 是否需要自定义图标集。
3. 缺失 logo 时是否阻断渲染。

### AQ007：是否需要批量渲染入口

当前建议：

批量渲染后置。第一版只渲染当前配置。

待确认：

1. 是否支持多个 lesson 配置批量输出。
2. 批量渲染是否需要单独日志和失败恢复。

### AQ008：是否需要配置迁移机制

当前建议：

配置中保留 `schemaVersion`，但第一版不实现复杂迁移。

待确认：

1. 未来 schema 变更是否自动迁移。
2. 是否需要 migration scripts。

## 4. 给后续开发 Agent 的执行提示

### 4.1 搭项目 Agent

请按 `REPO_STRUCTURE_SPEC.md` 初始化项目结构，优先建立 `src/schemas`、`src/utils`、`src/components/hud`、`src/editor` 和 `src/remotion`。

### 4.2 Schema Agent

请先实现 `LessonProjectConfig` 和 `TimelineEvent` 的 Zod schema，再实现示例配置。不要让编辑器和渲染器各自定义类型。

### 4.3 编辑器 Agent

请优先实现：

1. 导入主视频。
2. 当前时间读取。
3. 中央 16:9 预览。
4. HUD 模块点选。
5. 右侧属性面板。
6. 阶段表和事件表。
7. 使用当前时间。

不要实现复杂剪辑、多轨时间线或自由画布。

### 4.4 Remotion Agent

请优先实现：

1. 读取配置。
2. 校验配置。
3. MainVideoFrame。
4. HUD 组件渲染。
5. `resolveHudState`。
6. 输出 1920 x 1080 MP4。

不要渲染编辑器控件或播放器控件。

## 5. 第 2 阶段完成标准

第 2 阶段完成后，应满足：

1. 工程边界清晰。
2. 技术栈明确。
3. 目录结构明确。
4. 数据模型明确。
5. 时间轴事件模型明确。
6. 编辑器架构明确。
7. 渲染管线明确。
8. 素材管理明确。
9. 后续开发 Agent 可直接开始搭建项目。
