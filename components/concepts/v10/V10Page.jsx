"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useProgress } from "@react-three/drei";
import Orbit, { RINGS, scrollRing } from "./Orbit";
import { useAnchorOverlay } from "../kit/Anchor";
import { PLATFORMS } from "@/lib/site";
import OrbitSections from "./OrbitSections";
import Hud from "../shared/Hud";
import Logo from "../shared/Logo";

const EASE = [0.6, 0, 0.2, 1];
const ROMAN = ["I", "II", "III", "IV"];
const DISPLAY = "font-display font-light [font-stretch:118%] tracking-[-.035em]";

// Logo + progress while textures load, then a slow fade into space.
function Intro() {
  const { progress, active } = useProgress();
  const [min, setMin] = useState(false);
  useEffect(() => { const id = setTimeout(() => setMin(true), 1400); return () => clearTimeout(id); }, []);
  const done = min && !active && progress >= 100;
  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: EASE }}
          className="fixed inset-0 z-[96] flex flex-col items-center justify-center gap-8 bg-[#060608]">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE }}><Logo tone="light" height={64} /></motion.div>
          <div className="h-px w-[180px] bg-white/10"><div className="h-px bg-brass transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function V10Page() {
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const introO = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);
  const [ring, setRing] = useState(-1);
  const [sRing, setSRing] = useState(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => { const r = scrollRing(v); setSRing((c) => (c === r ? c : r)); });
  const shown = ring >= 0 ? ring : sRing;
  const { onFrame, setEl } = useAnchorOverlay();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setSelected(null); setRing(-1); } };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Intro />
      <Hud />
      <section ref={hero} id="top" className="relative h-[480vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0"><Orbit progress={scrollYProgress} selected={selected} onSelect={setSelected} onHover={setHover} focusRing={ring} onAnchor={onFrame} /></div>
          {/* ring names, positioned over the 3D each frame */}
          <div className="pointer-events-none absolute inset-0">
            {RINGS.map((r, i) => (
              <span key={r.name} ref={setEl(i)}
                className="invisible absolute top-0 left-0 whitespace-nowrap text-[clamp(11px,.9vw,13px)] tracking-[.22em] text-[#e9dfc8] uppercase transition-opacity duration-500 [text-shadow:0_2px_12px_#000]"
                style={{ opacity: shown >= 0 ? (shown === i ? 1 : 0.12) : 0.85 }}>{r.name}</span>
            ))}
          </div>

          <motion.div style={{ opacity: introO, y: introY }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-7 px-5 text-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 1.2 }} className="text-[13px] tracking-[.32em] text-ash uppercase">Decorative surface films · polymer-based materials</motion.span>
            <h1 className={`${DISPLAY} text-[clamp(52px,8.6vw,152px)] leading-[.9] text-bone`}>
              {["Every surface,", "in orbit."].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[.06em]">
                  <motion.span className={`block ${i ? "text-brass" : ""}`} initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.5, ease: EASE, delay: 1.7 + i * 0.15 }}>{l}</motion.span>
                </span>
              ))}
            </h1>
          </motion.div>

          {/* ring navigator */}
          <nav aria-label="Platforms" className="absolute top-1/2 left-[clamp(20px,4vw,56px)] hidden -translate-y-1/2 flex-col gap-1 md:flex">
            {RINGS.map((r, i) => (
              <button key={r.name} onClick={() => { setSelected(null); setRing(ring === i ? -1 : i); }}
                className={`group flex items-baseline gap-4 py-2 text-left transition-colors duration-300 ${ring === i ? "text-bone" : "text-bone/45 hover:text-bone/85"}`}>
                <span className={`w-6 text-[13px] ${ring === i ? "text-brass" : ""}`}>{ROMAN[i]}</span>
                <span className="text-[14px] tracking-[.01em]">{r.name}</span>
              </button>
            ))}
            <button onClick={() => setRing(-1)} className={`mt-3 ml-10 text-left text-[12px] tracking-[.18em] uppercase transition-opacity ${ring >= 0 ? "text-brass opacity-100" : "pointer-events-none opacity-0"}`}>All orbits</button>
          </nav>

          <div className="pointer-events-none absolute bottom-[clamp(48px,8vh,90px)] left-[clamp(20px,4vw,56px)] max-w-[460px]">
            <AnimatePresence mode="wait">
              {shown >= 0 && !selected && (
                <motion.div key={shown} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: EASE }}
                  className="rounded-[16px] border border-bone/10 bg-ink/60 p-6 backdrop-blur-xl">
                  <span className="text-[12px] tracking-[.22em] text-brass uppercase">Ring {ROMAN[shown]} of IV</span>
                  <p className={`${DISPLAY} mt-2 text-[clamp(28px,2.8vw,44px)] leading-[1] text-bone`}>{PLATFORMS[shown].name}</p>
                  <p className="mt-3 text-[15px] leading-[1.6] text-ash">{PLATFORMS[shown].d}</p>
                  <p className="mt-4 text-[13px] text-stone">Select any sample in the ring to bring it close.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(48px,8vh,90px)] text-right">
            <AnimatePresence mode="wait">
              {hover && !selected && (
                <motion.div key={hover.code} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <span className="block text-[12px] tracking-[.18em] text-brass uppercase">{hover.platform}</span>
                  <span className={`${DISPLAY} block text-[28px] leading-tight text-bone`}>{hover.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[.2em] text-stone uppercase">Scroll to enter · drag to spin · select a sample</span>

          <AnimatePresence>
            {selected && (
              <motion.aside key={selected.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
                className="absolute top-1/2 right-[clamp(20px,4vw,56px)] flex w-[min(380px,calc(100vw-40px))] -translate-y-1/2 flex-col gap-6 text-bone">
                <span className="text-[12px] tracking-[.18em] text-brass uppercase">{selected.platform}</span>
                <h2 className={`${DISPLAY} text-[clamp(40px,4vw,64px)] leading-[.95]`}>{selected.name}</h2>
                <dl className="flex flex-col">
                  {[["Code", selected.code], ["Finish", selected.finish], ["Applications", selected.apps]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-t border-bone/12 py-3 text-[15px]">
                      <dt className="text-stone">{k}</dt><dd className="m-0 text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-3">
                  <a href="#contact" onClick={() => setSelected(null)} className="rounded-full bg-brass px-6 py-3 text-[15px] font-medium text-ink hover:bg-bone hover:text-ink">Request this sample</a>
                  <button onClick={() => setSelected(null)} className="rounded-full border border-bone/30 px-6 py-3 text-[15px]">Back to orbit</button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </section>
      <OrbitSections />
    </>
  );
}
