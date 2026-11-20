import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import Video from "@/components/concepts/shared/Video";
import Logo from "@/components/concepts/shared/Logo";
import { Lines, Reveal } from "@/components/concepts/shared/Reveal";
import { FAMILIES } from "@/lib/brief";
import { VIDEO } from "@/lib/media";

export const metadata = {
  title: "Request Samples — SHINHO GLOBAL",
  description: "Request samples and specification for architectural films, decorative materials and flooring.",
};

// The client's "clear Request Samples button" (point 4) now has somewhere to land. Every page's nav
// pointed at #samples, which only exists on the cast-film page — a dead link everywhere else, and point 13
// asks for every placeholder link resolved.
//
// This is V1's enquiry composition, which is the one the client has already seen and liked: a material
// behind an ink gradient, the eyebrow and heading at V1's own scale, then two columns — what happens next
// on the left, the form on the right. The first version of this page was a flat black screen with the
// heading alone on it and the form below the fold; it read as an empty page. Nothing here is a new
// treatment, and the only section on the page is the form.
//
// The background is marble, a material — not a production line. Rule 4: no footage may stand in for our
// manufacturing until the client supplies approved process film.
const NEXT = [
  ["01", "Samples", "Tell us the applications you are targeting and we send samples of the relevant films."],
  ["02", "Specification", "We agree the construction, colour and finish for your product."],
  ["03", "Route to manufacture", "Trial runs, then production at our partner facilities — under your brand."],
];

export default function RequestSamples() {
  return (
    <ConceptShell switcher={false} letterbox={false}>
      <SiteNav base="/changes" current="/changes/request-samples" />

      <main id="samples" className="relative min-h-screen overflow-hidden text-bone">
        <div className="absolute inset-0"><Video media={VIDEO.marble} /></div>

        <div className="relative bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-ink)_94%,transparent),color-mix(in_srgb,var(--color-ink)_82%,transparent)_40%,color-mix(in_srgb,var(--color-ink)_97%,transparent))] px-[clamp(20px,4vw,56px)] pt-[clamp(110px,14vw,200px)] pb-24">
          <div className="mx-auto max-w-[1360px]">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ash">Samples &amp; enquiries</span>
            <Lines lines={["Request samples.", "Discuss your range."]} className="mt-7 text-[clamp(52px,9vw,148px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.045em]" />

            <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-1 gap-[clamp(48px,6vw,96px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
              <Reveal className="flex flex-col gap-10">
                <p className="max-w-[44ch] text-base leading-[1.65] text-mist">
                  Share your application, volumes and markets. We will come back with materials, samples and
                  a route to manufacture.
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
                {/* No email address or phone number: the client asked that the form is the contact route. */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ash">Response</span>
                  <span className="max-w-[34ch] text-[15px] leading-[1.6] text-mist">
                    Enquiries reach a specialist directly. We reply with samples, specification and a route
                    to production.
                  </span>
                </div>
              </Reveal>

              {/* Solid ground, not a glass card over the video — the fields have to be readable. */}
              <Reveal delay={0.15} className="border border-bone/12 bg-ink p-[clamp(24px,3.5vw,48px)]">
                <SiteEnquiryForm
                  interests={FAMILIES.map((f) => f.name)}
                  requestPlaceholder="The application, the finishes you are interested in, and the samples you would like to see."
                />
              </Reveal>
            </div>

            <footer className="mt-[clamp(100px,12vw,180px)] flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-t border-bone/15 pt-9">
              <Logo tone="light" height={40} />
              <span className="font-mono text-[10px] uppercase tracking-[.08em] text-dusk">
                © 2026 SHINHO GLOBAL · Manufacturing carried out at partner facilities in the Republic of Korea
              </span>
            </footer>
          </div>
        </div>
      </main>
    </ConceptShell>
  );
}
