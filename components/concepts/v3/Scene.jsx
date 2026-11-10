"use client";

import { Suspense, useEffect, useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, useTexture, useVideoTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";
import { PanelMaterial } from "./PanelMaterial";
import { FAMILIES, thumb } from "@/lib/brief";
import { VIDEO } from "@/lib/media";

extend({ PanelMaterial });

// ---- Layout of the room (camera travels from CAM_START to CAM_END along -z) ----
export const CAM_START = 6, CAM_END = -33;
const FAMILY_START = -10, SEG = 9;

const PANELS = FAMILIES.flatMap((f, fi) =>
  f.mats.map((m, k) => {
    const left = k % 2 === 0, tall = k % 3 !== 1;
    const [w, h] = tall ? [1.5, 2] : [2.2, 1.5];
    return {
      key: `${f.id}-${m.code}`, mat: { ...m, family: f.name }, url: thumb(m, 900), size: [w, h],
      position: [left ? -2.5 : 2.5, tall ? 0 : -0.2, FAMILY_START - fi * SEG - k * 1.25],
      rotation: [0, left ? 0.5 : -0.5, 0],
    };
  })
);

const SCREENS = [
  { key: "intro", media: VIDEO.factoryNightTop, size: [7.2, 4.05], position: [0, 0.4, -5], rotation: [0, 0, 0] },
  ...FAMILIES.map((f, fi) => ({ key: f.id, media: f.video, size: [4.8, 2.7], position: [0, 0.3, FAMILY_START - fi * SEG - 8], rotation: [0, 0, 0] })),
  { key: "p1", media: VIDEO.machinery, size: [3.2, 1.8], position: [-3.5, 0.2, -38.2], rotation: [0, 0.4, 0] },
  { key: "p2", media: VIDEO.slitter, size: [3.2, 1.8], position: [0, 0.2, -39], rotation: [0, 0, 0] },
  { key: "p3", media: VIDEO.inspector, size: [3.2, 1.8], position: [3.5, 0.2, -38.2], rotation: [0, -0.4, 0] },
];

function Surface({ tex, aspect, size, position, rotation, onSelect }) {
  const mat = useRef(null);
  const hover = useRef(0);

  useFrame((state, dt) => {
    const m = mat.current;
    if (!m) return;
    m.uTime = state.clock.elapsedTime;
    m.uHover += (hover.current - m.uHover) * Math.min(1, dt * 5);
  });
  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  return (
    <mesh position={position} rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); hover.current = 1; if (onSelect) document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { hover.current = 0; document.body.style.cursor = ""; }}
      onPointerMove={(e) => e.uv && mat.current?.uMouse.copy(e.uv)}
      onClick={onSelect ? (e) => { e.stopPropagation(); onSelect(); } : undefined}>
      <planeGeometry args={[size[0], size[1], 24, 24]} />
      <panelMaterial ref={mat} uTex={tex} uImgAspect={aspect} uPlaneAspect={size[0] / size[1]} />
    </mesh>
  );
}

function ImagePanel({ p, onSelect }) {
  const tex = useTexture(p.url, (t) => { t.colorSpace = SRGBColorSpace; });
  const aspect = tex.image ? tex.image.width / tex.image.height : 1;
  return <Surface tex={tex} aspect={aspect} size={p.size} position={p.position} rotation={p.rotation} onSelect={() => onSelect(p.mat)} />;
}

// Video screens only play while the camera is close, to keep the room light on slower machines.
function VideoScreen({ s }) {
  // drei already sets colorSpace to the renderer's output (sRGB) for video textures.
  const tex = useVideoTexture(s.media.src, { crossOrigin: "anonymous", muted: true, loop: true, playsInline: true, start: false });
  useFrame(({ camera }) => {
    const v = tex.image;
    const near = Math.abs(camera.position.z - s.position[2]) < 15 && camera.position.z > s.position[2] - 1;
    if (near && v.paused) v.play().catch(() => {});
    else if (!near && !v.paused) v.pause();
  });
  const v = tex.image;
  const aspect = v.videoWidth ? v.videoWidth / v.videoHeight : 16 / 9;
  return <Surface tex={tex} aspect={aspect} size={s.size} position={s.position} rotation={s.rotation} />;
}

function Rig({ progress }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => { pointer.current.x = e.clientX / window.innerWidth - 0.5; pointer.current.y = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera, size }, dt) => {
    const fov = size.width < 700 ? 66 : 45; // wider lens on phones so the side panels stay in frame
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const k = Math.min(1, dt * 3);
    const z = CAM_START + (CAM_END - CAM_START) * progress.current;
    camera.position.z += (z - camera.position.z) * k;
    camera.position.x += (pointer.current.x * 0.8 - camera.position.x) * k;
    camera.position.y += (0.25 - pointer.current.y * 0.4 - camera.position.y) * k;
    camera.lookAt(camera.position.x * 0.3, 0, camera.position.z - 10);
  });
  return null;
}

export default function Scene({ progress, onSelect }) {
  return (
    <>
      <color attach="background" args={["#0b0b0c"]} />
      <Rig progress={progress} />
      {PANELS.map((p) => (
        <Suspense key={p.key} fallback={null}><ImagePanel p={p} onSelect={onSelect} /></Suspense>
      ))}
      {SCREENS.map((s) => (
        <Suspense key={s.key} fallback={null}><VideoScreen s={s} /></Suspense>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, -18]}>
        <planeGeometry args={[30, 70]} />
        <MeshReflectorMaterial resolution={512} blur={[300, 80]} mixBlur={1} mixStrength={18} roughness={1} depthScale={1}
          minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#0d0d0e" metalness={0.6} mirror={0.5} />
      </mesh>
    </>
  );
}
