"use client";

import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

/**
 * HTML labels/hotspots for 3D scenes WITHOUT drei <Html>.
 * drei <Html> creates a separate React root per label; on React 19 those roots get unmounted mid-render
 * ("Attempted to synchronously unmount a root…", "removeChild … not a child"). Instead:
 *   - put an <Anchor index={i} position={…} onFrame={onFrame} /> in the scene (inside any moving group);
 *   - render ordinary elements in the page over the canvas, positioned by useAnchorOverlay().
 */
const v = new Vector3();

export default function Anchor({ index, position = [0, 0, 0], onFrame }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.getWorldPosition(v);
    v.project(state.camera);
    const on = v.z < 1 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.15;
    onFrame(index, (v.x * 0.5 + 0.5) * state.size.width, (-v.y * 0.5 + 0.5) * state.size.height, on);
  });
  return <group ref={ref} position={position} />;
}

// Page side: refs for the overlay elements + the per-frame positioner to pass to <Anchor onFrame>.
export function useAnchorOverlay() {
  const els = useRef([]);
  const onFrame = useCallback((i, x, y, on) => {
    const el = els.current[i];
    if (!el) return;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
    el.style.visibility = on ? "visible" : "hidden";
  }, []);
  const setEl = useCallback((i) => (el) => { els.current[i] = el; }, []);
  return { onFrame, setEl };
}
