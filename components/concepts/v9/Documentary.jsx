"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Video from "../shared/Video";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { Reveal } from "../shared/Reveal";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";
import { VIDEO, IMG } from "@/lib/media";

// V9 sections: a footage-led documentary language.
const pad = "px-[clamp(20px,5vw,80px)]";
const H = "font-medium [font-stretch:115%] tracking-[-.04em]";

function Opening() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink text-bone">
      <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${IMG.facility(2000)})` }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink),transparent_30%,transparent_60%,var(--color-ink))]" />
      <div className={`relative mx-auto max-w-[1320px] ${pad} py-[clamp(120px,14vw,220px)]`}>
        <Reveal as="p" className={`${H} max-w-[1100px] text-[clamp(34px,4.6vw,76px)] leading-[1.02]`}>{ABOUT.statement}</Reveal>
        <div className="mt-[clamp(64px,8vw,120px)] grid grid-cols-2 gap-8 border-t border-bone/20 pt-10 md:grid-cols-4">
          {[["20+", "years of partner manufacturing"], [String(PLATFORMS.length), "film platforms"], [String(FINISHES.length), "finish technologies"], ["1", "clear route, sample to scale"]].map(([n, d], i) => (
            <Reveal key={d} delay={i * 0.08} className="flex flex-col gap-2">
              <span className={`${H} text-[clamp(56px,6vw,104px)] leading-none text-brass`}>{n}</span>
              <span className="max-w-[200px] text-[15px] leading-[1.5] text-ash">{d}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const REEL = [
  ["Raw materials & compounding", VIDEO.liquidSteam], ["Casting & coating", VIDEO.factoryAerial], ["Inspection", VIDEO.inspector],
  ["Slitting & rewinding", VIDEO.slitter], ["Packing & dispatch", VIDEO.conveyor],
];

function OnTheLine() {
  const [i, setI] = useState(0);
  return (
    <section className={`bg-char ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className={`${H} text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>On the line.</h2>
          <p className="max-w-[380px] text-[15px] leading-[1.7] text-ash">Footage from partner manufacturing in the Republic of Korea. Choose a stage.</p>
        </div>
        <div className="relative aspect-video overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
              <Video media={REEL[i][1]} />
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.6),transparent_35%)]" />
          <span className="absolute bottom-6 left-6 text-[clamp(20px,2vw,30px)] font-medium text-white">{String(i + 1).padStart(2, "0")} — {REEL[i][0]}</span>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-3">
          {REEL.map(([t, v], k) => (
            <button key={t} onClick={() => setI(k)} className={`group text-left transition-opacity ${k === i ? "opacity-100" : "opacity-55 hover:opacity-90"}`}>
              <span className="block aspect-video overflow-hidden bg-black"><span className="block h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${v.poster})` }} /></span>
              <span className={`mt-2 block border-t-2 pt-2 text-[13px] leading-tight ${k === i ? "border-brass" : "border-transparent"}`}>{t}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Panels() {
  const [on, setOn] = useState(0);
  return (
    <section id="materials" className="bg-ink py-[clamp(96px,11vw,170px)] text-bone">
      <div className={`mx-auto mb-10 max-w-[1320px] ${pad}`}>
        <h2 className={`${H} text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>What we supply.</h2>
      </div>
      <div className="flex h-[78vh] min-h-[520px] flex-col gap-1 md:flex-row">
        {PLATFORMS.map((p, i) => (
          <div key={p.name} onMouseEnter={() => setOn(i)} onClick={() => setOn(i)}
            className="relative min-h-[140px] overflow-hidden bg-char transition-[flex] duration-[900ms] ease-cine"
            style={{ flex: on === i ? "3 1 0" : "1 1 0" }}>
            {p.media.video ? <Video media={p.media.video} active={on === i} /> : <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${p.media.img})` }} />}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.8),transparent_55%)]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-[clamp(18px,2.4vw,36px)] text-white">
              <span className="text-[13px] text-brass">0{i + 1}</span>
              <h3 className={`${H} text-[clamp(22px,2.4vw,40px)] leading-[.98]`}>{p.name}</h3>
              <p className={`max-w-[420px] text-[15px] leading-[1.6] text-white/80 transition-opacity duration-500 ${on === i ? "opacity-100" : "opacity-0"}`}>{p.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Drift() {
  const rows = [FINISHES.slice(0, 6), FINISHES.slice(6)];
  return (
    <section className="overflow-hidden bg-char py-[clamp(80px,9vw,140px)] text-bone">
      <div className={`mx-auto mb-10 max-w-[1320px] ${pad}`}>
        <h2 className={`${H} text-[clamp(36px,4.4vw,72px)] leading-[.92]`}>Twelve surface finish technologies.</h2>
      </div>
      {rows.map((row, r) => (
        <div key={r} className="mb-3 flex w-max gap-3" style={{ animation: `marquee ${r ? 70 : 60}s linear infinite ${r ? "reverse" : ""}` }}>
          {[...row, ...row, ...row, ...row].map((f, i) => (
            <figure key={i} className="relative h-[clamp(160px,18vw,260px)] w-[clamp(240px,26vw,380px)] shrink-0 overflow-hidden">
              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${f.img})` }} />
              <figcaption className="absolute bottom-3 left-3 text-[14px] font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,.7)]">{f.name}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </section>
  );
}

function Partners() {
  return (
    <section id="oem" className={`bg-ink ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-black"><Video media={VIDEO.inspector} /></div>
        </div>
        <div className="flex flex-col gap-[clamp(64px,8vw,120px)]">
          <div className="flex flex-col gap-6">
            <h2 className={`${H} text-[clamp(40px,4.8vw,80px)] leading-[.92]`}>Built for OEM &amp; converter partnerships.</h2>
            {PARTNERS.intro.map((p) => <p key={p} className="text-[16px] leading-[1.75] text-ash">{p}</p>)}
          </div>
          {[["We work with", PARTNERS.workWith], ["Typical applications", PARTNERS.applications]].map(([t, list]) => (
            <Reveal key={t}>
              <span className="text-[14px] text-brass">{t}</span>
              <p className={`${H} mt-4 text-[clamp(22px,2.2vw,34px)] leading-[1.25] text-bone/90`}>{list.join(", ")}.</p>
            </Reveal>
          ))}
          <div id="process" className="scroll-mt-24">
            <span className="text-[14px] text-brass">From finish selection to scalable supply</span>
            <ol className="mt-6 list-none">
              {PROCESS.map((s, i) => (
                <Reveal as="li" key={s.t} className="grid grid-cols-[56px_1fr] gap-x-4 gap-y-1 border-t border-bone/15 py-6">
                  <span className={`${H} row-span-2 text-[34px] leading-none text-brass`}>{i + 1}</span>
                  <span className="text-[22px] font-medium">{s.t}</span>
                  <span className="text-[15px] leading-[1.65] text-ash">{s.d}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Enquiry() {
  return (
    <section id="contact" className="relative overflow-hidden text-bone">
      <div className="absolute inset-0"><Video media={VIDEO.cargoShip} /></div>
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-ink)_72%,transparent)]" />
      <div className={`relative mx-auto max-w-[1320px] ${pad} pt-[clamp(110px,13vw,200px)]`}>
        <div className="grid grid-cols-1 gap-[clamp(40px,5vw,96px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col gap-8">
            <h2 className={`${H} text-[clamp(52px,7vw,124px)] leading-[.88]`}>Supplied worldwide, under your name.</h2>
            <a href={`mailto:${EMAIL}`} className="self-start text-[18px] text-brass hover:text-bone">{EMAIL}</a>
          </div>
          <div className="bg-ink/85 p-[clamp(22px,3vw,44px)] backdrop-blur-md"><EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} /></div>
        </div>
        <footer className="mt-[clamp(96px,11vw,160px)] flex flex-wrap items-end justify-between gap-10 border-t border-bone/20 py-12">
          <Logo tone="light" height={44} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
          <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}

export default function Documentary() {
  return (<><Opening /><OnTheLine /><Panels /><Drift /><Partners /><Enquiry /></>);
}
