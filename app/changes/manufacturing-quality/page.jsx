import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Manufacturing from "@/components/concepts/v1/Manufacturing";
import EnquirySection from "@/components/concepts/shared/EnquirySection";

export const metadata = {
  title: "Manufacturing & Quality — SHINHO GLOBAL",
  description: "Heat. Pressure. Precision. How a surface takes shape.",
};

// Manufacturing & Quality — a menu item in the client's list (point 4) that had no page.
// Point 8 puts the heat idea here, not on the homepage, and then moves straight into real film processing:
// V1's Manufacturing section follows it.
export default function ManufacturingQuality() {
  return (
    <ConceptShell switcher={false}>
      <SiteNav base="/changes" current="/changes/manufacturing-quality" />
      {/* The heat scene now runs on the homepage, where the user wants it kept. It is deliberately NOT
          repeated here — the client would see the same sequence twice. Point 8 puts it on this page, so if
          that reading wins, move <Heat /> back here and drop it from app/changes/page.jsx. */}
      <Manufacturing />
      <EnquirySection logo="light" />
    </ConceptShell>
  );
}
