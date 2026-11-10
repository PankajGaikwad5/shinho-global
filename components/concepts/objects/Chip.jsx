"use client";

import { forwardRef, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { CanvasTexture, ExtrudeGeometry, Path, Shape, SRGBColorSpace } from "three";
import { U } from "@/lib/materials";

// A real-world sample chip: rounded corners, punched hole at the top, laminate face with a printed label band.
export const CHIP_W = 1, CHIP_H = 1.4;

let geoCache = null;
export function chipGeometry() {
  if (geoCache) return geoCache;
  const w = CHIP_W, h = CHIP_H, r = 0.07;
  const s = new Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const hole = new Path(); hole.absarc(0, h / 2 - 0.11, 0.045, 0, Math.PI * 2, true);
  s.holes.push(hole);
  const g = new ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 2, curveSegments: 18 });
  g.translate(0, 0, -0.01);
  // planar UVs across the face (0..1), so a texture maps once over the whole chip
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
  uv.needsUpdate = true;
  g.computeVertexNormals();
  geoCache = g;
  return g;
}

// Draw the chip face: finish photo (cover-fit) + ivory label band with code, name and brand.
function drawChip(img, m, aniso) {
  const W = 512, H = Math.round(512 * (CHIP_H / CHIP_W)), band = Math.round(H * 0.2);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d");
  const ph = H - band, ia = img.width / img.height, pa = W / ph;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ia > pa) { sw = img.height * pa; sx = (img.width - sw) / 2; } else { sh = img.width / pa; sy = (img.height - sh) / 2; }
  x.drawImage(img, sx, sy, sw, sh, 0, 0, W, ph);
  x.fillStyle = "#f3efe7"; x.fillRect(0, ph, W, band);
  x.fillStyle = "#b99a5b"; x.fillRect(0, ph, W, 3);
  x.fillStyle = "#111318"; x.font = "500 34px Archivo, sans-serif";
  x.fillText(m.name, 30, ph + band * 0.48);
  x.fillStyle = "#8a6d3b"; x.font = "500 22px 'IBM Plex Mono', monospace";
  x.fillText(m.code, 30, ph + band * 0.8);
  x.fillStyle = "#6b675f"; x.font = "600 15px Archivo, sans-serif";
  if ("letterSpacing" in x) x.letterSpacing = "4px";
  x.textAlign = "right"; x.fillText("SHINHO", W - 28, ph + band * 0.8);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = aniso;
  return t;
}

export function useChipTextures(mats) {
  const aniso = useThree((s) => Math.min(8, s.gl.capabilities.getMaxAnisotropy()));
  const base = useTexture(mats.map((m) => U(m.img, 640)));
  return useMemo(() => base.map((b, i) => drawChip(b.image, mats[i], aniso)), [base, mats, aniso]);
}

// The chip mesh: textured face (front and back caps) + ivory edges.
export const Chip = forwardRef(function Chip({ map, ...props }, ref) {
  return (
    <mesh ref={ref} geometry={chipGeometry()} castShadow {...props}>
      <meshPhysicalMaterial attach="material-0" map={map} roughness={0.38} clearcoat={0.7} clearcoatRoughness={0.18} />
      <meshStandardMaterial attach="material-1" color="#e6e1d7" roughness={0.6} />
    </mesh>
  );
});
