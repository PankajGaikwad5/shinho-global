// Colour schemes for the 3D homepage concepts (V4–V8), all derived from the SHINHO GLOBAL logo:
// near-black #111318 lettering + gold #B99A5B (the N), on white. Each scheme varies only the ground,
// and overrides the Tailwind colour tokens (--color-ink, --color-bone, --color-brass…) on the concept root.
export const LOGO = {
  black: "#111318",   // from public/logo.svg
  gold: "#B99A5B",    // from public/logo.svg
  goldGradient: "linear-gradient(135deg,#8f7240 0%,#d6bb84 50%,#a3854c 100%)",
};

export const THEMES = {
  onyx: { // V4 Portals — near-black ground, gold
    "--color-ink": "#0c0c0d", "--color-char": "#18181a", "--color-bone": "#f4f1ea", "--color-sand": "#e9e4da",
    "--color-brass": "#c2a466", "--color-stone": "#8f8b84", "--color-ash": "#a6a29a",
    "--color-mist": "#bdb8af", "--color-fog": "#d1ccc3", "--color-dusk": "#76726b",
  },
  charcoal: { // V5 Particles — softer charcoal, champagne gold
    "--color-ink": "#161719", "--color-char": "#202124", "--color-bone": "#f3efe7", "--color-sand": "#e7e1d6",
    "--color-brass": "#c7aa6c", "--color-stone": "#938f88", "--color-ash": "#aaa59d",
    "--color-mist": "#c0bab1", "--color-fog": "#d4cfc6", "--color-dusk": "#7b7770",
  },
  gallery: { // V6 Moodboard — the logo as printed: white ground, black type, gold
    "--color-ink": "#f6f3ee", "--color-char": "#ece7df", "--color-bone": "#111318", "--color-sand": "#e2dccf",
    "--color-brass": "#9a7c43", "--color-stone": "#6f6b65", "--color-ash": "#5f5b55",
    "--color-mist": "#55524d", "--color-fog": "#3f3d3a", "--color-dusk": "#8a857d",
  },
  galleryDark: { // V6 Moodboard, dark mode — black ground, ivory type, logo gold
    "--color-ink": "#0d0e10", "--color-char": "#16171a", "--color-bone": "#f4f1ea", "--color-sand": "#e9e4da",
    "--color-brass": "#c2a466", "--color-stone": "#8f8b84", "--color-ash": "#a6a29a",
    "--color-mist": "#bdb8af", "--color-fog": "#d1ccc3", "--color-dusk": "#76726b",
  },
  espresso: { // V7 Diorama — warm black, deep gold
    "--color-ink": "#110e0b", "--color-char": "#1c1814", "--color-bone": "#f2ece2", "--color-sand": "#e6ddcf",
    "--color-brass": "#bf9f61", "--color-stone": "#948a7e", "--color-ash": "#aa9f92",
    "--color-mist": "#c0b6a9", "--color-fog": "#d3cabe", "--color-dusk": "#7a7064",
  },
  graphite: { // V8 Liquid film — graphite, bright gold
    "--color-ink": "#1d1e20", "--color-char": "#26272a", "--color-bone": "#f2efe8", "--color-sand": "#e6e1d8",
    "--color-brass": "#c7aa6c", "--color-stone": "#94918b", "--color-ash": "#aba7a0",
    "--color-mist": "#c1bdb5", "--color-fog": "#d5d1ca", "--color-dusk": "#7c7973",
  },
  orbit: { // V10 Sample Orbit — deep space black, ivory, logo gold
    "--color-ink": "#060608", "--color-char": "#0e0e12", "--color-bone": "#efe8da", "--color-sand": "#e4dccb",
    "--color-brass": "#c2a466", "--color-stone": "#8c877e", "--color-ash": "#a7a196",
    "--color-mist": "#bdb6a9", "--color-fog": "#d2ccc0", "--color-dusk": "#736e66",
  },
  tunnel: { // V11 Roll Tunnel — warm black, ivory, bright logo gold
    "--color-ink": "#0b0907", "--color-char": "#15120e", "--color-bone": "#f3ede2", "--color-sand": "#e7dfd0",
    "--color-brass": "#c9a965", "--color-stone": "#928878", "--color-ash": "#aca393",
    "--color-mist": "#c3baa9", "--color-fog": "#d6cfc2", "--color-dusk": "#776e60",
  },
  helix: { // V12 Swatch Helix — gallery white, near-black type, deep logo gold
    "--color-ink": "#f2efe8", "--color-char": "#e8e3d9", "--color-bone": "#111318", "--color-sand": "#ddd6c8",
    "--color-brass": "#94753c", "--color-stone": "#6e6a63", "--color-ash": "#55524c",
    "--color-mist": "#4f4b46", "--color-fog": "#3c3a36", "--color-dusk": "#8a857c",
  },
  fan: { // V13 Fan Deck — graphite, ivory, logo gold
    "--color-ink": "#141416", "--color-char": "#1d1d20", "--color-bone": "#f1ece3", "--color-sand": "#e5dfd3",
    "--color-brass": "#c4a465", "--color-stone": "#918c84", "--color-ash": "#a9a49b",
    "--color-mist": "#bfb9b0", "--color-fog": "#d3cec5", "--color-dusk": "#79746d",
  },
  travertine: { // V15 Showroom Walk — warm travertine light, near-black type, deep logo gold
    "--color-ink": "#ece6dc", "--color-char": "#e2dacd", "--color-bone": "#1c1915", "--color-sand": "#d8cfbf",
    "--color-brass": "#94753c", "--color-stone": "#6f685d", "--color-ash": "#58524a",
    "--color-mist": "#4f4a43", "--color-fog": "#3d3934", "--color-dusk": "#8a8275",
  },
};
