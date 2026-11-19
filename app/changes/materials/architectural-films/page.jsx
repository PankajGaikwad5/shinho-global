import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Layers from "@/components/concepts/architectural/Layers";
import Showroom from "@/components/concepts/architectural/Showroom";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { FAMILIES } from "@/lib/brief";

export const metadata = {
  title: "Architectural Interior Films & Top Layers — SHINHO GLOBAL",
  description: "Wood, stone, mineral and textile surfaces with protective top layers, for interior architecture and furniture.",
};

const ARCH = FAMILIES[0];

// What the client asked for on this page, and only that:
//   point 6 — the layer diagram, with the two supply routes, inside this page (not a separate tab).
//   point 7 — a short Applications section in the V12 showroom spirit.
//
// It used to also carry V1's About and V1's Materials with this family's content. Both are homepage
// sections, so the page read as the homepage again with different words — the client's words were that it
// was "a duplicate of home page 1:1". They are gone. Do not add homepage sections back here: if this page
// needs something more, it should be something the client asked for.
export default function ArchitecturalFilms() {
  return (
    <ConceptShell switcher={false} letterbox={false}>
      <SiteNav base="/changes" current="/changes/materials/architectural-films" />

      {/* Point 6 — the layer story opens the page. The client says "inside the page" without saying where. */}
      <Layers />

      {/* Point 7 — the V12 showroom as a short Applications section: three interior examples. */}
      <Showroom />

      <EnquirySection
        logo="light"
        form={<SiteEnquiryForm
          interests={ARCH.mats.map((m) => m.name)}
          interestLabel="Finishes of interest"
          requestPlaceholder="The interior application, the surfaces involved, and whether you need the finished film or the face film only."
        />}
      />
    </ConceptShell>
  );
}
