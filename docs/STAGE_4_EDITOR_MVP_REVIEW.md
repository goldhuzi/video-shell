# 第 4 阶段配置编辑器 MVP 审查报告

## 1. 总体结论

结论：有条件通过。

第 4 阶段已经把编辑器从第 3 阶段占位页推进为可编辑 lesson 配置的 MVP。编辑器可以从 `lesson-01.json` 初始化草稿状态，支持核心字段编辑、预览即时更新、schema 校验和浏览器导出 JSON。Remotion composition 仍然可以启动和渲染样片，最终视频 composition 未出现播放器控件、编辑器属性面板或时间轴表格。

允许进入第 5 阶段，但进入前建议修复 P1 问题，尤其是加载失败提示、校验字段定位、`使用当前时间` 空按钮和导出配置的自动化验证方式。

## 2. 核心评分

| 审查项 | 评分 | 判断 |
| --- | ---: | --- |
| 编辑器配置加载能力 | 4 | 从 `lesson-01.json` 初始化 editor state；缺少加载失败 UI |
| 可编辑字段覆盖度 | 5 | 覆盖课程、讲师、素材、提示、任务、地图、阶段和布局开关 |
| 预览即时更新能力 | 5 | 浏览器实测修改 `courseTitle` 后预览同步更新 |
| 配置校验能力 | 4 | 校验当前 editor state；字段级定位仍较粗 |
| 配置导出能力 | 4 | 实现 Blob 下载；Codex IAB 不支持下载事件自动验证 |
| schema 完整性 | 4 | 覆盖本阶段关键校验；ID 引用和事件 payload 可后续加强 |
| Remotion 兼容性 | 4 | Studio 和 render 可用；HUDLayer 与编辑器 HUD 尚未完全复用 |
| 最终视频无播放器控件合规度 | 5 | Remotion composition 未包含播放器控件 |
| 范围控制 | 5 | 未引入数据库、登录、云端、复杂时间轴或 AI 自动生成 |
| 第 5 阶段准备度 | 4 | 可进入；需补事件编辑、素材检查和测试 |

## 3. 已通过项

1. `src/editor/App.tsx` 使用 `createEditorLessonState(lesson01)` 初始化草稿，并用 `deriveHudState(editorState.lesson, currentTime)` 驱动预览。
2. `src/editor/PropertyPanel.tsx` 支持编辑 `courseTitle`、`lessonIndex`、`totalLessons`、`lessonTitle`、`mainMission`、`speaker.name`、`speaker.role`、`speaker.stats`、素材路径、默认提示、任务 label、地图节点 label、阶段 label/time 和布局开关。
3. `src/editor/TimelinePanel.tsx` 显示 stages 列表、`previewTime`、状态，并支持点击阶段设置预览时间。
4. `src/editor/utils/validateEditorLesson.ts` 调用统一 Zod schema 校验当前草稿。
5. `src/editor/utils/exportLesson.ts` 导出前规范化 `fit-width/fit-height` 到 schema 兼容字段。
6. `src/schemas/lesson.schema.ts` 已校验正课程序号、`totalLessons >= lessonIndex`、canvas、fps、任务 label、地图节点 label、阶段 label、阶段时间和阶段重叠。
7. `src/remotion/CourseShellComposition.tsx` 仍只组合 `MainVideoLayer`、`SpeakerLayer`、`HudLayer`，未引用编辑器组件。
8. `src/remotion/layers/MainVideoLayer.tsx` 和 `SpeakerLayer.tsx` 使用 Remotion `<Video>`，未传入 `controls`。
9. 文档 `docs/STAGE_4_EDITOR_MVP_NOTES.md` 和 `README.md` 已说明本阶段完成项、导出流程、限制和第 5 阶段建议。

## 4. 主要问题

