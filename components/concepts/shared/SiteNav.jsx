"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MONO } from "@/components/fonts";
import Logo from "./Logo";

// Shared nav for the real site pages (cast films, OEM partnerships, architectural films).
// This IS V1's nav (components/concepts/v1/Nav.jsx): same bar, same difference blend, same full-screen
// overlay of numbered rows at V1's type scale, same gold sub-row. Only the items differ — they follow the
// client's 15 Nov main menu. Nothing else is added: no page eyebrow, no "on this page" panel, no pill
// buttons in the bar. Earlier versions had all three and the client's V1 look went with them.
const groundIsLight = (x, y, skip) => {
  for (const el of document.elementsFromPoint(x, y)) {
    if (skip.contains(el)) continue;
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor, m = c.match(/[\d.]+/g);
      if (!m || m.length < 3) continue;
      const k = c.startsWith('color(') ? 255 : 1, alpha = m[3] === undefined ? 1 : +m[3];
      if (alpha > .5) return (.2126 * m[0] * k + .7152 * m[1] * k + .0722 * m[2] * k) / 255 > .55;
    }
    return false;
  }
  return false;
};

// The client's main menu (15 Nov brief, point 4). Materials carries the five sub-items.
// A page that does not exist yet is rendered unlinked and dimmed rather than as a placeholder "#".
// `base` prefixes every in-site link, so the /changes copy of the site links within itself.
const menuFor = (base) => [
  { n: "01", label: "Materials", href: null, sub: [
    ["Architectural Interior Films & Top Layers", `${base}/materials/architectural-films`],
    ["Furniture Foils", null],
    ["Cast Films for Signage, Printing & Protection", `${base}/cast-films`],
    ["Specialist Flooring", null],
    ["Custom Finishes", null],
  ] },
  { n: "02", label: "OEM Partnerships", href: `${base}/oem-partnerships` },
  // Manufacturing & Quality and Catalogue exist only in the /changes version of the site; on the frozen
  // site they stay unlinked rather than pointing at a route that does not exist.
  { n: "03", label: "Manufacturing & Quality", href: base ? `${base}/manufacturing-quality` : null },
  { n: "04", label: "Catalogue", href: base ? `${base}/catalogue` : null },
  { n: "05", label: "About", href: `${base || "/"}#about` },
];

// V1's own row styles, value for value.
const HAIR = "1px solid rgba(242,239,233,.12)";
// The menu has five items plus Materials' five children, where V1 has six rows in all. On a short window
// that cannot fit at a fixed size, and it was scrolling under the logo. Every size is V1's, capped against
// the viewport height: on a normal screen these resolve to V1's exact values, on a short one they shrink
// instead of overflowing.
const ROW = { display: "flex", alignItems: "baseline", gap: "28px", borderTop: HAIR, padding: "min(14px,1.5vh) 0" };
const NUM = { fontFamily: MONO, fontSize: "11px", color: "#8d8982" };
const LABEL = { fontSize: "min(clamp(34px,5.5vw,76px),8vh)", fontWeight: "500", fontStretch: "118%", letterSpacing: "-.02em", lineHeight: "1" };
// Five sub-items at V1 sub-row size would double the height of the menu and push it off the screen.
// They stay secondary: one indented block, no hairline of their own, so the five main rows still read
// at V1's scale and the whole menu fits a screen without scrolling.
const SUB_LIST = { display: "flex", flexDirection: "column", padding: "2px 0 min(16px,1.6vh) clamp(28px,6vw,86px)" };
const SUB_LABEL = { fontSize: "min(clamp(15px,1.5vw,19px),2.2vh)", fontWeight: "400", fontStretch: "108%", lineHeight: "1.5", padding: "min(5px,.6vh) 0" };

