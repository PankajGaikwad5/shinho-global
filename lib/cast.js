// Cast & Specialist Films page content.
// Source: the client's "SHINHO GLOBAL Cast Films" deck (public/SHINHO_GLOBAL_Cast_Films_Public.pdf) plus the
// opening copy supplied in their email, used verbatim.
//
// Rules this file follows, from the client:
//  - No factory names, factory customers, their logos or their product codes. Image file names are generic too.
//  - Technical figures stay attached to the grade they belong to. They are examples, never range-wide promises.
//  - Application imagery is illustrative. It is never described as a completed Shinho Global customer project.

const img = (f) => `/assets/cast/${f}`;

// Published download: rebuilt from the client's deck with the personal email address and mobile number
// removed from the final slide, and with clean metadata. The original sits outside public/ at
// C:/projects/SHG/reference/ so it is never served.
export const CAST_PDF = "/SHINHO_GLOBAL_Cast_Films.pdf";

// Opening headline and supporting copy — the client's words, unchanged.
export const OPENING = {
  head: ["Cast Films.", "Built for Your Brand."],
  sub: "Korean cast-film manufacturing for signage, digital printing and surface protection. Build your own range with Shinho Global, with the film specification, samples and supply agreed around your needs.",
};

export const PITCH = {
  head: ["Your Brand.", "Our Manufacturing", "Expertise."],
  body: "We work with manufacturers, converters and brands who want to expand their range. Tell us the application and the performance you need. We help you select the right construction, test samples and move towards production.",
  reassurance: "We do not sell a competing Shinho Global retail range in your market.",
};

// Hero tunnel chapters — seven, at the same length and pacing as the V1 homepage sequence.
// 01 is the client's opening copy, verbatim, and carries the two buttons.
export const CHAPTERS = [
  { head: OPENING.head, sub: "Korean cast-film manufacturing for signage, digital printing and surface protection.", label: "Cast films", cta: true },
  { head: ["Your Brand.", "Our Manufacturing", "Expertise."], sub: "Specialist Korean production for your product range, with specifications and quality checks agreed before manufacture.", label: "Built for your brand" },
  { head: ["Printable White", "& Clear."], sub: "A white or clear base for full-colour printed graphics, with slidable and repositionable options.", label: "Printable cast films" },
  { head: ["Colour for Lettering", "& Logos."], sub: "Coloured films for cut lettering, logos and solid-colour graphics.", label: "Coloured films" },
  { head: ["Translucent for", "Illuminated Signs."], sub: "The film lets light pass through the graphic, for backlit signs and corporate branding.", label: "Translucent films" },
  { head: ["Light Control", "& Protection."], sub: "Blockout and diffuser films for light control, with clear protective films and graphic overlaminates.", label: "Light control & protection" },
  { head: ["Build Your Range", "With Us."], sub: "Tell us the application and the performance you need. We agree the specification, send samples and plan supply.", label: "Build your range" },
];

// The range, grouped exactly as the client's 15 Nov brief lists it (point 10), in their order.
// That brief takes priority over the earlier six-group wording where the two differ.
// Each entry carries what point 10 requires of a product page: a plain explanation, main uses,
// supply formats and what technical information is available.
// PLACEHOLDER: `formats` describes the supply routes in general terms — confirm roll widths, lengths and
// the available face-film-only route with the client before launch.
// `short` is the panel name on the page. Five panels sit side by side, so they take V1-length names
// (one or two words); the full sentence is the lede that opens with the panel.
// `short` is the panel name on the page: five panels sit side by side, so they take V1-length names of
// one or two words. The full sentence stays in the lede that opens with the panel.
export const GROUPS = [
  {
    id: "printable", n: "01", short: "Printable", name: "White and clear printable cast films",
    lede: "A white or clear base for full-colour printed graphics. Slidable and repositionable options help installers position the film during application.",
    uses: "Vehicle graphics, fleet livery, outdoor advertising and large printed panels.",
    formats: "Supplied as finished self-adhesive film — face film, adhesive and release liner.",
    tech: "Technical data sheet covering printer, ink and overlaminate compatibility.",
    grade: "Compatibility varies by printer, ink and overlaminate — check the data sheet for the grade.",
    img: img("bus.jpg"),
  },
  {
    id: "coloured", n: "02", short: "Coloured", name: "Coloured films for lettering and logos",
    lede: "Gloss and weather-resistant coloured films for cut lettering, logos and solid-colour graphics on non-illuminated signs.",
    uses: "Shopfronts, fascias, corporate signage and cut vinyl lettering.",
    formats: "Supplied as finished self-adhesive film in the colours agreed for your range.",
    tech: "Colour references, outdoor grade and durability figures for the specified grade.",
    grade: "Example grade — 50 µm cast PVC face film · outdoor durability up to 7 years",
    img: img("shopfront.jpg"),
  },
  {
    id: "translucent", n: "03", short: "Translucent", name: "Translucent films for illuminated signs",
    lede: "Semi-gloss translucent cast PVC for cut lettering and coloured graphics on illuminated signs. The film allows light to pass through the graphic.",
    uses: "Backlit fascias, light boxes, illuminated lettering and branded estates.",
    formats: "Supplied as finished self-adhesive film with a clear permanent adhesive.",
    tech: "Colour, light transmission and the full construction specification for the grade.",
    grade: "Example grade — 50 µm cast PVC face film · clear permanent adhesive",
    img: img("coffee-sign.jpg"),
  },
  {
    id: "light-control", n: "04", short: "Light control", name: "Blockout and diffuser films for light control",
    lede: "Blockout film stops light in selected areas of a sign, and white-backed film gives a white reverse side where the build needs one. Diffuser film spreads LED light more evenly across the sign face.",
    uses: "Illuminated signs that need masking, a white reverse, or softer light across shallow light boxes.",
    formats: "Supplied as finished self-adhesive film; construction depends on the sign build.",
    tech: "Construction detail and light-transmission behaviour for the specified grade.",
    grade: "Results depend on the sign design and the light source.",
    img: img("signbox.jpg"),
  },
  {
    id: "protective", n: "05", short: "Protective", name: "Clear protective films and graphic overlaminates",
    lede: "Clear, high-clarity and semi-gloss protective films for graphics and surfaces, with weather-resistant overlaminates for printed work.",
    uses: "Protecting printed graphics, glazing graphics and surfaces that need a clear or semi-gloss finish.",
    formats: "Supplied as finished self-adhesive film, matched to the printed film it covers.",
    tech: "Finish, clarity and weather-resistance figures for the specified grade.",
    grade: "Specification and performance depend on the product.",
    img: img("glass-graphic.jpg"),
  },
];

