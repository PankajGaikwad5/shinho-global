import ConceptShell from "@/components/concepts/shared/ConceptShell";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import FilmHeader from "@/components/concepts/v2/FilmHeader";
import Opening from "@/components/concepts/v2/Opening";
import Role from "@/components/concepts/v2/Role";
import Families from "@/components/concepts/v2/Families";
import Chapters from "@/components/concepts/v2/Chapters";
import Capabilities from "@/components/concepts/v2/Capabilities";
import SampleLab from "@/components/concepts/v2/SampleLab";
import { VIDEO } from "@/lib/media";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(2) };

// Concept V2: the homepage as a short documentary — montage opening, role, three families,
// the making at partner facilities, technical credibility, a 3D sample and a B2B enquiry.
export default function V2() {
  return (
    <ConceptShell>
      <FilmHeader />
      <Opening />
      <Role />
      <Families />
      <Chapters />
      <Capabilities />
      <SampleLab />
      <EnquirySection video={VIDEO.cargoShip} />
    </ConceptShell>
  );
}
