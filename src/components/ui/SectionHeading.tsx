import { WordReveal } from "@/components/ui/WordReveal";

export function SectionHeading({ lead, accent, className = "" }: { lead: string; accent: string; className?: string }) {
  const leadWords = lead.split(" ").length;
  return (
    <WordReveal as="h2" text={`${lead} ${accent}`} accentFrom={leadWords} className={`display mt-4 text-[clamp(32px,4.5vw,56px)] font-bold ${className}`} />
  );
}
