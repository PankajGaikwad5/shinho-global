"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { keyAt, storyAt } from "../story/story";
import { MATS, U } from "@/lib/materials";
import { LOGO } from "@/lib/themes";

// V12 "Showroom Walk" (components/concepts/v15/WalkScene.jsx), cut to a short Applications section for the
// architectural-film page — brief point 7. V15's room builds, materials, lighting, fog, camera keyframes and
// interaction are unchanged. What was taken out, and only this:
//   · the foyer and its logo plaque, the finale and the enquiry room — three rooms, as "a small selection".
//   · both video walls. The finale wall played partner-facility footage; no approved process footage exists,
//     so nothing here may stand in for our manufacturing.
//   · the retail lightbox and shelving in V15's room 04, which read as a shop rather than an interior.
// The rooms keep V15's z positions (-10, -20, -30), so POS/LOOK below are V15's own keyframes for its
// rooms 1-3, verbatim, and the walk still alternates left, right, left.
const pick = (...n) => n.map((x) => MATS.find((m) => m.name === x));
export const ROOM_FINISHES = [
  pick("Natural Oak", "Smoked Walnut", "Light Oak", "Fluted Ash"),   // wood
  pick("Calacatta", "Nero Marquina", "Rosa Stone", "Raw Concrete"),  // stone and mineral
];
const ALL = [...new Set(ROOM_FINISHES.flat())];

const WALL = "#e7e1d6", FLOOR = "#d8d0c2", TRIM = LOGO.gold;
const ROOM = 10; // depth of each room; room k is centred at z = -k * ROOM
// Three rooms, which is "a small selection" and is also what makes it a walk: a transition takes one
// screen of scroll, so n rooms give n-1 moves. Two rooms is a single move with a hold either side, and
// reads as a still picture you scroll past. See the length note in LayerScene.jsx — the same arithmetic
// governs this section.
const POS = [[1.4, 1.65, -6.5], [-1.2, 1.65, -16.5], [1.2, 1.65, -26.5]];
const LOOK = [[-2.6, 1.4, -11], [2.6, 1.5, -21], [-2.4, 1.3, -31.5]];
export const START = POS[0];

// A surface finished in one of a set of films; click cycles the finish, hover gives a gold edge glow.
function FinishSurface({ finishes, maps, size, onChange, ...props }) {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => () => { document.body.style.cursor = ""; }, []);
  const m = finishes[i];
  return (
    <mesh {...props}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
      onClick={(e) => { e.stopPropagation(); const n = (i + 1) % finishes.length; setI(n); onChange?.(finishes[n]); }}>
      <planeGeometry args={size} />
      <meshPhysicalMaterial map={maps.get(`${m.code}-${size[0]}x${size[1]}`)} roughness={0.42} clearcoat={0.35} emissive={TRIM} emissiveIntensity={hover ? 0.12 : 0} />
    </mesh>
  );
}

