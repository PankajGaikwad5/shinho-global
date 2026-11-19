import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Hero from "@/components/concepts/changes/Hero";
import Lab from "@/components/concepts/changes/Lab";
import About from "@/components/concepts/v1/About";
import Materials from "@/components/concepts/v1/Materials";
import Manufacturing from "@/components/concepts/v1/Manufacturing";
import Oem from "@/components/concepts/v1/Oem";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { ABOUT } from "@/lib/changes";
import { FAMILIES } from "@/lib/brief";

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
      <About
        statement={ABOUT.heading}
        note={
          <>
            {ABOUT.paragraphs.map((p) => (
              <span key={p} className="mb-4 block font-normal">{p}</span>
            ))}
            <span className="block font-semibold">{ABOUT.bold}</span>
          </>
        }
      />
      {/* V1's own sections and order. Point 13: no placeholder "#" links — each family panel points at its
          page, or at the enquiry where that page does not exist yet. */}
      <Materials
        items={FAMILIES.map((f) => ({
          ...f,
          href: f.id === "architectural" ? "/changes/materials/architectural-films" : "#contact",
        }))}
      />
      {/* No Interlude here. Point 8: "do not add a new colour-heavy sequence to the homepage" — the heat
          idea is on /changes/manufacturing-quality, as components/concepts/changes/Heat.jsx. */}
      <Lab />
      <Manufacturing />
      <Oem />
      <EnquirySection logo="light" form={<SiteEnquiryForm interests={FAMILIES.map((f) => f.name)} />} />
    </ConceptShell>
  );
}
