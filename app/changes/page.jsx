import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Hero from "@/components/concepts/changes/Hero";
import Lab from "@/components/concepts/changes/Lab";
import About from "@/components/concepts/changes/About";
import Materials from "@/components/concepts/v1/Materials";
import Manufacturing from "@/components/concepts/v1/Manufacturing";
import Oem from "@/components/concepts/v1/Oem";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { RANGE, RANGE_LINKS } from "@/lib/products";

export const metadata = {
  title: "SHINHO GLOBAL",
  description: "Your next product. Your brand. Our manufacturing expertise.",
};

// The homepage with the client's 15 November brief applied. The current homepage at `/` is frozen and
// untouched; this is the version to review.
//
// Applied here: the seven scenes in the client's exact words with buttons on scene 1 and scene 7 (point 2),
// Explore Materials / Skip Intro (opening rules), the replacement Who We Are copy with the final sentence
// bold (point 3), the new main menu (point 4), "Explore the collection" in place of "Enter the archive"
// and no concept selector (point 13).
//
// Deliberately NOT here: the Interlude furnace scene. Point 8 moves that idea to Manufacturing & Quality
// as "Heat. Pressure. Precision." and says not to add a colour-heavy sequence to the homepage.
export default function ChangesHome() {
  return (
    <ConceptShell switcher={false}>
      <SiteNav base="/changes" />
      <Hero />
      {/* Point 3's copy in a layout built for it — see components/concepts/changes/About.jsx.
          V1's About was carrying four extra paragraphs in a column meant for one statement. */}
      <About />
      {/* V1's own sections and order. Point 13: no placeholder "#" links — each family panel points at its
          page, or at the enquiry where that page does not exist yet. */}
      {/* Point 4 defines the range as five, and point 13 says no placeholder links. The panels are the
          same five the menu lists, each linking to its own page — RANGE in lib/products.js. They used to
          be the three concept-era families, two of which pointed at #contact. */}
      <Materials
        lines={["Five families", "of surface."]}
        items={RANGE}
        cta="See the range →"
      />
      {/* No Interlude here. Point 8: "do not add a new colour-heavy sequence to the homepage" — the heat
          idea is on /changes/manufacturing-quality, as components/concepts/changes/Heat.jsx. */}
      <Lab />
      <Manufacturing />
      <Oem />
      <EnquirySection links={RANGE_LINKS} logo="light" form={<SiteEnquiryForm interests={RANGE.map((f) => f.name)} />} />
    </ConceptShell>
  );
}
