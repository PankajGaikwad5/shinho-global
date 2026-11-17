"use client";

import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import Anchor from "../kit/Anchor";
import { SRGBColorSpace, Vector3 } from "three";
import { Studio } from "../kit/LazyCanvas";
import Finish from "../kit/Finish";
import { keyAt, smooth, storyAt } from "../story/story";
import { MATS, U } from "@/lib/materials";

// V13's Layers scene — components/concepts/v16/LayerScene.jsx — for the architectural-film page
// (brief point 6). The concept folders kept their old working numbers, so route /v13 lives in v16.
//
// Copied from it: the RoundedBox panel, the materials (grey liner, emissive amber adhesive, mapped décor
// face, clearcoat top coat), the explode along Z, the Anchor labels, the idle sway, the lighting.
//
// Changed, because the client asked for exactly this:
//  1. The two supply routes are DIFFERENT STACKS, not one stack dimmed. "Stop at the face film" is taken
//     literally: top-layer supply is the face film and its top coat, and the adhesive the buyer adds is
//     drawn as an outline labelled "Added by your team".
//  2. For finished film the decorative face is ABOVE the adhesive and the removable release liner BELOW.
//  3. The substrate is gone. The wall, panel or furniture surface is not supplied on the roll, so it is
//     not part of the construction — the page says so in words instead.
//  4. V13's chip wall, substrate video and scroll story are dropped; the explode is driven by this
//     section's own scroll, and the copy stays still and readable.
//
// Each array reads BOTTOM-UP, as V13's does.
export const ROUTE_LAYERS = {
  "top-layer": [
    { name: "Adhesive", note: "Added by your team", kind: "glue", added: true },
    { name: "Decorative face film", note: "Colour, texture and print as specified", kind: "decor" },
    { name: "Protective top coat", note: "Where the finish specifies one", kind: "clear" },
  ],
  finished: [
    { name: "Release liner", note: "Removed at application", kind: "liner" },
    { name: "Adhesive", note: "Applied in production", kind: "glue" },
    { name: "Decorative face film", note: "Colour, texture and print as specified", kind: "decor" },
    { name: "Protective top coat", note: "Where the finish specifies one", kind: "clear" },
  ],
};
export const MAX_LAYERS = 4;

const W = 3.2, H = 2.1;
const THICK = { liner: 0.04, glue: 0.03, decor: 0.05, clear: 0.025 };

function Panel({ st, route, decorUrl, onAnchor }) {
  const base = useTexture(decorUrl);
  const decor = useMemo(() => { const t = base.clone(); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true; return t; }, [base]);
  const g = useRef(null), layers = useRef([]), glue = useRef(null);
  const stack = ROUTE_LAYERS[route];
  const mid = (stack.length - 1) / 2;

  useFrame((state) => {
    if (!g.current) return;
    const { i, t } = st.current, time = state.clock.elapsedTime;
    // V16's own lines: opens across chapter 1, holds open after, and the panel stops swaying once it is
    // open — from there the camera does the moving.
    const explode = i === 0 ? 0 : i === 1 ? smooth(t * 1.3) : 1;
    g.current.rotation.y = i === 0 ? Math.sin(time * 0.4) * 0.35 : g.current.rotation.y * 0.95;
    g.current.rotation.x = i === 0 ? -0.1 + Math.sin(time * 0.3) * 0.06 : -0.05;
    layers.current.forEach((m, k) => { if (m) m.position.z = (k - mid) * (0.07 + explode * 0.63); });
    if (glue.current) glue.current.emissiveIntensity = 0.3 + Math.sin(time * 3) * 0.18;
  });

  return (
    <group ref={g}>
      {stack.map((l, k) => (
        <group key={l.name} ref={(el) => (layers.current[k] = el)}>
          <RoundedBox args={[W, H, THICK[l.kind]]} radius={Math.min(0.02, THICK[l.kind] / 2.2)} smoothness={3} castShadow>
            {/* A layer the buyer adds is an outline, not material we supply. */}
            {l.added && <meshBasicMaterial color="#c4a465" wireframe transparent opacity={0.45} />}
            {!l.added && l.kind === "liner" && <meshStandardMaterial color="#8b8680" roughness={0.85} />}
            {!l.added && l.kind === "glue" && <meshPhysicalMaterial ref={glue} color="#d9b46a" emissive="#c9952f" transparent opacity={0.55} roughness={0.3} />}
            {!l.added && l.kind === "decor" && <meshStandardMaterial map={decor} roughness={0.55} />}
            {!l.added && l.kind === "clear" && <meshPhysicalMaterial color="#ffffff" transparent opacity={0.28} roughness={0.1} clearcoat={1} />}
          </RoundedBox>
          <Anchor index={k} position={[W / 2 + 0.15, H / 2 - 0.15, 0]} onFrame={onAnchor} />
        </group>
      ))}
    </group>
  );
}

