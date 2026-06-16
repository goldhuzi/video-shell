# Video Shell

> A timeline-driven course HUD renderer.  
> Wrap a plain course video with a cinematic, game-like learning interface.

[中文](README.md) · [Getting Started](docs/en/GETTING_STARTED.md) · [Project Overview](docs/en/PROJECT_OVERVIEW.md)

## ✨ What It Is

Video Shell is a local course-video HUD rendering tool for solo course creators, one-person companies, knowledge creators, and small post-production teams.

It is not a video editor, a course platform, or a player. It is a timeline-driven renderer that overlays course structure, learning tasks, key hints, stage navigation, and instructor presence onto a 16:9 course video, then exports a final MP4 without player controls.

## 🚀 Highlights

| Capability | Description |
| --- | --- |
| Timeline-driven HUD | Course stages, task states, map nodes, and hints are driven by the main video time. |
| Cinematic learning shell | The default visual direction is an AI tactical HUD: dark, precise, restrained, and slightly futuristic. |
| Fixed-layout MVP | The first version favors stable output over free-form design tools. |
| Local rendering | React and Remotion power local preview and MP4 export. |
| Config-first architecture | Lesson JSON, Zod validation, timeline state derivation, and Remotion compositions share one model. |

## 🎬 Who It Is For

1. Course creators who want recorded lessons to feel more structured.
2. Knowledge creators who publish long-form educational videos.
3. Solo founders and OPCs who need repeatable course packaging.
4. Small post-production teams producing course assets for clients.

## 🧭 Current Status

The project is in Stage 3: engineering skeleton.

Available now:

1. React + TypeScript + Vite local editor shell.
2. Remotion Studio and `CourseShellComposition`.
3. Example lesson config in `lesson-01.json`.
4. Zod schema validation.
5. Minimal timeline state derivation.
6. Placeholder HUD components.
7. Sample MP4 render script.

Still in progress:

1. Real config editing, saving, import, and export.
2. Media-path checks and pre-render validation.
3. Timeline state tests.
4. Real media verification.
5. Further convergence between editor preview HUD and Remotion HUD.

## 🛠 Tech Stack

| Layer | Technology |
| --- | --- |
| Local editor | React, TypeScript, Vite |
| Video rendering | Remotion |
| Validation | Zod |
| Config source | Local JSON |
| Scripts | Node.js, tsx |

## ⚡ Quick Start

Install dependencies:

```bash
npm install
```

Start the local editor:

```bash
npm run dev
```

Default URL: `http://127.0.0.1:5173`

Start Remotion Studio:

```bash
npm run studio
```

Validate lesson configs:

```bash
npm run validate:lessons
```

Build the editor:

```bash
npm run build
```

Render the sample video:

```bash
npm run render:sample
```

Output path: `out/lesson-01-sample.mp4`

See [docs/en/GETTING_STARTED.md](docs/en/GETTING_STARTED.md) for the full walkthrough.

## 🛡 Media And Safety

Real course videos and client assets should not be committed.

Ignored by default:

1. `node_modules/`
2. `dist/`
3. `out/`
4. `.cache/`
5. `.remotion/`
6. `.obsidian/`
7. `.env` and `.env.*`
8. video files under `public/input/videos/`
9. speaker videos under `public/input/speakers/`

Recommended local media paths:

| Media | Path |
| --- | --- |
| Main course video | `public/input/videos/` |
| Speaker video | `public/input/speakers/` |
| Speaker image | `public/input/images/` |
| Default HUD assets | `public/assets/hud/` |

## 🎛 Product Boundaries

Video Shell is:

1. A timeline-driven course interface renderer.
2. A 16:9 HUD wrapper for course videos.
3. A local visual editor for configuring stages and events.
4. A local MP4 generation tool.

Video Shell is not:

1. A general-purpose video editor.
2. A course hosting platform.
3. A media player.
4. A static overlay template.
5. A free-form design tool.

The final MP4 must not contain play, pause, speed, volume, fullscreen, or draggable progress controls. Editor controls may exist only for preview and timeline configuration.

## 🗺 Documentation

English entry points:

- [Getting Started](docs/en/GETTING_STARTED.md)
- [Project Overview](docs/en/PROJECT_OVERVIEW.md)

Core Chinese specifications:

- [Project Spec](docs/PROJECT_SPEC.md)
- [MVP Scope](docs/MVP_SCOPE.md)
- [Data Model Spec](docs/DATA_MODEL_SPEC.md)
- [Timeline Data Model Spec](docs/TIMELINE_DATA_MODEL_SPEC.md)
- [Render Pipeline Spec](docs/RENDER_PIPELINE_SPEC.md)
- [Media Asset Spec](docs/MEDIA_ASSET_SPEC.md)
- [Agent Memory](AGENTS.MD)

## 🤝 Contributing

Contributions are welcome around the local editor, timeline state derivation, Remotion rendering, HUD visuals, and documentation. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📜 License

MIT License. See [LICENSE](LICENSE).
