"use client";
import { motion, useReducedMotion } from "motion/react";
import { Fragment } from "react";
import { stagger, viewportOnce, wordReveal } from "@/lib/motion";

type Props = { text: string; className?: string; delay?: number; accentFrom?: number; as?: "h1" | "h2" | "h3" | "p" | "span" };

export function WordReveal({ text, className, delay = 0, accentFrom, as = "span" }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const M = motion[as];
  return (
    <M
      aria-label={text}
      className={className}
      variants={stagger(0.06, delay)}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom" aria-hidden>
            <motion.span
              data-testid="word"
              variants={wordReveal}
              className={`inline-block will-change-transform${accentFrom !== undefined && i >= accentFrom ? " text-accent" : ""}`}
            >
              {w}
            </motion.span>
          </span>
          {/* the space must live outside the inline-block: trailing whitespace inside one is collapsed away */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </M>
  );
}
