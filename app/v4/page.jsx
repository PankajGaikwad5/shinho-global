import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V6Page from "@/components/concepts/v6/V6Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(4) };

// Concept V6: an endless, draggable 3D moodboard of products, footage, brand photography and type.
export default function V6() {
  return (
    <ConceptShell theme={THEMES.gallery}>
      <V6Page />
    </ConceptShell>
  );
}
