"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Video from "../shared/Video";
import { Lines } from "../shared/Reveal";
import { VIDEO } from "@/lib/media";

// Edited opening montage (hard-cut rhythm, ~3s per shot) — swap for the client's own footage.
const MONTAGE = [VIDEO.factoryNightTop, VIDEO.slitter, VIDEO.liquidSteam, VIDEO.machinery];

// Title card: full-bleed footage framed in 2.39:1 letterbox with a camera HUD.
export default function Opening() {
  const root = useRef(null), tc = useRef(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [cut, setCut] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCut((c) => (c + 1) % MONTAGE.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const t = (now - t0) / 1000, p = (n) => String(Math.floor(n)).padStart(2, "0");
      if (tc.current) tc.current.textContent = `${p(t / 3600)}:${p((t / 60) % 60)}:${p(t % 60)}:${p((t * 24) % 24)}`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={root} id="top" className="relative h-screen min-h-[620px] overflow-hidden bg-black">
      <motion.div className="absolute inset-0" style={{ scale }}>
        {MONTAGE.map((m, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-[1.2s] ease-cine" style={{ opacity: i === cut ? 1 : 0 }}>
            <Video media={m} active={i === cut || i === (cut + 1) % MONTAGE.length} />
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.15)_30%,rgba(0,0,0,.75)_100%)]" />

      {/* 2.39:1 letterbox */}
      <div className="absolute inset-x-0 top-0 h-[max(56px,calc((100vh-100vw/2.39)/2))] bg-black" />
      <div className="absolute inset-x-0 bottom-0 h-[max(56px,calc((100vh-100vw/2.39)/2))] bg-black" />

      <motion.div style={{ opacity: fade }} className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-5 text-center">
        <motion.span initial={{ opacity: 0, letterSpacing: "1em" }} animate={{ opacity: 1, letterSpacing: ".42em" }} transition={{ duration: 2.2, delay: 0.9, ease: [0.6, 0, 0.2, 1] }}
          className="font-mono text-[11px] uppercase text-bone/80">A Shinho Global film</motion.span>
        <Lines as="h1" delay={1.2} lines={["Surfaces,", "made under", "your name."]}
          className="text-[clamp(56px,10vw,168px)] leading-[.86] font-medium [font-stretch:122%] tracking-[-.045em]" />
      </motion.div>

      {/* Camera HUD inside the frame */}
      <div className="pointer-events-none absolute inset-x-[clamp(16px,3vw,40px)] top-[calc(max(56px,calc((100vh-100vw/2.39)/2))+18px)] flex justify-between font-mono text-[10px] uppercase tracking-[.16em] text-bone/80">
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d4473a]" />Rec · Scene 01</span>
        <span ref={tc}>00:00:00:00</span>
      </div>
      <div className="pointer-events-none absolute inset-x-[clamp(16px,3vw,40px)] bottom-[calc(max(56px,calc((100vh-100vw/2.39)/2))+18px)] flex justify-between font-mono text-[10px] uppercase tracking-[.16em] text-bone/70">
        <span>Partner facility · Republic of Korea</span>
        <span className="hidden sm:inline">24 fps · 2.39 : 1</span>
      </div>

      <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center font-mono text-[10px] uppercase tracking-[.3em] text-bone/60">
        <span className="animate-pulse">Scroll to roll film</span>
      </div>
    </section>
  );
}
