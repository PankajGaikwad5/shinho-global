"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Box3, CanvasTexture, DoubleSide, RepeatWrapping, SRGBColorSpace, Vector3 } from "three";
import { Studio } from "../kit/LazyCanvas";
import { Roll } from "../objects/Roll";
import { MATS, U } from "@/lib/materials";

// The visual the client's brief (point 2) asks for on two of the seven opening scenes:
//
//   Scene 01  "Show a real film finish moving into a roll."
//   Scene 05  "If it fits the existing style, use one clean composition showing a roll and matching
//              carton marked 'Your Brand'. Keep it subtle and let the material remain the focus."
//
// Built from parts the project already has: objects/Roll.jsx is the roll, and the chrome rollers and
// the travelling web are v14/RawScene.jsx's `Machine` and `Sheet` cut down to a loop.
//
// It is driven by the hero's own camera travel (changes/Hero.jsx writes `st.current.travel`), so it
// arrives and leaves with its scene without a scroll listener of its own.

// WHERE IT SITS, and why it is a CSS box rather than a world-space offset.
//
// The client's opening rules say words must never be covered by moving products. The first build put
// this behind the centred headline at full bleed, and the headline landed on top of the roll — wrong,
// and the client's "keep it subtle" is not met by a full-screen object either.
//
// Placing it by moving the group in world space means predicting where a world coordinate lands on
// screen under this camera, which is guesswork. The canvas is given a BOX instead, and the composition
// is centred inside that box. To move or resize it, change these numbers only.
//
// It was briefly put in a right-hand side column, to keep it clear of the centred headline. The user's
// call is that it is centred, behind the type, which is where it started. Keep the client's opening
// rule in view if it is ever enlarged: words must not end up hidden behind it.
const BOX = { width: "min(72vw,1040px)", height: "min(68vh,560px)" };
// Below this width the headline fills the screen and there is no clear side column, so it is hidden.
const MIN_WIDTH = 900;

// The finish on the film.
const FINISH = MATS.find((m) => m.code === "CF-305") || MATS[1];
const FINISH_URL = U(FINISH.img, 800);

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeIO = (x) => -(Math.cos(Math.PI * x) - 1) / 2;   // the tunnel's own easing

// HOW THE STAGE ARRIVES AND LEAVES.
//
// The first build cross-faded the canvas over a fixed window while the object stood still. Everything
// else in this hero travels - the message cards and the material panels fly out of depth, hold, then
// sweep past the camera - so a motionless object that simply brightened read as a blink.
//
// Hero.jsx fades its own cards with Math.min(cl((d + 2200)/900), cl((-d - 60)/320)): a long approach
// and a short exit, because on the way out the card is passing the camera, not vanishing. The same
// shape is used here, and the group moves in Z to match, so it approaches and passes for real.
//
// Beats are 3200 travel units apart (PLATEAU in Hero.jsx), so IN + OUT must stay well under that or
// two scenes would be on screen together.
const FADE_IN = 1500;      // travel units of approach before the hold
const FADE_OUT = 750;      // travel units of exit after it - short, because it is sweeping past
const APPROACH = 2.6;      // world units covered coming in, away from the camera
const PASS = 1.7;          // world units covered going out, towards the camera
const GATE = 700;          // extra travel margin before the canvas is allowed to stop rendering

// Presence at a given travel: 1 at the hold, 0 at the far end of each span.
function presenceAt(travel, plateau) {
  const d = travel - plateau;
  return easeIO(clamp01(1 - Math.abs(d) / (d <= 0 ? FADE_IN : FADE_OUT)));
}

// "YOUR BRAND", drawn the way objects/Roll.jsx draws its end cap — a canvas texture, so the scene
// needs no text library and no extra font download.
let markCache = null;
function markTexture() {
  if (markCache) return markCache;
  const W = 512, H = 220, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");
  x.clearRect(0, 0, W, H);
  x.fillStyle = "#1a1612";
  x.textBaseline = "middle";
  x.textAlign = "center";
  x.font = "500 40px ui-monospace, 'IBM Plex Mono', monospace";
  const text = "YOUR BRAND", sp = 12;
  const w = [...text].map((ch) => x.measureText(ch).width);
  const total = w.reduce((a, b) => a + b, 0) + sp * (text.length - 1);
  let px = (W - total) / 2;
  [...text].forEach((ch, i) => { x.fillText(ch, px + w[i] / 2, H / 2); px += w[i] + sp; });
  x.strokeStyle = "rgba(26,22,18,.45)"; x.lineWidth = 2;
  x.beginPath(); x.moveTo(W * 0.3, H * 0.74); x.lineTo(W * 0.7, H * 0.74); x.stroke();
  markCache = new CanvasTexture(c);
  markCache.colorSpace = SRGBColorSpace;
  return markCache;
}

