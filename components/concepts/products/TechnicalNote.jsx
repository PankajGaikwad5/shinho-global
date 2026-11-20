"use client";

import { Lines, Reveal } from "../shared/Reveal";

// Point 10 asks every product page for "available technical information". The cast-film page has real
// figures from the client's deck and renders them as a hairline table (castfilms/Sections.jsx ->
// Technical). The architectural page has none, so it says how the buyer gets the right data instead of
// borrowing another product's.
//
// A STATEMENT, NOT A SPEC SHEET, ON PURPOSE. The client's own rule, in both emails: a figure belongs to
// the grade it came from and is never a promise for the range. When they send data for a product, that
// product gets its own table — never this one shared between products.
export default function TechnicalNote({ t }) {
  return (
    <section id="technical" className="bg-ink px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,150px)] text-bone">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex max-w-[820px] flex-col gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">{t.eyebrow}</span>
            <Lines lines={t.lines} className="text-[clamp(26px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
          </div>
          <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">{t.lede}</Reveal>
        </div>
        <Reveal as="p" className="mt-[clamp(36px,4.5vw,64px)] max-w-[46ch] border-t border-bone/15 pt-7 text-[clamp(18px,1.8vw,26px)] leading-[1.45] font-normal [font-stretch:106%] tracking-[-.015em] [text-wrap:pretty]">
          {t.body}
        </Reveal>
      </div>
    </section>
  );
}
