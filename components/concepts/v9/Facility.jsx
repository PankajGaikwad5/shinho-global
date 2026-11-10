"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, useEnvironment, useTexture } from "@react-three/drei";
import Anchor from "../kit/Anchor";
import { GroundedSkybox } from "three/examples/jsm/objects/GroundedSkybox.js";
import { CatmullRomCurve3, Object3D, RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import LazyCanvas from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useCanvasDrag } from "../kit/useCanvasDrag";
import { useVideoTextures } from "../kit/useVideoTextures";
import { LOGO } from "@/lib/themes";

// ---- palette (industrial, with brand gold accents) ----
const STEEL = "#c4c1bb", DARKSTEEL = "#4a4a4c", PAINT = "#2e3236", SAFETY = "#d4a62a";
const PH = "/assets/polyhaven"; // CC0 assets from Poly Haven (see LICENSE.txt there)

// Station anchors (hotspots float above these).
export const STATIONS_POS = [[-9.6, 4.6, -4], [-2.2, 2.6, -1], [4.8, 3.0, -1], [7.6, 2.6, -1], [8.6, 2.2, 4.2]];

const steel = <meshStandardMaterial color={STEEL} metalness={0.9} roughness={0.26} />;
const paint = <meshStandardMaterial color={PAINT} metalness={0.3} roughness={0.55} />;

// Many copies of one shape, positioned once (cheap on slower machines).
function Instances({ count, geometry, material, transforms, cast = true }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const o = new Object3D();
    transforms.forEach(([p, r = [0, 0, 0], s = [1, 1, 1]], i) => {
      o.position.set(...p); o.rotation.set(...r); o.scale.set(...s); o.updateMatrix();
      ref.current.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);
  return <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow={cast} receiveShadow>{geometry}{material}</instancedMesh>;
}

// The photographed machine-shop hall: lighting/reflections + a ground-projected backdrop.
// (drei's <Environment ground> uses a three-stdlib shader that no longer compiles on this three.js version —
//  "Can not resolve #include <cube_uv_reflection_fragment>" — so we use three's own GroundedSkybox.)
const HALL_HEIGHT = 3.2, HALL_RADIUS = 38;
function Hall() {
  const env = useEnvironment({ files: `${PH}/machine_shop_02_2k.hdr` });
  const sky = useMemo(() => { const g = new GroundedSkybox(env, HALL_HEIGHT, HALL_RADIUS); g.position.y = HALL_HEIGHT - 0.01; return g; }, [env]);
  return (
    <>
      <Environment map={env} environmentIntensity={0.9} />
      <primitive object={sky} />
    </>
  );
}

// The line stands on an epoxy-finished foundation; a transparent shadow catcher lands shadows on the photographed hall floor.
function Platform() {
  const [d, r, n] = useTexture([`${PH}/garage_floor_diff_1k.jpg`, `${PH}/garage_floor_rough_1k.jpg`, `${PH}/garage_floor_nor_gl_1k.jpg`]);
  const [map, rough, nor] = useMemo(() => [d, r, n].map((b, i) => {
    const t = b.clone(); if (i === 0) t.colorSpace = SRGBColorSpace;
    t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(6, 3.5); t.anisotropy = 8; t.needsUpdate = true; return t;
  }), [d, r, n]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <shadowMaterial transparent opacity={0.45} />
      </mesh>
      <RoundedBox args={[26, 0.12, 13]} radius={0.05} smoothness={3} position={[-0.6, 0.06, 0.2]} receiveShadow>
        <meshStandardMaterial map={map} roughnessMap={rough} normalMap={nor} color="#b8b2a6" roughness={1} metalness={0.05} />
      </RoundedBox>
      {/* painted walkway lanes, lifted clear of the slab to avoid flicker */}
      {[[-0.6, 1.75, 25, 0.14], [-0.6, -2.95, 25, 0.14]].map(([x, z, w, h], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.125, z]}>
          <planeGeometry args={[w, h]} /><meshStandardMaterial color={SAFETY} roughness={0.6} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      ))}
    </group>
  );
}

