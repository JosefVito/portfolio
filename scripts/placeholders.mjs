// Generates labelled dark JPEG placeholders for every image the data files reference.
// Real photos and screenshots replace these files by name. Safe to re-run: skips existing files.
import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import { dirname } from "node:path";

const items = [
  ["public/images/portrait.jpg", 1200, 1600, "Portrait 3:4"],
  ["public/images/about.jpg", 1200, 1200, "About photo"],
  ...["k-station", "little-legend", "dinecta", "macdevelop"].flatMap(s => [
    [`public/images/work/${s}/cover.jpg`, 1600, 1000, `${s} cover`],
    [`public/images/work/${s}/shot-1.jpg`, 1600, 1000, `${s} shot 1`],
    [`public/images/work/${s}/shot-2.jpg`, 1600, 1000, `${s} shot 2`],
  ]),
];

for (const [file, w, h, label] of items) {
  try { await access(file); console.log("exists", file); continue; } catch {}
  await mkdir(dirname(file), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#141416"/>
    <rect x="3%" y="3%" width="94%" height="94%" fill="none" stroke="#2a2a2e" stroke-width="6"/>
    <text x="50%" y="50%" fill="#45F0B4" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(w / 18)}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(file);
  console.log("wrote", file);
}
