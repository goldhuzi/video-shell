# Getting Started

This guide helps you run the local editor, validate lesson configs, open Remotion Studio, and render the sample MP4.

## 1. Requirements

1. Node.js 18 or newer.
2. npm.
3. Windows, macOS, or Linux. The current skeleton has mainly been verified on Windows.

## 2. Install Dependencies

```bash
npm install
```

## 3. Start The Local Editor

```bash
npm run dev
```

Default URL:

```text
http://127.0.0.1:5173
```

The editor is currently an engineering skeleton. It shows the 16:9 final-video preview, placeholder HUD components, course information, and timeline configuration areas. Real editing and saving flows are planned for the next stage.

## 4. Validate Lesson Configs

```bash
npm run validate:lessons
```

Example lesson config:

```text
src/data/lessons/lesson-01.json
```

Schema entry:

```text
src/schemas/lesson.schema.ts
```

## 5. Start Remotion Studio

```bash
npm run studio
```

Remotion entry:

```text
src/remotion/Root.tsx
```

Composition name:

```text
CourseShellComposition
```

Remotion Studio includes development controls, but those controls are not part of the final MP4. The exported video must not include play, pause, speed, volume, fullscreen, or draggable progress controls.

## 6. Render The Sample Video

```bash
npm run render:sample
```

Output path:

```text
out/lesson-01-sample.mp4
```

The `out/` directory is ignored by Git.

If media files are missing, the renderer may log asset 404 messages. In the current skeleton, this is expected fallback behavior as long as the script completes and writes the MP4.

## 7. Media Folders

| Media | Recommended path | Commit policy |
| --- | --- | --- |
| Main course video | `public/input/videos/` | Do not commit real videos |
| Speaker video | `public/input/speakers/` | Do not commit real videos |
| Speaker image | `public/input/images/` | Commit only safe demo assets |
| Default HUD assets | `public/assets/hud/` | Can be committed if they are app defaults |

## 8. Common Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local editor |
| `npm run studio` | Start Remotion Studio |
| `npm run validate:lessons` | Validate lesson JSON |
| `npm run typecheck` | Run TypeScript checks |
| `npm run build` | Build the editor |
| `npm run render:sample` | Render the sample MP4 |

## 9. Recommended Reading

1. `README.en.md`: English project entry.
2. `docs/en/PROJECT_OVERVIEW.md`: English project overview.
3. `docs/PROJECT_SPEC.md`: Core Chinese product spec.
4. `docs/MVP_SCOPE.md`: MVP scope.
5. `docs/DATA_MODEL_SPEC.md`: lesson data model.
6. `docs/RENDER_PIPELINE_SPEC.md`: render pipeline.
