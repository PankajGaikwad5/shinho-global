"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Video from "../shared/Video";
import { Reveal } from "../shared/Reveal";
import { VIDEO, IMG } from "@/lib/media";
import { U, MATS } from "@/lib/materials";

const AUDIENCE = [
  ["Manufacturers", "Films and finishes specified to your process."],
  ["OEMs", "Materials developed and produced under your name."],
  ["Converters", "Consistent supply for further processing."],
  ["Distributors", "A curated range backed by partner manufacturing."],
];

// Mixed strip of stills and moving footage that drifts across the screen.
const STRIP = [
  { img: U(MATS[6].img, 900), label: MATS[6].name },
  { video: VIDEO.metalLight, label: "Metallic reflection" },
  { img: U(MATS[8].img, 900), label: MATS[8].name },
  { img: U(MATS[17].img, 900), label: MATS[17].name },
  { video: VIDEO.marble, label: "Honed stone" },
  { img: U(MATS[1].img, 900), label: MATS[1].name },
  { img: U(MATS[11].img, 900), label: MATS[11].name },
  { video: VIDEO.engraved, label: "Relief finish" },
  { img: U(MATS[19].img, 900), label: MATS[19].name },
];

export default function About() {
  const frame = useRef(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1.04]);

  return (
    <section id="about" className="bg-bone text-[#151515]">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-start gap-[clamp(40px,6vw,96px)] px-[clamp(20px,4vw,56px)] py-[clamp(88px,11vw,160px)]">
        <Reveal className="flex flex-[1_1_380px] flex-col gap-3.5">
          <div ref={frame} className="relative aspect-[4/5] overflow-hidden bg-[#d8d2c8]">
            <motion.div className="absolute inset-[-10%] bg-cover bg-center" style={{ y, scale, backgroundImage: `url(${IMG.ceiling(1400)})` }} />
            <div className="absolute bottom-4 right-4 aspect-video w-[42%] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,.35)]">
              <Video media={VIDEO.slitter} />
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[.1em] text-[#76726b]">Architectural film application · Interior ceiling</span>
        </Reveal>

        <div className="flex flex-[1.35_1_480px] flex-col gap-14 pt-2">
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#5d5a55]">Who we are</span>
          <Reveal as="p" className="text-[clamp(30px,3.3vw,50px)] leading-[1.1] font-normal [font-stretch:108%] tracking-[-.02em] [text-wrap:pretty]">
            SHINHO GLOBAL is the partner behind the surface. We source, develop and supply specialist films and finishes — manufactured at partner facilities — for businesses that sell them under their own brand.
          </Reveal>
          <div className="flex flex-col">
            {AUDIENCE.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}
                className={`group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-[rgba(21,21,21,.2)] py-5 ${i === 3 ? "border-b" : ""}`}>
                <span className="text-[clamp(22px,2vw,28px)] font-medium [font-stretch:115%] transition-transform duration-500 ease-cine group-hover:translate-x-3">{t}</span>
                <span className="max-w-[360px] text-[15px] text-[#5d5a55]">{d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-ink py-3" aria-label="Material reel">
        <div className="flex w-max gap-3 [animation:marquee_70s_linear_infinite] hover:[animation-play-state:paused]">
          {[...STRIP, ...STRIP].map((s, i) => (
            <figure key={i} className="relative h-[clamp(180px,24vw,320px)] w-[clamp(240px,32vw,440px)] shrink-0 overflow-hidden">
              {s.video ? <Video media={s.video} /> : <div className="h-full w-full bg-cover bg-center transition-transform duration-[1.4s] ease-cine hover:scale-110" style={{ backgroundImage: `url(${s.img})` }} />}
              <figcaption className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[.12em] text-bone/85">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
