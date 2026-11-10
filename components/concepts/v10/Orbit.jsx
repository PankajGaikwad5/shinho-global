"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import Anchor from "../kit/Anchor";
import { AdditiveBlending, BufferGeometry, CanvasTexture, Float32BufferAttribute, Quaternion, RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import LazyCanvas, { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useCanvasDrag } from "../kit/useCanvasDrag";
import { Chip, useChipTextures } from "../objects/Chip";
import { Roll } from "../objects/Roll";
import { MATS, U } from "@/lib/materials";

const pick = (...names) => names.map((n) => MATS.find((m) => m.name === n));

// One ring per product platform (chips reuse the swatch library; imagery is placeholder).
export const RINGS = [
  { name: "Decorative PVC Films", r: 3.3, tilt: [0.32, 0, 0.12], speed: 0.07, count: 12, mats: pick("Calacatta", "Natural Oak", "Smoked Walnut", "Nero Marquina", "Raw Concrete", "Rosa Stone") },
  { name: "PET, PP & Co-PET Films", r: 4.6, tilt: [-0.22, 0, -0.18], speed: -0.05, count: 14, mats: pick("Silver Metallic", "Linear Silver", "Pearl Satin", "Brushed Steel", "Satin Aluminium", "Spun Metal") },
  { name: "Top-Layer Films", r: 5.9, tilt: [0.12, 0, 0.3], speed: 0.04, count: 16, mats: pick("Graphite Matte", "Nero Gloss", "Soft Grey Matte", "Forged Grey", "Light Oak") },
  { name: "Finished Self-Adhesive Films", r: 7.2, tilt: [0.42, 0, -0.08], speed: -0.03, count: 18, mats: pick("Oxide", "Verdigris", "Amber Onyx", "Fluted Ash", "Calacatta", "Natural Oak") },
];
const ALL_MATS = [...new Set(RINGS.flatMap((r) => r.mats))];

// Which ring the scroll position is visiting (-1 = overview). Shared with the page so its copy matches.
export const scrollRing = (p) => (p < 0.14 ? -1 : Math.min(RINGS.length - 1, Math.floor(((p - 0.14) / 0.86) * RINGS.length)));

const hash = (n) => { const x = Math.sin(n * 91.3) * 43758.5453; return x - Math.floor(x); };
const ease = (t) => t * t * (3 - 2 * t);

let dotCache = null;
function dotTexture() { // soft round sprite for stars and dust
  if (dotCache) return dotCache;
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,.5)"); g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  dotCache = new CanvasTexture(c);
  return dotCache;
}

function Points({ positions, size, color, opacity = 1 }) {
  const geo = useMemo(() => { const g = new BufferGeometry(); g.setAttribute("position", new Float32BufferAttribute(positions, 3)); return g; }, [positions]);
  return (
    <points geometry={geo}>
      <pointsMaterial map={dotTexture()} size={size} color={color} transparent opacity={opacity} depthWrite={false} blending={AdditiveBlending} sizeAttenuation />
    </points>
  );
}

function Stars() {
  const [far, bokeh] = useMemo(() => {
    const a = [], b = [];
    for (let i = 0; i < 1800; i++) { const t = hash(i) * Math.PI * 2, p = Math.acos(2 * hash(i + 0.5) - 1), r = 40 + hash(i + 0.9) * 30; a.push(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); }
    for (let i = 0; i < 70; i++) { b.push((hash(i + 3) - 0.5) * 50, (hash(i + 4) - 0.5) * 28, -6 - hash(i + 5) * 30); }
    return [a, b];
  }, []);
  return <><Points positions={far} size={0.18} color="#e9e2d2" opacity={0.8} /><Points positions={bokeh} size={1.4} color="#d9c49a" opacity={0.18} /></>;
}

function OrbitPath({ r, on }) {
  const pts = useMemo(() => Array.from({ length: 161 }, (_, i) => { const a = (i / 160) * Math.PI * 2; return [Math.cos(a) * r, 0, Math.sin(a) * r]; }), [r]);
  return <Line points={pts} color="#c2a466" lineWidth={on ? 1.6 : 0.8} transparent opacity={on ? 0.9 : 0.28} />;
}

