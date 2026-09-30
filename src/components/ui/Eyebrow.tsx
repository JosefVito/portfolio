export function Eyebrow({ text, n, total = 7, className = "" }: { text: string; n?: number; total?: number; className?: string }) {
  return (
    <p className={`label text-accent ${className}`}>
      <span aria-hidden className="mr-3 inline-block h-px w-6 bg-accent align-middle" />
      {text}{n !== undefined && <span className="text-muted"> · {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>}
    </p>
  );
}
