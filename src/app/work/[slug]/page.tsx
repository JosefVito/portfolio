import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { CaseStudyToc } from "@/components/work/CaseStudyToc";
import { NextProject } from "@/components/work/NextProject";
import { Screenshots } from "@/components/work/Screenshots";
import { getProject, nextProject, projects } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} case study`, description: p.blurb, openGraph: { title: `${p.title} — case study`, description: p.blurb } };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const { default: Body } = await import(`@/content/work/${slug}.mdx`);
  return (
    <main id="main" className="pb-24">
      <CaseStudyHero p={p} total={projects.length} />
      <div className="container-x mt-16 grid gap-12 lg:grid-cols-[200px_1fr]">
        <CaseStudyToc />
        <article className="min-w-0">
          <Body />
          <h2 className="display mt-14 text-[clamp(24px,3vw,36px)] font-bold">Screens</h2>
          <Screenshots items={p.screenshots} />
        </article>
      </div>
      <NextProject p={nextProject(slug)} />
    </main>
  );
}
