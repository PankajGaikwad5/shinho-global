"use client";

import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import Chip2D from "../objects/Chip2D";
import { Reveal } from "../shared/Reveal";
import { TURNS } from "./Helix";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";
import { IMG } from "@/lib/media";
import { U } from "@/lib/materials";

// V12 sections: Swiss / architectural — strict 12-column grid, heavy black type, thick rules, generous white.
const pad = "px-[clamp(20px,4vw,64px)]";
const H = "font-semibold [font-stretch:122%] tracking-[-.05em]";
const num = "[-webkit-text-stroke:1.5px_var(--color-bone)] text-transparent font-semibold [font-stretch:125%]";

function Index({ n, label }) {
  return (
    <div className="col-span-12 mb-10 flex items-baseline justify-between border-t-[3px] border-bone pt-3 text-[13px] font-semibold tracking-[.04em] uppercase">
      <span>{label}</span><span>{n}</span>
    </div>
  );
}

function About() {
  return (
    <section id="about" className={`bg-ink ${pad} py-[clamp(110px,12vw,190px)] text-bone`}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6">
        <Index n="01" label="About" />
        <span className={`${num} col-span-12 text-[clamp(96px,12vw,200px)] leading-[.8] md:col-span-3`}>01</span>
        <div className="col-span-12 flex flex-col gap-10 md:col-span-9">
          <Reveal as="p" className={`${H} text-[clamp(32px,4.2vw,70px)] leading-[1]`}>{ABOUT.statement}</Reveal>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-9">
            <div className="flex flex-col gap-5 text-[16px] leading-[1.7] text-ash md:col-span-5">{ABOUT.body.map((p) => <p key={p}>{p}</p>)}</div>
            <div className="aspect-[3/4] bg-cover bg-center md:col-span-4" style={{ backgroundImage: `url(${IMG.ceiling(1200)})` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Platforms() {
  return (
    <section id="materials" className={`bg-ink ${pad} pb-[clamp(110px,12vw,190px)] text-bone`}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6">
        <Index n="02" label="What we supply" />
        {PLATFORMS.map((p, i) => (
          <Reveal key={p.name} className="col-span-12 grid grid-cols-12 items-center gap-x-6 gap-y-6 border-b-2 border-bone py-[clamp(28px,3.4vw,52px)]">
            <span className="col-span-2 text-[15px] font-semibold md:col-span-1">0{i + 1}</span>
            <h3 className={`${H} col-span-10 text-[clamp(32px,4.4vw,76px)] leading-[.92] md:col-span-6`}>{p.name}</h3>
            <p className="col-span-12 text-[15px] leading-[1.65] text-ash md:col-span-2">{p.d}</p>
            <div className="col-span-12 grid grid-cols-3 gap-2 md:col-span-3" style={{ "--chip-hole": "var(--color-ink)" }}>
              {TURNS[i].mats.slice(0, 3).map((m) => <Chip2D key={m.code} img={U(m.img, 400)} name={m.name} code={m.code} />)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinishIndex() {
  return (
    <section className={`bg-char ${pad} py-[clamp(110px,12vw,190px)] text-bone`}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6">
        <Index n="03" label="Surface finish technologies" />
        <h2 className={`${H} col-span-12 mb-14 text-[clamp(44px,6vw,104px)] leading-[.9] md:col-span-8`}>Twelve finishes.</h2>
        <div className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {FINISHES.map((f, i) => (
            <Reveal key={f.name} delay={(i % 4) * 0.05} className="group flex flex-col gap-3">
              <div className="aspect-square overflow-hidden"><div className="h-full w-full bg-cover bg-center grayscale-[.2] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0" style={{ backgroundImage: `url(${f.img})` }} /></div>
              <div className="flex items-baseline justify-between border-t-2 border-bone pt-2">
                <span className="text-[15px] font-semibold">{f.name}</span>
                <span className="text-[12px] font-semibold text-brass">{String(i + 1).padStart(2, "0")}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section id="oem" className={`bg-ink ${pad} py-[clamp(110px,12vw,190px)] text-bone`}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 gap-y-12">
        <Index n="04" label="OEM & converter partnerships" />
        <h2 className={`${H} col-span-12 text-[clamp(40px,5.4vw,92px)] leading-[.92] md:col-span-7`}>Built for OEM &amp; converter partnerships.</h2>
        <div className="col-span-12 flex flex-col gap-5 text-[16px] leading-[1.7] text-ash md:col-span-4 md:col-start-9">{PARTNERS.intro.map((p) => <p key={p}>{p}</p>)}</div>
        {[["We work with", PARTNERS.workWith], ["Typical applications", PARTNERS.applications]].map(([t, list]) => (
          <div key={t} className="col-span-12 md:col-span-6">
            <span className="text-[13px] font-semibold tracking-[.04em] uppercase">{t}</span>
            <ol className="mt-4 list-none border-t-2 border-bone">
              {list.map((x, i) => (
                <li key={x} className="grid grid-cols-[48px_1fr] border-b border-bone/25 py-3.5 text-[clamp(17px,1.5vw,21px)] font-medium">
                  <span className="text-[13px] font-semibold text-brass">{String(i + 1).padStart(2, "0")}</span>{x}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className={`bg-char ${pad} py-[clamp(110px,12vw,190px)] text-bone`}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6">
        <Index n="05" label="Process" />
        <h2 className={`${H} col-span-12 mb-16 text-[clamp(44px,6vw,104px)] leading-[.9]`}>Selection to scale.</h2>
        {PROCESS.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.08} className="col-span-12 flex flex-col gap-4 border-t-[3px] border-bone pt-4 pb-10 sm:col-span-6 lg:col-span-3">
            <span className={`${num} text-[clamp(88px,9vw,150px)] leading-[.82]`}>{i + 1}</span>
            <span className="text-[22px] font-semibold">{s.t}</span>
            <span className="text-[15px] leading-[1.65] text-ash">{s.d}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={`bg-[#111318] ${pad} pt-[clamp(110px,12vw,190px)] text-[#f2efe8]`}
      style={{ "--color-ink": "#111318", "--color-char": "#1b1d22", "--color-bone": "#f2efe8", "--color-ash": "#a9a49b", "--color-stone": "#8a857c", "--color-brass": "#c2a466" }}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 gap-y-12">
        <Index n="06" label="Commercial enquiries" />
        <h2 className={`${H} col-span-12 text-[clamp(56px,9vw,168px)] leading-[.86]`}>Start a range.</h2>
        <div className="col-span-12 flex flex-col gap-6 md:col-span-4">
          <p className="text-[18px] leading-[1.6] text-ash">Share your application, volumes and markets. We come back with materials, samples and a route to supply.</p>
          <a href={`mailto:${EMAIL}`} className="self-start text-[18px] font-semibold text-brass hover:text-bone">{EMAIL}</a>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6"><EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} /></div>
        <footer className="col-span-12 mt-16 flex flex-wrap items-end justify-between gap-10 border-t-[3px] border-[#f2efe8] py-12">
          <Logo tone="light" height={44} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-medium">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
          <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}

export default function SwissSections() {
  return (<><About /><Platforms /><FinishIndex /><Partners /><Process /><Contact /></>);
}
