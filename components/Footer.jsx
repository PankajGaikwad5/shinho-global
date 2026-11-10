import { MONO } from "./fonts";

export default function Footer() {
  return (
    <footer style={{ marginTop: "clamp(100px,12vw,180px)", borderTop: "1px solid rgba(242,239,233,.16)", paddingTop: "36px", display: "flex", flexWrap: "wrap", gap: "36px 64px", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <span style={{ fontWeight: "600", fontStretch: "125%", fontSize: "15px", letterSpacing: ".34em" }}>SHINHO</span>
        <span style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: ".62em", color: "#9a968f" }}>GLOBAL</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 32px", fontSize: "14px", color: "#c9c5bd" }}>
        <a href="#about">About</a><a href="#materials">Materials</a><a href="#manufacturing">Manufacturing</a><a href="#oem">OEM &amp; Partnerships</a><a href="#contact">Contact</a>
      </div>
      <span style={{ flexBasis: "100%", fontFamily: MONO, fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase", color: "#77736c" }}>© 2026 SHINHO GLOBAL · Manufacturing carried out at partner facilities</span>
    </footer>
  );
}
