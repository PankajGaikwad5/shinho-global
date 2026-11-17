import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Hero from "@/components/concepts/castfilms/Hero";
import { Applications, Automotive, Groups, Pitch, Process, Technical } from "@/components/concepts/castfilms/Sections";
import Enquiry from "@/components/concepts/castfilms/Enquiry";

export const metadata = {
  title: "Cast & Specialist Films — SHINHO GLOBAL",
  description: "Korean cast-film manufacturing for signage, digital printing and surface protection. Build your own range with Shinho Global.",
};

// Cast & Specialist Films: a dedicated page in the V1 direction, built from the client's cast-film deck.
// The opening is the V1 depth tunnel (its own fork, so V1 is untouched); below it the page becomes a
// scannable product page in the same visual language.
export default function CastFilms() {
  return (
    <ConceptShell switcher={false}>
      <SiteNav current="/cast-films" />
      <Hero />
      <Pitch />
      <Groups />
      <Automotive />
      <Applications />
      <Process />
      <Technical />
      <Enquiry />
    </ConceptShell>
  );
}