export default function SiteNav({ current, base = "" }) {
  const MENU = menuFor(base);
  // The sample request has its own page in the /changes site. On the frozen site there is no such route,
  // so it stays the in-page anchor it was (which only the cast-film page actually carries).
  const samplesHref = base ? `${base}/request-samples` : "#samples";
  const [menu, setMenu] = useState(false);
  const [lightGround, setLightGround] = useState(false);
  const logoRef = useRef(null);
  const toggleMenu = () => setMenu(!menu), closeMenu = () => setMenu(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const a = logoRef.current; if (!a) return;
      const r = a.getBoundingClientRect();
      setLightGround(groundIsLight(r.left + r.width / 2, r.top + r.height / 2, a));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    queue();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, []);
  const tone = !menu && lightGround ? 'dark' : 'light';

  return (
    <>
      <nav style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "70", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px clamp(20px,4vw,56px)", color: "#fff", mixBlendMode: "difference", pointerEvents: "none" }}>
        <span aria-hidden="true" style={{ width: "1px", height: "40px" }}></span>
        <div style={{ display: "flex", alignItems: "center", gap: "32px", pointerEvents: "auto" }}>
          {/* V1 carries one mono link here. On the real pages it is the sample request the client asked for. */}
          {/* Hidden on phones, where it crowds the logo. The menu's own Request Samples row covers it. */}
          <a href={samplesHref} onClick={closeMenu} className="hidden sm:inline" style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>Request samples</a>
          <button onClick={toggleMenu} style={{ background: "none", border: "0", padding: "8px 0", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", fontFamily: MONO, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#fff" }}>{menu ? 'Close' : 'Menu'}
            {/* The two rules cross over when the menu is open. The lines sit 6px apart (1px rule + 5px
                gap), so each travels 3px to meet in the middle before rotating. */}
            <span style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ display: "block", width: "22px", height: "1px", background: "#fff", transition: "transform .35s cubic-bezier(.6,0,.2,1)", transform: menu ? "translateY(3px) rotate(45deg)" : "none" }}></span>
              <span style={{ display: "block", width: "22px", height: "1px", background: "#fff", transition: "transform .35s cubic-bezier(.6,0,.2,1)", transform: menu ? "translateY(-3px) rotate(-45deg)" : "none" }}></span>
            </span></button>
        </div>
      </nav>

      <Link ref={logoRef} href={base || "/"} aria-label="SHINHO GLOBAL — home" style={{ position: "fixed", top: "24px", left: "clamp(20px,4vw,56px)", zIndex: "71", display: "block" }}>
        <Logo tone={tone} height={34} />
      </Link>

      {/* The menu list is longer than V1's six rows, so the overlay scrolls on short screens rather than
          running the type down a size. The type scale is V1's. */}
      <div style={{ position: "fixed", inset: "0", zIndex: "60", background: "#0b0b0c", color: "#f2efe9", opacity: menu ? 1 : 0, pointerEvents: menu ? 'auto' : 'none', transition: "opacity .6s ease", display: "flex", flexDirection: "column", justifyContent: "center", padding: "max(80px,9vh) clamp(20px,6vw,96px) max(32px,4vh)", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {MENU.map(({ n, label, href, sub }, i) => (
            <div key={label} style={{ display: "contents" }}>
              {href
                ? <a href={href} onClick={closeMenu} style={ROW}><span style={NUM}>{n}</span><span style={LABEL}>{label}</span></a>
                : <span style={{ ...ROW, color: sub ? "#f2efe9" : "#5f5c57" }}><span style={NUM}>{n}</span><span style={LABEL}>{label}</span></span>}
              {sub && (
                <div style={SUB_LIST}>
                  {sub.map(([name, h]) => {
                    // The page you are on: gold, unlinked — as V1 marks a current item. Unbuilt page: dimmed.
                    const tint = h === current ? "#c2a274" : h ? "#f2efe9" : "#5f5c57";
                    return h && h !== current
                      ? <a key={name} href={h} onClick={closeMenu} style={{ ...SUB_LABEL, color: tint }}>{name}</a>
                      : <span key={name} style={{ ...SUB_LABEL, color: tint }}>{name}</span>;
                  })}
                </div>
              )}
            </div>
          ))}
          {/* The client's "clear Request Samples button" (point 4), and the only one on a phone, where
              the bar's version is hidden. */}
          <a href={samplesHref} onClick={closeMenu} style={{ ...ROW, borderBottom: HAIR }}>
            <span style={NUM}>06</span><span style={{ ...LABEL, color: "#c2a274" }}>Request Samples</span>
          </a>
        </div>
      </div>
    </>
  );
}
