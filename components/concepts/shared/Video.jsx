"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic background video that is kind to slower machines:
 * - no network until it is near the viewport (src is attached lazily)
 * - pauses when off screen, or when `active` is false (e.g. hidden slides)
 * - reduced-motion users just get the poster frame
 */
export default function Video({ media, active = true, className = "", style }) {
  const ref = useRef(null);
  const visible = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        sync(v, media.src, visible.current && v.dataset.active === "1");
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [media.src]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.dataset.active = active ? "1" : "0";
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) sync(v, media.src, visible.current && active);
  }, [active, media.src]);

  return (
    <video
      ref={ref}
      poster={media.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={`h-full w-full object-cover ${className}`}
      style={style}
    />
  );
}

function sync(v, src, shouldPlay) {
  if (shouldPlay) {
    if (!v.getAttribute("src")) v.src = src;
    v.play().catch(() => {});
  } else if (!v.paused) {
    v.pause();
  }
}
