import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lessonProjectSchema, type LessonProjectConfig } from "../src/schemas/lesson.schema";
import { deriveHudState } from "../src/utils/timeline";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonPath = path.join(rootDir, "src", "data", "lessons", "lesson-01.json");

const cloneLesson = (lesson: LessonProjectConfig): LessonProjectConfig =>
  JSON.parse(JSON.stringify(lesson)) as LessonProjectConfig;

const loadLesson = async () => {
  const raw = JSON.parse(await readFile(lessonPath, "utf8")) as unknown;
  return lessonProjectSchema.parse(raw);
};

const getActiveEventIds = (state: ReturnType<typeof deriveHudState>) =>
  state.activeEvents.map((event) => event.id);

const getPersistentEventIds = (state: ReturnType<typeof deriveHudState>) =>
  state.persistentStateEvents.map((event) => event.id);

const main = async () => {
  const lesson = await loadLesson();
  const stateAt = (currentTime: number, targetLesson = lesson) =>
    deriveHudState(targetLesson, currentTime);

  const at117 = stateAt(117);
  assert.equal(at117.currentStageId, "stage-orient", "117 秒应仍处于开场阶段");
  assert.equal(at117.taskStatuses["task-collect"], "current", "117 秒默认任务应为收集原始资料");
  assert.equal(at117.chapterMapStatuses["node-orient"], "current", "117 秒地图应停留在 Orient 节点");
  assert.equal(at117.activeWarning?.id, "hint-orient-default", "117 秒应显示开场阶段默认提示");
  assert.deepEqual(getActiveEventIds(at117), [], "117 秒 activeEvents 不应残留历史事件");

  const at118 = stateAt(118);
  assert.equal(at118.currentStageId, "stage-filter", "118 秒 stage_change 应进入过滤阶段");
  assert.equal(at118.stageStatuses["stage-orient"], "completed", "118 秒开场阶段应完成");
  assert.equal(at118.stageStatuses["stage-filter"], "current", "118 秒过滤阶段应为当前阶段");
  assert.equal(at118.taskStatuses["task-filter"], "current", "118 秒 stage_change.syncDefaultTask 应同步默认任务");
  assert.equal(at118.chapterMapStatuses["node-filter"], "current", "118 秒 stage_change/map 事件应同步当前地图节点");
  assert.deepEqual(
    getActiveEventIds(at118),
    ["event-stage-filter", "event-map-filter"],
    "118 秒 activeEvents 只应包含当前触发的阶段和地图事件",
  );

  const at124 = stateAt(124);
  assert.equal(at124.currentStageId, "stage-filter", "124 秒应保持过滤阶段");
  assert.equal(at124.taskStatuses["task-filter"], "current", "124 秒任务事件应保持过滤任务为当前任务");
  assert.deepEqual(getActiveEventIds(at124), ["event-task-filter"], "124 秒 activeEvents 只应包含当前任务事件");
  assert.ok(
    getPersistentEventIds(at124).includes("event-stage-filter"),
    "124 秒 persistentStateEvents 应保留已生效的阶段事件",
  );

  const at150 = stateAt(150);
  assert.equal(at150.activeWarning?.sourceEventId, "event-warning-filter", "150 秒应显示警告事件");
  assert.equal(at150.activeBottomStatus?.sourceEventId, "event-warning-filter", "150 秒 syncBottomStatus 应同步到底部状态");
  assert.deepEqual(getActiveEventIds(at150), ["event-warning-filter"], "150 秒 activeEvents 不应混入历史持久事件");

  const at248 = stateAt(248);
  assert.equal(at248.currentStageId, "stage-package", "248 秒应进入包装阶段");
  assert.equal(at248.stageStatuses["stage-filter"], "completed", "248 秒过滤阶段应完成");
  assert.equal(at248.stageStatuses["stage-package"], "current", "248 秒包装阶段应为当前阶段");
  assert.equal(at248.taskStatuses["task-filter"], "completed", "248 秒过滤任务应保持完成");
  assert.equal(at248.taskStatuses["task-package"], "current", "248 秒包装任务应成为当前任务");
  assert.equal(at248.chapterMapStatuses["node-package"], "current", "248 秒地图应进入包装节点");

  const at270 = stateAt(270);
  assert.deepEqual(at270.activeSkillIds, ["skill-source-packet"], "270 秒应解锁 Source packet 能力");
  assert.equal(at270.activeBottomStatus?.sourceEventId, "event-skill-packet", "270 秒能力解锁应进入 BottomStatusHud");
  assert.equal(at270.chapterMapStatuses["node-package"], "current", "270 秒能力同步地图时不应覆盖当前阶段节点");
  assert.equal(at270.activeWarning?.id, "hint-package-summary", "270 秒 WarningPanel 应恢复包装阶段默认提示");

  const at316 = stateAt(316);
  assert.equal(at316.activeSummary?.sourceEventId, "event-summary-package", "316 秒应进入 activeSummary");
  assert.equal(at316.activeWarning?.sourceEventId, "event-summary-package", "316 秒 summary_show 应进入 WarningPanel");
  assert.equal(at316.activeBottomStatus?.sourceEventId, "event-summary-package", "316 秒 summary_show.syncBottomStatus 应同步到底部状态");

  const at340 = stateAt(340);
  assert.equal(at340.activeHomework?.sourceEventId, "event-homework", "340 秒应进入 activeHomework");
  assert.equal(at340.activeWarning?.sourceEventId, "event-homework", "340 秒 homework_show 应进入 WarningPanel");
  assert.equal(at340.activeBottomStatus?.sourceEventId, "event-homework", "340 秒 homework_show.syncBottomStatus 应同步到底部状态");
  assert.equal(at340.taskStatuses["task-package"], "current", "340 秒 homework_show.syncTaskTracker 应保持作业任务为当前任务");

  const at355 = stateAt(355);
  assert.equal(at355.activeHomework, undefined, "355 秒作业事件结束后 activeHomework 应消失");
  assert.equal(at355.activeBottomStatus, undefined, "355 秒短时底部状态应恢复为空");
  assert.equal(at355.activeWarning?.id, "hint-package-summary", "355 秒 WarningPanel 应恢复当前阶段默认提示");
  assert.deepEqual(getActiveEventIds(at355), [], "355 秒 activeEvents 不应包含已结束的作业事件");
  assert.deepEqual(at355.activeSkillIds, ["skill-source-packet"], "355 秒能力解锁状态应持续保留");

  const stageOverrideLesson = cloneLesson(lesson);
  const orientStage = stageOverrideLesson.stages.find((stage) => stage.id === "stage-orient");
  const filterStage = stageOverrideLesson.stages.find((stage) => stage.id === "stage-filter");
  assert.ok(orientStage && filterStage, "回归样例应包含开场和过滤阶段");
  orientStage.endTime = 130;
  filterStage.startTime = 130;
  stageOverrideLesson.timelineEvents = stageOverrideLesson.timelineEvents.filter(
    (event) => event.id !== "event-map-filter",
  );
  const stageOverrideAt119 = stateAt(119, stageOverrideLesson);
  assert.equal(stageOverrideAt119.currentStageId, "stage-filter", "stage_change 应能覆盖自然阶段时间段");
  assert.equal(stageOverrideAt119.taskStatuses["task-filter"], "current", "stage_change.syncDefaultTask=true 应同步默认任务");
  assert.equal(stageOverrideAt119.chapterMapStatuses["node-filter"], "current", "stage_change.syncMapNode=true 应同步地图节点");

  const bottomOnlySummaryLesson = cloneLesson(lesson);
  const summaryEvent = bottomOnlySummaryLesson.timelineEvents.find(
    (event) => event.id === "event-summary-package",
  );
  assert.ok(summaryEvent, "回归样例应包含总结事件");
  summaryEvent.targetComponent = "bottom_status_hud";
  summaryEvent.payload.syncBottomStatus = false;
  const bottomOnlySummaryAt316 = stateAt(316, bottomOnlySummaryLesson);
  assert.equal(bottomOnlySummaryAt316.activeSummary?.sourceEventId, "event-summary-package", "bottom-only 总结仍应进入 activeSummary");
  assert.equal(bottomOnlySummaryAt316.activeBottomStatus?.sourceEventId, "event-summary-package", "targetComponent=bottom_status_hud 的总结应进入 BottomStatusHud");
  assert.equal(bottomOnlySummaryAt316.activeWarning?.id, "hint-package-summary", "targetComponent=bottom_status_hud 的总结不应覆盖 WarningPanel");

  console.log("HUD 状态测试通过：lesson-01 关键时间点与第 6 阶段状态语义均符合预期。");
};

void main().catch((error) => {
  console.error(`HUD 状态测试失败：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
