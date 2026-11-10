"use client";

import { useRef, useState } from "react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { VIDEO } from "@/lib/media";
import { CAPABILITIES } from "@/lib/brief";

const CLIPS = [VIDEO.liquidMetal, VIDEO.machinery, VIDEO.engraved, VIDEO.lathe, VIDEO.slitter, VIDEO.cutting];

// Partner capabilities + technical credibility. Hovering a process floats a footage preview next to the cursor.
export default function Capabilities() {
  const [hover, setHover] = useState(-1);
  const box = useRef(null), preview = useRef(null);

  const move = (e) => {
    const r = box.current.getBoundingClientRect();
    preview.current.style.transform = `translate(${e.clientX - r.left + 24}px, ${e.clientY - r.top - 90}px)`;
  };

  return (
    <section id="capabilities" className="bg-ink px-[clamp(20px,4vw,56px)] py-[clamp(96px,11vw,170px)] text-bone">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-[clamp(56px,7vw,96px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex max-w-[860px] flex-col gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">Partner capabilities</span>
            <Lines lines={["Proven processes,", "at partner facilities."]} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
          </div>
          <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">
            Manufacturing is carried out by our long-standing partner in the Republic of Korea. SHINHO GLOBAL manages development, quality and international supply.
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-[clamp(40px,6vw,96px)] lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
          <Reveal className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 border-t border-bone/15 pt-5">
              <span className="text-[clamp(88px,10vw,160px)] leading-[.85] font-medium [font-stretch:122%] tracking-[-.05em]">{CAPABILITIES.years}</span>
              <span className="text-sm leading-[1.55] text-ash">Years of manufacturing experience held by our Korean partner.</span>
            </div>
            <div className="flex flex-col gap-4 border-t border-bone/15 pt-5">
              <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ash">Testing &amp; quality control</span>
              <ul className="flex list-none flex-col">
                {CAPABILITIES.testing.map((t) => (
                  <li key={t} className="flex items-center gap-3 border-b border-bone/10 py-3 text-[15px]"><span className="h-1.5 w-1.5 rounded-full bg-brass" />{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div ref={box} onMouseMove={move} onMouseLeave={() => setHover(-1)} className="relative">
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-[.16em] text-ash">Processes</span>
            <ol className="list-none">
              {CAPABILITIES.processes.map((p, i) => (
                <li key={p} onMouseEnter={() => setHover(i)}
                  className="group flex cursor-default items-baseline gap-6 border-t border-bone/15 py-[clamp(16px,2vw,26px)] last:border-b">
                  <span className="font-mono text-[11px] text-brass">0{i + 1}</span>
                  <span className={`text-[clamp(26px,3.4vw,52px)] leading-none font-medium [font-stretch:118%] tracking-[-.03em] transition-[color,transform] duration-500 ease-cine ${hover === -1 || hover === i ? "text-bone" : "text-bone/25"} group-hover:translate-x-3`}>{p}</span>
                </li>
              ))}
            </ol>
            <div ref={preview} aria-hidden="true"
              className={`pointer-events-none absolute top-0 left-0 hidden aspect-video w-[300px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,.6)] transition-opacity duration-300 lg:block ${hover >= 0 ? "opacity-100" : "opacity-0"}`}>
              {CLIPS.map((c, i) => (
                <div key={i} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: hover === i ? 1 : 0 }}>
                  <Video media={c} active={hover === i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
