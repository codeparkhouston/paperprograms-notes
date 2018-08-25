// Our simpler drawing API
// based on Dynamicland illumination API

// Draw
const label = (ctx, text) => {};
const text = (ctx, { text, x, y, fontSize, fontFace, color }) => {};
const rectangle = (ctx, { x, y, width, height, stroke, fill }) => {};
const circle = (ctx, { x, y, radius, stroke, fill }) => {};
const line = (ctx, { from, to, radius, stroke, strokeWidth }) => {};

// Animate
const loop = (ctx, draw) => {
  // pass time "t" to draw
};
