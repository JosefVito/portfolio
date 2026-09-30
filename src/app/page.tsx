export default function Home() {
  return (
    <main id="main" className="container-x section pt-40">
      <p className="label text-accent">— Tokens</p>
      <h1 className="display text-[clamp(48px,8vw,112px)] font-bold">
        <span className="text-accent">Josef Vito</span><br />
        <span className="font-semibold">Evangelista</span>
      </h1>
      <p className="display text-outline text-6xl mt-6">Developer</p>
      <p className="text-muted mt-6 max-w-[65ch]">Body copy in Satoshi. Muted grey on near-black at about 5.8:1 contrast.</p>
      <p className="font-mono text-sm mt-4">JetBrains Mono 01 / 06</p>
      <div className="card p-6 mt-8">A card surface.</div>
    </main>
  );
}
