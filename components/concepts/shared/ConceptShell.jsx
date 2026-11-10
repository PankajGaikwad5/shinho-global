"use client";

import { motion } from "motion/react";
import SmoothScroll from "./SmoothScroll";
import VersionSwitcher from "./VersionSwitcher";

// Wrapper for every concept page: smooth scroll, film grain, opening letterbox and a version switcher.
export default function ConceptShell({ children, smooth = true, letterbox = true, theme }) {
  return (
    <div className="concept font-display text-bone bg-ink" style={theme}>
      {smooth && <SmoothScroll />}
      {children}
      <div className="grain" aria-hidden="true" />
      {letterbox && (
        <>
          <motion.div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[95] h-[50vh] bg-ink"
            initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} style={{ transformOrigin: "top" }}
            transition={{ duration: 1.6, ease: [0.6, 0, 0.2, 1], delay: 0.25 }} />
          <motion.div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] h-[50vh] bg-ink"
            initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} style={{ transformOrigin: "bottom" }}
            transition={{ duration: 1.6, ease: [0.6, 0, 0.2, 1], delay: 0.25 }} />
        </>
      )}
      <VersionSwitcher />
    </div>
  );
}
