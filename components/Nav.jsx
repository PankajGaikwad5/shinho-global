"use client";

import { useState } from "react";
import { MONO } from "./fonts";

export default function Nav() {
  const [menu, setMenu] = useState(false);
  const menuLabel = menu ? 'Close' : 'Menu', menuOpacity = menu ? 1 : 0, menuEvents = menu ? 'auto' : 'none';
  const toggleMenu = () => setMenu(!menu), closeMenu = () => setMenu(false);

  return (
    <>
      <nav style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "70", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px clamp(20px,4vw,56px)", color: "#fff", mixBlendMode: "difference", pointerEvents: "none" }}>
        <a href="#top" style={{ pointerEvents: "auto", display: "flex", flexDirection: "column", gap: "5px", color: "#fff" }}>
          <span style={{ fontWeight: "600", fontStretch: "125%", fontSize: "15px", letterSpacing: ".34em" }}>SHINHO</span>
          <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: ".62em" }}>GLOBAL</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "32px", pointerEvents: "auto" }}>
          <a href="#contact" style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>Enquire</a>
          <button onClick={toggleMenu} style={{ background: "none", border: "0", padding: "8px 0", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>{menuLabel}<span style={{ display: "flex", flexDirection: "column", gap: "5px" }}><span style={{ display: "block", width: "22px", height: "1px", background: "#fff" }}></span><span style={{ display: "block", width: "22px", height: "1px", background: "#fff" }}></span></span></button>
        </div>
      </nav>

      <div style={{ position: "fixed", inset: "0", zIndex: "60", background: "#0b0b0c", color: "#f2efe9", opacity: menuOpacity, pointerEvents: menuEvents, transition: "opacity .6s ease", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(20px,6vw,96px)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <a href="#about" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>01</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>About</span></a>
          <a href="#materials" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>02</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>Materials</span></a>
          <a href="#manufacturing" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>03</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>Manufacturing</span></a>
          <a href="#oem" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>04</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>OEM &amp; Partnerships</span></a>
          <a href="#contact" onClick={closeMenu} style={{ display: "flex", alignItems: "baseline", gap: "28px", borderTop: "1px solid rgba(242,239,233,.12)", borderBottom: "1px solid rgba(242,239,233,.12)", padding: "14px 0" }}><span style={{ fontFamily: MONO, fontSize: "11px", color: "#8d8982" }}>05</span><span style={{ fontSize: "clamp(34px,5.5vw,76px)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" }}>Contact</span></a>
        </div>
      </div>
    </>
  );
}
