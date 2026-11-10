"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./Scene";
import { Lines, Reveal } from "../shared/Reveal";
import { FAMILIES, ROLE, CAPABILITIES, thumb } from "@/lib/brief";

gsap.registerPlugin(ScrollTrigger);

function Loader() {
  const { progress, active } = useProgress();
  return (
    <AnimatePresence>
      {active && progress < 100 && (
        <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
          className="pointer-events-none fixed inset-0 z-[60] flex items-end justify-between bg-ink px-[clamp(20px,4vw,56px)] pb-10 font-mono text-[11px] uppercase tracking-[.16em] text-stone">
          <span>Preparing the material room</span>
          <span className="text-bone">{Math.round(progress)}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Detail({ mat, onClose }) {
  return (
    <AnimatePresence>
      {mat && (
        <motion.aside key={mat.code} data-lenis-prevent role="dialog" aria-label={mat.name}
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.8, ease: [0.6, 0, 0.2, 1] }}
          className="fixed inset-y-0 right-0 z-[85] flex w-[min(480px,100vw)] flex-col overflow-y-auto border-l border-bone/10 bg-char/95 backdrop-blur-xl">
          <div className="relative aspect-[4/5] shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${thumb(mat, 1200)})` }}>
            <button onClick={onClose} className="absolute top-5 right-5 rounded-full bg-ink/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[.14em] text-bone backdrop-blur">Close ✕</button>
          </div>
          <div className="flex flex-col gap-6 p-8">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-brass">{mat.code}</span>
              <span className="text-[40px] leading-none font-medium [font-stretch:118%] tracking-[-.03em]">{mat.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-[.1em] text-stone">{mat.family}</span>
            </div>
            <dl className="grid grid-cols-1 gap-4">
              {[["Finish", mat.finish], ["Applications", mat.apps], ["Supply", "Collection or developed to specification"]].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 border-t border-bone/12 pt-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">{k}</dt>
                  <dd className="m-0 text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
            <a href="#contact" onClick={onClose} className="self-start rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink hover:bg-brass hover:text-ink">Request samples →</a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

const Panel = ({ children, className = "" }) => (
  <div className={`pointer-events-auto border border-bone/10 bg-ink/60 p-[clamp(22px,3vw,40px)] backdrop-blur-md ${className}`}>{children}</div>
);

// Scroll heights (vh) are tuned so each overlay lines up with its zone of the room.
export default function Showroom() {
  const gallery = useRef(null);
  const progress = useRef(0);
  const [live, setLive] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: gallery.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => { progress.current = self.progress; },
    });
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting));
    io.observe(gallery.current);
    return () => { st.kill(); io.disconnect(); };
  }, []);

  return (
    <>
      <Loader />
      <div className="fixed inset-0 z-0">
        <Canvas frameloop={live ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0.25, 6], fov: 45, near: 0.1, far: 60 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Scene progress={progress} onSelect={setSelected} />
        </Canvas>
      </div>

      <div ref={gallery} className="pointer-events-none relative z-10">
        {/* Intro — 100vh */}
        <section id="top" className="flex h-screen flex-col items-center justify-center gap-7 px-5 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[.42em] text-bone/75">The Shinho Global material room</span>
          <Lines as="h1" delay={0.6} lines={["Surfaces,", "made under", "your name."]}
            className="text-[clamp(56px,10vw,164px)] leading-[.86] font-medium [font-stretch:122%] tracking-[-.045em] [text-shadow:0_10px_60px_rgba(0,0,0,.6)]" />
          <span className="mt-6 font-mono text-[10px] uppercase tracking-[.3em] text-bone/60">Scroll to walk the room · Click a surface to inspect it</span>
        </section>

        {/* Role — 100vh */}
        <section id="role" className="flex h-screen items-center px-[clamp(20px,4vw,56px)]">
          <Reveal className="w-full max-w-[620px]">
            <Panel>
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-brass">Our role</span>
              <p className="mt-5 text-[clamp(24px,2.4vw,34px)] leading-[1.15] [font-stretch:108%] tracking-[-.015em]">
                The partner behind the surface — connecting proven Korean partner manufacturing with brands worldwide.
              </p>
              <ul className="mt-8 flex list-none flex-col">
                {ROLE.map((r, i) => (
                  <li key={r.k} className="grid grid-cols-[36px_1fr] gap-x-3 gap-y-1 border-t border-bone/12 py-4">
                    <span className="row-span-2 font-mono text-[11px] text-brass">0{i + 1}</span>
                    <span className="text-lg font-medium [font-stretch:112%]">{r.k}</span>
                    <span className="text-sm leading-[1.55] text-ash">{r.d}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </section>

        {/* Families — 180vh each, text pinned while the camera passes the panels */}
        {FAMILIES.map((f) => (
          <section key={f.id} id={f.id} className="relative h-[180vh]">
            <div className="sticky top-0 flex h-screen items-end px-[clamp(20px,4vw,56px)] pb-[clamp(72px,12vh,120px)]">
              <div className="flex max-w-[560px] flex-col gap-5 [text-shadow:0_6px_40px_rgba(0,0,0,.7)]">
                <span className="font-mono text-[11px] uppercase tracking-[.2em] text-brass">Family {f.n} / {String(FAMILIES.length).padStart(2, "0")}</span>
                <Lines lines={[f.name]} className="text-[clamp(44px,6.5vw,104px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.045em]" />
                <p className="text-[clamp(16px,1.3vw,18px)] leading-[1.55] text-bone/85">{f.lede}</p>
                <ul className="pointer-events-auto flex list-none flex-wrap gap-2">
                  {f.apps.map((a) => <li key={a} className="rounded-full border border-bone/25 bg-ink/40 px-3.5 py-1.5 text-[12px] backdrop-blur">{a}</li>)}
                </ul>
              </div>
            </div>
          </section>
        ))}

        {/* Partner capabilities — 160vh */}
        <section id="capabilities" className="relative h-[160vh]">
          <div className="sticky top-0 flex h-screen items-end justify-between gap-6 px-[clamp(20px,4vw,56px)] pb-[clamp(72px,12vh,120px)]">
            <Panel className="max-w-[520px]">
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-brass">Partner capabilities · Republic of Korea</span>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-[clamp(64px,7vw,112px)] leading-[.85] font-medium [font-stretch:122%] tracking-[-.05em]">{CAPABILITIES.years}</span>
                <span className="text-sm leading-[1.5] text-ash">years of manufacturing experience held by our partner.</span>
              </div>
              <p className="mt-5 text-sm leading-[1.6] text-bone/80">Manufacturing is carried out at partner facilities. SHINHO GLOBAL manages development, quality and international supply.</p>
              <ul className="mt-5 grid list-none grid-cols-1 gap-x-6 sm:grid-cols-2">
                {CAPABILITIES.processes.map((p) => <li key={p} className="border-t border-bone/12 py-2.5 text-[13px]">{p}</li>)}
              </ul>
            </Panel>
          </div>
        </section>
      </div>

      <Detail mat={selected} onClose={() => setSelected(null)} />
    </>
  );
}
