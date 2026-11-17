// The cast-film page's sections ARE V1's sections. Nothing here draws any markup: each export renders the
// matching component from components/concepts/v1 with cast-film content passed in, so the two pages cannot
// drift apart — a change to V1's layout or motion changes this page with it.
//
//   Pitch / Automotive / Quality → v1/About.jsx          (parallax frame, statement, hairline rows, reel)
//   Groups                       → v1/Materials.jsx      (hover-expanding full-bleed panels)
//   Applications                 → v1/Manufacturing.jsx  (framed shot with progress bars)
//   Process / Technical          → v1/Oem.jsx            (big numerals on bone)
//
// Where V1 plays footage this page passes stills: the client has not supplied approved manufacturing
// footage, and unrelated industrial clips must not stand in for it.
import About from "../v1/About";
import Materials from "../v1/Materials";
import Manufacturing from "../v1/Manufacturing";
import Oem from "../v1/Oem";
import { Lines, Reveal } from "../shared/Reveal";
import { MATS, U } from "@/lib/materials";
import { ADVANTAGES, APPLICATIONS, APPLICATIONS_NOTE, AUTOMOTIVE, GROUPS, PITCH, PROCESS, QUALITY, SPEC } from "@/lib/cast";

// V1 runs a drifting reel of material under this section; the cast page uses its own cast swatches.
// Names only, never product codes.
const CAST_STRIP = MATS.filter((m) => m.cat === "cast").map((m) => ({ img: U(m.img, 900), label: m.name }));

export function Pitch() {
  return (
    <About
      id="your-brand"
      eyebrow="Your brand"
      statement={PITCH.body}
      rows={ADVANTAGES}
      // No photo frame here. V1's About with its frame opens the homepage and the architectural page;
      // running the same shape again made this page's second section feel like all the others. The
      // statement carries it, with the material reel underneath.
      frameImg={null}
      inset={null}
      caption={null}
      strip={CAST_STRIP}
      note={PITCH.reassurance}
    />
  );
}

export function Groups() {
  const items = GROUPS.map((g) => ({
    // Panel name is the short one; the full product sentence is the lede that opens with the panel.
    id: g.id, n: g.n, name: g.short, lede: g.lede, img: g.img,
    meta: [`Uses — ${g.uses}`, `Supply — ${g.formats}`],
  }));
  return (
    <Materials
      id="products"
      lines={["Five families", "of cast film."]}
      lede="Figures shown with a product are examples for a particular grade. The final specification is agreed for yours."
      items={items}
      compact
      nameClass="text-[clamp(20px,1.7vw,26px)] leading-[1.1] font-medium [font-stretch:118%] tracking-[-.02em]"
      cta="Request samples →"
      ctaHref="#samples"
      scrim="linear-gradient(180deg,rgba(11,11,12,.55) 0%,rgba(11,11,12,.62) 30%,rgba(11,11,12,.96) 100%)"
    />
  );
}

export function Automotive() {
  return (
    <Oem
      id="automotive"
      eyebrow="Separate product"
      lines={["Automotive", "paint protection."]}
      lede={AUTOMOTIVE.lede}
      steps={AUTOMOTIVE.construction.map(([n, t, d]) => [n, t, d, null])}
    />
  );
}

export function Applications() {
  return (
    <Manufacturing
      id="applications"
      eyebrow="Applications"
      lines={["Where these", "films end up."]}
      lede={APPLICATIONS_NOTE}
      shots={APPLICATIONS.map((a) => [a.name, { img: a.img }])}
      facts={APPLICATIONS.map((a) => [a.name, a.films])}
      hud="Application illustration · not a Shinho Global customer project"
      live={false}
    />
  );
}

export function Process() {
  return (
    <Oem
      id="process"
      eyebrow="How it works"
      lines={["From enquiry", "to supply."]}
      lede="Five steps, from the first conversation about your application to a planned supply schedule under your brand."
      steps={PROCESS.map(([n, t, d]) => [n, t, d, null])}
      columns={5}
    />
  );
}

export function Technical() {
  return (
    <section id="technical" className="bg-ink py-[clamp(88px,10vw,140px)] text-bone">
      <div className="mx-auto mb-12 flex max-w-[1360px] flex-wrap items-end justify-between gap-x-12 gap-y-6 px-[clamp(20px,4vw,56px)]">
        <div className="flex max-w-[820px] flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">Technical detail</span>
          <Lines lines={["Specification,", "by grade."]} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
        </div>
        <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">{SPEC.intro}</Reveal>
      </div>

      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,56px)]">
        <span className="font-mono text-[11px] tracking-[.14em] text-brass">{SPEC.grade}</span>

        {/* Hairline rows, exactly as v1/About lists its audience: name left, figure right, method after it.
            Figures are never uppercased — text-transform would turn µm into MM. */}
        <div className="mt-7 flex flex-col">
          {SPEC.rows.map(([property, value, method], i) => (
            <Reveal key={property} delay={i * 0.06}
              className={`group flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-bone/15 py-5 ${i === SPEC.rows.length - 1 ? "border-b" : ""}`}>
              <span className="min-w-[min(100%,260px)] flex-[1.2] text-[clamp(22px,2vw,28px)] font-medium [font-stretch:115%] transition-transform duration-500 ease-cine group-hover:translate-x-3">{property}</span>
              <span className="flex-[0_0_auto] min-w-[160px] text-[clamp(22px,2vw,28px)] font-light [font-stretch:118%] text-bone">{value}</span>
              <span className="max-w-[380px] flex-[1] text-[15px] leading-[1.55] text-ash">{method}</span>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-sm leading-[1.55] text-ash">{SPEC.note}</p>

        {/* Quality lives in the same section rather than another full-width grid of its own. */}
        <div className="mt-[clamp(56px,7vw,100px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <span className="text-[clamp(26px,3vw,42px)] leading-[1] font-medium [font-stretch:116%] tracking-[-.028em]">Agreed before production.</span>
          <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">{QUALITY.lede}</Reveal>
        </div>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-8">
          {QUALITY.rows.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="flex flex-col gap-2.5 border-t border-bone/15 pt-5">
              <span className="text-xl font-medium [font-stretch:112%]">{t}</span>
              <span className="text-sm leading-[1.55] text-ash">{d}</span>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-sm leading-[1.55] text-ash">{QUALITY.note}</p>
      </div>
    </section>
  );
}
