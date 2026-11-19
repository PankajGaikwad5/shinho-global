"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll } from "motion/react";
import LazyCanvas from "../kit/LazyCanvas";
import Chapter from "../story/Chapter";
import { Lines, Reveal } from "../shared/Reveal";
import { buildBounds } from "../story/story";
import ShowroomScene, { START } from "./ShowroomScene";
import { U } from "@/lib/materials";

// The V12 showroom idea as a short Applications section — brief point 7.
//
// V12 ("Showroom Walk", components/concepts/v15) is a whole page: foyer, four rooms, a finale and an
// enquiry room over eleven screens. The client asked for "a short Applications section ... a small
// selection of strong interior examples ... do not build a second long homepage or a separate showroom
// journey". So this is three rooms at V15's own pacing, introduced by a header in this page's style —
// the same two-part shape the layer story above it uses: words on ink, then the stage.
//
// Three rooms at len 1.35, so: two camera moves (one screen each) and 1.05 screens of hold, in 3.05
// screens of scroll. V15 uses 1.6, but V15 is a whole page — here the hold is only reading time for the
// room's panel, and every screen of it is scroll where the walk stands still. See the length note in
// LayerScene.jsx: shortening a section by removing rooms takes away the movement and leaves the holds,
// which is the wrong half.
const CHAPTERS = [{ len: 1.35 }, { len: 1.35 }, { len: 1.35 }];

const ROOMS = [
  { n: "01", name: "Hospitality", lede: "Wall panelling, joinery and feature surfaces in hotels, restaurants and lobbies." },
  { n: "02", name: "Workplace", lede: "Doors, partitions and furniture surfaces across commercial interiors." },
  { n: "03", name: "Residential", lede: "Kitchen fronts, wardrobes and built-in furniture in wood and stone visuals." },
];

const K = "font-mono text-[11px] uppercase tracking-[.14em] text-brass";
const PANEL = "rounded-[18px] bg-ink/75 p-[clamp(22px,2.6vw,36px)] shadow-[0_30px_60px_-30px_rgba(60,45,20,.35)] backdrop-blur-xl";

export default function Showroom() {
  const container = useRef(null);
  const bounds = useMemo(() => buildBounds(CHAPTERS), []);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const onFinish = (m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 2600); };

  return (
    <>
      {/* 1 — the header, on ink, as the layer story's header above it is. */}
      <section id="applications" className="bg-ink px-[clamp(20px,4vw,56px)] pt-[clamp(110px,13vw,180px)] pb-[clamp(50px,6vw,84px)] text-bone">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div className="flex max-w-[860px] flex-col gap-5">
              <span className={K}>Applications</span>
              <Lines lines={["A few rooms,", "a lot of surface."]} className="text-[clamp(26px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
            </div>
            <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">
              Interior examples showing where these films are applied. Illustrations of possible applications,
              not Shinho Global customer projects.
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2 — the walk. One fixed stage, three rooms over it. */}
      <section ref={container} className="relative bg-[#ece6dc]">
        <div className="absolute inset-0">
          <div className="sticky top-0 h-screen overflow-hidden">
            <LazyCanvas className="h-full w-full" camera={{ position: START, fov: 52, near: 0.1, far: 80 }}>
              <ShowroomScene progress={scrollYProgress} bounds={bounds} onFinish={onFinish} />
            </LazyCanvas>
          </div>
        </div>

        {ROOMS.map((r, i) => (
          <Chapter key={r.n} len={CHAPTERS[i].len} align={i % 2 ? "left" : "right"}>
            <div className={PANEL}>
              <span className={K}>Application {r.n}</span>
              <h3 className="mt-3 text-[clamp(26px,4vw,64px)] leading-[.95] font-medium [font-stretch:115%] tracking-[-.04em] text-bone">{r.name}</h3>
              <p className="mt-4 text-[16px] leading-[1.65] text-ash">{r.lede}</p>
              <p className="mt-5 text-[13px] text-stone">Click a finished surface to try another finish.</p>
            </div>
          </Chapter>
        ))}
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div key={toast.code} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="fixed top-24 left-1/2 z-[85] flex -translate-x-1/2 items-center gap-3 rounded-full bg-bone py-2 pr-5 pl-2 text-[14px] text-ink shadow-xl">
            <span className="h-8 w-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${U(toast.img, 120)})` }} />
            Now showing <b className="font-medium">{toast.name}</b><span className="text-[12px] opacity-70">{toast.code}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
