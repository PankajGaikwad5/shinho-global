import ConceptShell from "@/components/concepts/shared/ConceptShell";
import EnquirySection from "@/components/concepts/shared/EnquirySection";
import FilmHeader from "@/components/concepts/v2/FilmHeader";
import Showroom from "@/components/concepts/v3/Showroom";
import { VIDEO } from "@/lib/media";
import { FAMILIES } from "@/lib/brief";
import { titleFor } from "@/lib/versions";

export const metadata = { title: titleFor(3) };

// Concept V3: a WebGL material room you walk through by scrolling; panels ripple on hover and open on click.
export default function V3() {
  return (
    <ConceptShell>
      <FilmHeader links={[["#role", "Our role"], ...FAMILIES.map((f) => [`#${f.id}`, f.name.split(" ")[0]]), ["#capabilities", "Partners"]]} />
      <Showroom />
      <div className="relative z-20">
        <EnquirySection video={VIDEO.quarry} />
      </div>
    </ConceptShell>
  );
}
