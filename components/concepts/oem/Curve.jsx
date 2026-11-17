"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MONO } from "@/components/fonts";
import { Lines, Reveal } from "../shared/Reveal";

// "From sample to scale" — the four-stage curve the client asked for (brief point 5), inside OEM
// Partnerships rather than as a main tab. It takes the curved orbit-path motif from V7 (Sample Orbit):
// a long arc drawn as the visitor scrolls, with the four stages arriving along it.
// There was no existing four-stage component in the project, so the arc is built here; everything else
// (type scale, colours, hairlines, reveal motion) is V1's.
//
// On a phone the arc is hidden and the four stages stack, as the client asked.
const STAGES = [
  ["Choose", "Tell us what is missing. Choose the film, finish and supply format."],
  ["Test", "Review samples with your team. Check the appearance and performance you need."],
  ["Approve", "Agree the product, trial quantity, price and packaging."],
  ["Produce", "Place the approved order. Confirm the production and delivery plan."],
];

const START = [
  ["Choose an existing product", "Pick from finishes we already make. Samples, then a trial order — no development project needed."],
  ["Develop a custom product", "Start from your application and develop the colour, texture or construction with us."],
];

// Points along the arc, as percentages of the viewBox, so markers and labels share one source.
const PATH = "M 40 300 C 220 300 260 150 460 150 C 660 150 700 60 960 60";
const POINTS = [[40, 300], [360, 162], [660, 136], [960, 60]];

export default function Curve() {
  const root = useRef(null);
  const arc = useRef(null);
  const [open, setOpen] = useState(0);
  // Track the ARC, not the whole section. Against the section, the line only finished once its bottom
  // edge had passed 60% of the screen — by then the heading and both starting points are below you and
  // the arc itself has scrolled off the top, so the curve completed long after you stopped looking at it.
  // Against the arc, the line is drawn while the arc is on screen and completes with it in full view.
  const { scrollYProgress } = useScroll({ target: arc, offset: ["start 90%", "end 75%"] });
  const draw = useTransform(scrollYProgress, [0, 0.88], [0, 1]);

  return (
    <section id="from-sample-to-scale" ref={root} className="bg-ink px-[clamp(20px,4vw,56px)] py-[clamp(88px,10vw,140px)] text-bone">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-[clamp(44px,5vw,80px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex max-w-[860px] flex-col gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">From sample to scale</span>
            <Lines lines={["Choose. Test.", "Approve. Produce."]} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
          </div>
          <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">
            From first samples to your branded product. Start from a finish we already make, or develop your own.
          </Reveal>
        </div>

        {/* The arc. Hidden below 900px, where the stages simply stack. */}
        <div ref={arc} className="relative hidden lg:block">
          <svg viewBox="0 0 1000 360" className="w-full" fill="none" aria-hidden="true">
            <path d={PATH} stroke="currentColor" strokeWidth="1" className="text-bone/15" />
            <motion.path d={PATH} stroke="currentColor" strokeWidth="1.5" className="text-brass"
              style={{ pathLength: draw }} />
            {POINTS.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" className="fill-ink stroke-brass" strokeWidth="1.5" />
                <text x={x} y={y - 22} textAnchor="middle" className="fill-current text-brass" style={{ font: `500 13px ${MONO}`, letterSpacing: ".14em" }}>
                  0{i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          {STAGES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.1} className="group flex flex-col gap-4 border-t border-bone/35 pt-6 pr-7 pb-10">
              <span className="text-[64px] leading-none font-light [font-stretch:125%] text-dusk transition-colors duration-500 group-hover:text-brass">0{i + 1}</span>
              <span className="text-[22px] font-medium [font-stretch:112%]">{t}</span>
              <span className="text-[15px] leading-[1.6] text-ash">{d}</span>
            </Reveal>
          ))}
        </div>

        {/* Two starting points — an existing product must not look like a development project. */}
        <div className="mt-[clamp(44px,5vw,80px)] flex flex-col">
          {START.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08}>
              <button onClick={() => setOpen(i)} aria-expanded={open === i}
                className={`group flex w-full flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-bone/15 py-5 text-left ${i === START.length - 1 ? "border-b" : ""}`}>
                <span className="flex items-baseline gap-5">
                  <span className="font-mono text-[11px] text-brass">{open === i ? "—" : "+"}</span>
                  <span className="text-[clamp(22px,2vw,28px)] font-medium [font-stretch:115%] transition-transform duration-500 ease-cine group-hover:translate-x-3">{t}</span>
                </span>
                <span className="max-w-[420px] text-[15px] leading-[1.6] text-ash" style={{ opacity: open === i ? 1 : 0.55 }}>{d}</span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          {/* Colours inline, not as utilities: this button was rendering as a blank pill with no visible
              label. The markup and the generated CSS are both correct, so something in the cascade was
              winning over `text-ink`. An inline colour cannot be overridden by a class. */}
          <a href="#contact" className="inline-flex items-center gap-4 rounded-full px-8 py-4 text-[15px] font-medium"
            style={{ background: "var(--color-bone)", color: "var(--color-ink)" }}>
            <span style={{ color: "var(--color-ink)" }}>Request samples</span>
            <span aria-hidden="true" style={{ color: "var(--color-ink)" }}>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
