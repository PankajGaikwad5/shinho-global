/* eslint-disable @next/next/no-img-element -- small static SVG logo; next/image adds nothing here */

/**
 * The SHINHO GLOBAL logo from /public.
 * tone="dark"  → original artwork (near-black + gold) for light grounds: /logo.svg
 * tone="light" → reversed copy (ivory + gold) for dark grounds: /logo-light.svg
 */
export default function Logo({ tone = "light", height = 34, className = "" }) {
  return (
    <img src={tone === "dark" ? "/logo.svg" : "/logo-light.svg"} alt="SHINHO GLOBAL"
      width={Math.round(height * 2.24)} height={height} className={`block h-auto ${className}`} style={{ height, width: "auto" }} />
  );
}
