"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Pointer-drag tracking for a 3D object, attached to its own canvas.
 * Call `take()` once per frame to get the movement since the last frame ({ dx, dy, down }).
 * (Kept inside the scene component so nothing mutates props — the React Compiler lint requires that.)
 */
export function useCanvasDrag() {
  const st = useRef({ down: false, x: 0, y: 0, dx: 0, dy: 0 });
  const el = useThree((s) => s.gl.domElement);

  useEffect(() => {
    const s = st.current;
    const down = (e) => { s.down = true; s.x = e.clientX; s.y = e.clientY; };
    const move = (e) => {
      if (!s.down) return;
      s.dx += e.clientX - s.x; s.dy += e.clientY - s.y;
      s.x = e.clientX; s.y = e.clientY;
    };
    const up = () => { s.down = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [el]);

  return useMemo(() => ({
    take() {
      const s = st.current, out = { dx: s.dx, dy: s.dy, down: s.down };
      s.dx = 0; s.dy = 0;
      return out;
    },
  }), []);
}
