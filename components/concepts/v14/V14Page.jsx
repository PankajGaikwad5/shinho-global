"use client";

import { useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import RawScene from "./RawScene";
import LazyCanvas from "../kit/LazyCanvas";
import Chapter from "../story/Chapter";
import { buildBounds, storyAt } from "../story/story";
import Hud from "../shared/Hud";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { ENQUIRY_TYPES, PLATFORMS, EMAIL, NAV } from "@/lib/site";
import { MATS, U } from "@/lib/materials";

const CHAPTERS = [{ len: 1.3 }, { len: 1.3 }, { len: 1.4 }, { len: 1.8 }, { len: 1.4 }, { len: 1.4 }, { len: 1.5 }, { len: 1.5 }, { len: 1.7 }];
const PICKS = ["Natural Oak", "Calacatta", "Nero Marquina", "Brushed Steel", "Graphite Matte", "Verdigris"].map((n) => MATS.find((m) => m.name === n));

const K = "text-[12px] tracking-[.24em] text-brass uppercase";
const H = "font-medium [font-stretch:118%] tracking-[-.045em] text-bone [text-shadow:0_4px_40px_rgba(0,0,0,.6)]";
const P = "mt-6 max-w-[440px] text-[17px] leading-[1.65] text-bone/80";

export default function V14Page() {
  const container = useRef(null);
  const bounds = useMemo(() => buildBounds(CHAPTERS), []);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  const [finish, setFinish] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => { const i = storyAt(v, bounds).i; setChapter((c) => (c === i ? c : i)); });
  const f = PICKS[finish];

  return (
    <>
      <Hud />
      <div ref={container} className="relative bg-ink">
        <div className="fixed inset-0 z-0">
          <LazyCanvas className="h-full w-full" camera={{ position: [0, 0.8, 7.5], fov: 42, near: 0.1, far: 80 }}>
            <RawScene progress={scrollYProgress} bounds={bounds} chapter={chapter} finishUrl={U(f.img, 1200)} />
          </LazyCanvas>
        </div>

        <Chapter id="top" len={CHAPTERS[0].len} align="center" first>
          <span className={K}>Shinho Global</span>
          <h1 className={`${H} mt-6 text-[clamp(52px,8.4vw,150px)] leading-[.88]`}>From raw material<br /><span className="text-brass">to your roll.</span></h1>
          <p className="mx-auto mt-8 max-w-[440px] text-[16px] text-bone/75">Scroll to follow a decorative surface film from polymer to product.</p>
        </Chapter>
        <Chapter id="about" len={CHAPTERS[1].len} align="left">
          <span className={K}>01 · Raw material</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>It starts as polymer.</h2>
          <p className={P}>Shinho Global is a specialist international supply partner for decorative surface films and related polymer-based materials.</p>
        </Chapter>
        <Chapter len={CHAPTERS[2].len} align="right">
          <span className={K}>02 · Film platforms</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>Cast into film.</h2>
          <p className={P}>Decorative PVC, PET, PP and Co-PET — specialty film platforms for decorative, printable, coated and laminated applications.</p>
        </Chapter>
        <Chapter id="materials" len={CHAPTERS[3].len} align="left">
          <span className={K}>03 · Décor</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>Any surface<br />you can imagine.</h2>
          <p className={P}>Wood, stone, marble, textile, solid colour and metallic décors. Choose one — it follows the film through the rest of the story.</p>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-2">
            {PICKS.map((m, i) => (
              <button key={m.code} onClick={() => setFinish(i)} aria-pressed={i === finish}
                className={`flex items-center gap-3 rounded-full border py-1.5 pr-4 pl-1.5 text-[14px] backdrop-blur transition-colors ${i === finish ? "border-brass bg-brass/15 text-bone" : "border-bone/20 bg-ink/40 text-bone/80 hover:border-bone/50"}`}>
                <span className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${U(m.img, 120)})` }} />{m.name}
              </button>
            ))}
          </div>
        </Chapter>
        <Chapter len={CHAPTERS[4].len} align="right">
          <span className={K}>04 · Finish</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>Embossed,<br />then sealed.</h2>
          <p className={P}>Super matte to high gloss, satin, anti-fingerprint, embossed woodgrain — twelve surface finish technologies, finished with a protective top layer.</p>
        </Chapter>
        <Chapter len={CHAPTERS[5].len} align="left">
          <span className={K}>05 · Conversion</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>Slit, wound,<br />ready to ship.</h2>
          <p className={P}>Roll-stock, top-layer films and finished self-adhesive constructions — to your width, your format, your programme.</p>
        </Chapter>
        <Chapter id="oem" len={CHAPTERS[6].len} align="bottom-left">
          <span className={K}>06 · Partner facilities</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>Twenty years<br />of making, in Korea.</h2>
          <div className="mt-8 flex gap-10">
            {[["20+", "years"], ["4", "platforms"], ["12", "finishes"]].map(([n, d]) => (
              <div key={d}><span className={`${H} block text-[clamp(40px,4vw,64px)] leading-none text-brass`}>{n}</span><span className="text-[14px] text-bone/70">{d}</span></div>
            ))}
          </div>
        </Chapter>
        <Chapter id="process" len={CHAPTERS[7].len} align="right">
          <span className={K}>07 · Applied</span>
          <h2 className={`${H} mt-4 text-[clamp(40px,5.4vw,88px)] leading-[.92]`}>Under<br /><span className="text-brass">your name.</span></h2>
          <p className={P}>For manufacturers, converters, OEMs and distributors — from material review and sampling to pilot supply and commercial rollout.</p>
        </Chapter>
        <Chapter id="contact" len={CHAPTERS[8].len} align="right" className="w-full max-w-[640px]">
          <div className="pointer-events-auto rounded-[16px] border border-bone/12 bg-ink/85 p-[clamp(22px,3vw,40px)] backdrop-blur-xl">
            <span className={K}>Commercial enquiries</span>
            <h2 className={`${H} mt-3 mb-8 text-[clamp(34px,3.6vw,56px)] leading-[.95]`}>Start your range.</h2>
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
