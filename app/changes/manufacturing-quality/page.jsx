import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Heat from "@/components/concepts/changes/Heat";
import Manufacturing from "@/components/concepts/v1/Manufacturing";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";

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
      {/* Point 8 — the heat idea lives here, and only here. It is off the homepage, as the client asked
          ("do not add a new colour-heavy sequence to the homepage"), and it runs straight into real film
          processing below. */}
      <Heat />
      <Manufacturing />
      <EnquirySection logo="light" form={<SiteEnquiryForm />} />
    </ConceptShell>
  );
}
