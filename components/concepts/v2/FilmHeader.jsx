const DEFAULT_LINKS = [["#chapters", "The making"], ["#lab", "Material lab"]];

export default function FilmHeader({ links = DEFAULT_LINKS }) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-[clamp(20px,4vw,56px)] py-6 text-white mix-blend-difference">
      <a href="#top" className="pointer-events-auto flex flex-col gap-[5px] hover:text-white">
        <span className="text-[15px] font-semibold [font-stretch:125%] tracking-[.34em]">SHINHO</span>
        <span className="font-mono text-[9px] tracking-[.62em]">GLOBAL</span>
      </a>
      <nav className="pointer-events-auto flex items-center gap-8 font-mono text-[11px] uppercase tracking-[.14em]">
        {links.map(([href, label]) => <a key={href} href={href} className="hidden sm:inline">{label}</a>)}
        <a href="#contact">Enquire</a>
      </nav>
    </header>
  );
}
