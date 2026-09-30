import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { profile } from "@/data/profile";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${profile.firstName} ${profile.lastName}`,
    jobTitle: "Full-Stack Developer",
    url: siteUrl,
    email: `mailto:${profile.email}`,
    sameAs: [profile.socials.linkedin, profile.socials.github],
    address: { "@type": "PostalAddress", addressCountry: "PH" },
    knowsAbout: profile.stack,
  };
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <About />
      <Experience />
      <Work />
      <Services />
      <Contact />
    </main>
  );
}
