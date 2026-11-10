"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { BackSide, Color, DoubleSide, Object3D, RepeatWrapping, SRGBColorSpace, Vector2, Vector3 } from "three";
import { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { useVideoTextures, texAspect } from "../kit/useVideoTextures";
import { Roll } from "../objects/Roll";
import { keyAt, presence, smooth, storyAt } from "../story/story";
import { VIDEO } from "@/lib/media";
import { LOGO } from "@/lib/themes";

// Camera keyframes, one per chapter (position, look-at).
const POS = [[0, 0.8, 7.5], [2.6, 3.2, 6.2], [4.2, 1.8, 5.2], [0.2, 3.6, 5.6], [-2.8, 1.3, 4.6], [3.4, 2.2, 8.6], [0, 2.6, 12.5], [28.5, 1.8, 6], [30.5, 2.6, 7.5]];
const LOOK = [[0, 1.4, 0], [0, 1.8, 0], [0, 0.2, 0.6], [0, 0, 2.2], [0, 0, 2.6], [0, 0.4, 4.6], [0, 1.8, 0], [24, 1.1, 0], [24, 1.2, 0]];
const SHEET_W = 2.6, SHEET_L = 6.4;
const hash = (n) => { const x = Math.sin(n * 77.7) * 43758.5453; return x - Math.floor(x); };

function Pellets({ st }) {
  const ref = useRef(null), N = 520;
  const seeds = useMemo(() => Array.from({ length: N }, (_, i) => [hash(i), hash(i + 0.3), hash(i + 0.6)]), []);
  const o = useMemo(() => new Object3D(), []);
  useFrame((state) => {
    const { f } = st.current, vis = presence(f, 0.6, 1.4), fall = smooth(f - 0.4); // swirl, then pour into the hopper
    ref.current.visible = vis > 0.01;
    if (!ref.current.visible) return;
    const time = state.clock.elapsedTime;
    seeds.forEach(([a, b, c], i) => {
      const r = (0.5 + a * 2.2) * (1 - fall * 0.85), ang = a * 40 + time * (0.3 + b * 0.4);
      const y = 2.2 + (b - 0.5) * 3.2 * (1 - fall) + fall * (2.6 - c * 1.4);
      o.position.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
      o.scale.setScalar(vis * (0.7 + c * 0.6));
      o.rotation.set(a * 6, b * 6, time * 0.5);
      o.updateMatrix(); ref.current.setMatrixAt(i, o.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, N]}>
      <capsuleGeometry args={[0.045, 0.05, 4, 8]} />
      <meshPhysicalMaterial color="#efe9dc" roughness={0.25} transmission={0.2} thickness={0.2} clearcoat={1} />
    </instancedMesh>
  );
}

function Machine({ st }) {
  const g = useRef(null), rollers = useRef([]);
  useFrame((_, dt) => {
    const { f } = st.current, v = presence(f, 2.4, 2.2);
    g.current.visible = v > 0.01; g.current.scale.setScalar(0.85 + v * 0.15);
    rollers.current.forEach((r, i) => r && (r.rotation.x += dt * (i % 2 ? 1.2 : -1.2)));
  });
  const chrome = <meshStandardMaterial color="#d9d6d0" metalness={1} roughness={0.12} />;
  return (
    <group ref={g}>
      {/* hopper */}
      <mesh position={[0, 2.25, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.9, 1.4, 48, 1, true]} /><meshStandardMaterial color="#b8b5ae" metalness={0.85} roughness={0.3} side={DoubleSide} /></mesh>
      <mesh position={[0, 1.35, 0]}><cylinderGeometry args={[0.16, 0.16, 0.6, 24]} />{chrome}</mesh>
      {/* casting / calender rollers */}
      {[[0.55, -0.2], [-0.3, 0.25]].map(([y, z], i) => (
        <mesh key={i} ref={(el) => (rollers.current[i] = el)} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, SHEET_W + 0.5, 48]} />{chrome}
        </mesh>
      ))}
      {[-1, 1].map((s) => <RoundedBox key={s} args={[0.3, 1.9, 1.3]} radius={0.04} position={[s * (SHEET_W / 2 + 0.45), 0.1, 0]}><meshStandardMaterial color="#26282c" metalness={0.4} roughness={0.5} /></RoundedBox>)}
      <mesh position={[SHEET_W / 2 + 0.62, 0.55, 0]}><planeGeometry args={[0.02, 0.02]} /><meshBasicMaterial color={LOGO.gold} /></mesh>
    </group>
  );
}

const sheetVertex = /* glsl */ `
  uniform float uTime, uLen; varying vec2 vUv; varying vec3 vPos;
  void main() {
    vUv = uv; vec3 p = position;
    p.z += sin(uv.y * 9.0 - uTime * 1.4) * 0.025 * uv.y + sin(uv.x * 6.0 + uTime) * 0.01;
    vec4 wp = modelMatrix * vec4(p, 1.0); vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;
const sheetFragment = /* glsl */ `
  uniform sampler2D uTex; uniform vec2 uCover; uniform vec3 uPlain, uGold; uniform float uDecor, uEmboss, uCoat, uSweep, uLen;
  varying vec2 vUv; varying vec3 vPos;
  float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
  void main() {
    if (vUv.y > uLen) discard;                                   // the sheet emerges from the rollers
    vec2 uv = vec2(vUv.x, vUv.y * 2.4);
    vec3 decor = texture2D(uTex, (fract(uv) - 0.5) * uCover + 0.5).rgb;
    float nz = n(vUv * vec2(5.0, 12.0)) * 0.7 + n(vUv * 30.0) * 0.3;
    float m = smoothstep(nz - 0.04, nz + 0.04, uDecor * 1.2 - 0.1);
    vec3 c = mix(uPlain, decor, m);
    c += uGold * (1.0 - smoothstep(0.0, 0.05, abs(nz - (uDecor * 1.2 - 0.1)))) * step(0.01, uDecor) * step(uDecor, 0.99) * 1.4;
    float l = dot(decor, vec3(0.299, 0.587, 0.114));
    c *= 1.0 + (l - 0.5) * 0.45 * uEmboss;                        // embossed relief reads in the light
    float sweep = exp(-pow((vUv.y - uSweep) * 7.0, 2.0));
    c += vec3(1.0, 0.96, 0.88) * sweep * 0.55 * uCoat;            // top-coat sheen sweeping across
    vec3 nrm = normalize(cross(dFdx(vPos), dFdy(vPos)));
    c *= 0.82 + 0.25 * max(dot(nrm, normalize(vec3(0.3, 1.0, 0.4))), 0.0);
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }`;

function Sheet({ st, finishUrl }) {
  const mat = useRef(null), mesh = useRef(null);
  const base = useTexture(finishUrl);
  const tex = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = 8; t.needsUpdate = true; return t; }, [base]);
  const uniforms = useMemo(() => ({
    uTex: { value: null }, uCover: { value: new Vector2(1, 1) }, uPlain: { value: new Color("#e9e4d8") }, uGold: { value: new Color(LOGO.gold) },
    uDecor: { value: 0 }, uEmboss: { value: 0 }, uCoat: { value: 0 }, uSweep: { value: 0 }, uLen: { value: 0 }, uTime: { value: 0 },
  }), []);
  useFrame((state) => {
    const { i, t, f } = st.current, u = mat.current.uniforms;
    mesh.current.visible = f > 1.6 && f < 6.6;
    u.uTime.value = state.clock.elapsedTime;
    u.uTex.value = tex;
    const a = texAspect(tex), pa = SHEET_W / (SHEET_L / 2.4);
    u.uCover.value.set(pa > a ? 1 : pa / a, pa > a ? a / pa : 1);
    u.uLen.value = i < 2 ? 0 : i === 2 ? smooth(t * 1.3) : i === 5 ? 1 - smooth(t) * 0.75 : i > 5 ? 0.25 : 1;
    u.uDecor.value = i < 3 ? 0 : i === 3 ? smooth(t * 1.6) : 1;
    u.uEmboss.value = i < 4 ? 0 : i === 4 ? smooth(t * 2) : 1;
    u.uCoat.value = i === 4 ? smooth(t * 2 - 0.4) : 0;
    u.uSweep.value = i === 4 ? (state.clock.elapsedTime * 0.25) % 1.3 - 0.15 : -1;
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0.25 + SHEET_L / 2]}>
      <planeGeometry args={[SHEET_W, SHEET_L, 60, 140]} />
      <shaderMaterial ref={mat} vertexShader={sheetVertex} fragmentShader={sheetFragment} uniforms={uniforms} side={DoubleSide} />
    </mesh>
  );
}

function Rolls({ st, finishUrl }) {
  const base = useTexture(finishUrl);
  const map = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(2, 1); t.needsUpdate = true; return t; }, [base]);
  const g = useRef(null), rolls = useRef([]);
  useFrame((_, dt) => {
    const { i, t, f } = st.current, grow = i < 5 ? 0 : i === 5 ? smooth(t * 1.2) : 1;
    g.current.visible = f > 4.6 && f < 7;
    rolls.current.forEach((r) => { if (!r) return; r.scale.set(1, 0.12 + grow * 0.88, 0.12 + grow * 0.88); r.rotation.x -= dt * 2.2 * (i === 5 ? 1 : 0.2); });
  });
  return (
    <group ref={g} position={[0, 0.42, 5.2]}>
      {[-0.98, -0.33, 0.33, 0.98].map((x, k) => (
        <Roll key={x} ref={(el) => (rolls.current[k] = el)} map={map} position={[x, 0, 0]} radius={0.42} length={0.6} />
      ))}
    </group>
  );
}

function Screens({ st, videos }) {
  const a = useRef(null), b = useRef(null), wall = useRef(null);
  useFrame(() => {
    const { f } = st.current;
    a.current.material.opacity = presence(f, 2.2, 0.9);
    b.current.material.opacity = presence(f, 5.1, 0.9);
    wall.current.material.opacity = presence(f, 6.1, 0.9);
  });
  return (
    <>
      <mesh ref={a} position={[-3.4, 1.7, 0.6]} rotation={[0, 0.55, 0]}><planeGeometry args={[2.8, 1.58]} /><meshBasicMaterial map={videos[0]} transparent toneMapped={false} /></mesh>
      <mesh ref={b} position={[3.8, 1.9, 3.6]} rotation={[0, -0.6, 0]}><planeGeometry args={[2.8, 1.58]} /><meshBasicMaterial map={videos[1]} transparent toneMapped={false} /></mesh>
      <mesh ref={wall} position={[0, 2.6, 7]}><cylinderGeometry args={[11, 11, 6.2, 64, 1, true, Math.PI - 0.62, 1.24]} /><meshBasicMaterial map={videos[2]} transparent side={BackSide} toneMapped={false} /></mesh>
    </>
  );
}

function Interior({ st, finishUrl }) {
  const base = useTexture(finishUrl);
  const [wallMap, islandMap] = useMemo(() => [[2, 1.4], [1.4, 0.6]].map(([x, y]) => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(x, y); t.needsUpdate = true; return t; }), [base]);
  const g = useRef(null);
  useFrame(() => { g.current.visible = st.current.f > 6.2; });
  return (
    <group ref={g} position={[24, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[14, 12]} /><meshStandardMaterial color="#d9d2c4" roughness={0.85} /></mesh>
      <mesh position={[0, 2, -3]} receiveShadow><boxGeometry args={[14, 4, 0.2]} /><meshStandardMaterial color="#e9e4da" roughness={0.9} /></mesh>
      <mesh position={[-4.5, 2, 0]} receiveShadow><boxGeometry args={[0.2, 4, 12]} /><meshStandardMaterial color="#e3ddd2" roughness={0.9} /></mesh>
      {/* the film, applied: wall cladding + island */}
      <mesh position={[0.6, 1.6, -2.88]}><planeGeometry args={[6, 3.2]} /><meshPhysicalMaterial map={wallMap} roughness={0.4} clearcoat={0.4} /></mesh>
      <RoundedBox args={[3.2, 0.95, 1.1]} radius={0.03} position={[0.4, 0.475, -0.2]} castShadow><meshPhysicalMaterial map={islandMap} roughness={0.35} clearcoat={0.6} /></RoundedBox>
      <mesh position={[0.4, 0.97, -0.2]} castShadow><boxGeometry args={[3.3, 0.05, 1.2]} /><meshStandardMaterial color="#f4f1ea" roughness={0.3} /></mesh>
      {[-0.6, 0.4, 1.4].map((x) => (
        <group key={x} position={[x, 3.3, -0.2]}>
          <mesh><cylinderGeometry args={[0.008, 0.008, 1.4, 6]} /><meshStandardMaterial color="#222" /></mesh>
          <mesh position={[0, -0.75, 0]}><sphereGeometry args={[0.13, 20, 12]} /><meshStandardMaterial color={LOGO.gold} emissive="#ffd9a0" emissiveIntensity={1.6} metalness={0.6} /></mesh>
        </group>
      ))}
    </group>
  );
}

function Rig({ st }) {
  const look = useRef(new Vector3(...LOOK[0]));
  useFrame((state, dt) => {
    const { f } = st.current, k = 1 - Math.exp(-dt * 3.2), cam = state.camera, time = state.clock.elapsedTime;
    const p = keyAt(POS, f), l = keyAt(LOOK, f);
    const sway = f > 7.5 ? [Math.sin(time * 0.15) * 1.5, 0, Math.cos(time * 0.15) * 0.6] : [Math.sin(time * 0.3) * 0.12, Math.cos(time * 0.25) * 0.08, 0];
    cam.position.lerp(new Vector3(p[0] + sway[0] + state.pointer.x * 0.25, p[1] + sway[1] + state.pointer.y * 0.15, p[2] + sway[2]), k);
    look.current.lerp(new Vector3(...l), k);
    cam.lookAt(look.current);
  });
  return null;
}

// The whole homepage as one 3D story: polymer → film → décor → finish → rolls → partner facilities → applied.
export default function RawScene({ progress, bounds, chapter, finishUrl }) {
  const st = useRef({ i: 0, t: 0, u: 0, f: 0 });
  // story position from page scroll (read by every element below)
  useFrame(() => { st.current = storyAt(Math.min(1, Math.max(0, progress.get())), bounds); });
  const medias = useMemo(() => [VIDEO.liquidSteam, VIDEO.slitter, VIDEO.factoryAerial], []);
  const playing = [chapter >= 1 && chapter <= 3 ? 0 : -1, chapter >= 4 && chapter <= 6 ? 1 : -1, chapter >= 5 && chapter <= 7 ? 2 : -1].filter((x) => x >= 0);
  const videos = useVideoTextures(medias, playing);
  return (
    <>
      <color attach="background" args={["#0b0b0c"]} />
      <fog attach="fog" args={["#0b0b0c", 14, 34]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 6]} intensity={1.6} color="#fff3e2" />
      <directionalLight position={[28, 6, 6]} intensity={1.2} color="#fff3e2" />
      <Studio intensity={0.85} />
      <Rig st={st} />
      <Pellets st={st} />
      <Machine st={st} />
      <Suspense fallback={null}>
        <Sheet st={st} finishUrl={finishUrl} />
        <Rolls st={st} finishUrl={finishUrl} />
        <Interior st={st} finishUrl={finishUrl} />
      </Suspense>
      <Screens st={st} videos={videos} />
      <Finish bloom={0.8} threshold={0.75} vignette={0.6} />
    </>
  );
}
