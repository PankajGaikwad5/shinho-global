import { shaderMaterial } from "@react-three/drei";
import { Color, Vector2 } from "three";

// Image/video surface with "cover" fitting, a hover ripple (vertex + UV), slight RGB split
// and a depth fade into the room's background colour (stands in for fog).
export const PanelMaterial = shaderMaterial(
  {
    uTex: null,
    uHover: 0,
    uTime: 0,
    uMouse: new Vector2(0.5, 0.5),
    uImgAspect: 1,
    uPlaneAspect: 1,
    uBg: new Color("#0b0b0c"),
    uFogNear: 7,
    uFogFar: 24,
  },
  /* glsl */ `
    uniform float uHover, uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vDepth;
    void main() {
      vUv = uv;
      vec3 p = position;
      float d = distance(uv, uMouse);
      p.z += sin(d * 18.0 - uTime * 4.0) * 0.05 * uHover * smoothstep(0.6, 0.0, d);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      vDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  /* glsl */ `
    uniform sampler2D uTex;
    uniform float uHover, uTime, uImgAspect, uPlaneAspect, uFogNear, uFogFar;
    uniform vec2 uMouse;
    uniform vec3 uBg;
    varying vec2 vUv;
    varying float vDepth;
    void main() {
      vec2 s = uPlaneAspect > uImgAspect ? vec2(1.0, uImgAspect / uPlaneAspect) : vec2(uPlaneAspect / uImgAspect, 1.0);
      vec2 uv = (vUv - 0.5) * s + 0.5;
      float d = distance(vUv, uMouse);
      vec2 dir = normalize(vUv - uMouse + 1e-5);
      uv += dir * sin(d * 22.0 - uTime * 5.0) * 0.012 * uHover * smoothstep(0.5, 0.0, d);
      uv = (uv - 0.5) * (1.0 - 0.06 * uHover) + 0.5;
      float sh = 0.006 * uHover;
      vec3 c = vec3(texture2D(uTex, uv + vec2(sh, 0.0)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(sh, 0.0)).b);
      c *= mix(0.8, 1.06, uHover);
      c = mix(c, uBg, smoothstep(uFogNear, uFogFar, vDepth));
      gl_FragColor = vec4(c, 1.0);
      #include <colorspace_fragment>
    }
  `
);
