"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Video from "../shared/Video";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { Reveal } from "../shared/Reveal";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";
import { IMG } from "@/lib/media";

// V6 sections: a print-magazine language — spreads, folios, captions, a contents page.
const pad = "px-[clamp(20px,5vw,80px)]";
const H = "font-medium [font-stretch:112%] tracking-[-.04em]";

function Folio({ n, label }) {
  return (
    <div className="flex items-center justify-between border-b border-bone/20 pb-3 text-[12px] tracking-[.16em] uppercase text-stone">
      <span>Shinho Global — {label}</span><span>p. {String(n).padStart(2, "0")}</span>
    </div>
  );
}

function Cover() {
  return (
    <section id="about" className={`bg-ink ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Folio n={2} label="About" />
        <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-[clamp(40px,6vw,96px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <Reveal as="h2" className={`${H} text-[clamp(52px,7.4vw,128px)] leading-[.88]`}>The surface<br />issue.</Reveal>
          <Reveal className="columns-1 gap-10 text-[16px] leading-[1.75] text-ash md:columns-2">
            <p className="mb-5 text-bone first-letter:float-left first-letter:mr-3 first-letter:text-[64px] first-letter:leading-[.8] first-letter:font-medium first-letter:text-brass">{ABOUT.statement}</p>
            {ABOUT.body.map((p) => <p key={p} className="mb-5">{p}</p>)}
          </Reveal>
        </div>
        <Reveal className="mt-[clamp(64px,8vw,120px)] grid grid-cols-1 items-end gap-10 border-t border-bone/20 pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <p className={`${H} text-[clamp(26px,2.8vw,44px)] leading-[1.1]`}>&ldquo;One clear route — from material selection and sampling to manufacturing and supply.&rdquo;</p>
          <ul className="grid list-none grid-cols-2 gap-x-6 gap-y-2 text-[14px] text-ash">
            {ABOUT.buyers.map((b) => <li key={b} className="border-t border-bone/12 pt-2">{b}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Feature({ p, i }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const flip = i % 2 === 1;
  return (
    <article ref={ref} className="grid grid-cols-1 items-end gap-[clamp(24px,4vw,64px)] lg:grid-cols-12">
      <div className={`relative aspect-[4/5] overflow-hidden bg-char lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
        <motion.div className="absolute inset-[-10%_0]" style={{ y }}>
          {p.media.video ? <Video media={p.media.video} /> : <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${p.media.img})` }} />}
        </motion.div>
        <span className="absolute bottom-4 left-4 text-[12px] tracking-[.14em] text-white/85 uppercase">Fig. {i + 1}</span>
      </div>
      <div className={`flex flex-col gap-6 pb-4 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <span className="text-[12px] tracking-[.18em] text-brass uppercase">Feature {String(i + 1).padStart(2, "0")}</span>
        <h3 className={`${H} text-[clamp(40px,4.6vw,76px)] leading-[.92]`}>{p.name}</h3>
        <p className="max-w-[420px] text-[17px] leading-[1.7] text-ash">{p.d}</p>
        <a href="#contact" className="self-start text-[14px] tracking-[.12em] uppercase underline decoration-brass decoration-2 underline-offset-[10px] hover:text-brass">Request samples</a>
      </div>
    </article>
  );
}

function Features() {
  return (
    <section id="materials" className={`bg-ink ${pad} pb-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Folio n={6} label="What we supply" />
        <div className="mt-[clamp(56px,7vw,110px)] flex flex-col gap-[clamp(96px,12vw,180px)]">
          {PLATFORMS.map((p, i) => <Feature key={p.name} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function Lookbook() {
  return (
    <section className="bg-char py-[clamp(96px,11vw,170px)] text-bone">
      <div className={`mx-auto max-w-[1320px] ${pad}`}>
        <Folio n={18} label="Finishes" />
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className={`${H} text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>The finish lookbook.</h2>
          <p className="max-w-[360px] text-[15px] leading-[1.7] text-ash">Twelve decorative and functional surface technologies. Scroll sideways.</p>
        </div>
      </div>
      <div data-lenis-prevent-horizontal className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,5vw,80px)] pb-6 [scrollbar-width:thin]">
        {FINISHES.map((f, i) => (
          <figure key={f.name} className="group w-[clamp(220px,22vw,320px)] shrink-0 snap-start">
            <div className="aspect-[3/4] overflow-hidden bg-ink">
              <div className="h-full w-full bg-cover bg-center transition-transform duration-[1.2s] ease-cine group-hover:scale-105" style={{ backgroundImage: `url(${f.img})` }} />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-t border-bone/20 pt-3">
              <span className="text-[16px] font-medium">{f.name}</span>
              <span className="text-[12px] text-stone">{String(i + 1).padStart(2, "0")}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Contents() {
  return (
    <section id="oem" className={`bg-ink ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Folio n={24} label="Partnerships" />
        <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-8">
            <h2 className={`${H} text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>Built for OEM &amp; converter partnerships.</h2>
            {PARTNERS.intro.map((p) => <p key={p} className="max-w-[480px] text-[16px] leading-[1.75] text-ash">{p}</p>)}
            <div className="relative mt-4 aspect-[16/10] overflow-hidden bg-char"><div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${IMG.control(1600)})` }} /></div>
          </div>
          <div className="flex flex-col gap-14">
            {[["We work with", PARTNERS.workWith], ["Typical applications", PARTNERS.applications]].map(([t, list]) => (
              <div key={t}>
                <span className="text-[12px] tracking-[.18em] text-brass uppercase">{t}</span>
                <ol className="mt-4 list-none">
                  {list.map((x, i) => (
                    <li key={x} className="flex items-baseline gap-4 border-b border-bone/12 py-3.5 text-[clamp(18px,1.6vw,22px)]">
                      <span className="min-w-0 flex-1">{x}</span>
                      <span className="flex-1 translate-y-[-4px] border-b border-dotted border-bone/25" aria-hidden="true" />
                      <span className="text-[13px] text-stone">{String(i + 1).padStart(2, "0")}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="process" className={`bg-char ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Folio n={30} label="The method" />
        <h2 className={`${H} mt-10 mb-[clamp(48px,6vw,96px)] text-[clamp(44px,5.6vw,96px)] leading-[.9]`}>From finish selection<br />to scalable supply.</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-0">
          {PROCESS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.1} className={`flex flex-col gap-4 md:px-6 ${i ? "md:border-l md:border-bone/15" : "md:pl-0"}`}>
              <span className={`${H} text-[clamp(56px,5vw,88px)] leading-none text-brass`}>{i + 1}</span>
              <span className="text-[22px] font-medium">{s.t}</span>
              <span className="text-[15px] leading-[1.7] text-ash">{s.d}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Letter({ logo }) {
  return (
    <section id="contact" className={`bg-ink ${pad} pt-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Folio n={36} label="Enquiries" />
        <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col gap-8">
            <h2 className={`${H} text-[clamp(52px,7vw,120px)] leading-[.88]`}>Write to us.</h2>
            <p className="max-w-[400px] text-[17px] leading-[1.7] text-ash">Share your application, volumes and markets. We will come back with materials, samples and a route to supply.</p>
            <a href={`mailto:${EMAIL}`} className="self-start text-[18px] underline decoration-brass decoration-2 underline-offset-8 hover:text-brass">{EMAIL}</a>
          </div>
          <EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} />
        </div>
        <footer className="mt-[clamp(96px,11vw,160px)] flex flex-wrap items-end justify-between gap-10 border-t border-bone/20 py-12">
          <Logo tone={logo} height={44} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
          <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}

export default function Editorial({ logo = "light" }) {
  return (<><Cover /><Features /><Lookbook /><Contents /><Method /><Letter logo={logo} /></>);
}
