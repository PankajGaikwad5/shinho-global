"use client";

import { useEffect, useMemo } from "react";
import { SRGBColorSpace, VideoTexture } from "three";

/**
 * Video textures for 3D scenes, kind to slower machines:
 * a clip downloads only the first time it is played, and only the indices in `playing` run.
 * Use inside <Canvas> children (client-only).
 */
export function useVideoTextures(medias, playing = []) {
  const items = useMemo(() => medias.map((m) => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = "none";
    v.poster = m.poster;
    const t = new VideoTexture(v);
    t.colorSpace = SRGBColorSpace;
    return { video: v, texture: t, src: m.src };
  }), [medias]);

  const key = playing.join(",");
  useEffect(() => {
    const on = new Set(key ? key.split(",").map(Number) : []);
    items.forEach((it, i) => {
      if (on.has(i)) {
        if (!it.video.getAttribute("src")) it.video.src = it.src;
        it.video.play().catch(() => {});
      } else if (!it.video.paused) it.video.pause();
    });
  }, [items, key]);

  useEffect(() => () => items.forEach((it) => {
    it.video.pause(); it.video.removeAttribute("src"); it.video.load(); it.texture.dispose();
  }), [items]);

  return items.map((it) => it.texture);
}

// Aspect ratio of an image or video texture (falls back to 16:9 before metadata arrives).
export const texAspect = (t) => {
  const i = t?.image;
  if (!i) return 16 / 9;
  const w = i.videoWidth || i.width, h = i.videoHeight || i.height;
  return w && h ? w / h : 16 / 9;
};
