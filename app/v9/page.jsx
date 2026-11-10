import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V12Page from "@/components/concepts/v12/V12Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(9) };

// Concept V12: descend a double helix of sample chips — the light, architectural option.
export default function V12() {
  return (
    <ConceptShell theme={THEMES.helix}>
      <V12Page />
    </ConceptShell>
  );
}
