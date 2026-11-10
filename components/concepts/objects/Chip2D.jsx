/**
 * A sample chip in HTML/CSS — the same object as the 3D chip, for the page sections
 * (photo face, punched hole, ivory label band with name and code).
 */
export default function Chip2D({ img, name, code, className = "", style }) {
  return (
    <div className={`relative flex aspect-[1/1.4] flex-col overflow-hidden rounded-[9px] bg-[#f3efe7] shadow-[0_1px_0_rgba(255,255,255,.35)_inset,0_18px_40px_-12px_rgba(0,0,0,.55)] ${className}`} style={style}>
      <div className="relative flex-[0.8] bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}>
        <span aria-hidden="true" className="absolute top-[7%] left-1/2 aspect-square w-[9%] -translate-x-1/2 rounded-full bg-[var(--chip-hole,#0b0b0c)] shadow-[inset_0_1px_2px_rgba(0,0,0,.6)]" />
      </div>
      <div className="flex flex-[0.2] flex-col justify-center gap-[2px] border-t-2 border-[#b99a5b] px-[9%] text-[#111318]">
        <span className="truncate text-[clamp(9px,1vw,13px)] leading-tight font-medium">{name}</span>
        {code && <span className="font-mono text-[clamp(8px,.8vw,10px)] text-[#8a6d3b]">{code}</span>}
      </div>
    </div>
  );
}