// HOW FAST THE FILM MOVES, AND WHICH WAY THE ROLL TURNS.
//
// The web plane is rotated -PI/2 about X, so its local +Y points at world -Z, towards the roll. The
// texture offset is decremented, which walks the finish towards local +Y: the film travels -Z, into
// the roll. Good.
//
// The roll's axis runs along X (objects/Roll.jsx lays the cylinder on its side), and the web meets it
// underneath. Surface velocity there is (0, 0, -wx * R), so film travelling -Z needs wx POSITIVE. The
// first build subtracted, and the roll turned against its own film.
//
// Speed has to match too, or it reads as slipping. The film's linear speed is the texture speed times
// the world length of one texture repeat; the roll's angular speed is that divided by its radius. The
// first build span at 1.1 rad/s, two and a half times too fast. Derive it, do not type a number.
const WEB_SPEED = 0.22;                       // texture v units per second
const WEB_REPEAT_LEN = 2.7 / 2.4;             // plane length / repeat.y = world units per v unit
const ROLL_RADIUS = 0.56;                     // must match the <Roll radius> in scene 01
const ROLL_OMEGA = (WEB_SPEED * WEB_REPEAT_LEN) / ROLL_RADIUS;

const DESIGN_ASPECT = 1.6, BASE_FOV = 34;
// Where the camera stands, and what it is pointed at. The composition is not centred on the origin:
// the roll sits at z -0.25 and the web runs forward to z 2.8, so the aim point is the middle of that
// run, not the roll. The distance is set so the near corner of the web still clears the frame — at
// the first distance the web and the roll ran off the edges of the box.
const CAM = [2.67, 1.71, 5.31], AIM = [0, 0.1, 0.9];
const FALLBACK_DIST = 5.4;   // used for the frame or two before the bounds are measured
const FIT_MARGIN = 1.1;      // breathing room around the composition

// The camera's own axes. The direction it looks from is fixed; only its DISTANCE is solved for, so
// these can be built once.
const AXIS = new Vector3(CAM[0] - AIM[0], CAM[1] - AIM[1], CAM[2] - AIM[2]).normalize();
const FWD = AXIS.clone().negate();
const RIGHT = new Vector3().crossVectors(FWD, new Vector3(0, 1, 0)).normalize();
const UP = new Vector3().crossVectors(RIGHT, FWD).normalize();
const _v = new Vector3();

// The distance at which every corner of the composition is inside the frustum.
//
// This was hand-estimated twice and cropped the sheet both times — the geometry runs a long way
// along the view direction, so eyeballing which corner governs is guesswork. For a corner at offset
// v from the aim point: s = how far it sits towards the camera along the view axis, so its distance
// FROM the camera is (dist - s), and it is inside the frustum when |v.UP| <= (dist - s) * tanV and
// |v.RIGHT| <= (dist - s) * tanH. Solve each for dist and take the largest.
function fitDistance(corners, tanV, aspect) {
  const tanH = tanV * aspect;
  let d = 0;
  for (const c of corners) {
    _v.set(c.x - AIM[0], c.y - AIM[1], c.z - AIM[2]);
    const s = _v.dot(AXIS);
    d = Math.max(d, s + Math.abs(_v.dot(UP)) / tanV, s + Math.abs(_v.dot(RIGHT)) / tanH);
  }
  return Math.max(2, d * FIT_MARGIN);
}

