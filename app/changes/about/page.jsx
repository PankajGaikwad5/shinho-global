import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import AboutPage from "@/components/concepts/changes/AboutPage";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { RANGE_LINKS } from "@/lib/products";
import { FAMILIES } from "@/lib/brief";

export const metadata = {
  title: "About — SHINHO GLOBAL",
  description: "Your next product. Your brand. Our manufacturing expertise.",
};

// About, on its own page.
//
// The menu has always had an About row; until now it pointed at `#about`, an anchor part-way down the
// homepage. This gives it a real page, and the menu row points here.
//
// THE HOMEPAGE SECTION IS NOT REMOVED and is not what this renders. The first build of this page just
// re-used components/concepts/changes/About.jsx with deeper padding, and it read as a slice of the
// homepage rather than a page of its own. The page now has its own component, built from the same
// vocabulary the other pages use. Both still draw every sentence from lib/changes.js, so the client's
// point 3 copy has one home.

export default function Page() {
  return (
    <ConceptShell switcher={false}>
      <SiteNav base="/changes" current="/changes/about" />
      <AboutPage />
      <EnquirySection links={RANGE_LINKS} logo="light" form={<SiteEnquiryForm interests={FAMILIES.map((f) => f.name)} />} />
    </ConceptShell>
  );
}
