import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Materials from "@/components/concepts/v1/Materials";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { RANGE_LINKS } from "@/lib/products";
import { Lines, Reveal } from "@/components/concepts/shared/Reveal";
import { CAST_PDF } from "@/lib/cast";

export const metadata = {
  title: "Catalogue — SHINHO GLOBAL",
  description: "Explore the finishes. Build your shortlist.",
};

// Point 11 - the Catalogue page. Heading, text and the three buttons are the client's words.
//
// View Catalogue and Download PDF serve CAST_PDF (public/SHINHO_GLOBAL_Cast_Films.pdf), the only
// catalogue file we have. They were shown disabled until 19 Nov because that deck covers cast films
// only, while this page lists every family; the user's call is that a working download of the deck we
// have beats two dead buttons. The line under them names the document, so nobody downloads it expecting
// the furniture foils. SWAP CAST_PDF FOR THE FULL CATALOGUE THE MOMENT THE CLIENT SENDS IT, and drop
// that qualifier line with it.
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
            {/* Opens in a tab so the browser renders it; the second one saves it. */}
            <a href={CAST_PDF} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-bone/30 px-[30px] py-[15px] text-[15px] font-medium text-bone transition-colors duration-300 hover:border-bone/70">View Catalogue</a>
            <a href={CAST_PDF} download
              className="inline-flex items-center gap-3 rounded-full border border-bone/30 px-[30px] py-[15px] text-[15px] font-medium text-bone transition-colors duration-300 hover:border-bone/70">Download PDF <span aria-hidden="true">↓</span></a>
            <a href="#contact" className="inline-flex items-center gap-3 rounded-full bg-bone px-[30px] py-[15px] text-[15px] font-medium text-ink">Request These Samples <span aria-hidden="true">→</span></a>
          </Reveal>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[.14em] text-dusk">Cast films · product overview · PDF · 15 pages — full finishes catalogue to follow</p>
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

      <EnquirySection links={RANGE_LINKS} logo="light" form={<SiteEnquiryForm />} />
    </ConceptShell>
  );
}