function Rig({ fitRef }) {
  const last = useRef({ aspect: 0, v: -1 });
  // Driven from useFrame's own state, the way architectural/LayerScene.jsx drives its camera —
  // the React compiler lint rule rejects modifying a value returned by useThree().
  useFrame((state) => {
    const aspect = state.size.width / state.size.height;
    const bounds = fitRef.current;
    const v = bounds ? bounds.v : -1;
    if (aspect === last.current.aspect && v === last.current.v) return;
    last.current = { aspect, v };

    const cam = state.camera;
    // A narrow box widens the lens rather than cropping the sides.
    const tanV = Math.tan((BASE_FOV * Math.PI) / 360) * Math.max(1, DESIGN_ASPECT / aspect);
    cam.fov = Math.min(80, (Math.atan(tanV) * 360) / Math.PI);
    const dist = bounds ? fitDistance(bounds.corners, tanV, aspect) : FALLBACK_DIST;
    cam.position.set(AIM[0] + AXIS.x * dist, AIM[1] + AXIS.y * dist, AIM[2] + AXIS.z * dist);
    cam.lookAt(AIM[0], AIM[1], AIM[2]);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Scenes({ st, plateaus, wrapRef, fitRef }) {
  const g1 = useRef(null), g5 = useRef(null), roll1 = useRef(null), web = useRef(null);
  const still = useRef(false);
  useEffect(() => { still.current = matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);

  // Loaded through drei's useTexture under Suspense, as every other 3D scene here does. Attaching a
  // map AFTER first render leaves three's compiled shader without it, which is why the first build
  // rendered a bare grey cylinder instead of the film finish.
  const base = useTexture(FINISH_URL);
  const webTex = useMemo(() => {
    const t = base.clone();
    t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(1, 2.4); t.anisotropy = 8; t.needsUpdate = true;
    return t;
  }, [base]);
  const rollTex = useMemo(() => {
    const t = base.clone();
    t.colorSpace = SRGBColorSpace; t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(3, 1); t.anisotropy = 8; t.needsUpdate = true;
    return t;
  }, [base]);
  const mark = useMemo(() => markTexture(), []);

  // Each shot: the group, where its composition sits when held, and how far it is turned off-square
  // at the ends of its travel. The turn settles to zero at the hold, so the object looks placed
  // rather than switched on. Scene 05 sits forward of the origin; that offset is its base, not a
  // prop, because the frame has to add the travel depth to it every frame.
  const SHOTS = useMemo(() => [
    { ref: g1, base: [0, 0, 0], turn: 0.1 },
    { ref: g5, base: [0, 0.2, 0.76], turn: 0.16 },
  ], []);

  // Measure what the camera actually has to contain, once the meshes exist. Both groups are put at
  // their held positions first — scene 05's offset is applied in the frame loop, so before the first
  // frame it still sits at the origin and would be measured in the wrong place.
  useEffect(() => {
    const box = new Box3(), one = new Box3();
    for (const shot of SHOTS) {
      const g = shot.ref.current;
      if (!g) continue;
      g.position.set(shot.base[0], shot.base[1], shot.base[2]);
      g.updateWorldMatrix(true, true);
      one.setFromObject(g);
      if (!one.isEmpty()) box.union(one);
    }
    if (box.isEmpty()) return;
    const corners = [];
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) corners.push(new Vector3(x, y, z));
    fitRef.current = { corners, v: (fitRef.current ? fitRef.current.v : 0) + 1 };
  }, [SHOTS, fitRef]);

  useFrame((_, dt) => {
    const travel = st.current.travel;
    let lead = 0, p1 = 0;

    SHOTS.forEach((shot, i) => {
      const g = shot.ref.current;
      if (!g) return;
      const d = travel - plateaus[i];
      const out = d > 0;
      const p = presenceAt(travel, plateaus[i]);
      if (i === 0) p1 = p;
      if (p > lead) lead = p;

      const on = p > 0.004;
      if (g.visible !== on) g.visible = on;
      if (!on) return;

      // Out of depth, hold, then past the camera. Position is set in the same frame as visible, so
      // nothing is ever shown at a stale place.
      const k = d / (out ? FADE_OUT : FADE_IN);
      g.position.set(shot.base[0], shot.base[1], shot.base[2] + k * (out ? PASS : APPROACH));
      g.rotation.y = (out ? 1 : -1) * (1 - p) * shot.turn;
    });

    if (wrapRef.current) wrapRef.current.style.opacity = String(Math.round(lead * 1000) / 1000);

    if (still.current || p1 <= 0.01) return;
    // The finish travels along the web and the roll takes it up at the same rate. Reached through the
    // mesh ref rather than the texture object, which React may not have us modify after render.
    const map = web.current?.material?.map;
    if (map) map.offset.y = (map.offset.y - dt * WEB_SPEED) % 1;
    if (roll1.current) roll1.current.rotation.x += dt * ROLL_OMEGA;
  });

  // Not a mirror. At metalness 1 in a dark scene the rollers reflect almost nothing and render as
  // black bars, which is what the first build showed.
  const chrome = <meshStandardMaterial color="#b9b5ad" metalness={0.72} roughness={0.34} />;

  return (
    <>
      {/* 01 — a film finish moving into a roll */}
      <group ref={g1} visible={false}>
        <mesh ref={web} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 1.45]}>
          <planeGeometry args={[1.55, 2.7]} />
          <meshStandardMaterial color="#cfc9bd" map={webTex} roughness={0.3} metalness={0.45} side={DoubleSide} />
        </mesh>
        {[[-0.26, 2.15], [-0.26, 1.15]].map(([y, z]) => (
          <mesh key={z} position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 1.95, 32]} />
            {chrome}
          </mesh>
        ))}
        <Roll ref={roll1} map={rollTex} position={[0, 0.2, -0.25]} radius={0.56} length={1.6} metal={0.45} />
      </group>

      {/* 05 — the roll, and a matching carton marked Your Brand */}
      <group ref={g5} visible={false}>
        <Roll map={rollTex} position={[-0.78, -0.02, 0.1]} radius={0.5} length={1.35} metal={0.45}>
          {/* a label lying on the roll's upper surface, like a sticker on the wound film */}
          <mesh position={[0, 0.505, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.78, 0.33]} />
            <meshStandardMaterial map={mark} transparent roughness={0.9} />
          </mesh>
        </Roll>
        <group position={[0.92, -0.12, 0.18]}>
          <RoundedBox args={[1.05, 0.92, 0.86]} radius={0.028} smoothness={3}>
            <meshStandardMaterial color="#d9d3c7" roughness={0.78} metalness={0.02} />
          </RoundedBox>
          <mesh position={[0, 0.06, 0.436]}>
            <planeGeometry args={[0.76, 0.32]} />
            <meshStandardMaterial map={mark} transparent roughness={0.9} />
          </mesh>
        </group>
      </group>
    </>
  );
}

