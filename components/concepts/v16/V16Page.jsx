"use client";

import { useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import LayerScene, { LAYERS, decorChoices, decorUrlOf } from "./LayerScene";
import { useAnchorOverlay } from "../kit/Anchor";
import LazyCanvas from "../kit/LazyCanvas";
import Chapter from "../story/Chapter";
import { buildBounds, storyAt } from "../story/story";
import Hud from "../shared/Hud";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { ABOUT, ENQUIRY_TYPES, PLATFORMS, FINISHES, EMAIL, NAV } from "@/lib/site";
import { U } from "@/lib/materials";

const CHAPTERS = [{ len: 1.3 }, { len: 1.4 }, { len: 1.4 }, { len: 1.3 }, { len: 1.8 }, { len: 1.8 }, { len: 1.6 }, { len: 1.5 }, { len: 1.7 }];
const K = "text-[12px] tracking-[.24em] text-brass uppercase";
const H = "font-medium [font-stretch:118%] tracking-[-.045em] text-bone [text-shadow:0_4px_40px_rgba(0,0,0,.6)]";
const P = "mt-5 max-w-[440px] text-[17px] leading-[1.65] text-bone/80";
const glossName = (g) => (g < 0.15 ? "Super matte" : g < 0.4 ? "Matte" : g < 0.65 ? "Satin" : g < 0.88 ? "Gloss" : "High gloss");

export default function V16Page() {
  const container = useRef(null);
  const bounds = useMemo(() => buildBounds(CHAPTERS), []);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  const [decor, setDecor] = useState(0);
  const [gloss, setGloss] = useState(0.8);
  const { onFrame, setEl } = useAnchorOverlay();
  useMotionValueEvent(scrollYProgress, "change", (v) => { const i = storyAt(v, bounds).i; setChapter((c) => (c === i ? c : i)); });

  return (
    <>
      <Hud />
      <div ref={container} className="relative bg-ink">
        <div className="fixed inset-0 z-0">
          <LazyCanvas className="h-full w-full" camera={{ position: [0, 0.4, 6.6], fov: 42, near: 0.1, far: 80 }}>
            <LayerScene progress={scrollYProgress} bounds={bounds} chapter={chapter} decorUrl={decorUrlOf(decorChoices[decor])} gloss={gloss} onAnchor={onFrame} />
          </LazyCanvas>
          {/* layer labels (shown while the panel is exploded; the visited layer is highlighted) */}
          <div className="pointer-events-none absolute inset-0">
            {LAYERS.map((name, k) => {
              const on = chapter >= 1 && chapter <= 5, focus = chapter >= 2 && chapter <= 5 ? (chapter - 2 === k ? 1 : 0.18) : 1;
              return (
                <span key={name} ref={setEl(k)} className="invisible absolute top-0 left-0 h-0 w-0">
                  <span className="absolute top-0 left-0 flex -translate-y-1/2 items-center gap-3 whitespace-nowrap text-[13px] tracking-[.06em] text-[#f1ece3] transition-opacity duration-500"
                    style={{ opacity: on ? focus : 0 }}>
                    <span className="h-px w-10 bg-[#c4a465]" /><span className="text-[#c4a465]">0{4 - k}</span>{name}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <Chapter id="top" len={CHAPTERS[0].len} align="bottom-left" first>
          <span className={K}>Shinho Global</span>
          <h1 className={`${H} mt-4 text-[clamp(56px,9vw,164px)] leading-[.86]`}>Look <span className="text-brass">closer.</span></h1>
          <p className={P}>Every decorative surface film is a construction. Scroll to take one apart.</p>
        </Chapter>
        <Chapter id="about" len={CHAPTERS[1].len} align="left">
          <span className={K}>The construction</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.2vw,86px)] leading-[.92]`}>Four layers.<br />One surface.</h2>
          <p className={P}>{ABOUT.statement}</p>
        </Chapter>
        <Chapter len={CHAPTERS[2].len} align="left">
          <span className={K}>Layer 04 · Substrate</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.2vw,86px)] leading-[.92]`}>The base film.</h2>
          <p className={P}>Decorative PVC, PET, PP and Co-PET platforms — made at long-standing partner facilities in the Republic of Korea.</p>
        </Chapter>
        <Chapter len={CHAPTERS[3].len} align="left">
          <span className={K}>Layer 03 · Adhesive system</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.2vw,86px)] leading-[.92]`}>Made to bond.</h2>
          <p className={P}>Supplied as roll-stock for your own coating and lamination, or as finished self-adhesive constructions ready for launch.</p>
        </Chapter>
        <Chapter id="materials" len={CHAPTERS[4].len} align="left">
          <span className={K}>Layer 02 · Décor film</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.2vw,86px)] leading-[.92]`}>Choose the surface.</h2>
          <p className={P}>Wood, stone, marble, textile, solid colour and metallic décors.</p>
          <div className="pointer-events-auto mt-7 flex flex-wrap gap-2">
            {decorChoices.map((m, i) => (
              <button key={m.code} onClick={() => setDecor(i)} aria-pressed={i === decor} title={m.name}
                className={`flex items-center gap-3 rounded-full border py-1.5 pr-4 pl-1.5 text-[14px] backdrop-blur transition-colors ${i === decor ? "border-brass bg-brass/15 text-bone" : "border-bone/20 bg-ink/40 text-bone/80 hover:border-bone/50"}`}>
                <span className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${U(m.img, 120)})` }} />{m.name}
              </button>
            ))}
          </div>
        </Chapter>
        <Chapter len={CHAPTERS[5].len} align="left">
          <span className={K}>Layer 01 · Protective top layer</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.2vw,86px)] leading-[.92]`}>Set the sheen.</h2>
          <p className={P}>From super matte to high gloss, satin and anti-fingerprint — the top layer decides how the surface feels and ages.</p>
          <label className="pointer-events-auto mt-8 flex max-w-[420px] flex-col gap-3 rounded-[14px] border border-bone/15 bg-ink/50 p-5 backdrop-blur">
            <span className="flex justify-between text-[14px] text-bone/80"><span>Super matte</span><span className="text-brass">{glossName(gloss)}</span><span>High gloss</span></span>
            <input type="range" min="0" max="1" step="0.01" value={gloss} onChange={(e) => setGloss(+e.target.value)} className="w-full accent-[#c4a465]" aria-label="Top layer gloss" />
          </label>
        </Chapter>
        <Chapter len={CHAPTERS[6].len} align="bottom-left">
          <span className={K}>The collection</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.2vw,86px)] leading-[.92]`}>Four platforms.<br />{FINISHES.length} finishes.</h2>
          <p className={P}>{PLATFORMS.map((p) => p.name).join(" · ")}.</p>
        </Chapter>
        <Chapter id="oem" len={CHAPTERS[7].len} align="center">
          <span className={K}>Partner facilities · Republic of Korea</span>
          <h2 className={`${H} mt-4 text-[clamp(44px,6vw,104px)] leading-[.9]`}>Twenty years of making.</h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.65] text-bone/80">From material review and sampling to pilot supply and commercial rollout — under your brand.</p>
        </Chapter>
        <Chapter id="contact" len={CHAPTERS[8].len} align="right" className="w-full max-w-[640px]">
          <div className="pointer-events-auto rounded-[16px] border border-bone/12 bg-ink/85 p-[clamp(22px,3vw,40px)] backdrop-blur-xl">
            <span className={K}>Commercial enquiries</span>
            <h2 className={`${H} mt-3 mb-8 text-[clamp(32px,3.4vw,52px)] leading-[.95]`}>Build your surface.</h2>
            <EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} />
          </div>
        </Chapter>
      </div>
      <footer className="relative z-10 flex flex-wrap items-end justify-between gap-10 border-t border-bone/12 bg-ink px-[clamp(20px,5vw,80px)] py-14 text-bone">
        <Logo tone="light" height={44} />
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}<a href={`mailto:${EMAIL}`} className="text-brass">{EMAIL}</a></nav>
        <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
      </footer>
    </>
  );
}
