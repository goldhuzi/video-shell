import { z } from "zod";

export const timelineEventTypes = [
  "stage_change",
  "map_node_active",
  "map_node_activate",
  "task_active",
  "task_done",
  "task_update",
  "tip_show",
  "warning_show",
  "hint_show",
  "ability_unlock",
  "skill_unlock",
  "summary_show",
  "stage_summary",
  "homework_show",
  "homework_reminder",
] as const;

export const hudComponentKeys = [
  "top_header",
  "main_video_frame",
  "lecturer_mini_card",
  "chapter_map",
  "task_tracker",
  "warning_panel",
  "course_stage_bar",
  "bottom_status_hud",
] as const;

export const mainVideoFitModes = [
  "contain",
  "cover",
  "fit-width",
  "fit-height",
  "fit_width",
  "fit_height",
] as const;

export const renderDurationModes = ["auto", "fixed", "content"] as const;

export const renderCodecs = ["h264", "h265"] as const;

export const audioModes = [
  "main-only",
  "speaker-only",
  "mix",
  "mute-all",
] as const;

const nonEmptyString = z.string().trim().min(1);
const nonNegativeNumber = z.number().nonnegative();
const positiveNumber = z.number().positive();

const mediaAssetSchema = z.object({
  id: nonEmptyString,
  kind: z.enum([
    "main_video",
    "lecturer_video",
    "avatar",
    "hud_static",
    "font",
    "logo",
  ]),
  label: z.string().optional(),
  src: nonEmptyString,
  duration: positiveNumber.optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  mimeType: z.string().optional(),
  required: z.boolean(),
});

const hintSchema = z.object({
  id: nonEmptyString,
  hintType: z.enum(["key_point", "beginner_tip", "warning", "summary", "homework"]),
  title: nonEmptyString,
  body: nonEmptyString,
  stageId: z.string().optional(),
  defaultDuration: positiveNumber.optional(),
});

const timelineEventSchema = z
  .object({
    id: nonEmptyString,
    type: z.enum(timelineEventTypes),
    startTime: nonNegativeNumber,
    endTime: nonNegativeNumber.optional(),
    duration: positiveNumber.optional(),
    targetComponent: z.enum(hudComponentKeys),
    payload: z.record(z.string(), z.unknown()),
    animation: z
      .object({
        enter: z.enum(["none", "fade", "fade_up", "pulse", "node_glow"]).optional(),
        exit: z.enum(["none", "fade", "fade_down"]).optional(),
        durationMs: z.number().int().positive().optional(),
        reducedMotionFallback: z.enum(["none", "fade"]).optional(),
      })
      .optional(),
    priority: z.number().int(),
    enabled: z.boolean(),
    label: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((event, ctx) => {
    const displayEventTypes = new Set([
      "tip_show",
      "warning_show",
      "hint_show",
      "summary_show",
      "stage_summary",
      "homework_show",
      "homework_reminder",
    ]);
    const typeTargetMap: Partial<Record<TimelineEventType, HudComponentKey[]>> = {
      stage_change: ["course_stage_bar"],
      map_node_active: ["chapter_map"],
      map_node_activate: ["chapter_map"],
      task_active: ["task_tracker"],
      task_done: ["task_tracker"],
      task_update: ["task_tracker"],
      tip_show: ["warning_panel"],
      warning_show: ["warning_panel"],
      hint_show: ["warning_panel"],
      ability_unlock: ["bottom_status_hud", "warning_panel"],
      skill_unlock: ["bottom_status_hud", "warning_panel"],
      summary_show: ["warning_panel", "bottom_status_hud"],
      stage_summary: ["warning_panel", "bottom_status_hud"],
      homework_show: ["warning_panel", "bottom_status_hud", "task_tracker"],
      homework_reminder: ["warning_panel", "bottom_status_hud", "task_tracker"],
    };

    if (event.endTime !== undefined && event.startTime >= event.endTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "事件结束时间必须大于开始时间",
      });
    }

    if (displayEventTypes.has(event.type) && event.endTime === undefined && event.duration === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "显示型事件必须设置结束时间或持续时间",
      });
    }

    const allowedTargets = typeTargetMap[event.type];
    if (allowedTargets && !allowedTargets.includes(event.targetComponent)) {
      ctx.addIssue({
        code: "custom",
        path: ["targetComponent"],
        message: "事件类型与目标 HUD 模块不匹配",
      });
    }

    const payload = event.payload;
    const requireString = (key: string, message: string) => {
      if (typeof payload[key] !== "string" || !payload[key].trim()) {
        ctx.addIssue({ code: "custom", path: ["payload", key], message });
      }
    };

    if (event.type === "stage_change") {
      requireString("stageId", "阶段切换事件必须关联 stageId");
    }

    if (event.type === "map_node_active" || event.type === "map_node_activate") {
      if (
        (typeof payload.nodeId !== "string" || !payload.nodeId.trim()) &&
        (typeof payload.mapNodeId !== "string" || !payload.mapNodeId.trim())
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["payload", "nodeId"],
          message: "地图事件必须关联 nodeId 或 mapNodeId",
        });
      }
    }

    if (event.type === "task_active" || event.type === "task_done" || event.type === "task_update") {
      requireString("taskId", "任务事件必须关联 taskId");
    }

    if (
      event.type === "tip_show" ||
      event.type === "warning_show" ||
      event.type === "hint_show" ||
      event.type === "summary_show" ||
      event.type === "stage_summary" ||
      event.type === "homework_show" ||
      event.type === "homework_reminder"
    ) {
      requireString("title", "提示/总结/作业事件必须填写 title");
      if (
        (typeof payload.text !== "string" || !payload.text.trim()) &&
        (typeof payload.body !== "string" || !payload.body.trim()) &&
        !Array.isArray(payload.bullets)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["payload", "text"],
          message: "提示/总结/作业事件必须填写 text、body 或 bullets",
        });
      }
    }

    if (event.type === "ability_unlock" || event.type === "skill_unlock") {
      if (
        (typeof payload.abilityId !== "string" || !payload.abilityId.trim()) &&
        (typeof payload.skillId !== "string" || !payload.skillId.trim()) &&
        (typeof payload.label !== "string" || !payload.label.trim()) &&
        (typeof payload.title !== "string" || !payload.title.trim())
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["payload", "abilityId"],
          message: "能力解锁事件必须包含 abilityId、skillId、label 或 title",
        });
      }
    }
  });

