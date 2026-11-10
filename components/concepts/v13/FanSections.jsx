"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { Reveal } from "../shared/Reveal";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";
import { MATS, U } from "@/lib/materials";

// V13 sections: pages of a sample book — stacked sheets, index tabs down the right edge, CSS fans.
const H = "font-medium [font-stretch:115%] tracking-[-.04em]";
const TABS = [["about", "About"], ["materials", "Platforms"], ["finishes", "Finishes"], ["oem", "Partners"], ["process", "Process"], ["contact", "Enquire"]];
const PLATFORM_MATS = [
  ["Calacatta", "Natural Oak", "Smoked Walnut", "Nero Marquina", "Rosa Stone"], ["Silver Metallic", "Linear Silver", "Pearl Satin", "Brushed Steel", "Spun Metal"],
  ["Graphite Matte", "Nero Gloss", "Soft Grey Matte", "Forged Grey", "Light Oak"], ["Oxide", "Verdigris", "Amber Onyx", "Fluted Ash", "Raw Concrete"],
].map((l) => l.map((n) => MATS.find((m) => m.name === n)));

// Index tabs, fixed to the right edge (desktop).
function Tabs() {
  const [on, setOn] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    TABS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="Sample book index" className="fixed top-1/2 right-0 z-[60] hidden -translate-y-1/2 flex-col gap-1 lg:flex">
      {TABS.map(([id, label]) => (
        <a key={id} href={`#${id}`}
          className={`rounded-l-[8px] px-3 py-3 text-[11px] tracking-[.18em] uppercase transition-[background,color,transform] duration-300 [writing-mode:vertical-rl] ${on === id ? "-translate-x-1 bg-brass text-ink hover:text-ink" : "bg-char text-bone/70 hover:text-bone"}`}>
          {label}
        </a>
      ))}
    </nav>
  );
}

