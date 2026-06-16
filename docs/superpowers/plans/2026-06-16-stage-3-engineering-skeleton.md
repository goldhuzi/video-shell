# Stage 3 Engineering Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the runnable React + TypeScript + Vite + Remotion skeleton for the local course HUD renderer.

**Architecture:** The editor, Remotion renderer, shared HUD components, lesson schema, lesson data, and timeline utilities are separated into clear folders. The editor may render preview controls outside the 16:9 canvas, while the Remotion composition renders only final video layers and HUD visuals.

**Tech Stack:** React, TypeScript, Vite, Remotion, Zod, local JSON, Node scripts.

---

### Task 1: Base Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `remotion.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `public/input/videos/.gitkeep`
- Create: `public/input/speakers/.gitkeep`
- Create: `public/input/images/.gitkeep`
- Create: `public/assets/hud/.gitkeep`

- [x] **Step 1: Create scripts and dependencies**

Define `dev`, `studio`, `render:sample`, `validate:lessons`, and `typecheck`.

- [x] **Step 2: Create Vite and Remotion config**

Use Vite for the local editor and Remotion for `CourseShellComposition`.

- [x] **Step 3: Create ignored output and media rules**

Ignore `node_modules`, `dist`, `out`, and local video inputs.

### Task 2: Data Model Slice

**Files:**
- Create: `src/schemas/lesson.schema.ts`
- Create: `src/data/lessons/lesson-01.json`
- Create: `src/utils/loadLesson.ts`
- Create: `src/utils/timeline.ts`

- [ ] **Step 1: Create the lesson JSON shape**

Include `meta`, `media`, `speaker`, `layout`, `warning`, `tasks`, `chapterMap`, `stages`, `timelineEvents`, and `render`.

- [ ] **Step 2: Create Zod schema and TypeScript types**

Validate canvas size, FPS, lesson indices, event timing, event type, stage ordering, and required paths.

- [ ] **Step 3: Create timeline runtime state helpers**

Implement `getCurrentStage`, `getStageStatus`, `getActiveEvents`, and `deriveHudState`.

### Task 3: Frontend Editor Slice

**Files:**
- Create: `src/main.tsx`
- Create: `src/editor/App.tsx`
- Create: `src/editor/EditorShell.tsx`
- Create: `src/editor/PreviewCanvas.tsx`
- Create: `src/editor/PropertyPanel.tsx`
- Create: `src/editor/TimelinePanel.tsx`
- Create: `src/components/hud/*.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/editor.css`
- Create: `src/styles/hud.css`

- [ ] **Step 1: Render the editor workbench**

Show toolbar, media status, final-video preview, property panel, and timeline panel.

- [ ] **Step 2: Keep editor controls outside the final-video canvas**

Playback-like preview controls are allowed only outside the 16:9 preview frame.

- [ ] **Step 3: Render shared HUD components from props**

HUD components must not read the JSON directly.

### Task 4: Remotion Slice

**Files:**
- Create: `src/remotion/Root.tsx`
- Create: `src/remotion/CourseShellComposition.tsx`
- Create: `src/remotion/layers/MainVideoLayer.tsx`
- Create: `src/remotion/layers/SpeakerLayer.tsx`
- Create: `src/remotion/layers/HudLayer.tsx`
- Create: `scripts/validate-lessons.ts`
- Create: `scripts/render-sample.ts`

- [ ] **Step 1: Register `CourseShellComposition`**

Use 1920 x 1080, 30 FPS, and a 60-second sample duration.

- [ ] **Step 2: Render main, speaker, and HUD layers**

Use `deriveHudState` from the shared timeline utilities.

- [ ] **Step 3: Provide validation and render scripts**

Validate all lesson JSON files and render `out/lesson-01-sample.mp4`.

### Task 5: Verification And Stage Closeout

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.MD`
- Create: `docs/STAGE_3_IMPLEMENTATION_NOTES.md`

- [ ] **Step 1: Install dependencies**

Run `npm install`.

- [ ] **Step 2: Verify TypeScript and lesson schema**

Run `npm run typecheck` and `npm run validate:lessons`.

- [ ] **Step 3: Verify editor and Remotion commands**

Run or start `npm run dev`, `npm run studio`, and `npm run render:sample`.

- [ ] **Step 4: Update project memory**

Record Stage 3 outputs, frozen decisions, handoff notes, and Stage 4 recommendations in README and AGENTS.
