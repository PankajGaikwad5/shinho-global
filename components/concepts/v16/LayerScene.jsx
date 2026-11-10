"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import Anchor from "../kit/Anchor";
import { SRGBColorSpace, Vector3 } from "three";
import { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useVideoTextures } from "../kit/useVideoTextures";
import { Chip, useChipTextures } from "../objects/Chip";
import { keyAt, presence, smooth, storyAt } from "../story/story";
import { FINISHES } from "@/lib/site";
import { MATS, U } from "@/lib/materials";
import { VIDEO } from "@/lib/media";

const W = 3.2, H = 2.1;
// Illustrative construction, top → base is reversed here (index 0 = base). PLACEHOLDER — confirm with the partner.
export const LAYERS = ["Substrate", "Adhesive system", "Décor film", "Protective top layer"];
const THICK = [0.14, 0.03, 0.03, 0.025];
const POS = [[0, 0.4, 6.6], [3.4, 1.7, 5.2], [3.4, 0.5, -0.4], [2.8, 0.8, 0.6], [1.9, 1.5, 2.9], [-1.9, 1.3, 3.8], [0, 0.6, 11.5], [0, 0.6, 13.5], [-3.2, 0.9, 12.5]];
const LOOK = [[0, 0, 0], [0, 0, 0.4], [0, 0, -1.05], [0, 0, -0.35], [0, 0, 0.35], [0, 0, 1.05], [0, 0, 0], [0, 0.4, -4], [0, 0.4, -4]];

// The 12 finish technologies as chips (name = finish, swatch = representative material; placeholder imagery).
const FINISH_CHIPS = FINISHES.map((f) => { const m = MATS.find((x) => f.img.includes(x.img)); return { name: f.name, code: m.code, img: m.img }; });

function Panel({ st, decorUrl, gloss, onAnchor }) {
  const base = useTexture(decorUrl);
  const decor = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; }, [base]);
  const g = useRef(null), layers = useRef([]), top = useRef(null), glue = useRef(null);
  useFrame((state) => {
    const { i, t, f } = st.current, time = state.clock.elapsedTime;
    const explode = i === 0 ? 0 : i === 1 ? smooth(t * 1.3) : i <= 5 ? 1 : 1 - smooth(t * 1.6);
    const shrink = i < 6 ? 1 : 1 - smooth(t * 1.4) * 0.92;
    g.current.visible = f < 6.9;
    g.current.scale.setScalar(shrink);
    g.current.rotation.y = i === 0 ? Math.sin(time * 0.4) * 0.35 : g.current.rotation.y * 0.95;
    g.current.rotation.x = i === 0 ? -0.1 + Math.sin(time * 0.3) * 0.06 : -0.05;
    layers.current.forEach((m, k) => { if (m) m.position.z = (k - 1.5) * (0.07 + explode * 0.63); });
    glue.current.emissiveIntensity = i === 3 ? 0.5 + Math.sin(time * 3) * 0.25 : 0.08;
    top.current.roughness = 0.04 + (1 - gloss) * 0.6;
    top.current.clearcoat = gloss;
    top.current.clearcoatRoughness = 0.05 + (1 - gloss) * 0.5;
  });
  return (
    <group ref={g}>
      {LAYERS.map((name, k) => (
        <group key={name} ref={(el) => (layers.current[k] = el)}>
          <RoundedBox args={[W, H, THICK[k]]} radius={Math.min(0.02, THICK[k] / 2.2)} smoothness={3} castShadow>
            {k === 0 && <meshStandardMaterial color="#8b8680" roughness={0.85} />}
            {k === 1 && <meshPhysicalMaterial ref={glue} color="#d9b46a" emissive="#c9952f" transparent opacity={0.55} roughness={0.3} />}
            {k === 2 && <meshStandardMaterial map={decor} roughness={0.55} />}
            {k === 3 && <meshPhysicalMaterial ref={top} color="#ffffff" transparent opacity={0.28} roughness={0.1} clearcoat={1} />}
          </RoundedBox>
          <Anchor index={k} position={[W / 2 + 0.15, H / 2 - 0.15, 0]} onFrame={onAnchor} />
        </group>
      ))}
    </group>
  );
}

