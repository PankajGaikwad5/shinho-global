"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useScroll } from "motion/react";
import LazyCanvas from "../kit/LazyCanvas";
import { useAnchorOverlay } from "../kit/Anchor";
import { Lines, Reveal } from "../shared/Reveal";
import LayerScene, { CHAPTERS, CHAPTERS_SM, MAX_LAYERS, ROUTE_LAYERS, decorChoices, decorUrlOf } from "./LayerScene";
import { buildBounds } from "../story/story";

// "Two ways to build your range" — brief point 6, inside this page, not a separate tab.
//
// One section. V13's 3D layer scene (LayerScene.jsx) fills it; the words live on it, not in a block of
// their own above it — selecting a route shows that route's details here, beside the stack it draws.
//
// The left column is narrow and sits on an ink gradient so it stays readable; the camera keeps the panel
// right of centre, clear of it. Nothing slides or fades on scroll: the only thing scroll does is open the
// stack and carry the camera round it.
const OPTIONS = [
  {
    id: "top-layer",
    name: "Top-layer supply",
    head: "We supply the decorative face film.",
    sub: "You add the adhesive and release liner on your own coating line.",
  },
  {
    id: "finished",
    name: "Finished film",
    head: "We supply the decorative face film, adhesive and release liner.",
    sub: "Your labels and packaging carry your brand.",
  },
];

