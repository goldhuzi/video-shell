# Stage 7 Visual Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the first default HUD template, `default-ai-tactical`, as a polished local course-video visual template without expanding product scope.

**Architecture:** Keep the existing React + Remotion split. Editor preview may keep editor-only selection wrappers, while Remotion must render only non-interactive HUD display layers. Visual work should flow through shared CSS tokens and deterministic CSS classes.

**Tech Stack:** React, TypeScript, Remotion, Vite, Zod, plain CSS tokens.

---

### Task 1: Freeze Visual Tokens And Layout Bounds

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/hud.css`
- Modify: `src/styles/editor.css`

- [ ] Add `default-ai-tactical` color aliases for deep backgrounds, panel surfaces, borders, text, energy colors, status colors, glow values, and 1920x1080 layout variables.
- [ ] Keep existing token names as aliases so earlier editor and HUD styles do not break.
- [ ] Adjust editor preview slots to mirror the final 1920x1080 layout: thin top header, narrow right rail, light bottom HUD, larger main video.
- [ ] Add render-mode safety CSS so final HUD surfaces do not imply hover, pointer, dragging, or clicking.

### Task 2: Polish Remotion Display Layers

**Files:**
- Modify: `src/remotion/CourseShellComposition.tsx`
- Modify: `src/remotion/layers/MainVideoLayer.tsx`
- Modify: `src/remotion/layers/SpeakerLayer.tsx`
- Modify: `src/remotion/layers/HudLayer.tsx`

- [ ] Import shared CSS into the Remotion bundle.
- [ ] Put the composition root on `course-shell-render theme-default-ai-tactical is-render-mode`.
- [ ] Move Remotion HUD panels toward CSS classes and shared layout constants instead of scattered color/size literals.
- [ ] Keep media and audio routing untouched.
- [ ] Keep Remotion free of editor components, buttons, inputs, selects, video controls, sliders, drag handles, and click handlers.

### Task 3: Document The Default Template

**Files:**
- Create: `docs/STAGE_7_VISUAL_POLISH_NOTES.md`
- Create: `docs/STAGE_7_VISUAL_TEMPLATE_SPEC.md`
- Modify: `README.md`
- Modify: `AGENTS.MD`

- [ ] Document what Stage 7 did and did not do.
- [ ] Document `default-ai-tactical` / `AI Tactical HUD` as the first default template.
- [ ] Document main-video priority, CourseStageBar non-player design, render/editor boundary, tokens, states, motion rules, and known limitations.
- [ ] Update README document map and project status.
- [ ] Update AGENTS long-term phase memory.

### Task 4: Verify And Capture Evidence

**Commands:**
- `npm test`
- `npm run typecheck`
- `npm run validate:lessons`
- `npm run build`
- `npm run render:sample`
- `npm run preflight:render -- lesson-01` (expected to fail until real authorized main video is supplied)
- `npm run render:smoke -- lesson-render-fixture`
- `npm run render:still -- lesson-render-fixture --times 2,7,10`
- `npm run render:clip -- lesson-render-fixture --from 2 --duration 4`

- [ ] Run static scans against `src/remotion` for forbidden player/editor controls.
- [ ] If `lesson-01` render commands fail because the placeholder main video is absent, record that as expected preflight protection, not a renderer failure.
- [ ] Do not claim real-course production readiness until authorized real course assets pass the same checks.
