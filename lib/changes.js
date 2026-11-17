// Content for the 15 Nov brief version of the site (routes under /changes).
// The client's consolidated brief of 15 November 2026 takes priority over the earlier emails where they
// overlap. Every string below is the client's own wording — only line breaks for display are ours.
//
// The current site (`/`, `/cast-films`, …) is frozen. Nothing here is imported by it.

// Point 2 — the opening scroll. Seven scenes, this order, these words.
// Scene 1 and scene 7 carry buttons; the rest carry none.
export const SEQUENCE = [
  {
    head: ["Behind Every", "Surface."],
    sub: "Your next product. Your brand. Our manufacturing expertise.",
    label: "Behind every surface",
    cta: [["Explore Materials", "#materials"], ["Request Samples", "#contact"]],
  },
  {
    head: ["The finish your", "range is missing."],
    sub: "Architectural interior films, furniture foils and customised luxury finishes.",
    label: "The finish your range is missing",
  },
  {
    head: ["Cast films for", "signs, graphics", "and protection."],
    sub: "Printable, coloured, translucent and protective films for your range.",
    label: "Cast films",
  },
  {
    head: ["Choose the look.", "Make it your own."],
    sub: "Explore existing finishes or develop your own colours, textures and effects.",
    label: "Choose the look",
  },
  {
    head: ["Your Brand.", "Our Manufacturing", "Expertise."],
    sub: "OEM and private-label supply. We do not sell a competing SHINHO GLOBAL retail range in your market.",
    label: "Your brand, our expertise",
  },
  {
    head: ["Choose. Test.", "Approve. Produce."],
    sub: "From first samples to your branded product.",
    label: "Choose. Test. Approve. Produce.",
  },
  {
    head: ["The Next Great", "Surface Could", "Be Yours."],
    sub: "What is missing from your range?",
    label: "What comes next",
    cta: [["Request Samples", "#contact"], ["Discuss Your Product", "#contact"]],
  },
];

// Opening rules: a visitor can go straight to the products.
export const INTRO_CONTROLS = [["Explore Materials", "#materials"], ["Skip Intro", "#about"]];

// Point 13 — "Enter the archive" becomes "Explore the collection".
export const HERO_HINT = "Scroll to explore the collection — drag to look around";

// Point 3 — Who We Are, replacing the current copy. The final sentence is bold.
export const ABOUT = {
  heading: "Your next product. Your brand. Our manufacturing expertise.",
  paragraphs: [
    "SHINHO GLOBAL helps manufacturers, converters and brands fill gaps in their ranges and develop products around their customers.",
    "Our range includes architectural interior films, furniture foils, cast films for signage, digital printing and vehicle graphics, protective films and specialist flooring, with production through specialist facilities in South Korea.",
    "Choose an established product or develop custom colours, textures and specialist luxury finishes for your collection.",
    "For decorative films, we offer two supply routes: top-layer face film for you to coat with adhesive and add your own release liner, or complete self-adhesive film with your labels and packaging.",
  ],
  bold: "Your brand stays in front. We do not sell a competing SHINHO GLOBAL retail range in your market.",
};
