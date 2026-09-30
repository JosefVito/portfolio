// Downloads Clash Display and Satoshi woff2 from Fontshare's CSS API.
// License: ITF Free Font License (free for personal and commercial use, self-hosting allowed).
import { mkdir, writeFile } from "node:fs/promises";

const css = await fetch("https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700").then(r => r.text());
const blocks = css.split("@font-face").slice(1);
await mkdir("src/fonts", { recursive: true });
for (const b of blocks) {
  const family = /font-family:\s*'?([^;']+)'?;/.exec(b)?.[1]?.replace(/\s/g, "");
  const weight = /font-weight:\s*(\d+)/.exec(b)?.[1];
  const raw = /url\(['"]?([^)'"]+\.woff2)['"]?\)/.exec(b)?.[1];
  if (!family || !weight || !raw) continue;
  const url = raw.startsWith("//") ? `https:${raw}` : raw;
  const name = { 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold" }[weight];
  const buf = Buffer.from(await fetch(url).then(r => r.arrayBuffer()));
  await writeFile(`src/fonts/${family}-${name}.woff2`, buf);
  console.log("saved", `src/fonts/${family}-${name}.woff2`, buf.length);
}
