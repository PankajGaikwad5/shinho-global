// The range, as the client's menu defines it (15 Nov brief, point 4).
//
//   Materials
//     Architectural Interior Films & Top Layers      page: /changes/materials/architectural-films
//     Furniture Foils                                NO PAGE
//     Cast Films for Signage, Printing & Protection  page: /changes/cast-films
//     Specialist Flooring                            NO PAGE
//     Custom Finishes                                NO PAGE
//
// ───────────────────────────────────────────────────────────────────────────────────────────────────
// WHY ONLY TWO OF THE FIVE HAVE PAGES. Read this before building the other three.
//
// The client has described exactly two of these products:
//   - cast films, in the deck (public/SHINHO_GLOBAL_Cast_Films.pdf — a 15-slide "Cast PVC Films ·
//     Product overview", transcribed into lib/cast.js: six product groups, automotive protection,
//     applications, the buying process, and real figures attached to their grade)
//   - architectural films, in points 6 and 7 (the layer diagram and the applications section)
//
// For furniture foils, specialist flooring and custom finishes they have written three sentences in
// total — the range list in Who We Are, the development clause, and scene 2's line. No description, no
// uses, no formats, no figures. The deck contains nothing about them; it is a cast-film deck.
//
// Pages for those three were built on 20 Nov and removed the same day. With no content from the client
// they could only ever be structure, and point 10 says "Use only confirmed product claims."
//
// DO NOT BUILD THEM UNTIL THE CLIENT SENDS CONTENT. What to ask for, per product — this is point 10's
// own list, so it is the client's standard, not ours:
//   1. a plain explanation of the product     4. how samples are requested
//   2. its main uses                          5. technical information, attached to its grade
//   3. available supply formats               6. anything to show
// Ask whether each product has a deck of its own. If it does, that page can be as complete as the cast
// one in an afternoon, because the cast page is already the pattern.
//
// Until then those three stay unlinked in the menu — SiteNav dims a row with no href — and their
// homepage panel sends the visitor to the enquiry.
// ───────────────────────────────────────────────────────────────────────────────────────────────────

import { MATS, U } from "./materials";

const byCode = (c) => MATS.find((m) => m.code === c) || MATS[0];

// The technical band for a product page with no published figures. See products/TechnicalNote.jsx.
export const TECHNICAL = {
  eyebrow: "Technical detail",
  lines: ["Specification,", "by product."],
  lede: "Figures belong to the grade they come from. They are never a promise for the whole range.",
  body: "Tell us the application and the performance you need. The specification for the grade we would propose comes back with the samples, along with the supply format and the quantities it is produced in.",
};

// THE RANGE, as the homepage shows it.
//
// The homepage used to render the three concept-era families from lib/brief.js ("Architectural Surface
// Films", "Decorative Materials", "Flooring"), so the homepage and the menu described the range
// differently and two of the three panels pointed at #contact anyway. Point 4 defines the range as five,
// and point 14 says a buyer should understand "what products we supply" after a short look — which they
// cannot while the two lists disagree. These are the client's five, in their order and their wording.
//
// `href` is a page where one exists and the enquiry where it does not. Point 13 asks for "a working page
// or action"; the enquiry is the action, and it is the contact route the client asked us to lead with.
//
// FAMILIES in lib/brief.js is NOT changed — the frozen concept pages still render it.
export const RANGE = [
  {
    id: "architectural",
    n: "01",
    name: "Architectural Interior Films & Top Layers",
    lede: "Wood, stone, mineral and textile surfaces with protective top layers, for interior architecture and furniture.",
    href: "/changes/materials/architectural-films",
    mats: ["AF-310", "AF-201", "AF-233", "AF-344", "AF-415"].map(byCode),
    img: U(byCode("AF-310").img, 1400),
  },
  {
    id: "furniture-foils",
    n: "02",
    name: "Furniture Foils",
    // Who We Are, paragraph 3. The client has written nothing else about this product.
    lede: "Choose an established product or develop custom colours, textures and specialist luxury finishes for your collection.",
    href: "#contact",
    mats: ["AF-201", "AF-233", "AF-415", "AF-208"].map(byCode),
    img: U(byCode("AF-201").img, 1400),
  },
  {
    id: "cast",
    n: "03",
    name: "Cast Films for Signage, Printing & Protection",
    // The client's cast-film email, trimmed to one line for a panel.
    lede: "Korean cast-film manufacturing for signage, digital printing and surface protection.",
    href: "/changes/cast-films",
    mats: ["CF-305", "CF-214", "CF-318", "CF-126", "CF-352"].map(byCode),
    img: U(byCode("CF-305").img, 1400),
  },
  {
    id: "flooring",
    n: "04",
    name: "Specialist Flooring",
    // Who We Are, paragraph 2, the only place flooring is described at all.
    lede: "Part of the range, produced through specialist facilities in South Korea and supplied under your brand.",
    href: "#contact",
    mats: ["AF-208", "AF-360", "AF-310"].map(byCode),
    img: U(byCode("AF-208").img, 1400),
  },
  {
    id: "custom",
    n: "05",
    name: "Custom Finishes",
    // Scene 4's supporting line, verbatim.
    lede: "Explore existing finishes or develop your own colours, textures and effects.",
    href: "#contact",
    mats: ["DF-655", "DF-620", "DF-530", "DF-611", "DF-512"].map(byCode),
    img: U(byCode("DF-655").img, 1400),
  },
];

// The footer's product links on the /changes site. DERIVED, not listed: a product appears here once it
// has a page of its own, so adding a page adds its footer link and there is nothing else to remember.
// Before this the footer offered "Decorative Materials", which exists nowhere, via a dead "#decorative".
export const RANGE_LINKS = RANGE.filter((r) => r.href.startsWith("/")).map((r) => [r.name, r.href]);
