import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V10Page from "@/components/concepts/v10/V10Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(7) };

// Concept V10: a planetary system of sample chips around a film roll — scroll in, spin, select a sample.
export default function V10() {
  return (
    <ConceptShell theme={THEMES.orbit}>
      <V10Page />
    </ConceptShell>
  );
}
