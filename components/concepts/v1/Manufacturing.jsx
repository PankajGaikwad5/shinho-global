"use client";

import { useEffect, useRef, useState } from "react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { VIDEO } from "@/lib/media";

const SHOTS = [
  ["Compounding & raw materials", VIDEO.liquidSteam],
  ["Production line", VIDEO.factoryAerial],
  ["Coating & processing", VIDEO.slitter],
  ["Process control", VIDEO.inspector],
  ["Inspection & dispatch", VIDEO.conveyor],
];

const FACTS = [
  ["30+ years", "Manufacturing expertise behind every surface, through our Korean partner.", true],
  ["Partner-operated facilities", "SHINHO GLOBAL manages development, quality and international supply."],
  ["Made to specification", "From sampling to volume runs, produced against your requirements."],
];

// Same structure as the original, but the five "shots" are now moving footage (only the active one plays).
// Props default to V1's own content. `shots` entries may carry a video or a still image; `timecode` and the
// recording dot belong to real footage, so pages showing stills pass `live={false}`.
export default function Manufacturing({
  id = "manufacturing",
  eyebrow = "Manufacturing",
  lines = ["Three decades of making,", "in partnership."],
  lede = "Production is delivered through our long-standing Korean manufacturing partner, with over 30 years of manufacturing expertise — established processes, at scale and to specification.",
  shots = SHOTS,
  facts = FACTS,
  hud = "Partner facility · Republic of Korea",
  live = true,
} = {}) {
  const [shot, setShot] = useState(0);
  const tcRef = useRef(null);

  useEffect(() => {
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (tcRef.current) {
        const t = (now - t0) / 1000, p = (n) => String(Math.floor(n)).padStart(2, "0");
        tcRef.current.textContent = `${p(t / 3600)}:${p((t / 60) % 60)}:${p(t % 60)}:${p((t * 25) % 25)}`;
      }
    };
    raf = requestAnimationFrame(tick);
    const timer = setInterval(() => setShot((s) => (s + 1) % shots.length), 6000);
    return () => { cancelAnimationFrame(raf); clearInterval(timer); };
  }, [shots.length]);

  return (
    <section id={id} className="bg-ink py-[clamp(88px,10vw,140px)] text-bone">
      <div className="mx-auto mb-12 flex max-w-[1360px] flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[clamp(20px,4vw,56px)]">
        <div className="flex max-w-[820px] flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">{eyebrow}</span>
          <Lines lines={lines} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
        </div>
        <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">{lede}</Reveal>
      </div>

      <div className="relative aspect-[2.2/1] min-h-[420px] w-full overflow-hidden bg-black">
        {shots.map(([title, v], i) => (
          <div key={title} className="absolute inset-0 transition-[opacity,transform] duration-[1.6s,8s] ease-[ease,linear]"
            style={{ opacity: i === shot ? 1 : 0, transform: i === shot ? "scale(1.08)" : "scale(1)" }}>
            {v && v.src ? <Video media={v} active={i === shot} /> : <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${v && v.img ? v.img : v})` }} />}
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.5)_0%,rgba(0,0,0,0)_25%,rgba(0,0,0,0)_62%,rgba(0,0,0,.7)_100%)]" />
        <div className="absolute inset-x-[clamp(20px,4vw,56px)] top-6 flex justify-between gap-4 font-mono text-[11px] uppercase tracking-[.12em] text-bone/85">
          <span className="flex items-center gap-2.5">{live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4473a]" />}{hud}</span>
          {live && <span ref={tcRef}>00:00:00:00</span>}
        </div>
        <div className="absolute inset-x-[clamp(20px,4vw,56px)] bottom-7 flex flex-col gap-[18px]">
          <div className="flex flex-wrap items-baseline gap-[18px]">
            <span className="font-mono text-xs text-bone/70">0{shot + 1} / {String(shots.length).padStart(2, "0")}</span>
            <span key={shot} className="text-[clamp(22px,2.6vw,38px)] font-medium [font-stretch:118%] tracking-[-.02em] animate-[fadeUp_.9s_cubic-bezier(.6,0,.2,1)]">{shots[shot][0]}</span>
          </div>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${shots.length},minmax(0,1fr))` }}>
            {shots.map(([title], i) => (
              <button key={title} onClick={() => setShot(i)} aria-label={title} className="h-4 cursor-pointer">
                <div className="h-0.5 bg-bone/20">
                  <div className="h-0.5 bg-bone" style={{ width: i <= shot ? "100%" : "0%", transition: i === shot ? "width 6s linear" : "none" }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-[1360px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-8 px-[clamp(20px,4vw,56px)]">
        {facts.map(([t, d, big], i) => (
          <Reveal key={t} delay={i * 0.1} className="flex flex-col gap-2.5 border-t border-bone/15 pt-5">
            <span className={big ? "text-[clamp(40px,4vw,60px)] leading-none font-medium [font-stretch:122%] tracking-[-.04em]" : "text-xl font-medium [font-stretch:112%]"}>{t}</span>
            <span className="text-sm leading-[1.55] text-ash">{d}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