export const lessonProjectSchema = z
  .object({
    schemaVersion: nonEmptyString,
    meta: z.object({
      projectId: nonEmptyString,
      projectName: nonEmptyString,
      courseTitle: nonEmptyString,
      lessonTitle: nonEmptyString,
      chapterTitle: z.string().optional(),
      lessonNumber: z.string().optional(),
      lessonIndex: z.number().int().positive(),
      totalLessons: z.number().int().positive(),
      courseCode: z.string().optional(),
      statusLabel: z.string().optional(),
      mainMission: z.string().optional(),
      description: z.string().optional(),
      canvas: z.object({
        width: z.literal(1920),
        height: z.literal(1080),
        fps: positiveNumber,
      }),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    }),
    media: z.object({
      mainVideo: mediaAssetSchema.extend({
        kind: z.literal("main_video"),
        src: nonEmptyString,
      }),
      lecturerVideo: mediaAssetSchema
        .extend({
          kind: z.literal("lecturer_video"),
        })
        .optional(),
      lecturerAvatar: mediaAssetSchema
        .extend({
          kind: z.literal("avatar"),
        })
        .optional(),
      speakerVideo: mediaAssetSchema
        .extend({
          kind: z.literal("lecturer_video"),
        })
        .optional(),
      speakerImage: mediaAssetSchema
        .extend({
          kind: z.literal("avatar"),
        })
        .optional(),
      useSpeakerVideo: z.boolean(),
      mainVideoFitMode: z.enum(mainVideoFitModes),
      hudAssets: z.array(mediaAssetSchema).default([]),
    }),
    audio: z
      .object({
        mode: z.enum(audioModes).default("main-only"),
      })
      .optional(),
    speaker: z.object({
      name: z.string().optional(),
      title: z.string().optional(),
      bio: z.string().optional(),
      role: z.string().optional(),
      stats: z
        .array(
          z.object({
            label: nonEmptyString,
            value: nonEmptyString,
          }),
        )
        .optional(),
      displayMode: z.enum(["video", "avatar", "compact", "hidden"]),
      positionPreset: z.enum(["bottom-left", "bottom-right", "in-bottom-hud", "hidden"]),
      assetPriority: z
        .array(z.enum(["video", "avatar", "identity_card", "hidden"]))
        .optional(),
      missingAssetBehavior: z
        .enum(["block_render", "fallback_to_avatar", "fallback_to_identity_card", "hide"])
        .optional(),
    }),
    layout: z.object({
      aspectRatio: z.literal("16:9"),
      showTopHeader: z.boolean().optional(),
      showRightPanel: z.boolean().optional(),
      showBottomHud: z.boolean().optional(),
      showLecturerCard: z.boolean().optional(),
      showCourseStageBar: z.boolean().optional(),
      canvas: z.object({
        width: z.literal(1920),
        height: z.literal(1080),
      }),
      mainVideoFitMode: z.enum(mainVideoFitModes),
      mainVideoSafeArea: z
        .object({
          showGuideInEditor: z.boolean(),
          protectedRegions: z
            .array(z.enum(["top", "right", "bottom", "left", "center"]))
            .optional(),
          notes: z.string().optional(),
        })
        .optional(),
      topHeader: z.object({
        visible: z.boolean(),
        showCurrentStage: z.boolean(),
      }),
      rightSidebar: z.object({
        visible: z.boolean(),
        displayMode: z.enum(["full", "map_only", "tasks_only", "hints_only", "hidden"]),
      }),
      stageBar: z.object({
        visible: z.boolean(),
        displayMode: z.enum(["standard", "compact", "hidden"]),
      }),
      lecturer: z.object({
        visible: z.boolean(),
        positionPreset: z.enum(["bottom-left", "bottom-right", "in-bottom-hud", "hidden"]),
      }),
      bottomStatusHud: z.object({
        visible: z.boolean(),
      }),
    }),
    warning: z.object({
      defaultHintId: z.string().optional(),
      items: z.array(hintSchema),
    }),
    tasks: z.array(
      z.object({
        id: nonEmptyString,
        label: nonEmptyString,
        title: nonEmptyString,
        description: z.string().optional(),
        stageId: z.string().optional(),
        order: z.number().int().nonnegative(),
        defaultStatus: z.enum(["not_started", "current", "completed"]).optional(),
        autoCompletePrevious: z.boolean().optional(),
      }),
    ),
    chapterMap: z.object({
      displayMode: z.literal("vertical_route"),
      nodes: z.array(
        z.object({
          id: nonEmptyString,
          label: nonEmptyString,
          stageId: z.string().optional(),
          skillId: z.string().optional(),
          unlockTime: nonNegativeNumber.optional(),
          order: z.number().int().nonnegative(),
          defaultStatus: z
            .enum(["locked", "not_started", "current", "completed", "unlocked"])
            .optional(),
        }),
      ),
    }),
    stages: z.array(
      z.object({
        id: nonEmptyString,
        label: nonEmptyString,
        name: nonEmptyString,
        shortName: z.string().optional(),
        startTime: nonNegativeNumber,
        endTime: nonNegativeNumber.optional(),
        mapNodeId: z.string().optional(),
        defaultTaskId: z.string().optional(),
        defaultHintId: z.string().optional(),
        order: z.number().int().nonnegative(),
        enabled: z.boolean(),
      }),
    ),
    timelineEvents: z.array(timelineEventSchema),
    render: z.object({
      width: z.literal(1920),
      height: z.literal(1080),
      fps: positiveNumber,
      format: z.literal("mp4"),
      outputName: nonEmptyString,
      outputDir: nonEmptyString,
      durationMode: z.enum(renderDurationModes).optional(),
      durationSeconds: positiveNumber.optional(),
      codec: z.enum(renderCodecs).optional(),
      videoCodec: z.enum(renderCodecs).optional(),
      audioEnabled: z.boolean().optional(),
      quality: z.enum(["preview", "standard", "high"]).optional(),
    }),
  })
  .superRefine((lesson, ctx) => {
    if (lesson.meta.totalLessons < lesson.meta.lessonIndex) {
      ctx.addIssue({
        code: "custom",
        path: ["meta", "totalLessons"],
        message: "totalLessons 必须大于或等于 lessonIndex",
      });
    }

    lesson.stages.forEach((stage, index) => {
      if (stage.endTime !== undefined && stage.startTime >= stage.endTime) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "endTime"],
          message: "阶段结束时间必须大于开始时间",
        });
      }

      const previousStage = lesson.stages[index - 1];
      if (previousStage && stage.startTime <= previousStage.startTime) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "startTime"],
          message: "阶段开始时间必须按顺序递增",
        });
      }

      if (
        previousStage?.endTime !== undefined &&
        stage.startTime < previousStage.endTime
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "startTime"],
          message: "阶段时间不应与上一阶段重叠",
        });
      }
    });

    const stageIds = new Set<string>();
    lesson.stages.forEach((stage, index) => {
      if (stageIds.has(stage.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "id"],
          message: "stage.id 必须唯一",
        });
      }
      stageIds.add(stage.id);
    });

    const eventIds = new Set<string>();
    const taskIds = new Set(lesson.tasks.map((task) => task.id));
    const mapNodeIds = new Set(lesson.chapterMap.nodes.map((node) => node.id));
    const hintIds = new Set(lesson.warning.items.map((hint) => hint.id));
    const lastStageEnd = Math.max(...lesson.stages.map((stage) => stage.endTime ?? stage.startTime), 0);
    const durationLimit = Math.max(
      lesson.media.mainVideo.duration ?? 0,
      lesson.render.durationSeconds ?? 0,
      lastStageEnd,
    );

    if (lesson.render.durationMode === "fixed" && lesson.render.durationSeconds === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["render", "durationSeconds"],
        message: "durationMode 为 fixed 时必须填写 durationSeconds",
      });
    }

    if (lesson.render.codec && lesson.render.videoCodec && lesson.render.codec !== lesson.render.videoCodec) {
      ctx.addIssue({
        code: "custom",
        path: ["render", "codec"],
        message: "render.codec 与兼容字段 render.videoCodec 不应冲突",
      });
    }

    if (lesson.warning.defaultHintId && !hintIds.has(lesson.warning.defaultHintId)) {
      ctx.addIssue({
        code: "custom",
        path: ["warning", "defaultHintId"],
        message: "warning.defaultHintId 引用了不存在的提示",
      });
    }

    lesson.warning.items.forEach((hint, index) => {
      if (hint.stageId && !stageIds.has(hint.stageId)) {
        ctx.addIssue({
          code: "custom",
          path: ["warning", "items", index, "stageId"],
          message: "提示引用了不存在的 stageId",
        });
      }
    });

    lesson.tasks.forEach((task, index) => {
      if (task.stageId && !stageIds.has(task.stageId)) {
        ctx.addIssue({
          code: "custom",
          path: ["tasks", index, "stageId"],
          message: "任务引用了不存在的 stageId",
        });
      }
    });

    lesson.chapterMap.nodes.forEach((node, index) => {
      if (node.stageId && !stageIds.has(node.stageId)) {
        ctx.addIssue({
          code: "custom",
          path: ["chapterMap", "nodes", index, "stageId"],
          message: "地图节点引用了不存在的 stageId",
        });
      }
    });

    lesson.stages.forEach((stage, index) => {
      if (stage.mapNodeId && !mapNodeIds.has(stage.mapNodeId)) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "mapNodeId"],
          message: "阶段默认地图节点不存在",
        });
      }

      if (stage.defaultTaskId && !taskIds.has(stage.defaultTaskId)) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "defaultTaskId"],
          message: "阶段默认任务不存在",
        });
      }

      if (stage.defaultHintId && !hintIds.has(stage.defaultHintId)) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "defaultHintId"],
          message: "阶段默认提示不存在",
        });
      }
    });

    lesson.timelineEvents.forEach((event, index) => {
      const payload = event.payload;
      if (eventIds.has(event.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["timelineEvents", index, "id"],
          message: "timelineEvent.id 必须唯一",
        });
      }
      eventIds.add(event.id);

      const eventEndTime =
        event.endTime ?? (event.duration !== undefined ? event.startTime + event.duration : event.startTime);

      if (eventEndTime > durationLimit) {
        ctx.addIssue({
          code: "custom",
          path: ["timelineEvents", index, event.endTime !== undefined ? "endTime" : "startTime"],
          message: "事件结束时间不应超过视频、渲染配置或最后阶段时长",
        });
      }

      const stageId = typeof payload.stageId === "string" ? payload.stageId : undefined;
      if (stageId && !stageIds.has(stageId)) {
        ctx.addIssue({
          code: "custom",
          path: ["timelineEvents", index, "payload", "stageId"],
          message: "事件引用了不存在的 stageId",
        });
      }

      const taskId = typeof payload.taskId === "string" ? payload.taskId : undefined;
      if (taskId && !taskIds.has(taskId)) {
        ctx.addIssue({
          code: "custom",
          path: ["timelineEvents", index, "payload", "taskId"],
          message: "事件引用了不存在的 taskId",
        });
      }

      const nodeId =
        typeof payload.nodeId === "string"
          ? payload.nodeId
          : typeof payload.mapNodeId === "string"
            ? payload.mapNodeId
            : undefined;
      if (nodeId && !mapNodeIds.has(nodeId)) {
        ctx.addIssue({
          code: "custom",
          path: ["timelineEvents", index, "payload", "nodeId"],
          message: "事件引用了不存在的地图节点",
        });
      }

      const hintId = typeof payload.hintId === "string" ? payload.hintId : undefined;
      if (hintId && !hintIds.has(hintId)) {
        ctx.addIssue({
          code: "custom",
          path: ["timelineEvents", index, "payload", "hintId"],
          message: "事件引用了不存在的提示",
        });
      }
    });
  });

export type TimelineEventType = (typeof timelineEventTypes)[number];
export type HudComponentKey = (typeof hudComponentKeys)[number];
export type LessonProjectConfig = z.infer<typeof lessonProjectSchema>;
export type CourseStage = LessonProjectConfig["stages"][number];
export type TimelineEvent = LessonProjectConfig["timelineEvents"][number];
export type TaskItem = LessonProjectConfig["tasks"][number];
export type ChapterMapNode = LessonProjectConfig["chapterMap"]["nodes"][number];
export type WarningItem = LessonProjectConfig["warning"]["items"][number];
