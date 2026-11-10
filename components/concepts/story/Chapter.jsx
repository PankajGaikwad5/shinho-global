"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * One chapter of a scroll story: `len` screens tall; its copy is pinned and fades in as the chapter
 * arrives and out as it leaves. Sits over the fixed canvas (pointer-events only on interactive children).
 * align: "left" | "right" | "center" | "bottom-left".
 */
export default function Chapter({ len = 1.4, align = "left", first = false, id, children, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = 1 / (len + 1), b = len / (len + 1);
  const opacity = useTransform(scrollYProgress, first ? [0, b - 0.04, b + 0.06] : [a - 0.1, a + 0.02, b - 0.04, b + 0.06], first ? [1, 1, 0] : [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, first ? [0, b + 0.06] : [a - 0.1, a + 0.02, b - 0.04, b + 0.06], first ? [0, -30] : [30, 0, 0, -30]);
  const place = {
    left: "items-center justify-start text-left",
    right: "items-center justify-end text-left",
    center: "items-center justify-center text-center",
    "bottom-left": "items-end justify-start text-left pb-[clamp(56px,10vh,110px)]",
  }[align];
  return (
    <section ref={ref} id={id} className="pointer-events-none relative z-10" style={{ height: `${len * 100}vh` }}>
      <div className={`sticky top-0 flex h-screen px-[clamp(20px,5vw,80px)] ${place}`}>
        <motion.div style={{ opacity, y }} className={`max-w-[560px] ${className}`}>{children}</motion.div>
      </div>
    </section>
  );
}
