# 第 2 阶段工程架构一致性审查报告

## 1. 总体结论

结论：有条件通过。

第 2 阶段工程架构文档整体符合《视频课程套壳》的产品定位：它仍然围绕“本地可视化编辑器 + 配置驱动 + 时间轴驱动 + Remotion 渲染 16:9 MP4”展开，没有跑向普通剪辑软件、课程平台、播放器或云端 SaaS。

当前文档已经足够支撑第 3 阶段开始搭建工程骨架，但在正式实现 Zod schema 和示例配置前，需要补齐少量 P0/P1 级细节，尤其是课程基础字段、安全显示区、讲师素材优先级、事件命名兼容表和素材目录命名一致性。

修正状态：

1. P0-1 课程基础信息字段已补入 `DATA_MODEL_SPEC.md`。
2. P0-2 主视频安全显示区配置已补入 `DATA_MODEL_SPEC.md`。
3. P0-3 事件结束后的状态恢复规则已补入 `TIMELINE_DATA_MODEL_SPEC.md`。
4. P1 中的事件命名映射、讲师素材优先级、`public/assets` 职责区分、Premiere 插件不做说明已补入对应文档。

## 2. 核心评分

| 审查项 | 评分 | 判断 |
| --- | ---: | --- |
| 产品定位一致性 | 5/5 | 明确保持“时间轴驱动的课程界面渲染器”定位 |
| 技术架构合理性 | 4/5 | 技术栈合理，缺少 Premiere 插件不做的说明 |
| 编辑器与渲染器分离 | 5/5 | 边界清楚，配置文件是核心接口 |
| 数据模型完整性 | 4/5 | 主体完整，但课程总课数、主线任务、安全区、讲师素材优先级需补 |
| 时间轴模型完整性 | 4/5 | 可执行性强，但事件命名需与产品/审查口径增加映射 |
| 编辑器架构可执行性 | 5/5 | 符合“可视化预览 + 属性面板 + 时间轴配置” |
| 渲染流程可执行性 | 5/5 | 流程清晰，不依赖编辑器 DOM |
| 素材管理清晰度 | 4/5 | 本地素材规范清楚，但目录命名需与审查标准统一 |
| 后续开发可执行性 | 4/5 | 可以进入第 3 阶段，schema 前需补齐字段 |

## 3. 主要优点

1. 产品边界稳定：`STAGE_2_ARCHITECTURE_BRIEF.md` 明确本产品不是剪辑、播放或托管系统，而是基于本地配置和主视频时间轴的 HUD 视频生成系统。
2. 技术栈贴合 MVP：`TECH_STACK_DECISION.md` 选择 React、TypeScript、Remotion、Vite、Zod、本地 JSON、Node scripts，复杂度适中。
3. 编辑器与渲染器分离明确：`STAGE_2_ARCHITECTURE_BRIEF.md`、`EDITOR_ARCHITECTURE_SPEC.md`、`RENDER_PIPELINE_SPEC.md` 都强调编辑器 UI 不进入最终 MP4。
4. 时间轴驱动模型可执行：`TIMELINE_DATA_MODEL_SPEC.md` 定义了 `TimelineEvent`、payload、priority、状态计算顺序和冲突处理规则。
5. Remotion 渲染流程清楚：`RENDER_PIPELINE_SPEC.md` 明确读取配置、校验、读取素材、按帧计算 `currentTime`、计算 HUD 状态并输出 MP4。
6. 素材管理符合本地工具定位：`MEDIA_ASSET_SPEC.md` 明确大视频不提交 Git，主视频缺失阻断渲染。

## 4. 主要问题

### 问题 1：课程基础信息字段略少

出现位置：`DATA_MODEL_SPEC.md`

问题说明：

当前 `CourseMetadata` 包含 `courseTitle`、`chapterTitle`、`lessonNumber`、`courseCode`、`statusLabel`、`description`，但审查标准要求至少覆盖“第几课、总课数、本节课标题、主线任务”。其中“总课数”和“主线任务”没有明确字段，“本节课标题”与 `chapterTitle` 可近似对应，但命名不够直观。

建议修正：

在 `CourseMetadata` 中补充：

```ts
lessonTitle?: string;
lessonIndex?: number;
totalLessons?: number;
mainMission?: string;
```

并说明 `chapterTitle` 与 `lessonTitle` 的关系，避免后续 TopHeader 字段命名混乱。

### 问题 2：主视频安全显示区没有进入第 2 阶段数据模型

出现位置：`DATA_MODEL_SPEC.md`

问题说明：

第 0/1 阶段反复强调主视频优先和安全区域。第 2 阶段在 `EDITOR_ARCHITECTURE_SPEC.md` 的点击映射中提到“安全区”，但 `LayoutConfig` 没有 `safeArea`、`safeAreaGuide` 或 HUD 遮挡风险相关配置。

