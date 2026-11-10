"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "./fonts";
import { U, MATS } from "@/lib/materials";

// Defaults of the design's data-props (defaultTheme, scrollLength, motionIntensity).
const DEFAULT_THEME = 'dark';
const SCROLL_LENGTH = 700;
const MOTION_INTENSITY = 1;
const CHAPTERS = ['Index','Cast & Specialist Films','Architectural Films & Top Layers','Advanced Decorative Finishes','Partner manufacturing'];
const DEPTH = 13000;

export default function Hero() {
  const [themeState, setTheme] = useState(null);
  const [chapter, setChapter] = useState(0);
  const heroRef = useRef(null), stageRef = useRef(null), sceneRef = useRef(null), panelsRef = useRef(null);
  const depthRef = useRef(null), hintRef = useRef(null), barRef = useRef(null);
  const look = useRef({x:0,y:0,tx:0,ty:0,dx:0,dy:0,drag:null});

  useEffect(() => {
    // build()
    const host = panelsRef.current; if (!host) return;
    host.innerHTML = '';
    let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const Z = {cast:-3000, arch:-6200, deco:-9400};
    const panels = [];
    ['cast','arch','deco'].forEach((cat, ci) => {
      const list = MATS.filter(m => m.cat === cat), n = 12;
      for (let k = 0; k < n; k++) {
        const m = list[k % list.length];
        const z = Z[cat] + 1500 - (k/(n - 1))*3200 + (rnd() - .5)*240;
        const a = k*2.399 + ci*1.1 + rnd()*.4;
        const r = (ci === 0 && k < 4 ? 820 : 620) + rnd()*440;
        const x = Math.cos(a)*r*1.5, y = Math.sin(a)*r*.8;
        const tall = rnd() < .55, w = tall ? 250 + rnd()*110 : 380 + rnd()*150, h = tall ? w*1.38 : w*.66;
        const el = document.createElement('div');
        el.style.cssText = `position:absolute;left:0;top:0;width:${w.toFixed(0)}px;transform:translate(-50%,-50%) translate3d(${x.toFixed(0)}px,${y.toFixed(0)}px,${z.toFixed(0)}px) rotateY(${(-x/1000*30).toFixed(1)}deg) rotateX(${(y/1000*18).toFixed(1)}deg);opacity:0`;
        el.innerHTML = `<div style="width:100%;height:${h.toFixed(0)}px;background:#1c1c1c url(${U(m.img, 800)}) center/cover;box-shadow:0 40px 80px rgba(0,0,0,.35)"></div><div style="display:flex;justify-content:space-between;gap:12px;margin-top:14px;font:500 12px/1 ${MONO};letter-spacing:.1em;text-transform:uppercase"><span>${m.code}</span><span>${m.name}</span></div>`;
        host.appendChild(el);
        panels.push({el, z, x, y});
      }
    });
    const texts = [...sceneRef.current.querySelectorAll('[data-depth]')].map(el => ({el, z:+el.dataset.depth}));

    const L = look.current;
    let travel = 0, last, raf, current = 0;
    const onMouse = e => { L.tx = (e.clientX/window.innerWidth - .5); L.ty = (e.clientY/window.innerHeight - .5); };

    const tickHero = (k, now) => {
      const hero = heroRef.current, scene = sceneRef.current; if (!hero || !scene) return;
      const r = hero.getBoundingClientRect(), span = Math.max(1, r.height - window.innerHeight);
      const p = Math.max(0, Math.min(1, -r.top/span));
      travel += (p*DEPTH - travel)*Math.min(1, .085*k);
      if (r.bottom < 0) return;
      const inten = MOTION_INTENSITY;
      if (!L.drag) { L.dx *= Math.pow(.92, k); L.dy *= Math.pow(.92, k); }
      const tx = L.tx*9*inten + L.dx + Math.sin(now/4200)*1.2*inten, ty = -L.ty*6*inten + L.dy + Math.cos(now/5100)*.8*inten;
      L.x += (tx - L.x)*.06*k; L.y += (ty - L.y)*.06*k;
      scene.style.transform = `translateZ(1000px) rotateX(${L.y.toFixed(2)}deg) rotateY(${L.x.toFixed(2)}deg) translateZ(-1000px) translate3d(0,0,${travel.toFixed(1)}px)`;
      const cl = v => v < 0 ? 0 : v > 1 ? 1 : v;
      for (const q of panels) {
        const d = q.z + travel;
        let op = Math.min(cl((d + 3600)/1400), cl((-d - 60)/420));
        if (d < -60) { const s = 1000/(-d), sx = Math.abs(q.x)*s, sy = Math.abs(q.y)*s; op *= cl(Math.max((sx - 300)/160, (sy - 220)/120)); }
        q.el.style.opacity = op.toFixed(3); q.el.style.visibility = op < .01 ? 'hidden' : 'visible';
      }
      for (const q of texts) {
        const d = q.z + travel, op = Math.min(cl((d + 2200)/900), cl((-d - 60)/320));
        q.el.style.opacity = op.toFixed(3); q.el.style.visibility = op < .01 ? 'hidden' : 'visible';
      }
      const t = travel, ch = t < 1900 ? 0 : t < 5100 ? 1 : t < 8300 ? 2 : t < 11500 ? 3 : 4;
      if (ch !== current) { current = ch; setChapter(ch); }
      if (barRef.current) barRef.current.style.width = (p*100).toFixed(1) + '%';
      if (hintRef.current) hintRef.current.style.opacity = String(cl(1 - t/500));
      if (depthRef.current) depthRef.current.textContent = (t/100).toFixed(1).padStart(5,'0') + ' m';
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
  const heroHeight = SCROLL_LENGTH + 'vh';
  const heroBg = dark ? '#0b0b0c' : '#ece8e1', heroInk = ink, heroMuted = muted;
  const heroLine = dark ? 'rgba(242,239,233,.22)' : 'rgba(21,21,21,.2)';
  const vignette = dark ? 'rgba(0,0,0,.75)' : 'rgba(236,232,225,.85)';
  const knobX = dark ? '0px' : '20px';
  const toggleTheme = () => setTheme(dark ? 'light' : 'dark');
  const chapterNum = '0' + chapter, chapterLabel = CHAPTERS[chapter];

  return (
    <section ref={heroRef} id="top" data-screen-label="01 Hero — The Archive" style={{ position: "relative", height: heroHeight, background: heroBg, transition: "background .8s ease" }}>
      <div ref={stageRef} onPointerDown={stageDown} onPointerMove={stageMove} onPointerUp={stageUp} onPointerCancel={stageUp} style={{ position: "sticky", top: "0", height: "100vh", minHeight: "560px", overflow: "hidden", perspective: "1000px", perspectiveOrigin: "50% 50%", color: heroInk, cursor: "grab", touchAction: "pan-y", userSelect: "none" }}>
        <div ref={sceneRef} style={{ position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transformStyle: "preserve-3d" }}>
          <div ref={panelsRef} style={{ position: "absolute", left: "0", top: "0", transformStyle: "preserve-3d", color: heroMuted }}></div>

          <div data-depth="-400" style={{ position: "absolute", left: "0", top: "0", width: "min(1500px,130vw)", transform: "translate(-50%,-50%) translateZ(-400px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: "15px", letterSpacing: ".3em", textTransform: "uppercase", color: heroMuted }}>International materials &amp; manufacturing partner</span>
            <h1 style={{ margin: "0", fontSize: "clamp(68px,10.5vw,164px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" }}>Surfaces,<br />made under<br />your name.</h1>
          </div>

          <div data-depth="-3000" style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: "translate(-50%,-50%) translateZ(-3000px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>01 / 03</span>
            <h2 style={{ margin: "0", fontSize: "clamp(76px,11vw,176px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" }}>Cast &amp;<br />Specialist Films</h2>
            <p style={{ margin: "0", maxWidth: "760px", fontSize: "28px", lineHeight: "1.4", color: heroMuted }}>Precision cast films in gloss, matte, metallic and technical finishes, engineered for demanding applications.</p>
          </div>

          <div data-depth="-6200" style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: "translate(-50%,-50%) translateZ(-6200px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>02 / 03</span>
            <h2 style={{ margin: "0", fontSize: "clamp(76px,11vw,176px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" }}>Architectural Films<br />&amp; Top Layers</h2>
            <p style={{ margin: "0", maxWidth: "760px", fontSize: "28px", lineHeight: "1.4", color: heroMuted }}>Wood, stone and mineral surfaces with protective top layers for interiors, furniture and cladding.</p>
          </div>

          <div data-depth="-9400" style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: "translate(-50%,-50%) translateZ(-9400px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>03 / 03</span>
            <h2 style={{ margin: "0", fontSize: "clamp(76px,11vw,176px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" }}>Advanced<br />Decorative Finishes</h2>
            <p style={{ margin: "0", maxWidth: "760px", fontSize: "28px", lineHeight: "1.4", color: heroMuted }}>Metallic, oxidised and relief effects that give products and interiors real material character.</p>
          </div>

          <div data-depth="-12300" style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: "translate(-50%,-50%) translateZ(-12300px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>Partner facilities · Republic of Korea</span>
            <h2 style={{ margin: "0", fontSize: "clamp(76px,10vw,160px)", lineHeight: ".9", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" }}>Behind every surface,<br />twenty years of making.</h2>
          </div>

          <div data-depth="-13500" style={{ position: "absolute", left: "0", top: "0", width: "2800px", height: "1580px", transform: "translate(-50%,-50%) translateZ(-13500px)", background: "#111 url(https://images.unsplash.com/photo-1717386255767-52643970d483?w=2000&q=70&auto=format&fit=crop) center/cover", pointerEvents: "none" }}>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(11,11,12,.55),rgba(11,11,12,.15) 40%,rgba(11,11,12,.7))" }}></div>
          </div>
        </div>

        <div style={{ position: "absolute", inset: "0", pointerEvents: "none", background: `radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 45%,${vignette} 100%)` }}></div>

        <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "0 clamp(20px,4vw,56px) 30px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", pointerEvents: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "220px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: heroMuted }}>{chapterNum} · <span ref={depthRef}>00.0 m</span></span>
            <span style={{ fontSize: "16px", fontWeight: "500", fontStretch: "110%" }}>{chapterLabel}</span>
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
