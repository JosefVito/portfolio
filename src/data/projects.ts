import type { Project } from "@/data/schemas";

export const projects: Project[] = [
  {
    slug: "k-station",
    n: 1,
    title: "K-Station",
    year: "2026",
    type: "Full-stack",
    blurb: "Three-service commerce, content and booking platform for a K-pop venue in the Netherlands.",
    chips: ["Next.js", "Medusa", "Strapi"],
    role: "Sole engineer",
    timeline: "Jul 2025 → now",
    stack: ["Next.js 16", "TypeScript", "Medusa v2", "Strapi 5", "PostgreSQL", "Redis", "Stripe", "MeiliSearch", "Docker", "Playwright", "GitHub Actions"],
    live: "https://k-station-nine.vercel.app/nl",
    status: "live",
    cover: "/images/work/k-station/cover.jpg",
    screenshots: [
      { src: "/images/work/k-station/shot-1.jpg", alt: "K-Station K-Beauty bestsellers and K-Pop releases" },
      { src: "/images/work/k-station/shot-2.jpg", alt: "K-Station experiences, photo booth and community feed" },
    ],
    summary: "A commerce, content and booking platform built as three services with exclusive ownership: Medusa owns commerce, Strapi owns content, Next.js is the only place they meet.",
  },
  {
    slug: "little-legend",
    n: 2,
    title: "Little Legend",
    year: "2026",
    type: "Product",
    blurb: "Personalised AI storybooks: memory capture, generation pipeline, Medusa checkout.",
    chips: ["Next.js", "Medusa", "AI"],
    role: "Founder & engineer",
    timeline: "2025 → 2026",
    stack: ["Next.js", "TypeScript", "Medusa", "AI story & image generation", "Stripe"],
    live: "https://littlelegend.online",
    status: "live",
    cover: "/images/work/little-legend/cover.jpg",
    screenshots: [
      { src: "/images/work/little-legend/shot-1.jpg", alt: "Little Legend book catalogue" },
      { src: "/images/work/little-legend/shot-2.jpg", alt: "Little Legend book page, ready to personalise" },
    ],
    summary: "An independent product where families turn memories into illustrated storybooks. The generation pipeline produces a book preview in about 30 seconds end to end.",
  },
  {
    slug: "dinecta",
    n: 3,
    title: "Dinecta",
    year: "2026",
    type: "SaaS",
    blurb: "QR ordering, table management and GCash/Maya payments for PH restaurants.",
    chips: ["Next.js", "PostgreSQL", "Payments"],
    role: "Founder & engineer",
    timeline: "2026",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "GCash / Maya", "Vercel"],
    live: "https://www.dinecta.com",
    status: "live",
    cover: "/images/work/dinecta/cover.jpg",
    screenshots: [
      { src: "/images/work/dinecta/shot-1.jpg", alt: "Dinecta problem and solution story" },
      { src: "/images/work/dinecta/shot-2.jpg", alt: "Dinecta features: QR ordering, tables, reservations" },
    ],
    summary: "An all-in-one restaurant platform for the Philippines: QR ordering, table management, reservations, payments and a branded site, built to launch in Siargao.",
  },
  {
    slug: "macdevelop",
    n: 4,
    title: "MacDevelop",
    year: "2026",
    type: "Agency site",
    blurb: "Agency website designed and built solo, from Figma to Next.js + Strapi.",
    chips: ["Next.js", "Strapi", "Motion"],
    role: "Designer & engineer",
    timeline: "Design complete · build in progress",
    stack: ["Next.js", "TypeScript", "Strapi 5", "Motion", "Tailwind CSS"],
    status: "in-progress",
    cover: "/images/work/macdevelop/cover.jpg",
    screenshots: [
      { src: "/images/work/macdevelop/shot-1.jpg", alt: "MacDevelop homepage services section design" },
      { src: "/images/work/macdevelop/shot-2.jpg", alt: "MacDevelop services page design" },
    ],
    summary: "The agency's own website, designed in Figma and being built on the same Next.js + Strapi stack the agency ships for clients.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex(p => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
