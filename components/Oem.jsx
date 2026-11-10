import { MONO } from "./fonts";

export default function Oem() {
  return (
    <section id="oem" data-screen-label="06 OEM" style={{ background: "#f2efe9", color: "#151515", padding: "clamp(88px,10vw,140px) clamp(20px,4vw,56px)" }}>
      <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 48px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "clamp(56px,7vw,96px)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "860px" }}>
            <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#5d5a55" }}>OEM &amp; strategic partnerships</span>
            <h2 style={{ margin: "0", fontSize: "clamp(44px,6vw,96px)", lineHeight: ".92", fontWeight: "500", fontStretch: "120%", letterSpacing: "-.035em", textWrap: "balance" }}>Your name on the product. Our capability behind it.</h2>
          </div>
          <p style={{ margin: "0", maxWidth: "380px", fontSize: "15px", lineHeight: "1.6", color: "#5d5a55", textWrap: "pretty" }}>Custom development, specialist materials and a proven manufacturing partnership — combined into one route to market for your brand.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,250px),1fr))" }}>
          <div style={{ borderTop: "1px solid #151515", padding: "24px 28px 40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontSize: "64px", fontWeight: "300", fontStretch: "125%", lineHeight: "1", color: "#a39c90" }}>01</span>
            <span style={{ fontSize: "22px", fontWeight: "500", fontStretch: "112%" }}>Specify</span>
            <span style={{ fontSize: "15px", lineHeight: "1.6", color: "#5d5a55" }}>We start from your application, performance requirements and the markets you sell into.</span>
          </div>
          <div style={{ borderTop: "1px solid #151515", padding: "24px 28px 40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontSize: "64px", fontWeight: "300", fontStretch: "125%", lineHeight: "1", color: "#a39c90" }}>02</span>
            <span style={{ fontSize: "22px", fontWeight: "500", fontStretch: "112%" }}>Develop</span>
            <span style={{ fontSize: "15px", lineHeight: "1.6", color: "#5d5a55" }}>Custom colours, textures, constructions and top layers, developed with our manufacturing partner.</span>
          </div>
          <div style={{ borderTop: "1px solid #151515", padding: "24px 28px 40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontSize: "64px", fontWeight: "300", fontStretch: "125%", lineHeight: "1", color: "#a39c90" }}>03</span>
            <span style={{ fontSize: "22px", fontWeight: "500", fontStretch: "112%" }}>Validate</span>
            <span style={{ fontSize: "15px", lineHeight: "1.6", color: "#5d5a55" }}>Samples and trial runs confirm appearance, performance and processing on your lines.</span>
          </div>
          <div style={{ borderTop: "1px solid #151515", padding: "24px 28px 40px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontSize: "64px", fontWeight: "300", fontStretch: "125%", lineHeight: "1", color: "#a39c90" }}>04</span>
            <span style={{ fontSize: "22px", fontWeight: "500", fontStretch: "112%" }}>Manufacture</span>
            <span style={{ fontSize: "15px", lineHeight: "1.6", color: "#5d5a55" }}>Volume production and international supply under your brand, consistent batch to batch.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
