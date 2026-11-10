"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Video from "../shared/Video";
import { VIDEO } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

// Placeholder copy for the concept, built from the original site's manufacturing stages.
const CH = [
  { n: "01", h: "Compounding & raw materials", d: "Resins, pigments and additives are compounded to the formulation each film demands.", v: VIDEO.liquidSteam },
  { n: "02", h: "Production line", d: "Cast on established lines run by our Korean partner — more than twenty years of process knowledge.", v: VIDEO.factoryAerial },
  { n: "03", h: "Coating & processing", d: "Decorative layers, top coats and adhesive systems are applied, cured and slit to width.", v: VIDEO.slitter },
  { n: "04", h: "Process control", d: "Colour, gloss, thickness and adhesion are measured against your specification, batch to batch.", v: VIDEO.inspector },
  { n: "05", h: "Inspection & dispatch", d: "Inspected, packed and shipped internationally — under your brand.", v: VIDEO.cargoShip },
];

// Pinned documentary sequence: each chapter wipes up over the last as you scroll.
export default function Chapters() {
  const root = useRef(null), bar = useRef(null);
  const layers = useRef([]), inner = useRef([]);
  const [shown, setShown] = useState([0, 1]); // [active, next] — only these videos play

  useEffect(() => {
    const n = CH.length;
    let last = "0,1";
    const st = ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "bottom bottom",
      onUpdate: (self) => {
        const f = self.progress * (n - 1);
        for (let i = 1; i < n; i++) {
          const local = Math.min(1, Math.max(0, f - (i - 1)));
          // refs can be momentarily null (re-render / unmount) while ScrollTrigger still fires
          if (layers.current[i]) layers.current[i].style.clipPath = `inset(${((1 - local) * 100).toFixed(2)}% 0 0 0)`;
          if (inner.current[i]) inner.current[i].style.transform = `translateY(${((1 - local) * -18).toFixed(2)}%) scale(${(1.15 - local * 0.15).toFixed(3)})`;
        }
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        const a = Math.min(n - 1, Math.round(f)), b = Math.min(n - 1, Math.floor(f) + 1);
        const key = `${a},${b}`;
        if (key !== last) { last = key; setShown([a, b]); }
      },
    });
    return () => st.kill();
  }, []);

  const [active] = shown;

  return (
    <section id="chapters" ref={root} className="relative bg-black" style={{ height: `${CH.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {CH.map((c, i) => (
          <div key={c.n} ref={(el) => (layers.current[i] = el)} className="absolute inset-0 overflow-hidden" style={{ zIndex: i, clipPath: i ? "inset(100% 0 0 0)" : "none" }}>
            <div ref={(el) => (inner.current[i] = el)} className="absolute inset-0 will-change-transform">
              <Video media={c.v} active={shown.includes(i)} />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.45)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,.1)_55%,rgba(0,0,0,.85)_100%)]" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex flex-col justify-end px-[clamp(20px,4vw,56px)] pb-[clamp(56px,9vh,96px)]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div key={active} className="max-w-[860px] animate-[fadeUp_1s_cubic-bezier(.6,0,.2,1)]">
              <span className="font-mono text-[11px] uppercase tracking-[.2em] text-brass">Chapter {CH[active].n} / 05</span>
              <h2 className="mt-4 text-[clamp(44px,7.5vw,128px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.04em]">{CH[active].h}</h2>
              <p className="mt-6 max-w-[520px] text-[clamp(16px,1.4vw,19px)] leading-[1.55] text-bone/80">{CH[active].d}</p>
            </div>
            <span key={`n${active}`} className="text-outline hidden text-[clamp(120px,18vw,300px)] leading-[.8] font-light [font-stretch:125%] tracking-[-.05em] md:block animate-[fadeUp_1.2s_cubic-bezier(.6,0,.2,1)]">{CH[active].n}</span>
          </div>
        </div>

        <div className="absolute inset-x-[clamp(20px,4vw,56px)] top-24 z-20 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[.16em] text-bone/70">
          <span>The making</span>
          <div className="h-px flex-1 bg-bone/20"><div ref={bar} className="h-px origin-left scale-x-0 bg-bone" /></div>
          <span>{CH[active].n} / 05</span>
        </div>
      </div>
    </section>
  );
}