function Silos() {
  const pipe = useMemo(() => new CatmullRomCurve3([new Vector3(-9.6, 5.6, -4), new Vector3(-9.6, 6.4, -2.6), new Vector3(-7.4, 6.4, -1.6), new Vector3(-6.4, 2.6, -1)]), []);
  return (
    <group>
      {[-11, -9.6, -8.2].map((x) => (
        <group key={x} position={[x, 0, -4]}>
          <mesh position={[0, 3.6, 0]} castShadow receiveShadow><cylinderGeometry args={[0.62, 0.62, 3.4, 40]} />{steel}</mesh>
          <mesh position={[0, 1.5, 0]} castShadow><coneGeometry args={[0.62, 0.9, 40]} />{steel}</mesh>
          <mesh position={[0, 5.45, 0]} castShadow><sphereGeometry args={[0.62, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />{steel}</mesh>
          {[2.4, 3.6, 4.8].map((y) => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.64, 0.025, 8, 40]} /><meshStandardMaterial color={DARKSTEEL} metalness={0.7} roughness={0.35} /></mesh>)}
          {[[-0.45, 0.45], [0.45, 0.45], [-0.45, -0.45], [0.45, -0.45]].map(([a, b], k) => (
            <mesh key={k} position={[a, 0.75, b]} castShadow><boxGeometry args={[0.08, 1.5, 0.08]} />{paint}</mesh>
          ))}
          {/* ladder */}
          <mesh position={[0.66, 3.2, 0.12]}><boxGeometry args={[0.03, 4.2, 0.03]} /><meshStandardMaterial color={SAFETY} /></mesh>
          <mesh position={[0.66, 3.2, -0.12]}><boxGeometry args={[0.03, 4.2, 0.03]} /><meshStandardMaterial color={SAFETY} /></mesh>
        </group>
      ))}
      <mesh castShadow><tubeGeometry args={[pipe, 48, 0.09, 12, false]} />{steel}</mesh>
      {/* extruder / mixer */}
      <RoundedBox args={[1.6, 1.4, 1.2]} radius={0.06} position={[-6.6, 0.7, -1]} castShadow receiveShadow>{paint}</RoundedBox>
      <mesh position={[-6.6, 1.75, -1]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.28, 0.28, 1.8, 24]} />{steel}</mesh>
      <mesh position={[-7.7, 1.75, -1]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.36, 0.36, 0.6, 24]} /><meshStandardMaterial color={LOGO.gold} metalness={0.6} roughness={0.35} /></mesh>
      <mesh position={[-6.6, 0.9, -0.39]}><planeGeometry args={[0.6, 0.35]} /><meshStandardMaterial color="#0b1a12" emissive="#3fd18a" emissiveIntensity={0.6} /></mesh>
    </group>
  );
}

