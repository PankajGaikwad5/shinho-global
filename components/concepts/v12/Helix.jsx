"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import LazyCanvas, { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useCanvasDrag } from "../kit/useCanvasDrag";
import { Chip, useChipTextures } from "../objects/Chip";
import { PLATFORMS } from "@/lib/site";
import { MATS } from "@/lib/materials";
import { LOGO } from "@/lib/themes";

const pick = (...n) => n.map((x) => MATS.find((m) => m.name === x));
// One full turn of the helix per platform (placeholder imagery).
export const TURNS = [
  { platform: PLATFORMS[0].name, mats: pick("Calacatta", "Natural Oak", "Smoked Walnut", "Nero Marquina", "Raw Concrete", "Rosa Stone", "Light Oak", "Fluted Ash") },
  { platform: PLATFORMS[1].name, mats: pick("Silver Metallic", "Linear Silver", "Pearl Satin", "Brushed Steel", "Satin Aluminium", "Spun Metal") },
  { platform: PLATFORMS[2].name, mats: pick("Graphite Matte", "Nero Gloss", "Soft Grey Matte", "Forged Grey", "Pearl Satin") },
  { platform: PLATFORMS[3].name, mats: pick("Oxide", "Verdigris", "Amber Onyx", "Calacatta", "Natural Oak") },
];
const PER_TURN = 9, RADIUS = 2.3, PITCH = 5.2; // chips per strand per turn, helix radius, height per turn
export const HELIX_H = TURNS.length * PITCH;
const ALL = [...new Set(TURNS.flatMap((t) => t.mats))];

function Strands({ progress, onHover, onSelect, selectedKey }) {
  const textures = useChipTextures(ALL);
  const texOf = useMemo(() => new Map(ALL.map((m, i) => [m.code, textures[i]])), [textures]);
  const drag = useCanvasDrag();
  const root = useRef(null), chips = useRef({});
  const st = useRef({ spin: 0, v: 0, hover: null, y: HELIX_H / 2 });
  const look = useRef(new Vector3());

  const items = useMemo(() => {
    const out = [];
    TURNS.forEach((t, ti) => {
      for (let k = 0; k < PER_TURN; k++) {
        const u = ti + k / PER_TURN, y = HELIX_H / 2 - u * PITCH, a = u * Math.PI * 2;
        [0, Math.PI].forEach((off, s) => {
          const aa = a + off, m = t.mats[(k + s * 3) % t.mats.length];
          out.push({ key: `${ti}-${k}-${s}`, turn: ti, m, a: aa, pos: [Math.cos(aa) * RADIUS, y, Math.sin(aa) * RADIUS], rotY: Math.PI / 2 - aa });
        });
      }
    });
    return out;
  }, []);
  const rungs = useMemo(() => items.filter((_, i) => i % 2 === 0).map((c) => ({ key: c.key, y: c.pos[1], a: c.a })), [items]);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  useFrame((state, dt) => {
    const s = st.current, d = drag.take(), cam = state.camera;
    const p = Math.min(1, Math.max(0, progress.get()));
    if (d.down) s.v = d.dx * 0.004; else s.v *= 0.93;
    s.spin += s.v;
    root.current.rotation.y = s.spin - p * Math.PI * 2 * TURNS.length * 0.9; // the helix turns as you descend
    const ty = HELIX_H / 2 + 1.5 - p * (HELIX_H + 1);
    const k = 1 - Math.exp(-dt * 3);
    s.y += (ty - s.y) * k;
    cam.position.lerp(new Vector3(state.pointer.x * 0.8, s.y + 1.2 + state.pointer.y * 0.4, 8.2), k);
    look.current.lerp(new Vector3(0, s.y - 0.4, 0), k);
    cam.lookAt(look.current);
    const kh = 1 - Math.exp(-dt * 8);
    items.forEach((c) => {
      const m = chips.current[c.key];
      if (!m) return;
      const on = s.hover === c.key || selectedKey === c.key, lift = on ? 0.55 : 0;
      m.position.x += (Math.cos(c.a) * (RADIUS + lift) - m.position.x) * kh;
      m.position.z += (Math.sin(c.a) * (RADIUS + lift) - m.position.z) * kh;
      const sc = (on ? 1.18 : 1) * 0.72;
      m.scale.setScalar(m.scale.x + (sc - m.scale.x) * kh);
    });
  });

  return (
    <group ref={root}>
      {/* gold rungs between the two strands */}
      {rungs.map((r) => {
        return (
          <mesh key={r.key} position={[0, r.y, 0]} rotation={[0, -r.a, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, RADIUS * 2 - 0.9, 8]} />
            <meshStandardMaterial color={LOGO.gold} metalness={0.9} roughness={0.25} />
          </mesh>
        );
      })}
      {items.map((c) => (
        <Chip key={c.key} ref={(el) => (chips.current[c.key] = el)} map={texOf.get(c.m.code)} position={c.pos} rotation={[0, c.rotY, 0]} scale={0.72}
          onPointerOver={(e) => { e.stopPropagation(); st.current.hover = c.key; onHover({ ...c.m, platform: TURNS[c.turn].platform }); document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { if (st.current.hover === c.key) { st.current.hover = null; onHover(null); } document.body.style.cursor = ""; }}
          onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onSelect({ key: c.key, ...c.m, platform: TURNS[c.turn].platform }); }} />
      ))}
    </group>
  );
}

// A double helix of sample chips you descend by scrolling.
export default function Helix({ progress, onHover, onSelect, selectedKey }) {
  return (
    <LazyCanvas className="h-full w-full" camera={{ position: [0, HELIX_H / 2 + 2, 8.2], fov: 40, near: 0.1, far: 80 }}>
      <color attach="background" args={["#f2efe8"]} />
      <fog attach="fog" args={["#f2efe8", 9, 22]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 10, 6]} intensity={1.3} color="#fffaf0" />
      <Studio intensity={0.8} />
      <Suspense fallback={null}><Strands progress={progress} onHover={onHover} onSelect={onSelect} selectedKey={selectedKey} /></Suspense>
      <Finish bloom={0.25} threshold={0.95} vignette={0.25} grain={0.025} />
    </LazyCanvas>
  );
}