为什么是问题：

第 3 阶段如果直接实现 schema，会缺少主视频安全显示区的数据承载点，后续很容易只做 `contain/cover`，但无法表达右侧栏、底部栏、讲师小窗对主视频关键区域的避让策略。

建议修正：

在 `LayoutConfig` 或 `MainVideoLayoutConfig` 中补充：

```ts
mainVideoSafeArea?: {
  showGuideInEditor: boolean;
  protectedRegions?: Array<"left" | "right" | "bottom" | "top" | "center">;
  notes?: string;
};
```

该字段仅用于编辑器提示和渲染前检查，不代表最终视频出现参考线。

### 问题 3：讲师素材优先级未明确

出现位置：`DATA_MODEL_SPEC.md`、`MEDIA_ASSET_SPEC.md`

问题说明：

当前定义了 `lecturerVideo`、`lecturerAvatar` 和 `displayMode`，但没有明确“讲师视频优先还是头像优先”“视频缺失时是否自动降级为头像”“头像缺失时是否隐藏或显示身份牌”的配置字段。

建议修正：

在 `LecturerProfile` 中增加：

```ts
assetPriority?: Array<"video" | "avatar" | "identity_card" | "hidden">;
missingAssetBehavior?: "block_render" | "fallback_to_avatar" | "fallback_to_identity_card" | "hide";
```

并与 `MEDIA_ASSET_SPEC.md` 的缺失素材处理保持一致。

### 问题 4：时间轴事件命名与审查口径不完全一致

出现位置：`TIMELINE_DATA_MODEL_SPEC.md`

问题说明：

当前事件命名为：

1. `map_node_activate`
2. `task_update`
3. `hint_show`
4. `skill_unlock`
5. `stage_summary`
6. `homework_reminder`

审查标准中使用的是：

1. `map_node_active`
2. `task_active` / `task_done`
3. `warning_show` / `tip_show`
4. `ability_unlock`
5. `summary_show`
6. `homework_show`

这不是方向性错误，因为当前命名与第 0 阶段 `TIMELINE_EVENT_SPEC.md` 更一致；但如果不加说明，后续 Agent 可能误以为要实现两套事件。

建议修正：

在 `TIMELINE_DATA_MODEL_SPEC.md` 增加“事件命名映射表”，明确第一版 canonical event type：

| 产品口径/别名 | 工程 canonical type |
| --- | --- |
| map_node_active | map_node_activate |
| task_active / task_done | task_update |
| warning_show / tip_show | hint_show |
| ability_unlock | skill_unlock |
| summary_show | stage_summary |
| homework_show | homework_reminder |

### 问题 5：`TimelineEvent` 的 `endTime` 和 `animation` 不是必填

出现位置：`TIMELINE_DATA_MODEL_SPEC.md`

问题说明：

审查标准要求每个事件至少包含 `endTime` 和 `animation`。当前模型中 `endTime?: number`、`animation?: TimelineAnimationConfig` 为可选。

判断：

这不是严重缺陷。瞬时事件如地图节点点亮、任务完成、阶段切换不一定需要 `endTime`。但提示类、总结类、作业提醒类必须有 `endTime` 或 `duration`。`animation` 可选也合理，因为 reduced motion 或无动画事件存在。

建议修正：

在文档中增加更强约束：

1. `hint_show`、`stage_summary`、`homework_reminder` 必须提供 `endTime` 或 `duration`。
2. 瞬时事件可不提供 `endTime`，但必须定义“事件生效后是否保持状态”。
3. `animation` 可选，但每类事件必须有默认动画。

### 问题 6：事件结束后恢复默认状态规则不够明确

出现位置：`TIMELINE_DATA_MODEL_SPEC.md`、`RENDER_PIPELINE_SPEC.md`

问题说明：

文档定义了事件命中、优先级和状态计算顺序，但对“事件结束后如何恢复”只间接覆盖。尤其是 `hint_show` 结束后 WarningPanel 是回到 empty、默认提示，还是保留上一个阶段提示，需要明确。

建议修正：

在 `TIMELINE_DATA_MODEL_SPEC.md` 增加“事件生命周期规则”：

1. 提示类事件结束后回到当前阶段默认提示；若无默认提示则 empty。
2. 状态类事件如地图节点点亮、任务完成为持久状态，除非后续事件覆盖。
3. BottomStatusHud 的短时事件结束后回到 idle。

### 问题 7：仓库结构缺少 `public/assets` 命名层

出现位置：`REPO_STRUCTURE_SPEC.md`、`MEDIA_ASSET_SPEC.md`

问题说明：

审查标准建议覆盖 `public/assets`。当前文档使用 `public/input/hud` 和 `public/fonts`，没有 `public/assets`。

判断：

当前目录并非不可用，且 `public/input/hud` 更强调用户输入素材。但建议区分“用户输入素材”和“应用内静态资源”。

