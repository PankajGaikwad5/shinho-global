import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { OPENING } from "@/lib/cast";
import { VIDEO } from "@/lib/media";

// Cast & Specialist Films opening.
//
// The client's cast-film email asks this page for "a strong opening image, the headline above and two clear
// buttons" — one screen. The seven-scene scroll journey belongs to the HOMEPAGE (15 Nov brief, point 2);
// this page previously carried a seven-chapter fork of it, which made it a second homepage. The 15 Nov
// brief is explicit the other way: match the cast page to the site's visual style, keep it a product page.
//
// So: V1's visual language — dark ground, large type, one strong material visual, the masked line reveal —
// on a single screen. No tunnel, no scroll sequence, no animation loop, which also makes the
// reduced-motion version of this page the same page.
export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[640px] flex-col justify-end overflow-hidden bg-ink text-bone"
      style={{ height: "100svh" }}>
      {/* A moving material surface, as the homepage opens — the client asked to keep the V1 direction and
          named the moving material samples as the thing he likes. The deck's own opening crop is a bright
          green abstract, which is neither black-and-white nor premium, so it is not used here. */}
      <div className="absolute inset-0"><Video media={VIDEO.metalLight} /></div>
      {/* V1's ground under type on an image: dark at the foot, clear at the top. */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(11,11,12,.72) 0%,rgba(11,11,12,.45) 38%,rgba(11,11,12,.94) 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%)" }} />

      <div className="relative mx-auto flex w-full max-w-[1360px] flex-col gap-7 px-[clamp(20px,4vw,56px)] pb-[clamp(56px,8vh,110px)]">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-brass">Cast &amp; specialist films</span>

        <Lines as="h1" lines={OPENING.head}
          className="text-[clamp(44px,7.4vw,118px)] leading-[.9] font-medium [font-stretch:122%] tracking-[-.04em]" />

        {/* The client's opening paragraph, in full. */}
        <Reveal as="p" delay={0.15} className="max-w-[780px] text-[clamp(17px,1.7vw,24px)] leading-[1.45] [font-stretch:108%] tracking-[-.01em] text-mist [text-wrap:pretty]">
          {OPENING.sub}
        </Reveal>

        <Reveal delay={0.25} className="mt-1 flex flex-wrap items-center gap-3.5">
          <a href="#samples" className="inline-flex items-center gap-3 rounded-full bg-bone px-[30px] py-[15px] text-[15px] font-medium text-ink">Request samples <span aria-hidden="true">→</span></a>
          <a href="#enquiry" className="inline-flex items-center rounded-full border border-bone/30 px-[30px] py-[15px] text-[15px] font-medium text-bone">Discuss your product</a>
        </Reveal>
      </div>
    </section>
  );
}
