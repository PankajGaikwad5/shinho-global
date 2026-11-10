import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V13Page from "@/components/concepts/v13/V13Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(10) };

// Concept V13: a giant 3D sample fan deck — scroll to fan it open, leaf through, pull a blade.
export default function V13() {
  return (
    <ConceptShell theme={THEMES.fan}>
      <V13Page />
    </ConceptShell>
  );
}
