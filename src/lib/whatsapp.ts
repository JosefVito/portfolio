import { profile } from "@/data/profile";

export function whatsappUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) throw new Error("NEXT_PUBLIC_WHATSAPP must be 8–15 digits in E.164 form without the plus sign");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Reads the public env at build time; a missing number fails the build on purpose. */
export function whatsappHref(): string {
  return whatsappUrl(process.env.NEXT_PUBLIC_WHATSAPP ?? "", profile.whatsappPrefill);
}
