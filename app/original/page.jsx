import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Materials from "@/components/Materials";
import Lab from "@/components/Lab";
import Manufacturing from "@/components/Manufacturing";
import Oem from "@/components/Oem";
import Contact from "@/components/Contact";
import { ARCHIVO } from "@/components/fonts";

// Exact port of design/Shinho Global Home v2.dc.html — kept for reference, not listed in the concept switcher.
export const metadata = { title: "Shinho Global — original design port", robots: { index: false } };

export default function Home() {
  return (
    <div style={{ fontFamily: ARCHIVO, color: "#151515", background: "#0b0b0c" }}>
      <Nav />
      <Hero />
      <About />
      <Materials />
      <Lab />
      <Manufacturing />
      <Oem />
      <Contact />
    </div>
  );
}
