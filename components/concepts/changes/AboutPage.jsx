"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { ABOUT } from "@/lib/changes";
import { AUDIENCE, ROLE } from "@/lib/brief";
import { VIDEO } from "@/lib/media";
import { MATS, U } from "@/lib/materials";

// The About PAGE. Not the homepage's About section.
//
// The first version of this page simply rendered components/concepts/changes/About.jsx, the homepage
// section, with deeper top padding. It worked but it read as a slice of the homepage rather than a page,
// because that section is built to sit in the middle of one: a heading band, a photo beside prose, rows,
// a reel.
//
// This is built from the vocabulary the site's OWN pages use — cast-films, architectural films, OEM:
//   - a full-bleed moving surface behind the opening, scrimmed, type at the foot (castfilms/Hero)
//   - brass mono eyebrows as the only section labels
//   - alternating ink and bone bands
//   - numbered hairline rows with the name left and the description right (v1/About, castfilms/Sections)
//   - one restrained pair of stills rather than a photo column
//
// COPY RULE: every sentence here is the client's, from lib/changes.js (point 3) and lib/brief.js. The
// only words written for this page are the mono eyebrows, which are navigation labels of the same kind
// as "Applications" and "Material Lab" elsewhere. DO NOT WRITE HEADLINES FOR THIS PAGE — if a band needs
// a statement, it uses one of the client's own sentences at display size.
//
// ROLE comes from lib/brief.js and is not used by any other live page (only the V2 and V3 concepts), so
// nothing is duplicated.

const K = "font-mono text-[11px] uppercase tracking-[.14em] text-brass";
const HEAD = ["Your next product.", "Your brand.", "Our manufacturing expertise."];

// Picked by code, not index, so a reorder of lib/materials.js cannot silently swap them.
const byCode = (c, w) => {
  const m = MATS.find((x) => x.code === c) || MATS[0];
  return { src: U(m.img, w), name: m.name, finish: m.finish };
};
const STILL_A = byCode("AF-415", 1200);   // Fluted Ash, linear relief
const STILL_B = byCode("DF-512", 900);    // Satin Aluminium, brushed

