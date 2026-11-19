"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "@/components/fonts";
import { U, MATS } from "@/lib/materials";
import { HERO_HINT, SEQUENCE } from "@/lib/changes";
import { STAGES } from "../oem/Curve";
import RollStage from "./RollStage";

// The 15 Nov brief's opening scroll, for /changes.
//
// A copy of components/concepts/v1/Hero.jsx, not an import of it: the client's brief changes the scenes,
// adds buttons to scene 1 and scene 7 and adds the Explore Materials / Skip Intro controls, and the current
// homepage at `/` must stay exactly as it is. The tunnel engine, pacing, type and constants below are V1's,
// untouched — only the copy and the controls differ.
//
// Original V1 header follows.
// V1-only fork of components/Hero.jsx (the /original port stays untouched).
// Same depth-tunnel engine and visuals, carrying the client's seven-message sequence.
// Paced as beats: each message glides in (long sine ease), settles and holds briefly while you read; the supporting
// line fades in once the headline has landed. Arriving/leaving text is gently defocused (rack focus) and the lens
// widens a touch while moving. Everything is tuned for smoothness over snap: no auto-snapping, soft camera follow.
const DEFAULT_THEME = 'dark';
const SCROLL_LENGTH = 1100;          // vh — six beats of ~180vh each
const MOTION_INTENSITY = 1;
const MSG_Z = [-400, -3000, -6200, -9400, -12600, -15800, -19000];
const HOLD_D = -400;                 // where a message sits while held (the original opening headline's distance)
const PLATEAU = MSG_Z.map((z) => -z + HOLD_D);   // travel at which each message is held
const SEG = PLATEAU.length - 1;
const HOLD_A = .16, HOLD_B = .12;      // share of each beat spent holding on the outgoing / incoming message
const easeIO = (x) => -(Math.cos(Math.PI*x) - 1)/2;   // sine in-out: no sudden acceleration
const clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
// Scroll progress (0..1) → camera travel, with holds on every message and eased flights between them.
const beatTravel = (p) => {
  const u = p*SEG, j = Math.min(SEG - 1, Math.floor(u)), g = clamp01((u - j - HOLD_A)/(1 - HOLD_A - HOLD_B));
  return PLATEAU[j] + (PLATEAU[j + 1] - PLATEAU[j])*easeIO(g);
};
// Midpoints between messages: which chapter the HUD shows.
const SPLITS = MSG_Z.slice(1).map((z, i) => -(MSG_Z[i] + z) / 2);
// Panel clusters, one per scene, at that scene's own depth — each carrying what the client's brief
// (point 2) asks THAT scene to show. The clusters used to be one scene out of step: scene 02 ("wood,
// fabric, metal") was showing cast swatches and scene 03 (cast films) was showing architectural.
//
// 01 and 05 have no cluster: RollStage is their visual, and scene 05 says "let the material remain
// the focus". 07 has none either — "End on a clear screen."
//
// Scene 04 says any unmade finish must be marked as a concept. We cannot tell which of the finishes in
// lib/materials.js are real products, so it shows catalogue finishes only and invents no variations to
// mark. That is open question 1 for the client.
//
// Scene 03 is ONE panel, and its neighbours are pulled back so they do not drift into it. Panels stay
// visible from 3600 of depth away, so a cluster centred 3200 ahead of a message is still in frame while
// that message is being read — which is why an earlier version of scene 03 showed wood, marble, teal and
// pearl at once, i.e. exactly the montage the client ruled out. Moving scene 04's cluster back to -10700
// puts its nearest panel beyond that 3600 window at scene 03's hold.
const CLUSTERS = [
  { cat: ['arch', 'deco'], z: -3000, n: 12, spread: 3000 },             // 02 wood, stone, metal
  { cat: 'cast', z: -6900, n: 1, spread: 0 },                           // 03 one restrained visual
  { cat: null, z: -10700, n: 11, spread: 2600, offset: 3 },             // 04 finish variations
  { cat: null, z: -15800, n: 5, spread: 2600, offset: 13 },             // 06 thinning toward the close
];
const H_STYLE = { margin: "0", fontSize: "clamp(40px,11vw,176px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" };
const H3_STYLE = { ...H_STYLE, fontSize: "clamp(34px,9.4vw,152px)", lineHeight: ".9" };
// V1's scenes are two or three short lines ("Behind Every / Surface."), so one size fits them all. The
// client's scenes include full sentences ("Cast films for signs, graphics and protection."), and at V1's
// size those overflow the card and rewrap into ragged, broken lines.
//
// So the size follows the LONGEST line rather than the number of lines. Each step keeps the line under
// ~75vw at its own vw size, so a scene never rewraps and the breaks stay where the copy puts them.
//
// THE CLAMP FLOORS ARE PHONE SIZES, NOT DESKTOP ONES. They started at 76/68/52/42/34px, which is what
// the vw term gives on a laptop - so on a 390px screen the FLOOR won and a 76px headline was forced
// onto the card, overflowed it and rewrote the client's line breaks into ragged ones. Each floor is now
// the size its own vw term gives at a 360px viewport (never under 26px), so the floor binds only below
// 360px and on every real phone the vw term governs and the line fits. Raise a floor and you break
// mobile; the vw number is the one that sets the look.
const H4_STYLE = { ...H_STYLE, fontSize: "clamp(30px,8.2vw,132px)", lineHeight: ".92" };
const H5_STYLE = { ...H_STYLE, fontSize: "clamp(26px,6.6vw,106px)", lineHeight: ".95", letterSpacing: "-.035em" };
const H6_STYLE = { ...H_STYLE, fontSize: "clamp(26px,5.4vw,88px)", lineHeight: "1", letterSpacing: "-.03em" };
const headStyle = (head) => {
  const longest = Math.max(...head.map((l) => l.length));
  if (longest <= 12) return head.length > 2 ? H3_STYLE : H_STYLE;
  if (longest <= 17) return H4_STYLE;
  if (longest <= 23) return H5_STYLE;
  return H6_STYLE;
};