export default function Layers() {
  const container = useRef(null);
  // V16's six chapters are nine screens of scroll. That is right on a desktop and far too long on a
  // phone, where the same travel has to be done with a thumb — so small screens run a shorter cut of the
  // same keyframes. The section's height follows the chapters, so the two always agree.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 1024);
    window.addEventListener("resize", onResize); onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const chapters = narrow ? CHAPTERS_SM : CHAPTERS;
  const bounds = useMemo(() => buildBounds(chapters), [chapters]);
  const screens = chapters.reduce((s, c) => s + c.len, 0);
  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const [routeIdx, setRouteIdx] = useState(1);
  const { onFrame, setEl } = useAnchorOverlay();

  const option = OPTIONS[routeIdx];
  const stack = ROUTE_LAYERS[option.id];

  // Picking a route in the header takes you to the construction it draws. Lenis is driving the page, so
  // this goes through window.scrollTo rather than scrollIntoView, which Lenis does not own.
  const chooseAndGo = (i) => {
    setRouteIdx(i);
    const el = container.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* 1 — the header, its own section. The heading and the choice live here. */}
      <section id="build-your-range" className="bg-ink px-[clamp(20px,4vw,56px)] pt-[clamp(110px,13vw,180px)] pb-[clamp(50px,6vw,84px)] text-bone">
        <div className="mx-auto max-w-[1360px]">
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div className="flex max-w-[860px] flex-col gap-5">
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-brass">Supply routes</span>
              <Lines lines={["Two ways to", "build your range."]} className="text-[clamp(26px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
            </div>
            <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-ash [text-wrap:pretty]">
              Choose a route. The construction below is drawn for the one you pick.
            </Reveal>
          </div>

          <div className="mt-[clamp(36px,4vw,64px)] flex flex-col">
            {OPTIONS.map((o, i) => {
              const on = routeIdx === i;
              return (
                <button key={o.id} onClick={() => chooseAndGo(i)} aria-pressed={on}
                  className={`group flex w-full flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-t border-bone/15 py-5 text-left ${i === OPTIONS.length - 1 ? "border-b" : ""}`}>
                  <span className="flex items-baseline gap-5">
                    <span className="font-mono text-[11px] text-brass">{on ? "—" : "+"}</span>
                    <span className="text-[clamp(22px,2vw,28px)] font-medium [font-stretch:115%] transition-transform duration-500 ease-cine group-hover:translate-x-3"
                      style={{ color: on ? "var(--color-brass)" : undefined }}>{o.name}</span>
                  </span>
                  <span className="max-w-[460px] text-[15px] leading-[1.6] text-ash" style={{ opacity: on ? 1 : 0.5 }}>{o.head}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2 — the stack. Its own section, full screen, with the selected route's detail on it. */}
      <section ref={container} className="relative bg-ink" style={{ height: `${screens * 100}vh` }}>
        {/* Phones and small tablets stack: stage on top, words beneath. Only from lg does the stage fill
            the screen with the words over it — below that there is no room for both in one frame. */}
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden lg:block">
        <div className="relative h-[46vh] w-full shrink-0 lg:absolute lg:inset-0 lg:h-full">
        <LazyCanvas className="absolute inset-0 h-full w-full" camera={{ position: [-1.1, 0.3, 5.6], fov: 42, near: 0.1, far: 80 }}>
          <LayerScene progress={scrollYProgress} bounds={bounds} route={option.id} decorUrl={decorUrlOf(decorChoices[0])} onAnchor={onFrame} />
        </LazyCanvas>

        {/* Layer labels, positioned per frame by the scene's anchors — V13's own treatment.
            Hidden below lg: anchored chips in a 390px frame cover the panel they are labelling. The
            layer list in the words below carries the same information there. */}
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
          {Array.from({ length: MAX_LAYERS }, (_, k) => {
            const l = stack[k];
            return (
              <span key={k} ref={setEl(k)} className="invisible absolute top-0 left-0 h-0 w-0">
                {l && (
                  /* Each label is a solid chip: the layers crowd together when the camera swings
                     edge-on, and plain text over the panel became unreadable. The note sits on its own
                     line so it cannot run off the side of the screen. */
                  <span className="absolute top-0 left-0 flex -translate-y-1/2 items-start gap-2.5">
                    <span className="mt-[9px] h-px w-8 shrink-0 bg-[#c4a465]" />
                    <span className="flex max-w-[230px] flex-col gap-0.5 rounded-[3px] bg-ink/85 px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,.5)] backdrop-blur-sm">
                      <span className="flex items-baseline gap-2 text-[14px] font-medium text-bone">
                        <span className="text-[11px] text-[#c4a465]">0{stack.length - k}</span>
                        {l.name}
                      </span>
                      <span className="text-[11px] leading-[1.45] text-bone/60">{l.note}</span>
                    </span>
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Ground for the words — only where they sit over the stage. */}
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(11,11,12,.94)_0%,rgba(11,11,12,.75)_26%,rgba(11,11,12,0)_52%)] lg:block" />
        </div>

        {/* The selected route's detail, with the stack it draws. A switch, so you need not scroll back. */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-center gap-5 overflow-y-auto px-[clamp(20px,4vw,56px)] py-7 lg:h-full lg:max-w-[min(100%,460px)] lg:flex-none lg:gap-7 lg:overflow-visible lg:py-0">
          {/* One segmented control rather than two loose pills: the active half slides across it. */}
          <div className="relative inline-flex self-start rounded-full border border-bone/20 bg-ink/60 p-1 backdrop-blur">
            <span aria-hidden="true"
              className="absolute top-1 bottom-1 left-1 rounded-full bg-brass transition-transform duration-500 ease-cine"
              style={{ width: "calc(50% - 4px)", transform: `translateX(${routeIdx * 100}%)` }} />
            {OPTIONS.map((o, i) => (
              <button key={o.id} onClick={() => setRouteIdx(i)} aria-pressed={routeIdx === i}
                className="relative z-10 flex-1 rounded-full px-6 py-2.5 text-[13px] whitespace-nowrap transition-colors duration-300"
                style={{ color: routeIdx === i ? "var(--color-ink)" : "rgba(242,239,233,.75)" }}>
                {o.name}
              </button>
            ))}
          </div>

          <div>
            <p className="text-[clamp(17px,1.7vw,23px)] leading-[1.4] font-medium text-bone">{option.head}</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-ash">{option.sub}</p>
          </div>

          {/* Below lg the anchored labels are hidden, so the layers are listed here instead. */}
          <ol className="flex list-none flex-col lg:hidden">
            {stack.map((l, k) => (
              <li key={l.name} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-t border-bone/15 py-2.5">
                <span className="font-mono text-[11px] text-brass">0{stack.length - k}</span>
                <span className="text-[15px] font-medium text-bone">{l.name}</span>
                <span className="basis-full text-[12px] leading-[1.5] text-bone/55">{l.note}</span>
              </li>
            ))}
          </ol>

          <p className="max-w-[380px] border-t border-bone/15 pt-4 text-[13px] leading-[1.6] text-bone/45 lg:pt-5">
            The wall, panel or furniture surface is where the film is applied. It is not supplied on the roll.
          </p>
        </div>
        </div>
      </section>
    </>
  );
}
