"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { AdditiveBlending, CanvasTexture, RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import LazyCanvas, { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useVideoTextures } from "../kit/useVideoTextures";
import { VIDEO } from "@/lib/media";
import { Roll } from "../objects/Roll";
import { PLATFORMS } from "@/lib/site";
import { MATS, U } from "@/lib/materials";

const pick = (...n) => n.map((x) => MATS.find((m) => m.name === x));
// One stretch of tunnel per platform (rolls show that platform's finishes; imagery is placeholder).
export const ZONES = [
  { platform: PLATFORMS[0].name, mats: pick("Calacatta", "Natural Oak", "Smoked Walnut", "Nero Marquina", "Raw Concrete", "Rosa Stone", "Light Oak", "Fluted Ash") },
  { platform: PLATFORMS[1].name, mats: pick("Silver Metallic", "Linear Silver", "Pearl Satin", "Brushed Steel", "Satin Aluminium", "Spun Metal") },
  { platform: PLATFORMS[2].name, mats: pick("Graphite Matte", "Nero Gloss", "Soft Grey Matte", "Forged Grey", "Pearl Satin") },
  { platform: PLATFORMS[3].name, mats: pick("Oxide", "Verdigris", "Amber Onyx", "Calacatta", "Natural Oak") },
];
const RINGS_PER_ZONE = 3, N = 8, R = 3.1, SPACING = 2.6;
const TOTAL = ZONES.length * RINGS_PER_ZONE;
export const TUNNEL_LEN = TOTAL * SPACING;
const ALL = [...new Set(ZONES.flatMap((z) => z.mats))];

let glowCache = null;
function glow() {
  if (glowCache) return glowCache;
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const x = c.getContext("2d"), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,240,210,1)"); g.addColorStop(0.3, "rgba(230,190,110,.55)"); g.addColorStop(1, "rgba(200,160,90,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  glowCache = new CanvasTexture(c);
  return glowCache;
}

// Each platform's stretch ends at a floating footage window: you arrive at it, then fly through it.
const ZONE_VIDEOS = [VIDEO.marble, VIDEO.metalLight, VIDEO.slitter, VIDEO.liquidMetal];
function ZoneScreens({ zone }) {
  const vids = useVideoTextures(ZONE_VIDEOS, zone >= 0 && zone < ZONES.length ? [zone] : []);
  const screens = useRef([]);
  useFrame((state) => {
    const cz = state.camera.position.z;
    screens.current.forEach((m, i) => {
      if (!m) return;
      const d = cz - m.position.z; // distance still to travel to the screen
      m.material.opacity = Math.max(0, Math.min(1, (d - 0.6) / 2.4)) * Math.min(1, Math.max(0, (14 - d) / 4));
      m.visible = m.material.opacity > 0.01;
    });
  });
  return ZONES.map((z, i) => (
    <mesh key={z.platform} ref={(el) => (screens.current[i] = el)} position={[0, 0, -((i + 1) * RINGS_PER_ZONE - 0.5) * SPACING]}>
      <planeGeometry args={[3.4, 1.91]} />
      <meshBasicMaterial map={vids[i]} transparent opacity={0} toneMapped={false} fog={false} />
    </mesh>
  ));
}

// The gold light at the end of the tunnel (its own component so the canvas texture is only made client-side).
function EndGlow() {
  return (
    <sprite position={[0, 0, -TUNNEL_LEN - 4]} scale={[14, 14, 1]}>
      <spriteMaterial map={glow()} transparent blending={AdditiveBlending} depthWrite={false} fog={false} />
    </sprite>
  );
}

