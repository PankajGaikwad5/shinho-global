"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "@/components/fonts";
import { U, MATS } from "@/lib/materials";
import { SEQUENCE } from "@/lib/brief";
import { VIDEO } from "@/lib/media";
import Video from "../shared/Video";

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
const BACKDROP_Z = -19100;           // closing shot: like the original, it fades in only near the end and fills the frame
const CLOSING_VIDEO = VIDEO.factoryNight; // stock placeholder — swap for the client's footage
// Midpoints between messages: which chapter the HUD shows.
const SPLITS = MSG_Z.slice(1).map((z, i) => -(MSG_Z[i] + z) / 2);
// Panel clusters, one per message at the original density (12 per 3200 of depth), so the back half of the
// sequence is as full as the front. 05 and 06 draw from all materials; 07 lands on the closing shot, as the original did.
const CLUSTERS = [
  { cat: 'cast', z: -3000, n: 12, spread: 3200 },
  { cat: 'arch', z: -6200, n: 12, spread: 3200 },
  { cat: 'deco', z: -9400, n: 12, spread: 3200 },
  { cat: null, z: -12600, n: 12, spread: 3200, offset: 3 },
  { cat: null, z: -15800, n: 12, spread: 3200, offset: 13 },
];
const H_STYLE = { margin: "0", fontSize: "clamp(76px,11vw,176px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" };
const H3_STYLE = { ...H_STYLE, fontSize: "clamp(68px,9.4vw,152px)", lineHeight: ".9" };

export default function Hero() {
  const [themeState, setTheme] = useState(null);
  const [chapter, setChapter] = useState(0);
  const heroRef = useRef(null), stageRef = useRef(null), sceneRef = useRef(null), panelsRef = useRef(null);
  const depthRef = useRef(null), hintRef = useRef(null), barRef = useRef(null);
  const look = useRef({x:0,y:0,tx:0,ty:0,dx:0,dy:0,drag:null});

  useEffect(() => {
    const host = panelsRef.current; if (!host) return;
    host.innerHTML = '';
    let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const panels = [];
    CLUSTERS.forEach(({cat, z: Z, n, spread, offset = 0}, ci) => {
      const list = cat ? MATS.filter(m => m.cat === cat) : MATS;
      for (let k = 0; k < n; k++) {
        const m = cat ? list[k % list.length] : list[(k*5 + offset) % list.length];
        const z = Z + spread*.47 - (k/(n - 1))*spread + (rnd() - .5)*240;
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

  const stageDown = (e) => { if (e.pointerType === 'touch') return; look.current.drag = {x:e.clientX,y:e.clientY}; try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} };
  const stageMove = (e) => {
    const L = look.current; if (!L.drag) return;
    L.dx = Math.max(-38, Math.min(38, L.dx + (e.clientX - L.drag.x)*.08));
    L.dy = Math.max(-22, Math.min(22, L.dy - (e.clientY - L.drag.y)*.06));
    L.drag = {x:e.clientX,y:e.clientY};
  };
  const stageUp = () => { look.current.drag = null; };

  const dark = (themeState || DEFAULT_THEME) === 'dark';
  const ink = dark ? '#f2efe9' : '#151515', muted = dark ? '#8f8b84' : '#5d5a55';
  const heroBg = dark ? '#0b0b0c' : '#ece8e1', heroInk = ink, heroMuted = muted;
  const heroLine = dark ? 'rgba(242,239,233,.22)' : 'rgba(21,21,21,.2)';
  const vignette = dark ? 'rgba(0,0,0,.75)' : 'rgba(236,232,225,.85)';
  const knobX = dark ? '0px' : '20px';
  const toggleTheme = () => setTheme(dark ? 'light' : 'dark');
  const total = String(SEQUENCE.length).padStart(2, '0');

  return (
    <section ref={heroRef} id="top" style={{ position: "relative", height: SCROLL_LENGTH + 'vh', background: heroBg, transition: "background .8s ease" }}>
      <div ref={stageRef} onPointerDown={stageDown} onPointerMove={stageMove} onPointerUp={stageUp} onPointerCancel={stageUp} style={{ position: "sticky", top: "0", height: "100vh", minHeight: "560px", overflow: "hidden", perspective: "1000px", perspectiveOrigin: "50% 50%", color: heroInk, cursor: "grab", touchAction: "pan-y", userSelect: "none" }}>
        <div ref={sceneRef} style={{ position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transformStyle: "preserve-3d" }}>
          <div ref={panelsRef} style={{ position: "absolute", left: "0", top: "0", transformStyle: "preserve-3d", color: heroMuted }}></div>

          {SEQUENCE.map((m, i) => {
            const z = MSG_Z[i], Tag = i === 0 ? 'h1' : 'h2';
            return (
              <div key={i} data-depth={z} data-card="" style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: `translate(-50%,-50%) translateZ(${z}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none", opacity: 0, visibility: "hidden" }}>
                <span className="v1h-eye" style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>{String(i + 1).padStart(2, '0')} / {total}</span>
                <Tag style={m.head.length > 2 ? H3_STYLE : H_STYLE}>
                  {m.head.map((line, j) => <span key={j} style={{ display: "block" }}>{line}</span>)}
                </Tag>
                <p className="v1h-sub" style={{ margin: "6px 0 0", maxWidth: "900px", fontSize: "clamp(22px,2.1vw,32px)", lineHeight: "1.35", fontWeight: "400", fontStretch: "108%", letterSpacing: "-.01em", color: heroMuted, willChange: "opacity,transform" }}>{m.sub}</p>
              </div>
            );
          })}

          <div data-depth={BACKDROP_Z} style={{ position: "absolute", left: "0", top: "0", width: "2800px", height: "1580px", transform: `translate(-50%,-50%) translateZ(${BACKDROP_Z}px)`, background: "#111", overflow: "hidden", pointerEvents: "none", opacity: 0, visibility: "hidden" }}>
            <Video media={CLOSING_VIDEO} active={chapter >= SEQUENCE.length - 2} />
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(11,11,12,.55),rgba(11,11,12,.15) 40%,rgba(11,11,12,.7))" }}></div>
          </div>
        </div>

        <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 45%,${vignette} 100%)` }}></div>

        <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "0 clamp(20px,4vw,56px) 30px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", pointerEvents: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: heroMuted }}>{String(chapter + 1).padStart(2, '0')} / {total} · <span ref={depthRef}>00.0 m</span></span>
            <span style={{ fontSize: "16px", fontWeight: "500", fontStretch: "110%" }}>{SEQUENCE[chapter].label}</span>
          </div>
          <span ref={hintRef} style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: heroMuted }}>Scroll to enter the archive — drag to look around</span>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", pointerEvents: "auto" }}>
            <div style={{ width: "150px", height: "1px", background: heroLine }}><div ref={barRef} style={{ height: "1px", width: "0", background: heroInk }}></div></div>
            <button onClick={toggleTheme} aria-label="Toggle theme" style={{ width: "48px", height: "26px", borderRadius: "13px", border: `1px solid ${heroInk}`, background: "none", padding: "3px", cursor: "pointer", display: "flex" }}>
              <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: heroInk, transform: `translateX(${knobX})`, transition: "transform .4s cubic-bezier(.6,0,.2,1)" }}></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
