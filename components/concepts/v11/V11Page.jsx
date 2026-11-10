"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Tunnel, { ZONES } from "./Tunnel";
import RollSections from "./RollSections";
import Hud from "../shared/Hud";
import { U } from "@/lib/materials";

const EASE = [0.6, 0, 0.2, 1];
const D = "font-medium [font-stretch:118%] tracking-[-.045em]";

export default function V11Page() {
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const introO = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const [zone, setZone] = useState(-1);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  // which platform stretch of the tunnel we're in
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const z = v < 0.08 ? -1 : v > 0.96 ? ZONES.length : Math.min(ZONES.length - 1, Math.floor(((v - 0.08) / 0.88) * ZONES.length));
    setZone((cur) => (cur === z ? cur : z));
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Hud />
      <section ref={hero} id="top" className="relative h-[420vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0"><Tunnel progress={scrollYProgress} selected={selected} onSelect={setSelected} onHover={setHover} zone={zone} /></div>

          <motion.div style={{ opacity: introO }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 px-5 text-center">
            <h1 className={`${D} text-[clamp(52px,9vw,160px)] leading-[.88] text-bone [text-shadow:0_8px_60px_rgba(0,0,0,.7)]`}>
              {["Every finish,", "on a roll."].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[.06em]">
                  <motion.span className={`block ${i ? "text-brass" : ""}`} initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.4, ease: EASE, delay: 0.9 + i * 0.15 }}>{l}</motion.span>
                </span>
              ))}
            </h1>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="text-[12px] tracking-[.24em] text-ash uppercase">Scroll to travel through the collection</motion.span>
          </motion.div>

          {/* platform we're passing through */}
          <div className="pointer-events-none absolute bottom-[clamp(48px,8vh,90px)] left-[clamp(20px,4vw,56px)]">
            <AnimatePresence mode="wait">
              {zone >= 0 && zone < ZONES.length && (
                <motion.div key={zone} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: EASE }}>
                  <span className="text-[12px] tracking-[.22em] text-brass uppercase">Platform {zone + 1} of {ZONES.length}</span>
                  <p className={`${D} mt-2 text-[clamp(30px,3.6vw,60px)] leading-[.95] text-bone [text-shadow:0_4px_40px_rgba(0,0,0,.8)]`}>{ZONES[zone].platform}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="pointer-events-none absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(48px,8vh,90px)] flex flex-col items-end gap-2">
            {ZONES.map((z, i) => <span key={z.platform} className={`h-[2px] transition-all duration-500 ${zone === i ? "w-14 bg-brass" : "w-6 bg-bone/25"}`} />)}
            <AnimatePresence>{hover && !selected && (
              <motion.span key={hover.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-[15px] text-bone">{hover.name} · <span className="text-brass">{hover.code}</span></motion.span>
            )}</AnimatePresence>
          </div>

          {/* clicked roll: unrolls across the screen */}
          <AnimatePresence>
            {selected && (
              <motion.div key={selected.key} className="absolute inset-0 z-20" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.5 } }}>
                <motion.div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${U(selected.img, 2200)})` }}
                  initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.3, ease: EASE }} />
                <motion.span aria-hidden="true" className="absolute top-0 bottom-0 w-[6px] bg-brass shadow-[0_0_40px_#c9a965]" initial={{ left: "0%" }} animate={{ left: "100%" }} transition={{ duration: 1.3, ease: EASE }} />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.1)_55%)]" />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
                  className="absolute bottom-[clamp(48px,10vh,110px)] left-[clamp(20px,4vw,56px)] flex max-w-[520px] flex-col gap-5 text-white">
                  <span className="text-[12px] tracking-[.22em] text-brass uppercase">{selected.platform}</span>
                  <h2 className={`${D} text-[clamp(48px,6vw,104px)] leading-[.9]`}>{selected.name}</h2>
                  <p className="text-[16px] text-white/80">{selected.code} · {selected.finish} · {selected.apps}</p>
                  <div className="flex flex-wrap gap-3">
                    <a href="#contact" onClick={() => setSelected(null)} className="rounded-full bg-brass px-6 py-3 text-[15px] font-medium text-ink hover:bg-bone hover:text-ink">Request this finish</a>
                    <button onClick={() => setSelected(null)} className="rounded-full border border-white/40 px-6 py-3 text-[15px]">Roll it back</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[.2em] text-stone uppercase">Scroll · click any roll to unroll it</span>
        </div>
      </section>
      <RollSections />
    </>
  );
}
