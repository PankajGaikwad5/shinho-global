"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useVideoTextures } from "../kit/useVideoTextures";
import { keyAt, storyAt } from "../story/story";
import { MATS, U } from "@/lib/materials";
import { VIDEO } from "@/lib/media";
import { LOGO } from "@/lib/themes";

const pick = (...n) => n.map((x) => MATS.find((m) => m.name === x));
export const ROOM_FINISHES = [
  pick("Natural Oak", "Smoked Walnut", "Light Oak", "Fluted Ash"),   // 01 Decorative PVC — wood
  pick("Calacatta", "Nero Marquina", "Rosa Stone", "Raw Concrete"),  // 01 — stone
  pick("Brushed Steel", "Satin Aluminium", "Linear Silver", "Spun Metal"), // 02 PET/PP — metallic
  pick("Nero Gloss", "Graphite Matte", "Pearl Satin", "Soft Grey Matte"),  // 03 Top-layer — fronts
  pick("Oxide", "Verdigris", "Amber Onyx", "Forged Grey"),           // 04 Self-adhesive — retail
];
const ALL = [...new Set(ROOM_FINISHES.flat())];

const WALL = "#e7e1d6", FLOOR = "#d8d0c2", TRIM = LOGO.gold;
const ROOM = 10; // depth of each room; room k is centred at z = -k * ROOM
// Camera keyframes per chapter: foyer, 4 rooms, finale, enquiry.
const POS = [[0.6, 1.7, 7], [1.4, 1.65, -6.5], [-1.2, 1.65, -16.5], [1.2, 1.65, -26.5], [-1.0, 1.65, -36.5], [0, 1.9, -43.5], [1.6, 2.1, -42.5]];
const LOOK = [[0, 1.75, 0], [-2.6, 1.4, -11], [2.6, 1.5, -21], [-2.4, 1.3, -31.5], [2.4, 1.4, -41], [0, 2.4, -52], [0, 2.2, -52]];

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
      {doorBack && <>
        <mesh position={[-2.9, 1.9, -ROOM / 2]}><boxGeometry args={[3.2, 3.8, 0.2]} />{wall}</mesh>
        <mesh position={[2.9, 1.9, -ROOM / 2]}><boxGeometry args={[3.2, 3.8, 0.2]} />{wall}</mesh>
        <mesh position={[0, 3.35, -ROOM / 2]}><boxGeometry args={[2.6, 0.9, 0.2]} />{wall}</mesh>
        <mesh position={[0, 2.88, -ROOM / 2 + 0.11]}><boxGeometry args={[2.6, 0.03, 0.02]} /><meshStandardMaterial color={TRIM} metalness={0.9} roughness={0.25} /></mesh>
      </>}
      {/* baseboards ground the walls */}
      {[-4.38, 4.38].map((x) => <mesh key={x} position={[x, 0.06, 0]}><boxGeometry args={[0.04, 0.12, ROOM]} /><meshStandardMaterial color="#bdb4a5" /></mesh>)}
      {children}
    </group>
  );
}

function Plaque() {
  const base = useTexture("/logo.svg");
  const logo = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; }, [base]);
  return (
    <group position={[0, 1.8, -4.85]}>
      <mesh position={[0, 0, -0.03]}><boxGeometry args={[3.3, 1.7, 0.05]} /><meshStandardMaterial color={TRIM} metalness={0.95} roughness={0.25} /></mesh>
      <mesh><planeGeometry args={[3.1, 1.5]} /><meshStandardMaterial color="#f6f3ee" roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.01]}><planeGeometry args={[2.4, 1.07]} /><meshBasicMaterial map={logo} transparent toneMapped={false} /></mesh>
    </group>
  );
}

