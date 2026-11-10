"use client";

import { forwardRef, useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

// End cap of a wound roll: fine concentric layers around a cardboard core.
let capCache = null;
function capTexture() {
  if (capCache) return capCache;
  const S = 512, c = document.createElement("canvas"); c.width = c.height = S;
  const x = c.getContext("2d"), m = S / 2;
  x.fillStyle = "#d9d3c7"; x.beginPath(); x.arc(m, m, m, 0, Math.PI * 2); x.fill();
  for (let r = m; r > m * 0.36; r -= 2.2) { // wound layers
    x.strokeStyle = `rgba(60,52,40,${0.08 + ((r * 7) % 5) * 0.025})`; x.lineWidth = 1;
    x.beginPath(); x.arc(m, m, r, 0, Math.PI * 2); x.stroke();
  }
  x.fillStyle = "#a07f55"; x.beginPath(); x.arc(m, m, m * 0.36, 0, Math.PI * 2); x.fill();   // cardboard core
  x.fillStyle = "#6f5536"; x.beginPath(); x.arc(m, m, m * 0.3, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#1a1612"; x.beginPath(); x.arc(m, m, m * 0.26, 0, Math.PI * 2); x.fill();   // hollow centre
  capCache = new CanvasTexture(c); capCache.colorSpace = SRGBColorSpace;
  return capCache;
}

// A roll of film. `map` wraps the surface; the axis runs along X.
// `lite`: fewer segments + standard material, for scenes with many rolls.
export const Roll = forwardRef(function Roll({ map, radius = 0.5, length = 1.6, metal = 0.1, lite = false, emissive = "#000000", children, ...props }, ref) {
  const cap = useMemo(() => capTexture(), []);
  return (
    <group ref={ref} {...props}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, length, lite ? 32 : 64, 1]} />
        {lite
          ? <meshStandardMaterial attach="material-0" map={map} roughness={0.35} metalness={metal} emissive={emissive} />
          : <meshPhysicalMaterial attach="material-0" map={map} roughness={0.32} metalness={metal} clearcoat={1} clearcoatRoughness={0.12} emissive={emissive} />}
        <meshStandardMaterial attach="material-1" map={cap} roughness={0.8} />
        <meshStandardMaterial attach="material-2" map={cap} roughness={0.8} />
      </mesh>
      {children}
    </group>
  );
});
