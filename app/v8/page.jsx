import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V11Page from "@/components/concepts/v11/V11Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(8) };

// Concept V11: travel through a tunnel of film rolls; click a roll and it unrolls into a full-bleed finish.
export default function V11() {
  return (
    <ConceptShell theme={THEMES.tunnel}>
      <V11Page />
    </ConceptShell>
  );
}
