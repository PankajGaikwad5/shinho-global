"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import WalkScene from "./WalkScene";
import LazyCanvas from "../kit/LazyCanvas";
import Chapter from "../story/Chapter";
import { buildBounds, storyAt } from "../story/story";
import Hud from "../shared/Hud";
import Logo from "../shared/Logo";
import EnquiryForm from "../shared/EnquiryForm";
import { ENQUIRY_TYPES, PLATFORMS, EMAIL, NAV } from "@/lib/site";
import { U } from "@/lib/materials";

const CHAPTERS = [{ len: 1.4 }, { len: 1.6 }, { len: 1.6 }, { len: 1.6 }, { len: 1.6 }, { len: 1.5 }, { len: 1.7 }];
const K = "text-[12px] tracking-[.22em] text-brass uppercase";
const H = "font-medium [font-stretch:115%] tracking-[-.04em] text-bone";
const PANEL = "rounded-[18px] bg-ink/75 p-[clamp(22px,2.6vw,36px)] shadow-[0_30px_60px_-30px_rgba(60,45,20,.35)] backdrop-blur-xl";

function Room({ n, platform, title, d }) {
  return (
    <div className={PANEL}>
      <span className={K}>Room {n} · {platform}</span>
      <h2 className={`${H} mt-3 text-[clamp(34px,4vw,64px)] leading-[.95]`}>{title}</h2>
      <p className="mt-4 text-[16px] leading-[1.65] text-ash">{d}</p>
      <p className="mt-5 text-[13px] text-stone">Click a finished surface to try another finish.</p>
    </div>
  );
}

export default function V15Page() {
  const container = useRef(null);
  const bounds = useMemo(() => buildBounds(CHAPTERS), []);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const [chapter, setChapter] = useState(0);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  useMotionValueEvent(scrollYProgress, "change", (v) => { const i = storyAt(v, bounds).i; setChapter((c) => (c === i ? c : i)); });
  const onFinish = (m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 2600); };

  return (
    <>
      <Hud tone="dark" />
      <div ref={container} className="relative bg-ink">
        <div className="fixed inset-0 z-0">
          <LazyCanvas className="h-full w-full" camera={{ position: [0.6, 1.7, 7], fov: 52, near: 0.1, far: 80 }}>
            <WalkScene progress={scrollYProgress} bounds={bounds} chapter={chapter} onFinish={onFinish} />
          </LazyCanvas>
        </div>

        <Chapter id="top" len={CHAPTERS[0].len} align="bottom-left" first>
          <div className={PANEL}>
            <span className={K}>Shinho Global · Showroom</span>
            <h1 className={`${H} mt-4 text-[clamp(44px,6.4vw,110px)] leading-[.9]`}>Walk through<br />the surface.</h1>
            <p className="mt-5 max-w-[420px] text-[16px] leading-[1.6] text-ash">Decorative surface films, applied. Scroll to walk the rooms — one for each film platform.</p>
          </div>
        </Chapter>
        <Chapter id="materials" len={CHAPTERS[1].len} align="right"><Room n="01" platform={PLATFORMS[0].name} title="Wood, stone and marble." d={PLATFORMS[0].d} /></Chapter>
        <Chapter len={CHAPTERS[2].len} align="left"><Room n="02" platform={PLATFORMS[1].name} title="Printable, coated, metallic." d={PLATFORMS[1].d} /></Chapter>
        <Chapter len={CHAPTERS[3].len} align="right"><Room n="03" platform={PLATFORMS[2].name} title="Faces for furniture." d={PLATFORMS[2].d} /></Chapter>
        <Chapter len={CHAPTERS[4].len} align="left"><Room n="04" platform={PLATFORMS[3].name} title="Ready for retail." d={PLATFORMS[3].d} /></Chapter>
        <Chapter id="oem" len={CHAPTERS[5].len} align="bottom-left">
          <div className={PANEL}>
            <span className={K}>Partner facilities · Republic of Korea</span>
            <h2 className={`${H} mt-3 text-[clamp(34px,4vw,64px)] leading-[.95]`}>Made in Korea,<br />for your brand.</h2>
            <p className="mt-4 text-[16px] leading-[1.65] text-ash">Manufacturing by our long-standing partner — 20+ years of experience. Shinho Global connects material selection, sampling, manufacturing and commercial supply into one route.</p>
          </div>
        </Chapter>
        <Chapter id="contact" len={CHAPTERS[6].len} align="right" className="w-full max-w-[640px]">
          <div className={`${PANEL} pointer-events-auto`}>
            <span className={K}>Commercial enquiries</span>
            <h2 className={`${H} mt-3 mb-8 text-[clamp(32px,3.4vw,52px)] leading-[.95]`}>Furnish your range.</h2>
            <EnquiryForm types={ENQUIRY_TYPES} interests={PLATFORMS.map((p) => p.name)} />
          </div>
        </Chapter>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.code} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="fixed top-24 left-1/2 z-[85] flex -translate-x-1/2 items-center gap-3 rounded-full bg-bone py-2 pr-5 pl-2 text-[14px] text-ink shadow-xl">
            <span className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${U(toast.img, 120)})` }} />
            Now showing <b className="font-medium">{toast.name}</b><span className="text-[12px] opacity-70">{toast.code}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 flex flex-wrap items-end justify-between gap-10 border-t border-bone/12 bg-ink px-[clamp(20px,5vw,80px)] py-14 text-bone">
        <Logo tone="dark" height={44} />
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ash">{NAV.map(([h, l]) => <a key={h} href={h} className="hover:text-brass">{l}</a>)}<a href={`mailto:${EMAIL}`} className="text-brass">{EMAIL}</a></nav>
        <span className="basis-full text-[13px] text-stone">© 2026 Shinho Global · Manufacturing carried out at partner facilities in the Republic of Korea</span>
      </footer>
    </>
  );
}
