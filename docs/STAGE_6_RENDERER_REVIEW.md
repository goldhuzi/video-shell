# 第 6 阶段渲染器审查报告

审查对象：第 6 阶段“本地单节课渲染链路”

审查日期：2026-06-17

审查角色：Course HUD Director Agent、Render Engineering Agent、事实边界审稿人、证据与验收 Agent

## 审查结论

第 6 阶段审查结论：有条件通过。

综合评分：82 / 100。

允许进入第 7 阶段的前置验收与视觉精修准备，但第 7 阶段第一优先级必须是准备授权安全真实素材，并跑通 `preflight:render`、`render:smoke`、`render:lesson` 的成功路径。在此之前，不能表述为“真实素材稳定出片”“生产就绪”或“模板已完成视觉定稿”。

当前无 P0 阻断项。第 6 阶段已经完成渲染命令、预检、音频路由、HUD 状态测试和 Remotion composition 接入。审查后已用 `lesson-render-fixture` 安全小样证明成功出片路径；示例 `lesson-01` 仍使用占位主视频，等待用户真实授权课程素材替换。

## 审查后整改记录

整改日期：2026-06-17

已解决：

1. `audio.mode=mix` 缺讲师视频时已由 warning 收紧为 error，并新增 `scripts/test-preflight-render.ts` 回归测试。
2. 已新增 `render:still` 和 `render:clip`，两个命令都会先执行正式 preflight。
3. 已新增 `src/data/lessons/lesson-render-fixture.json`，并用本地 ignored 合成素材跑通成功出片路径。
4. 已跑通 `preflight:render`、`render:smoke`、`render:still`、`render:clip` 和 `render:lesson` 的 fixture 验证。
5. 已用 `ffprobe` 确认 `out/lesson-render-fixture-final.mp4` 为 1920 x 1080、30fps、12 秒。
6. 编辑器“渲染”按钮提示已更新为正式 CLI 预检和渲染指引。
7. Remotion/browser 素材解析已收紧为本地 public 素材口径。
8. 正式渲染和 still 输出遇到同名文件时会打印覆盖提示。
9. 已新增 `npm test` 聚合 `validate:lessons`、`test:hud` 和 `test:preflight`。

仍需继承：

1. `lesson-render-fixture` 证明本地安全小样链路可出片，不代表用户真实课程素材已验收。
2. `lesson-01` 仍保留占位主视频路径，等待用户提供授权真实课程素材。
3. 后续仍需实现 lesson JSON 导入和 HUD 展示组件收敛。

## P0 阻断项

无。

本次审查未发现以下阻断问题：

1. 未发现缺少 `render:lesson`、`preflight:render` 或 `render:smoke` 的情况。
2. 未发现最终 Remotion composition 引入播放器控件、编辑器控件、表单控件或可拖动播放器进度条。
3. 未发现 CourseStageBar 被做成播放器进度条。
4. 未发现 HUD 只静态展示而不随时间轴变化。
5. 未发现主视频缺失时正式渲染仍继续出片。
6. 未发现云端、登录、数据库、课程平台、批量队列、自动字幕或自由拖拽设计工具等越界实现。

## P1 必须优先处理

### P1-1 真实素材成功渲染路径尚未验证

`src/data/lessons/lesson-01.json:28` 仍配置 `/input/videos/lesson-01-main-placeholder.mp4`，当前本地不存在该文件。`npm run preflight:render -- lesson-01`、`npm run render:smoke -- lesson-01` 和 `npm run render:lesson -- lesson-01` 都因主视频缺失退出 1。

这证明了“主视频缺失会阻断正式渲染”，但不能证明“真实素材可稳定出片”。第 7 阶段前必须补一组授权安全小体积主视频、讲师视频和头像，跑通成功路径后再进行关键片段验收和视觉定稿。

整改状态：已新增 `lesson-render-fixture` 和本地 ignored 合成素材，并跑通 preflight、smoke、still、clip 和正式 render。`lesson-01` 仍需用户真实课程素材替换。

建议：

1. 将真实主课程视频放入 `public/input/videos/`。
2. 将讲师视频放入 `public/input/speakers/`，头像放入 `public/input/images/`。
3. 更新 `lesson-01.json` 后依次运行 `npm run preflight:render -- lesson-01`、`npm run render:smoke -- lesson-01`、`npm run render:lesson -- lesson-01`。

