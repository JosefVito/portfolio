import type { Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  // inherit: true lets a delay passed via the transition prop merge in; without it the variant's transition wins and delay is ignored
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, inherit: true } },
};

export const stagger = (delay = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren } },
});

export const wordReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
