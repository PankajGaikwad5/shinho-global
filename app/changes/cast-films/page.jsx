import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Hero from "@/components/concepts/castfilms/Hero";
import { Applications, Automotive, Groups, Pitch, Process, Technical } from "@/components/concepts/castfilms/Sections";
import Enquiry from "@/components/concepts/castfilms/Enquiry";

export const metadata = {
  title: "Cast & Specialist Films — SHINHO GLOBAL",
  description: "Korean cast-film manufacturing for signage, digital printing and surface protection. Build your own range with Shinho Global.",
};

// Cast & Specialist Films, inside the /changes version of the site.
//
// A product page, not a second homepage: the client's cast-film email asks for a strong opening image, the
// headline and two buttons, then the range, the applications, the buying process and the technical detail.
// The seven-scene scroll journey belongs to the homepage only.
export default function CastFilms() {
  return (
    <ConceptShell switcher={false}>
      <SiteNav base="/changes" current="/changes/cast-films" />
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
