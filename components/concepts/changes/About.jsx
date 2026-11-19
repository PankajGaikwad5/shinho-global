"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { ABOUT } from "@/lib/changes";
import { IMG, VIDEO } from "@/lib/media";
import { MATS, U } from "@/lib/materials";

// Who We Are for /changes.
//
// WHY THIS IS NOT components/concepts/v1/About.jsx.
//
// V1's About puts the photo in one column and the statement, the audience rows and an optional note in
// the other, stacked. That is right for V1, whose words are one statement plus four short rows. The
// client's point 3 copy adds four paragraphs AND a bold closing line on top of that, so the text column
// grew to roughly twice the height of the picture beside it — a photo stranded at the top of an empty
// half-page, which is what the section looked like on 19 Nov.
//
// Same parts, rearranged rather than redesigned: the heading runs across the top at full width, where a
// three-sentence line belongs; the photo and the prose then sit side by side with the photo sticky, so
// it travels with the paragraphs instead of scrolling away from them; the audience rows close the
// section at full width; the material reel is unchanged. Type sizes, colours, rules and the reveal
// behaviour are all V1's.
//
// `/` renders V1's own About and is untouched. The two are allowed to differ: the copy differs.

// The client's heading, one line per sentence.
const HEAD = ["Your next product.", "Your brand.", "Our manufacturing expertise."];

// V1's rows, repeated here rather than imported — /changes owns its own section.
const AUDIENCE = [
  ["Manufacturers", "Films and finishes specified to your process."],
  ["OEMs", "Materials developed and produced under your name."],
  ["Converters", "Consistent supply for further processing."],
  ["Distributors", "A curated range backed by partner manufacturing."],
];

// V1's material reel, same stills and footage in the same order.
const STRIP = [
  { img: U(MATS[6].img, 900), label: MATS[6].name },
  { video: VIDEO.metalLight, label: "Metallic reflection" },
  { img: U(MATS[8].img, 900), label: MATS[8].name },
  { img: U(MATS[17].img, 900), label: MATS[17].name },
  { video: VIDEO.marble, label: "Honed stone" },
  { img: U(MATS[1].img, 900), label: MATS[1].name },
  { img: U(MATS[11].img, 900), label: MATS[11].name },
  { video: VIDEO.engraved, label: "Relief finish" },
  { img: U(MATS[19].img, 900), label: MATS[19].name },
];

// The parallax photo. It owns its own ref and useScroll for the reason V1's version does: a ref declared
// in the parent and left unattached makes Motion throw "Target ref is defined but not hydrated".
function Frame() {
  const frame = useRef(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1.04]);
  return (
    <Reveal className="flex flex-col gap-3.5">
      <div ref={frame} className="relative aspect-[4/5] overflow-hidden bg-[#d8d2c8]">
        <motion.div className="absolute inset-[-10%] bg-cover bg-center" style={{ y, scale, backgroundImage: `url(${IMG.ceiling(1400)})` }} />
        <div className="absolute bottom-4 right-4 aspect-video w-[42%] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,.35)]">
          <Video media={VIDEO.slitter} />
        </div>
      </div>
      {/* Standing rule: application imagery is illustrative only. */}
      <span className="font-mono text-[10px] uppercase tracking-[.1em] text-[#76726b]">Architectural film application · Interior ceiling</span>
    </Reveal>
  );
}

// `lead`: kept for a page that opens with this section. /changes/about no longer does - it has its own
// component (changes/AboutPage.jsx) - but the prop costs nothing and the next page that needs it is free.
export default function About({ id = "about", lead = false }) {
  const pad = lead
    ? "pt-[clamp(120px,15vw,200px)] pb-[clamp(88px,11vw,160px)]"
    : "py-[clamp(88px,11vw,160px)]";
  return (
    <section id={id} className="bg-bone text-[#151515]">
      <div className={`mx-auto max-w-[1360px] px-[clamp(20px,4vw,56px)] ${pad}`}>
        {/* Top band: the heading answered across the page by the client’s bold line. The first build
            ran the heading alone at full width, which left the whole right half empty and pushed the
            photo and the prose far down the page. */}
        <div className="grid grid-cols-1 items-end gap-[clamp(26px,4vw,64px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
          <div>
            <span className="mb-[clamp(20px,2.4vw,34px)] block font-mono text-[11px] uppercase tracking-[.14em] text-[#5d5a55]">Who we are</span>
            {/* One line per sentence. The measure has to clear the LONGEST of them — at 18ch,
                "Our manufacturing expertise." broke to a fourth line and the heading ate the page. */}
            <Lines as="h2" lines={HEAD}
              className="max-w-[28ch] text-[clamp(29px,3.5vw,54px)] leading-[1.08] font-normal [font-stretch:108%] tracking-[-.025em]" />
          </div>
          {/* The client set this sentence in bold. It is the line that separates SHG from a supplier who
              competes with its own customers, so it carries the band rather than closing a paragraph
              stack — and it gives the right half something to do. */}
          <Reveal as="p" delay={0.12}
            className="max-w-[32ch] text-[clamp(18px,1.5vw,22px)] font-medium leading-[1.45] [font-stretch:106%] tracking-[-.01em] [text-wrap:pretty] lg:pb-[.4em]">
            {ABOUT.bold}
          </Reveal>
        </div>

        <div className="mt-[clamp(38px,5vw,72px)] grid grid-cols-1 items-start gap-[clamp(36px,5vw,80px)] border-t border-[rgba(21,21,21,.2)] pt-[clamp(36px,4.5vw,64px)] lg:grid-cols-[minmax(0,.66fr)_minmax(0,1fr)]">
          {/* Sticky so the picture stays beside the words it belongs to. `items-start` on the grid is
              what gives it a height to stick within; stretched, it would never move. */}
          <div className="lg:sticky lg:top-[96px]">
            <Frame />
          </div>

          <div>
            {ABOUT.paragraphs.map((p, i) => (
              <Reveal as="p" key={p} delay={i * 0.06}
                className="mb-6 max-w-[52ch] text-[17px] leading-[1.65] text-[#39352f] [text-wrap:pretty] last:mb-0">
                {p}
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-[clamp(52px,7vw,110px)] flex flex-col">
          {AUDIENCE.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08}
              className={`group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-[rgba(21,21,21,.2)] py-5 ${i === AUDIENCE.length - 1 ? "border-b" : ""}`}>
              <span className="text-[clamp(22px,2vw,28px)] font-medium [font-stretch:115%] transition-transform duration-500 ease-cine group-hover:translate-x-3">{t}</span>
              <span className="max-w-[360px] text-[15px] text-[#5d5a55]">{d}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="overflow-hidden bg-ink py-3" aria-label="Material reel">
        <div className="flex w-max gap-3 [animation:marquee_70s_linear_infinite] hover:[animation-play-state:paused]">
          {[...STRIP, ...STRIP].map((s, i) => (
            <figure key={i} className="relative h-[clamp(180px,24vw,320px)] w-[clamp(240px,32vw,440px)] shrink-0 overflow-hidden">
              {s.video ? <Video media={s.video} /> : <div className="h-full w-full bg-cover bg-center transition-transform duration-[1.4s] ease-cine hover:scale-110" style={{ backgroundImage: `url(${s.img})` }} />}
              {/* Scrim: the caption sits on the image, so it needs a ground to stay readable. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(11,11,12,0)_0%,rgba(11,11,12,.72)_100%)]" />
              <figcaption className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[.12em] text-bone/85">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
