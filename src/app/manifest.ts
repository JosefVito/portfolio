import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Josef Vito — Full-Stack Developer", short_name: "Josef Vito", start_url: "/", display: "browser", background_color: "#0a0a0b", theme_color: "#0a0a0b" };
}
