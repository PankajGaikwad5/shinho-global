"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";

// Keeps the scene's horizontal framing on narrower screens (tablet, squarer laptop windows):
// scenes are composed for ~16:10; below that aspect the vertical FOV widens so nothing is cropped at the sides.
const DESIGN_ASPECT = 1.6;
function FovFit() {
  const base = useRef(null), last = useRef(0);
  useFrame(({ camera, size }) => {
    if (!camera.isPerspectiveCamera) return;
    if (base.current == null) base.current = camera.fov;
    const aspect = size.width / size.height;
    if (aspect === last.current) return;
    last.current = aspect;
    const t = Math.tan((base.current * Math.PI) / 360) * Math.max(1, DESIGN_ASPECT / aspect);
    camera.fov = Math.min(85, (Math.atan(t) * 360) / Math.PI);
    camera.updateProjectionMatrix();
  });
  return null;
}

// A Canvas that only renders while on screen (keeps slower machines responsive).
export default function LazyCanvas({ children, className = "", style, ...props }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "150px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      <Canvas frameloop={on ? "always" : "never"} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }} {...props}>
        <FovFit />
        {children}
      </Canvas>
    </div>
  );
}

// Soft studio reflections built from local light shapes (no HDR download).
export function Studio({ warm = "#c2a274", intensity = 1 }) {
  return (
    <Environment resolution={128}>
      <Lightformer intensity={2.2 * intensity} position={[0, 5, -3]} scale={[10, 3, 1]} />
      <Lightformer intensity={1.4 * intensity} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
      <Lightformer intensity={1 * intensity} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
      <Lightformer form="ring" color={warm} intensity={3 * intensity} position={[3, 3, 4]} scale={2} />
    </Environment>
  );
}