建议修正：

增加：

```text
public/assets/
  icons/
  textures/
  default-hud/
```

保留 `public/input/hud` 用于用户项目自带 HUD 资源或 logo。

### 问题 8：技术栈决策缺少 Premiere 插件不做的说明

出现位置：`TECH_STACK_DECISION.md`

问题说明：

文档解释了不做数据库、登录、云端 SaaS、Electron、OBS 插件，但审查标准还要求说明为什么第一版不做 Premiere 插件。

建议修正：

补充一节“为什么第一版不做 Premiere 插件”：

1. 第一版目标是独立本地 Web 编辑器和 Remotion 离线渲染。
2. Premiere 插件会引入宿主软件依赖、插件分发和时间线 API 复杂度。
3. 产品不是传统剪辑软件插件，而是配置驱动的课程 HUD 渲染器。

## 5. 必须修改的问题 P0

### P0-1：补齐课程基础信息字段

文档：`DATA_MODEL_SPEC.md`

必须补充：

1. `lessonTitle`
2. `lessonIndex`
3. `totalLessons`
4. `mainMission`

原因：

这些字段会直接影响 TopHeader、任务主线和课程上下文。如果 schema 阶段缺失，后续 UI 和 Remotion 都会用临时字段绕路。

### P0-2：补齐主视频安全显示区配置

文档：`DATA_MODEL_SPEC.md`

必须补充：

1. 主视频安全区字段。
2. 编辑器安全区参考线是否显示。
3. HUD 遮挡风险备注或检查入口。

原因：

主视频优先是第 0/1 阶段核心原则，不能只停留在说明文字里。

### P0-3：明确事件结束后的状态恢复规则

文档：`TIMELINE_DATA_MODEL_SPEC.md`

必须补充：

1. 提示类事件结束后的 fallback。
2. 状态类事件是否持久。
3. BottomStatusHud 短时状态结束后的 idle 规则。

原因：

这是 `resolveHudState` 实现的关键逻辑，不明确会导致编辑器预览和 Remotion 渲染不一致。

## 6. 建议修改的问题 P1

### P1-1：增加时间轴事件命名映射表

文档：`TIMELINE_DATA_MODEL_SPEC.md`

建议把产品别名和工程 canonical type 对齐，避免第 3 阶段重复实现事件。

### P1-2：明确讲师素材优先级和缺失降级策略

文档：`DATA_MODEL_SPEC.md`、`MEDIA_ASSET_SPEC.md`

建议增加 `assetPriority` 和 `missingAssetBehavior`。

### P1-3：增加 `public/assets` 与 `public/input/hud` 的职责区分

文档：`REPO_STRUCTURE_SPEC.md`、`MEDIA_ASSET_SPEC.md`

建议 `public/assets` 存应用内默认资源，`public/input/hud` 存用户项目资源。

### P1-4：补充不做 Premiere 插件的技术决策

文档：`TECH_STACK_DECISION.md`

建议与 OBS、Electron 的取舍放在同一章节。

### P1-5：在数据模型中补充编辑器会话状态说明

文档：`DATA_MODEL_SPEC.md`

当前 `EDITOR_ARCHITECTURE_SPEC.md` 已定义 `EditorState`，但 `DATA_MODEL_SPEC.md` 没有说明“当前选中模块、预览时间、保存状态”属于编辑器会话状态，不属于渲染配置。

建议补充：

```ts
type EditorSessionState = {
  currentTime: number;
  selectedTarget?: EditorSelection;
  saveStatus: "saved" | "dirty" | "saving" | "error";
};
```

并明确它不进入最终 MP4，也不作为 Remotion 必需输入。

## 7. 可后置优化的问题 P2

1. 批量渲染入口：`STAGE_2_DECISION_LOG.md` 已后置，当前合理。第 3 阶段只需保证 `render-lesson.ts` 支持传配置路径，为未来批量渲染留口。
2. 配置迁移机制：保留 `schemaVersion` 已足够，迁移脚本可后置。
3. 渲染质量预设：当前可先固定 standard，preview/high 后续再做。
4. 字体授权管理：第 3 阶段可先使用系统字体或明确授权字体，字体打包策略后置。
5. HUD 静态资源依赖：第一版优先 CSS 和组件实现，复杂图片资源后置。

## 8. 跑偏风险提醒

### 风险 1：编辑器滑向普通剪辑软件

等级：中

描述：

如果第 3 阶段为了“时间轴体验”引入多轨剪辑、素材切割、复杂转场，会偏离产品核心。

建议：

继续坚持阶段表 + 事件表，不做多轨剪辑线。

### 风险 2：最终视频误加播放器控件

等级：高

描述：

编辑器需要播放、暂停、拖动控件，若组件边界不清，可能被误放进 Remotion Composition。

