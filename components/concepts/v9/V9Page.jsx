"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Facility from "./Facility";
import { useAnchorOverlay } from "../kit/Anchor";
import Hud from "../shared/Hud";
import Documentary from "./Documentary";
import { Lines } from "../shared/Reveal";
import { thumb } from "@/lib/brief";
import { MATS } from "@/lib/materials";
import { VIDEO } from "@/lib/media";

// PLACEHOLDER stage copy. The facility is illustrative — not a depiction of a specific plant.
const STATIONS = [
  { t: "Raw materials & compounding", d: "Polymers, pigments and additives are blended to each film's formulation.", video: VIDEO.liquidSteam },
  { t: "Casting, coating & drying", d: "Films are cast, decorative and top layers applied, then cured through the drying oven.", video: VIDEO.factoryAerial },
  { t: "Inspection", d: "Colour, gloss, thickness and surface checked continuously against specification.", video: VIDEO.inspector },
  { t: "Slitting & rewinding", d: "Cut to width and rewound to the roll format your line needs.", video: VIDEO.slitter },
  { t: "Packing & dispatch", d: "Wrapped, palletised and shipped internationally — under your brand.", video: VIDEO.conveyor },
];
const PRODUCT = thumb(MATS.find((m) => m.name === "Natural Oak"), 1400);

export default function V9Page() {
  const [focus, setFocus] = useState(-1);
  const { onFrame, setEl } = useAnchorOverlay();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFocus(-1);
      if (e.key === "ArrowRight") setFocus((f) => Math.min(STATIONS.length - 1, f + 1));
      if (e.key === "ArrowLeft") setFocus((f) => Math.max(-1, f - 1));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const s = focus >= 0 ? STATIONS[focus] : null;

  return (
    <>
      <Hud />
      <section id="top" className="relative h-screen min-h-[700px] overflow-hidden bg-[#0f0d0b]">
        <div className="absolute inset-0"><Facility stations={STATIONS} focus={focus} onAnchor={onFrame} productUrl={PRODUCT} /></div>
        <div className="pointer-events-none absolute inset-0 z-[5]">
          {STATIONS.map((x, i) => (
            <button key={x.t} ref={setEl(i)} onClick={() => setFocus(focus === i ? -1 : i)} aria-label={x.t}
              className={`pointer-events-auto invisible absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,.45)] transition-[background,color] duration-300 ${focus === i ? "border-brass bg-brass text-ink" : "border-brass/80 bg-ink/80 text-brass backdrop-blur"}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,13,11,.75)_0%,transparent_42%),linear-gradient(0deg,rgba(15,13,11,.7)_0%,transparent_30%)]" />

        <div className="pointer-events-none absolute top-[clamp(100px,14vh,140px)] left-[clamp(20px,4vw,56px)] max-w-[540px]">
          <Lines as="h1" delay={1.2} lines={["Inside our", "partner facilities."]}
            className="text-[clamp(40px,5vw,84px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.045em]" />
          <p className="mt-5 max-w-[380px] text-[16px] leading-[1.6] text-ash">How your surface films are made in the Republic of Korea — from raw material to dispatch.</p>
        </div>

        {/* station strip */}
        <div className="absolute inset-x-[clamp(20px,4vw,56px)] bottom-12 flex flex-col gap-5">
          <AnimatePresence mode="wait">
            {s && (
              <motion.div key={focus} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }} className="max-w-[520px]">
                <span className="text-[14px] text-brass">Station {focus + 1} of {STATIONS.length}</span>
                <h2 className="mt-1 text-[clamp(26px,2.6vw,40px)] leading-none font-medium [font-stretch:115%]">{s.t}</h2>
                <p className="mt-3 text-[16px] leading-[1.6] text-ash">{s.d}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap items-center gap-2">
            {STATIONS.map((x, i) => (
              <button key={x.t} onClick={() => setFocus(focus === i ? -1 : i)}
                className={`rounded-full border px-4 py-2.5 text-[14px] backdrop-blur transition-colors duration-300 ${focus === i ? "border-brass bg-brass text-ink" : "border-bone/20 bg-ink/50 text-bone/85 hover:border-brass"}`}>
                <span className="mr-2 opacity-70">{i + 1}</span>{x.t}
              </button>
            ))}
            {focus >= 0 && <button onClick={() => setFocus(-1)} className="px-3 py-2.5 text-[14px] text-ash hover:text-bone">Overview ↺</button>}
          </div>
          <span className="text-[12px] text-stone">Illustrative partner facility · drag to turn · ← → to move between stations</span>
        </div>
      </section>
      <Documentary />
    </>
  );
}
