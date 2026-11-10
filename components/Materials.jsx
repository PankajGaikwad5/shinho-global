"use client";

import { useEffect, useState } from "react";
import { MONO } from "./fonts";

export default function Materials() {
  const [cap, setCap] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 900);
    window.addEventListener('resize', onResize); onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const capF = i => narrow ? '1 1 auto' : (cap === i ? '2.6 1 0' : '1 1 0');
  const capO = i => (narrow || cap === i) ? 1 : 0;
  const capDir = narrow ? 'column' : 'row', capHeight = narrow ? 'auto' : '86vh';
  const cap0 = () => setCap(0), cap1 = () => setCap(1), cap2 = () => setCap(2);
  const cap0Flex = capF(0), cap1Flex = capF(1), cap2Flex = capF(2), cap0Op = capO(0), cap1Op = capO(1), cap2Op = capO(2);

  return (
    <section id="materials" data-screen-label="03 Capabilities" style={{ background: "#0b0b0c", color: "#f2efe9", padding: "clamp(88px,10vw,140px) 0 0" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto clamp(40px,5vw,64px)", padding: "0 clamp(20px,4vw,56px)", display: "flex", flexWrap: "wrap", gap: "24px 48px", alignItems: "flex-end", justifyContent: "space-between" }}>
        <h2 style={{ margin: "0", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".92", fontWeight: "500", fontStretch: "120%", letterSpacing: "-.035em" }}>Three families<br />of surface.</h2>
        <p style={{ margin: "0", maxWidth: "360px", fontSize: "15px", lineHeight: "1.6", color: "#9a968f" }}>Supplied from established collections or developed to your specification with our manufacturing partner.</p>
      </div>
      <div style={{ display: "flex", flexDirection: capDir, height: capHeight, gap: "2px" }}>
        <div onMouseEnter={cap0} style={{ position: "relative", flex: cap0Flex, minHeight: "380px", overflow: "hidden", transition: "flex .9s cubic-bezier(.6,0,.2,1)", background: "#222 url(https://images.unsplash.com/photo-1656055448548-e26753307fc7?w=1600&q=70&auto=format&fit=crop) center/cover" }}>
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(11,11,12,.25) 0%,rgba(11,11,12,.1) 40%,rgba(11,11,12,.88) 100%)" }}></div>
          <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "clamp(22px,3vw,40px)", display: "flex", flexDirection: "column", gap: "18px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", color: "#c2a274" }}>01</span>
            <h3 style={{ margin: "0", fontSize: "clamp(28px,2.8vw,44px)", lineHeight: "1", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.025em" }}>Cast &amp; Specialist Films</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", opacity: cap0Op, transition: "opacity .6s ease", maxWidth: "460px" }}>
              <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#d6d2ca" }}>Precision cast films with high dimensional stability — gloss, matte, metallic, translucent and technical finishes.</p>
              <a href="#" style={{ fontSize: "14px", fontWeight: "500", borderBottom: "1px solid #f2efe9", paddingBottom: "4px", alignSelf: "flex-start" }}>Explore the range →</a>
            </div>
          </div>
        </div>
        <div onMouseEnter={cap1} style={{ position: "relative", flex: cap1Flex, minHeight: "380px", overflow: "hidden", transition: "flex .9s cubic-bezier(.6,0,.2,1)", background: "#222 url(https://images.unsplash.com/photo-1768591189203-8c05a55a36f5?w=1600&q=70&auto=format&fit=crop) center/cover" }}>
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(11,11,12,.25) 0%,rgba(11,11,12,.1) 40%,rgba(11,11,12,.88) 100%)" }}></div>
          <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "clamp(22px,3vw,40px)", display: "flex", flexDirection: "column", gap: "18px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", color: "#c2a274" }}>02</span>
            <h3 style={{ margin: "0", fontSize: "clamp(28px,2.8vw,44px)", lineHeight: "1", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.025em" }}>Architectural Films &amp; Top Layers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", opacity: cap1Op, transition: "opacity .6s ease", maxWidth: "460px" }}>
              <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#d6d2ca" }}>Wood, stone, mineral and textile surfaces with protective top layers, engineered for interior architecture and furniture.</p>
              <a href="#" style={{ fontSize: "14px", fontWeight: "500", borderBottom: "1px solid #f2efe9", paddingBottom: "4px", alignSelf: "flex-start" }}>Explore the range →</a>
            </div>
          </div>
        </div>
        <div onMouseEnter={cap2} style={{ position: "relative", flex: cap2Flex, minHeight: "380px", overflow: "hidden", transition: "flex .9s cubic-bezier(.6,0,.2,1)", background: "#222 url(https://images.unsplash.com/photo-1667892702884-faa077e80d7b?w=1600&q=70&auto=format&fit=crop) center/cover" }}>
          <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,rgba(11,11,12,.25) 0%,rgba(11,11,12,.1) 40%,rgba(11,11,12,.88) 100%)" }}></div>
          <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "clamp(22px,3vw,40px)", display: "flex", flexDirection: "column", gap: "18px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", color: "#c2a274" }}>03</span>
            <h3 style={{ margin: "0", fontSize: "clamp(28px,2.8vw,44px)", lineHeight: "1", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.025em" }}>Advanced Decorative Finishes</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", opacity: cap2Op, transition: "opacity .6s ease", maxWidth: "460px" }}>
              <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#d6d2ca" }}>Metallic, reflective, oxidised and relief effects for products, interiors and retail environments.</p>
              <a href="#" style={{ fontSize: "14px", fontWeight: "500", borderBottom: "1px solid #f2efe9", paddingBottom: "4px", alignSelf: "flex-start" }}>Explore the range →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
