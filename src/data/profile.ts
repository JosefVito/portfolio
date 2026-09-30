import type { Profile } from "@/data/schemas";

export const profile: Profile = {
  firstName: "Josef Vito",
  lastName: "Evangelista",
  title: "Full-Stack",
  titleOutline: "Developer",
  tagline: "Headless commerce · Next.js · Medusa · Strapi",
  intro: "I design and ship production web apps end to end, with the ownership boundaries that keep them correct after launch.",
  availability: "Available for new projects",
  availabilityWindow: "Available · Q4 2026",
  location: "Philippines · Remote · EU hours",
  city: "Siargao, PH · GMT+8",
  timeZone: "Asia/Manila",
  bio: "Full-stack developer focused on headless commerce and content platforms. I ran a cafe and a coworking space before writing software for a Dutch agency, so I build for the messy real world: data integrity, service boundaries, and delivery you can rely on.",
  aboutHeadline: { lead: "Built like an operator, shipped like", accent: "an engineer." },
  stats: [
    { value: 5, suffix: "+", label: "production projects" },
    { value: 3, suffix: "", label: "client projects shipped" },
    { value: 2.5, suffix: "", label: "yrs running businesses" },
  ],
  stack: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Medusa v2", "Strapi 5", "Node.js", "PostgreSQL", "Redis", "Stripe", "Docker", "Playwright", "GitHub Actions"],
  email: "josefvitomangalino@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/josefvitoevangelista/",
    github: "https://github.com/JosefVito",
  },
  whatsappPrefill: "Hi Josef, I found your portfolio and I'd like to talk about a project.",
};
