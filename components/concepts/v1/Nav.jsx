"use client";

import { useEffect, useRef, useState } from "react";
import { MONO } from "@/components/fonts";
import Logo from "../shared/Logo";

// V1-only fork of components/Nav.jsx (the /original port keeps its text wordmark).
// Same nav and menu, but with the real SHINHO GLOBAL logo. The logo sits outside the nav's difference blend
// (which would turn the gold blue) and picks the light or dark artwork from whatever ground is behind it.
const groundIsLight = (x, y, skip) => {
  for (const el of document.elementsFromPoint(x, y)) {
    if (skip.contains(el)) continue;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor, m = c.match(/[\d.]+/g);
      if (!m || m.length < 3) continue;
      const k = c.startsWith('color(') ? 255 : 1, alpha = m[3] === undefined ? 1 : +m[3];
      if (alpha > .5) return (.2126*m[0]*k + .7152*m[1]*k + .0722*m[2]*k)/255 > .55;
    }
    return false;
  }
  return false;
};

export default function Nav() {
  const [menu, setMenu] = useState(false);
  const menuLabel = menu ? 'Close' : 'Menu', menuOpacity = menu ? 1 : 0, menuEvents = menu ? 'auto' : 'none';
  const toggleMenu = () => setMenu(!menu), closeMenu = () => setMenu(false);
  const [lightGround, setLightGround] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const a = logoRef.current; if (!a) return;
      const r = a.getBoundingClientRect();
      setLightGround(groundIsLight(r.left + r.width/2, r.top + r.height/2, a));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    // The hero's light/dark toggle changes the ground without scrolling.
    const poll = setInterval(queue, 600);
    queue();
    return () => { cancelAnimationFrame(raf); clearInterval(poll); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, []);
  const tone = !menu && lightGround ? 'dark' : 'light';

  return (
    <>
      <nav style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "70", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px clamp(20px,4vw,56px)", color: "#fff", mixBlendMode: "difference", pointerEvents: "none" }}>
        <span aria-hidden="true" style={{ width: "1px", height: "40px" }}></span>
        <div style={{ display: "flex", alignItems: "center", gap: "32px", pointerEvents: "auto" }}>
          <a href="#contact" style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>Enquire</a>
          <button onClick={toggleMenu} style={{ background: "none", border: "0", padding: "8px 0", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>{menuLabel}<span style={{ display: "flex", flexDirection: "column", gap: "5px" }}><span style={{ display: "block", width: "22px", height: "1px", background: "#fff" }}></span><span style={{ display: "block", width: "22px", height: "1px", background: "#fff" }}></span></span></button>
        </div>
      </nav>

      <a ref={logoRef} href="#top" onClick={closeMenu} aria-label="SHINHO GLOBAL — back to top" style={{ position: "fixed", top: "24px", left: "clamp(20px,4vw,56px)", zIndex: "71", display: "block" }}>
        <Logo tone={tone} height={34} />
      </a>

      <div style={{ position: "fixed", inset: "0", zIndex: "60", background: "#0b0b0c", color: "#f2efe9", opacity: menuOpacity, pointerEvents: menuEvents, transition: "opacity .6s ease", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(20px,6vw,96px)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <a href="#about" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>01</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>About</span></a>
          <a href="#materials" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>02</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>Materials</span></a>
          <a href="/cast-films" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "12px 0 12px clamp(28px,6vw,86px)" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>↳</span><span style={{ fontSize: "clamp(20px,2.6vw,34px)", fontWeight: "500", fontStretch: "114%", letterSpacing: "-.015em", lineHeight: "1", color: "#c2a274" }}>Cast &amp; Specialist Films</span></a>
          <a href="#manufacturing" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>03</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>Manufacturing</span></a>
          <a href="#oem" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>04</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>OEM &amp; Partnerships</span></a>
          <a href="#contact" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", borderBottom: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>05</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>Contact</span></a>
        </div>
      </div>
    </>
  );
}
