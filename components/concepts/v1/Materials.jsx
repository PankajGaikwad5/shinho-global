"use client";

import { useEffect, useState } from "react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { FAMILIES, thumb } from "@/lib/brief";

// Props default to V1's own content, so `/` is unchanged. Other pages render THIS component with their
// own items rather than a copy of it. An item may carry `video` or `img`, `swatches` or `meta` lines.
export default function Materials({
  id = "materials",
  lines = ["Three families", "of surface."],
  lede = "Supplied from established collections or developed to your specification with our manufacturing partner.",
  items = FAMILIES,
  cta = "Explore the range →",
  ctaHref = "#",
  // Pages that put more words on a panel need a heavier ground under them. Default is V1's own gradient.
  scrim = "linear-gradient(180deg,rgba(11,11,12,.25) 0%,rgba(11,11,12,.1) 40%,rgba(11,11,12,.88) 100%)",
  // V1 shows three panels, wide enough that a closed one can keep its hidden detail in the layout. A page
  // with more (and therefore narrower) panels passes `compact`: there the hidden text rewraps into many
  // more lines, the stack grows taller than the panel and the name is clipped off the top. Default false,
  // so `/` keeps V1's behaviour exactly.
  compact = false,
  // V1 shows three panels, so its 44px name fits a collapsed one. Five panels are ~200px wide and the name
  // runs straight off the edge, so a page with more panels passes a smaller one. Default is V1's string.
  nameClass = "text-[clamp(28px,2.8vw,44px)] leading-none font-medium [font-stretch:118%] tracking-[-.025em]",
} = {}) {
  const [cap, setCap] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize); onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section id={id} className="bg-ink pt-[clamp(88px,10vw,140px)] text-bone">
      <div className="mx-auto mb-[clamp(40px,5vw,64px)] flex max-w-[1360px] flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[clamp(20px,4vw,56px)]">
        <Lines lines={lines} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
        <Reveal as="p" className="max-w-[360px] text-[15px] leading-[1.6] text-ash">{lede}</Reveal>
      </div>
      <div className="flex gap-0.5" style={{ flexDirection: narrow ? "column" : "row", height: narrow ? "auto" : "86vh" }}>
        {items.map((f, i) => {
          const open = narrow || cap === i;
          return (
            <div key={f.id} id={f.id} onMouseEnter={() => setCap(i)}
              className="relative min-h-[380px] overflow-hidden transition-[flex] duration-[.9s] ease-cine"
              style={{ flex: narrow ? "1 1 auto" : cap === i ? "2.6 1 0" : "1 1 0" }}>
              <div className={`absolute inset-0 transition-transform duration-[1.6s] ease-cine ${open ? "scale-100" : "scale-110"}`}>
                {f.video ? <Video media={f.video} active={open} /> : <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${f.img})` }} />}
              </div>
              <div className="absolute inset-0" style={{ background: scrim }} />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[18px] p-[clamp(22px,3vw,40px)]">
                <span className="font-mono text-[11px] tracking-[.14em] text-brass">{f.n}</span>
                <h3 className={nameClass}>{f.name}</h3>
                <div className="flex max-w-[460px] flex-col gap-[18px] transition-opacity duration-[.6s]"
                  style={{ opacity: open ? 1 : 0, ...(compact && !open ? { maxHeight: 0, overflow: "hidden" } : null) }}>
                  <p className="text-[15px] leading-[1.6] text-[#d6d2ca]">{f.lede}</p>
                  {f.mats && <div className="flex gap-1.5">{f.mats.slice(0, 5).map((m) => <span key={m.code} title={m.name} className="h-11 w-11 bg-cover bg-center outline outline-1 outline-offset-2 outline-bone/20" style={{ backgroundImage: `url(${thumb(m, 160)})` }} />)}</div>}
                  {/* Never uppercase these: CSS text-transform turns µ into Greek capital Mu, so "50 µm"
                      would render as "50 MM" and a technical figure would be wrong on the page. */}
                  {f.meta && <div className="flex flex-col gap-2">{f.meta.map((line) => <span key={line} className="text-[13px] leading-[1.5] text-bone/75">{line}</span>)}</div>}
                  {/* An item may carry its own `href`; otherwise every panel shares `ctaHref`, as V1 does. */}
                  <a href={f.href || ctaHref} className="self-start border-b border-bone pb-1 text-sm font-medium">{cta}</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
