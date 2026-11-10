"use client";

import { useEffect, useState } from "react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { FAMILIES, thumb } from "@/lib/brief";

export default function Materials() {
  const [cap, setCap] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize); onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section id="materials" className="bg-ink pt-[clamp(88px,10vw,140px)] text-bone">
      <div className="mx-auto mb-[clamp(40px,5vw,64px)] flex max-w-[1360px] flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[clamp(20px,4vw,56px)]">
        <Lines lines={["Three families", "of surface."]} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
        <Reveal as="p" className="max-w-[360px] text-[15px] leading-[1.6] text-ash">Supplied from established collections or developed to your specification with our manufacturing partner.</Reveal>
      </div>
      <div className="flex gap-0.5" style={{ flexDirection: narrow ? "column" : "row", height: narrow ? "auto" : "86vh" }}>
        {FAMILIES.map((f, i) => {
          const open = narrow || cap === i;
          return (
            <div key={f.id} id={f.id} onMouseEnter={() => setCap(i)}
              className="relative min-h-[380px] overflow-hidden transition-[flex] duration-[.9s] ease-cine"
              style={{ flex: narrow ? "1 1 auto" : cap === i ? "2.6 1 0" : "1 1 0" }}>
              <div className={`absolute inset-0 transition-transform duration-[1.6s] ease-cine ${open ? "scale-100" : "scale-110"}`}>
                <Video media={f.video} active={open} />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,12,.25)_0%,rgba(11,11,12,.1)_40%,rgba(11,11,12,.88)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[18px] p-[clamp(22px,3vw,40px)]">
                <span className="font-mono text-[11px] tracking-[.14em] text-brass">{f.n}</span>
                <h3 className="text-[clamp(28px,2.8vw,44px)] leading-none font-medium [font-stretch:118%] tracking-[-.025em]">{f.name}</h3>
                <div className="flex max-w-[460px] flex-col gap-[18px] transition-opacity duration-[.6s]" style={{ opacity: open ? 1 : 0 }}>
                  <p className="text-[15px] leading-[1.6] text-[#d6d2ca]">{f.lede}</p>
                  <div className="flex gap-1.5">{f.mats.slice(0, 5).map((m) => <span key={m.code} title={m.name} className="h-11 w-11 bg-cover bg-center outline outline-1 outline-offset-2 outline-bone/20" style={{ backgroundImage: `url(${thumb(m, 160)})` }} />)}</div>
                  <a href="#" className="self-start border-b border-bone pb-1 text-sm font-medium">Explore the range →</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
