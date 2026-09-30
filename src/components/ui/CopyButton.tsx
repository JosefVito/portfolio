"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(text); } catch { window.getSelection()?.selectAllChildren(document.body); }
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }
  return (
    <button type="button" onClick={copy} className="label rounded-md border border-line px-2 py-1 text-muted hover:text-fg" aria-live="polite">
      {done ? "Copied" : label}
    </button>
  );
}
