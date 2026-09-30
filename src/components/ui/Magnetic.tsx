"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePointerFine } from "@/lib/use-pointer-fine";

export function Magnetic({ children, strength = 6, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const fine = usePointerFine();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.div className={`inline-block ${className ?? ""}`} style={fine ? { x: sx, y: sy } : undefined} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  );
}