// Kept separate from the sign and graphic films, as the client asked, with its own construction.
export const AUTOMOTIVE = {
  name: "Automotive paint protection",
  lede: "A different construction from the sign and graphic films: a PVC carrier with a self-healing polyurethane layer, made to protect vehicle paint rather than to carry a graphic.",
  construction: [
    ["01", "Self-healing PU top layer", "Polyurethane surface layer"],
    ["02", "PVC carrier film", "Cast PVC body of the film"],
    ["03", "Adhesive", "Bonds the film to the paint"],
    ["04", "Release liner", "Removed at application"],
  ],
  note: "PU: polyurethane. Specification and performance depend on the product.",
  img: img("van.jpg"),
};

// Possible applications. Illustrations only — never presented as Shinho Global customer projects.
// Three only, matching V1's three-panel Materials row. The client's 15 Nov brief asks for one strong visual
// at a time and no busy image grids, so this stays short rather than showing every picture in the deck.
export const APPLICATIONS = [
  { name: "Corporate signage", films: "Coloured and translucent films · exterior signs, illuminated lettering, window graphics", img: img("bank.jpg") },
  { name: "Illuminated signs", films: "Translucent, blockout and diffuser films · forecourts, fascias and light boxes", img: img("petrol.jpg") },
  { name: "Vehicle graphics", films: "Printable cast film with a graphic overlaminate · fleet and livery", img: img("van.jpg") },
];

export const APPLICATIONS_NOTE = "Illustrations of possible applications. These are not Shinho Global customer projects.";

// The buying process, in the client's wording.
export const PROCESS = [
  ["01", "Tell us what you need", "The application, the market you sell into and the performance your range has to reach."],
  ["02", "Review the specification", "We propose the construction, colour and light transmission, and the outdoor grade."],
  ["03", "Test the samples", "Samples for your target applications — colour, printing and application trials."],
  ["04", "Approve the product", "Construction, appearance and performance agreed with your team before production."],
  ["05", "Plan production and supply", "Roll sizes, quantities and a supply schedule for your programme."],
];

// Example specification for ONE grade. Deliberately labelled as such.
export const SPEC = {
  grade: "Example · translucent cast film",
  intro: "The figures below are an example construction and test values for one translucent grade. Other films in the range carry their own values, and the final specification is agreed for your grade.",
  rows: [
    ["Face film thickness", "50 µm", "Cast PVC film, excluding adhesive"],
    ["Thickness including adhesive", "80 µm ± 10%", "Adhesive included, liner excluded"],
    ["Elongation", "≥ 100%", "ASTM D882"],
    ["Peel adhesion", "≥ 1,200 g/in", "After 24 h, 180° peel, PSTC-1"],
    ["Dimensional stability", "Max. 0.5 mm", "Bonded to an aluminium plate, lengthwise, 100 °C for 2 h (average)"],
    ["Outdoor durability", "Up to 7 years", "Example unprinted face-film rating for vertical exposure"],
  ],
  note: "Durability depends on grade, application and exposure. Grade-specific terms apply.",
};

export const ADVANTAGES = [
  ["Thin film profile", "Thin cast constructions for signage and graphic applications."],
  ["Dimensional stability", "Dimensional stability helps maintain the shape of applied graphics."],
  ["Colour consistency", "Colour checks against reference samples help maintain consistent brand colours."],
  ["Outdoor durability", "Outdoor grades are available for long-term signage."],
];

// Quality control, agreed before production.
export const QUALITY = {
  head: "Quality built around your specification",
  lede: "We agree the required construction, appearance and performance with your team before production. Inspection records document results and help trace production batches.",
  rows: [
    ["Incoming inspection", "Material identification, appearance and supplier inspection reports"],
    ["In-process inspection", "Appearance, colour and thickness against agreed specifications"],
    ["Final inspection", "Appearance and the physical properties specified for each product"],
    ["Records and change control", "Retain results, report changes and document corrective action"],
  ],
  note: "Inspection requirements vary by product and agreed supply specification.",
};


