"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { Reveal } from "../shared/Reveal";
import { ZONES } from "./Tunnel";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";
import { IMG } from "@/lib/media";
import { U } from "@/lib/materials";

// V11 sections: everything unrolls — horizontal wipes, full-width lengths of film, roll ends.
const pad = "px-[clamp(20px,5vw,80px)]";
const H = "font-medium [font-stretch:118%] tracking-[-.045em]";

function Wipe({ children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.35"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  return <motion.div ref={ref} style={{ clipPath: clip }} className={className}>{children}</motion.div>;
}

function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  return (
    <section id="about" className="bg-ink pt-[clamp(110px,13vw,200px)] text-bone">
      <div className={`mx-auto max-w-[1360px] ${pad}`}>
        <Wipe><p className={`${H} text-[clamp(34px,4.6vw,78px)] leading-[1.02]`}>{ABOUT.statement}</p></Wipe>
        <div className="mt-14 grid grid-cols-1 gap-8 text-[16px] leading-[1.75] text-ash md:grid-cols-2 lg:w-2/3">
          {ABOUT.body.map((p) => <Reveal key={p} as="p">{p}</Reveal>)}
        </div>
      </div>
      <div ref={ref} className="mt-[clamp(72px,9vw,140px)] h-[clamp(220px,32vw,460px)] overflow-hidden">
        <motion.div style={{ x, backgroundImage: `url(${IMG.ceiling(2400)})` }} className="h-full w-[140%] bg-cover bg-center" />
      </div>
    </section>
  );
}

function Length({ p, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "center 0.55"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);
  const edge = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="relative h-[clamp(300px,46vh,520px)]">
      <motion.div style={{ clipPath: clip, backgroundImage: `url(${U(ZONES[i].mats[0].img, 2000)})` }} className="absolute inset-0 bg-cover bg-center" />
      <motion.span aria-hidden="true" style={{ left: edge }} className="absolute top-0 bottom-0 w-[3px] -translate-x-1/2 bg-brass shadow-[0_0_24px_#c9a965]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.65),rgba(0,0,0,.15)_55%,rgba(0,0,0,.45))]" />
      <div className={`relative mx-auto flex h-full max-w-[1360px] flex-col justify-end gap-4 ${pad} pb-8 text-white md:flex-row md:items-end md:justify-between`}>
        <h3 className={`${H} max-w-[640px] text-[clamp(36px,4.6vw,80px)] leading-[.92]`}>{p.name}</h3>
        <p className="max-w-[380px] text-[16px] leading-[1.65] text-white/85">{p.d}</p>
      </div>
    </div>
  );
}

function Lengths() {
  return (
    <section id="materials" className="bg-ink py-[clamp(110px,13vw,200px)] text-bone">
      <div className={`mx-auto mb-12 max-w-[1360px] ${pad}`}>
        <h2 className={`${H} text-[clamp(48px,6.4vw,112px)] leading-[.9]`}>Four lengths<br />of film.</h2>
      </div>
      <div className="flex flex-col gap-2">{PLATFORMS.map((p, i) => <Length key={p.name} p={p} i={i} />)}</div>
    </section>
  );
}