function Room({ z, children, doorBack = true }) {
  const wall = <meshStandardMaterial color={WALL} roughness={0.92} />;
  return (
    <group position={[0, 0, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[9, ROOM]} /><meshStandardMaterial color={FLOOR} roughness={0.7} /></mesh>
      <mesh position={[-4.5, 1.9, 0]}><boxGeometry args={[0.2, 3.8, ROOM]} />{wall}</mesh>
      <mesh position={[4.5, 1.9, 0]}><boxGeometry args={[0.2, 3.8, ROOM]} />{wall}</mesh>
      {doorBack ? <>
        <mesh position={[-2.9, 1.9, -ROOM / 2]}><boxGeometry args={[3.2, 3.8, 0.2]} />{wall}</mesh>
        <mesh position={[2.9, 1.9, -ROOM / 2]}><boxGeometry args={[3.2, 3.8, 0.2]} />{wall}</mesh>
        <mesh position={[0, 3.35, -ROOM / 2]}><boxGeometry args={[2.6, 0.9, 0.2]} />{wall}</mesh>
        <mesh position={[0, 2.88, -ROOM / 2 + 0.11]}><boxGeometry args={[2.6, 0.03, 0.02]} /><meshStandardMaterial color={TRIM} metalness={0.9} roughness={0.25} /></mesh>
      </> : (
        /* The walk ends here, so the last room is closed. V15 filled this wall with partner-facility
           footage; without approved footage the room simply has a wall, in the same material as the rest. */
        <mesh position={[0, 1.9, -ROOM / 2]}><boxGeometry args={[9, 3.8, 0.2]} />{wall}</mesh>
      )}
      {/* baseboards ground the walls */}
      {[-4.38, 4.38].map((x) => <mesh key={x} position={[x, 0.06, 0]}><boxGeometry args={[0.04, 0.12, ROOM]} /><meshStandardMaterial color="#bdb4a5" /></mesh>)}
      {children}
    </group>
  );
}

function Showroom({ onFinish }) {
  const base = useTexture(ALL.map((m) => U(m.img, 1200)));
  // one texture per (finish × surface size), cover-fitted to the surface
  const SIZES = [[9.6, 3.4], [2.2, 0.8], [3, 2.4], [1.8, 2.8], [1.1, 1.6]];
  const maps = useMemo(() => {
    const out = new Map();
    ALL.forEach((m, i) => SIZES.forEach(([w, h]) => {
      const t = base[i].clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = 8;
      const a = t.image.width / t.image.height, pa = w / h;
      if (pa > a) t.repeat.set(1, a / pa); else t.repeat.set(pa / a, 1);
      t.offset.set((1 - t.repeat.x) / 2, (1 - t.repeat.y) / 2); t.needsUpdate = true;
      out.set(`${m.code}-${w}x${h}`, t);
    }));
    return out;
  }, [base]); // eslint-disable-line react-hooks/exhaustive-deps
  const S = (k, size, props) => <FinishSurface finishes={ROOM_FINISHES[k]} maps={maps} size={size} onChange={onFinish} {...props} />;

  return (
    <group>
      {/* 01 Hospitality — V15 room 01: clad wall, stone feature wall, credenza */}
      <Room z={-ROOM}>
        {S(0, [9.6, 3.4], { position: [-4.38, 1.9, 0], rotation: [0, Math.PI / 2, 0] })}
        {S(1, [3, 2.4], { position: [2.9, 1.6, -4.88] })}
        <group position={[-2.6, 0, -3.2]}>
          <RoundedBox args={[2.4, 0.8, 0.6]} radius={0.02} position={[0, 0.4, 0]}><meshStandardMaterial color="#5a4632" roughness={0.6} /></RoundedBox>
          {S(0, [2.2, 0.8], { position: [0, 0.42, 0.31] })}
        </group>
      </Room>
      {/* 02 Workplace — V15 room 04's run of upright panels, as doors and partitions */}
      <Room z={-2 * ROOM}>
        {[-3.2, -1.6, 0, 1.6, 3.2].map((zz) => (
          <group key={zz} position={[4.2, 1.5, zz]} rotation={[0, -Math.PI / 2, 0]}>
            {S(1, [1.1, 1.6], { position: [0, 0, 0] })}
          </group>
        ))}
      </Room>
      {/* 03 Residential — V15 room 03: tall cabinetry and island. The walk ends here, so the room is
          closed rather than opening on a doorway to nothing. */}
      <Room z={-3 * ROOM} doorBack={false}>
        <group position={[-4.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {[-3, -1, 1, 3].map((x) => (
            <group key={x} position={[x, 1.45, 0.05]}>
              {S(0, [1.8, 2.8], { position: [0, 0, 0] })}
              <mesh position={[0.78, 0, 0.03]}><boxGeometry args={[0.02, 0.5, 0.03]} /><meshStandardMaterial color={TRIM} metalness={0.95} roughness={0.2} /></mesh>
            </group>
          ))}
        </group>
        <RoundedBox args={[2.6, 0.92, 1.0]} radius={0.03} position={[1, 0.46, -1]}><meshStandardMaterial color="#1d1d20" roughness={0.3} /></RoundedBox>
        <mesh position={[1, 0.95, -1]}><boxGeometry args={[2.7, 0.05, 1.1]} /><meshStandardMaterial color="#f4f1ea" roughness={0.25} /></mesh>
      </Room>
    </group>
  );
}

function Camera({ st }) {
  const look = useMemo(() => new Vector3(...LOOK[0]), []);
  useFrame((state, dt) => {
    const { f } = st.current, k = 1 - Math.exp(-dt * 2.6), t = state.clock.elapsedTime, cam = state.camera;
    const p = keyAt(POS, f), l = keyAt(LOOK, f);
    cam.position.lerp(new Vector3(p[0] + state.pointer.x * 0.35 + Math.sin(t * 0.4) * 0.05, p[1] + Math.sin(t * 0.9) * 0.015 + state.pointer.y * 0.12, p[2]), k);
    look.lerp(new Vector3(l[0] + state.pointer.x * 0.6, l[1] + state.pointer.y * 0.3, l[2]), k);
    cam.lookAt(look);
  });
  return null;
}

// A short walk through three interiors finished in these films.
export default function ShowroomScene({ progress, bounds, onFinish }) {
  const st = useRef({ i: 0, t: 0, u: 0, f: 0 });
  useFrame(() => { st.current = storyAt(Math.min(1, Math.max(0, progress.get())), bounds); });
  return (
    <>
      <color attach="background" args={["#ece6dc"]} />
      <fog attach="fog" args={["#ece6dc", 9, 26]} />
      <hemisphereLight args={["#fffaf0", "#cfc4b2", 0.9]} />
      <directionalLight position={[3, 8, 4]} intensity={1.1} color="#fff6e8" />
      <Studio intensity={0.7} />
      <Camera st={st} />
      <Suspense fallback={null}><Showroom onFinish={onFinish} /></Suspense>
      <Finish bloom={0.35} threshold={0.92} vignette={0.3} grain={0.025} />
    </>
  );
}
