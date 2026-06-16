# Project Overview

Video Shell is a local course-video HUD renderer. It turns a standard 16:9 course video into a more structured, cinematic learning artifact by adding a timeline-driven interface layer.

## Product Definition

Video Shell is:

1. A timeline-driven course interface renderer.
2. A 16:9 HUD wrapper for course videos.
3. A local visual editor for configuring course stages and timeline events.
4. A local MP4 generation tool powered by Remotion.

Video Shell is not:

1. A general-purpose video editor.
2. A course hosting or selling platform.
3. A video player.
4. A static overlay template.
5. A Figma-like free-form design tool.

## Target Users

| User | Need |
| --- | --- |
| Solo course creators | Package screen-recorded lessons with clearer structure. |
| Knowledge creators | Add learning tasks, chapter signals, and key hints to long-form videos. |
| One-person companies | Reuse a consistent course shell without building a full production pipeline. |
| Small post-production teams | Deliver polished course HUD packaging for clients. |

## MVP Boundary

The first version should support:

1. Importing or referencing a main course video.
2. Configuring course metadata.
3. Configuring a fixed HUD layout.
4. Manually setting course stages and timeline events.
5. Previewing HUD state changes against the main video time.
6. Rendering a 16:9 MP4 without player controls.

The first version should not include:

1. Multi-track editing, complex transitions, or audio mixing.
2. Accounts, payments, student management, or assignment submission.
3. Interactive controls inside the final video.
4. Free-form layout dragging.
5. AI-generated chapters, tasks, or highlights.

## Core HUD Modules

| Module | Purpose |
| --- | --- |
| `MainVideoFrame` | Main course content area. |
| `TopHeader` | Course title, lesson metadata, and high-level status. |
| `LecturerMiniCard` | Speaker video or profile image. |
| `ChapterMap` | Structural map of the lesson. |
| `TaskTracker` | Learning tasks and progress state. |
| `WarningPanel` | Key hints, reminders, and emphasis blocks. |
| `CourseStageBar` | Stage-based learning navigation. |
| `BottomStatusHud` | Secondary course status and unlocked signals. |

## Architecture Snapshot

| Area | Current choice |
| --- | --- |
| Editor | React + TypeScript + Vite |
| Rendering | Remotion |
| Validation | Zod |
| Config | Local JSON |
| State derivation | Shared timeline utility |

## Design Direction

The default visual direction is an AI tactical course HUD:

1. Dark technical base.
2. Blue-purple energy highlights.
3. Metallic thin borders.
4. Restrained motion.
5. High information clarity.

The HUD must support learning comprehension. It should never fight the main course video for attention.

## Documentation Source Of Truth

The Chinese docs remain the canonical source for detailed product memory and specifications. The English docs are entry points for GitHub visitors and international collaborators.

Start with:

1. `README.en.md`
2. `docs/en/GETTING_STARTED.md`
3. `docs/PROJECT_SPEC.md`
4. `docs/MVP_SCOPE.md`
5. `docs/DATA_MODEL_SPEC.md`
6. `docs/RENDER_PIPELINE_SPEC.md`
