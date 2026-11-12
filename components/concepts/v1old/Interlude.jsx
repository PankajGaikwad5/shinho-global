"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Video from "../shared/Video";
import { VIDEO } from "@/lib/media";

gsap.registerPlugin(ScrollTrigger);

// Scroll-scrubbed "iris open": a small window of molten metal widens to full screen as the headline separates.
export default function Interlude() {
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
    <section ref={root} className="relative h-[260vh] bg-ink" aria-label="From raw material">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div ref={win} className="absolute inset-0" style={{ clipPath: "inset(32% 36% 32% 36%)" }}>
          <Video media={VIDEO.foundry} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,.7)_100%)]" />
        </div>
        <div className="pointer-events-none relative z-10 text-center text-[clamp(56px,11vw,180px)] leading-[.86] font-medium [font-stretch:122%] tracking-[-.045em] mix-blend-difference">
          <div ref={top}>Every surface</div>
          <div ref={bottom}>starts as heat.</div>
        </div>
        <p ref={cap} className="absolute bottom-10 left-[clamp(20px,4vw,56px)] max-w-[380px] font-mono text-[11px] uppercase leading-[1.7] tracking-[.14em] text-bone/85 opacity-0">
          Compounding &amp; raw materials · Partner facility, Republic of Korea
        </p>
      </div>
    </section>
  );
}