// V16's own camera keyframes, copied value for value (components/concepts/v16/LayerScene.jsx), for the
// part of its story that explores the panel — its chapters 0 to 5. Its last three keyframes pull back to
// z 11.5–13.5 for the chip wall, which this page does not have, so they are left out.
const POS = [[0, 0.4, 6.6], [3.4, 1.7, 5.2], [3.4, 0.5, -0.4], [2.8, 0.8, 0.6], [1.9, 1.5, 2.9], [-1.9, 1.3, 3.8]];
const LOOK = [[0, 0, 0], [0, 0, 0.4], [0, 0, -1.05], [0, 0, -0.35], [0, 0, 0.35], [0, 0, 1.05]];

function Camera({ st }) {
  const look = useRef(new Vector3(...LOOK[0]));
  useFrame((state, dt) => {
    const { f } = st.current;
    const k = 1 - Math.exp(-dt * 3), cam = state.camera, time = state.clock.elapsedTime;
    const [x, y, z] = keyAt(POS, f), l = keyAt(LOOK, f);
    cam.position.lerp(new Vector3(x + state.pointer.x * 0.3 + Math.sin(time * 0.3) * 0.07, y + state.pointer.y * 0.2, z), k);
    look.current.lerp(new Vector3(...l), k);
    cam.lookAt(look.current);
  });
  return null;
}

// V16's chapter lengths for the chapters kept here. They are what make the movement feel right: inside a
// chapter the camera HOLDS (u stays 0) and only eases to the next keyframe during that chapter's final
// screen. Driving the keyframes linearly from scroll instead — which is what this did before — moves the
// camera constantly and never lets it settle, which reads as abrupt.
export const CHAPTERS = [{ len: 1.3 }, { len: 1.4 }, { len: 1.4 }, { len: 1.3 }, { len: 1.8 }, { len: 1.8 }];
// Phones and small tablets: the first three beats only — assembled, opening, in close and edge-on — at
// V16's own chapter length so each still holds before it moves. Nine screens of pinned scroll on a phone
// is a long way to push with a thumb; this is under four.
export const CHAPTERS_SM = [{ len: 1.3 }, { len: 1.3 }, { len: 1.3 }];

export default function LayerScene({ progress, bounds, route, decorUrl, onAnchor }) {
  const st = useRef({ i: 0, t: 0, u: 0, f: 0 });
  useFrame(() => { st.current = storyAt(Math.min(1, Math.max(0, progress.get())), bounds); });
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
        <Panel st={st} route={route} decorUrl={decorUrl} onAnchor={onAnchor} />
      </Suspense>
      <Finish bloom={0.7} threshold={0.8} vignette={0.6} />
    </>
  );
}

export const decorChoices = ["Natural Oak", "Calacatta", "Nero Marquina", "Brushed Steel", "Verdigris", "Smoked Walnut"].map((n) => MATS.find((m) => m.name === n)).filter(Boolean);
export const decorUrlOf = (m) => U(m.img, 1400);
