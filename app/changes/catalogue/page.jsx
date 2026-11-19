import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Materials from "@/components/concepts/v1/Materials";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { Lines, Reveal } from "@/components/concepts/shared/Reveal";

export const metadata = {
  title: "Catalogue — SHINHO GLOBAL",
  description: "Explore the finishes. Build your shortlist.",
};

// Point 11 — the Catalogue page. Heading, text and the three buttons are the client's words.
//
// "Use the final approved catalogue": it has not been supplied, so View Catalogue and Download PDF have
// nothing to point at. The client's pre-launch list also says every placeholder "#" link must become a
// working page or action — so rather than ship two dead links, they are shown inactive with the reason.
// Swap both for the real file the moment it arrives, and keep the selected finish codes in the enquiry.
export default function Catalogue() {
  return (
    <ConceptShell switcher={false}>
      <SiteNav base="/changes" current="/changes/catalogue" />

      <section className="bg-ink px-[clamp(20px,4vw,56px)] pt-[clamp(120px,15vw,200px)] pb-[clamp(60px,7vw,100px)] text-bone">
        <div className="mx-auto max-w-[1360px]">
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ash">Catalogue</span>
          <Lines lines={["Explore the finishes.", "Build your shortlist."]}
            className="mt-7 text-[clamp(40px,6.4vw,112px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.04em]" />
          <Reveal as="p" delay={0.1} className="mt-9 max-w-[620px] text-[clamp(16px,1.5vw,20px)] leading-[1.6] text-mist [text-wrap:pretty]">
            Choose the designs you like. Send us the codes and tell us whether you need face film or a
            finished product under your brand.
          </Reveal>

          <Reveal delay={0.2} className="mt-11 flex flex-wrap items-center gap-3.5">
            <span className="inline-flex cursor-not-allowed items-center rounded-full border border-bone/20 px-[30px] py-[15px] text-[15px] font-medium text-bone/40" aria-disabled="true">View Catalogue</span>
            <span className="inline-flex cursor-not-allowed items-center rounded-full border border-bone/20 px-[30px] py-[15px] text-[15px] font-medium text-bone/40" aria-disabled="true">Download PDF</span>
            <a href="#contact" className="inline-flex items-center gap-3 rounded-full bg-bone px-[30px] py-[15px] text-[15px] font-medium text-ink">Request These Samples <span aria-hidden="true">→</span></a>
          </Reveal>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[.14em] text-dusk">Catalogue awaiting the final approved file</p>
        </div>
      </section>

      {/* The finishes themselves, in V1's own panels. */}
      <Materials
        id="finishes"
        lines={["The finishes,", "by family."]}
        lede="Send us the codes you like with your enquiry, and tell us whether you need face film or a finished product under your brand."
        cta="Request these samples →"
        ctaHref="#contact"
      />

      <EnquirySection logo="light" form={<SiteEnquiryForm />} />
    </ConceptShell>
  );
}
