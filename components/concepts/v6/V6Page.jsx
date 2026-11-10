"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Board, { layout } from "./Board";
import Hud from "../shared/Hud";
import Video from "../shared/Video";
import Editorial from "./Editorial";
import { Lines } from "../shared/Reveal";
import { thumb } from "@/lib/brief";
import { PLATFORMS, FINISHES } from "@/lib/site";
import { VIDEO, IMG } from "@/lib/media";
import { MATS, CATL } from "@/lib/materials";
import { THEMES } from "@/lib/themes";

const MODES = { light: THEMES.gallery, dark: THEMES.galleryDark };

// 40 tiles: products, footage, brand photography and type, interleaved.
const PRODUCTS = MATS.map((m, i) => ({ img: thumb(m, 900), title: m.name, sub: `${m.code} · ${CATL[m.cat]}`, body: m.finish, shape: i % 3 === 1 ? "square" : "portrait" }));
const FOOTAGE = [
  [VIDEO.factoryAerial, "Partner manufacturing", "Republic of Korea"], [VIDEO.slitter, "Slitting & finishing", "Partner facility"],
  [VIDEO.marble, "Stone & marble finishes", "Decorative PVC films"], [VIDEO.metalLight, "Brushed metallic", "Decorative PET"],
  [VIDEO.woodPlant, "Embossed woodgrain", "Architectural surface films"], [VIDEO.liquidMetal, "Decorative effects", "Top-layer films"],
].map(([video, title, sub]) => ({ video, title, sub, shape: "landscape" }));
const BRAND = [
  [IMG.ceiling(1400), "Architectural film", "Interior ceiling"], [IMG.facility(1400), "Partner facility", "Republic of Korea"],
  [IMG.line(1400), "Production line", "Partner facility"], [IMG.coating(1400), "Coating & processing", "Partner facility"],
  [IMG.control(1400), "Process control", "Partner facility"], [IMG.dispatch(1400), "Inspection & dispatch", "Partner facility"],
  [IMG.contact(1400), "Under your name", "Shinho Global"],
].map(([img, title, sub]) => ({ img, title, sub, shape: "landscape" }));
const WORDS = [
  ...PLATFORMS.map((p) => ({ word: p.name, sub: "What we supply", title: p.name, body: p.d })),
  { word: `${FINISHES.length} surface finish technologies`, sub: "Finishes", title: "Surface finish technologies", body: FINISHES.map((f) => f.name).join(" · ") },
  { word: "From sampling to scalable supply", sub: "Shinho Global", title: "From sampling to scalable supply", body: "Material review, sampling, pilot supply and commercial rollout." },
].map((w) => ({ ...w, shape: "landscape" }));

function interleave() {
  const out = [], p = [...PRODUCTS], v = [...FOOTAGE], b = [...BRAND], w = [...WORDS];
  for (let k = 0; out.length < 40; k++) {
    const pick = [p, v, p, b, p, w, p, b][k % 8];
    const src = pick.length ? pick : [p, b, v, w].find((x) => x.length);
    if (!src) break;
    out.push(src.shift());
  }
  return out;
}

export default function V6Page() {
  const items = useMemo(() => layout(interleave()), []);
  const [mode, setMode] = useState("light");
  const [open, setOpen] = useState(null);
  const [hovered, setHovered] = useState(null);
  const cursor = useRef(null);
  const T = MODES[mode];
  const colors = useMemo(() => ({ ink: T["--color-bone"], paper: T["--color-ink"], accent: T["--color-brass"] }), [T]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const moveCursor = (e) => { if (cursor.current) cursor.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; };

  return (
    <div style={T} className="bg-ink text-bone transition-colors duration-500">
      <Hud tone={mode === "light" ? "dark" : "light"}>
        <button onClick={() => setMode(mode === "light" ? "dark" : "light")} aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          className="flex h-8 items-center gap-1 rounded-full border border-bone/25 px-1">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] transition-colors ${mode === "light" ? "bg-bone text-ink" : "text-bone/60"}`} aria-hidden="true">☀</span>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] transition-colors ${mode === "dark" ? "bg-bone text-ink" : "text-bone/60"}`} aria-hidden="true">☾</span>
        </button>
      </Hud>

      <section id="top" className="relative h-screen min-h-[640px] touch-pan-y overflow-hidden select-none md:cursor-none" onMouseMove={moveCursor} onMouseEnter={() => cursor.current && (cursor.current.style.opacity = "1")} onMouseLeave={() => cursor.current && (cursor.current.style.opacity = "0")}>
        <div className="absolute inset-0"><Board items={items} colors={colors} onOpen={setOpen} onHover={setHovered} /></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_60%,var(--color-ink)_100%)]" />

        <div className="pointer-events-none absolute bottom-12 left-[clamp(20px,4vw,56px)] max-w-[600px]">
          <Lines as="h1" delay={1.2} lines={["Decorative surface films,", "made for your brand."]}
            className="text-[clamp(32px,4.2vw,68px)] leading-[.95] font-medium [font-stretch:118%] tracking-[-.04em] [text-shadow:0_2px_30px_var(--color-ink)]" />
        </div>
        <div className="pointer-events-none absolute right-[clamp(20px,4vw,56px)] bottom-12 text-right">
          <AnimatePresence mode="wait">
            {hovered && (
              <motion.div key={hovered.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                <span className="block text-[13px] text-brass">{hovered.sub}</span>
                <span className="block text-[22px] font-medium [font-stretch:112%]">{hovered.title}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* custom cursor (desktop) */}
        <div ref={cursor} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[70] hidden opacity-0 transition-opacity duration-200 md:block">
          <span className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bone text-[12px] font-medium text-ink transition-[width,height] duration-300 ${hovered ? "h-20 w-20" : "h-14 w-14"}`}>
            {hovered ? "Open" : "Drag"}
          </span>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div key="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            data-lenis-prevent role="dialog" aria-label={open.title}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/94 p-[clamp(16px,4vw,56px)] backdrop-blur-md" onClick={() => setOpen(null)}>
            <motion.div initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.6, 0, 0.2, 1] }}
              className="grid w-full max-w-[1240px] grid-cols-1 gap-[clamp(24px,4vw,56px)] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-char">
                {open.video ? <Video media={open.video} /> : open.img ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${open.img.replace(/w=\d+/, "w=1800")})` }} />
                  : <div className="flex h-full items-center p-10 text-[clamp(32px,4vw,56px)] leading-[1.02] font-medium [font-stretch:115%]">{open.word}</div>}
              </div>
              <div className="flex flex-col gap-5 py-2">
                <span className="text-[14px] text-brass">{open.sub}</span>
                <h2 className="text-[clamp(32px,3.4vw,52px)] leading-[.98] font-medium [font-stretch:115%] tracking-[-.03em]">{open.title}</h2>
                {open.body && <p className="text-[17px] leading-[1.6] text-ash">{open.body}</p>}
                <div className="mt-auto flex flex-wrap gap-4">
                  <a href="#contact" onClick={() => setOpen(null)} className="rounded-full bg-bone px-6 py-3 text-[15px] font-medium text-ink hover:bg-brass hover:text-ink">Enquire about this</a>
                  <button onClick={() => setOpen(null)} className="rounded-full border border-bone/30 px-6 py-3 text-[15px]">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Editorial logo={mode === "light" ? "dark" : "light"} />
    </div>
  );
}
