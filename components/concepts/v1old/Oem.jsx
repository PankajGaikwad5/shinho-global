import Video from "../shared/Video";
import { Lines, Reveal } from "../shared/Reveal";
import { VIDEO, IMG } from "@/lib/media";

const STEPS = [
  ["01", "Specify", "We start from your application, performance requirements and the markets you sell into.", { img: IMG.control(900) }],
  ["02", "Develop", "Custom colours, textures, constructions and top layers, developed with our manufacturing partner.", { video: VIDEO.engraved }],
  ["03", "Validate", "Samples and trial runs confirm appearance, performance and processing on your lines.", { video: VIDEO.inspector }],
  ["04", "Manufacture", "Volume production and international supply under your brand, consistent batch to batch.", { img: IMG.line(900) }],
];

export default function Oem() {
  return (
    <section id="oem" className="bg-bone px-[clamp(20px,4vw,56px)] py-[clamp(88px,10vw,140px)] text-[#151515]">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-[clamp(56px,7vw,96px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="flex max-w-[860px] flex-col gap-5">
            <span className="font-mono text-[11px] uppercase tracking-[.14em] text-[#5d5a55]">OEM &amp; strategic partnerships</span>
            <Lines lines={["Your name on the product.", "Our capability behind it."]} className="text-[clamp(44px,6vw,96px)] leading-[.92] font-medium [font-stretch:120%] tracking-[-.035em]" />
          </div>
          <Reveal as="p" className="max-w-[380px] text-[15px] leading-[1.6] text-[#5d5a55] [text-wrap:pretty]">Custom development, specialist materials and a proven manufacturing partnership — combined into one route to market for your brand.</Reveal>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          {STEPS.map(([n, t, d, m], i) => (
            <Reveal key={n} delay={i * 0.1} className="group flex flex-col gap-4 border-t border-[#151515] pt-6 pr-7 pb-10">
              <div className="relative mb-2 aspect-[4/3] overflow-hidden bg-[#d8d2c8] grayscale transition-[filter] duration-700 group-hover:grayscale-0">
                {m.video ? <Video media={m.video} /> : <div className="h-full w-full bg-cover bg-center transition-transform duration-[1.4s] ease-cine group-hover:scale-110" style={{ backgroundImage: `url(${m.img})` }} />}
              </div>
              <span className="text-[64px] leading-none font-light [font-stretch:125%] text-[#a39c90] transition-colors duration-500 group-hover:text-brass">{n}</span>
              <span className="text-[22px] font-medium [font-stretch:112%]">{t}</span>
              <span className="text-[15px] leading-[1.6] text-[#5d5a55]">{d}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