1. `src/utils/loadLesson.ts`：加载或 schema 解析失败时会在模块初始化阶段抛错，编辑器没有用户可读的加载失败 UI。当前样例合法不影响启动，但导入/替换配置后容易变成白屏。
2. `src/editor/EditorShell.tsx`：画框外“使用当前时间”按钮没有绑定任何写入逻辑。第 4 阶段可接受，但第 5 阶段做事件和阶段时间编辑前应补齐或移除。
3. `src/editor/PropertyPanel.tsx`：表单逻辑集中在一个较大的组件中。当前 MVP 可维护，但第 5 阶段加入事件编辑后应拆为 Course/Speaker/Media/Warning/Tasks/Map/Stages/Layout 子表单。
4. `src/editor/utils/validateEditorLesson.ts`：错误只映射为 `path/message` 列表，尚未与具体表单字段做高亮绑定。
5. `src/remotion/layers/HudLayer.tsx`：Remotion HUD 仍是内联实现，没有完全复用 `src/components/hud/*`，存在长期视觉和字段漂移风险。
6. `src/editor/utils/exportLesson.ts`：导出依赖浏览器下载能力。普通浏览器可用，但 Codex In-app Browser 不支持 download 事件，自动化验收只能确认代码路径和按钮存在。

## 5. P0 必须修复项

无。

未发现附件中要求直接判定“不通过”的问题：编辑器可启动、可加载 lesson、可修改核心课程信息、可校验当前编辑状态、可导出配置代码路径、Remotion Studio 和样片渲染可用，最终 composition 未出现播放器控件，也未引入数据库、登录或云端 SaaS。

## 6. P1 建议修复项

1. `src/utils/loadLesson.ts` / `src/editor/App.tsx`：增加加载失败状态和错误提示。修复建议：用 `safeParse` 初始化 editor state，失败时显示“配置加载失败 + 错误列表”，不要让 React 根组件直接崩溃。
2. `src/editor/EditorShell.tsx`：补齐“使用当前时间”按钮行为，或在第 4 阶段审查后暂时隐藏。修复建议：第 5 阶段将其绑定到当前选中的阶段/事件时间字段。
3. `src/editor/PropertyPanel.tsx`：拆分大型表单组件。修复建议：新增 `src/editor/forms/*`，每组表单只负责一个配置区域。
4. `src/editor/utils/validateEditorLesson.ts`：增强错误映射。修复建议：返回 `path`、`message`、`severity`、`fieldKey`，并在属性面板显示字段级错误。
5. `src/remotion/layers/HudLayer.tsx`：逐步收敛到共享 HUD 组件。修复建议：先抽出无交互的 HUD 展示组件，编辑器选择层继续留在 `PreviewCanvas` 外壳中。

## 7. P2 后续优化项

1. 为 `timelineEvents` 增加简化编辑表单，覆盖 hint、task、map、skill、summary、homework。
2. 增加素材路径检查脚本，区分主视频阻断错误和讲师素材降级警告。
3. 增加 `deriveHudState` 单元测试，覆盖阶段切换、提示消失、任务切换、地图联动。
4. 增加导入 JSON 能力，让 `lesson-01.edited.json` 可以重新载入编辑器。
5. 准备真实小体积测试素材，验证主视频音频、讲师视频、头像 fallback 和最终 MP4。

## 8. 命令运行结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `npm run typecheck` | 通过 | `tsc --noEmit` 退出码 0 |
| `npm run validate:lessons` | 通过 | `lesson-01.json` 校验成功，共 1 个文件 |
| `npm run dev` | 通过 | 指定端口 `5175` 启动成功，`Invoke-WebRequest http://127.0.0.1:5175/` 返回 200 |
| `npm run studio -- --port 3001` | 失败 | 端口 3001 被占用 |
| `npm run studio` | 通过 | Remotion Studio 自动启动到 `http://localhost:3000`，日志显示 `Server ready` 和 `Built` |
| `npm run render:sample` | 通过 | 输出 `out/lesson-01-sample.mp4`；占位素材 404 为样例素材缺失导致的预期 fallback |

浏览器验收结果：

