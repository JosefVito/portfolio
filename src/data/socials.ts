import { profile } from "@/data/profile";
import { socialIcons } from "@/data/social-icons";
import { whatsappHref } from "@/lib/whatsapp";

export type Social = { id: keyof typeof socialIcons; label: string; href: string; path: string; external: boolean };

/** The single source for every social link on the site (footer, hero, phone menu). Order is the display order. */
export function getSocials(): Social[] {
  const s = (id: Social["id"], label: string, href: string, external = true): Social => ({ id, label, href, path: socialIcons[id], external });
  return [
    s("gmail", "Gmail", `mailto:${profile.email}`, false),
    s("github", "GitHub", profile.socials.github),
    s("linkedin", "LinkedIn", profile.socials.linkedin),
    s("instagram", "Instagram", profile.socials.instagram),
    s("facebook", "Facebook", profile.socials.facebook),
    s("whatsapp", "WhatsApp", whatsappHref()),
  ];
}
