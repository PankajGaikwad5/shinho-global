"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { VERSIONS } from "@/lib/versions";

/**
 * Concept picker: one compact button showing the current version; opens a panel listing every version.
 * Uses plain <a> links (full page loads) so each 3D page releases its GPU memory cleanly — kinder to slower
 * machines and avoids R3F unmount races during client-side navigation.
 * Fixed neutral colours so it reads on light and dark concepts alike.
 */
export default function VersionSwitcher() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const cur = VERSIONS.find((v) => v.href === path || (v.n === 1 && path === "/v1")) ?? VERSIONS[0];
  const idx = VERSIONS.indexOf(cur);
  const prev = VERSIONS[(idx - 1 + VERSIONS.length) % VERSIONS.length], next = VERSIONS[(idx + 1) % VERSIONS.length];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-[100] font-display text-[#f2efe8]">
      <AnimatePresence>
        {open && (
          <motion.div key="panel" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }}
            data-lenis-prevent
            className="absolute right-0 bottom-[calc(100%+10px)] w-[min(760px,calc(100vw-32px))] overflow-y-auto rounded-[18px] border border-white/12 bg-[#101012]/92 p-3 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-xl [max-height:min(70vh,560px)]">
            <div className="flex items-baseline justify-between px-3 pt-2 pb-3">
              <span className="text-[12px] tracking-[.2em] text-[#c2a466] uppercase">Homepage concepts</span>
              <span className="text-[12px] text-white/45">{VERSIONS.length} versions</span>
            </div>
            <ul className="grid list-none grid-cols-1 gap-1 sm:grid-cols-2">
              {VERSIONS.map((v) => (
                <li key={v.n}>
                  <a href={v.href} onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-3 rounded-[12px] px-3 py-2.5 transition-colors ${v === cur ? "bg-white/10" : "hover:bg-white/6"}`}>
                    <span className={`w-9 shrink-0 text-[13px] tabular-nums ${v === cur ? "text-[#c2a466]" : "text-white/45"}`}>V{v.n}</span>
                    <span className="flex min-w-0 flex-col">
                      <span className="text-[15px] font-medium text-white hover:text-white">{v.name}</span>
                      <span className="truncate text-[12px] text-white/50">{v.idea}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-[#101012]/80 p-1 shadow-[0_10px_30px_rgba(0,0,0,.35)] backdrop-blur-md">
        <a href={prev.href} aria-label={`Previous: V${prev.n} ${prev.name}`} className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">←</a>
        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Choose a homepage concept"
          className="flex h-9 items-center gap-3 rounded-full bg-white/8 px-4 text-[13px] whitespace-nowrap hover:bg-white/14">
          <span className="text-[#c2a466] tabular-nums">V{cur.n}</span>
          <span className="font-medium">{cur.name}</span>
          <span className={`text-white/60 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true">▴</span>
        </button>
        <a href={next.href} aria-label={`Next: V${next.n} ${next.name}`} className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white">→</a>
      </div>
    </div>
  );
}