function Line({ productUrl }) {
  const base = useTexture(productUrl);
  const web = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(6, 1); t.anisotropy = 8; t.needsUpdate = true; return t; }, [base]);
  const webMesh = useRef(null), rollers = useRef(null), outRolls = useRef([]);
  const legs = useMemo(() => Array.from({ length: 10 }, (_, i) => [-5 + i * 1.05, -1.62, -0.38]).flatMap(([x, , z]) => [[[x, 0.6, -1.62]], [[x, 0.6, -0.38]]]), []);
  const N = 14;
  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state, dt) => {
    webMesh.current.material.map.offset.x -= dt * 0.12;
    const r = rollers.current;
    for (let i = 0; i < N; i++) {
      dummy.position.set(-5.2 + i * 0.72, 1.32, -1); dummy.rotation.set(Math.PI / 2, state.clock.elapsedTime * 2.2, 0); dummy.updateMatrix();
      r.setMatrixAt(i, dummy.matrix);
    }
    r.instanceMatrix.needsUpdate = true;
    outRolls.current.forEach((m) => m && (m.rotation.y -= dt * 1.4)); // spin about the roll's own axis
  });

  return (
    <group>
      {/* I-beam frame on legs */}
      <Instances count={legs.length} transforms={legs} geometry={<boxGeometry args={[0.12, 1.2, 0.12]} />} material={paint} />
      {[-1.62, -0.38].map((z) => <mesh key={z} position={[-0.3, 1.22, z]} castShadow receiveShadow><boxGeometry args={[10.6, 0.18, 0.14]} />{paint}</mesh>)}
      <instancedMesh ref={rollers} args={[undefined, undefined, N]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.3, 20]} />{steel}
      </instancedMesh>
      {/* coating head with brand plate */}
      <RoundedBox args={[1.2, 1.3, 1.7]} radius={0.05} position={[-3.3, 1.95, -1]} castShadow>{paint}</RoundedBox>
      <mesh position={[-3.3, 2.1, -0.14]}><planeGeometry args={[0.7, 0.18]} /><meshStandardMaterial color={LOGO.gold} metalness={0.9} roughness={0.25} /></mesh>
      {/* drying oven with glowing slots */}
      <RoundedBox args={[3.2, 1.1, 1.8]} radius={0.05} position={[0.4, 1.95, -1]} castShadow><meshStandardMaterial color="#3a3e43" metalness={0.4} roughness={0.5} /></RoundedBox>
      {[-1, -0.33, 0.33, 1].map((x) => <mesh key={x} position={[0.4 + x, 1.95, -0.09]}><planeGeometry args={[0.5, 0.08]} /><meshStandardMaterial color="#ff9a3c" emissive="#ff8a2a" emissiveIntensity={2} /></mesh>)}
      {/* the product web running through the line */}
      <mesh ref={webMesh} rotation={[-Math.PI / 2, 0, 0]} position={[-0.3, 1.44, -1]} receiveShadow>
        <planeGeometry args={[10.4, 1.15]} />
        <meshPhysicalMaterial map={web} roughness={0.3} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* inspection gantry */}
      <group position={[4.8, 0, -1]}>
        {[-0.9, 0.9].map((z) => <mesh key={z} position={[0, 1.2, z]} castShadow><boxGeometry args={[0.14, 2.4, 0.14]} />{paint}</mesh>)}
        <mesh position={[0, 2.4, 0]} castShadow><boxGeometry args={[0.3, 0.22, 2]} />{paint}</mesh>
        <mesh position={[0, 2.27, 0]}><boxGeometry args={[0.1, 0.04, 1.7]} /><meshStandardMaterial color="#e8f4ff" emissive="#cfe6ff" emissiveIntensity={3} /></mesh>
      </group>
      {/* slitter-rewinder + output rolls */}
      <RoundedBox args={[1.4, 1.6, 2]} radius={0.05} position={[6.6, 0.8, -1]} castShadow receiveShadow>{paint}</RoundedBox>
      {[-0.66, -0.22, 0.22, 0.66].map((z, k) => (
        <mesh key={z} ref={(el) => (outRolls.current[k] = el)} position={[7.7, 1.1, -1 + z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.4, 40]} />
          <meshPhysicalMaterial map={web} roughness={0.35} clearcoat={1} />
        </mesh>
      ))}
    </group>
  );
}

