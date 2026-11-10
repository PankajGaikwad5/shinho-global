"use client";

import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { Reveal } from "../shared/Reveal";
import { ABOUT, PLATFORMS, FINISHES, PARTNERS, PROCESS, EMAIL, ENQUIRY_TYPES, NAV } from "@/lib/site";

// V7 sections: an engineering spec-sheet language on a faint blueprint grid.
const pad = "px-[clamp(20px,5vw,80px)]";
const grid = "bg-[linear-gradient(rgba(198,164,110,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(198,164,110,.06)_1px,transparent_1px)] [background-size:48px_48px]";
const H = "font-medium [font-stretch:112%] tracking-[-.035em]";
const tag = "font-mono text-[11px] tracking-[.08em] text-brass";

// Illustrative constructions (top → base). PLACEHOLDER — confirm with the partner's technical data.
const LAYERS = [
  ["Protective top coat", "Printed décor layer", "PVC base film", "Adhesive + release liner (optional)"],
  ["Functional / print coating", "PET, PP or Co-PET base film", "Primer", "Lamination side"],
  ["Top-layer face film", "Customer adhesive coating or lamination", "Customer substrate"],
  ["Face film", "Pressure-sensitive adhesive", "Release liner"],
];

function Head({ code, title, intro }) {
  return (
    <div className="mb-[clamp(40px,5vw,72px)] grid grid-cols-1 items-end gap-6 border-b border-bone/15 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]">
      <div className="flex flex-col gap-4">
        <span className={tag}>{code}</span>
        <h2 className={`${H} text-[clamp(40px,5vw,84px)] leading-[.92]`}>{title}</h2>
      </div>
      {intro && <p className="max-w-[420px] text-[16px] leading-[1.7] text-ash lg:justify-self-end">{intro}</p>}
    </div>
  );
}

