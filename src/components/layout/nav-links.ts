export type NavLink = { href: `#${string}`; label: string };
export const NAV_LINKS: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];
export function hrefFor(link: NavLink, pathname: string): string {
  return pathname === "/" ? link.href : `/${link.href}`;
}
