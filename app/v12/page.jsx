import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V15Page from "@/components/concepts/v15/V15Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(12) };

// Concept V15: the whole homepage as a scroll walk through a showroom built from the films.
export default function V15() {
  return (
    <ConceptShell theme={THEMES.travertine}>
      <V15Page />
    </ConceptShell>
  );
}
