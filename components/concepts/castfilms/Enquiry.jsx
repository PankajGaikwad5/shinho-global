import Link from "next/link";
import CastEnquiryForm from "./EnquiryForm";
import Logo from "../shared/Logo";
import { Lines, Reveal } from "../shared/Reveal";
import { CAST_PDF, GROUPS } from "@/lib/cast";

const NEXT = [
  ["01", "Samples", "Tell us the applications you are targeting and we send samples of the relevant films."],
  ["02", "Specification", "We agree construction, colour, light transmission and the outdoor grade for your product."],
  ["03", "Production and supply", "Trial runs, then production at our partner facilities — supplied under your brand."],
];

// Closing enquiry for the cast-film page. Both hero buttons land here: "Request samples" at the top of the
// section (#samples), "Discuss your product" at the form (#enquiry). The shared form is reused with
// cast-film enquiry types and film groups, so the enquiry arrives with the product context already set.
export default function Enquiry() {
  return (
    <section id="samples" className="relative overflow-hidden bg-ink text-bone">
      <div className="mx-auto max-w-[1360px] px-[clamp(20px,4vw,56px)] pt-[clamp(110px,14vw,200px)] pb-24">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ash">Samples &amp; enquiries</span>
        <Lines lines={["Request samples.", "Discuss your product."]} className="mt-7 text-[clamp(52px,9vw,148px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.045em]" />

        {/* The overview, above the form. One hairline band in the site's own language — no bordered card,
            no drawn icon, no stack of meta lines. */}
        <a href={CAST_PDF} download
          className="group mt-[clamp(44px,6vw,80px)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-b border-bone/15 py-6 transition-colors duration-500 hover:border-bone/40">
          <span className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="text-[clamp(24px,2.4vw,34px)] font-medium [font-stretch:115%] tracking-[-.02em] transition-transform duration-500 ease-cine group-hover:translate-x-3">
              Cast films — product overview
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ash">PDF · 15 pages</span>
          </span>
          {/* A real button, not an underlined word: as plain text it read as more of the page's copy.
              Same pill the hero uses, so it is the site's own button and not a new one. */}
          <span className="inline-flex items-center gap-3 rounded-full bg-bone px-7 py-3.5 text-[15px] font-medium text-ink transition-colors duration-300 group-hover:bg-brass">
            Download PDF
            <span aria-hidden="true" className="transition-transform duration-500 ease-cine group-hover:translate-y-1">↓</span>
          </span>
        </a>

        <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-1 gap-[clamp(48px,6vw,96px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
          <Reveal className="flex flex-col gap-10">
            <p className="max-w-[44ch] text-base leading-[1.65] text-mist">
              Tell us the application and the performance you need. We come back with the construction we would
              propose, samples for your target applications and a route to production.
            </p>
            <ol className="flex list-none flex-col">
              {NEXT.map(([n, t, d]) => (
                <li key={n} className="grid grid-cols-[48px_1fr] gap-x-4 gap-y-1 border-t border-bone/15 py-5">
                  <span className="row-span-2 font-mono text-[11px] text-brass">{n}</span>
                  <span className="text-lg font-medium [font-stretch:112%]">{t}</span>
                  <span className="text-sm leading-[1.55] text-ash">{d}</span>
                </li>
              ))}
            </ol>
            {/* No email address or phone number is shown: the client asked that the form and the sample
                buttons are the contact route, and that personal contact details stay off the public pages. */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ash">Response</span>
              <span className="max-w-[34ch] text-[15px] leading-[1.6] text-mist">Enquiries reach a specialist directly. We reply with samples, specification and a route to production.</span>
            </div>
          </Reveal>

          <div id="enquiry" className="scroll-mt-24">
            <Reveal delay={0.15} className="border border-bone/12 bg-ink/55 p-[clamp(24px,3.5vw,48px)] backdrop-blur-md">
              <CastEnquiryForm />
            </Reveal>
          </div>
        </div>

        <footer className="mt-[clamp(90px,11vw,160px)] flex flex-wrap justify-between gap-x-16 gap-y-9 border-t border-bone/15 pt-9">
          <Logo tone="light" height={40} />
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-fog">
            <Link href="/">Home</Link>
            {GROUPS.slice(0, 3).map((g) => <a key={g.id} href={`#${g.id}`}>{g.name}</a>)}
            <a href="#samples">Samples</a>
          </div>
          <span className="basis-full font-mono text-[10px] uppercase tracking-[.08em] text-dusk">© 2026 SHINHO GLOBAL · Manufacturing carried out at partner facilities in the Republic of Korea</span>
        </footer>
      </div>
    </section>
  );
}
