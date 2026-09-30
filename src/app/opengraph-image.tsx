import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";
import { profile } from "@/data/profile";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Josef Vito — Full-Stack Developer";

export default function Image() {
  return new ImageResponse(<OgCard eyebrow="Full-stack developer · freelance" title={`${profile.firstName} ${profile.lastName}`} sub={profile.tagline} />, size);
}
