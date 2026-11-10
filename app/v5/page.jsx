import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V7Page from "@/components/concepts/v7/V7Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(5) };

// Concept V7: an explorable 3D miniature of a partner facility, with footage for each station.
export default function V7() {
  return (
    <ConceptShell theme={THEMES.espresso}>
      <V7Page />
    </ConceptShell>
  );
}
