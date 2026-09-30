import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";
import { getProject, projects } from "@/data/projects";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return new ImageResponse(<OgCard eyebrow={`Case study · ${p?.year ?? ""}`} title={p?.title ?? "Work"} sub={p?.blurb ?? ""} />, size);
}
