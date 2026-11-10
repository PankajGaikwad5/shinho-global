"use client";

import { Bloom, DepthOfField, EffectComposer, Noise, SMAA, Vignette } from "@react-three/postprocessing";

/**
 * Cinematic finish for the 3D scenes: bloom on bright/gold elements, optional depth of field,
 * vignette, fine grain, anti-aliasing.
 * NOTE: N8AO (ambient occlusion) crashes with this three.js version ("reading 'length'") — don't add it back;
 * ground objects with ContactShadows / shadow catchers instead.
 */
export default function Finish({ bloom = 0.7, threshold = 0.82, dof = null, vignette = 0.55, grain = 0.035 }) {
  const fx = [<Bloom key="bloom" mipmapBlur intensity={bloom} luminanceThreshold={threshold} luminanceSmoothing={0.25} />];
  if (dof) fx.push(<DepthOfField key="dof" target={dof.target} focalLength={dof.focalLength ?? 0.02} bokehScale={dof.bokeh ?? 3} height={480} />);
  fx.push(<Vignette key="vig" offset={0.22} darkness={vignette} />);
  fx.push(<Noise key="grain" premultiply opacity={grain} />);
  fx.push(<SMAA key="aa" />);
  return <EffectComposer multisampling={0}>{fx}</EffectComposer>;
}