// A still that drifts a little as it passes. Same parallax the rest of the site uses, its own ref and
// useScroll so the hook always has something to measure.
function Still({ src, caption, className = "", ratio = "aspect-[3/4]" }) {
  const box = useRef(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1.03]);
  return (
    <figure className={`flex flex-col gap-3 ${className}`}>
      <div ref={box} className={`relative overflow-hidden bg-[#1a1b1c] ${ratio}`}>
        <motion.div className="absolute inset-[-9%] bg-cover bg-center" style={{ y, scale, backgroundImage: `url(${src})` }} />
      </div>
      <figcaption className="font-mono text-[10px] uppercase tracking-[.1em] text-ash">{caption}</figcaption>
    </figure>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* 01 — the opening. A moving decorative surface, as every other page on this site opens. */}
      <section id="about" className="relative flex min-h-[600px] flex-col justify-end overflow-hidden bg-ink text-bone"
        style={{ height: "100svh" }}>
        <div className="absolute inset-0"><Video media={VIDEO.engraved} /></div>
        {/* The site's own ground under type on moving footage: clear at the top, dark at the foot. */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(11,11,12,.70) 0%,rgba(11,11,12,.42) 38%,rgba(11,11,12,.95) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%)" }} />

        <div className="relative mx-auto flex w-full max-w-[1360px] flex-col gap-7 px-[clamp(20px,4vw,56px)] pb-[clamp(56px,8vh,110px)]">
          <span className={K}>About</span>
          <Lines as="h1" lines={HEAD}
            className="text-[clamp(27px,7.4vw,118px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.04em]" />
          <Reveal as="p" delay={0.15} className="max-w-[760px] text-[clamp(17px,1.7vw,24px)] leading-[1.45] [font-stretch:108%] tracking-[-.01em] text-mist [text-wrap:pretty]">
            {ABOUT.paragraphs[0]}
          </Reveal>
          <Reveal delay={0.25} className="mt-1 flex flex-wrap items-center gap-3.5">
            <a href="#enquiry" className="inline-flex items-center gap-3 rounded-full bg-bone px-[30px] py-[15px] text-[15px] font-medium text-ink">Request samples <span aria-hidden="true">→</span></a>
            <a href="/changes/catalogue" className="inline-flex items-center rounded-full border border-bone/30 px-[30px] py-[15px] text-[15px] font-medium text-bone">Explore the collection</a>
          </Reveal>
        </div>
      </section>

      {/* 02 — the range, then the three ways we supply it. */}
      <section className="bg-bone px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,150px)] text-[#151515]">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-7">
            <span className={`${K} text-[#8a6b3a]`}>What we do</span>
            <Reveal as="p" className="max-w-[640px] text-[clamp(20px,2.3vw,32px)] leading-[1.35] font-normal [font-stretch:106%] tracking-[-.015em] [text-wrap:pretty]">
              {ABOUT.paragraphs[1]}
            </Reveal>
          </div>

          {/* Numbered hairline rows — the site's list form, used for the audience, the spec table and
              the quality rows. ROLE is the client's own description of where SHG sits. */}
          <div className="mt-[clamp(44px,6vw,88px)] flex flex-col">
            {ROLE.map((r, i) => (
              <Reveal key={r.k} delay={i * 0.08}
                className={`group flex flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-[rgba(21,21,21,.2)] py-6 ${i === ROLE.length - 1 ? "border-b" : ""}`}>
                <span className="font-mono text-[11px] text-[#8a6b3a]">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-[1_1_240px] text-[clamp(22px,2vw,30px)] font-medium [font-stretch:115%] tracking-[-.02em] transition-transform duration-500 ease-cine group-hover:translate-x-3">{r.k}</span>
                <span className="max-w-[520px] flex-[1_1_300px] text-[15px] leading-[1.6] text-[#5d5a55] [text-wrap:pretty]">{r.d}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — choosing a finish, and the two supply routes. Stills of real finishes, not a factory:
          the standing rule is that only approved footage stands in for our production. */}
      <section className="bg-ink px-[clamp(20px,4vw,56px)] py-[clamp(80px,10vw,150px)] text-bone">
        <div className="mx-auto grid max-w-[1360px] grid-cols-1 items-start gap-[clamp(40px,5vw,80px)] lg:grid-cols-[minmax(0,.72fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-[clamp(20px,2.4vw,34px)]">
            <Still src={STILL_A.src} caption={`${STILL_A.name} · ${STILL_A.finish}`} />
            {/* The second still is held back to half width and pushed right, so the pair reads as one
                composition rather than a gallery of two. */}
            <Still src={STILL_B.src} caption={`${STILL_B.name} · ${STILL_B.finish}`} ratio="aspect-[4/3]" className="w-[62%] self-end" />
          </div>

          <div className="flex flex-col lg:pt-[clamp(20px,4vw,70px)]">
            <span className={K}>Choosing, and how it is supplied</span>
            <Reveal as="p" className="mt-7 max-w-[46ch] text-[clamp(19px,1.9vw,27px)] leading-[1.4] font-normal [font-stretch:106%] tracking-[-.015em] [text-wrap:pretty]">
              {ABOUT.paragraphs[2]}
            </Reveal>
            <Reveal as="p" delay={0.08} className="mt-[clamp(28px,3.2vw,46px)] max-w-[50ch] border-t border-bone/15 pt-7 text-[17px] leading-[1.65] text-mist [text-wrap:pretty]">
              {ABOUT.paragraphs[3]}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 — the client's closing line, which is the whole point of the page, given the room to land. */}
      <section className="bg-bone px-[clamp(20px,4vw,56px)] py-[clamp(72px,9vw,130px)] text-[#151515]">
        <div className="mx-auto max-w-[1360px]">
          <Reveal as="p" className="max-w-[20ch] border-t border-[rgba(21,21,21,.2)] pt-[clamp(30px,4vw,56px)] text-[clamp(26px,4.4vw,68px)] leading-[1.02] font-medium [font-stretch:114%] tracking-[-.035em] [text-wrap:pretty]">
            {ABOUT.bold}
          </Reveal>
          <Reveal delay={0.12} className="mt-[clamp(34px,4vw,60px)] flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t border-[rgba(21,21,21,.2)] pt-6">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#8a6b3a]">Who we work with</span>
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#5d5a55]">{AUDIENCE.join(" · ")}</span>
          </Reveal>
        </div>
      </section>
    </>
  );
}
