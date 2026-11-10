"use client";

import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { CanvasTexture, Color, SRGBColorSpace, Vector2 } from "three";
import LazyCanvas from "../kit/LazyCanvas";
import { useCanvasDrag } from "../kit/useCanvasDrag";
import { useVideoTextures, texAspect } from "../kit/useVideoTextures";

// Rounded, anti-aliased tile that blends into the board colour; gentle lens curve; hover lift (no dimming of other tiles).
const TileMaterial = shaderMaterial(
  { uTex: null, uImgAspect: 1, uSize: new Vector2(1, 1), uVel: new Vector2(), uHover: 0, uDim: 0, uBg: new Color("#000") },
  /* glsl */ `
    uniform vec2 uVel; uniform float uHover; varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 wp = modelMatrix * vec4(position, 1.0);
      wp.z += uHover * 0.35 - (wp.x * wp.x * 0.010 + wp.y * wp.y * 0.016);
      wp.x += uVel.x * wp.y * wp.y * 0.006;
      wp.y += uVel.y * wp.x * wp.x * 0.004;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  /* glsl */ `
    uniform sampler2D uTex; uniform float uImgAspect, uHover, uDim; uniform vec2 uSize; uniform vec3 uBg; varying vec2 vUv;
    float rbox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
    void main() {
      float pa = uSize.x / uSize.y;
      vec2 s = pa > uImgAspect ? vec2(1.0, uImgAspect / pa) : vec2(pa / uImgAspect, 1.0);
      vec2 uv = (vUv - 0.5) * s * (1.0 - 0.05 * uHover) + 0.5;
      vec3 c = texture2D(uTex, uv).rgb;
      c = mix(c, uBg, uDim * 0.55);
      float d = rbox((vUv - 0.5) * uSize, uSize * 0.5, 0.06);
      float a = 1.0 - smoothstep(-fwidth(d), fwidth(d), d);
      gl_FragColor = vec4(mix(uBg, c, a), 1.0);
      #include <colorspace_fragment>
    }
  `
);
extend({ TileMaterial });

export const COLS = 8, ROWS = 5;
const CW = 2.45, CH = 2.0, BW = COLS * CW, BH = ROWS * CH;
const SIZES = { portrait: [1.4, 1.78], landscape: [2.18, 1.4], square: [1.65, 1.65] };
const wrap = (v, size) => ((((v + size / 2) % size) + size) % size) - size / 2;

// Typographic brand tile drawn to a canvas.
function wordTexture(text, sub, ink, paper, accent) {
  const c = document.createElement("canvas"); c.width = 1000; c.height = 640;
  const x = c.getContext("2d");
  x.fillStyle = paper; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = accent; x.font = "500 30px Archivo, sans-serif";
  x.fillText(sub, 70, 100);
  x.fillStyle = ink; x.font = "500 88px Archivo, sans-serif";
  if ("letterSpacing" in x) x.letterSpacing = "-2px";
  const words = text.split(" "); let line = "", y = 330;
  words.forEach((w) => {
    const t = line ? `${line} ${w}` : w;
    if (x.measureText(t).width > 860) { x.fillText(line, 70, y); line = w; y += 96; } else line = t;
  });
  x.fillText(line, 70, y);
  const tex = new CanvasTexture(c); tex.colorSpace = SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

function Tiles({ items, colors, onOpen, onHover }) {
  const drag = useCanvasDrag();
  const aniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const meshes = useRef([]);
  const st = useRef({ cx: 0, cy: 0, tx: 0, ty: 0, vx: 0, vy: 0, svx: 0, svy: 0, hover: -1, nearKey: "", nearAt: 0 });
  const [near, setNear] = useState([]);
  const bg = useMemo(() => new Color(colors.paper), [colors.paper]);

  const imgs = useTexture(items.filter((t) => t.img).map((t) => t.img), (ts) => [].concat(ts).forEach((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = Math.min(8, aniso); }));
  const vidMedia = useMemo(() => items.filter((t) => t.video).map((t) => t.video), [items]);
  const vids = useVideoTextures(vidMedia, near);
  const words = useMemo(() => items.filter((t) => t.word).map((t) => wordTexture(t.word, t.sub, colors.ink, colors.paper, colors.accent)), [items, colors]);
  const kinds = useMemo(() => { let a = 0, b = 0, c = 0; return items.map((t) => (t.img ? ["img", a++] : t.video ? ["vid", b++] : ["word", c++])); }, [items]);
  const tex = (k) => { const [kind, n] = kinds[k]; return kind === "img" ? imgs[n] : kind === "vid" ? vids[n] : words[n]; };

  useFrame((state, dt) => {
    const s = st.current, d = drag.take();
    const px = state.viewport.width / state.size.width;
    if (d.down) {
      s.vx += (d.dx * px - s.vx) * 0.5; s.vy += (-d.dy * px - s.vy) * 0.5;
      s.tx += d.dx * px; s.ty -= d.dy * px;
    } else {
      s.tx += s.vx; s.ty += s.vy; s.vx *= 0.94; s.vy *= 0.94;
      if (Math.abs(s.vx) + Math.abs(s.vy) < 0.001 && s.hover < 0) s.tx -= dt * 0.12; // slow idle drift
    }
    const k = 1 - Math.exp(-dt * 7);
    const px0 = s.cx, py0 = s.cy;
    s.cx += (s.tx - s.cx) * k; s.cy += (s.ty - s.cy) * k;
    const vx = (s.cx - px0) / Math.max(dt, 1e-3), vy = (s.cy - py0) / Math.max(dt, 1e-3);
    s.svx += (Math.max(-6, Math.min(6, vx)) - s.svx) * 0.15; s.svy += (Math.max(-6, Math.min(6, vy)) - s.svy) * 0.15;

    const nearNow = [];
    const kh = 1 - Math.exp(-dt * 8);
    items.forEach((t, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const x = wrap(t.x + s.cx, BW), y = wrap(t.y + s.cy, BH);
      m.position.set(x, y, 0);
      const u = m.material;
      u.uVel.set(s.svx, s.svy);
      u.uHover += ((s.hover === i ? 1 : 0) - u.uHover) * kh;
      u.uImgAspect = texAspect(u.uTex);
      if (kinds[i][0] === "vid" && Math.abs(x) < 5 && Math.abs(y) < 3.4) nearNow.push(kinds[i][1]);
    });
    // update which clips play at most ~3×/s (avoids re-render churn while dragging)
    const key = nearNow.sort().join(",");
    if (key !== s.nearKey && state.clock.elapsedTime - s.nearAt > 0.35) { s.nearKey = key; s.nearAt = state.clock.elapsedTime; setNear(nearNow.slice()); }
  });

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  return (
    <>
      <color attach="background" args={[colors.paper]} />
      {items.map((t, i) => {
        const [w, h] = SIZES[t.shape];
        return (
          <mesh key={i} ref={(el) => (meshes.current[i] = el)}
            onPointerOver={(e) => { e.stopPropagation(); st.current.hover = i; onHover(t); }}
            onPointerOut={() => { if (st.current.hover === i) { st.current.hover = -1; onHover(null); } }}
            onClick={(e) => { if (e.delta < 6) onOpen(t); }}>
            <planeGeometry args={[w, h, 20, 20]} />
            <tileMaterial uTex={tex(i)} uSize={new Vector2(w, h)} uBg={bg} />
          </mesh>
        );
      })}
    </>
  );
}

// An endless, draggable board of brand imagery, footage and type.
// Memoised so hover captions in the page don't re-render the 3D scene.
export default memo(function Board({ items, colors, onOpen, onHover }) {
  return (
    <LazyCanvas className="h-full w-full" camera={{ position: [0, 0, 7.4], fov: 42 }}>
      <Suspense fallback={null}><Tiles items={items} colors={colors} onOpen={onOpen} onHover={onHover} /></Suspense>
    </LazyCanvas>
  );
});

// Even grid on the wrap-around board; each item sits centred in its cell.
export function layout(list) {
  return list.map((t, k) => {
    const c = k % COLS, r = Math.floor(k / COLS) % ROWS;
    return { ...t, x: -BW / 2 + CW * (c + 0.5), y: BH / 2 - CH * (r + 0.5) };
  });
}
