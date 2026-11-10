import { MONO } from "./fonts";
import Footer from "./Footer";

export default function Contact() {
  return (
    <section id="contact" data-screen-label="07 Enquiry" style={{ position: "relative", color: "#f2efe9", background: "#0b0b0c url(https://images.unsplash.com/photo-1513828646384-e4d8ec30d2bb?w=2000&q=70&auto=format&fit=crop) center/cover" }}>
      <div style={{ background: "linear-gradient(180deg,rgba(11,11,12,.92),rgba(11,11,12,.78) 45%,rgba(11,11,12,.96))", padding: "clamp(110px,14vw,210px) clamp(20px,4vw,56px) 40px" }}>
        <div style={{ maxWidth: "1360px", margin: "0 auto" }}>
          <span style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#9a968f" }}>Enquiries</span>
          <h2 style={{ margin: "28px 0 0", fontSize: "clamp(56px,9.5vw,156px)", lineHeight: ".9", fontWeight: "500", fontStretch: "122%", letterSpacing: "-.045em", textWrap: "balance" }}>Tell us what you need to make.</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 64px", alignItems: "flex-end", justifyContent: "space-between", marginTop: "56px" }}>
            <p style={{ margin: "0", maxWidth: "440px", fontSize: "16px", lineHeight: "1.6", color: "#b5b1a9" }}>Share your application, volumes and markets. We will come back with materials, samples and a route to manufacture.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 36px", alignItems: "center" }}>
              <a href="mailto:enquiries@shinhoglobal.com" style={{ fontSize: "clamp(20px,2vw,26px)", fontWeight: "500", fontStretch: "112%", borderBottom: "1px solid #f2efe9", paddingBottom: "6px" }}>Start an enquiry →</a>
              <a href="mailto:enquiries@shinhoglobal.com" style={{ fontFamily: MONO, fontSize: "13px", color: "#9a968f" }}>enquiries@shinhoglobal.com</a>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </section>
  );
}
