"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Fan, { BLADES } from "./Fan";
import FanSections from "./FanSections";
import Hud from "../shared/Hud";
import { CATL } from "@/lib/materials";

const EASE = [0.6, 0, 0.2, 1];
const D = "font-medium [font-stretch:118%] tracking-[-.045em]";

export default function V13Page() {
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const introO = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(-1);
  const sel = selected >= 0 ? BLADES[selected] : null;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelected(-1);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Hud />
      <section ref={hero} id="top" className="relative h-[380vh] bg-ink">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0"><Fan progress={scrollYProgress} selected={selected} onSelect={setSelected} onHover={setHover} /></div>

          <motion.div style={{ opacity: introO }} className="pointer-events-none absolute top-[clamp(110px,16vh,170px)] left-[clamp(20px,4vw,56px)] max-w-[620px]">
            <h1 className={`${D} text-[clamp(48px,7.4vw,128px)] leading-[.88] text-bone`}>
              {["Open the", "sample deck."].map((l, i) => (
                <span key={l} className="block overflow-hidden pb-[.06em]">
                  <motion.span className={`block ${i ? "text-brass" : ""}`} initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.3, ease: EASE, delay: 0.9 + i * 0.12 }}>{l}</motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-6 max-w-[380px] text-[16px] leading-[1.6] text-ash">Decorative surface films in every finish. Scroll to fan it open and leaf through.</motion.p>
          </motion.div>

          <div className="pointer-events-none absolute right-[clamp(20px,4vw,56px)] bottom-[clamp(48px,8vh,90px)] text-right">
            <AnimatePresence>{hover && !sel && (
              <motion.div key={hover.code} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span className="block text-[12px] tracking-[.18em] text-brass uppercase">{hover.family}</span>
                <span className={`${D} block text-[28px] text-bone`}>{hover.name}</span>
              </motion.div>
            )}</AnimatePresence>
          </div>

          <AnimatePresence>
            {sel && (
              <motion.aside key={sel.code} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
                className="absolute top-1/2 right-[clamp(20px,4vw,56px)] flex w-[min(380px,calc(100vw-40px))] -translate-y-1/2 flex-col gap-6 text-bone">
                <span className="text-[12px] tracking-[.18em] text-brass uppercase">{CATL[sel.cat]}</span>
                <h2 className={`${D} text-[clamp(40px,4vw,64px)] leading-[.95]`}>{sel.name}</h2>
                <dl>
                  {[["Code", sel.code], ["Finish", sel.finish], ["Applications", sel.apps]].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-t border-bone/12 py-3 text-[15px]"><dt className="text-stone">{k}</dt><dd className="m-0 text-right">{v}</dd></div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-3">
                  <a href="#contact" onClick={() => setSelected(-1)} className="rounded-full bg-brass px-6 py-3 text-[15px] font-medium text-ink hover:bg-bone hover:text-ink">Request this blade</a>
                  <button onClick={() => setSelected(-1)} className="rounded-full border border-bone/30 px-6 py-3 text-[15px]">Back to the deck</button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[.2em] text-stone uppercase">Scroll to fan · drag to leaf · click to pull a blade</span>
        </div>
      </section>
      <FanSections />
    </>
  );
}