function Profile() {
  const rows = [
    ["Type", "International supply partner"], ["Materials", "Decorative surface films & polymer-based materials"],
    ["Platforms", `${PLATFORMS.length} film platforms`], ["Finishes", `${FINISHES.length} surface finish technologies`],
    ["Manufacturing", "Partner facilities · Republic of Korea"], ["Experience", "20+ years (partner)"], ["Supply route", "Sampling → pilot → commercial rollout"],
  ];
  return (
    <section id="about" className={`bg-ink ${grid} ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-[clamp(48px,6vw,110px)] lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <span className={tag}>SG-00 · Company profile</span>
          <Reveal as="h2" className={`${H} text-[clamp(36px,4.2vw,68px)] leading-[1]`}>{ABOUT.statement}</Reveal>
          {ABOUT.body.map((p) => <p key={p} className="max-w-[520px] text-[16px] leading-[1.75] text-ash">{p}</p>)}
        </div>
        <Reveal>
          <table className="w-full border-collapse border border-bone/20 text-left text-[15px]">
            <caption className="border border-b-0 border-bone/20 bg-char px-5 py-3 text-left font-mono text-[11px] tracking-[.1em] text-stone uppercase">Specification</caption>
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k} className="border-b border-bone/15">
                  <th scope="row" className="w-[38%] border-r border-bone/15 px-5 py-4 font-mono text-[12px] font-normal tracking-[.06em] text-stone uppercase">{k}</th>
                  <td className="px-5 py-4">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}

// Exploded cross-section drawing with leader lines.
function Section({ layers }) {
  const n = layers.length, h = 26, gap = 22, w = 300, x0 = 20;
  const total = n * h + (n - 1) * gap + 40;
  return (
    <svg viewBox={`0 0 640 ${total}`} className="w-full" role="img" aria-label={`Illustrative construction: ${layers.join(", ")}`}>
      {layers.map((l, i) => {
        const y = 20 + i * (h + gap), skew = 40;
        const fill = ["#c6a46e", "#8b7a62", "#5a4f42", "#3a332c"][i] || "#2a251f";
        return (
          <g key={l}>
            <polygon points={`${x0 + skew},${y} ${x0 + w + skew},${y} ${x0 + w},${y + h} ${x0},${y + h}`} fill={fill} fillOpacity="0.85" stroke="#eee9df" strokeOpacity="0.35" />
            <line x1={x0 + w + skew / 2} y1={y + h / 2} x2={x0 + w + 90} y2={y + h / 2} stroke="#c6a46e" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={x0 + w + skew / 2} cy={y + h / 2} r="2.5" fill="#c6a46e" />
            <text x={x0 + w + 98} y={y + h / 2 + 5} fill="#eee9df" fontSize="15" fontFamily="Archivo, sans-serif">{l}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Platforms() {
  return (
    <section id="materials" className={`bg-char ${grid} ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Head code="SG-01 · What we supply" title="Four film platforms." intro="A focused material platform for decorative, architectural, printable and specialty film applications." />
        <div className="grid grid-cols-1 gap-px border border-bone/15 bg-bone/15 lg:grid-cols-2">
          {PLATFORMS.map((p, i) => (
            <Reveal key={p.name} className="flex flex-col gap-6 bg-char p-[clamp(24px,3vw,44px)]">
              <div className="flex items-baseline justify-between gap-4">
                <span className={tag}>PL-0{i + 1}</span>
                <span className="font-mono text-[11px] text-stone">Illustrative cross-section</span>
              </div>
              <h3 className={`${H} text-[clamp(28px,2.6vw,42px)] leading-none`}>{p.name}</h3>
              <Section layers={LAYERS[i]} />
              <p className="text-[15px] leading-[1.7] text-ash">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Register() {
  return (
    <section className={`bg-ink ${grid} ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Head code="SG-02 · Finish register" title="Surface finish technologies." intro="Decorative and functional finishes for architectural, interior, signage and specialty film markets." />
        <div className="grid grid-cols-2 border-t border-l border-bone/15 sm:grid-cols-3 lg:grid-cols-4">
          {FINISHES.map((f, i) => (
            <div key={f.name} className="group flex items-center gap-4 border-r border-b border-bone/15 p-4">
              <span className="h-16 w-16 shrink-0 bg-cover bg-center ring-1 ring-bone/20 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${f.img})` }} />
              <span className="flex flex-col gap-1">
                <span className={tag}>F-{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[15px] leading-tight">{f.name}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section id="oem" className={`bg-char ${grid} ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Head code="SG-03 · Partnerships" title="Built for OEM & converter partnerships." intro={PARTNERS.intro[0]} />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {[["We work with", PARTNERS.workWith, "P"], ["Typical applications", PARTNERS.applications, "A"]].map(([t, list, pre]) => (
            <div key={t}>
              <span className="font-mono text-[12px] tracking-[.1em] text-stone uppercase">{t}</span>
              <ul className="mt-4 list-none border-t border-bone/15">
                {list.map((x, i) => (
                  <li key={x} className="grid grid-cols-[64px_1fr] border-b border-bone/15 py-3.5 text-[17px]">
                    <span className={tag}>{pre}-{String(i + 1).padStart(2, "0")}</span>{x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Flow() {
  return (
    <section id="process" className={`bg-ink ${grid} ${pad} py-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Head code="SG-04 · Process" title="From finish selection to scalable supply." />
        <ol className="grid list-none grid-cols-1 gap-4 md:grid-cols-4 md:gap-0">
          {PROCESS.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.1} className="relative flex flex-col gap-4 border border-bone/20 bg-char/70 p-6 md:mr-10">
              <span className={tag}>STEP {String(i + 1).padStart(2, "0")}</span>
              <span className="text-[22px] font-medium">{s.t}</span>
              <span className="text-[14px] leading-[1.65] text-ash">{s.d}</span>
              {i < PROCESS.length - 1 && (
                <svg aria-hidden="true" viewBox="0 0 40 12" className="absolute top-1/2 -right-10 hidden w-10 -translate-y-1/2 md:block">
                  <line x1="0" y1="6" x2="34" y2="6" stroke="#c6a46e" strokeWidth="1.2" /><polygon points="34,1 40,6 34,11" fill="#c6a46e" />
                </svg>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Rfq() {
  return (
    <section id="contact" className={`bg-char ${grid} ${pad} pt-[clamp(96px,11vw,170px)] text-bone`}>
      <div className="mx-auto max-w-[1320px]">
        <Head code="SG-05 · Request for quotation" title="Tell us what you need to make." />
        <div className="grid grid-cols-1 gap-[clamp(40px,5vw,96px)] lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-6 border border-bone/15 p-6 text-[15px]">
            {[["Response", "Materials, samples and a route to supply"], ["Email", EMAIL], ["Manufacturing", "Partner facilities · Republic of Korea"]].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 border-b border-bone/12 pb-4 last:border-0 last:pb-0">
                <span className="font-mono text-[11px] tracking-[.1em] text-stone uppercase">{k}</span>
                {k === "Email" ? <a href={`mailto:${v}`} className="hover:text-brass">{v}</a> : <span>{v}</span>}
              </div>
            ))}
          </div>
          <div className="border border-bone/15 bg-ink/60 p-[clamp(20px,3vw,40px)]"><EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} /></div>
        </div>
        <footer className="mt-[clamp(96px,11vw,160px)] flex flex-wrap items-end justify-between gap-10 border-t border-bone/15 py-12">
          <Logo tone="light" height={44} />
          <nav className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[12px] tracking-[.08em] text-ash uppercase">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}</nav>
          <span className="basis-full font-mono text-[11px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}

export default function Technical() {
  return (<><Profile /><Platforms /><Register /><Partners /><Flow /><Rfq /></>);
}
