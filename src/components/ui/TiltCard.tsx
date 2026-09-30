"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePointerFine } from "@/lib/use-pointer-fine";

export function TiltCard({ children, max = 6, className }: { children: React.ReactNode; max?: number; className?: string }) {
  const fine = usePointerFine();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() { px.set(0.5); py.set(0.5); }

  return (
    <motion.div
      className={className}
      style={fine ? { rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: "preserve-3d" } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
