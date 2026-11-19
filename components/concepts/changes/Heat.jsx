"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Video from "../shared/Video";
import { VIDEO } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

// Brief point 8 — the heat idea, on Manufacturing & Quality.
//
// This is V1's Interlude (components/concepts/v1/Interlude.jsx) COPIED AS IS. Same footage, same
// mix-blend-difference, same 260vh, same sticky screen, same scrubbed iris from inset(32% 36%) to full
// bleed, same ∓160% headline split, same caption fade at 0.6, same type: clamp(56px,11vw,180px) at
// leading .86, [font-stretch:122%], tracking -.045em. It is a copy only because `/v1` renders the
// original and is frozen.
//
// THE ONLY CHANGE IS THE TEXT. An earlier attempt at this page rebuilt the scene instead — dropped the
// furnace for a CSS glow, dropped the blend, and set the type at 6.4vw — and it looked nothing like the
// reference. Do not do that again. If the furnace is to go, it goes by swapping VIDEO.foundry for
// approved footage, not by rebuilding the scene.
//
// THE TYPE SIZE is the one value that is not V1's: clamp(25px,6.5vw,110px) instead of
// clamp(56px,11vw,180px). The client's lines are 26 characters each against V1's 13 and 15, so V1's size
// cannot hold them on one line.
//
// ONE LINE PER BLOCK, AND IT MUST STAY THAT WAY — `whitespace-nowrap` is there to guarantee it.
// Letting the copy wrap to two lines per block was tried, to get bigger glyphs, and it changed the
// animation: the timeline is untouched, but `yPercent: ±160` is relative to each block's own height, so
// a two-line block is twice as tall and travels twice as far. The split stops reading like V1's.
// 6.5vw is the ceiling for one line — 26 characters at this tracking and font-stretch come to about 94%
// of the viewport, so there is no room above it. Do not go higher, and do not "fix" the size by wrapping.
// No padding on the block, as V1 has none. If the wording is ever shortened, put V1's clamp back.
//
// The caption no longer reads "Compounding & raw materials · Partner facility, Republic of Korea": point
// 8 says not to label fire or a metal furnace as our film-production equipment, and that caption did
// exactly that. It names the processes in the client's own words instead.
export default function Heat() {
  const root = useRef(null), win = useRef(null), top = useRef(null), bottom = useRef(null), cap = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 } });
      tl.fromTo(win.current, { clipPath: "inset(32% 36% 32% 36%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
        .fromTo(top.current, { yPercent: 0 }, { yPercent: -160, ease: "none" }, 0)
        .fromTo(bottom.current, { yPercent: 0 }, { yPercent: 160, ease: "none" }, 0)
        .fromTo(cap.current, { opacity: 0 }, { opacity: 1, ease: "none" }, 0.6);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[260vh] bg-ink" aria-label="Heat, pressure, precision">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div ref={win} className="absolute inset-0" style={{ clipPath: "inset(32% 36% 32% 36%)" }}>
          <Video media={VIDEO.foundry} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,.7)_100%)]" />
        </div>
        <div className="pointer-events-none relative z-10 text-center text-[clamp(25px,6.5vw,110px)] leading-[.86] font-medium [font-stretch:122%] tracking-[-.045em] whitespace-nowrap mix-blend-difference">
          <div ref={top}>Heat. Pressure. Precision.</div>
          <div ref={bottom}>How a surface takes shape.</div>
        </div>
        <p ref={cap} className="absolute bottom-10 left-[clamp(20px,4vw,56px)] max-w-[380px] font-mono text-[11px] uppercase leading-[1.7] tracking-[.14em] text-bone/85 opacity-0">
          Printing · Embossing · Coating · Winding · Inspection
        </p>
      </div>
    </section>
  );
}
