import ConceptShell from "@/components/concepts/shared/ConceptShell";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import About from "@/components/concepts/v1old/About";
import Materials from "@/components/concepts/v1old/Materials";
import Interlude from "@/components/concepts/v1old/Interlude";
import Manufacturing from "@/components/concepts/v1old/Manufacturing";
import Oem from "@/components/concepts/v1old/Oem";
import EnquirySection from "@/components/concepts/shared/EnquirySection";

// BACKUP (2026-11-12): V1 as it was before the client's seven-message sequence (round 9).
// Frozen copy: sections are duplicated in components/concepts/v1old; the hero is the untouched port hero.
// Unlisted (not in lib/versions.js) and noindex.
export const metadata = { title: "Shinho Global — V1 backup (pre round 9)", robots: { index: false } };

export default function V1Old() {
  return (
    <ConceptShell>
      <Nav />
      <Hero />
      <About />
      <Materials />
      <Interlude />
      <Lab />
      <Manufacturing />
      <Oem />
      <EnquirySection />
    </ConceptShell>
  );
}
