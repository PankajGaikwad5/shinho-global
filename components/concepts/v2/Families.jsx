"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { FAMILIES, thumb } from "@/lib/brief";

function Family({ f, i }) {
  const head = useRef(null);
  const { scrollYProgress } = useScroll({ target: head, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const dark = i % 2 === 0;

  return (
    <article id={f.id} className={dark ? "bg-ink text-bone" : "bg-char text-bone"}>
      <div ref={head} className="relative h-[78vh] min-h-[520px] overflow-hidden">
        <motion.div className="absolute inset-[-14%_0]" style={{ y }}><Video media={f.video} /></motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,12,.55)_0%,rgba(11,11,12,.05)_45%,rgba(11,11,12,.92)_100%)]" />
        <div className="absolute inset-x-[clamp(20px,4vw,56px)] bottom-[clamp(32px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[.2em] text-brass">Family {f.n} / {String(FAMILIES.length).padStart(2, "0")}</span>
            <Lines lines={[f.name]} className="text-[clamp(48px,8vw,136px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.045em]" />
          </div>
          <span className="text-outline hidden text-[clamp(120px,16vw,260px)] leading-[.8] font-light [font-stretch:125%] md:block">{f.n}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-[clamp(40px,5vw,80px)] px-[clamp(20px,4vw,56px)] py-[clamp(64px,8vw,120px)] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
        <Reveal className="flex flex-col gap-10 lg:sticky lg:top-28 lg:self-start">
          <p className="text-[clamp(22px,2vw,30px)] leading-[1.25] [font-stretch:108%] tracking-[-.01em] [text-wrap:pretty]">{f.lede}</p>
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ash">Applications</span>
            <ul className="flex list-none flex-wrap gap-2">
              {f.apps.map((a) => <li key={a} className="rounded-full border border-bone/20 px-4 py-2 text-[13px] text-bone/85">{a}</li>)}
            </ul>
          </div>
          <a href="#contact" className="self-start border-b border-bone pb-1 text-[15px] font-medium">Request samples →</a>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {f.mats.map((m, k) => (
            <Reveal key={m.code} delay={(k % 3) * 0.08} className={`group relative overflow-hidden bg-[#1c1c1c] ${k === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[3/4]"}`}>
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-cine group-hover:scale-110" style={{ backgroundImage: `url(${thumb(m, k === 0 ? 1400 : 700)})` }} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_50%,rgba(0,0,0,.75)_100%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-3 bottom-3 flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[.12em] text-brass">{m.code}</span>
                <span className="text-[15px] font-medium [font-stretch:110%]">{m.name}</span>
                <span className="max-h-0 overflow-hidden text-[12px] text-bone/70 transition-[max-height] duration-500 group-hover:max-h-10">{m.finish}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Families() {
  return (
    <section id="materials" aria-label="Material families">
      <div className="bg-ink px-[clamp(20px,4vw,56px)] pt-[clamp(96px,11vw,160px)] pb-[clamp(48px,6vw,80px)] text-bone">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex flex-col gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">Materials</span>
            <Lines lines={["Families", "of surface."]} className="text-[clamp(44px,6.5vw,104px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
          </div>
          <nav className="flex flex-col gap-2" aria-label="Families">
            {FAMILIES.map((f) => (
              <a key={f.id} href={`#${f.id}`} className="group flex items-baseline gap-4 border-t border-bone/15 pt-2 text-[clamp(18px,1.6vw,22px)] font-medium [font-stretch:112%]">
                <span className="font-mono text-[11px] text-brass">{f.n}</span>
                <span className="transition-transform duration-500 ease-cine group-hover:translate-x-2">{f.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
      {FAMILIES.map((f, i) => <Family key={f.id} f={f} i={i} />)}
    </section>
  );
}
