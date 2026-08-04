# Canvas 2D water system

Use this reference for stylized top-down or side-view water rendered with the Canvas 2D API.

## Recommended layers

Render from broadest to smallest:

1. A vertical or scene-aware depth gradient.
2. One broad, low-opacity swell band.
3. Medium directional wave lines.
4. Sparse short highlights or caustic fragments.
5. Interaction effects such as wakes, rings, or shoreline foam.
6. Gameplay objects and their shadows.

## Wave construction

For a line sampled across `x`, combine waves whose periods do not divide neatly into each other:

```js
y = row
  + Math.sin(x * 0.012 + time * 0.45 + phase) * 8
  + Math.sin(x * 0.005 - time * 0.28 + phase * 1.7) * 3;
```

Use a different pair of frequencies and speeds for medium lines. Change opacity and width between layers. Keep the broadest layer soft enough that it reads as depth rather than a stripe.

## Highlight distribution

Seed highlight positions so they do not jump each frame. Animate a small drift, length change, or curvature around those stable origins. Favor clusters separated by quiet areas over uniform coverage.

## Directional wake

Given object heading `h` and position `(x, y)`:

```js
const backX = x - Math.cos(h) * hullLength;
const backY = y - Math.sin(h) * hullLength;
const sideX = -Math.sin(h);
const sideY = Math.cos(h);
```

Emit wake particles from two points offset along `(sideX, sideY)`. Move them backward and outward. Scale emission frequency and initial width with speed. Fade opacity while expanding radius.

Cap the particle array and stop emitting below a small speed threshold.

## Performance

- Render at a device pixel ratio capped to the project's needs.
- Reuse arrays and gradients when profiling shows allocation pressure.
- Sample long wave paths in segments rather than per physical pixel.
- Bound particle counts and remove expired particles from the end of the array.
- Pause animation work when the game's loop is paused or the scene is inactive.

## Common failures

- Equal spacing and equal speed make the water look like graph paper.
- High-contrast lines across the whole surface compete with gameplay.
- Randomizing every frame creates shimmer rather than motion.
- Wakes emitted from the object's center look like smoke.
- Foam without a shoreline, collision, or moving object has no visual cause.
- Large waves at a zoomed-out scale make the entire world appear unstable.
