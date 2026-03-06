import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/morbius",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