function ChipWall({ st, video }) {
  const tex = useChipTextures(FINISH_CHIPS);
  const chips = useRef([]), screen = useRef(null);
  const grid = useMemo(() => Array.from({ length: 24 }, (_, k) => { const c = k % 6, r = Math.floor(k / 6); return { x: (c - 2.5) * 1.22, y: (1.5 - r) * 1.62, m: k % FINISH_CHIPS.length }; }), []);
  useFrame((state, dt) => {
    const { i, t, f } = st.current, time = state.clock.elapsedTime;
    const appear = i < 6 ? 0 : i === 6 ? smooth(t * 1.5 - 0.3) : 1;
    const part = i < 7 ? 0 : i === 7 ? smooth(t * 1.4) : 1; // the wall parts to reveal the facility
    chips.current.forEach((m, k) => {
      if (!m) return;
      const c = grid[k], dir = Math.sign(c.x || 1);
      m.visible = appear > 0.01;
      m.position.set(c.x + dir * part * (3.2 + Math.abs(c.x) * 0.6), c.y + Math.sin(time * 0.6 + k) * 0.03, -Math.abs(c.x) * 0.12 - part * 1.2);
      m.rotation.y = -dir * part * 0.6 + Math.sin(time * 0.4 + k) * 0.05;
      m.scale.setScalar(appear * 0.95);
    });
    screen.current.material.opacity = presence(f, 7.5, 1.2);
  });
  return (
    <group>
      {grid.map((c, k) => <Chip key={k} ref={(el) => (chips.current[k] = el)} map={tex[c.m]} />)}
      <mesh ref={screen} position={[0, 0.4, -4]}><planeGeometry args={[12, 6.75]} /><meshBasicMaterial map={video} transparent opacity={0} toneMapped={false} /></mesh>
    </group>
  );
}

function SubstrateScreen({ st, video }) {
  const m = useRef(null);
  useFrame(() => { m.current.material.opacity = presence(st.current.f, 2, 0.8); });
  return <mesh ref={m} position={[1.4, 1.5, -2.6]} rotation={[0, 0.9, 0]}><planeGeometry args={[2.4, 1.35]} /><meshBasicMaterial map={video} transparent opacity={0} toneMapped={false} /></mesh>;
}

function Camera({ st }) {
  const look = useRef(new Vector3(...LOOK[0]));
  useFrame((state, dt) => {
    const { f } = st.current, k = 1 - Math.exp(-dt * 3), cam = state.camera, time = state.clock.elapsedTime;
    const p = keyAt(POS, f), l = keyAt(LOOK, f);
    cam.position.lerp(new Vector3(p[0] + state.pointer.x * 0.3 + Math.sin(time * 0.3) * 0.08, p[1] + state.pointer.y * 0.2, p[2]), k);
    look.current.lerp(new Vector3(...l), k);
    cam.lookAt(look.current);
  });
  return null;
}

// A surface, taken apart and put back together — then multiplied into the collection.
// Layer labels are rendered by the page (see Anchor); `onAnchor` positions them.
export default function LayerScene({ progress, bounds, chapter, decorUrl, gloss, onAnchor }) {
  const st = useRef({ i: 0, t: 0, u: 0, f: 0 });
  useFrame(() => { st.current = storyAt(Math.min(1, Math.max(0, progress.get())), bounds); });
  const medias = useMemo(() => [VIDEO.workshop, VIDEO.factoryAerial], []);
  const videos = useVideoTextures(medias, [chapter >= 1 && chapter <= 3 ? 0 : -1, chapter >= 6 ? 1 : -1].filter((x) => x >= 0));
  return (
    <>
      <color attach="background" args={["#141416"]} />
      <fog attach="fog" args={["#141416", 12, 30]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 5]} intensity={1.7} color="#fff4e4" />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#c4a465" />
      <Studio intensity={0.9} />
      <Camera st={st} />
      <Suspense fallback={null}>
        <Panel st={st} decorUrl={decorUrl} gloss={gloss} onAnchor={onAnchor} />
        <ChipWall st={st} video={videos[1]} />
      </Suspense>
      <SubstrateScreen st={st} video={videos[0]} />
      <Finish bloom={0.7} threshold={0.8} vignette={0.6} />
    </>
  );
}

export const decorChoices = ["Natural Oak", "Calacatta", "Nero Marquina", "Brushed Steel", "Verdigris", "Smoked Walnut"].map((n) => MATS.find((m) => m.name === n));
export const decorUrlOf = (m) => U(m.img, 1400);
