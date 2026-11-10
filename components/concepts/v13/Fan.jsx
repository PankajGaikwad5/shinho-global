"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, ExtrudeGeometry, Path, Shape, SRGBColorSpace } from "three";
import LazyCanvas, { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useCanvasDrag } from "../kit/useCanvasDrag";
import { MATS, U, CATL } from "@/lib/materials";
import { LOGO } from "@/lib/themes";

export const BLADES = MATS.slice(0, 20); // placeholder swatch imagery
const BW = 0.62, BH = 3.6, PIVOT = 0.32; // blade width/height, pivot hole distance from bottom
const SPREAD = 1.45; // radians each side when fully open

let bladeGeo = null;
function bladeGeometry() {
  if (bladeGeo) return bladeGeo;
  const w = BW, h = BH, r = 0.08, s = new Shape();
  s.moveTo(-w / 2 + r, 0);
  s.lineTo(w / 2 - r, 0); s.quadraticCurveTo(w / 2, 0, w / 2, r);
  s.lineTo(w / 2, h - r); s.quadraticCurveTo(w / 2, h, w / 2 - r, h);
  s.lineTo(-w / 2 + r, h); s.quadraticCurveTo(-w / 2, h, -w / 2, h - r);
  s.lineTo(-w / 2, r); s.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0);
  const hole = new Path(); hole.absarc(0, PIVOT, 0.07, 0, Math.PI * 2, true); s.holes.push(hole);
  const g = new ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.003, bevelSize: 0.003, bevelSegments: 1, curveSegments: 16 });
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, p.getY(i) / h);
  uv.needsUpdate = true; g.computeVertexNormals(); g.translate(0, -PIVOT, -0.006); // origin at the pivot
  bladeGeo = g;
  return g;
}

// Blade face: finish photo above, ivory label band at the bottom (name rotated along the blade, code).
function drawBlade(img, m, aniso) {
  const W = 300, H = Math.round(300 * (BH / BW)), band = Math.round(H * 0.24);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d"), ph = H - band;
  const ia = img.width / img.height, pa = W / ph;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ia > pa) { sw = img.height * pa; sx = (img.width - sw) / 2; } else { sh = img.width / pa; sy = (img.height - sh) / 2; }
  x.drawImage(img, sx, sy, sw, sh, 0, 0, W, ph);
  x.fillStyle = "#f3efe7"; x.fillRect(0, ph, W, band);
  x.fillStyle = "#b99a5b"; x.fillRect(0, ph, W, 4);
  x.save(); x.translate(W * 0.42, ph + band - 70); x.rotate(-Math.PI / 2);
  x.fillStyle = "#111318"; x.font = "500 38px Archivo, sans-serif"; x.fillText(m.name, 0, 0); x.restore();
  x.fillStyle = "#8a6d3b"; x.font = "500 26px 'IBM Plex Mono', monospace"; x.fillText(m.code, 24, H - 26);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = aniso;
  return t;
}

function Deck({ progress, selected, onSelect, onHover }) {
  const aniso = useThree((s) => Math.min(8, s.gl.capabilities.getMaxAnisotropy()));
  const base = useTexture(BLADES.map((m) => U(m.img, 640)));
  const maps = useMemo(() => base.map((b, i) => drawBlade(b.image, BLADES[i], aniso)), [base, aniso]);
  const drag = useCanvasDrag();
  const blades = useRef([]), root = useRef(null);
  const st = useRef({ off: 0, v: 0, hover: -1 });
  const n = BLADES.length;

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  useFrame((state, dt) => {
    const s = st.current, d = drag.take(), p = Math.min(1, Math.max(0, progress.get()));
    const open = Math.min(1, p / 0.22);                   // 1) the deck fans open
    const browse = Math.min(1, Math.max(0, (p - 0.25) / 0.7)); // 2) then leafs through blade by blade
    if (d.down) s.v = d.dx * 0.004; else s.v *= 0.92;
    s.off = Math.max(-n, Math.min(n, s.off + s.v * 6)); // dragging leafs forwards/backwards
    const focusF = open > 0.9 ? Math.max(-1, Math.min(n, browse * (n - 1) + s.off)) : -10;
    const k = 1 - Math.exp(-dt * 6);
    blades.current.forEach((g, i) => {
      if (!g) return;
      const a = open * SPREAD * (1 - (2 * i) / (n - 1));
      const dist = Math.abs(i - focusF), lift = Math.max(0, 1 - dist / 1.2) * 0.55;
      const sel = selected === i, hov = s.hover === i;
      const ta = sel ? 0 : a, tl = sel ? 2.4 : lift + (hov ? 0.35 : 0), tz = sel ? 2.2 : i * 0.016 + (hov || lift > 0.1 ? 0.15 : 0);
      g.rotation.z += (ta - g.rotation.z) * k;
      g.userData.l = (g.userData.l ?? 0) + (tl - (g.userData.l ?? 0)) * k;
      g.position.set(-Math.sin(g.rotation.z) * g.userData.l, Math.cos(g.rotation.z) * g.userData.l, g.position.z + (tz - g.position.z) * k);
    });
    root.current.rotation.y = state.pointer.x * 0.12;
    root.current.rotation.x = -0.12 + state.pointer.y * 0.06;
  });

  return (
    <group ref={root} position={[0, -1.9, 0]}>
      {BLADES.map((m, i) => (
        <group key={m.code} ref={(el) => (blades.current[i] = el)}>
          <mesh geometry={bladeGeometry()} castShadow
            onPointerOver={(e) => { e.stopPropagation(); st.current.hover = i; onHover({ ...m, family: CATL[m.cat] }); document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { if (st.current.hover === i) { st.current.hover = -1; onHover(null); } document.body.style.cursor = ""; }}
            onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onSelect(selected === i ? -1 : i); }}>
            <meshPhysicalMaterial attach="material-0" map={maps[i]} roughness={0.4} clearcoat={0.6} clearcoatRoughness={0.2} />
            <meshStandardMaterial attach="material-1" color="#e6e1d7" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* brass bolt through the pivot */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.18]} castShadow><cylinderGeometry args={[0.06, 0.06, 0.62, 24]} /><meshStandardMaterial color={LOGO.gold} metalness={0.95} roughness={0.22} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}><cylinderGeometry args={[0.13, 0.13, 0.05, 32]} /><meshStandardMaterial color={LOGO.gold} metalness={0.95} roughness={0.22} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.13]}><cylinderGeometry args={[0.13, 0.13, 0.05, 32]} /><meshStandardMaterial color={LOGO.gold} metalness={0.95} roughness={0.22} /></mesh>
    </group>
  );
}

// A giant sample fan deck: scroll to fan it open and leaf through, drag to browse, click to pull a blade.
export default function Fan({ progress, selected, onSelect, onHover }) {
  return (
    <LazyCanvas className="h-full w-full" shadows camera={{ position: [0, 0.6, 7.4], fov: 40 }}>
      <color attach="background" args={["#141416"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 6, 6]} intensity={1.6} color="#fff4e4" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      <Studio intensity={0.75} />
      <mesh position={[0, 0, -0.6]} receiveShadow><planeGeometry args={[40, 40]} /><shadowMaterial transparent opacity={0.35} /></mesh>
      <Suspense fallback={null}><Deck progress={progress} selected={selected} onSelect={onSelect} onHover={onHover} /></Suspense>
      <Finish bloom={0.4} threshold={0.9} vignette={0.55} />
    </LazyCanvas>
  );
}