function Dispatch() {
  return (
    <group position={[8.6, 0, 4.2]}>
      {[[-1.4, 0], [0, 0], [-1.4, 1.4]].map(([x, z], k) => (
        <group key={k} position={[x, 0, z]}>
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow><boxGeometry args={[1.2, 0.16, 1.2]} /><meshStandardMaterial color="#8a6b47" roughness={0.9} /></mesh>
          {[[-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]].map(([a, b], i) => (
            <group key={i} position={[a, 0.6, b]}>
              <mesh castShadow><cylinderGeometry args={[0.26, 0.26, 0.85, 28]} /><meshStandardMaterial color="#e9e3d6" roughness={0.6} /></mesh>
            </group>
          ))}
          {/* stretch wrap */}
          <mesh position={[0, 0.62, 0]}><boxGeometry args={[1.14, 0.9, 1.14]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.18} roughness={0.15} clearcoat={1} depthWrite={false} /></mesh>
        </group>
      ))}
      {/* forklift in brand black & gold */}
      <group position={[1.8, 0, -1.8]} rotation={[0, 2.36, 0]}>
        <RoundedBox args={[1.0, 0.7, 1.6]} radius={0.08} position={[0, 0.55, 0]} castShadow><meshStandardMaterial color={LOGO.gold} metalness={0.3} roughness={0.45} /></RoundedBox>
        <mesh position={[0, 1.25, 0.2]} castShadow><boxGeometry args={[0.9, 0.08, 0.9]} /><meshStandardMaterial color={LOGO.black} /></mesh>
        {[[-0.4, 0.65], [0.4, 0.65]].map(([x, z]) => <mesh key={x} position={[x, 0.85, z]} castShadow><boxGeometry args={[0.06, 0.9, 0.06]} /><meshStandardMaterial color={LOGO.black} /></mesh>)}
        <mesh position={[0, 1.1, -0.85]} castShadow><boxGeometry args={[0.8, 2.2, 0.1]} /><meshStandardMaterial color={LOGO.black} metalness={0.5} roughness={0.4} /></mesh>
        {[-0.2, 0.2].map((x) => <mesh key={x} position={[x, 0.12, -1.35]} castShadow><boxGeometry args={[0.1, 0.05, 1.0]} />{steel}</mesh>)}
        {[[-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5]].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.22, z]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.22, 0.22, 0.16, 20]} /><meshStandardMaterial color="#1c1c1c" roughness={0.9} /></mesh>
        ))}
      </group>
    </group>
  );
}

function ControlRoom() {
  return (
    <group position={[-8.6, 0, 4.4]}>
      <mesh position={[0, 0.1, 0]} receiveShadow><boxGeometry args={[4, 0.2, 2.8]} />{paint}</mesh>
      <mesh position={[0, 1.5, 0]}><boxGeometry args={[3.9, 2.6, 2.7]} /><meshPhysicalMaterial color="#cfe0ea" transparent opacity={0.16} roughness={0.05} metalness={0.1} clearcoat={1} depthWrite={false} /></mesh>
      <mesh position={[0, 2.85, 0]} castShadow><boxGeometry args={[4.1, 0.12, 2.9]} />{paint}</mesh>
      <mesh position={[0, 0.6, -0.6]} castShadow><boxGeometry args={[2.6, 0.08, 0.8]} /><meshStandardMaterial color="#d8d2c4" /></mesh>
      {[-0.8, 0, 0.8].map((x) => <mesh key={x} position={[x, 0.95, -0.85]}><planeGeometry args={[0.6, 0.38]} /><meshStandardMaterial color="#0d1620" emissive="#5aa9ff" emissiveIntensity={0.7} /></mesh>)}
    </group>
  );
}

function Worker({ position, rot = 0, phase = 0 }) {
  const g = useRef(null);
  useFrame((state) => { g.current.rotation.y = rot + Math.sin(state.clock.elapsedTime * 0.6 + phase) * 0.25; });
  return (
    <group ref={g} position={position}>
      <mesh position={[0, 0.45, 0]} castShadow><capsuleGeometry args={[0.13, 0.55, 4, 10]} /><meshStandardMaterial color="#26303d" roughness={0.8} /></mesh>
      <mesh position={[0, 0.98, 0]} castShadow><capsuleGeometry args={[0.18, 0.35, 4, 10]} /><meshStandardMaterial color="#e7c21f" emissive="#3a2f00" roughness={0.6} /></mesh>
      <mesh position={[0, 1.38, 0]} castShadow><sphereGeometry args={[0.12, 16, 12]} /><meshStandardMaterial color="#c99b7a" roughness={0.7} /></mesh>
      <mesh position={[0, 1.45, 0]} castShadow><sphereGeometry args={[0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f4f1ea" roughness={0.4} /></mesh>
    </group>
  );
}

function LedWall({ texture }) {
  return (
    <group position={[1.2, 0, -6.2]}>
      {[-4.4, 4.4].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 3.4, 0]} castShadow><boxGeometry args={[0.22, 6.8, 0.22]} />{steel}</mesh>
          <mesh position={[0, 0.06, 0]} castShadow><boxGeometry args={[0.9, 0.12, 0.9]} />{steel}</mesh>
        </group>
      ))}
      <mesh position={[0, 6.7, 0]} castShadow><boxGeometry args={[9.1, 0.22, 0.22]} />{steel}</mesh>
      <mesh position={[0, 4.2, -0.08]} castShadow><boxGeometry args={[8.6, 4.9, 0.14]} /><meshStandardMaterial color="#0d0d0e" roughness={0.45} /></mesh>
      <mesh position={[0, 4.2, 0]}><planeGeometry args={[8.3, 4.67]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    </group>
  );
}

