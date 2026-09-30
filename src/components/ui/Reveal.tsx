"use client";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";

type Props = { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" | "p" };

export function Reveal({ children, className, delay = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </M>
  );
}