1. 页面可打开，存在“视频课程套壳”、校验配置、导出配置、16:9 预览画框和画框外预览控制。
2. 修改 `courseTitle` 为 `Review Course Title` 后，预览 TopHeader 同步更新。
3. 点击“校验配置”后显示“配置校验通过”。
4. 预览画框内没有 `input`、`select` 或 `video[controls]`。画框内存在 HUD 选择用透明按钮，这是编辑器选择层，不进入 Remotion composition。
5. Codex In-app Browser 不支持 download 事件，因此未能自动保存下载文件；代码实现使用 Blob + anchor 下载。

## 9. 风险清单

| 风险 | 等级 | 描述 | 建议处理 |
| --- | --- | --- | --- |
| 编辑器状态管理扩大后变复杂 | 中 | 当前 `App.tsx` 用统一 `updateLesson` 可控，但第 5 阶段事件编辑会增加复杂度 | 引入 reducer 或按表单拆分 update helpers |
| 表单字段和 schema 漂移 | 中 | `speaker.role`、`stats` 已加入 schema；未来新增事件 payload 容易漂移 | 新字段先改 schema，再改表单和 Remotion |
| 导出 JSON 与 Remotion 字段不一致 | 中 | `media.mainVideoFitMode` 与 `layout.mainVideoFitMode` 需要同步 | 保留 `prepareLessonForExport`，增加测试 |
| 校验只显示列表不定位字段 | 中 | 非程序员用户可能不知道错误在哪个输入框 | 第 5 阶段做字段级错误绑定 |
| 预览不随新增事件变化 | 中 | 当前预览对基础字段可即时更新，事件尚未编辑 | 第 5 阶段事件编辑必须复用 `deriveHudState` |
| 素材缺失导致正式渲染不可交付 | 中 | 当前 fallback 不崩溃，但正式成片不能只显示占位 | 增加素材检查脚本，主视频缺失阻断正式渲染 |
| 过早引入复杂后端 | 低 | 当前未引入后端、数据库、登录 | 继续坚持本地 JSON + 导入导出 |
| 复杂时间轴导致范围失控 | 中 | 第 5 阶段容易滑向多轨剪辑 | 只做阶段表 + 事件表，不做拖拽波形 |
| 最终视频误加播放器控件 | 低 | 当前 Remotion 合规；风险来自未来复用 `PreviewCanvas` | 不要把 `SelectableHud` 和 `preview-controls` 引入 Remotion |
| 第 5 阶段扩展成本 | 中 | `PropertyPanel` 已偏大，继续堆事件会难维护 | 先拆 forms，再加事件编辑 |

## 10. 是否允许进入第 5 阶段

允许进入第 5 阶段。

进入条件：第 5 阶段开始前优先处理 P1 中的加载失败提示和表单拆分；事件编辑仍必须保持“简化事件表 + 手动时间点”的边界，不做复杂拖拽、多轨、AI 自动识别或云端协作。

## 11. 给第 5 阶段开发 Agent 的建议

1. 先拆分 `PropertyPanel`，再加 `timelineEvents` 编辑，避免把所有表单继续堆进一个文件。
2. 为 `deriveHudState` 写测试，再改事件编辑，避免编辑器预览和 Remotion 输出漂移。
3. 增加素材检查脚本：主视频缺失为阻断错误，讲师视频/头像缺失为降级警告。
4. 补齐“使用当前时间”按钮，让它能写入当前选中的阶段或事件时间字段。
5. Remotion 不要引用 `src/editor/PreviewCanvas.tsx`；若要复用 HUD，请先抽出无交互展示层。
6. 继续保持最终 MP4 无播放器控件，CourseStageBar 只能表达学习导航状态。

## 12. 最终结论

第 4 阶段实现符合“配置编辑器 MVP”的核心目标：能加载配置、编辑核心字段、即时预览、校验当前草稿、导出 JSON，并保持 Remotion 渲染链路可用。当前问题主要是体验和可维护性层面的 P1/P2，不阻断进入第 5 阶段。

最终判定：有条件通过，可以进入第 5 阶段。