function RollEnds() {
  return (
    <section className={`bg-char ${pad} py-[clamp(110px,13vw,200px)] text-bone`}>
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 className={`${H} text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>Twelve finishes,<br />wound to order.</h2>
          <p className="max-w-[380px] text-[16px] leading-[1.7] text-ash">Decorative and functional surface technologies for architectural, interior, signage and specialty film markets.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {FINISHES.map((f) => (
            <Reveal key={f.name} className="group flex flex-col items-center gap-4 text-center">
              <div className="relative aspect-square w-full max-w-[180px] rounded-full bg-cover bg-center shadow-[0_24px_50px_-18px_rgba(0,0,0,.8)] transition-transform duration-[1.2s] ease-cine group-hover:rotate-[120deg]"
                style={{ backgroundImage: `url(${f.img})` }}>
                <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle,rgba(0,0,0,0)_0_3px,rgba(0,0,0,.14)_3px_4px)]" />
                <div className="absolute inset-[30%] rounded-full bg-[#a07f55] shadow-[inset_0_2px_6px_rgba(0,0,0,.5)]" />
                <div className="absolute inset-[38%] rounded-full bg-char shadow-[inset_0_3px_8px_rgba(0,0,0,.8)]" />
              </div>
              <span className="text-[15px] font-medium">{f.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Rolling() {
  const rows = [PARTNERS.workWith, PARTNERS.applications];
  return (
    <section id="oem" className="overflow-hidden bg-ink py-[clamp(110px,13vw,200px)] text-bone">
      <div className={`mx-auto mb-14 grid max-w-[1360px] grid-cols-1 gap-8 ${pad} lg:grid-cols-2`}>
        <h2 className={`${H} text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>Built for OEM &amp; converter partnerships.</h2>
        <div className="flex flex-col gap-5 text-[16px] leading-[1.75] text-ash">{PARTNERS.intro.map((p) => <p key={p}>{p}</p>)}</div>
      </div>
      {rows.map((row, r) => (
        <div key={r} className="flex w-max items-center gap-10 py-4" style={{ animation: `marquee ${r ? 80 : 70}s linear infinite ${r ? "reverse" : ""}` }}>
          {[...row, ...row].map((x, i) => (
            <span key={i} className={`flex items-center gap-10 whitespace-nowrap text-[clamp(28px,3.4vw,56px)] ${H} ${r ? "text-outline" : ""}`}>
              {x}<span className="h-3 w-3 rounded-full border-2 border-brass" aria-hidden="true" />
            </span>
          ))}
        </div>
      ))}
    </section>
  );
}

const ICONS = [
  <svg key="0" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="20" y="10" width="24" height="40" rx="3" /><circle cx="32" cy="16" r="2" /><line x1="20" y1="42" x2="44" y2="42" /></svg>,
  <svg key="1" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="14" y="16" width="30" height="36" rx="2" /><rect x="20" y="10" width="30" height="36" rx="2" /></svg>,
  <svg key="2" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="18" cy="32" rx="8" ry="12" /><path d="M18 20h28c4.4 0 8 5.4 8 12s-3.6 12-8 12H18" /><ellipse cx="18" cy="32" rx="3" ry="4.5" /></svg>,
  <svg key="3" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="8" y="46" width="48" height="6" /><circle cx="20" cy="36" r="9" /><circle cx="44" cy="36" r="9" /><circle cx="32" cy="18" r="9" /><circle cx="20" cy="36" r="3" /><circle cx="44" cy="36" r="3" /><circle cx="32" cy="18" r="3" /></svg>,
];

function Process() {
  return (
    <section id="process" className={`bg-char ${pad} py-[clamp(110px,13vw,200px)] text-bone`}>
      <div className="mx-auto max-w-[1360px]">
        <h2 className={`${H} mb-[clamp(56px,7vw,110px)] text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>From one swatch<br />to a full pallet.</h2>
        <ol className="grid list-none grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.1} className="flex flex-col gap-5">
              <span className="block text-brass" style={{ width: 56 + i * 12, height: 56 + i * 12 }}>{ICONS[i]}</span>
              <span className="text-[22px] font-medium">{s.t}</span>
              <span className="text-[15px] leading-[1.7] text-ash">{s.d}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={`bg-ink ${pad} pt-[clamp(110px,13vw,200px)] text-bone`}>
      <div className="mx-auto max-w-[1360px]">
        <Wipe><h2 className={`${H} text-[clamp(56px,9vw,160px)] leading-[.86]`}>Unroll your range.</h2></Wipe>
        <div className="mt-[clamp(56px,7vw,110px)] grid grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-6">
            <p className="max-w-[400px] text-[18px] leading-[1.6] text-ash">Share your application, volumes and markets. We come back with materials, samples and a route to supply.</p>
            <a href={`mailto:${EMAIL}`} className="self-start text-[18px] text-brass hover:text-bone">{EMAIL}</a>
          </div>
          <EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} />
        </div>
        <footer className="mt-[clamp(96px,11vw,160px)] flex flex-wrap items-end justify-between gap-10 border-t border-bone/15 py-12">
          <Logo tone="light" height={44} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
          <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}

export default function RollSections() {
  return (<><About /><Lengths /><RollEnds /><Rolling /><Process /><Contact /></>);
}