function RingDust({ r }) {
  const pos = useMemo(() => {
    const a = [];
    for (let i = 0; i < 700; i++) { const t = hash(i + r) * Math.PI * 2, rr = r + (hash(i + r * 3) - 0.5) * 0.9; a.push(Math.cos(t) * rr, (hash(i + r * 7) - 0.5) * 0.12, Math.sin(t) * rr); }
    return a;
  }, [r]);
  return <Points positions={pos} size={0.05} color="#c2a466" opacity={0.55} />;
}

function Planet() {
  const base = useTexture(U(MATS.find((m) => m.name === "Brushed Steel").img, 1200));
  const map = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(2, 1); t.needsUpdate = true; return t; }, [base]);
  const roll = useRef(null);
  useFrame((_, dt) => { roll.current.rotation.x += dt * 0.25; });
  return (
    <group rotation={[0.25, 0.4, -0.35]}>
      <Roll ref={roll} map={map} radius={1.05} length={2.5} metal={0.6} />
      <sprite scale={[7, 7, 1]} position={[0, 0, -1.5]}>
        <spriteMaterial map={dotTexture()} color="#c2a466" transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
}

function System({ progress, selected, onSelect, onHover, focusRing, onAnchor }) {
  const textures = useChipTextures(ALL_MATS);
  const texOf = useMemo(() => new Map(ALL_MATS.map((m, i) => [m.code, textures[i]])), [textures]);
  const drag = useCanvasDrag();
  const sys = useRef(null), spins = useRef([]), chips = useRef({});
  const st = useRef({ yaw: 0, v: 0, hover: null, intro: 0 });
  const look = useRef(new Vector3());
  const focus = useRef(null), focusMesh = useRef(null);
  const [shown, setShown] = useState(null); // chip currently flying (stays mounted for the trip back)

  // chip layout per ring
  const layout = useMemo(() => RINGS.map((ring, ri) => Array.from({ length: ring.count }, (_, k) => {
    const a = (k / ring.count) * Math.PI * 2 + ri * 0.4;
    const m = ring.mats[k % ring.mats.length];
    return { key: `${ri}-${k}`, ring: ri, m, a, pos: [Math.cos(a) * ring.r, (hash(k + ri) - 0.5) * 0.3, Math.sin(a) * ring.r], rot: [0, Math.PI / 2 - a, (hash(k * 3 + ri) - 0.5) * 0.25] };
  })), []);

  // start / end the fly-to-camera when the selection changes
  useEffect(() => {
    if (selected) {
      const mesh = chips.current[selected.key];
      if (!mesh) return;
      const p = new Vector3(), q = new Quaternion();
      mesh.getWorldPosition(p); mesh.getWorldQuaternion(q);
      focus.current = { key: selected.key, phase: "in", pos: p, quat: q };
      setShown(selected);
    } else if (focus.current) focus.current.phase = "out";
  }, [selected]);

  useFrame((state, dt) => {
    const s = st.current, d = drag.take(), cam = state.camera;
    // camera: a short intro fly-in to a full view of the system, then each step of scroll visits the next ring
    // (or the ring chosen in the navigator). Scroll = one platform at a time, not a slow zoom.
    s.intro = Math.min(1, s.intro + dt / 3.2);
    const p = Math.min(1, Math.max(0, progress.get()));
    const extra = (1 - ease(s.intro)) * 26;
    const kc = 1 - Math.exp(-dt * 2.4);
    const fr = focusRing >= 0 ? focusRing : scrollRing(p);
    let cp, lp;
    if (fr >= 0) {
      const R = RINGS[fr].r, ang = 0.45 + fr * 0.3;
      cp = new Vector3(Math.sin(ang) * (R + 4.4), R * 0.4 + 1.5, Math.cos(ang) * (R + 4.4));
      lp = new Vector3(Math.sin(ang) * R * 0.5, 0, Math.cos(ang) * R * 0.5);
    } else {
      const dist = 21 + extra, h = 7.2 + extra * 0.25, ang = 0.35 + (1 - ease(s.intro)) * 0.6;
      cp = new Vector3(Math.sin(ang) * dist, h, Math.cos(ang) * dist);
      lp = new Vector3(0, 0.2, 0);
    }
    if (s.intro < 0.02) { cam.position.copy(cp); look.current.copy(lp); }
    cam.position.lerp(cp, kc); look.current.lerp(lp, kc);
    cam.lookAt(look.current);
    // drag to spin
    if (d.down) s.v = d.dx * 0.0035; else s.v *= 0.94;
    s.yaw += s.v; sys.current.rotation.y = s.yaw;
    spins.current.forEach((g, i) => { if (g) g.rotation.y += RINGS[i].speed * dt * (s.hover ? 0.25 : 1); });

    // hover lift
    const k = 1 - Math.exp(-dt * 8);
    layout.flat().forEach((c) => {
      const m = chips.current[c.key];
      if (!m) return;
      const lift = s.hover === c.key ? 0.45 : 0;
      const tx = c.pos[0] + Math.cos(c.a) * lift, tz = c.pos[2] + Math.sin(c.a) * lift;
      m.position.x += (tx - m.position.x) * k; m.position.z += (tz - m.position.z) * k;
      const sc = (s.hover === c.key ? 1.15 : 1) * 0.62;
      m.scale.setScalar(m.scale.x + (sc - m.scale.x) * k);
      m.visible = !(focus.current && focus.current.key === c.key);
    });

    // selected chip flies to the camera (and back)
    const f = focus.current, fm = focusMesh.current;
    if (f && fm) {
      const dir = new Vector3(); cam.getWorldDirection(dir);
      const right = new Vector3().crossVectors(dir, cam.up).normalize();
      let tp, tq;
      if (f.phase === "in") {
        tp = cam.position.clone().add(dir.multiplyScalar(2.6)).add(right.multiplyScalar(-0.75));
        tq = cam.quaternion.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.sin(state.clock.elapsedTime * 0.6) * 0.25));
      } else {
        const m = chips.current[f.key]; tp = new Vector3(); tq = new Quaternion();
        m.getWorldPosition(tp); m.getWorldQuaternion(tq);
      }
      const kk = 1 - Math.exp(-dt * 5);
      f.pos.lerp(tp, kk); f.quat.slerp(tq, kk);
      fm.position.copy(f.pos); fm.quaternion.copy(f.quat); fm.visible = true;
      if (f.phase === "out" && f.pos.distanceTo(tp) < 0.03) { focus.current = null; fm.visible = false; setShown(null); }
    } else if (fm) fm.visible = false;
    else if (f && !fm && f.phase === "out") focus.current = null;
  });

  return (
    <>
      <group ref={sys}>
        <Planet />
        {RINGS.map((ring, ri) => (
          <group key={ring.name} rotation={ring.tilt}>
            <RingDust r={ring.r} />
            <OrbitPath r={ring.r} on={focusRing === ri} />
            <Anchor index={ri} position={[0, 0.9, ring.r]} onFrame={onAnchor} />
            <group ref={(el) => (spins.current[ri] = el)}>
              {layout[ri].map((c) => (
                <Chip key={c.key} ref={(el) => (chips.current[c.key] = el)} map={texOf.get(c.m.code)} position={c.pos} rotation={c.rot} scale={0.62}
                  onPointerOver={(e) => { e.stopPropagation(); st.current.hover = c.key; onHover({ ...c.m, platform: ring.name }); document.body.style.cursor = "pointer"; }}
                  onPointerOut={() => { if (st.current.hover === c.key) { st.current.hover = null; onHover(null); } document.body.style.cursor = ""; }}
                  onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onSelect({ key: c.key, ...c.m, platform: ring.name }); }} />
              ))}
            </group>
          </group>
        ))}
      </group>
      {shown && <Chip ref={focusMesh} map={texOf.get(shown.code)} scale={0.62} visible={false} />}
    </>
  );
}

// A planetary system of sample chips: scroll to fly in, drag to spin, click a chip to inspect it.
// Ring name labels are rendered by the page (see Anchor); `onAnchor` positions them.
export default function Orbit({ progress, selected, onSelect, onHover, focusRing = -1, onAnchor }) {
  return (
    <LazyCanvas className="h-full w-full" camera={{ position: [0, 10, 30], fov: 38, near: 0.1, far: 140 }}>
      <color attach="background" args={["#050507"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 10]} intensity={1.6} color="#fff2dc" />
      <pointLight position={[0, 0, 0]} intensity={18} distance={16} color="#d9b874" />
      <Studio intensity={0.7} />
      <Stars />
      <Suspense fallback={null}><System progress={progress} selected={selected} onSelect={onSelect} onHover={onHover} focusRing={focusRing} onAnchor={onAnchor} /></Suspense>
      <Finish bloom={0.95} threshold={0.68} vignette={0.6}
        dof={selected || focusRing >= 0 ? null : { target: [0, 0, 0], focalLength: 0.035, bokeh: 2.6 }} />
    </LazyCanvas>
  );
}
