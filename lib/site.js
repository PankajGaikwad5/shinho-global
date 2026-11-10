// Company content, taken from the client's current website (www.shinho-global.com) — data only, not design.
// Used by the new homepage sections (components/concepts/sections) and the V6–V9 concepts.
import { MATS, U } from "./materials";
import { VIDEO } from "./media";

const m = (name) => MATS.find((x) => x.name === name);

export const ABOUT = {
  statement: "Shinho Global is a specialist international supply partner for decorative surface films and related polymer-based materials.",
  body: [
    "We support manufacturers, converters and product development teams looking to build or expand architectural film, printable media and decorative surface film ranges.",
    "Our role is to connect material selection, technical sampling, manufacturing capability and commercial supply into one clear route for international customers.",
  ],
  buyers: ["Reliable film supply", "Premium surface finishes", "Flexible pilot routes", "Private-label options", "Roll-stock and finished constructions", "Commercial support from sampling to scale"],
};

export const PLATFORMS = [
  { name: "Decorative PVC Films", d: "Wood, stone, marble, textile, solid colour, metallic and embossed finishes for architectural and interior surface applications.", media: { img: U(m("Calacatta").img, 1400) } },
  { name: "PET, PP & Co-PET Films", d: "Specialty film platforms for decorative, printable, coated and laminated applications.", media: { video: VIDEO.metalLight } },
  { name: "Top-Layer Films", d: "Decorative face films supplied for adhesive coating, lamination, conversion and private-label development.", media: { video: VIDEO.slitter } },
  { name: "Finished Self-Adhesive Films", d: "Ready-made film constructions available for evaluation, launch programmes and market testing.", media: { img: U(m("Natural Oak").img, 1400) } },
];

// The 12 finish technologies, each paired with a representative swatch (placeholder imagery).
export const FINISHES = [
  ["Super Matte", "Graphite Matte"], ["High Gloss", "Nero Gloss"], ["Satin", "Pearl Satin"], ["Anti-Fingerprint", "Soft Grey Matte"],
  ["Embossed Woodgrain", "Natural Oak"], ["Stone & Marble", "Calacatta"], ["Brushed Metallic", "Brushed Steel"], ["Textile Texture", "Fluted Ash"],
  ["Printable White Films", "Raw Concrete"], ["Clear Films", "Amber Onyx"], ["Decorative PET", "Silver Metallic"], ["Architectural Surface Films", "Smoked Walnut"],
].map(([name, mat]) => ({ name, img: U(m(mat).img, 900) }));

export const PARTNERS = {
  intro: [
    "Shinho Global is focused on B2B supply relationships where material performance, finish quality, flexibility and commercial speed matter.",
    "We support businesses developing new product ranges, extending existing film platforms or validating decorative surface opportunities through controlled sampling and pilot supply.",
  ],
  workWith: ["Adhesive film manufacturers", "Coaters and laminators", "Architectural film brands", "Print media companies", "Decorative surface distributors", "Private-label surface film programmes", "International OEM product teams"],
  applications: ["Architectural surface films", "Interior decorative films", "Printable media", "Roll-stock supply", "Laminated film constructions", "Private-label decorative ranges", "Commercial product development"],
};

export const PROCESS = [
  { t: "Material Review", d: "We identify the right film platform, finish category and construction route for the customer's application." },
  { t: "Sampling", d: "Selected finishes can be supplied for internal review, technical evaluation or market testing." },
  { t: "Pilot Supply", d: "Pilot quantities can be structured around practical launch requirements before wider scale-up." },
  { t: "Commercial Rollout", d: "Approved ranges can move into repeat supply, private-label development or OEM programme support." },
];

export const ENQUIRY_TYPES = ["OEM supply", "Converter / laminator", "Private label", "Distribution", "Sampling request"];
export const EMAIL = "enquiries@shinhoglobal.com";
export const NAV = [["#about", "About"], ["#materials", "Materials"], ["#oem", "OEM Supply"], ["#process", "Scalable supply"], ["#contact", "Contact"]];