建议：

Remotion Composition 只从 `src/components/hud` 和 `src/components/video` 取最终视频组件，不引用 `src/editor`。

### 风险 3：主视频被 HUD 遮挡

等级：高

描述：

当前文档强调主视频优先，但数据模型缺少安全区字段。实现时可能只按固定布局渲染，缺少遮挡检查。

建议：

第 3 阶段先补 `mainVideoSafeArea` 和渲染前检查提示。

### 风险 4：时间轴状态恢复不一致

等级：高

描述：

提示结束后恢复到什么状态尚不够明确，容易导致编辑器预览和渲染结果不一致。

建议：

在实现 `resolveHudState` 前补充事件生命周期规则。

### 风险 5：数据模型过复杂

等级：中

描述：

模型已经覆盖课程、讲师、素材、布局、主题、阶段、任务、地图、提示、能力点、事件和渲染。若第 3 阶段一次性全量实现，可能拖慢骨架搭建。

建议：

第 3 阶段按最小示例配置实现，先跑通主视频 + 3 个 HUD 组件 + 3 类事件，再扩展。

### 风险 6：数据模型过简单

等级：中

描述：

当前缺少安全区、主线任务、总课数和讲师素材优先级，若不补会让 UI/渲染层临时扩字段。

建议：

在 schema 实现前补齐，不要让 UI 私有字段漂移。

### 风险 7：素材路径在浏览器和 Node 中解析不一致

等级：中

描述：

配置使用相对 `public` 的路径，浏览器可访问，但 Node 渲染脚本需要映射到本地文件路径。

建议：

第 3 阶段实现 `assetPaths.ts`，统一浏览器 URL 与文件系统路径解析。

### 风险 8：大文件管理风险

等级：中

描述：

虽然文档要求大视频不提交 Git，但当前仓库尚未真正建立 `.gitignore`。

建议：

第 3 阶段初始化工程时立即加入 `.gitignore`，覆盖 `public/input/videos/*`、`public/input/lecturer/*`、`out/*`。

### 风险 9：后续扩展到桌面或云端时路径模型需要调整

等级：低

描述：

当前本地路径模型适合 MVP，但未来 Electron 或云端渲染需要资源上传、权限和路径抽象。

建议：

保留 `MediaAsset.src`，后续可增加 `sourceType: "local" | "remote" | "uploaded"`。

## 9. 对第 3 阶段的准备度判断

准备度：80%。

可以开始第 3 阶段工程骨架搭建，但建议在搭 schema 前先完成 P0 修正。

第 3 阶段可以直接做：

1. 初始化 React + TypeScript + Vite + Remotion。
2. 建立 `src/editor`、`src/remotion`、`src/components`、`src/schemas`、`src/utils`。
3. 创建最小 `LessonProjectConfig` 示例。
4. 创建 Zod schema。
5. 创建 `resolveHudState` 空实现或最小实现。
6. 创建编辑器三栏占位布局。
7. 创建 Remotion composition。
8. 使用占位主视频或占位画面跑通 render。

但 schema 前必须补齐：

1. 课程总课数、主线任务、本节课标题。
2. 主视频安全区。
3. 事件生命周期和恢复规则。

## 10. 给第 3 阶段开发 Agent 的建议

1. 先实现 schema，不要先画 UI。schema 是编辑器和渲染器的合同。
2. 先跑通一份最小 `lesson.sample.json`，包含 3 个阶段、3 个地图节点、3 个任务、2 个提示事件。
3. `resolveHudState` 必须放在 `src/utils`，编辑器和 Remotion 共同使用。
4. Remotion Composition 禁止引用 `src/editor`。
5. 编辑器播放器控件必须放在 16:9 画框外。
6. `CourseStageBar` 只显示阶段块、节点和状态，不显示播放头、拖动滑块或时间进度。
7. 主视频默认 `contain`，并在编辑器中显示裁切风险提示。
8. 素材路径解析统一通过 `assetPaths.ts`，不要在组件里拼路径。
9. 骨架阶段先做静态 HUD 占位，再接入完整视觉细节。
10. 第 3 阶段不要做数据库、登录、云端渲染、Electron、OBS 或 Premiere 插件。

## 11. 最终结论

第 2 阶段文档整体合格，判断为“有条件通过”。

它已经正确保留了产品定位、技术边界、编辑器与渲染器分离、配置驱动和时间轴驱动这些核心原则；没有明显跑偏到剪辑软件、课程平台、播放器或 SaaS 系统。

进入第 3 阶段前，必须补齐 `DATA_MODEL_SPEC.md` 中的课程基础字段和主视频安全区，并在 `TIMELINE_DATA_MODEL_SPEC.md` 中明确事件结束后的状态恢复规则。完成这些补充后，第 3 阶段开发 Agent 可以直接开始搭建工程骨架。
