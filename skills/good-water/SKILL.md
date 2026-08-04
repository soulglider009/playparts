---
name: good-water
description: Build or improve stylized 2D water for web games when the existing result looks flat, generic, repetitive, disconnected from moving objects, or visually weak at game scale. Use for Canvas 2D water, lakes, rivers, ocean surfaces, boat wakes, foam, caustic highlights, and water polish. Do not use for physically accurate fluid simulation or photorealistic 3D oceans.
license: MIT
metadata:
  author: playparts
  version: "0.1.0"
---

# Good Water

Create water that reads as a living game surface rather than a blue background.
Preserve the project's renderer, visual language, scale, and performance budget.

## Start by reading the game

1. Identify the renderer, coordinate system, game loop, camera behavior, and target viewport.
2. Find the existing palette, line weight, shape language, and animation cadence.
3. Identify which objects touch or move through the water.
4. Capture the existing result before changing it. Treat this as the comparison baseline.
5. Read [the Canvas water system](references/canvas-water-system.md) when the project uses Canvas 2D.

Do not replace the engine, introduce a large rendering dependency, or restyle the rest of the game to make the water fit.

## Build the water in this order

### 1. Establish depth

Use at least three related depth values: a lit surface, the dominant body color, and a deeper value. Depth should be visible before waves or decorative detail are added.

Avoid a uniform blue fill. Match the project's saturation and contrast rather than defaulting to realistic ocean colors.

### 2. Layer motion at different scales

Combine a slow large swell, a medium directional wave, and small highlights. Give the layers different wavelengths, speeds, amplitudes, and directions so their repetition does not align.

Keep amplitude appropriate to the game's camera scale. Water should not look like moving graph paper.

### 3. Add controlled light

Use sparse highlights, caustic fragments, or reflections to reveal movement. Vary their length and opacity. Avoid evenly spaced marks and full-screen visual noise.

### 4. Connect water to gameplay

Moving objects should create a response driven by their speed and heading. For boats, emit a widening wake behind the hull. For footsteps or impacts, use short-lived rings or displaced highlights.

The response must fade, remain bounded, and avoid unbounded particle growth.

### 5. Add boundaries only when the scene has them

Where water meets land or solid objects, add restrained foam, darker contact color, or displaced wave lines. Do not scatter foam across open water without a cause.

## Quality bar

The finished water must:

- Read clearly when the full game is visible, not only in a close-up.
- Preserve legibility of the player, enemies, pickups, and UI.
- Avoid obvious synchronized repetition.
- React to at least one relevant moving or contacting object when the game contains one.
- Remain stable after resize and at the project's target device pixel ratio.
- Avoid frame-by-frame allocations where practical and cap all particles.
- Continue to work after pause, restart, and scene transitions.

## Verify

1. Run the existing build and tests.
2. Exercise the primary controls for at least 20 seconds.
3. Inspect the water at the smallest and largest supported viewport.
4. Verify that interaction effects follow object speed and direction.
5. Check for console errors, runaway particle counts, visible seams, and repeated bands.
6. Compare the final screenshot or recording against the captured baseline.

Do not call the result finished merely because it animates. If the baseline and finished versions are not meaningfully distinguishable at normal game scale, revise the depth, motion hierarchy, or interaction response.
