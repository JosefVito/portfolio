import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-x flex min-h-[70svh] flex-col items-start justify-center pt-32">
      <p className="label text-accent">404</p>
      <h1 className="display mt-4 text-[clamp(40px,7vw,96px)] font-bold">Nothing <span className="text-outline">here.</span></h1>
      <p className="mt-6 max-w-[48ch] text-muted">The page moved or never existed. The work is one click away.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink">Back home →</Link>
    </main>
  );
}