### P1-2 `audio.mode=mix` 缺讲师视频时预检语义偏弱

`scripts/preflight-render.ts:282` 到 `scripts/preflight-render.ts:304` 中，`audio.mode=speaker-only` 缺讲师视频会报 error，但 `audio.mode=mix` 缺讲师视频只报 warning。与此同时，`src/remotion/CourseShellComposition.tsx:265` 到 `src/remotion/CourseShellComposition.tsx:270` 会在 `mix` 下强制使用讲师视频并解除讲师视频静音；`src/remotion/layers/SpeakerLayer.tsx:151` 到 `src/remotion/layers/SpeakerLayer.tsx:166` 在没有可用讲师视频时无法提供讲师音频。

审查时的结果是：`mix` 配置可能通过预检，但最终实际只剩主视频音频，和“mix 同时保留主视频与讲师视频音频”的阶段说明不完全一致。

整改状态：已采用严格方案，`audio.mode=mix` 缺讲师视频时 preflight 报 error。

建议二选一冻结：

1. 严格方案：`audio.mode=mix` 缺讲师视频时也设为 error。
2. 降级方案：允许 warning，但必须在 render plan 中明确降级为 `main-only`，并在日志和文档中写清楚。

### P1-3 缺少 Remotion still / 关键片段视觉验收脚本

`scripts/test-hud-state.ts` 已覆盖 117/118/124/150/248/270/316/340/355 秒的 HUD 状态语义，但它证明的是数据状态，不证明最终画面的像素、排版可读性、HUD 不遮挡主视频或视觉动效是否符合预期。

审查时 `package.json:6` 到 `package.json:16` 没有 `render:still`、`render:clip` 或类似关键片段验收脚本。`render:smoke` 只有 8 秒，也覆盖不到第 5 阶段审查要求的后半段事件。

整改状态：已新增 `render:still` 和 `render:clip`。

建议第 7 阶段补：

1. `render:still`：覆盖 36、118、150、248、270、316、340、355 秒。
2. `render:clip`：至少覆盖 warning、ability unlock、summary、homework 的事件窗口。
3. 验收输出：截图或短片段、文件路径、时间点、对应 HUD 状态说明。

## P2 改进项

### P2-1 Remotion 端素材解析比正式预检更宽

正式预检在 `scripts/media-paths.ts:75` 到 `scripts/media-paths.ts:97` 拒绝远程 URL、`file:`、`data:`、`blob:` 和 Windows 绝对路径。但 Remotion/browser 端 `src/utils/media.ts:18` 到 `src/utils/media.ts:50` 会允许外部路径，并把 Windows 绝对路径转为 `file:///`。

正式 `render:lesson` 受 preflight 保护，所以这不是 P0；但 Studio、开发样片或直接传 props 时存在素材边界漂移风险。

整改状态：Remotion/browser 端素材解析已收紧，不再放行远程 URL、本机绝对路径或 `file:` / `data:` / `blob:`。

### P2-2 编辑器“渲染”按钮仍是旧占位提示

`src/editor/App.tsx:105` 到 `src/editor/App.tsx:112` 的 `handleRender` 仍提示“渲染流程将在第 6 阶段完善；当前可使用 npm run render:sample 验证样片”。第 6 阶段 CLI 渲染链路已经接入，该提示已过期。

这不影响 CLI 渲染，但会误导用户以为第 6 阶段还未完成，或误把 `render:sample` 当正式链路。

整改状态：编辑器渲染按钮已改为提示正式 CLI preflight 和 render 命令，不再指向旧的第 6 阶段占位文案。

### P2-3 正式渲染默认覆盖同名输出文件

`scripts/render-utils.ts:93` 到 `scripts/render-utils.ts:100` 中 `renderMedia` 使用 `overwrite: true`。这是明确策略，但当前日志和文档对操作者不够显性。

整改状态：渲染开始前如果同名文件已存在，会输出覆盖提示。后续仍可扩展 `--no-overwrite`。

### P2-4 缺少通用 `npm test` / `lint`

审查时 `package.json` 有 `test:hud`、`typecheck`、`validate:lessons` 和 `build`，但没有通用 `npm test` 或 `lint`。这不阻断第 6 阶段，但会降低后续 Agent 的默认验证可发现性。

