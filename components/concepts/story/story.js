// Scroll-story timing shared by the full-page 3D story concepts (V14–V16).
//
// The page is a stack of chapter sections, each `len` screens tall, over one fixed canvas.
// Overall scroll progress p (0..1) maps to: chapter index i, local progress t (0..1 through the chapter),
// and u — 0 while the chapter "holds" (text on screen), easing to 1 during its final screen as the camera
// travels to the next chapter. f = i + u is a continuous position for interpolating camera keyframes.

export function buildBounds(chapters) {
  const total = chapters.reduce((s, c) => s + c.len, 0);
  const range = Math.max(1e-6, total - 1);
  let acc = 0;
  return chapters.map((c) => {
    const start = acc / range, end = (acc + c.len) / range;
    acc += c.len;
    return { start, end, len: c.len };
  });
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (v) => { const x = clamp01(v); return x * x * (3 - 2 * x); };

export function storyAt(p, bounds) {
  let i = bounds.findIndex((b) => p < b.end);
  if (i < 0) i = bounds.length - 1;
  const b = bounds[i];
  const t = clamp01((p - b.start) / (b.end - b.start));
  const u = i === bounds.length - 1 ? 0 : smooth(t * b.len - (b.len - 1));
  return { i, t, u, f: i + u };
}

// Interpolate an array of [x,y,z] keyframes at continuous position f.
export function keyAt(keys, f) {
  const i = Math.min(keys.length - 1, Math.floor(f)), j = Math.min(keys.length - 1, i + 1), w = f - Math.floor(f);
  return [0, 1, 2].map((k) => keys[i][k] + (keys[j][k] - keys[i][k]) * w);
}

// Smooth visibility (1 at chapter `c`, fading to 0 by `width` chapters away).
export function presence(f, c, width = 0.75) {
  return smooth(1 - Math.abs(f - c) / width);
}
