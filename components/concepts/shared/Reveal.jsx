"use client";

import { motion } from "motion/react";

const EASE = [0.6, 0, 0.2, 1];

// Fade/rise in once when scrolled into view.
export function Reveal({ children, delay = 0, y = 40, className = "", as = "div" }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 1.1, ease: EASE, delay }}>
      {children}
    </M>
  );
}

// Masked line-by-line headline reveal (each line slides up from behind a mask).
//
// The mask element carries whileInView, NOT the line inside it. IntersectionObserver clips an element
// against its ancestors' overflow, and the line starts translated 110% down inside an overflow-hidden
// mask — so observing the line itself reports "not intersecting" forever, the animation never starts and
// the heading stays hidden behind the mask. That is the blank heading space the client reported in
// Manufacturing, OEM and Contact. The mask is never translated, so observing it is safe.
export function Lines({ lines, className = "", delay = 0, as = "h2" }) {
  const Tag = as;
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <motion.span key={i} className="block overflow-hidden pb-[.08em]"
          initial="out" whileInView="in" viewport={{ once: true, margin: "-5% 0px" }}>
          <motion.span className="block" variants={{ out: { y: "110%" }, in: { y: "0%" } }}
            transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.09 }}>
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