function Showroom({ videos, onFinish }) {
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
      {/* foyer */}
      <Room z={0}>
        <Plaque />
      </Room>
      {/* Room 01 — Decorative PVC: oak-clad wall, marble back wall, walnut credenza */}
      <Room z={-ROOM}>
        {S(0, [9.6, 3.4], { position: [-4.38, 1.9, 0], rotation: [0, Math.PI / 2, 0] })}
        {S(1, [3, 2.4], { position: [2.9, 1.6, -4.88] })}
        <group position={[-2.6, 0, -3.2]}>
          <RoundedBox args={[2.4, 0.8, 0.6]} radius={0.02} position={[0, 0.4, 0]}><meshStandardMaterial color="#5a4632" roughness={0.6} /></RoundedBox>
          {S(0, [2.2, 0.8], { position: [0, 0.42, 0.31] })}
        </group>
      </Room>
      {/* Room 02 — PET / PP / Co-PET: metallic wall + printable media (video) wall */}
      <Room z={-2 * ROOM}>
        {S(2, [9.6, 3.4], { position: [4.38, 1.9, 0], rotation: [0, -Math.PI / 2, 0] })}
        <mesh position={[-2.9, 1.7, -4.88]}><planeGeometry args={[2.9, 1.63]} /><meshBasicMaterial map={videos[0]} toneMapped={false} /></mesh>
        <mesh position={[-1.2, 1.4, -1]}><cylinderGeometry args={[0.32, 0.32, 2.8, 40]} /><meshStandardMaterial color="#cfccc6" metalness={1} roughness={0.18} /></mesh>
      </Room>
      {/* Room 03 — Top-layer films: tall cabinetry + island */}
      <Room z={-3 * ROOM}>
        <group position={[-4.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {[-3, -1, 1, 3].map((x) => (
            <group key={x} position={[x, 1.45, 0.05]}>
              {S(3, [1.8, 2.8], { position: [0, 0, 0] })}
              <mesh position={[0.78, 0, 0.03]}><boxGeometry args={[0.02, 0.5, 0.03]} /><meshStandardMaterial color={TRIM} metalness={0.95} roughness={0.2} /></mesh>
            </group>
          ))}
        </group>
        <RoundedBox args={[2.6, 0.92, 1.0]} radius={0.03} position={[1, 0.46, -1]}><meshStandardMaterial color="#1d1d20" roughness={0.3} /></RoundedBox>
        <mesh position={[1, 0.95, -1]}><boxGeometry args={[2.7, 0.05, 1.1]} /><meshStandardMaterial color="#f4f1ea" roughness={0.25} /></mesh>
      </Room>
      {/* Room 04 — Finished self-adhesive films: retail display */}
      <Room z={-4 * ROOM}>
        {[-3.2, -1.6, 0, 1.6, 3.2].map((zz) => (
          <group key={zz} position={[4.2, 1.5, zz]} rotation={[0, -Math.PI / 2, 0]}>
            {S(4, [1.1, 1.6], { position: [0, 0, 0] })}
          </group>
        ))}
        <mesh position={[-2.9, 2.6, -4.86]}><planeGeometry args={[2.8, 0.7]} /><meshStandardMaterial color="#f6f3ee" emissive="#fff3dc" emissiveIntensity={0.9} /></mesh>
        <mesh position={[-2.9, 2.6, -4.84]}><planeGeometry args={[2.6, 0.05]} /><meshBasicMaterial color={TRIM} /></mesh>
        {[0.6, 1.2].map((y) => <mesh key={y} position={[-2.9, y, -4.6]}><boxGeometry args={[2.6, 0.04, 0.4]} /><meshStandardMaterial color="#cfc6b6" /></mesh>)}
      </Room>
      {/* finale: partner facility video wall */}
      <Room z={-5 * ROOM} doorBack={false}>
        <mesh position={[0, 2.1, -4.9]}><planeGeometry args={[8.4, 3.6]} /><meshBasicMaterial map={videos[1]} toneMapped={false} /></mesh>
        <mesh position={[0, 2.1, -4.95]}><boxGeometry args={[8.7, 3.9, 0.05]} /><meshStandardMaterial color="#1a1916" /></mesh>
      </Room>
    </group>
  );
}

function Camera({ st }) {
  const look = useRef(new Vector3(...LOOK[0]));
  useFrame((state, dt) => {
    const { f } = st.current, k = 1 - Math.exp(-dt * 2.6), t = state.clock.elapsedTime, cam = state.camera;
    const p = keyAt(POS, f), l = keyAt(LOOK, f);
    cam.position.lerp(new Vector3(p[0] + state.pointer.x * 0.35 + Math.sin(t * 0.4) * 0.05, p[1] + Math.sin(t * 0.9) * 0.015 + state.pointer.y * 0.12, p[2]), k);
    look.current.lerp(new Vector3(l[0] + state.pointer.x * 0.6, l[1] + state.pointer.y * 0.3, l[2]), k);
    cam.lookAt(look.current);
  });
  return null;
}

// A walk through a showroom built from the films: one room per platform, surfaces you can re-finish.
export default function WalkScene({ progress, bounds, chapter, onFinish }) {
  const st = useRef({ i: 0, t: 0, u: 0, f: 0 });
  useFrame(() => { st.current = storyAt(Math.min(1, Math.max(0, progress.get())), bounds); });
  const medias = useMemo(() => [VIDEO.metalLight, VIDEO.factoryAerial], []);
  const videos = useVideoTextures(medias, [chapter >= 1 && chapter <= 3 ? 0 : -1, chapter >= 4 ? 1 : -1].filter((x) => x >= 0));
  return (
    <>
      <color attach="background" args={["#ece6dc"]} />
      <fog attach="fog" args={["#ece6dc", 9, 26]} />
      <hemisphereLight args={["#fffaf0", "#cfc4b2", 0.9]} />
      <directionalLight position={[3, 8, 4]} intensity={1.1} color="#fff6e8" />
      <Studio intensity={0.7} />
      <Camera st={st} />
      <Suspense fallback={null}><Showroom videos={videos} onFinish={onFinish} /></Suspense>
      <Finish bloom={0.35} threshold={0.92} vignette={0.3} grain={0.025} />
    </>
  );
}