export default function Hero() {
  const [chapter, setChapter] = useState(0);
  const heroRef = useRef(null), stageRef = useRef(null), sceneRef = useRef(null), panelsRef = useRef(null);
  const depthRef = useRef(null), hintRef = useRef(null), barRef = useRef(null);
  const look = useRef({x:0,y:0,tx:0,ty:0,dx:0,dy:0,drag:null});
  // Camera travel, shared with RollStage so the roll arrives and leaves with its scene.
  const st = useRef({ travel: 0 });

  useEffect(() => {
    const host = panelsRef.current; if (!host) return;
    host.innerHTML = '';
    let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const panels = [];
    CLUSTERS.forEach(({cat, z: Z, n, spread, offset = 0}, ci) => {
      const list = !cat ? MATS : Array.isArray(cat) ? MATS.filter(m => cat.includes(m.cat)) : MATS.filter(m => m.cat === cat);
      for (let k = 0; k < n; k++) {
        const m = cat ? list[k % list.length] : list[(k*5 + offset) % list.length];
        const z = Z + spread*.47 - (n > 1 ? k/(n - 1) : .47)*spread + (rnd() - .5)*240;
        const a = k*2.399 + ci*1.1 + rnd()*.4;
        const r = (ci === 0 && k < 4 ? 820 : 620) + rnd()*440;
        const x = Math.cos(a)*r*1.5, y = Math.sin(a)*r*.8;
        const tall = rnd() < .55, w = tall ? 250 + rnd()*110 : 380 + rnd()*150, h = tall ? w*1.38 : w*.66;
        const el = document.createElement('div');
        el.style.cssText = `position:absolute;left:0;top:0;width:${w.toFixed(0)}px;transform:translate(-50%,-50%) translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,${z.toFixed(0)}px) rotateY(${(-x/1000*30).toFixed(1)}deg) rotateX(${(y/1000*18).toFixed(1)}deg);opacity:0;visibility:hidden`;
        el.innerHTML = `<div style="width:100%;height:${h.toFixed(0)}px;background:#1c1c1c url(${U(m.img, 800)}) center/cover;box-shadow:0 40px 80px rgba(0,0,0,.35)"></div><div style="display:flex;justify-content:space-between;gap:12px;margin-top:14px;font:500 12px/1 ${MONO};letter-spacing:.1em;text-transform:uppercase"><span>${m.code}</span><span>${m.name}</span></div>`;
        host.appendChild(el);
        panels.push({el, z, x, y, op: -1});
      }
    });
    // Headlines and the closing shot share the original's depth fade ([data-depth]); headlines also carry [data-card].
    const texts = [...sceneRef.current.querySelectorAll('[data-depth]')].map(el => ({el, z:+el.dataset.depth, card: el.hasAttribute('data-card'), on: false, op: -1}));

    texts.forEach((q, i) => { q.plateau = q.card ? PLATEAU[i] : null; q.blur = -1; });

    // Write styles only when the value actually changes — keeps the frame loop light on slower machines.
    const setOp = (q, op) => {
      const v = Math.round(op*500)/500;
      if (v === q.op) return;
      q.op = v; q.el.style.opacity = String(v); q.el.style.visibility = v < .01 ? 'hidden' : 'visible';
    };

    const L = look.current;
    let travel = 0, last, raf, current = 0, lastBar = -1, lastHint = -1, lastDepth = '', punch = 0, lastPersp = 1000;
    const stage = stageRef.current;

    const onMouse = e => { L.tx = (e.clientX/window.innerWidth - .5); L.ty = (e.clientY/window.innerHeight - .5); };

    const tickHero = (k, now) => {
      const hero = heroRef.current, scene = sceneRef.current; if (!hero || !scene) return;
      const r = hero.getBoundingClientRect(), span = Math.max(1, r.height - window.innerHeight);
      const p = Math.max(0, Math.min(1, -r.top/span));
      const prev = travel;
      travel += (beatTravel(p) - travel)*Math.min(1, .055*k);
      if (r.bottom < 0) return;
      const inten = MOTION_INTENSITY;
      if (!L.drag) { L.dx *= Math.pow(.92, k); L.dy *= Math.pow(.92, k); }
      const tx = L.tx*9*inten + L.dx + Math.sin(now/4200)*1.2*inten, ty = -L.ty*6*inten + L.dy + Math.cos(now/5100)*.8*inten;
      L.x += (tx - L.x)*.06*k; L.y += (ty - L.y)*.06*k;
      // Lens: widen slightly with speed for a sense of rush through the flights; back to 1000 when holding.
      punch += (clamp01(Math.abs(travel - prev)/(120*k)) - punch)*Math.min(1, .04*k);
      const persp = Math.round(1000 - punch*80);
      if (persp !== lastPersp) { lastPersp = persp; stage.style.perspective = persp + 'px'; }
      scene.style.transform = `translateZ(1000px) rotateX(${L.y.toFixed(2)}deg) rotateY(${L.x.toFixed(2)}deg) translateZ(-1000px) translate3d(0,0,${travel.toFixed(1)}px)`;
      const cl = v => v < 0 ? 0 : v > 1 ? 1 : v;
      for (const q of panels) {
        const d = q.z + travel;
        let op = Math.min(cl((d + 3600)/1400), cl((-d - 60)/420));
        if (op > 0 && d < -60) { const s = 1000/(-d), sx = Math.abs(q.x)*s, sy = Math.abs(q.y)*s; op *= cl(Math.max((sx - 300)/160, (sy - 220)/120)); }
        setOp(q, op);
      }
      for (const q of texts) {
        const d = q.z + travel, op = Math.min(cl((d + 2200)/900), cl((-d - 60)/320));
        setOp(q, op);
        if (q.card) {
          // Rack focus: soft while far away or flying past, sharp at the hold.
          const blur = op < .01 ? 0 : Math.round((d < HOLD_D ? Math.min(3.5, (HOLD_D - d)/360) : Math.min(3.5, (d - HOLD_D)/90))*4)/4;
          if (blur !== q.blur) { q.blur = blur; q.el.style.filter = blur ? `blur(${blur}px)` : 'none'; }
          // Landed: the counter and supporting line come in under the headline; they leave as soon as it moves on.
          const near = Math.abs(travel - q.plateau);
          if (!q.on && near < 260) { q.on = true; q.el.dataset.on = '1'; }
          else if (q.on && near > 700) { q.on = false; q.el.dataset.on = '0'; }
        }
      }
      const t = travel;
      let ch = 0; while (ch < SPLITS.length && t >= SPLITS[ch]) ch++;
      if (ch !== current) { current = ch; setChapter(ch); }
      const bar = Math.round(p*1000)/10;
      if (barRef.current && bar !== lastBar) { lastBar = bar; barRef.current.style.width = bar + '%'; }
      const hint = Math.round(cl(1 - t/500)*100)/100;
      if (hintRef.current && hint !== lastHint) { lastHint = hint; hintRef.current.style.opacity = String(hint); }
      const depth = (t/100).toFixed(1).padStart(5,'0') + ' m';
      if (depthRef.current && depth !== lastDepth) { lastDepth = depth; depthRef.current.textContent = depth; }
      st.current.travel = travel;
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const k = Math.min(3, (now - (last || now))/16.67); last = now;
      tickHero(k, now);
    };

    window.addEventListener('mousemove', onMouse);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      host.innerHTML = '';
    };
  }, []);

  // DRAG-TO-LOOK MUST NOT EAT CLICKS.
  //
  // This used to call setPointerCapture on pointerdown. Pointer capture retargets the whole gesture to
  // the capture element - including the click that follows - so a click that started on a button was
  // delivered to the stage instead of the button. Scene 01's and scene 07's CTAs looked alive and did
  // nothing, and so did anything else placed inside the stage.
  //
  // Capture is now taken only once the pointer has really moved, and never for a gesture that began on
  // a link or a button. A press that does not move stays a click.
  const DRAG_SLOP = 4;   // px of movement before a press becomes a drag
  const stageDown = (e) => {
    if (e.pointerType === 'touch') return;
    if (e.target && e.target.closest && e.target.closest('a,button')) return;
    look.current.drag = { x: e.clientX, y: e.clientY, id: e.pointerId, held: false };
  };
  const stageMove = (e) => {
    const L = look.current; if (!L.drag) return;
    if (!L.drag.held) {
      if (Math.abs(e.clientX - L.drag.x) + Math.abs(e.clientY - L.drag.y) < DRAG_SLOP) return;
      L.drag.held = true;
      try { e.currentTarget.setPointerCapture(L.drag.id); } catch {}
    }
    L.dx = Math.max(-38, Math.min(38, L.dx + (e.clientX - L.drag.x)*.08));
    L.dy = Math.max(-22, Math.min(22, L.dy - (e.clientY - L.drag.y)*.06));
    L.drag = { x: e.clientX, y: e.clientY, id: L.drag.id, held: true };
  };
  const stageUp = () => { look.current.drag = null; };

  // The opening is always dark, as the brief asks. No theme control on this page.
  const dark = DEFAULT_THEME === 'dark';
  const ink = dark ? '#f2efe9' : '#151515', muted = dark ? '#8f8b84' : '#5d5a55';
  const heroBg = dark ? '#0b0b0c' : '#ece8e1', heroInk = ink, heroMuted = muted;
  const heroLine = dark ? 'rgba(242,239,233,.22)' : 'rgba(21,21,21,.2)';
  const vignette = dark ? 'rgba(0,0,0,.75)' : 'rgba(236,232,225,.85)';
  const total = String(SEQUENCE.length).padStart(2, '0');

  return (
    <section ref={heroRef} id="top" style={{ position: "relative", height: SCROLL_LENGTH + 'vh', background: heroBg, transition: "background .8s ease" }}>
      <div ref={stageRef} onPointerDown={stageDown} onPointerMove={stageMove} onPointerUp={stageUp} onPointerCancel={stageUp} style={{ position: "sticky", top: "0", height: "100vh", minHeight: "560px", overflow: "hidden", perspective: "1000px", perspectiveOrigin: "50% 50%", color: heroInk, cursor: "grab", touchAction: "pan-y", userSelect: "none" }}>
        {/* Scene 01's film winding onto a roll and scene 05's roll + carton. Behind the message cards,
            never in front: the opening rules say words must never be covered by moving products. */}
        <RollStage st={st} plateaus={[PLATEAU[0], PLATEAU[4]]} />

        <div ref={sceneRef} style={{ position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transformStyle: "preserve-3d", zIndex: 1 }}>
          <div ref={panelsRef} style={{ position: "absolute", left: "0", top: "0", transformStyle: "preserve-3d", color: heroMuted }}></div>

          {SEQUENCE.map((m, i) => {
            const z = MSG_Z[i], Tag = i === 0 ? 'h1' : 'h2';
            return (
              <div key={i} data-depth={z} data-card="" style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: `translate(-50%,-50%) translateZ(${z}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none", opacity: 0, visibility: "hidden" }}>
                <span className="v1h-eye" style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>{String(i + 1).padStart(2, '0')} / {total}</span>
                <Tag style={headStyle(m.head)}>
                  {m.head.map((line, j) => <span key={j} style={{ display: "block" }}>{line}</span>)}
                </Tag>
                <p className="v1h-sub" style={{ margin: "6px 0 0", maxWidth: "900px", fontSize: "clamp(22px,2.1vw,32px)", lineHeight: "1.35", fontWeight: "400", fontStretch: "108%", letterSpacing: "-.01em", color: heroMuted, willChange: "opacity,transform" }}>{m.sub}</p>
                {/* Scene 06: "Show a short preview of the four-stage process." Titles only — the opening
                    rules forbid long paragraphs here. STAGES is the OEM page's own list, so the four
                    names cannot drift from the four-stage curve. */}
                {m.stages && (
                  <div className="v1h-sub" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "18px", marginTop: "4px" }}>
                    {STAGES.map(([title], k) => (
                      <span key={title} style={{ display: "inline-flex", alignItems: "center", gap: "18px" }}>
                        {k > 0 && <span style={{ width: "26px", height: "1px", background: heroLine }}></span>}
                        <span style={{ display: "inline-flex", alignItems: "baseline", gap: "8px", fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: heroMuted }}>
                          <span style={{ color: "#c2a274" }}>{String(k + 1).padStart(2, '0')}</span>{title}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                {/* Scene 1 and scene 7 carry the client's buttons; the other scenes carry none. */}
                {m.cta && (
                  <div className="v1h-sub" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", marginTop: "10px", pointerEvents: "auto" }}>
                    {m.cta.map(([label, href], k) => (
                      <a key={label} href={href} style={k === 0
                        ? { display: "inline-flex", alignItems: "center", gap: "12px", borderRadius: "999px", background: heroInk, color: heroBg, padding: "15px 30px", fontSize: "15px", fontWeight: "500" }
                        : { display: "inline-flex", alignItems: "center", borderRadius: "999px", border: `1px solid ${heroLine}`, color: heroInk, padding: "15px 30px", fontSize: "15px", fontWeight: "500" }}>{label}</a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Scene 07 is deliberately empty. The client: "End on a clear screen. Keep the words still
              and easy to read." V1 closed on a stock aerial of a factory at night (VIDEO.factoryNight),
              which also breaks the standing rule that no stock footage stands in for our production.
              Do not put a visual back here. */}
        </div>

        <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 45%,${vignette} 100%)` }}></div>

        <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "0 clamp(20px,4vw,56px) 30px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", pointerEvents: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: heroMuted }}>{String(chapter + 1).padStart(2, '0')} / {total} · <span ref={depthRef}>00.0 m</span></span>
            <span style={{ fontSize: "16px", fontWeight: "500", fontStretch: "110%" }}>{SEQUENCE[chapter].label}</span>
            {/* The client's opening rules ask for Explore Materials / Skip Intro here. The user took them
                out of the corner block on 19 Nov — they crowded the chapter label. Scene 01 still carries
                Explore Materials as a button, so the way past the opening is not lost; INTRO_CONTROLS stays
                in lib/changes.js as the record of what was asked for. */}
          </div>
          <span ref={hintRef} style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: heroMuted }}>{HERO_HINT}</span>
          {/* No light/dark toggle: it came from the design port, nobody asked for it, and the brief says
              keep the dark opening. Just the progress hairline. */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", pointerEvents: "auto" }}>
            <div style={{ width: "150px", height: "1px", background: heroLine }}><div ref={barRef} style={{ height: "1px", width: "0", background: heroInk }}></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
