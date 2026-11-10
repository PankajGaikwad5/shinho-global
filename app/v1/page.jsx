import ConceptShell from "@/components/concepts/shared/ConceptShell";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import About from "@/components/concepts/v1/About";
import Materials from "@/components/concepts/v1/Materials";
import Interlude from "@/components/concepts/v1/Interlude";
import Manufacturing from "@/components/concepts/v1/Manufacturing";
import Oem from "@/components/concepts/v1/Oem";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(1) };

// Concept V1: the original layout and copy, made cinematic with footage, parallax and scroll-scrubbed moments.
export default function V1() {
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
