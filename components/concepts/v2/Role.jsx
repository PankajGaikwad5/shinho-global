import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { VIDEO, IMG } from "@/lib/media";
import { ROLE, AUDIENCE } from "@/lib/brief";

const FLOW = [
  { k: "Partner facilities", s: "Republic of Korea", d: "Long-standing manufacturing partner with more than 20 years of experience.", media: { video: VIDEO.factoryAerial } },
  { k: "SHINHO GLOBAL", s: "Development · Quality · Supply", d: "We specify, develop and quality-manage materials, and run international supply.", media: { img: IMG.ceiling(1200) }, lead: true },
  { k: "Your brand", s: AUDIENCE.join(" · "), d: "Products reach your market under your name, consistent batch to batch.", media: { video: VIDEO.cargoShip } },
];

export default function Role() {
  return (
    <section id="role" className="bg-bone px-[clamp(20px,4vw,56px)] py-[clamp(96px,11vw,170px)] text-[#151515]">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-[clamp(56px,7vw,100px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex max-w-[900px] flex-col gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#5d5a55]">Our role</span>
            <Lines lines={["The partner", "behind the surface."]} className="text-[clamp(44px,6.5vw,104px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
          </div>
          <Reveal as="p" className="max-w-[400px] text-[15px] leading-[1.6] text-[#5d5a55] [text-wrap:pretty]">
            SHINHO GLOBAL connects proven Korean manufacturing with brands worldwide. We source, develop and supply specialist films and finishes for businesses that sell them under their own name.
          </Reveal>
        </div>

        {/* Supply flow */}
        <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3">
          <div aria-hidden="true" className="pointer-events-none absolute top-[38%] right-[8%] left-[8%] hidden h-px bg-[repeating-linear-gradient(90deg,#151515_0_6px,transparent_6px_12px)] opacity-30 md:block" />
          {FLOW.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.12} className={`group relative flex flex-col ${f.lead ? "bg-ink text-bone" : "bg-[#e6e1d8]"}`}>
              <div className="relative aspect-[16/10] overflow-hidden">
                {f.media.video ? <Video media={f.media.video} /> : <div className="h-full w-full bg-cover bg-center transition-transform duration-[1.4s] ease-cine group-hover:scale-105" style={{ backgroundImage: `url(${f.media.img})` }} />}
                <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-bone backdrop-blur">Step {i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-[clamp(20px,2.4vw,32px)]">
                <span className={`font-mono text-[10px] uppercase tracking-[.14em] ${f.lead ? "text-brass" : "text-[#76726b]"}`}>{f.s}</span>
                <span className="text-[clamp(24px,2.2vw,32px)] leading-none font-medium [font-stretch:118%] tracking-[-.02em]">{f.k}</span>
                <span className={`text-[15px] leading-[1.6] ${f.lead ? "text-bone/70" : "text-[#5d5a55]"}`}>{f.d}</span>
              </div>
              {i < 2 && <span aria-hidden="true" className="absolute top-[38%] -right-4 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-brass text-ink md:flex">→</span>}
            </Reveal>
          ))}
        </div>

        {/* What we do */}
        <div className="mt-[clamp(64px,8vw,120px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {ROLE.map((r, i) => (
            <Reveal key={r.k} delay={i * 0.1} className="flex flex-col gap-4 border-t border-[#151515] pt-6 pr-8 pb-8">
              <span className="text-[56px] leading-none font-light [font-stretch:125%] text-[#a39c90]">0{i + 1}</span>
              <span className="text-[22px] font-medium [font-stretch:112%]">{r.k}</span>
              <span className="text-[15px] leading-[1.6] text-[#5d5a55]">{r.d}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
