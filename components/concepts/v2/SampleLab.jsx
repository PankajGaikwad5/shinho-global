"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import { SRGBColorSpace } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FAMILIES, thumb } from "@/lib/brief";

gsap.registerPlugin(ScrollTrigger);

const W = 2.4, H = 3.2; // 3:4 sample plate
const LAYERS = ["Protective top layer", "Decorative film", "Adhesive system", "Substrate"];
const SAMPLES = [...new Map(FAMILIES.flatMap((f) => f.mats.map((m) => [m.code, { ...m, family: f.name }]))).values()];

// Fit a texture like CSS background-size: cover on the plate.
function cover(t) {
  t.colorSpace = SRGBColorSpace;
  const a = t.image.width / t.image.height, pa = W / H;
  if (a > pa) { t.repeat.set(pa / a, 1); t.offset.set((1 - pa / a) / 2, 0); }
  else { t.repeat.set(1, a / pa); t.offset.set(0, (1 - a / pa) / 2); }
}

function DecorMaterial({ url }) {
  const tex = useTexture(url, cover);
  return <meshStandardMaterial map={tex} roughness={0.55} metalness={0.05} />;
}

function Plate({ ctl, url }) {
  const root = useRef(null);
  const layers = useRef([]);
  const s = useRef({ e: 0, rx: 0.12, ry: -0.5 });

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 4);
    const target = Math.max(ctl.current.scroll, ctl.current.forced ? 1 : 0);
    s.current.e += (target - s.current.e) * k;
    s.current.ry += (-0.5 + ctl.current.scroll * 0.9 + ctl.current.dragY - s.current.ry) * k;
    s.current.rx += (0.12 + s.current.e * 0.55 - s.current.rx) * k;
    root.current.rotation.set(s.current.rx, s.current.ry, s.current.e * -0.35);
    const gap = 0.05 + s.current.e * 0.62;
    layers.current.forEach((g, i) => { if (g) g.position.z = (1.5 - i) * gap; });
  });

  return (
    <group ref={root}>
      <group ref={(el) => (layers.current[0] = el)}>
        <RoundedBox args={[W, H, 0.02]} radius={0.01} smoothness={2}>
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.22} roughness={0.04} clearcoat={1} clearcoatRoughness={0.05} />
        </RoundedBox>
      </group>
      <group ref={(el) => (layers.current[1] = el)}>
        <RoundedBox args={[W, H, 0.03]} radius={0.012} smoothness={2}>
          <Suspense fallback={<meshStandardMaterial color="#333" />}><DecorMaterial url={url} /></Suspense>
        </RoundedBox>
      </group>
      <group ref={(el) => (layers.current[2] = el)}>
        <RoundedBox args={[W, H, 0.02]} radius={0.01} smoothness={2}>
          <meshStandardMaterial color="#d6be8c" transparent opacity={0.45} roughness={0.4} />
        </RoundedBox>
      </group>
      <group ref={(el) => (layers.current[3] = el)}>
        <RoundedBox args={[W, H, 0.12]} radius={0.02} smoothness={2}>
          <meshStandardMaterial color="#77726a" roughness={0.9} />
        </RoundedBox>
      </group>
    </group>
  );
}

export default function SampleLab() {
  const root = useRef(null), stage = useRef(null);
  const ctl = useRef({ scroll: 0, forced: false, dragY: 0, drag: null });
  const [idx, setIdx] = useState(1);
  const [apart, setApart] = useState(false);
  const [forced, setForced] = useState(false);
  const [inView, setInView] = useState(false);
  const sample = SAMPLES[idx];
  const url = useMemo(() => thumb(sample, 1200), [sample]);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => {
        const e = Math.min(1, Math.max(0, (self.progress - 0.15) / 0.45));
        ctl.current.scroll = e;
        setApart((a) => (a !== e > 0.5 ? e > 0.5 : a));
      },
    });
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(stage.current);
    return () => { st.kill(); io.disconnect(); };
  }, []);

  useEffect(() => { ctl.current.forced = forced; }, [forced]);

  const down = (e) => { ctl.current.drag = e.clientX; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const move = (e) => {
    if (ctl.current.drag == null) return;
    ctl.current.dragY += (e.clientX - ctl.current.drag) * 0.008;
    ctl.current.drag = e.clientX;
  };
  const up = () => { ctl.current.drag = null; };
  const showLayers = apart || forced;

  return (
    <section id="lab" ref={root} className="relative h-[240vh] bg-char text-bone">
      <div ref={stage} className="sticky top-0 h-screen overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#2a2c2f_0%,#161718_65%)]">
        <div className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
          <Canvas frameloop={inView ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0.2, 7.2], fov: 32 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
            <ambientLight intensity={0.35} />
            <Environment resolution={128}>
              <Lightformer intensity={2.2} position={[0, 4, -3]} scale={[10, 2, 1]} />
              <Lightformer intensity={1.4} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
              <Lightformer form="ring" color="#c2a274" intensity={3} position={[4, 2, 3]} scale={2} />
            </Environment>
            <Plate ctl={ctl} url={url} />
            <ContactShadows position={[0, -2.1, 0]} opacity={0.55} blur={2.8} scale={10} far={4} />
          </Canvas>
        </div>

        <div className="pointer-events-none absolute top-[clamp(88px,12vh,120px)] left-[clamp(20px,4vw,56px)] flex max-w-[44%] flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">Material lab</span>
          <h2 className="text-[clamp(40px,5.4vw,88px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]">Handle the surface.</h2>
          <div key={sample.code} className="mt-4 flex animate-[fadeUp_.7s_cubic-bezier(.6,0,.2,1)] flex-col gap-1.5">
            <span className="font-mono text-[11px] uppercase tracking-[.12em] text-brass">{sample.code}</span>
            <span className="text-[clamp(24px,2.6vw,40px)] leading-none font-medium [font-stretch:118%]">{sample.name}</span>
            <span className="font-mono text-[10px] uppercase tracking-[.1em] text-stone">{sample.family} · {sample.finish}</span>
          </div>
        </div>

        <ol className="pointer-events-none absolute top-1/2 right-[clamp(20px,4vw,56px)] hidden -translate-y-1/2 list-none flex-col gap-4 text-right md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">Construction, top to base</span>
          {LAYERS.map((l, i) => (
            <li key={l} className="flex items-center justify-end gap-3 text-[15px] transition-[opacity,transform] duration-700 ease-cine"
              style={{ opacity: showLayers ? 1 : 0.3, transform: showLayers ? "none" : "translateX(12px)", transitionDelay: `${i * 80}ms` }}>
              {l}<span className="font-mono text-[10px] text-brass">0{i + 1}</span>
            </li>
          ))}
        </ol>

        <div className="absolute inset-x-[clamp(20px,4vw,56px)] bottom-20 flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-[min(760px,100%)] flex-wrap gap-1.5">
            {SAMPLES.map((m, i) => (
              <button key={m.code} title={m.name} onClick={() => setIdx(i)}
                className="h-9 w-9 bg-cover bg-center outline outline-1 outline-offset-[3px] transition-[outline-color] duration-300"
                style={{ backgroundImage: `url(${thumb(m, 120)})`, outlineColor: i === idx ? "#c2a274" : "transparent" }} />
            ))}
          </div>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">Drag to turn · scroll to separate</span>
            <button onClick={() => setForced((f) => !f)} className="border-b border-bone pb-1 text-sm font-medium">{forced ? "Assemble layers" : "Separate layers"}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
