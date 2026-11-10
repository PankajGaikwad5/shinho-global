"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "./fonts";
import { U } from "@/lib/materials";

const SHOTS = [
  ['Compounding & raw materials','1610891015188-5369212db097'],
  ['Production line','1717386255773-1e3037c81788'],
  ['Coating & processing','1675176785803-bffbbb0cd2f4'],
  ['Process control','1598299803204-b73796f43289'],
  ['Inspection & dispatch','1496247749665-49cf5b1022e9']
];

export default function Manufacturing() {
  const [shot, setShot] = useState(0);
  const tcRef = useRef(null);

  useEffect(() => {
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (tcRef.current) {
        const t = (now - t0)/1000, p = n => String(Math.floor(n)).padStart(2,'0');
        tcRef.current.textContent = `${p(t/3600)}:${p(t/60%60)}:${p(t%60)}:${p((t*25)%25)}`;
      }
    };
    raf = requestAnimationFrame(tick);
    const shotTimer = setInterval(() => setShot(s => (s + 1) % 5), 4200);
    return () => { cancelAnimationFrame(raf); clearInterval(shotTimer); };
  }, []);

  const shots = SHOTS.map((t, i) => ({img:U(t[1], 2000), op: i === shot ? 1 : 0, sc: i === shot ? 'scale(1.08)' : 'scale(1)'}));
  const shotNum = '0' + (shot + 1), shotTitle = SHOTS[shot][0];
  const bars = SHOTS.map((t, i) => ({w: i <= shot ? '100%' : '0%', tr: i === shot ? 'width 4.2s linear' : 'none'}));

  return (
    <section id="manufacturing" data-screen-label="05 Manufacturing" style={{ background: "#0b0b0c", color: "#f2efe9", padding: "clamp(88px,10vw,140px) 0" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto 48px", padding: "0 clamp(20px,4vw,56px)", display: "flex", flexWrap: "wrap", gap: "24px 48px", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "820px" }}>
          <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#8d8982" }}>Manufacturing</span>
          <h2 style={{ margin: "0", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".92", fontWeight: "500", fontStretch: "120%", letterSpacing: "-.035em", textWrap: "balance" }}>Two decades of making, in partnership.</h2>
        </div>
        <p style={{ margin: "0", maxWidth: "400px", fontSize: "15px", lineHeight: "1.6", color: "#9a968f", textWrap: "pretty" }}>Production is delivered through our long-standing Korean manufacturing partner, with more than 20 years of experience — established processes, at scale and to specification.</p>
      </div>

      <div style={{ position: "relative", width: "100%", aspectRatio: "2.2/1", minHeight: "380px", overflow: "hidden", background: "#000" }}>
        {shots.map((s, i) => (
          <div key={i} style={{ position: "absolute", inset: "0", opacity: s.op, transform: s.sc, transition: "opacity 1.6s ease,transform 6s linear", background: `#111 url(${s.img}) center/cover` }}></div>
            ))}
        <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 62%,rgba(0,0,0,.7) 100%)", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", top: "24px", left: "clamp(20px,4vw,56px)", right: "clamp(20px,4vw,56px)", display: "flex", justifyContent: "space-between", gap: "16px", fontFamily: MONO, fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(242,239,233,.85)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c2a274" }}></span>Partner facility · Republic of Korea</span>
          <span ref={tcRef}>00:00:00:00</span>
        </div>
        <div style={{ position: "absolute", left: "clamp(20px,4vw,56px)", right: "clamp(20px,4vw,56px)", bottom: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "18px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: MONO, fontSize: "12px", color: "rgba(242,239,233,.7)" }}>{shotNum} / 05</span>
            <span style={{ fontSize: "clamp(22px,2.6vw,38px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em" }}>{shotTitle}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: "6px" }}>
            {bars.map((b, i) => (
              <div key={i} style={{ height: "2px", background: "rgba(242,239,233,.2)" }}><div style={{ height: "2px", background: "#f2efe9", width: b.w, transition: b.tr }}></div></div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1360px", margin: "64px auto 0", padding: "0 clamp(20px,4vw,56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: "32px" }}>
        <div style={{ borderTop: "1px solid rgba(242,239,233,.14)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "clamp(40px,4vw,60px)", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.04em", lineHeight: "1" }}>20+ years</span>
          <span style={{ fontSize: "14px", lineHeight: "1.55", color: "#9a968f" }}>Manufacturing experience held by our Korean partner.</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(242,239,233,.14)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "20px", fontWeight: "500", fontStretch: "112%" }}>Partner-operated facilities</span>
          <span style={{ fontSize: "14px", lineHeight: "1.55", color: "#9a968f" }}>SHINHO GLOBAL manages development, quality and international supply.</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(242,239,233,.14)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "20px", fontWeight: "500", fontStretch: "112%" }}>Made to specification</span>
          <span style={{ fontSize: "14px", lineHeight: "1.55", color: "#9a968f" }}>From sampling to volume runs, produced against your requirements.</span>
        </div>
      </div>
    </section>
  );
}