function Rolls({ progress, selected, onSelect, onHover }) {
  const base = useTexture(ALL.map((m) => U(m.img, 800)));
  const maps = useMemo(() => new Map(ALL.map((m, i) => {
    const t = base[i].clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(3, 1); t.anisotropy = 8; t.needsUpdate = true;
    return [m.code, t];
  })), [base]);
  const rings = useRef([]), rolls = useRef({});
  const st = useRef({ hover: null, z: 6 });
  const look = useRef(new Vector3(0, 0, -5));

  const layout = useMemo(() => Array.from({ length: TOTAL }, (_, i) => {
    const zone = Math.floor(i / RINGS_PER_ZONE), mats = ZONES[zone].mats;
    return Array.from({ length: N }, (_, k) => {
      const a = (k / N) * Math.PI * 2 + (i % 2) * (Math.PI / N);
      return { key: `${i}-${k}`, zone, m: mats[(k + i) % mats.length], a, pos: [Math.cos(a) * R, Math.sin(a) * R, 0], rotZ: a + Math.PI / 2 };
    });
  }), []);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  useFrame((state, dt) => {
    const s = st.current, cam = state.camera, p = Math.min(1, Math.max(0, progress.get()));
    const targetZ = 7 - p * (TUNNEL_LEN + 2);
    const k = 1 - Math.exp(-dt * 3);
    s.z += (targetZ - s.z) * k;
    cam.position.set(state.pointer.x * 0.6 + Math.sin(state.clock.elapsedTime * 0.3) * 0.15, state.pointer.y * 0.4, s.z);
    look.current.lerp(new Vector3(state.pointer.x * 0.8, state.pointer.y * 0.5, s.z - 8), k);
    cam.lookAt(look.current);
    rings.current.forEach((g, i) => { if (g) g.rotation.z += dt * 0.06 * (i % 2 ? 1 : -1); });
    const kh = 1 - Math.exp(-dt * 8);
    layout.flat().forEach((c) => {
      const g = rolls.current[c.key];
      if (!g) return;
      const on = s.hover === c.key || selected?.key === c.key;
      const sc = on ? 1.14 : 1;
      g.scale.setScalar(g.scale.x + (sc - g.scale.x) * kh);
      if (selected?.key === c.key) g.children[0].rotation.y += dt * 6; // spins as it "unrolls"
    });
  });

  return (
    <>
      {layout.map((ring, i) => (
        <group key={i} position={[0, 0, -i * SPACING]} ref={(el) => (rings.current[i] = el)}>
          {ring.map((c) => (
            <Roll key={c.key} ref={(el) => (rolls.current[c.key] = el)} lite map={maps.get(c.m.code)} radius={0.42} length={2.25}
              position={c.pos} rotation={[0, 0, c.rotZ]}
              onPointerOver={(e) => { e.stopPropagation(); st.current.hover = c.key; onHover({ ...c.m, platform: ZONES[c.zone].platform }); document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { if (st.current.hover === c.key) { st.current.hover = null; onHover(null); } document.body.style.cursor = ""; }}
              onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onSelect({ key: c.key, ...c.m, platform: ZONES[c.zone].platform }); }} />
          ))}
        </group>
      ))}
    </>
  );
}

// A tunnel built from rolls of film; scroll to travel through it, click a roll to unroll it.
export default function Tunnel({ progress, selected, onSelect, onHover, zone = -1 }) {
  return (
    <LazyCanvas className="h-full w-full" camera={{ position: [0, 0, 7], fov: 62, near: 0.1, far: 60 }}>
      <color attach="background" args={["#0b0907"]} />
      <fog attach="fog" args={["#0b0907", 6, 26]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 4]} intensity={30} distance={14} color="#fff1da" />
      <pointLight position={[0, 0, -TUNNEL_LEN - 2]} intensity={120} distance={30} color="#e6c27a" />
      <Studio intensity={0.6} />
      <EndGlow />
      <ZoneScreens zone={zone} />
      <Suspense fallback={null}><Rolls progress={progress} selected={selected} onSelect={onSelect} onHover={onHover} /></Suspense>
      <Finish bloom={1.1} threshold={0.7} vignette={0.65} />
    </LazyCanvas>
  );
}