// A sheet of the book.
function Page({ id, n, label, children, className = "" }) {
  return (
    <section id={id} className="scroll-mt-6 px-[clamp(12px,2.5vw,40px)] pb-6">
      <div className={`relative mx-auto max-w-[1440px] rounded-[18px] bg-char px-[clamp(20px,4.5vw,72px)] py-[clamp(72px,8vw,130px)] text-bone shadow-[0_-30px_60px_-30px_rgba(0,0,0,.7)] ${className}`}>
        <div className="mb-[clamp(40px,5vw,72px)] flex items-baseline justify-between border-b border-bone/12 pb-4 text-[12px] tracking-[.18em] text-stone uppercase">
          <span>{label}</span><span className="text-brass">Page {n}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function MiniFan({ mats, w = 46, h = 220, spread = 12 }) {
  return (
    <div className="group relative mx-auto" style={{ width: w * 5, height: h + 20 }}>
      {mats.map((m, i) => {
        const a = (i - (mats.length - 1) / 2) * spread;
        return (
          <div key={m.code} className="absolute bottom-0 left-1/2 origin-[50%_92%] overflow-hidden rounded-[8px] bg-[#f3efe7] shadow-[0_10px_30px_-10px_rgba(0,0,0,.7)] transition-transform duration-700 ease-cine group-hover:[transform:translateX(-50%)_rotate(var(--a2))]"
            style={{ width: w, height: h, transform: `translateX(-50%) rotate(${a}deg)`, "--a2": `${a * 1.6}deg` }}>
            <div className="h-[78%] bg-cover bg-center" style={{ backgroundImage: `url(${U(m.img, 300)})` }} />
            <div className="h-[22%] border-t-2 border-[#b99a5b]" />
            <span className="absolute bottom-[6%] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-char" />
          </div>
        );
      })}
    </div>
  );
}

function About() {
  return (
    <Page id="about" n="02" label="About Shinho Global">
      <div className="grid grid-cols-1 gap-[clamp(40px,6vw,110px)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)]">
        <div className="flex flex-col gap-8">
          <Reveal as="p" className={`${H} text-[clamp(32px,4.2vw,70px)] leading-[1.02]`}>{ABOUT.statement}</Reveal>
          <div className="grid grid-cols-1 gap-6 text-[16px] leading-[1.75] text-ash md:grid-cols-2">{ABOUT.body.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-[12px] tracking-[.18em] text-stone uppercase">Built for buyers who need</span>
          {ABOUT.buyers.map((b) => <span key={b} className="border-b border-bone/12 pb-3 text-[17px]">{b}</span>)}
        </div>
      </div>
    </Page>
  );
}

function Platforms() {
  return (
    <Page id="materials" n="06" label="What we supply">
      <h2 className={`${H} mb-[clamp(48px,6vw,96px)] text-[clamp(44px,6vw,104px)] leading-[.9]`}>Four film platforms.</h2>
      <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
        {PLATFORMS.map((p, i) => (
          <Reveal key={p.name} className="grid grid-cols-1 items-end gap-8 rounded-[14px] border border-bone/10 bg-ink/40 p-[clamp(20px,2.6vw,36px)] sm:grid-cols-[auto_1fr]">
            <MiniFan mats={PLATFORM_MATS[i]} />
            <div className="flex flex-col gap-3">
              <span className="text-[13px] text-brass">0{i + 1}</span>
              <h3 className={`${H} text-[clamp(26px,2.4vw,38px)] leading-[1]`}>{p.name}</h3>
              <p className="text-[15px] leading-[1.65] text-ash">{p.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Page>
  );
}

function Finishes() {
  const [on, setOn] = useState(-1);
  const n = FINISHES.length;
  return (
    <Page id="finishes" n="14" label="Surface finish technologies" className="overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className={`${H} text-[clamp(44px,6vw,104px)] leading-[.9]`}>Twelve finishes,<br />one deck.</h2>
        <p className="min-h-[52px] max-w-[360px] text-[18px] text-bone">{on >= 0 ? <span><span className="text-brass">{String(on + 1).padStart(2, "0")}</span> — {FINISHES[on].name}</span> : <span className="text-ash">Hover a blade.</span>}</p>
      </div>
      <div className="relative mx-auto mt-10 hidden h-[460px] max-w-[1000px] md:block" onMouseLeave={() => setOn(-1)}>
        {FINISHES.map((f, i) => {
          const a = -78 + (i / (n - 1)) * 156, lifted = on === i;
          return (
            <div key={f.name} onMouseEnter={() => setOn(i)}
              className="absolute bottom-0 left-1/2 w-[74px] origin-[50%_95%] cursor-pointer overflow-hidden rounded-[10px] bg-[#f3efe7] shadow-[0_14px_40px_-12px_rgba(0,0,0,.8)] transition-transform duration-500 ease-cine"
              style={{ height: 400, transform: `translateX(-50%) rotate(${a}deg) translateY(${lifted ? -36 : 0}px)`, zIndex: lifted ? 50 : i }}>
              <div className="h-[80%] bg-cover bg-center" style={{ backgroundImage: `url(${f.img})` }} />
              <div className="h-[20%] border-t-2 border-[#b99a5b]" />
              <span className="absolute bottom-[3%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-char" />
            </div>
          );
        })}
        <span className="absolute bottom-[8px] left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f0dca8,#b99a5b_55%,#7a6230)] shadow-[0_4px_12px_rgba(0,0,0,.6)]" />
      </div>
      <div className="mt-10 grid grid-cols-3 gap-3 md:hidden">
        {FINISHES.map((f) => <div key={f.name} className="flex flex-col gap-2"><div className="aspect-[1/2] rounded-[8px] bg-cover bg-center" style={{ backgroundImage: `url(${f.img})` }} /><span className="text-[12px]">{f.name}</span></div>)}
      </div>
    </Page>
  );
}

function Partners() {
  return (
    <Page id="oem" n="22" label="OEM & converter partnerships">
      <div className="grid grid-cols-1 gap-[clamp(40px,5vw,96px)] lg:grid-cols-3">
        <div className="flex flex-col gap-6">
          <h2 className={`${H} text-[clamp(36px,4vw,64px)] leading-[.95]`}>Built for OEM &amp; converter partnerships.</h2>
          {PARTNERS.intro.map((p) => <p key={p} className="text-[15px] leading-[1.75] text-ash">{p}</p>)}
        </div>
        {[["We work with", PARTNERS.workWith], ["Typical applications", PARTNERS.applications]].map(([t, list]) => (
          <div key={t}>
            <span className="text-[12px] tracking-[.18em] text-brass uppercase">{t}</span>
            <ul className="mt-4 list-none">
              {list.map((x) => <li key={x} className="border-b border-bone/12 py-3.5 text-[18px]">{x}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </Page>
  );
}

function Process() {
  const [i, setI] = useState(0);
  return (
    <Page id="process" n="28" label="From finish selection to scalable supply">
      <div className="grid grid-cols-1 gap-[clamp(40px,5vw,96px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <div role="tablist" aria-label="Process steps" className="flex flex-col">
          {PROCESS.map((s, k) => (
            <button key={s.t} role="tab" aria-selected={k === i} onClick={() => setI(k)}
              className={`flex items-baseline gap-5 border-b border-bone/12 py-5 text-left transition-colors ${k === i ? "text-bone" : "text-bone/45 hover:text-bone/80"}`}>
              <span className={`text-[14px] ${k === i ? "text-brass" : ""}`}>0{k + 1}</span>
              <span className={`${H} text-[clamp(26px,2.6vw,42px)] leading-none`}>{s.t}</span>
            </button>
          ))}
        </div>
        <div className="relative min-h-[260px] rounded-[14px] bg-ink/50 p-[clamp(24px,3vw,48px)]">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="flex flex-col gap-6">
              <span className={`${H} text-[clamp(80px,9vw,150px)] leading-[.8] text-brass`}>{i + 1}</span>
              <span className="text-[26px] font-medium">{PROCESS[i].t}</span>
              <p className="max-w-[520px] text-[17px] leading-[1.7] text-ash">{PROCESS[i].d}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Page>
  );
}

function Contact() {
  return (
    <Page id="contact" n="32" label="Commercial enquiries">
      <div className="grid grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
        <div className="flex flex-col gap-8">
          <h2 className={`${H} text-[clamp(52px,7vw,120px)] leading-[.88]`}>Request the deck.</h2>
          <p className="max-w-[400px] text-[17px] leading-[1.7] text-ash">Tell us your application, volumes and markets — we come back with samples and a route to supply.</p>
          <a href={`mailto:${EMAIL}`} className="self-start text-[18px] text-brass hover:text-bone">{EMAIL}</a>
        </div>
        <EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} />
      </div>
      <footer className="mt-[clamp(80px,9vw,140px)] flex flex-wrap items-end justify-between gap-10 border-t border-bone/12 pt-10">
        <Logo tone="light" height={44} />
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
        <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
      </footer>
    </Page>
  );
}

export default function FanSections() {
  return (
    <div className="bg-ink pt-6">
      <Tabs />
      <About /><Platforms /><Finishes /><Partners /><Process /><Contact />
    </div>
  );
}
