"use client";
import { useEffect, useState } from "react";
import { formatLocalTime } from "@/lib/time";

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const tick = () => setT(formatLocalTime(new Date(), timeZone));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return <span data-testid="local-time" className="tabular-nums">{t}</span>;
}
