import { z } from "zod";

export const timelineEventTypes = [
  "stage_change",
  "map_node_activate",
  "task_update",
  "hint_show",
  "skill_unlock",
  "stage_summary",
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
    if (event.endTime !== undefined && event.startTime > event.endTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "timelineEvents endTime must be greater than or equal to startTime",
      });
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
      mainVideoFitMode: z.enum(["contain", "cover", "fit-width", "fit-height", "fit_width", "fit_height"]),
      hudAssets: z.array(mediaAssetSchema).default([]),
    }),
    speaker: z.object({
      name: z.string().optional(),
      title: z.string().optional(),
      bio: z.string().optional(),
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
      mainVideoFitMode: z.enum(["contain", "cover", "fit_width", "fit_height"]),
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
        label: z.string().optional(),
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
        label: z.string().optional(),
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
      videoCodec: z.enum(["h264", "h265"]).optional(),
      audioEnabled: z.boolean(),
      quality: z.enum(["preview", "standard", "high"]).optional(),
    }),
  })
  .superRefine((lesson, ctx) => {
    if (lesson.meta.totalLessons < lesson.meta.lessonIndex) {
      ctx.addIssue({
        code: "custom",
        path: ["meta", "totalLessons"],
        message: "totalLessons must be greater than or equal to lessonIndex",
      });
    }

    lesson.stages.forEach((stage, index) => {
      if (stage.endTime !== undefined && stage.startTime > stage.endTime) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "endTime"],
          message: "stage endTime must be greater than or equal to startTime",
        });
      }

      const previousStage = lesson.stages[index - 1];
      if (previousStage && stage.startTime <= previousStage.startTime) {
        ctx.addIssue({
          code: "custom",
          path: ["stages", index, "startTime"],
          message: "stages startTime must be strictly increasing",
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
