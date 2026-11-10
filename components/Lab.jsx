"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "./fonts";
import { U, MATS, CATL } from "@/lib/materials";

export default function Lab() {
  const [labIdx, setLabIdx] = useState(7);
  const [exploded, setExploded] = useState(false);
  const labStageRef = useRef(null), plateRef = useRef(null), topRef = useRef(null);
  const pl = useRef({rx:-6,ry:18,rz:0,spin:0,hx:0,hy:0,drag:null});
  const explodedRef = useRef(false);

  useEffect(() => { explodedRef.current = exploded; }, [exploded]);

  useEffect(() => {
    let last, raf;
    const tickPlate = (k) => {
      const el = plateRef.current; if (!el) return;
      const P = pl.current, ex = explodedRef.current;
      const trx = (ex ? 56 : -6) - P.hy*18, trz = ex ? -32 + P.spin : 0, try_ = (ex ? 0 : 18 + P.spin) + P.hx*26;
      P.rx += (trx - P.rx)*.08*k; P.ry += (try_ - P.ry)*.08*k; P.rz += (trz - P.rz)*.08*k;
      el.style.transform = `rotateX(${P.rx.toFixed(2)}deg) rotateY(${P.ry.toFixed(2)}deg) rotateZ(${P.rz.toFixed(2)}deg)`;
      if (topRef.current) topRef.current.style.background = `radial-gradient(circle at ${(50 - P.ry*1.3).toFixed(1)}% ${(45 + P.rx*1.4).toFixed(1)}%,rgba(255,255,255,.36),rgba(255,255,255,0) 44%),linear-gradient(155deg,rgba(255,255,255,.12),rgba(255,255,255,0) 42%)`;
    };
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const k = Math.min(3, (now - (last || now))/16.67); last = now;
      tickPlate(k);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const labDown = (e) => { pl.current.drag = {x:e.clientX}; try { e.currentTarget.setPointerCapture(e.pointerId); } catch {} };
  const labMove = (e) => {
    const P = pl.current, r = labStageRef.current.getBoundingClientRect();
    P.hx = (e.clientX - r.left)/r.width - .5; P.hy = (e.clientY - r.top)/r.height - .5;
    if (P.drag) { P.spin += (e.clientX - P.drag.x)*.45; P.drag.x = e.clientX; }
  };
  const labUp = () => { pl.current.drag = null; };
  const labLeave = () => { const P = pl.current; P.hx = 0; P.hy = 0; P.drag = null; };

  const lm = MATS[labIdx], gap = exploded ? 62 : 1.5;
  const lab = {name:lm.name, code:lm.code, cat:CATL[lm.cat], finish:lm.finish, apps:lm.apps, img:U(lm.img, 900)};
  const swatches = MATS.map((m, i) => ({name:m.name, thumb:U(m.img, 120), ring: i === labIdx ? '#c2a274' : 'transparent', select: () => setLabIdx(i)}));
  const l0T = 'translateZ(0px)', l1T = `translateZ(${gap}px)`, l2T = `translateZ(${gap*2}px)`, l3T = `translateZ(${gap*3}px)`;
  const layerOp = exploded ? 1 : .35;
  const layerToggleLabel = exploded ? 'Assemble layers' : 'Separate layers';
  const toggleExploded = () => { if (exploded) pl.current.spin = 0; setExploded(!exploded); };

  return (
    <section id="lab" data-screen-label="04 Material Lab" style={{ background: "#161718", color: "#f2efe9", padding: "clamp(88px,10vw,140px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 48px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#8d8982" }}>Material Lab</span>
            <h2 style={{ margin: "0", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".92", fontWeight: "500", fontStretch: "120%", letterSpacing: "-.035em" }}>Handle the surface.</h2>
          </div>
          <p style={{ margin: "0", maxWidth: "360px", fontSize: "15px", lineHeight: "1.6", color: "#9a968f" }}>Turn a sample in the light, swap its finish and separate its layers to see how it is built.</p>
        </div>

        <div ref={labStageRef} onPointerDown={labDown} onPointerMove={labMove} onPointerUp={labUp} onPointerCancel={labUp} onPointerLeave={labLeave} style={{ position: "relative", minHeight: "680px", display: "flex", alignItems: "center", justifyContent: "center", perspective: "1500px", cursor: "grab", touchAction: "pan-y", userSelect: "none", background: "radial-gradient(ellipse at 50% 38%,#2a2c2f 0%,#161718 65%)", borderTop: "1px solid rgba(242,239,233,.1)", borderBottom: "1px solid rgba(242,239,233,.1)" }}>
          <div style={{ position: "absolute", top: "28px", left: "28px", display: "flex", flexDirection: "column", gap: "8px", maxWidth: "40%" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#c2a274" }}>{lab.code}</span>
            <span style={{ fontSize: "clamp(28px,3.4vw,52px)", lineHeight: "1", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.03em" }}>{lab.name}</span>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".08em", textTransform: "uppercase", color: "#8d8982" }}>{lab.cat}</span>
          </div>
          <div style={{ position: "absolute", top: "28px", right: "28px", display: "flex", flexDirection: "column", gap: "14px", textAlign: "right", maxWidth: "30%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8d8982" }}>Finish</span><span style={{ fontSize: "15px" }}>{lab.finish}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}><span style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8d8982" }}>Applications</span><span style={{ fontSize: "15px" }}>{lab.apps}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", opacity: layerOp, transition: "opacity .6s ease" }}><span style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8d8982" }}>Construction, top to base</span><span style={{ fontSize: "15px", lineHeight: "1.5" }}>Protective top layer<br />Decorative / cast film<br />Adhesive system<br />Substrate</span></div>
          </div>

          <div style={{ position: "absolute", left: "50%", top: "74%", width: "360px", height: "60px", marginLeft: "-180px", borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.6),rgba(0,0,0,0) 70%)", filter: "blur(10px)" }}></div>
          <div ref={plateRef} style={{ position: "relative", width: "min(300px,56vw)", aspectRatio: "3/4", transformStyle: "preserve-3d" }}>
            <div style={{ position: "absolute", inset: "0", transform: l0T, transition: "transform 1s cubic-bezier(.6,0,.2,1)", background: "linear-gradient(135deg,#8d887f,#6c675f)" }}></div>
            <div style={{ position: "absolute", inset: "0", transform: l1T, transition: "transform 1s cubic-bezier(.6,0,.2,1)", background: "rgba(214,190,140,.26)", border: "1px solid rgba(214,190,140,.55)" }}></div>
            <div style={{ position: "absolute", inset: "0", transform: l2T, transition: "transform 1s cubic-bezier(.6,0,.2,1)", background: `#333 url(${lab.img}) center/cover` }}></div>
            <div ref={topRef} style={{ position: "absolute", inset: "0", transform: l3T, transition: "transform 1s cubic-bezier(.6,0,.2,1)", border: "1px solid rgba(255,255,255,.16)" }}></div>
          </div>

          <div style={{ position: "absolute", left: "28px", right: "28px", bottom: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", maxWidth: "min(760px,100%)" }}>
              {swatches.map((s, i) => (
                <button key={i} onClick={s.select} title={s.name} style={{ width: "34px", height: "34px", padding: "0", cursor: "pointer", border: "0", background: `#333 url(${s.thumb}) center/cover`, outline: `1px solid ${s.ring}`, outlineOffset: "3px", transition: "outline-color .25s ease" }}></button>
            ))}
            </div>
            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
              <span style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8d8982" }}>Drag to turn</span>
              <button onClick={toggleExploded} style={{ background: "none", border: "0", borderBottom: "1px solid #f2efe9", padding: "0 0 4px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>{layerToggleLabel}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
