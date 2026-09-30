import type { Metadata } from "next";
import "./globals.css";
import { fontClass } from "@/lib/fonts";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Josef Vito — Full-Stack Developer", template: "%s — Josef Vito" },
  description: "Full-stack developer for headless commerce and content platforms. Next.js, Medusa, Strapi. Available for freelance projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClass}>
      <body className="bg-bg text-fg font-body">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">Skip to content</a>
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
