/* eslint-disable @next/next/no-img-element -- small static logo; next/image adds nothing here */

/**
 * The SHINHO GLOBAL logo from /public (the client's artwork, 832×248 PNG).
 * tone="dark"  → original artwork (near-black + gold) for light grounds: /logo.png
 * tone="light" → reversed copy (ivory + gold) for dark grounds: /logo-light.png, generated from logo.png
 *                (cool near-black → #F4F1EA, warm gold kept and lifted slightly).
 * The old /logo.svg and /logo-light.svg were rough pixel traces — do not use them.
 * Replace both PNGs with a vector from the client when one is available.
 */
export default function Logo({ tone = "light", height = 34, className = "" }) {
  return (
    <img src={tone === "dark" ? "/logo.png" : "/logo-light.png"} alt="SHINHO GLOBAL"
      width={Math.round(height * 832 / 248)} height={height} className={`block h-auto ${className}`} style={{ height, width: "auto" }} />
  );
}
