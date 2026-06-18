import { z } from "zod";

const nonEmptyString = z.string().trim().min(1);

export const manifestLessonStatuses = [
  "draft",
  "needs-review",
  "ready",
  "blocked",
  "rendered",
  "archived",
] as const;

export const manifestQaStatuses = [
  "not-started",
  "preflighted",
  "rendered",
  "reviewed",
  "blocked",
] as const;

export const courseManifestSchema = z
  .object({
    schemaVersion: nonEmptyString,
    project: z.object({
      id: nonEmptyString,
      name: nonEmptyString,
      courseTitle: nonEmptyString,
      description: z.string().optional(),
      owner: z.string().optional(),
      defaultOutputDir: nonEmptyString.default("out/renders"),
      reportDir: nonEmptyString.default("out/reports"),
      notes: z.string().optional(),
    }),
    production: z
      .object({
        renderMode: z.literal("sequential").default("sequential"),
        stopOnError: z.boolean().default(false),
        requirePreflightBeforeRender: z.boolean().default(true),
        maxParallelRenders: z.literal(1).default(1),
      })
      .default({
        renderMode: "sequential",
        stopOnError: false,
        requirePreflightBeforeRender: true,
        maxParallelRenders: 1,
      }),
    lessons: z.array(
      z.object({
        lessonId: nonEmptyString.regex(/^[A-Za-z0-9._-]+$/),
        order: z.number().int().nonnegative(),
        title: nonEmptyString,
        status: z.enum(manifestLessonStatuses),
        enabled: z.boolean().default(true),
        batchRender: z.boolean().default(true),
        qaStatus: z.enum(manifestQaStatuses).default("not-started"),
        sourceLessonId: z.string().optional(),
        outputName: z.string().optional(),
        tags: z.array(z.string()).default([]),
        notes: z.string().optional(),
      }),
    ),
    updatedAt: z.string().optional(),
  })
  .superRefine((manifest, ctx) => {
    const lessonIds = new Set<string>();
    const orders = new Set<number>();

    manifest.lessons.forEach((lesson, index) => {
      if (lessonIds.has(lesson.lessonId)) {
        ctx.addIssue({
          code: "custom",
          path: ["lessons", index, "lessonId"],
          message: "manifest lessonId 必须唯一",
        });
      }
      lessonIds.add(lesson.lessonId);

      if (orders.has(lesson.order)) {
        ctx.addIssue({
          code: "custom",
          path: ["lessons", index, "order"],
          message: "manifest lesson order 必须唯一",
        });
      }
      orders.add(lesson.order);
    });
  });

export type CourseManifest = z.infer<typeof courseManifestSchema>;
export type CourseManifestLesson = CourseManifest["lessons"][number];
export type ManifestLessonStatus = (typeof manifestLessonStatuses)[number];
export type ManifestQaStatus = (typeof manifestQaStatuses)[number];
