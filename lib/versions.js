// The concept versions shown to the client, in order. The site opens on V1 ("/").
// `code` = the component folder in components/concepts/ (folders kept their original working numbers).
// The exact design port lives at /original and is intentionally NOT listed.
export const VERSIONS = [
  { n: 1, href: "/", name: "Cinematic Classic", idea: "The original layout, made cinematic", code: "v1" },
  { n: 2, href: "/v2", name: "Documentary", idea: "A film in chapters", code: "v2" },
  { n: 3, href: "/v3", name: "Material Room", idea: "Walk a WebGL gallery", code: "v3" },
  { n: 4, href: "/v4", name: "Moodboard", idea: "Endless draggable board · light/dark", code: "v6" },
  { n: 5, href: "/v5", name: "Diorama", idea: "Miniature partner facility", code: "v7" },
  { n: 6, href: "/v6", name: "Facility", idea: "Realistic factory hall", code: "v9" },
  { n: 7, href: "/v7", name: "Sample Orbit", idea: "Chip rings around a film-roll planet", code: "v10" },
  { n: 8, href: "/v8", name: "Roll Tunnel", idea: "Travel through rolls of film", code: "v11" },
  { n: 9, href: "/v9", name: "Swatch Helix", idea: "Descend a helix of samples", code: "v12" },
  { n: 10, href: "/v10", name: "Fan Deck", idea: "A giant 3D sample fan", code: "v13" },
  { n: 11, href: "/v11", name: "Raw to Roll", idea: "Scroll story: polymer to product", code: "v14" },
  { n: 12, href: "/v12", name: "Showroom Walk", idea: "Scroll story: rooms of finishes", code: "v15" },
  { n: 13, href: "/v13", name: "Layers", idea: "Scroll story: a surface, taken apart", code: "v16" },
];

export const titleFor = (n) => { const v = VERSIONS.find((x) => x.n === n); return `Shinho Global — V${v.n} ${v.name}`; };
