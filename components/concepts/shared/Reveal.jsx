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
export function Lines({ lines, className = "", delay = 0, as = "h2" }) {
  const Tag = as;
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[.08em]">
          <motion.span className="block" initial={{ y: "110%" }} whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-5% 0px" }} transition={{ duration: 1.2, ease: EASE, delay: delay + i * 0.09 }}>
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
