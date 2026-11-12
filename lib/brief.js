// Homepage content for the concept pages, structured around the client brief.
// Copy marked PLACEHOLDER is concept copy — confirm with SHG / the partner before launch.
import { VIDEO } from "./media";
import { MATS, U } from "./materials";

const pick = (...names) => names.map((n) => MATS.find((m) => m.name === n));

// Add a family here and every concept page picks it up ("room to expand").
export const FAMILIES = [
  {
    id: "architectural",
    n: "01",
    name: "Architectural Surface Films",
    lede: "Wood, stone, mineral and textile surfaces with protective top layers, engineered for interior architecture and furniture.",
    apps: ["Wall panelling", "Doors & joinery", "Furniture", "Hospitality interiors"],
    video: VIDEO.marble,
    mats: pick("Calacatta", "Natural Oak", "Smoked Walnut", "Nero Marquina", "Fluted Ash", "Rosa Stone"),
  },
  {
    id: "decorative",
    n: "02",
    name: "Decorative Materials",
    lede: "Cast, metallic, reflective, oxidised and relief finishes for products, interiors and retail environments.",
    apps: ["Appliance panels", "Retail fixtures", "Trims & profiles", "Feature walls"],
    video: VIDEO.metalLight,
    mats: pick("Silver Metallic", "Brushed Steel", "Satin Aluminium", "Oxide", "Verdigris", "Amber Onyx"),
  },
  {
    id: "flooring",
    n: "03",
    name: "Flooring",
    // PLACEHOLDER copy
    lede: "Decorative layers and wear-resistant top coats for resilient and laminate flooring — wood, stone and mineral visuals.",
    apps: ["Residential", "Commercial", "Hospitality", "Retail"],
    video: VIDEO.woodPlant,
    mats: pick("Light Oak", "Natural Oak", "Raw Concrete", "Smoked Walnut", "Fluted Ash", "Calacatta"),
  },
];

export const thumb = (m, w = 900) => U(m.img, w);

// SHG's role between partner manufacturing and the client's brand.
export const ROLE = [
  { k: "OEM supply", d: "Materials developed and produced under your name, from first specification to volume runs." },
  { k: "Materials sourcing", d: "Films and finishes specified to your process, supplied from established collections." },
  { k: "Distribution partnerships", d: "A curated range backed by partner manufacturing, with consistent international supply." },
];

export const AUDIENCE = ["Manufacturers", "OEMs", "Converters", "Distributors"];

// PLACEHOLDER: generic capability categories — replace with the partner's confirmed processes, lines and certifications.
export const CAPABILITIES = {
  years: "20+",
  processes: ["Film casting & calendering", "Gravure printing", "Embossing & synchronised texture", "Lamination", "UV / EB top coating", "Slitting & finishing"],
  testing: ["Colour & gloss measurement", "Abrasion & scratch resistance", "Light fastness", "Adhesion & peel", "Dimensional stability"],
};

export const EMAIL = "enquiries@shinhoglobal.com";

// V1 homepage scrolling sequence — the client's seven messages, verbatim and in this exact order.
// `head` is split into display lines (copy unchanged, only line breaks); `sub` is the supporting line.
export const SEQUENCE = [
  { head: ["Behind Every", "Surface."], sub: "Over 30 Years of Manufacturing Expertise.", label: "Behind every surface" },
  { head: ["Cast &", "Specialist Films."], sub: "Precision Engineered. Built to Outperform.", label: "Cast & Specialist Films" },
  { head: ["Architectural Films", "& Top Layers."], sub: "Advanced Materials. Exceptional Finishes.", label: "Architectural Films & Top Layers" },
  { head: ["Advanced", "Decorative Finishes."], sub: "Customised for Your Collection. Created for Your Brand.", label: "Advanced Decorative Finishes" },
  { head: ["Your Brand.", "Our Manufacturing", "Excellence."], sub: "OEM & ODM Development. Private-Label Production.", label: "OEM & ODM" },
  { head: ["From Concept", "to Production."], sub: "Custom Development. Quality Control. Global Supply.", label: "Concept to production" },
  { head: ["The Next Great", "Surface Could", "Be Yours."], sub: "Let's Develop What Comes Next.", label: "What comes next" },
];
