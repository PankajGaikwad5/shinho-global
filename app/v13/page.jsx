import ConceptShell from "@/components/concepts/shared/ConceptShell";
import V16Page from "@/components/concepts/v16/V16Page";
import { THEMES } from "@/lib/themes";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(13) };

// Concept V16: the whole homepage as a scroll story — a surface taken apart layer by layer, then multiplied into the collection.
export default function V16() {
  return (
    <ConceptShell theme={THEMES.fan}>
      <V16Page />
    </ConceptShell>
  );
}
