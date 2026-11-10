import V1, { metadata as v1Meta } from "./v1/page";

// The site opens on V1 (Cinematic Classic). The exact design port is kept at /original (unlisted).
export const metadata = { ...v1Meta, title: "Shinho Global" };

export default function Home() {
  return <V1 />;
}
