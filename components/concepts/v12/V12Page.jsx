"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import Helix, { TURNS } from "./Helix";
import SwissSections from "./SwissSections";
import Hud from "../shared/Hud";
import Chip2D from "../objects/Chip2D";
import { U } from "@/lib/materials";

const EASE = [0.6, 0, 0.2, 1];
const D = "font-semibold [font-stretch:122%] tracking-[-.05em]";

export default function V12Page() {
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const introO = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const [turn, setTurn] = useState(-1);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const t = v < 0.06 ? -1 : Math.min(TURNS.length - 1, Math.floor(((v - 0.06) / 0.94) * TURNS.length));
    setTurn((cur) => (cur === t ? cur : t));
  });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Hud tone="dark" />
      <section ref={hero} id="top" className="relative h-[420vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0"><Helix progress={scrollYProgress} onHover={setHover} onSelect={setSelected} selectedKey={selected?.key} /></div>

          <motion.div style={{ opacity: introO }} className="pointer-events-none absolute inset-x-[clamp(20px,4vw,64px)] bottom-[clamp(48px,9vh,100px)] flex flex-wrap items-end justify-between gap-6">
            <h1 className={`${D} text-[clamp(52px,8.4vw,150px)] leading-[.86] text-bone`}>
              {["The material", "code."].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[.06em]">
                  <motion.span className={`block ${i ? "text-brass" : ""}`} initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.3, ease: EASE, delay: 0.9 + i * 0.12 }}>{l}</motion.span>
                </span>
              ))}
            </h1>
            <p className="max-w-[340px] text-[16px] leading-[1.6] text-ash">Decorative surface films and polymer-based materials, from four film platforms. Scroll down the helix.</p>
          </motion.div>

          <div className="pointer-events-none absolute top-1/2 left-[clamp(20px,4vw,64px)] -translate-y-1/2">
            <AnimatePresence mode="wait">
              {turn >= 0 && (
                <motion.div key={turn} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.5, ease: EASE }} className="max-w-[300px]">
                  <span className="text-[13px] font-semibold tracking-[.04em] text-brass uppercase">Turn {turn + 1} / {TURNS.length}</span>
                  <p className={`${D} mt-2 text-[clamp(28px,3vw,48px)] leading-[.95] text-bone`}>{TURNS[turn].platform}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="pointer-events-none absolute right-[clamp(20px,4vw,64px)] bottom-[clamp(48px,9vh,100px)] text-right">
            <AnimatePresence>{hover && !selected && (
              <motion.div key={hover.code} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="block text-[13px] font-semibold text-brass">{hover.code}</span>
                <span className={`${D} block text-[26px] text-bone`}>{hover.name}</span>
              </motion.div>
            )}</AnimatePresence>
          </div>

          <AnimatePresence>
            {selected && (
              <motion.div key="sel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-ink/80 p-6 backdrop-blur-md" onClick={() => setSelected(null)}>
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: EASE }}
                  className="grid w-full max-w-[920px] grid-cols-1 items-center gap-10 md:grid-cols-[300px_1fr]" onClick={(e) => e.stopPropagation()} style={{ "--chip-hole": "var(--color-ink)" }}>
                  <motion.div initial={{ rotate: -8 }} animate={{ rotate: -2 }} transition={{ duration: 0.9, ease: EASE }} className="mx-auto w-[240px] md:w-full">
                    <Chip2D img={U(selected.img, 900)} name={selected.name} code={selected.code} />
                  </motion.div>
                  <div className="flex flex-col gap-6 text-bone">
                    <span className="text-[13px] font-semibold tracking-[.04em] text-brass uppercase">{selected.platform}</span>
                    <h2 className={`${D} text-[clamp(44px,5vw,84px)] leading-[.9]`}>{selected.name}</h2>
                    <dl className="border-t-2 border-bone">
                      {[["Code", selected.code], ["Finish", selected.finish], ["Applications", selected.apps]].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-6 border-b border-bone/20 py-3 text-[15px]"><dt className="font-semibold">{k}</dt><dd className="m-0 text-right text-ash">{v}</dd></div>
                      ))}
                    </dl>
                    <div className="flex flex-wrap gap-3">
                      <a href="#contact" onClick={() => setSelected(null)} className="bg-bone px-6 py-3 text-[15px] font-semibold text-ink hover:bg-brass hover:text-ink">Request this sample</a>
                      <button onClick={() => setSelected(null)} className="border-2 border-bone px-6 py-3 text-[15px] font-semibold">Close</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-[.18em] text-stone uppercase">Scroll · drag to turn · click a sample</span>
        </div>
      </section>
      <SwissSections />
    </>
  );
}
