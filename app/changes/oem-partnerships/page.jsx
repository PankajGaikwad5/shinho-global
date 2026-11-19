import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Oem from "@/components/concepts/v1/Oem";
import About from "@/components/concepts/v1/About";
import Curve from "@/components/concepts/oem/Curve";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { IMG } from "@/lib/media";

export const metadata = {
  title: "OEM Partnerships — SHINHO GLOBAL",
  description: "Your name on the product, our capability behind it. From first samples to your branded product.",
};

// Customer protection, below the main offer (client brief point 12). Deliberately worded so it promises the
// no-competing-retail-range commitment and nothing more — territory or exclusive-design protection is
// agreed in writing, not implied by the website.
const PROTECTION = [
  ["No competing retail range", "We do not sell a competing SHINHO GLOBAL retail range in your market."],
  ["Your brand in front", "Product, labels and packaging carry your name, not ours."],
  ["Agreed in writing", "Any customer, territory or unique-design protection is agreed in writing."],
];

export default function OemPartnerships() {
  return (
    <ConceptShell switcher={false} letterbox={false}>
      <SiteNav base="/changes" current="/changes/oem-partnerships" />
      {/* The offer, without V1's four steps: point 5 gives one four-stage process for this page, and the
          curve below is it. Two different four-step sequences on one page is one too many. */}
      <div className="pt-[clamp(90px,10vw,140px)]">
        <Oem steps={[]} />
      </div>
      <Curve />
      <About
        id="protection"
        eyebrow="Customer protection"
        statement="Your brand stays in front. We supply the product; your name goes on it, and we do not launch a competing SHINHO GLOBAL retail range in your market."
        rows={PROTECTION}
        frameImg={IMG.line(1400)}
        inset={null}
        caption="Partner facility, Republic of Korea"
        strip={null}
      />
      <EnquirySection logo="light" form={<SiteEnquiryForm />} />
    </ConceptShell>
  );
}
