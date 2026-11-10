import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V14Page from "@/components/concepts/v14/V14Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(11) };

// Concept V14: the whole homepage as one scroll-driven 3D story — a film's journey from polymer to applied surface.
export default function V14() {
  return (
    <ConceptShell theme={THEMES.onyx}>
      <V14Page />
    </ConceptShell>
  );
}
