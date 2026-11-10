"use client";

import { useEffect, useState } from "react";
import Diorama from "./Diorama";
import { useAnchorOverlay } from "../kit/Anchor";
import Hud from "../shared/Hud";
import Technical from "./Technical";
import { Lines } from "../shared/Reveal";
import { FAMILIES, thumb } from "@/lib/brief";
import { VIDEO } from "@/lib/media";

// PLACEHOLDER copy, built from the original site's manufacturing stages. Illustrative facility — not an exact plant.
const STATIONS = [
  { t: "Compounding & raw materials", d: "Resins, pigments and additives are compounded to each film's formulation.", video: VIDEO.liquidSteam },
  { t: "Casting & coating", d: "Films are cast and decorative layers, top coats and adhesive systems applied.", video: VIDEO.factoryAerial },
  { t: "Inspection & process control", d: "Colour, gloss, thickness and adhesion checked against your specification.", video: VIDEO.inspector },
  { t: "Slitting & rewinding", d: "Cut to width and rewound to the roll format your line needs.", video: VIDEO.slitter },
  { t: "Packing & dispatch", d: "Packed and shipped internationally — under your brand.", video: VIDEO.conveyor },
];
const FILM = thumb(FAMILIES[0].mats[1], 1200);

export default function V7Page() {
  const [focus, setFocus] = useState(-1);
  const { onFrame, setEl } = useAnchorOverlay();
  const s = focus >= 0 ? STATIONS[focus] : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFocus(-1);
      if (e.key === "ArrowRight") setFocus((f) => Math.min(STATIONS.length - 1, f + 1));
      if (e.key === "ArrowLeft") setFocus((f) => Math.max(-1, f - 1));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Hud />
      <section id="top" className="relative h-screen min-h-[680px] overflow-hidden bg-[radial-gradient(ellipse_at_55%_60%,var(--color-char)_0%,var(--color-ink)_70%)]">
        <div className="absolute inset-0"><Diorama stations={STATIONS} focus={focus} onAnchor={onFrame} filmUrl={FILM} /></div>
        {/* station hotspots, positioned over the 3D each frame */}
        <div className="pointer-events-none absolute inset-0 z-[5]">
          {STATIONS.map((x, i) => (
            <button key={x.t} ref={setEl(i)} onClick={() => setFocus(focus === i ? -1 : i)} aria-label={`Station ${i + 1}: ${x.t}`}
              className={`pointer-events-auto invisible absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[12px] shadow-[0_6px_20px_rgba(0,0,0,.4)] transition-[background,color] duration-300 ${focus === i ? "border-brass bg-brass text-ink" : "border-brass/70 bg-ink/80 text-brass backdrop-blur"}`}>
              0{i + 1}
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute top-[clamp(96px,13vh,130px)] left-[clamp(20px,4vw,56px)] max-w-[520px]">
          <Lines as="h1" delay={1.2} lines={["Inside our", "partner facilities."]}
            className="text-[clamp(38px,4.6vw,76px)] leading-[.92] font-medium [font-stretch:122%] tracking-[-.045em]" />
          <p className="mt-4 max-w-[380px] text-[15px] leading-[1.6] text-ash">How your surfaces are made in the Republic of Korea — explore the line, station by station.</p>
        </div>

        <aside className="absolute bottom-[clamp(56px,8vh,90px)] left-[clamp(20px,4vw,56px)] w-[min(400px,calc(100vw-40px))] border border-bone/12 bg-ink/75 p-5 backdrop-blur-xl">
          <ol className="flex list-none flex-col">
            {STATIONS.map((x, i) => (
              <li key={x.t}>
                <button onClick={() => setFocus(focus === i ? -1 : i)}
                  className={`flex w-full items-baseline gap-3 border-b border-bone/10 py-2.5 text-left text-[14px] transition-colors ${focus === i ? "text-brass" : "text-bone/80 hover:text-bone"}`}>
                  <span className="font-mono text-[10px] text-brass">0{i + 1}</span>{x.t}
                </button>
                {focus === i && <p className="animate-[fadeUp_.5s_cubic-bezier(.6,0,.2,1)] py-3 text-[14px] leading-[1.55] text-ash">{s.d}</p>}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[.12em] text-stone">
            <span>Illustrative · Partner facility, Korea</span>
            {focus >= 0 ? <button onClick={() => setFocus(-1)} className="text-bone hover:text-brass">Overview ↺</button> : <span>Drag to turn</span>}
          </div>
        </aside>
      </section>
      <Technical />
    </>
  );
}
