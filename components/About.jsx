import { MONO } from "./fonts";

export default function About() {
  return (
    <section id="about" data-screen-label="02 Introduction" style={{ background: "#f2efe9", color: "#151515", padding: "clamp(88px,11vw,160px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(40px,6vw,96px)", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ aspectRatio: "4/5", background: "#d8d2c8 url(https://images.unsplash.com/photo-1766445318570-1dc4bf3f5d79?w=1200&q=70&auto=format&fit=crop) center/cover" }}></div>
          <span style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "#76726b" }}>Architectural film application · Interior ceiling</span>
        </div>
        <div style={{ flex: "1.35 1 480px", display: "flex", flexDirection: "column", gap: "56px", paddingTop: "8px" }}>
          <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#5d5a55" }}>Who we are</span>
          <p style={{ margin: "0", fontSize: "clamp(30px,3.3vw,50px)", lineHeight: "1.1", fontWeight: "400", fontStretch: "108%", letterSpacing: "-.02em", textWrap: "pretty" }}>SHINHO GLOBAL is the partner behind the surface. We source, develop and manufacture specialist films and finishes for businesses that sell them under their own brand.</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px 32px", borderTop: "1px solid rgba(21,21,21,.2)", padding: "20px 0" }}><span style={{ fontSize: "clamp(22px,2vw,28px)", fontWeight: "500", fontStretch: "115%" }}>Manufacturers</span><span style={{ fontSize: "15px", color: "#5d5a55", maxWidth: "360px" }}>Films and finishes specified to your process.</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px 32px", borderTop: "1px solid rgba(21,21,21,.2)", padding: "20px 0" }}><span style={{ fontSize: "clamp(22px,2vw,28px)", fontWeight: "500", fontStretch: "115%" }}>OEMs</span><span style={{ fontSize: "15px", color: "#5d5a55", maxWidth: "360px" }}>Materials developed and produced under your name.</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px 32px", borderTop: "1px solid rgba(21,21,21,.2)", padding: "20px 0" }}><span style={{ fontSize: "clamp(22px,2vw,28px)", fontWeight: "500", fontStretch: "115%" }}>Converters</span><span style={{ fontSize: "15px", color: "#5d5a55", maxWidth: "360px" }}>Consistent supply for further processing.</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "8px 32px", borderTop: "1px solid rgba(21,21,21,.2)", borderBottom: "1px solid rgba(21,21,21,.2)", padding: "20px 0" }}><span style={{ fontSize: "clamp(22px,2vw,28px)", fontWeight: "500", fontStretch: "115%" }}>Distributors</span><span style={{ fontSize: "15px", color: "#5d5a55", maxWidth: "360px" }}>A curated range backed by partner manufacturing.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
