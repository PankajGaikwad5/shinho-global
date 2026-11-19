import Video from "./Video";
import EnquiryForm from "./EnquiryForm";
import Logo from "./Logo";
import { Lines, Reveal } from "./Reveal";
import { VIDEO } from "@/lib/media";
import { EMAIL, FAMILIES } from "@/lib/brief";

const NEXT = [
  ["01", "Review", "We look at your application, volumes and the markets you sell into."],
  ["02", "Materials & samples", "We propose finishes from our collections or a development route, and send samples."],
  ["03", "Route to manufacture", "Trial runs, then volume production at our partner facilities — under your brand."],
];

// `logo`: "light" | "dark" shows the real logo artwork in the footer (V4–V8); omitted keeps the text wordmark (V1–V3).
// `form`: the form to render. Defaults to the long concept form, so the frozen concept pages (/, /v1, /v2,
// /v3) are unchanged; the real site passes <SiteEnquiryForm />, which is the client's short form.
export default function EnquirySection({ video, logo, form }) {
  // The real pages (the ones that pass `form`) sit on a material rather than V1's night-city plate: it is
  // calmer behind a form, and it is a finish rather than a factory. Concepts that pass nothing keep V1's
  // own clip, and V2/V3 pass their own.
  const bg = video || (form ? VIDEO.marble : VIDEO.factoryNight);
  return (
    <section id="contact" className="relative overflow-hidden text-bone">
      <div className="absolute inset-0"><Video media={bg} /></div>
      <div className="relative bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-ink)_94%,transparent),color-mix(in_srgb,var(--color-ink)_82%,transparent)_40%,color-mix(in_srgb,var(--color-ink)_97%,transparent))] px-[clamp(20px,4vw,56px)] pt-[clamp(110px,14vw,200px)] pb-24">
        <div className="mx-auto max-w-[1360px]">
          <span className="font-mono text-[11px] uppercase tracking-[.14em] text-ash">Enquiries</span>
          <Lines lines={["Tell us what you", "need to make."]} className="mt-7 text-[clamp(32px,9vw,148px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.045em]" />

          <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-1 gap-[clamp(48px,6vw,96px)] lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
            <Reveal className="flex flex-col gap-10">
              <p className="max-w-[440px] text-base leading-[1.6] text-mist">Share your application, volumes and markets. We will come back with materials, samples and a route to manufacture.</p>
              <ol className="flex list-none flex-col">
                {NEXT.map(([n, t, d]) => (
                  <li key={n} className="grid grid-cols-[48px_1fr] gap-x-4 gap-y-1 border-t border-bone/15 py-5">
                    <span className="row-span-2 font-mono text-[11px] text-brass">{n}</span>
                    <span className="text-lg font-medium [font-stretch:112%]">{t}</span>
                    <span className="text-sm leading-[1.55] text-ash">{d}</span>
                  </li>
                ))}
              </ol>
              {/* The real pages show no address: the client asked that the form and the sample buttons
                  are the contact route. The concepts keep the address they were shown with. */}
              {form ? (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ash">Response</span>
                  <span className="max-w-[34ch] text-[15px] leading-[1.6] text-mist">Enquiries reach a specialist directly. We reply with samples, specification and a route to production.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[.16em] text-ash">Direct</span>
                  <a href={`mailto:${EMAIL}`} className="text-[clamp(18px,1.6vw,22px)] font-medium [font-stretch:112%]">{EMAIL}</a>
                </div>
              )}
            </Reveal>
            {/* The real site's form gets its own solid ground. On the glass card it sat on moving city
                lights and could not be read — the client's word for it was "ass". */}
            <Reveal delay={0.15} className={form ? "bg-ink px-[clamp(20px,3vw,44px)] py-[clamp(8px,1.4vw,20px)]" : "border border-bone/12 bg-ink/55 p-[clamp(24px,3.5vw,48px)] backdrop-blur-md"}>
              {form || <EnquiryForm />}
            </Reveal>
          </div>

          <footer className="mt-[clamp(100px,12vw,180px)] flex flex-wrap justify-between gap-x-16 gap-y-9 border-t border-bone/15 pt-9">
            {logo ? <Logo tone={logo} height={40} /> : (
              <div className="flex flex-col gap-[5px]">
                <span className="text-[15px] font-semibold [font-stretch:125%] tracking-[.34em]">SHINHO</span>
                <span className="font-mono text-[9px] tracking-[.62em] text-ash">GLOBAL</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-fog">
              {FAMILIES.map((f) => <a key={f.id} href={`#${f.id}`}>{f.name}</a>)}
              <a href="#contact">Contact</a>
            </div>
            <span className="basis-full font-mono text-[10px] uppercase tracking-[.08em] text-dusk">© 2026 SHINHO GLOBAL · Manufacturing carried out at partner facilities in the Republic of Korea</span>
          </footer>
        </div>
      </div>
    </section>
  );
}
