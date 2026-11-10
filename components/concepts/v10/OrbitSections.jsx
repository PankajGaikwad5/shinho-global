"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import Video from "../shared/Video";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import Chip2D from "../objects/Chip2D";
import { Reveal } from "../shared/Reveal";
import { RINGS } from "./Orbit";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";
import { U } from "@/lib/materials";
import { VIDEO } from "@/lib/media";

const ROMAN = ["I", "II", "III", "IV"];
const pad = "px-[clamp(20px,6vw,96px)]";

function OrbitLines({ className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 600" className={`pointer-events-none absolute ${className}`} fill="none">
      {[[480, 150, -8], [420, 210, 6], [340, 260, -14]].map(([rx, ry, rot], i) => (
        <ellipse key={i} cx="500" cy="300" rx={rx} ry={ry} transform={`rotate(${rot} 500 300)`} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>
  );
}

function Statement() {
  return (
    <section id="about" className={`relative overflow-hidden bg-ink ${pad} py-[clamp(140px,18vw,260px)] text-bone`}>
      <OrbitLines className="top-1/2 left-1/2 w-[min(1400px,140vw)] -translate-x-1/2 -translate-y-1/2 text-brass/15" />
      <Reveal as="p" className="relative mx-auto max-w-[1120px] text-center font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(36px,5vw,80px)] leading-[1.06] tracking-[-.01em]">
        Shinho Global is a specialist international supply partner for <em className="not-italic text-brass">decorative surface films</em> and related polymer-based materials.
      </Reveal>
      <div className="relative mx-auto mt-[clamp(64px,8vw,120px)] grid max-w-[920px] grid-cols-1 gap-10 text-[16px] leading-[1.8] text-ash md:grid-cols-2">
        {ABOUT.body.map((p, i) => <Reveal key={i} delay={i * 0.1} as="p">{p}</Reveal>)}
      </div>
    </section>
  );
}

function Fan({ mats }) {
  const angles = [-14, -5, 4, 13];
  return (
    <div className="group relative mx-auto h-[220px] w-[240px]">
      {mats.slice(0, 4).map((m, i) => (
        <div key={m.code} className="absolute bottom-0 left-1/2 w-[118px] origin-[50%_115%] transition-transform duration-700 ease-cine"
          style={{ transform: `translateX(-50%) rotate(${angles[i]}deg)`, "--spread": `${angles[i] * 2}deg` }}>
          <div className="transition-transform duration-700 ease-cine group-hover:[transform:rotate(var(--spread))_translateY(-8px)]">
            <Chip2D img={U(m.img, 400)} name={m.name} code={m.code} style={{ "--chip-hole": "var(--color-char)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Platforms() {
  return (
    <section id="materials" className={`bg-char ${pad} py-[clamp(120px,14vw,220px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-[clamp(64px,8vw,120px)] flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(56px,8vw,136px)] leading-[.9] tracking-[-.02em]">Four <em className="not-italic text-brass">orbits.</em></h2>
          <p className="max-w-[380px] text-[16px] leading-[1.7] text-ash">A focused material platform for decorative, architectural, printable and specialty film applications.</p>
        </div>
        {PLATFORMS.map((p, i) => (
          <Reveal key={p.name} className="grid grid-cols-1 items-center gap-8 border-t border-bone/10 py-[clamp(40px,5vw,72px)] md:grid-cols-[80px_minmax(0,1.1fr)_minmax(0,.9fr)_260px]">
            <span className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[40px] leading-none text-brass">{ROMAN[i]}</span>
            <h3 className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(36px,4vw,64px)] leading-[.98]">{p.name}</h3>
            <p className="max-w-[380px] text-[16px] leading-[1.7] text-ash">{p.d}</p>
            <Fan mats={RINGS[i].mats} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinishBoard() {
  return (
    <section className={`bg-ink ${pad} pb-[clamp(120px,14vw,220px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(44px,5.6vw,92px)] leading-[.95]">Twelve <em className="not-italic text-brass">finishes</em>, one board.</h2>
          <p className="max-w-[420px] text-[16px] leading-[1.7] text-ash">Decorative and functional finishes for architectural, interior, signage and specialty film markets.</p>
        </div>
        <div className="rounded-[18px] border border-bone/8 bg-[#141419] bg-[radial-gradient(rgba(255,255,255,.06)_1.2px,transparent_1.4px)] [background-size:22px_22px] p-[clamp(20px,3vw,44px)]"
          style={{ "--chip-hole": "#141419" }}>
          <div className="grid grid-cols-3 gap-[clamp(14px,2vw,28px)] sm:grid-cols-4 lg:grid-cols-6">
            {FINISHES.map((f, i) => (
              <Reveal key={f.name} delay={(i % 6) * 0.05} className="transition-transform duration-500 ease-cine hover:-translate-y-2 hover:rotate-[-1.5deg]">
                <Chip2D img={f.img} name={f.name} />
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-4 text-[12px] text-stone">Swatch imagery is placeholder until the client&rsquo;s sample photography is available.</p>
      </div>
    </section>
  );
}

function Manufacturing() {
  return (
    <section className="relative h-[92vh] min-h-[560px] overflow-hidden bg-black text-white">
      <Video media={VIDEO.factoryAerial} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,8,.55),rgba(6,6,8,.1)_40%,rgba(6,6,8,.85))]" />
      <div className={`absolute inset-x-0 bottom-0 ${pad} pb-[clamp(48px,6vw,96px)]`}>
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-end gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)]">
          <Reveal as="p" className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(32px,3.8vw,60px)] leading-[1.06]">
            Made at long-standing <em className="not-italic text-brass">partner facilities</em> in the Republic of Korea — twenty years of process behind every roll.
          </Reveal>
          <div className="grid grid-cols-3 gap-6 border-t border-white/20 pt-6">
            {[["20+", "years of partner manufacturing"], ["4", "film platforms"], ["12", "finish technologies"]].map(([n, d]) => (
              <div key={d} className="flex flex-col gap-2">
                <span className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(40px,4vw,64px)] leading-none">{n}</span>
                <span className="text-[13px] leading-[1.4] text-white/70">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Partnerships() {
  const n = PARTNERS.workWith.length;
  return (
    <section id="oem" className={`bg-ink ${pad} py-[clamp(120px,14vw,220px)] text-bone`}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-[clamp(64px,8vw,120px)] lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[620px]">
          <div className="absolute inset-[6%] rounded-full border border-brass/30" />
          <div className="absolute inset-[24%] rounded-full border border-bone/10" />
          <div className="absolute inset-0 flex items-center justify-center"><span className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(26px,2.6vw,40px)]">Shinho Global</span></div>
          {PARTNERS.workWith.map((w, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2, x = 50 + Math.cos(a) * 44, y = 50 + Math.sin(a) * 44;
            return (
              <span key={w} className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center" style={{ left: `${x}%`, top: `${y}%` }}>
                <span className="h-2 w-2 rounded-full bg-brass shadow-[0_0_12px_#c2a466]" />
                <span className="w-[130px] text-[13px] leading-[1.35] text-bone/85">{w}</span>
              </span>
            );
          })}
        </div>
        <div className="flex flex-col gap-10">
          <h2 className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(44px,5.4vw,88px)] leading-[.95]">Built for OEM &amp; <em className="not-italic text-brass">converter</em> partnerships.</h2>
          {PARTNERS.intro.map((p) => <Reveal key={p} as="p" className="max-w-[520px] text-[16px] leading-[1.8] text-ash">{p}</Reveal>)}
          <Reveal className="border-t border-bone/10 pt-8">
            <span className="mb-4 block text-[14px] text-stone">Typical applications</span>
            <p className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(22px,2vw,30px)] leading-[1.45]">
              {PARTNERS.applications.map((a, i) => <span key={a}>{a}{i < PARTNERS.applications.length - 1 && <span className="mx-3 text-brass">·</span>}</span>)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const ARC = { w: 1200, h: 240, d: "M 20 220 Q 600 -100 1180 220" };
const qb = (t) => { const [x0, y0, cx, cy, x1, y1] = [20, 220, 600, -100, 1180, 220]; const u = 1 - t; return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]; };

function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const ts = [0.08, 0.36, 0.64, 0.92];
  return (
    <section id="process" className={`bg-char ${pad} py-[clamp(120px,14vw,220px)] text-bone`}>
      <div ref={ref} className="mx-auto max-w-[1320px]">
        <h2 className="mb-[clamp(56px,7vw,110px)] text-center font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(48px,6.4vw,108px)] leading-[.92]">From sample <em className="not-italic text-brass">to scale.</em></h2>
        <div className="relative hidden md:block" style={{ aspectRatio: `${ARC.w} / ${ARC.h + 200}` }}>
          <svg viewBox={`0 0 ${ARC.w} ${ARC.h}`} className="absolute inset-x-0 top-0 w-full" fill="none" aria-hidden="true">
            <path d={ARC.d} stroke="currentColor" className="text-bone/12" strokeWidth="1.2" />
            <motion.path d={ARC.d} stroke="#c2a466" strokeWidth="1.6" style={{ pathLength: scrollYProgress }} />
          </svg>
          {PROCESS.map((s, i) => {
            const [x, y] = qb(ts[i]);
            return (
              <div key={s.t} className="absolute flex w-[22%] -translate-x-1/2 flex-col items-center gap-3 text-center" style={{ left: `${(x / ARC.w) * 100}%`, top: `${(y / (ARC.h + 200)) * 100}%` }}>
                <span className="-mt-[7px] h-3.5 w-3.5 rounded-full border-2 border-brass bg-char" />
                <span className="mt-2 font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(24px,2.2vw,34px)]">{s.t}</span>
                <span className="text-[14px] leading-[1.6] text-ash">{s.d}</span>
              </div>
            );
          })}
        </div>
        <ol className="flex list-none flex-col gap-10 md:hidden">
          {PROCESS.map((s, i) => (
            <li key={s.t} className="border-l border-brass/50 pl-6">
              <span className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[18px] text-brass">{ROMAN[i]}</span>
              <span className="block font-display font-light [font-stretch:118%] tracking-[-.03em] text-[30px]">{s.t}</span>
              <span className="block text-[15px] leading-[1.6] text-ash">{s.d}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Enquiry() {
  return (
    <section id="contact" className={`relative overflow-hidden bg-ink ${pad} pt-[clamp(120px,14vw,220px)] text-bone`}>
      <OrbitLines className="-top-40 right-[-30%] w-[1100px] text-brass/10" />
      <div className="relative mx-auto max-w-[1320px]">
        <h2 className="font-display font-light [font-stretch:118%] tracking-[-.03em] text-[clamp(64px,10vw,180px)] leading-[.86] tracking-[-.02em]">Request <em className="not-italic text-brass">a sample.</em></h2>
        <div className="mt-[clamp(56px,7vw,110px)] grid grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-8">
            <p className="max-w-[400px] font-display font-light [font-stretch:118%] tracking-[-.03em] text-[26px] leading-[1.3]">Tell us your application, volumes and markets — we come back with materials, samples and a route to supply.</p>
            <a href={`mailto:${EMAIL}`} className="text-[18px] text-brass hover:text-bone">{EMAIL}</a>
          </div>
          <EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} />
        </div>
        <footer className="mt-[clamp(100px,12vw,180px)] flex flex-wrap items-end justify-between gap-10 border-t border-bone/10 py-12">
          <Logo tone="light" height={44} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
          <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}

export default function OrbitSections() {
  return (<><Statement /><Platforms /><FinishBoard /><Manufacturing /><Partnerships /><Process /><Enquiry /></>);
}
