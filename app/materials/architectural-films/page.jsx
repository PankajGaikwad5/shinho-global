import ConceptShell from "@/components/concepts/shared/ConceptShell";
import SiteNav from "@/components/concepts/shared/SiteNav";
import Materials from "@/components/concepts/v1/Materials";
import Layers from "@/components/concepts/architectural/Layers";
import About from "@/components/concepts/v1/About";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import SiteEnquiryForm from "@/components/concepts/shared/SiteEnquiryForm";
import { IMG, VIDEO } from "@/lib/media";
import { FAMILIES } from "@/lib/brief";
import { U, MATS } from "@/lib/materials";

export const metadata = {
  title: "Architectural Interior Films & Top Layers — SHINHO GLOBAL",
  description: "Wood, stone, mineral and textile surfaces with protective top layers, for interior architecture and furniture.",
};

const ARCH = FAMILIES[0];

// A short Applications section in the V12 showroom spirit (client brief point 7): a few strong interior
// examples with space around them, rendered through V1's own Materials panels. Deliberately short — the
// client asked not to build a second long homepage or a separate showroom journey.
const ROOMS = [
  { id: "room-hospitality", n: "01", name: "Hospitality", lede: "Wall panelling, joinery and feature surfaces in hotels, restaurants and lobbies.", img: IMG.ceiling(1600) },
  { id: "room-workplace", n: "02", name: "Workplace", lede: "Doors, partitions and furniture surfaces across commercial interiors.", img: IMG.aluminium(1600) },
  { id: "room-residential", n: "03", name: "Residential", lede: "Kitchen fronts, wardrobes and built-in furniture in wood and stone visuals.", img: IMG.oak(1600) },
];

// The architectural family's own reel, from the finishes in that family.
const STRIP = ARCH.mats.slice(0, 6).map((m) => ({ img: U(m.img, 900), label: m.name }));

export default function ArchitecturalFilms() {
  return (
    <ConceptShell switcher={false} letterbox={false}>
      <SiteNav current="/materials/architectural-films" />

      <div className="pt-[clamp(90px,10vw,140px)]">
        <About
          id="about-arch"
          eyebrow="Architectural interior films & top layers"
          statement={ARCH.lede}
          rows={ARCH.apps.map((a) => [a, ""])}
          frameImg={IMG.ceiling(1400)}
          inset={{ video: VIDEO.marble }}
          caption="Architectural film application · Interior ceiling"
          strip={STRIP}
        />
      </div>

      <Materials
        id="finishes"
        lines={["Wood, stone,", "mineral, textile."]}
        lede="Supplied from established collections or developed to your specification with our manufacturing partner."
        items={[{
          id: "arch-collection", n: "01", name: ARCH.name, lede: ARCH.lede, video: ARCH.video,
          mats: ARCH.mats,
        }, {
          id: "arch-custom", n: "02", name: "Custom finishes", lede: "Develop your own colours, textures and specialist luxury finishes for your collection.",
          img: U(MATS[11].img, 1400),
        }]}
        cta="Request samples →"
        ctaHref="#contact"
      />

      <Layers />

      <Materials
        id="applications"
        lines={["A few rooms,", "a lot of surface."]}
        lede="Interior examples showing where these films are applied. Illustrations of possible applications, not Shinho Global customer projects."
        items={ROOMS}
        cta="Discuss your project →"
        ctaHref="#contact"
      />

      <EnquirySection logo="light" form={<SiteEnquiryForm />} />
    </ConceptShell>
  );
}
