"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, RoundedBox, useTexture } from "@react-three/drei";
import Anchor from "../kit/Anchor";
import { RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import LazyCanvas, { Studio } from "../kit/LazyCanvas";
import { useCanvasDrag } from "../kit/useCanvasDrag";
import { useVideoTextures } from "../kit/useVideoTextures";
import { LOGO } from "@/lib/themes";

const STONE = "#6e665c", DARK = "#2a241e", STEEL = "#9a948b";

// Station anchor points on the slab (x, y, z) — hotspots sit above these.
export const SPOTS = [[-3.9, 2.3, -1.2], [-0.6, 1.3, 0.3], [1.9, 1.75, 0.3], [3.75, 1.15, 0.45], [3.3, 1.2, -2.15]];

function Film({ url }) {
  const base = useTexture(url);
  const map = useMemo(() => {
    const t = base.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(3, 1); t.needsUpdate = true; return t;
  }, [base]);
  const mesh = useRef(null);
  useFrame((_, dt) => { const m = mesh.current.material.map; m.offset.x -= dt * 0.08; }); // film runs along the line
  return (
    <group>
      <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.93, 0.3]}>
        <planeGeometry args={[6.2, 1.0]} />
        <meshPhysicalMaterial map={map} roughness={0.3} clearcoat={1} />
      </mesh>
      {/* finished rolls at the rewinder use the same surface */}
      {[0, 1, 2].map((k) => (
        <Roll key={k} map={map} position={[3.75, 0.62, -0.25 + k * 0.62]} />
      ))}
    </group>
  );
}

function Roll({ map, position }) {
  const r = useRef(null);
  useFrame((_, dt) => { r.current.rotation.x -= dt * 0.9; });
  return (
    <mesh ref={r} position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.28, 0.28, 0.55, 40]} />
      <meshPhysicalMaterial map={map} roughness={0.35} clearcoat={1} />
    </mesh>
  );
}

