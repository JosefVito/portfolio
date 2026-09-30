import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: { formats: ["image/avif", "image/webp"] },
};

const withMDX = createMDX({ options: { rehypePlugins: ["rehype-slug"] } });

export default withMDX(nextConfig);