整改状态：已新增 `npm test` 聚合 schema、HUD 状态和 preflight 回归测试。真正的 ESLint lint 配置仍未引入，后续如需要代码风格检查再单独补。

### P2-5 preflight 有轻微写入副作用

`scripts/preflight-render.ts:181` 到 `scripts/preflight-render.ts:188` 会创建输出目录并写入/删除 `.preflight-write-test-*` 以验证目录可写。这是合理的渲染前检查，但对只读审查场景不够友好。

建议：后续增加 `--dry-run` 或 `--skip-output-write-probe`。

### P2-6 `durationMode=fixed` 长于主视频时缺少显式提醒

`scripts/preflight-render.ts:453` 到 `scripts/preflight-render.ts:462` 对 `durationMode=content` 长于主视频给出 warning；但 `durationMode=fixed` 长于真实主视频时目前缺少同等级提示。

整改状态：已新增 `FIXED_DURATION_EXCEEDS_MAIN_VIDEO` warning，并由 `test:preflight` 覆盖。

## 通过项

1. `package.json` 已暴露第 6 阶段核心命令：`preflight:render`、`render:lesson`、`render:smoke`、`test:hud`。
2. `render:lesson` 和 `render:smoke` 都先调用 preflight，未绕过主视频缺失阻断。
3. preflight 覆盖 schema、画布尺寸、fps、输出目录、输出文件名、主视频路径、讲师素材、音频模式、渲染时长和 timeline 基础规则。
4. Remotion composition 使用 `frame / fps` 得到 `currentTime`，并复用 `deriveHudState`，不是静态 HUD。
5. 主视频使用 Remotion `<Video>`，支持 fit mode；讲师层支持视频、头像、身份牌和隐藏 fallback。
6. `main-only`、`speaker-only`、`mix`、`mute-all` 音频路由已经接入 composition。
7. `stage_change`、`targetComponent`、短时事件和持久能力解锁的 runtime 语义已被 `test:hud` 覆盖。
8. `src/remotion` 静态扫描未发现 `<button>`、`<input>`、`<select>`、`controls`、`PreviewCanvas`、`VideoPreviewController`、`EditorShell` 等最终视频禁用元素或编辑器组件。
9. CourseStageBar 当前在 Remotion 中表现为学习导航段块，不是播放器进度条。
10. `render:sample` 可生成开发样片，但报告中明确它不是正式素材链路验收。

## 分项评分

| 模块 | 评分 | 说明 |
| --- | ---: | --- |
| 渲染命令完整度 | 4 / 5 | CLI 链路完整，但不支持任意 JSON 路径和输出覆盖参数。 |
| 渲染前预检 | 4 / 5 | 主视频阻断、输出、时长、timeline 均覆盖；`mix` 缺视频语义需收紧。 |
| 素材路径规则 | 3.5 / 5 | Node preflight 严格，Remotion/browser 解析偏宽。 |
| 主视频渲染层 | 4 / 5 | fit mode 和 fallback 可用；真实素材成功路径未验证。 |
| 讲师层与 fallback | 4 / 5 | 视频/头像/身份牌/隐藏齐全；mix 音频缺视频时需更严格。 |
| 音频策略 | 3.5 / 5 | 四种模式已接入；mix 降级语义不清。 |
| 渲染时长策略 | 4 / 5 | auto/content/fixed 基本成立；fixed 长于主视频需 warning。 |
| HUD 时间轴驱动 | 5 / 5 | `deriveHudState` 共享并有关键时间点测试。 |
| 最终视频无控件边界 | 5 / 5 | 静态扫描通过。 |
| 编辑器兼容 | 3.5 / 5 | 导出 JSON 可校验，但导入和渲染按钮仍未完成。 |
| 验收证据 | 3.5 / 5 | 命令证据充分，缺真实素材成功出片与 still/clip 证据。 |
| 第 7 阶段准备度 | 3.5 / 5 | 可进入前置验收，但不能直接视觉定稿。 |

## 本轮命令结果

