export function Eyebrow({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`label text-accent ${className}`}>
      <span aria-hidden className="mr-3 inline-block h-px w-6 bg-accent align-middle" />
      {text}
    </p>
  );
}