// `st.current.travel` is written by changes/Hero.jsx every frame; `plateaus` are the travel values
// scene 01 and scene 05 are held at (PLATEAU[0] and PLATEAU[4]).
export default function RollStage({ st, plateaus }) {
  const wrapRef = useRef(null);
  // Written by <Scenes> once it has measured its geometry, read by <Rig> to solve the camera distance.
  const fitRef = useRef(null);
  const [onScreen, setOnScreen] = useState(false);
  const [near, setNear] = useState(true);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= MIN_WIDTH);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Render only while the hero is on screen AND one of the two scenes is in reach — otherwise this
  // would keep drawing through all 1100vh of the opening, since the stage is sticky the whole way.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "150px" });
    io.observe(el);
    // The window is the approach plus the exit plus a margin, NOT a symmetric band: with a symmetric
    // 1200 either side the canvas was still frozen at frameloop="never" when the fade-in should have
    // started, so the scene arrived part-way through its entrance. Polled often enough that a fast
    // scroll cannot jump the whole margin between checks.
    const id = setInterval(() => {
      const t = st.current.travel;
      const live = (pl) => { const d = t - pl; return d > -(FADE_IN + GATE) && d < FADE_OUT + GATE; };
      setNear(live(plateaus[0]) || live(plateaus[1]));
    }, 120);
    return () => { io.disconnect(); clearInterval(id); };
  }, [st, plateaus, wide]);

  if (!wide) return null;

  return (
    <div
      ref={wrapRef}
      style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: BOX.width, height: BOX.height, opacity: 0, pointerEvents: "none" }}
    >
      <Canvas
        frameloop={onScreen && near ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: CAM, fov: BASE_FOV }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Rig fitRef={fitRef} />
        <Studio intensity={0.9} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.15} />
        <Suspense fallback={null}>
          <Scenes st={st} plateaus={plateaus} wrapRef={wrapRef} fitRef={fitRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