function Rollers() {
  const g = useRef(null);
  useFrame((_, dt) => g.current.children.forEach((c) => { c.rotation.y += dt * 2; }));
  return (
    <group ref={g}>
      {Array.from({ length: 9 }, (_, k) => (
        <mesh key={k} position={[-2.6 + k * 0.62, 0.82, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 1.2, 20]} />
          <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Plant({ url, screen, focus, onAnchor }) {
  const root = useRef(null), glow = useRef(null);
  const drag = useCanvasDrag();
  const spin = useRef({ a: -0.35, v: 0 });
  const look = useRef(new Vector3(0, 0.6, 0));

  useFrame((state, dt) => {
    const d = drag.take(), s = spin.current, k = Math.min(1, dt * 2.2);
    if (d.down) s.v = d.dx * 0.005; else s.v *= 0.92;
    s.a += s.v + (focus < 0 && !d.down ? dt * 0.06 : 0);
    root.current.rotation.y = s.a;
    glow.current.material.emissiveIntensity = 1.4 + Math.sin(state.clock.elapsedTime * 3) * 0.6;
    // camera: overview, or close on the chosen station (in rotated space)
    const cam = state.camera;
    let target = new Vector3(0, 0.6, 0), pos = new Vector3(6.5, 6.2, 8.5);
    if (focus >= 0) {
      target = new Vector3(...SPOTS[focus]).applyEuler(root.current.rotation).setY(0.8);
      pos = target.clone().add(new Vector3(2.6, 2.6, 3.6));
    }
    cam.position.lerp(pos, k);
    look.current.lerp(target, k);
    cam.lookAt(look.current);
  });

  const steel = <meshStandardMaterial color={STEEL} metalness={0.8} roughness={0.3} />;
  return (
    <group ref={root}>
      {/* slab + gold inlay walkway */}
      <RoundedBox args={[10.8, 0.4, 6.8]} radius={0.12} smoothness={4} position={[0, -0.2, 0]}>
        <meshStandardMaterial color={DARK} roughness={0.8} />
      </RoundedBox>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.55]}><planeGeometry args={[10, 0.05]} /><meshStandardMaterial color={LOGO.gold} metalness={1} roughness={0.25} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -1.15]}><planeGeometry args={[10, 0.05]} /><meshStandardMaterial color={LOGO.gold} metalness={1} roughness={0.25} /></mesh>

      {/* 01 compounding silos */}
      {[-4.5, -3.9, -3.3].map((x) => (
        <group key={x} position={[x, 0, -1.2]}>
          <mesh position={[0, 1.15, 0]}><cylinderGeometry args={[0.27, 0.27, 1.5, 32]} />{steel}</mesh>
          <mesh position={[0, 0.25, 0]}><coneGeometry args={[0.27, 0.5, 32]} />{steel}</mesh>
        </group>
      ))}
      <mesh position={[-2.9, 0.75, -0.45]} rotation={[0, 0.6, Math.PI / 2]}><cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />{steel}</mesh>

      {/* 02 casting & coating line */}
      <RoundedBox args={[6.4, 0.75, 1.3]} radius={0.06} position={[0.1, 0.38, 0.3]}><meshStandardMaterial color={STONE} roughness={0.55} /></RoundedBox>
      <Rollers />
      <RoundedBox args={[1.2, 1.1, 1.5]} radius={0.06} position={[-2.2, 1.0, 0.3]}><meshStandardMaterial color={STONE} roughness={0.5} /></RoundedBox>

      {/* 03 inspection gantry with light bar */}
      <group position={[1.9, 0, 0.3]}>
        <mesh position={[0, 0.85, -0.75]}><boxGeometry args={[0.1, 1.7, 0.1]} />{steel}</mesh>
        <mesh position={[0, 0.85, 0.75]}><boxGeometry args={[0.1, 1.7, 0.1]} />{steel}</mesh>
        <mesh position={[0, 1.7, 0]}><boxGeometry args={[0.18, 0.16, 1.6]} />{steel}</mesh>
        <mesh ref={glow} position={[0, 1.6, 0]}><boxGeometry args={[0.08, 0.04, 1.4]} /><meshStandardMaterial color={LOGO.gold} emissive={LOGO.gold} emissiveIntensity={1.6} /></mesh>
      </group>

      <Suspense fallback={null}><Film url={url} /></Suspense>

      {/* 05 dispatch: pallets of rolls + container */}
      {[2.6, 3.5].map((x) => (
        <group key={x} position={[x, 0, -2.15]}>
          <mesh position={[0, 0.06, 0]}><boxGeometry args={[0.8, 0.12, 0.8]} /><meshStandardMaterial color="#8a6a45" roughness={0.9} /></mesh>
          {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([a, b], k) => (
            <mesh key={k} position={[a, 0.42, b]}><cylinderGeometry args={[0.16, 0.16, 0.6, 24]} /><meshStandardMaterial color="#d9d2c4" roughness={0.6} /></mesh>
          ))}
        </group>
      ))}
      <RoundedBox args={[2.4, 1.0, 1.0]} radius={0.04} position={[0.6, 0.5, -2.2]}><meshStandardMaterial color={LOGO.black} roughness={0.5} metalness={0.3} /></RoundedBox>
      <mesh position={[0.6, 0.5, -1.69]}><planeGeometry args={[1.6, 0.18]} /><meshStandardMaterial color={LOGO.gold} metalness={1} roughness={0.3} /></mesh>

      {/* screen on the back wall: the selected station's footage */}
      <group position={[-1.2, 0, -3.2]}>
        <mesh position={[0, 1.9, -0.06]}><boxGeometry args={[4.4, 2.6, 0.1]} /><meshStandardMaterial color={LOGO.black} roughness={0.4} /></mesh>
        <mesh position={[0, 1.9, 0]}><planeGeometry args={[4.2, 2.36]} /><meshBasicMaterial map={screen} toneMapped={false} /></mesh>
        <mesh position={[-1.6, 0.3, -0.06]}><boxGeometry args={[0.08, 0.6, 0.08]} />{steel}</mesh>
        <mesh position={[1.6, 0.3, -0.06]}><boxGeometry args={[0.08, 0.6, 0.08]} />{steel}</mesh>
      </group>

      {/* numbered hotspots */}
      {SPOTS.map((p, i) => <Anchor key={i} index={i} position={p} onFrame={onAnchor} />)}
    </group>
  );
}

function Scene({ stations, focus, onAnchor, filmUrl }) {
  const show = focus < 0 ? 0 : focus;
  const vids = useVideoTextures(useMemo(() => stations.map((s) => s.video), [stations]), [show]);
  return <Plant url={filmUrl} screen={vids[show]} focus={focus} onAnchor={onAnchor} />;
}

// An explorable miniature of a partner facility. Drag to turn; click a numbered station.
// Hotspot buttons are rendered by the page (see Anchor); `onAnchor` positions them.
export default function Diorama({ stations, focus, onAnchor, filmUrl }) {
  return (
    <div className="h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing">
      <LazyCanvas className="h-full w-full" camera={{ position: [6.5, 6.2, 8.5], fov: 34 }}>
        <hemisphereLight args={["#fff4e0", "#2a241e", 0.7]} />
        <directionalLight position={[5, 8, 4]} intensity={1.4} />
        <Studio />
        <Suspense fallback={null}><Scene stations={stations} focus={focus} onAnchor={onAnchor} filmUrl={filmUrl} /></Suspense>
        <ContactShadows position={[0, -0.41, 0]} opacity={0.6} blur={2.4} scale={16} far={3} />
      </LazyCanvas>
    </div>
  );
}