| 命令 | 结果 | 说明 |
| --- | --- | --- |
| `npm run typecheck` | 通过，exit 0 | TypeScript 检查通过。 |
| `npm run validate:lessons` | 通过，exit 0 | `lesson-01.json` schema 校验通过。 |
| `npm run test:hud` | 通过，exit 0 | 关键 HUD 状态语义测试通过。 |
| `npm run build` | 通过，exit 0 | Vite production build 通过。 |
| `npm run render:sample` | 通过，exit 0 | 生成 `out/lesson-01-sample.mp4`，大小约 3.27 MB；素材 404 由占位 fallback 承接。 |
| `npm run preflight:render -- lesson-01` | 预期失败，exit 1 | 主视频缺失，阻断字段为 `media.mainVideo.src`。 |
| `npm run render:smoke -- lesson-01` | 预期失败，exit 1 | 先跑 preflight，因主视频缺失未进入渲染。 |
| `npm run render:lesson -- lesson-01` | 预期失败，exit 1 | 先跑 preflight，因主视频缺失未进入正式渲染。 |
| `npm run dev -- --port 5179` | 通过 | `http://127.0.0.1:5179` 返回 200，随后已停止进程。 |
| `npm run studio -- --port 3011` | 通过 | `http://127.0.0.1:3011` 返回 200，随后已停止进程。 |
| `src/remotion` 控件静态扫描 | 通过 | 未发现播放器控件、表单控件、拖拽或编辑器组件引用。 |
| `npm run preflight:render -- lesson-render-fixture` | 通过，exit 0 | 安全小样素材预检通过。 |
| `npm run render:smoke -- lesson-render-fixture` | 通过，exit 0 | 输出 8 秒 smoke MP4。 |
| `npm run render:still -- lesson-render-fixture --times 2,7,10` | 通过，exit 0 | 输出 3 张关键帧 PNG。 |
| `npm run render:clip -- lesson-render-fixture --from 2 --duration 4` | 通过，exit 0 | 输出 4 秒关键片段 MP4。 |
| `npm run render:lesson -- lesson-render-fixture` | 通过，exit 0 | 输出 12 秒正式 MP4。 |
| `ffprobe out/lesson-render-fixture-final.mp4` | 通过 | 1920 x 1080、30fps、12 秒。 |

未运行项：

1. `npm run lint`：当前没有该脚本。
2. 用户真实课程素材 full render 尺寸/fps/音频验收：仍需用户授权素材。

## 输出文件检查

1. `out/lesson-01-sample.mp4` 已生成，大小约 3.27 MB，仅代表开发样片链路可用。
2. `out/lesson-01-smoke.mp4` 未生成，原因是 smoke 渲染被 preflight 主视频缺失阻断。
3. `out/lesson-01-final.mp4` 未生成，原因是正式渲染被 preflight 主视频缺失阻断。
4. `out/lesson-render-fixture-final.mp4` 已生成，尺寸 1920 x 1080，30fps，12 秒，受 `.gitignore` 排除。
5. `out/stills/lesson-render-fixture/*.png` 与 `out/clips/lesson-render-fixture-2s-4s.mp4` 已生成，受 `.gitignore` 排除。

## 风险清单

| 风险 | 等级 | 处理建议 |
| --- | --- | --- |
| `lesson-01` 无真实主视频 | 中 | 用户提供授权素材后跑通同一组命令。 |
| 用户真实素材尚未验收 | 中 | 第 7 阶段替换 `lesson-01` 并做 still/clip/正式 render 验收。 |
| 无 ESLint lint | 低 | 如需要代码风格检查，后续单独引入 ESLint 配置。 |

## 第 7 阶段交接建议

1. 先准备用户授权真实素材，不提交到 Git。
2. 跑通 `npm run preflight:render -- lesson-01` 成功路径。
3. 跑通 `npm run render:smoke -- lesson-01` 并人工确认前 8 秒无明显空白、遮挡和控件。
4. 使用 `npm run render:still -- lesson-01 --times ...` 和 `npm run render:clip -- lesson-01 --from ... --duration ...` 验收关键时间点。
5. 跑通 `npm run render:lesson -- lesson-01`，确认输出为 1920 x 1080 MP4。
6. 再做 HUD 视觉收敛与模板定稿。
7. 收敛共享 HUD 组件时，必须保持 Remotion render mode 无按钮、无输入、无点击跳转、无拖动控件。
