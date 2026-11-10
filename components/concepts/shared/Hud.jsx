import Logo from "./Logo";

// Minimal heads-up bar for the 3D homepages: logo, three links, one action. Stays out of the experience's way.
// `tone`: "light" logo for dark grounds (default), "dark" for the light gallery scheme.
// `children` render before the Enquire button (e.g. a theme toggle).
export default function Hud({ tone = "light", children }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-center justify-between bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-ink)_70%,transparent),transparent)] px-[clamp(20px,4vw,56px)] pt-5 pb-8 text-bone">
      <a href="#top" className="pointer-events-auto hover:text-bone"><Logo tone={tone} height={34} /></a>
      <nav className="pointer-events-auto flex items-center gap-7 font-mono text-[11px] uppercase tracking-[.14em]">
        <a href="#about" className="hidden hover:text-brass sm:inline">About</a>
        <a href="#materials" className="hidden hover:text-brass sm:inline">Materials</a>
        {children}
        <a href="#contact" className="rounded-full bg-brass px-4 py-2 text-ink hover:bg-bone hover:text-ink">Enquire</a>
      </nav>
    </header>
  );
}
