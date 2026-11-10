import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V9Page from "@/components/concepts/v9/V9Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(6) };

// Concept V9: the detailed, realistic version of V7 — a lit cutaway of an illustrative partner facility.
export default function V9() {
  return (
    <ConceptShell theme={THEMES.espresso}>
      <V9Page />
    </ConceptShell>
  );
}