// The plant never moves; dragging orbits the camera around it (so it stays planted in the photographed hall).
function Rig({ focus, children }) {
  const look = useRef(new Vector3(0, 1.5, 0));
  const drag = useCanvasDrag();
  const s = useRef({ a: 0.32, v: 0 });
  useFrame((state, dt) => {
    const d = drag.take(), st = s.current, k = 1 - Math.exp(-dt * 2.2);
    if (d.down) st.v = -d.dx * 0.003; else st.v *= 0.92;
    st.a = Math.max(-1.1, Math.min(1.25, st.a + st.v)); // stay on the open side of the hall
    const cam = state.camera, t = state.clock.elapsedTime;
    const a = st.a + Math.sin(t * 0.05) * 0.06;
    let target, pos;
    if (focus >= 0) {
      target = new Vector3(...STATIONS_POS[focus]).setY(1.5);
      pos = target.clone().add(new Vector3(Math.sin(a) * 7.2, 3.4, Math.cos(a) * 7.2));
    } else {
      target = new Vector3(0, 1.4, -0.5);
      pos = new Vector3(Math.sin(a) * 16, 5.6 + Math.sin(t * 0.07) * 0.3, Math.cos(a) * 16);
    }
    cam.position.lerp(pos, k);
    look.current.lerp(target, k);
    cam.lookAt(look.current);
  });
  return <group>{children}</group>;
}

function Scene({ stations, focus, onAnchor, productUrl }) {
  const show = focus < 0 ? 0 : focus;
  const vids = useVideoTextures(useMemo(() => stations.map((s) => s.video), [stations]), [show]);
  return (
    <Rig focus={focus}>
      <Platform />
      <group position={[0, 0.12, 0]}>{/* everything stands on the platform top */}
      <Silos />
      <Line productUrl={productUrl} />
      <Dispatch />
      <ControlRoom />
      <LedWall texture={vids[show]} />
      <Worker position={[-5, 0, 0.6]} rot={Math.PI} phase={0} />
      <Worker position={[4.2, 0, 0.5]} rot={2.6} phase={1.3} />
      <Worker position={[-6.0, 0, 3.3]} rot={0.6} phase={2.1} />
      <Worker position={[7.2, 0, 2.6]} rot={-2.2} phase={0.7} />
      <Worker position={[1, 0, -2.4]} rot={0} phase={2.8} />
      {STATIONS_POS.map((p, i) => <Anchor key={i} index={i} position={p} onFrame={onAnchor} />)}
      </group>
    </Rig>
  );
}

// A detailed, lit cutaway of an (illustrative) partner facility.
// Hotspot buttons are rendered by the page (see Anchor); `onAnchor` positions them.
export default function Facility({ stations, focus, onAnchor, productUrl }) {
  return (
    <div className="h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing">
      <LazyCanvas className="h-full w-full" shadows camera={{ position: [10, 5.8, 15], fov: 36, near: 0.3, far: 200 }}>
        <Suspense fallback={null}>
          <Hall />
        </Suspense>
        <hemisphereLight args={["#fff2dc", "#25211c", 0.25]} />
        <directionalLight position={[6, 16, 8]} intensity={1.5} color="#fff3e2" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0003} shadow-normalBias={0.03}
          shadow-camera-left={-16} shadow-camera-right={16} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={44} />
        <Suspense fallback={null}><Scene stations={stations} focus={focus} onAnchor={onAnchor} productUrl={productUrl} /></Suspense>
        <Finish bloom={0.5} threshold={0.9} vignette={0.5} grain={0.03} />
      </LazyCanvas>
    </div>
  );
}
