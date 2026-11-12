"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "@/components/fonts";
import { U, MATS } from "@/lib/materials";
import { SEQUENCE } from "@/lib/brief";
import { VIDEO } from "@/lib/media";
import Video from "../../shared/Video";

// EXPERIMENT (round 9b, rejected: "looks nothing like the old concept"). Unused; kept for reference.
// V1-only fork of components/Hero.jsx (the /original port stays untouched).
// Same depth-tunnel engine and visuals, carrying the client's seven-message sequence.
// Each headline arrives first; its supporting line follows a beat later, just underneath.
const DEFAULT_THEME = 'dark';
const SCROLL_LENGTH = 1000;          // vh — ~140vh of scroll per message, close to the original pacing
const MOTION_INTENSITY = 1;
const MSG_Z = [-400, -3000, -6200, -9400, -12600, -15800, -19000];
const DEPTH = 18500;                 // travel ends with message 07 held in front of the closing image
const BACKDROP_Z = -19700;
// Midpoints between messages: which chapter the HUD shows.
const SPLITS = MSG_Z.slice(1).map((z, i) => -(MSG_Z[i] + z) / 2);
// Panel clusters: the three families, then a mixed cluster behind the OEM / process messages.
const CLUSTERS = [
  { cat: 'cast', z: -3000, n: 12, spread: 3200 },
  { cat: 'arch', z: -6200, n: 12, spread: 3200 },
  { cat: 'deco', z: -9400, n: 12, spread: 3200 },
  { cat: null, z: -14200, n: 14, spread: 4400 },
];
// Footage window opening behind each headline (message index → clip). 07 lands on the closing image instead.
const SCREENS = [VIDEO.corridor, VIDEO.metalLight, VIDEO.marble, VIDEO.engraved, VIDEO.robot, VIDEO.inspector];
const SCREEN_GAP = 900;              // how far behind its headline the window sits
// Thin brass gates along the corridor, each with a depth readout.
const GATES = Array.from({ length: 12 }, (_, i) => -1800 - i*1600);
// Drifting particles through the whole depth (one 2D canvas, projected with the same travel).
const DUST_N = 900;
const H_STYLE = { margin: "0", fontSize: "clamp(76px,11vw,176px)", lineHeight: ".88", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em" };
const H3_STYLE = { ...H_STYLE, fontSize: "clamp(68px,9.4vw,152px)", lineHeight: ".9" };

export default function Hero() {
  const [themeState, setTheme] = useState(null);
  const [chapter, setChapter] = useState(0);
  const heroRef = useRef(null), stageRef = useRef(null), sceneRef = useRef(null), panelsRef = useRef(null);
  const depthRef = useRef(null), hintRef = useRef(null), barRef = useRef(null);
  const look = useRef({x:0,y:0,tx:0,ty:0,dx:0,dy:0,drag:null});
  const dustRef = useRef(null), darkRef = useRef(true);

  useEffect(() => {
    const host = panelsRef.current; if (!host) return;
    host.innerHTML = '';
    let seed = 11; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const panels = [];
    CLUSTERS.forEach(({cat, z: Z, n, spread}, ci) => {
      const list = cat ? MATS.filter(m => m.cat === cat) : MATS;
      for (let k = 0; k < n; k++) {
        const m = cat ? list[k % list.length] : list[(k*5 + 3) % list.length];
        const z = Z + spread*.47 - (k/(n - 1))*spread + (rnd() - .5)*240;
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
    const texts = [...sceneRef.current.querySelectorAll('[data-depth]')].map(el => ({el, z:+el.dataset.depth, sub: el.querySelector('[data-sub]')}));
    const screens = [...sceneRef.current.querySelectorAll('[data-screen]')].map(el => ({el, z:+el.dataset.screen}));
    const gates = [...sceneRef.current.querySelectorAll('[data-gate]')].map(el => ({el, z:+el.dataset.gate}));

    // Dust: fixed points in scene space, spread over the full travel.
    const dust = Array.from({length: DUST_N}, () => ({ x:(rnd() - .5)*4800, y:(rnd() - .5)*2800, z:-rnd()*(DEPTH + 2400), r:.5 + rnd()*1.3 }));
    const canvas = dustRef.current, ctx = canvas.getContext('2d');
    let cw = 0, chh = 0;
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cw = canvas.clientWidth; chh = canvas.clientHeight;
      canvas.width = Math.round(cw*dpr); canvas.height = Math.round(chh*dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);

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
        if (q.sub) {
          // Supporting line trails the headline in, rising into place underneath it.
          const so = cl((d + 1500)/600);
          q.sub.style.opacity = so.toFixed(3);
          q.sub.style.transform = `translateY(${((1 - so)*32).toFixed(1)}px)`;
        }
      }
      for (const q of screens) {
        const d = q.z + travel, op = Math.min(cl((d + 3400)/1200), cl((-d - 80)/500));
        q.el.style.opacity = op.toFixed(3); q.el.style.visibility = op < .01 ? 'hidden' : 'visible';
      }
      for (const q of gates) {
        const d = q.z + travel, op = Math.min(cl((d + 5200)/2200), cl((-d - 100)/500));
        q.el.style.opacity = op.toFixed(3); q.el.style.visibility = op < .01 ? 'hidden' : 'visible';
      }
      // Dust, projected with the same 1000px perspective; the look angle shifts it for parallax.
      ctx.clearRect(0, 0, cw, chh);
      const cx = cw/2 - L.x*14, cy = chh/2 + L.y*14;
      ctx.fillStyle = darkRef.current ? '#efe2c8' : '#151515';
      for (const s of dust) {
        const d = s.z + travel;
        if (d > 900 || d < -4200) continue;
        const k2 = 1000/(1000 - d), a = cl((d + 4200)/1600)*cl((900 - d)/400);
        if (a < .02) continue;
        const px = cx + s.x*k2, py = cy + s.y*k2;
        if (px < -10 || px > cw + 10 || py < -10 || py > chh + 10) continue;
        ctx.globalAlpha = a*.55;
        ctx.beginPath(); ctx.arc(px, py, Math.max(.4, s.r*k2*1.6), 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      const t = travel;
      let ch = 0; while (ch < SPLITS.length && t >= SPLITS[ch]) ch++;
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
      window.removeEventListener('resize', fit);
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
  useEffect(() => { darkRef.current = dark; }, [dark]);
  const screenWash = dark ? 'linear-gradient(180deg,rgba(11,11,12,.55),rgba(11,11,12,.35) 45%,rgba(11,11,12,.7))' : 'linear-gradient(180deg,rgba(236,232,225,.62),rgba(236,232,225,.45) 45%,rgba(236,232,225,.75))';
  const gateLine = dark ? 'rgba(194,162,116,.32)' : 'rgba(120,96,60,.35)';
  const total = String(SEQUENCE.length).padStart(2, '0');

  return (
    <section ref={heroRef} id="top" style={{ position: "relative", height: SCROLL_LENGTH + 'vh', background: heroBg, transition: "background .8s ease" }}>
      <div ref={stageRef} onPointerDown={stageDown} onPointerMove={stageMove} onPointerUp={stageUp} onPointerCancel={stageUp} style={{ position: "sticky", top: "0", height: "100vh", minHeight: "560px", overflow: "hidden", perspective: "1000px", perspectiveOrigin: "50% 50%", color: heroInk, cursor: "grab", touchAction: "pan-y", userSelect: "none" }}>
        <div ref={sceneRef} style={{ position: "absolute", left: "50%", top: "50%", width: "0", height: "0", transformStyle: "preserve-3d" }}>
          <div ref={panelsRef} style={{ position: "absolute", left: "0", top: "0", transformStyle: "preserve-3d", color: heroMuted }}></div>

          {SCREENS.map((media, i) => {
            const z = MSG_Z[i] - SCREEN_GAP;
            return (
              <div key={'s' + i} data-screen={z} style={{ position: "absolute", left: "0", top: "0", width: "2800px", height: "1575px", transform: `translate(-50%,-50%) translateZ(${z}px)`, overflow: "hidden", background: "#000", opacity: i === 0 ? 1 : 0, pointerEvents: "none", boxShadow: "0 80px 160px rgba(0,0,0,.5)" }}>
                <Video media={media} active={chapter === i || chapter + 1 === i} />
                <div style={{ position: "absolute", inset: "0", background: screenWash, transition: "background .8s ease" }}></div>
              </div>
            );
          })}

          {GATES.map((z) => (
            <div key={'g' + z} data-gate={z} style={{ position: "absolute", left: "0", top: "0", width: "2600px", height: "1480px", transform: `translate(-50%,-50%) translateZ(${z}px)`, border: `1px solid ${gateLine}`, opacity: 0, pointerEvents: "none" }}>
              <span style={{ position: "absolute", left: "18px", top: "14px", fontFamily: MONO, fontSize: "14px", letterSpacing: ".18em", color: gateLine }}>Z {(-z/100).toFixed(1).padStart(5, '0')} m</span>
              <span style={{ position: "absolute", right: "18px", bottom: "14px", fontFamily: MONO, fontSize: "14px", letterSpacing: ".18em", color: gateLine }}>SHINHO GLOBAL</span>
            </div>
          ))}

          {SEQUENCE.map((m, i) => {
            const z = MSG_Z[i], Tag = i === 0 ? 'h1' : 'h2';
            return (
              <div key={i} data-depth={z} style={{ position: "absolute", left: "0", top: "0", width: "min(1400px,130vw)", transform: `translate(-50%,-50%) translateZ(${z}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: "30px", textAlign: "center", pointerEvents: "none" }}>
                <span style={{ fontFamily: MONO, fontSize: "18px", letterSpacing: ".2em", color: "#c2a274" }}>{String(i + 1).padStart(2, '0')} / {total}</span>
                <Tag style={m.head.length > 2 ? H3_STYLE : H_STYLE}>
                  {m.head.map((line, j) => <span key={j} style={{ display: "block" }}>{line}</span>)}
                </Tag>
                <p data-sub="" style={{ margin: "6px 0 0", maxWidth: "900px", fontSize: "clamp(22px,2.1vw,32px)", lineHeight: "1.35", fontWeight: "400", fontStretch: "108%", letterSpacing: "-.01em", color: heroMuted, willChange: "opacity,transform" }}>{m.sub}</p>
              </div>
            );
          })}

          <div style={{ position: "absolute", left: "0", top: "0", width: "3400px", height: "1920px", transform: `translate(-50%,-50%) translateZ(${BACKDROP_Z}px)`, background: "#111 url(https://images.unsplash.com/photo-1717386255767-52643970d483?w=2000&q=70&auto=format&fit=crop) center/cover", pointerEvents: "none" }}>
            <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(11,11,12,.6),rgba(11,11,12,.3) 40%,rgba(11,11,12,.75))" }}></div>
          </div>
        </div>

        <canvas ref={dustRef} aria-hidden="true" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", pointerEvents: "none" }}></canvas>

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
